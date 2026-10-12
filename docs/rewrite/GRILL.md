# cello.dev rewrite: grill log

Exploration thread started 2026-10-12. One question at a time; each records the
recommendation, Cello's answer, and what it settles. **Nothing here is a plan until Cello picks a
direction.** Offhand remarks and sketches stay explorations (see the Daybreak memory
"explorations are not commitments").

Shared with the design-system audit session (`claude/design-system-audit`): its Q2–Q6
(face, light canvas, green in light mode, first-visit theme, blueprint/coral) are asked here
once and recorded for both threads.

## Fixed inputs (facts, not questions)

- Content backup: `/Users/cello_r/Documents/code/astro/cello-dev-content-snapshots/2026-10-12-origin-master-0d4ede0/` (read-only; README there lists the URL contract).
- Must keep: every live URL (or a 301 in `_redirects`), `/cv.json`, the resume PDF pipeline.
- Must prove (AGENTS.md): user needs → problem → experience → buildable prototype; systems
  thinking; communication across roles; technical knowledge that makes design buildable;
  storytelling through case studies, video and writing.
- Through-line (Brain, 2026-10-08): deterministic code does everything it can, the model gets the
  smallest trustworthy job, and human approval sits where the consequences are. It's shown per
  case study, not used as a slogan.
- Positioning label: "Product Designer & Design Engineer — Design Systems & AI Tools".
- Token decisions wait for the audit session's proposal + Cello family layer
  (`docs/design-system/proposal.md` on `claude/design-system-audit`, not written yet).

## Answers inherited from the audit thread (do not re-ask)

Source: `audit.md` §11 on `claude/design-system-audit` @ `c418c5f`.

- **Scope (audit Q1, 2026-10-12):** full staged migration of today's site first. "A rewrite stays
  possible later (its own thread) and would start from the migrated system."
- **Face (audit Q2, 2026-10-12):** Geist Mono; the family-name fix ships as its own visible stage.
- **Light canvas (audit Q3):** Paper 100 `#f3ede2`.
- **Green (audit Q4):** action in both themes; light mode uses new `signal-700 #007a33`; earth is
  grounding/decoration in both.
- **First visit (audit Q5):** follows the system setting. Docs move from "dark-first" to "dark is
  the hero scene; both themes are first-class". Prototypes treat light and dark as equals.
- **Blueprint/coral (audit Q6):** keep blueprint for construction lines and annotations only
  (never text, never action); drop coral.
- Still open there: Q7 family layer (home, contents), Q8 Figma link.

## Explorations noted (not decisions)

- 2026-10-12, Cello in the audit session: "maybe the resume isnt the point of the site anymore
  its more about the projetct, demos, youtube, writing etc". Relayed by that session as IA and
  positioning ground for this thread. Taken up as part of Q4; not acted on until he answers.

## Questions

### Q1. When this thread does its work, given migration first

Recommended: explore now as throwaway prototypes (standalone, outside `src/`), consuming the
audit's token proposal once it exists; the build plan waits for the migration.
**Answer (2026-10-12): explore now, prototypes only.** Prototypes live in
`docs/rewrite/prototypes/`; no `src/` changes in this thread until a direction is picked AND the
migration has shipped.

### Q2. Which identity the rewrite leads with

Fact: the live homepage (changed 2026-10-11 for the Nike Podium application) says "Digital
Designer — Brand & Design Systems"; `cv.json` says "Product Designer & Design Engineer — Design
Systems & AI Tools" (Brain decision 2026-10-08).
Recommended: design systems as the spine; brand, product/AI tools and front-end build as the
three kinds of evidence; per-application tuning stays in cover letters and tailored resumes.
**Answer (2026-10-12): design systems as the spine.** Working concept to test in prototypes:
"one system, carried from brand to build" (exploration, not a decision). This does not change
the live homepage or `cv.json`; that's for whenever a direction ships.

### Q3. References

Offered three lanes: kinetic poster (Saul Bass/Swiss at scale; e.g. Dennis Snellenberg,
Locomotive), design-engineer craft (e.g. Rauno Freiberg, Emil Kowalski, Vercel Geist), system as
interface (e.g. Teenage Engineering, Lynn Fisher's yearly redesigns).
**Answer (2026-10-12): the hybrid.** Kinetic poster at the front door (home + each case study's
opener), design-engineer craft on every reading surface, the system shown through case-study
artifacts rather than as the whole interface. Cello named no further sites; the lanes above
are the reference set until he adds one.

### Q4. What a hiring manager must take away, in what order

`[asked 2026-10-12]`
