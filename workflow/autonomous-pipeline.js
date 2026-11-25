export const meta = {
  name: 'autonomous-pipeline',
  description: 'Implement, test and review a feature across repos, with optional voting panels, rework and escalation.',
  phases: [
    { title: 'Implement' },
    { title: 'Test' },
    { title: 'Review' },
  ],
}

// Launched by the /feature coordinator after Gate 1 (plan approved):
//   Workflow({ scriptPath: "<engine>/workflow/autonomous-pipeline.js", args })
//
// The script has no file access. The agents it starts read and write. The caller parses the
// approved plan.md into args:
//
// args = {
//   change:     "<feature name>",
//   featureDir: "<abs path to features/<change>>",
//   engine:     "<abs path to the engine checkout>",
//   repos:      { "<repo-key>": "<abs repo path>" },
//   templatesDir: "<abs path to the control plane templates/>",   // optional, overrides engine templates
//   panel:      { size, quorum, rework_rounds, security_veto, stages: { implementation, testing, review } },
//   constitution: "<abs path to .agentic/constitution.md>",        // optional
//   agentTypes: { "<agent name>": "<installed agent type>" },     // optional
//   waves: [ [ { id, title, repo, agent, skills: [], acceptance: [], depends_on: [], files: [] } ], ... ],
//   task.agent: senior-software-engineer (default) | api-engineer
// }

const A = (typeof args === 'string' ? JSON.parse(args) : args) || {}

const missing = ['change', 'featureDir', 'engine'].filter((k) => !A[k])
if (missing.length) {
  throw new Error(`autonomous-pipeline: args missing ${missing.join(', ')}. ` +
    `Received keys: [${Object.keys(A).join(', ') || 'none'}]. Pass args as an object, not a string.`)
}
if (!Array.isArray(A.waves) || !A.waves.length || !A.waves.every((w) => Array.isArray(w) && w.length)) {
  throw new Error(`autonomous-pipeline: args.waves must be a non-empty array of non-empty arrays. Received: ${JSON.stringify(A.waves)}`)
}
const REPOS = A.repos || {}
const unknownRepos = [...new Set(A.waves.flat().map((t) => t.repo))].filter((r) => !REPOS[r])
if (unknownRepos.length) {
  throw new Error(`autonomous-pipeline: repos not in args.repos: ${unknownRepos.join(', ')}`)
}

// Waves: unique ids, dependencies only on earlier waves, one ticket per repo per wave.
{
  const waveOf = {}
  A.waves.forEach((wave, w) => wave.forEach((t) => {
    if (!t.id || !t.repo) throw new Error(`autonomous-pipeline: every ticket needs id and repo. Got ${JSON.stringify(t)}`)
    if (waveOf[t.id] !== undefined) throw new Error(`autonomous-pipeline: duplicate ticket id ${t.id}`)
    waveOf[t.id] = w
  }))
  A.waves.forEach((wave, w) => {
    const repos = wave.map((t) => t.repo)
    const dup = repos.find((r, i) => repos.indexOf(r) !== i)
    if (dup) throw new Error(`autonomous-pipeline: wave ${w + 1} has two tickets in repo ${dup}; they would share one worktree`)
    wave.forEach((t) => (t.depends_on || []).forEach((d) => {
      if (waveOf[d] === undefined) throw new Error(`autonomous-pipeline: ${t.id} depends on unknown ticket ${d}`)
      if (waveOf[d] >= w) throw new Error(`autonomous-pipeline: ${t.id} depends on ${d}, which is not in an earlier wave`)
    }))
  })
}

const IMPLEMENTERS = ['senior-software-engineer', 'api-engineer']
const badAgent = A.waves.flat().filter((t) => t.agent && !IMPLEMENTERS.includes(t.agent))
if (badAgent.length) {
  throw new Error(`autonomous-pipeline: unknown agent on ${badAgent.map((t) => `${t.id}=${t.agent}`).join(', ')}. Use one of: ${IMPLEMENTERS.join(', ')}`)
}

const PANEL = Object.assign({ size: 3, quorum: 2, rework_rounds: 2, security_veto: true }, A.panel || {})
const PANEL_ON = { implementation: false, testing: false, review: true }
for (const k of Object.keys(PANEL_ON)) if (PANEL.stages && k in PANEL.stages) PANEL_ON[k] = !!PANEL.stages[k]
// Each stage has 3 lenses, so a panel has at most 3 reviewers.
const PANEL_SIZE = Math.min(PANEL.size, 3)
if (Object.values(PANEL_ON).some(Boolean)) {
  if (!(PANEL_SIZE >= 1) || !(PANEL.quorum >= 1) || PANEL.quorum > PANEL_SIZE || PANEL.quorum < Math.ceil(PANEL_SIZE / 2)) {
    throw new Error(`autonomous-pipeline: panel.quorum ${PANEL.quorum} must be between ceil(size/2) and size (${PANEL_SIZE}, 1 to 3)`)
  }
  if (!Number.isInteger(PANEL.rework_rounds) || PANEL.rework_rounds < 0) {
    throw new Error(`autonomous-pipeline: panel.rework_rounds must be an integer >= 0, got ${PANEL.rework_rounds}`)
  }
}
const TYPES = A.agentTypes || {}
const WAVES = A.waves

// Mirror of the lens table in protocols/verification-panel.md.
const LENSES = {
  implementation: ['correctness', 'test-quality', 'security-conventions'],
  testing: ['fr-coverage', 'edge-independence', 'results-honesty'],
  review: ['traceability', 'impl-vs-design', 'test-signoff'],
}
const PHASE = { implementation: 'Implement', testing: 'Test', review: 'Review' }
const ART = `${A.featureDir}/artifacts`
const constitution = A.constitution ? `Constitution: ${A.constitution} — read the articles that apply to your stage; a violation is a blocking gap.` : 'No constitution.'
const templates = (stageDir) => `Templates: ${A.templatesDir ? `${A.templatesDir}/${stageDir}/ if the file exists there, else ` : ''}${A.engine}/templates/${stageDir}/.`

const VOTE_SCHEMA = {
  type: 'object',
  required: ['reviewer', 'vote', 'blocking', 'notes'],
  additionalProperties: false,
  properties: {
    reviewer: { type: 'string' },
    vote: { enum: ['accept', 'reject'] },
    blocking: {
      type: 'array',
      items: {
        type: 'object',
        required: ['summary', 'why_blocking'],
        properties: {
          id: { type: 'string' },
          summary: { type: 'string' },
          evidence: { type: 'string' },
          why_blocking: { type: 'string' },
        },
      },
    },
    notes: { type: 'array', items: { type: 'string' } },
  },
}

const IMPL_SCHEMA = {
  type: 'object',
  required: ['taskId', 'status', 'summary'],
  properties: {
    taskId: { type: 'string' },
    status: { enum: ['done', 'blocked'] },
    summary: { type: 'string' },
    worktree: { type: 'string' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    notesPath: { type: 'string' },
    blockedReason: { type: 'string' },
  },
}

const QA_SCHEMA = {
  type: 'object',
  required: ['repo', 'status', 'passing', 'failing'],
  properties: {
    repo: { type: 'string' },
    status: { enum: ['done', 'blocked'] },
    testResultsPath: { type: 'string' },
    passing: { type: 'number' },
    failing: { type: 'number' },
    summary: { type: 'string' },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['summary', 'recommendation', 'reportPath'],
  properties: {
    summary: { type: 'string' },
    recommendation: { enum: ['sign-off', 'sign-off-with-conditions', 'rework'] },
    conditions: { type: 'array', items: { type: 'string' } },
    reportPath: { type: 'string' },
  },
}

// ── helpers ──────────────────────────────────────────────────────────────────

const worktreeFor = (repoKey) => `${REPOS[repoKey]}.worktrees/${A.change}`
const typeOf = (name) => TYPES[name]
const opts = (type, label, phaseName, schema) =>
  Object.assign({ label, phase: phaseName }, schema ? { schema } : {}, type ? { agentType: type } : {})

const repoContext = (repoKey) => {
  const wt = worktreeFor(repoKey)
  return `REPO: ${repoKey} (${REPOS[repoKey]})
WORKTREE: work only inside ${wt}. If it does not exist, create it:
  git -C "${REPOS[repoKey]}" worktree add "${wt}" -b "${A.change}" 2>/dev/null || git -C "${REPOS[repoKey]}" worktree add "${wt}" "${A.change}"
Before any change, read ${wt}/CLAUDE.md and ${wt}/AGENTS.md if they exist, list ${wt}/.claude/skills/ and load the skills that match the work. Never touch another repo. Never push.`
}

function implementBrief(task, blocking, round) {
  const rework = blocking && blocking.length
    ? `\nREWORK round ${round}. The panel rejected the previous attempt. Address every blocking item; do not repeat the rejected approach:\n${blocking.map((b, i) => `  ${i + 1}. ${b.summary} — ${b.why_blocking}${b.evidence ? ` [${b.evidence}]` : ''}`).join('\n')}\n`
    : ''
  return `Read and obey ${A.engine}/agents/${task.agent || 'senior-software-engineer'}.md. You implement ONE task of feature "${A.change}" test first.
${constitution}

${repoContext(task.repo)}

TASK ${task.id} — ${task.title}
Extra skills to load: ${(task.skills && task.skills.length) ? task.skills.join(', ') : 'none'}.
Acceptance criteria:
${(task.acceptance || []).map((c) => `  - ${c}`).join('\n') || '  - (see plan.md)'}
Feature folder: ${A.featureDir}. Read the task block in ${ART}/04-planning/plan.md, and only the sections it needs from ${ART}/02-requirements/ and ${ART}/03-design/.
Files expected: ${(task.files || []).join(', ') || '(find them from the design and the code)'}
Write task notes to: ${ART}/05-implementation/${task.id}-notes.md
${rework}
Return: taskId, status (done|blocked), a one-paragraph summary, the worktree path, the files changed, the notes path. If a design gap blocks you, return status=blocked with blockedReason.`
}

function reviewBrief(stage, lens, subject) {
  return `Read and obey ${A.engine}/agents/panel-reviewer.md and ${A.engine}/protocols/verification-panel.md.
You are one panel member. Stage: ${stage}. Lens: ${lens}. Feature: ${A.change}.
${subject}
Inputs to judge against: ${ART}/04-planning/plan.md, and the documents in ${ART}/02-requirements/ and ${ART}/03-design/ if they exist.
Set "reviewer" to "${stage}/${lens}". Return the vote object only.`
}

async function convenePanel(stage, subject, labelBase) {
  if (!PANEL_ON[stage]) return null
  const lenses = LENSES[stage].slice(0, PANEL_SIZE)
  const spawn = (lens, suffix) => agent(reviewBrief(stage, lens, subject),
    opts(typeOf('panel-reviewer'), `verify:${labelBase}:${lens}${suffix}`, PHASE[stage], VOTE_SCHEMA))
  const votes = await parallel(lenses.map((lens) => () => spawn(lens, '')))
  const dead = votes.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
  if (dead.length) {
    const retry = await parallel(dead.map((i) => () => spawn(lenses[i], ':retry')))
    dead.forEach((i, k) => { if (retry[k]) votes[i] = retry[k] })
  }
  return votes.map((v, i) => v && normalise(v, stage, lenses[i])).filter(Boolean)
}

// The script, not the model, names the lens. An accept that lists blocking items counts as a reject.
function normalise(v, stage, lens) {
  const blocking = v.blocking || []
  return { ...v, reviewer: `${stage}/${lens}`, lens, vote: blocking.length ? 'reject' : v.vote, blocking }
}

// Deterministic tally. null votes = panel off for this stage.
function tally(votes) {
  if (votes === null) return { status: 'pass', blocking: [], votes: [], unreviewed: true }
  if (votes.length < PANEL.quorum) return { status: 'needs_human', blocking: [], votes }
  const accepts = votes.filter((v) => v.vote === 'accept').length
  const securityBlock = PANEL.security_veto &&
    votes.some((v) => /security/.test(v.lens) && v.vote === 'reject' && v.blocking.length)
  if (accepts >= PANEL.quorum && !securityBlock) return { status: 'pass', blocking: [], votes }
  return { status: 'rework', blocking: votes.filter((v) => v.vote === 'reject').flatMap((v) => v.blocking), votes }
}

function taskSubject(task, impl) {
  return `Artifact: task ${task.id} — "${task.title}" in repo ${task.repo}.
Code and tests: worktree ${impl.worktree || worktreeFor(task.repo)}. Review the diff (git -C <worktree> diff / log) and the changed files: ${(impl.filesChanged || []).join(', ') || '(inspect the worktree)'}.
Acceptance criteria:
${(task.acceptance || []).map((c) => `  - ${c}`).join('\n') || '  - (see plan.md)'}
Implementer notes: ${impl.notesPath || '(none)'}.`
}

// implement → panel → rework (≤ N) → escalate
async function runTask(task) {
  const history = []
  let round = 0
  const implement = (blocking) => agent(implementBrief(task, blocking, round),
    opts(typeOf(task.agent || 'senior-software-engineer'), `impl:${task.repo}:${task.id}${round ? `:rework${round}` : ''}`, 'Implement', IMPL_SCHEMA))
  let impl = await implement(null)
  while (true) {
    if (!impl) return { task: task.id, repo: task.repo, status: 'NEEDS_HUMAN', reason: 'implementer died', rounds: round, history }
    if (impl.status === 'blocked') return { task: task.id, repo: task.repo, status: 'ESCALATED', reason: impl.blockedReason || 'implementer blocked', rounds: round, history }
    const decision = tally(await convenePanel('implementation', taskSubject(task, impl), `${task.repo}:${task.id}`))
    history.push({ round, votes: decision.votes })
    if (decision.status === 'pass') return { task: task.id, repo: task.repo, status: 'passed', unreviewed: !!decision.unreviewed, rounds: round, worktree: impl.worktree, notes: impl.notesPath, history }
    if (decision.status === 'needs_human') return { task: task.id, repo: task.repo, status: 'NEEDS_HUMAN', reason: 'panel could not reach quorum', rounds: round, history }
    if (round >= PANEL.rework_rounds) return { task: task.id, repo: task.repo, status: 'ESCALATED', reason: 'rework rounds exhausted', unresolved: decision.blocking, rounds: round, history }
    round++
    log(`rework ${round}/${PANEL.rework_rounds} for ${task.id} (${decision.blocking.length} blocking)`)
    impl = await implement(decision.blocking)
  }
}

// ── run ──────────────────────────────────────────────────────────────────────

phase('Implement')
log(`${WAVES.length} wave(s); panels: ${Object.entries(PANEL_ON).filter(([, on]) => on).map(([s]) => s).join(', ') || 'none'}`)

const implemented = []
const deferred = []
for (let w = 0; w < WAVES.length; w++) {
  const wave = WAVES[w]
  if (budget.total && budget.remaining() < 60_000) {
    wave.forEach((t) => deferred.push(t.id))
    log(`budget low — deferring wave ${w + 1} (${wave.map((t) => t.id).join(', ')})`)
    continue
  }
  // A ticket whose dependency did not pass cannot start.
  const failed = new Set(implemented.filter((r) => r.status !== 'passed').map((r) => r.task).concat(deferred))
  const runnable = wave.filter((t) => !(t.depends_on || []).some((d) => failed.has(d)))
  wave.filter((t) => !runnable.includes(t)).forEach((t) => {
    deferred.push(t.id)
    log(`deferring ${t.id}: a dependency did not pass`)
  })
  log(`wave ${w + 1}/${WAVES.length}: ${runnable.map((t) => `${t.id}(${t.repo})`).join(' · ')}`)
  const results = await parallel(runnable.map((task) => () => runTask(task)))
  results.forEach((r, i) => implemented.push(r ||
    { task: runnable[i].id, repo: runnable[i].repo, status: 'NEEDS_HUMAN', reason: 'ticket run died', rounds: 0, history: [] }))
}

phase('Test')
const repos = [...new Set(WAVES.flat().map((t) => t.repo))]
const blockedRepos = new Set(implemented.filter((r) => r.status !== 'passed').map((r) => r.repo)
  .concat(WAVES.flat().filter((t) => deferred.includes(t.id)).map((t) => t.repo)))
const tested = (await parallel(repos.map((repoKey) => async () => {
  if (blockedRepos.has(repoKey)) return { repo: repoKey, status: 'SKIPPED', summary: 'a ticket in this repo did not pass' }
  const qa = await agent(
    `Read and obey ${A.engine}/agents/qa-engineer.md. Test repo ${repoKey} for feature "${A.change}".
${constitution}

${repoContext(repoKey)}

Feature folder: ${A.featureDir}. Write test-plan.md and test-results.md to ${ART}/06-testing/${repoKey}/. ${templates('06-testing')}
Return: repo, status (done|blocked), passing, failing, testResultsPath, summary.`,
    opts(typeOf('qa-engineer'), `test:${repoKey}`, 'Test', QA_SCHEMA))
  if (!qa) return { repo: repoKey, status: 'NEEDS_HUMAN', summary: 'qa-engineer died' }
  if (qa.status === 'blocked' || typeof qa.failing !== 'number' || qa.failing > 0) return { repo: repoKey, status: 'FAILED', qa }
  const decision = tally(await convenePanel('testing',
    `Artifact: test plan, results and test code for repo ${repoKey}, in worktree ${worktreeFor(repoKey)} and ${ART}/06-testing/${repoKey}/.`, `test:${repoKey}`))
  return { repo: repoKey, status: decision.status === 'pass' ? 'passed' : decision.status.toUpperCase(), unreviewed: !!decision.unreviewed, qa, votes: decision.votes, blocking: decision.blocking }
}))).map((r, i) => r || { repo: repos[i], status: 'NEEDS_HUMAN', summary: 'test run died' })

phase('Review')
const openItems = [
  ...implemented.filter((r) => r.status !== 'passed').map((r) => `${r.task} (${r.repo}): ${r.status} — ${r.reason || ''}`),
  ...deferred.map((id) => `${id}: deferred`),
  ...tested.filter((r) => r.status !== 'passed').map((r) => `tests ${r.repo}: ${r.status}${r.qa ? ` (${r.qa.failing} failing)` : ''}`),
]
const worktreeList = repos.map((k) => `${k}: ${worktreeFor(k)}`).join('; ')
const openList = openItems.length ? '\n' + openItems.map((s) => `  - ${s}`).join('\n') : 'none'
// Stage 07: Phase 1 (structure), security Mode B, Phase 2 (quality + verdict).
const phase1 = await agent(
  `Read and obey ${A.engine}/agents/staff-engineer-reviewer.md. Run PHASE 1 (structural completeness) for feature "${A.change}" across repos ${repos.join(', ')}.
Worktrees (diff each against the merge base with its default branch): ${worktreeList}.
Feature folder: ${A.featureDir}. Start ${ART}/07-review/review-report.md. ${templates('07-review')}
Open items from the build: ${openList}
${constitution}`,
  opts(typeOf('staff-engineer-reviewer'), 'review:phase1', 'Review'))
const security = await agent(
  `Read and obey ${A.engine}/agents/security-reviewer.md in MODE B (implementation) for feature "${A.change}".
Worktrees: ${worktreeList}. Design: ${ART}/03-design/. Write your findings into ${ART}/07-review/security-review.md.
${constitution}
Return a one-paragraph summary and the count of blocking findings.`,
  opts(typeOf('security-reviewer'), 'security:feature', 'Review'))
const report = await agent(
  `Read and obey ${A.engine}/agents/staff-engineer-reviewer.md. Run PHASE 2 (quality assessment and sign-off) for feature "${A.change}".
Worktrees: ${worktreeList}. Feature folder: ${A.featureDir}. Complete ${ART}/07-review/review-report.md.
Phase 1 ${phase1 ? 'is in the report' : 'did not complete — note it as a blocking open item'}. Security review: ${security ? `${ART}/07-review/security-review.md` : 'did not complete — note it as a blocking open item'}.
Open items from the build: ${openList}
${constitution}
Return: summary, recommendation (sign-off | sign-off-with-conditions | rework), conditions, reportPath.`,
  opts(typeOf('staff-engineer-reviewer'), 'review:feature', 'Review', REVIEW_SCHEMA))
const reviewDecision = tally(await convenePanel('review',
  `Artifact: ${ART}/07-review/review-report.md and its traceability table for feature ${A.change}.`, 'review:feature'))
const reviewStatus = !report || !phase1 || !security ? 'NEEDS_HUMAN'
  : report.recommendation === 'rework' ? 'REWORK'
  : reviewDecision.status === 'pass' ? 'passed' : reviewDecision.status.toUpperCase()
const reviewed = { status: reviewStatus, unreviewed: !!reviewDecision.unreviewed, report, votes: reviewDecision.votes, blocking: reviewDecision.blocking }

const escalations = [
  ...implemented.filter((r) => r.status !== 'passed'),
  ...tested.filter((r) => r.status !== 'passed').map((r) => ({ ...r, task: `test:${r.repo}` })),
  ...(reviewed.status !== 'passed' ? [{ task: 'review:feature', status: reviewed.status, blocking: reviewed.blocking }] : []),
]

return {
  change: A.change,
  panel: PANEL,
  gate2_ready: !escalations.length && !deferred.length,
  worktrees: Object.fromEntries(repos.map((k) => [k, worktreeFor(k)])),
  implemented,
  tested,
  reviewed,
  deferred,
  escalations,
}
