# Portfolio scan: findings and proposed plan amendments

Date: 2026-10-13 (America/Los_Angeles). **Status: bounded pass complete; recommendations await Cello's review.**

Cello approved all three targets before investigation. Recommendations below are proposals for
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
- After approval, the lead investigated the three targets sequentially using REA 6.4.0's
  controlled browser scenarios, screenshots, DOM and accessibility captures. Two ordinary
  Playwright probes cover popup handling and JavaScript-disabled fallback, separately labeled.
- [Evidence index](research/portfolio-scan/evidence-index.json) records complete Evidence IDs,
  capture hashes, action outcomes and selected screenshot hashes. Raw captures remain outside
  the public repository. No live rebuild checks or implementation changes were performed.

**Verdict:** retain the landscape chapters direction. Strengthen visible access to the calm work
index and protect the existing case-study summary/section links. The references offer useful
navigation and presentation patterns, but none establishes this rebuild's hiring-task success
or provides a fully verified model for decision-led, layered product case studies.

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

## Findings from the approved targets

### UXfolio: summary before depth, with limited live coverage

Target: [Zalando case study showcase](https://uxfol.io/examples/078a41ef/Zalando-case-study),
selected as the first case-study card encountered in the live showcase (Lucas Barrientos).

**Observed:** the showcase exposes title, author/role, a short narrative/impact summary and a
clear next action before a long case-study image. That hierarchy survives the narrow viewport.
See [desktop](research/portfolio-scan/uxfolio-summary-desktop.png) and
[phone-width](research/portfolio-scan/uxfolio-summary-phone.png).

**Inference for cello.dev:** provide enough supported context to judge relevance before asking
for long reading. Preserve actual text summaries and section links rather than imitating a
long screenshot as the reading surface.

**Unknown:** the showcase's next action opened an empty preview in this environment. REA
recorded the popup but not a destination URL; an ordinary Playwright probe found an empty URL,
placeholder title and blank body. A URL inferred from a thumbnail filename was also tried;
it returned an unpublished placeholder and is excluded from conclusions about the live project.
Full case-study navigation, detail structure and impact claims remain unverified. No login or
trial was used, and no replacement case was added to this bounded pass.

Evidence: **U1/U2** below. Vendor curation is not independent proof of hiring effectiveness.

### Dennis Snellenberg: expressive arrival, explicit work route and credits

Targets: [home](https://www.dennissnellenberg.com/), [Work](https://www.dennissnellenberg.com/work),
[TWICE](https://www.dennissnellenberg.com/work/twice).

**Observed:** desktop offers Work in the hero navigation, leading to a compact work index;
TWICE opens with services, collaborator credit and year before project imagery. Narrow screens
use Menu → Work and image cards; the sampled project retains its credits. See
[home](research/portfolio-scan/dennis-home-desktop.png),
[index](research/portfolio-scan/dennis-work-desktop.png) and
[project at phone width](research/portfolio-scan/dennis-case-phone.png).

An early screenshot still showed the greeting overlay although the accessibility tree already
contained the work links. The desktop scripted Home → Work → TWICE sequence completed in
13.205 seconds including fixed waits/captures; that is neither a human findability result nor
a precise measure of visible readiness. The first narrow-screen project click targeted a hidden
desktop variant and timed out; a subsequent role-based selector opened the visible project.

**Inference:** borrow explicit index access and honest credits. Preserve cello.dev's first-paint
words and richer problem/decision/status summaries. This sample is principally a visual/service
showcase; it does not establish a layered product-case-study model.

Evidence: **D1/D2**, with partial records described below.

### Pablo Stanley: a compelling world plus a separate calm list

Targets: [world](https://world.pablostanley.com/), [Work](https://world.pablostanley.com/work),
[About](https://world.pablostanley.com/about).

**Observed:** the entry is a cohesive illustrated world. Its menu offers named destination jumps.
The semantic Work link appears in the accessibility capture but is not visible in the captured
entry/menu. Direct `/work` exposes compact project/date/description rows. In a separate
JavaScript-disabled probe, home visibly offered Work/About and Work opened successfully. See
[world](research/portfolio-scan/pablo-world-phone.png),
[calm list](research/portfolio-scan/pablo-work-phone.png) and
[no-JavaScript entry](research/portfolio-scan/pablo-nojs-home.png).

**Inference:** a rich world and a direct reading route can coexist; make the latter visibly
available with JavaScript enabled too. Borrow the world's visual coherence, while retaining
cello.dev's product-decision depth. The sampled list leads outward; external products were not
investigated. A jump to Efecto moved the scene, but the subsequent E-key probe exposed no case
study; deeper in-world detail remains unresolved.

**Cello's response:** “pablo's site is very cool...” This records attraction to the reference;
which qualities to carry into the landscape direction remains an open design question.

Evidence: **P1–P3**, plus the separately labeled no-JavaScript probe.

## Evidence and method

REA `capture-browser-scenario` is an active, explicitly scripted browser operation in the installed
6.4.0 CLI. It performed the declared navigation/actions here; this is not a claim that passive REA
observation clicked anything. No static bundle reconstruction or source-map analysis was needed.

Each target was investigated on its own, one owned browser process at a time. Viewports were
1440 × 900 and 390 × 844, Chromium 155.0.8059.40, scale 1, light preference; investigation runs
used normal motion. The initial UXfolio discovery used reduced motion. Narrow-width captures
are responsive-layout observations, **not real iPhone, touch, Safari or reduced-motion verification**.
No throttled performance benchmark, human test or complete accessibility audit was performed.

| Ref | Raw capture filename | Successful REA Evidence ID | Coverage |
| --- | --- | --- | --- |
| U1 | `uxfolio-select.evidence.json` | `ev_6bd19dedfd05e00d9dd3a34e295c1087bf28371cc49471c1624bccb48c376ca5` | Showcase card click → Zalando summary, desktop. |
| U2 | `uxfolio-showcase-phone.evidence.json` | `ev_861c8212385c7658c31dff44270a9dd25a63413407644d9b67fe67619b36a545` | Zalando showcase summary at narrow width. |
| D1 | `dennis-flow.evidence.json` | `ev_8a1e067bb2bb2d79d4cdbd5180ec6abdc03d98f482c67c33c0cee038f5f65e98` | Home → Work → TWICE, desktop. |
| D2 | `dennis-phone-case.evidence.json` | `ev_66883e6559d10c996423497fe969f7a95fe38a7e1526a57ea2380fc1fe68af5c` | Work → visible TWICE link → project, narrow width. |
| P1 | `pablo-flow.evidence.json` | `ev_5586beed98eadfab0478dea96e681144552e054830b61fdbaf0daba18566b96a` | World menu and directly loaded Work, desktop. |
| P2 | `pablo-phone.evidence.json` | `ev_dfe126488b7bcd252fce95b063c77b69c84193fb97a8ec3300262a5f384d96fd` | World/menu and directly loaded Work/About, narrow width. |
| P3 | `pablo-project.evidence.json` | `ev_c11fdbabe765de07b3e842557c51abdf32abfebcb297762a5abc9f62d7a14892` | Destination jump and bounded E-key probe; no case study exposed. |

The [index](research/portfolio-scan/evidence-index.json) includes discovery, excluded URL probes,
partial failures and ordinary Playwright results, preserving their distinct status. REA's
“complete” capture status describes requested artifacts, not full-site coverage or proof of usability.
No site version digest was established; these are runtime snapshots of the recorded URLs.

Two Dennis captures returned `cleanup_incomplete` after their observations. Their partial results
were preserved, not relabeled as successful Evidence: the desktop direct TWICE capture and the
narrow Home → Menu → Work capture (whose project selector timed out). Host inspection subsequently
found no remaining REA-owned Chrome processes or temporary profiles. Their screenshots support only
the visible states recorded, not a passing cleanup receipt. The later narrow Work → TWICE scenario
completed successfully. Other successful REA runs reported termination of their owned process;
ordinary Playwright probes closed their browsers in `finally`.

Disclosure search was bounded to the captured text, summaries and About surface. No sampled
reference established an explicit account of AI's role in creating the portfolio itself.
Mentioning AI products does not establish portfolio authorship. This is an unresolved reference
question, not a claim that these sites lack disclosure everywhere. The proposed cello.dev
attribution remains grounded in its own Q8/Q16–19 and existing project disclosures.

## Proposed amendments, ready for review

These are recommendations **only**. GRILL and PLAN were not edited.

| Proposal | Exact decision / chapter | Concrete change to review | Basis |
| --- | --- | --- | --- |
| **R1. Make the fast route visible.** | Q24/Q27/Q36/Q42; C0/C1/C3 | Work in the constant bar opens `/projects`. Put a visible, ordinary link to that index in the arrival surface at phone and desktop sizes. Reconcile rail stops with Q34's final home and expose recognizable project names without hover. Do not require exploration to discover the route. | D1/D2 demonstrate index access; P1/P2 show that having a calm route does not ensure its visual discoverability. |
| **R2. Protect the existing skim layer.** | Q28/Q30; C2 | Explicitly retain `CaseMeta(summary)` and the heading links after the cover and before optional galleries/prose; provide a visible cover link to that summary. Reuse the current Problem/Role/Key decision/Shipped/Tools facts. Preserve beta/personal-use limits. Do not add a second synopsis model. | Current committed template/content; U1/U2 supply limited evidence for short context before depth; sampled references do not replace existing product thinking. |
| **R3. Restore outcome/status to chapter guidance.** | Q4 versus Q28; C0/C1 | Decide whether the existing one-liner contains a supported result/status, or whether a separate short line is necessary. Update the spec explicitly; source every claim from current content or Cello. | The internal Q4 → Q28 omission, not a new claim inferred from another person's work. |
| **R4. Give the rebuild a truthful credit.** | Q8/Q16–19/Q35; C3 | A short discoverable credit links to About/How I Build: Cello directs/reviews; agents implement; scene art uses AI treatment and layer work. Cello approves the final words and factual split. Preserve project-specific credits already present. | Cello's documented process; D1's collaborator credit supplies a presentation analogy, not an AI-disclosure template. |
| **R5. Test the task and the readiness.** | Q23–24/Q29/Q37/Q39; C5 | Add cold phone/desktop probes: choose and open relevant work within a proposed 30-second target; locate role/problem/decision/status in a short scan; use section links to evidence; return to the same chapter. Record hesitation and measure when the words/artifact become usable, separately from URL changes. Repeat the fast path under still/fallback settings. | D1's overlay versus populated DOM; the reference's time pressure; no site scan here substitutes for testing cello.dev. |

The strongest visual idea to explore is a coherent sense of place: scenery, foreground details
and transitions that feel part of one authored world. The approved landscapes can carry that
quality through their chapter thresholds and reading surfaces. Preserve the window/landscape
concept and existing native-scroll, first-paint, keyboard, contrast, privacy and URL requirements;
any interaction changes belong in Cello's review of the direction.

## Open questions for Cello

1. Should **Work always open the calm index**, with an arrival link such as “All case studies”
   visible alongside the chapter entry? Recommendation: yes; label uses existing site vocabulary.
2. Should **the existing summary precede optional galleries**, with a cover link to it?
   Recommendation: yes; test its position in the C2 storyboard before implementation.
3. Should chapter pitches explicitly show **outcome/status**? Recommendation: preserve Q4's
   evidence intent, using only supported current content and visible validation limits.
4. Where should the **portfolio rebuild credit** first appear: a compact persistent/footer link,
   or arrival plus fuller About? Recommendation: a discoverable compact credit and full About
   explanation; final wording is Cello's approval.
5. Which quality of Pablo's world matters most to carry forward: the coherent illustrated place,
   named destinations, or exploratory interactions? Recommendation: carry visual coherence into
   the approved landscapes first; interaction changes need a separate decision.

**Follow-up, 2026-10-13:** Cello answered question 5: the illustrated world **and exploring it**;
the site should feel like a discoverable place while keeping work easy to find. Exploration
belongs in the next storyboard. Mechanics remain open. His requested
[quick Efecto REA](RESEARCH-efecto-quick.md) records candidate art workflows and the proposed
one-place/one-project experiment; no plan or application changes were applied.

## Completion and handoff

| Requested question | Result |
| --- | --- |
| Map reference to decisions and rank risks | Answered by one planner, corrected against committed implementation. |
| Approve targets before investigation | All three approved by Cello in chat before REA began. |
| Inspect first screens/navigation | Answered for the sampled desktop/narrow states, with partial records labeled. |
| Inspect case-study depth | Partial: UXfolio's full preview was blank; Dennis provides services/credits/imagery; Pablo's sampled plain route is an index and deeper in-world detail remains unresolved. No fourth target or unbounded investigation added. |
| Find a verified AI-disclosure precedent | Unresolved within these captured surfaces; recommendations use cello.dev's own process record. |
| Deliver specific reviewable plan changes | R1–R5 above; none applied to the plan or code. |

- Branch: `codex/portfolio-scan`; integration base: `b47164125253a6c9fd6b0eefd688ab841242a114`.
- Baseline commit: `f049d7b77e6a2b4066a96e014881fb96fd357c22`; final findings commit is supplied in the chat handoff.
- Owned changes: this research note, supplied reference, public research screenshots and evidence index.
- Checks: source-reference comparison, screenshot inspection, Evidence/step-status checks, capture
  hashes, staged whitespace/privacy checks and preservation of existing worktree state.
- Documentation only: no application build needed or run. No C0–C5 implementation, cutover merge,
  branch push, deploy or publication. Existing dirty files/media/preservation folder retained.
- Cello decides which recommendations amend GRILL/PLAN before any rebuild resumes.
