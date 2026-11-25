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
//   panel:      { size, quorum, rework_rounds, security_veto, stages: { implement, test, review } },
//   agentTypes: { implementer, qaEngineer, reviewer, panelReviewer },   // optional
//   waves: [ [ { id, title, repo, acceptance: [], depends_on: [], files: [] } ], ... ],
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

const PANEL = Object.assign({ size: 3, quorum: 2, rework_rounds: 2, security_veto: true }, A.panel || {})
const PANEL_ON = Object.assign({ implement: false, test: false, review: true }, PANEL.stages || {})
// Each stage has 3 lenses, so a panel has at most 3 reviewers.
const PANEL_SIZE = Math.min(PANEL.size, 3)
if (PANEL.quorum > PANEL_SIZE || PANEL.quorum < Math.ceil(PANEL_SIZE / 2)) {
  throw new Error(`autonomous-pipeline: panel.quorum ${PANEL.quorum} must be between ceil(size/2) and size (${PANEL_SIZE}, max 3)`)
}
const TYPES = A.agentTypes || {}
const WAVES = A.waves

const LENSES = {
  implement: ['correctness', 'test-quality', 'security-conventions'],
  test: ['coverage', 'edge-cases', 'results-honesty'],
  review: ['traceability', 'impl-vs-design', 'test-signoff'],
}
const PHASE = { implement: 'Implement', test: 'Test', review: 'Review' }

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
  required: ['repo', 'status'],
  properties: {
    repo: { type: 'string' },
    status: { enum: ['done', 'blocked'] },
    testResultsPath: { type: 'string' },
    passing: { type: 'number' },
    failing: { type: 'number' },
    summary: { type: 'string' },
  },
}

// ── helpers ──────────────────────────────────────────────────────────────────

const worktreeFor = (repoKey) => `${REPOS[repoKey]}.worktrees/${A.change}`
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
  return `Read and obey ${A.engine}/agents/implementer.md. You implement ONE ticket of feature "${A.change}".

${repoContext(task.repo)}

TICKET ${task.id} — ${task.title}
Acceptance criteria:
${(task.acceptance || []).map((c) => `  - ${c}`).join('\n') || '  - (see plan.md)'}
Feature folder: ${A.featureDir} (plan.md; spec.md and design.md if they exist — read only the sections this ticket needs).
Files expected: ${(task.files || []).join(', ') || '(find them from the design and the code)'}
Write ticket notes to: ${A.featureDir}/notes/${task.id}.md
${rework}
Return: taskId, status (done|blocked), a one-paragraph summary, the worktree path, the files changed, the notes path. If a design gap blocks you, return status=blocked with blockedReason.`
}

function reviewBrief(stage, lens, subject) {
  return `Read and obey ${A.engine}/agents/panel-reviewer.md and ${A.engine}/protocols/verification-panel.md.
You are one panel member. Stage: ${stage}. Lens: ${lens}. Feature: ${A.change}.
${subject}
Inputs to judge against: ${A.featureDir}/plan.md, and ${A.featureDir}/spec.md and design.md if they exist.
Set "reviewer" to "${stage}/${lens}". Return the vote object only.`
}

async function convenePanel(stage, subject, labelBase) {
  if (!PANEL_ON[stage]) return null
  const lenses = LENSES[stage].slice(0, PANEL_SIZE)
  const spawn = (lens, suffix) => agent(reviewBrief(stage, lens, subject),
    opts(TYPES.panelReviewer, `verify:${labelBase}:${lens}${suffix}`, PHASE[stage], VOTE_SCHEMA))
  const votes = await parallel(lenses.map((lens) => () => spawn(lens, '')))
  const dead = votes.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
  if (dead.length) {
    const retry = await parallel(dead.map((i) => () => spawn(lenses[i], ':retry')))
    dead.forEach((i, k) => { if (retry[k]) votes[i] = retry[k] })
  }
  return votes.filter(Boolean)
}

// Deterministic tally. null votes = panel off for this stage.
function tally(votes) {
  if (votes === null) return { status: 'pass', blocking: [], votes: [], unreviewed: true }
  if (votes.length < PANEL.quorum) return { status: 'needs_human', blocking: [], votes }
  const accepts = votes.filter((v) => v.vote === 'accept').length
  const securityBlock = PANEL.security_veto &&
    votes.some((v) => /security/.test(v.reviewer) && v.vote === 'reject' && (v.blocking || []).length)
  if (accepts >= PANEL.quorum && !securityBlock) return { status: 'pass', blocking: [], votes }
  return { status: 'rework', blocking: votes.filter((v) => v.vote === 'reject').flatMap((v) => v.blocking || []), votes }
}

function taskSubject(task, impl) {
  return `Artifact: ticket ${task.id} — "${task.title}" in repo ${task.repo}.
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
    opts(TYPES.implementer, `impl:${task.repo}:${task.id}${round ? `:rework${round}` : ''}`, 'Implement', IMPL_SCHEMA))
  let impl = await implement(null)
  while (true) {
    if (!impl) return { task: task.id, repo: task.repo, status: 'NEEDS_HUMAN', reason: 'implementer died', rounds: round, history }
    if (impl.status === 'blocked') return { task: task.id, repo: task.repo, status: 'ESCALATED', reason: impl.blockedReason || 'implementer blocked', rounds: round, history }
    const decision = tally(await convenePanel('implement', taskSubject(task, impl), `${task.repo}:${task.id}`))
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
  results.filter(Boolean).forEach((r) => implemented.push(r))
}

phase('Test')
const repos = [...new Set(WAVES.flat().map((t) => t.repo))]
const blockedRepos = new Set(implemented.filter((r) => r.status !== 'passed').map((r) => r.repo)
  .concat(WAVES.flat().filter((t) => deferred.includes(t.id)).map((t) => t.repo)))
const tested = (await parallel(repos.map((repoKey) => async () => {
  if (blockedRepos.has(repoKey)) return { repo: repoKey, status: 'SKIPPED', summary: 'a ticket in this repo did not pass' }
  const qa = await agent(
    `Read and obey ${A.engine}/agents/qa-engineer.md. Test repo ${repoKey} for feature "${A.change}".

${repoContext(repoKey)}

Feature folder: ${A.featureDir}. Write the test plan and results to ${A.featureDir}/testing/${repoKey}/.
Return: repo, status (done|blocked), passing, failing, testResultsPath, summary.`,
    opts(TYPES.qaEngineer, `test:${repoKey}`, 'Test', QA_SCHEMA))
  if (!qa) return { repo: repoKey, status: 'NEEDS_HUMAN', summary: 'qa-engineer died' }
  if (qa.status === 'blocked' || qa.failing > 0) return { repo: repoKey, status: 'FAILED', qa }
  const decision = tally(await convenePanel('test',
    `Artifact: test plan, results and test code for repo ${repoKey}, in worktree ${worktreeFor(repoKey)} and ${A.featureDir}/testing/${repoKey}/.`, `test:${repoKey}`))
  return { repo: repoKey, status: decision.status === 'pass' ? 'passed' : decision.status.toUpperCase(), unreviewed: !!decision.unreviewed, qa, votes: decision.votes, blocking: decision.blocking }
}))).filter(Boolean)

phase('Review')
const report = await agent(
  `Read and obey ${A.engine}/agents/reviewer.md. Review feature "${A.change}" across repos ${repos.join(', ')}.
Worktrees: ${repos.map((k) => `${k}: ${worktreeFor(k)}`).join('; ')}.
Feature folder: ${A.featureDir}. Write ${A.featureDir}/review/review-report.md.
Return a one-paragraph summary and the recommendation.`,
  opts(TYPES.reviewer, 'review:feature', 'Review'))
const reviewDecision = tally(await convenePanel('review',
  `Artifact: ${A.featureDir}/review/review-report.md and its traceability table for feature ${A.change}.`, 'review:feature'))
const reviewed = { status: report ? (reviewDecision.status === 'pass' ? 'passed' : reviewDecision.status.toUpperCase()) : 'NEEDS_HUMAN', unreviewed: !!reviewDecision.unreviewed, report, votes: reviewDecision.votes, blocking: reviewDecision.blocking }

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
