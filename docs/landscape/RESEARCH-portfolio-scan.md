# Portfolio scan: planning baseline and investigation proposal

Date: 2026-10-13. **Status: awaiting Cello's target-list approval; REA investigations not started.**

This is the checkpoint for one bounded research pass. Recommendations below are proposals for
Cello to review, not amendments to GRILL or PLAN. The chapters build C0–C5 remains unstarted.

## Inputs and evidence boundary

- [Hiring-manager reference](../00-positioning/REFERENCE_UX_PORTFOLIOS_2026.md), supplied by Cello.
- `docs/rewrite/GRILL.md` Q1–Q47 on `claude/rewrite-exploration` at `ff7edc9`.
- [Landscape PLAN](PLAN.md), including C0–C5, at research base
  `b47164125253a6c9fd6b0eefd688ab841242a114` on `claude/landscape-build`.
- Actual committed case-study template, summary component and MDX at that same base:
  `src/pages/projects/[slug].astro`, `src/components/CaseMeta.astro`,
  `src/components/scene/ReadHead.astro`, and the four complete project entries.
- One read-only planner mapped the reference to the decisions. The lead checked the actual
  template/content to distinguish missing specifications from existing implemented behavior.
- Discovery searches of first-party pages were used only to nominate investigation targets.
  No site interactions, runtime measurements, REA Evidence or live rebuild checks yet.

The [UXfolio landing page](https://uxfol.io/state-of-ux-portfolios-2026) was opened; its full
report is email-gated. Percentages in the supplied reference remain attributed to that reference,
not independently verified here. The roughly 30-second rejection point is one respondent's
anecdote, not a population-wide benchmark. Vendor research supports hypotheses, not a verdict
against the landscape direction.

## Decision map

| Pressure | Already answered | Remaining risk | Proposed review location |
| --- | --- | --- | --- |
| Reach relevant work quickly | Q23 prioritizes hiring managers and phones; Q24 puts words at first paint and peeks the first chapter; Q25–27 allow skipping; Q36 provides a calm index. C0/C1/C3 implement these; C5 checks performance and access mechanics. | Fast loading does not prove a person can recognize and open relevant work. Q4's 60-second four-project path has no timed findability check. A landscape peek may not identify a project. | Q24–27/Q36/Q42; C1/C3/C5. |
| Clear navigation | Q27 semantic rail, Q29 Back restoration, Q33 All work/onward links, Q35 About, Q36 indexes, Q42 constant top bar. C0/C2/C3/C5 cover mechanics. | Work's destination needs to be explicit. Phone rail labels/discoverability need testing. Q27 retains an older stop list including How I Build/About, superseded by Q34–35's final home structure. | Q27/Q34–36/Q42; C0/C1/C3/C5. |
| Scan first, depth when wanted | Q4 defines the narrative and an outcome line; Q28 defines chapter role/pitch/artifact/action; Q30–31 settle reading; Q36 defines compact indexes. The existing template already renders summary facts and an h2 table of contents before long prose. | C2 does not explicitly preserve or prioritize that existing skim surface through the new cover. It currently follows the cover and optional media galleries. Q4's outcome line is absent from Q28/C0. | Q28/Q30; C0/C2/C5. |
| Specific AI disclosure | Q8 records agent implementation and Cello directing the rebuild; Q16–19 record image treatment and layer workflow. Ghosted already describes the human/agent division in its summary and “How It Was Built”; other case studies describe AI product behavior. | Project AI behavior is distinct from attribution for the portfolio itself. Q35/C3 do not commit to public disclosure of the rebuild's coding agents and generated scene treatment, or its placement. | Q8/Q16–19/Q35; C3, with C2 where relevant. |

Q42's Writing/Resume top bar supersedes Q4's earlier Log/resume-utility proposal. Research must
use the later decision. The landscape is a window transition; earlier train language is explicitly
withdrawn in GRILL and is not a design premise.

## Actual baseline: preserve existing strengths

All four complete MDX entries already contain `summary` data. For example, Ghosted exposes
Problem, Role, Key decision, Shipped and Tools; its Role text credits coding agents. The template
renders `CaseMeta` and “On this page” links ahead of `Prose`, after `ReadHead`'s cover and any
frontmatter galleries. This is source-code evidence of content/order, not measured screen
visibility or usability.

Therefore the proposal is to **preserve, promote and test the existing summary and section links**,
rather than invent another content model or claim that layering is absent. C2's new full-screen
cover could push this material farther away; investigate that risk before changing the plan.
Ghosted's existing attribution is a useful truthful starting point, not a license to generalize
its authorship split to every project or the portfolio.

## Ranked proposals for Cello's review

1. **Add a findability task (Q24–27/Q36/Q42; C5).** Proposed local acceptance hypothesis:
   from a cold home entry, a visitor identifies and opens a relevant case study within
   30 seconds. Record hesitation, route and whether they can explain the relevance. Check
   phone and desktop, visible navigation and keyboard, and a still/fallback route. This is
   a proposed product test, not a measured result or universal hiring rule. Separately test
   whether the case-study summary communicates role/problem/decision/status in a brief scan.
2. **Protect the case-study skim surface (Q28/Q30; C0/C2).** Carry the existing summary and
   section links into the chapter/reading specification. Test whether role, problem, a key
   decision and supported outcome/status are easy to find before long reading. Reconcile
   Q4's outcome line with Q28/C0's pitch. Use existing supported words; request missing claims
   from Cello rather than creating them. Preserve Daybreak's personal-use validation limit
   and Ghosted's beta status; activity counts are not substitutes for user outcomes.
3. **Commit to portfolio attribution (Q8/Q16–19/Q35; C3).** Decide a discoverable short
   disclosure and a fuller About/How I Build explanation. Distinguish Cello's direction and
   review, agent implementation, and AI treatment of scene art. Describe only work actually
   performed; do not imply conditional manual cutting was completed.
4. **Resolve navigation ambiguity before C0/C1.** Name Work's destination and rail stops,
   reconcile Q27 with Q34, and test phone labels without relying on desktop hover.

No recommendation here changes the approved identity, project order, artwork, copy or URL contract.

## Proposed targets — approval pending

| Target | Why nominate it | Bounded question |
| --- | --- | --- |
| [UXfolio public case-study examples](https://uxfol.io/examples) | A product-design storytelling comparison for the existing summary/TOC. Its public showcase includes case studies. This is the survey vendor, so it is not independent corroboration. | Inspect one public case study, selecting the first accessible case-study example in showcase order. How does its opening expose role/problem/decisions/outcome and offer deeper evidence? No editor account or trial. |
| [Dennis Snellenberg](https://www.dennissnellenberg.com/) | Already in Q3's reference set; first-party discovery identifies selected work. | Inspect home and one project: how does a kinetic front door expose work and what survives on phone/still paths? Do not assume visual craft demonstrates product-case-study depth. |
| [Pablo Stanley's World](https://world.pablostanley.com/) | First-party discovery describes an interactive world with a plain-version route. | Inspect entry, Work and the plain route: can someone bypass exploration and understand the work? Is the fallback discoverable and informative? Do not assume a game-like interaction suits this rebuild. |

These are hypotheses worth testing. No candidate is yet shown to solve the gap or reach work
within 30 seconds. Approval covers this target list before investigation, as required by the
lead-start assignment. Exact selected public case-study URL will be recorded when resolved.

## Approved-pass method (not yet executed)

- One site at a time; one browser session; no concurrent renderers, builds or background swarms.
- Follow the installed REA runtime workflow and actual CLI schemas. Keep observed browser
  behavior, static artifact evidence, inference and unknowns separate. REA is passive;
  browser navigation/timing must not be attributed to REA.
- Per target: first screen, shortest visible work route, one case-study/detail route, reading
  depth and any attribution encountered. Capture desktop/phone first-screen evidence and a
  focused navigation trace. A lead-operated timing probe is not a hiring-manager user test.
- Record the exact URL, capture date, viewport, steps, evidence IDs, coverage limits and
  cleanup. Store raw public captures separately; commit concise synthetic/public findings only.
- Stop after the approved targets. Map each transferable finding back to GRILL questions and
  C0–C5, then hand the exact research commit to review. Cello chooses plan amendments.

## Open questions

1. Approve all three targets, or which two should this bounded pass cover?
2. After evidence: should Work open the calm index, and what labels should phone rail stops show?
3. After evidence: should the existing case-study summary be visible with the cover or immediately
   after it, and should chapter pitches explicitly include an outcome/status?
4. After evidence: where should the portfolio's own AI attribution first appear?

## Handoff state

- Research branch: `codex/portfolio-scan`; base: `b47164125253a6c9fd6b0eefd688ab841242a114`.
- Owned scope: this note and the supplied positioning reference, copied verbatim from the primary checkout.
- Current result: planning baseline and reviewable target proposal only. No REA findings yet.
- No source edits, C0–C5 build, cutover merge, push, deploy or publication performed.
- Existing dirty files, ignored media, preservation folder and all previous worktrees retained.
