export const meta = {
  name: 'panel',
  description: 'Run one verification panel on one artifact and return the deterministic decision.',
  phases: [{ title: 'Panel' }],
}

// Launched by the /feature coordinator, for example on plan.md before Gate 1:
//   Workflow({ scriptPath: "<engine>/workflow/panel.js", args })
//
// args = {
//   engine:     "<abs path to the engine checkout>",
//   change:     "<feature name>",
//   stage:      "plan",
//   lenses:     ["traceability", "waves", "granularity"],
//   subject:    "<what to review: paths and what it must match>",
//   panel:      { size, quorum, security_veto },
//   agentType:  "<installed panel-reviewer type>",   // optional
// }

const A = (typeof args === 'string' ? JSON.parse(args) : args) || {}
const missing = ['engine', 'change', 'stage', 'subject'].filter((k) => !A[k])
if (missing.length) throw new Error(`panel: args missing ${missing.join(', ')}`)
if (!Array.isArray(A.lenses) || !A.lenses.length) throw new Error('panel: args.lenses must be a non-empty array')

const P = Object.assign({ size: 3, quorum: 2, security_veto: true }, A.panel || {})
const lenses = A.lenses.slice(0, P.size)
if (!(P.quorum >= 1) || P.quorum > lenses.length || P.quorum < Math.ceil(lenses.length / 2)) {
  throw new Error(`panel: quorum ${P.quorum} must be between ceil(${lenses.length}/2) and ${lenses.length}`)
}

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
        properties: { id: { type: 'string' }, summary: { type: 'string' }, evidence: { type: 'string' }, why_blocking: { type: 'string' } },
      },
    },
    notes: { type: 'array', items: { type: 'string' } },
  },
}

const brief = (lens) => `Read and obey ${A.engine}/agents/panel-reviewer.md and ${A.engine}/protocols/verification-panel.md.
You are one panel member. Stage: ${A.stage}. Lens: ${lens}. Feature: ${A.change}.
${A.subject}
Set "reviewer" to "${A.stage}/${lens}". Return the vote object only.`
const spawn = (lens, suffix) => agent(brief(lens),
  Object.assign({ label: `verify:${A.stage}:${lens}${suffix}`, phase: 'Panel', schema: VOTE_SCHEMA }, A.agentType ? { agentType: A.agentType } : {}))

phase('Panel')
const votes = await parallel(lenses.map((lens) => () => spawn(lens, '')))
const dead = votes.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
if (dead.length) {
  const retry = await parallel(dead.map((i) => () => spawn(lenses[i], ':retry')))
  dead.forEach((i, k) => { if (retry[k]) votes[i] = retry[k] })
}
// The script, not the model, names the lens. An accept that lists blocking items counts as a reject.
const valid = votes.map((v, i) => v && { ...v, reviewer: `${A.stage}/${lenses[i]}`, lens: lenses[i], blocking: v.blocking || [], vote: (v.blocking || []).length ? 'reject' : v.vote }).filter(Boolean)
const accepts = valid.filter((v) => v.vote === 'accept').length
const securityBlock = P.security_veto && valid.some((v) => /security/.test(v.lens) && v.vote === 'reject' && v.blocking.length)
const status = valid.length < P.quorum ? 'needs_human'
  : accepts >= P.quorum && !securityBlock ? 'pass'
  : 'rework'

return {
  stage: A.stage,
  status,
  votes: valid,
  blocking: valid.filter((v) => v.vote === 'reject').flatMap((v) => v.blocking),
  notes: valid.flatMap((v) => v.notes || []),
}
