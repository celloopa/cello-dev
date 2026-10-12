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

### Q4. Center of gravity, and the resume

Re-asked after Cello's resume remark was relayed. Facts: live demos are ghosted.cello.design and
vegavengers.com; 2 published posts + 2 drafts; no YouTube channel linked anywhere.
Recommended: work first, resume as a utility.
**Answer (2026-10-12): agree.**
- Work is the center. Path: 10s = mark assembling + spine line; 60s = four case-study posters
  (Asheville → Ghosted → VegAvengers → Daybreak, Daybreak labelled personal dogfooding), one
  outcome line + one real artifact each; 5min = one case study in a shared shape (problem →
  constraints → system → decisions → build → where the human approves → outcome).
- Writing and video are one stream ("Log", name open), launching with the 2 published posts; a
  YouTube surface appears only once a channel exists.
- Resume leaves the main nav: menu + footer link, "Resume (PDF)". `/resume`, `/cv.json`, PDF kept.
- Nav ≈ Work · Log · About; contact everywhere.

### Q5. Which signatures carry over

**Answer (2026-10-12): keep all recommendations.**
- Keep + promote: the mark (C-ring, sun, triangle) as the system's generator for hero, frames,
  dividers, diagrams.
- Keep: house curve; thick strokes, offset frames, square corners; texture (quieter, static
  under reduced motion); ⌘K menu (improved; home of resume, PDF, theme); Saul Bass register at
  the front door.
- Keep the big name's scale, retire the typewriter. Retire the marquee. Move the hero photo to
  About.

### Q6. Motion/tech ambition and the performance + accessibility budget

Recommended: native-first (CSS scroll-driven, View Transitions, SVG, no WebGL in v1).
**Answer (2026-10-12): "i want something truly awesome, i would consider blending 2d elements on
threejs. use this as my first three project".** three.js is in; this is Cello's first three.js
project (learning is part of the point).

Budget, amended to keep three.js and the bar together (stated to Cello, not objected to):
- First paint ≤ 30 KB JS; a static SVG of the same composition renders first and is the LCP
  element. three.js (r186 current; core ≈150–180 KB gz, `[measure]`) loads after first paint on
  idle and cross-fades in.
- Stays a still frame under reduced motion, no WebGL, or Save-Data. Canvas `aria-hidden`; every
  word and link is real HTML.
- Pauses offscreen and in hidden tabs; DPR capped at 2; 60 fps on M1, ≥30 fps on a mid phone.
- Unchanged: LCP ≤ 2.0 s mobile, CLS ≤ 0.05, Lighthouse perf ≥ 95 / a11y 100, AA contrast
  (blueprint never text), full keyboard, visible focus (3px offset frame), skip link, the
  family reduced-motion contract (zeroed delays, loops stop, content never waits). Fonts: Geist
  Mono 400 + 700 preloaded, 600/800/900 on demand (agreed with the audit session).
- Native scroll always (no scroll hijack).

Side note, not a plan: the 2026-10-09 inbox capture on MIDI music visuals (Blender → glTF →
three.js) would reuse what this teaches. Left as a capture.

### Q7. Where the 3D lives

Options: A hero only · B one scene behind the whole site · C hero + case-study openers.
Cello said "b and c"; clarified as the merge.
**Answer (2026-10-12): the merge.**
- Homepage = studio wall: scroll moves the camera through one scene, from the mark assembling to
  the four case-study posters as 2D cut-outs and artifacts in depth, with real HTML text on top.
- Case studies: clicking a poster flies into that project's scene, which settles into a still
  header as reading begins; the page body is quiet DOM.
- Log, About, resume: no 3D (static texture only).
- Prototypes vary the treatment of this one structure (lighting, flat vs deep, paper vs ink),
  not the structure.

### Q8. Who writes the three.js code

Options: A agent builds all (annotated code) · B Cello writes, agent tutors · C split by phase.
**Answer (2026-10-12): A.** The agent builds all of it; the code is annotated so Cello can read
it. Post framing shifts from "my first three.js project" to "how I directed a rebuild".

### Q9. Which treatments to prototype

Offered: Cut paper, Construction, Stage light. Cello kept the first two and asked for a new third
direction instead of Stage light.
**Answer (2026-10-12): build Cut paper, Construction and Print run (risograph in 3D).**
Brief added with the go: "keep it prudent yet impressive and allow mobile to work well too.
we're trying to make a good impression and get hired."

Shared understanding reached; prototypes are being built in `docs/rewrite/prototypes/`.

### Reference added during the build (2026-10-12)

Cello: "i like how kaptain kristian on yt transitions between info, text, imagery and scene."
Applied to all three prototypes as a shared transition grammar (match cuts: one element carries
from one shot into the next), not as a fourth direction:
- hero → work: the mark's sun leaves the mark and becomes poster 01's reveal circle;
- poster → poster: each poster arrives through that circle and hands off in depth;
- poster → case study: View Transitions morph title and art; Asheville's one image fans out into
  three brand planes ("one system, three brands").

### Feedback after the first look (2026-10-12)

Cello, having seen Cut paper's hero: "What makes three sites good and how can we apply the needs
of my site to the things three is good at doing, at an awwward level. I don't love the current
look would love one new fresh pass."
- Answer given: the best three.js sites make the 3D the idea (remove it and the concept is gone),
  use what only the GPU does well (many particles, image pixels that dissolve and re-form,
  light/material, the cursor as a force), keep one continuous world (no hard cuts), and hide the
  craft (60 fps, seamless DOM/GL, crisp text).
- Fresh pass: **"Tokens"**. The mark is built from thousands of square particles (tokens) that
  assemble, react to the cursor, then stream into each case study's image and rebuild it pixel by
  pixel, handing off to the crisp image once settled; Asheville splits into three brands. One
  draw call; ~12k particles desktop, ~6k phone.
- Cut paper's hero is built but parked; Construction and Print run are on hold (not built)
  until Cello sees Tokens.

### Inputs relayed from the audit session (2026-10-12, not decisions)

From Cello's Figma cleanup (files in Harmonic Convergence › "Triage — from Marcelo (2026-10-12)"
on cello@cello.design; links to come):
- Showcase/evolution material: **Cello.Design** (direct ancestor of today's identity: dark-green
  forest hero, a "dark mountain" color style, full type ramp, components; contains personal
  photos, keep those out of public work), **Vegavengers** (brand origin), **PlanIT** (early UX
  process).
- Revisit: **Pan** (accessible AI navigator) and the **Metroid Prime 2 UI Remaster**, possible
  Lab or visuals pieces.
- Held, not started: hunting down his photography and selectively reviewing his two YouTube
  channels, "trying to learn from all my work to try again with a new perspective". (Record in
  cello-brain projects/cello-dev-portfolio.md.)
Relevance here: an "evolution" thread for the About page and a future visuals section; nothing to
build until he asks.

### Q10. The PDX apartment idea: what the apartment's job is (2026-10-12)

Cello: "it would be cool if rather than the logo the scene and the microanimations and
interactions happened on the setting that is pdx. my portland apartment with a (fictional view)
of some landmarks and mt hood that animate in the background and are like a tour".
Options: A stage for the tour · B opening scene only · C fully explorable apartment.
**Answer: A.** Desk by the window at daybreak; a fictional, layered Portland out the window
(river, bridges, skyline, Mt Hood constant); scroll is the tour (camera drifts, landmarks come
alive, sky dawn → day → dusk → night across the four case studies); each case study appears on
the desk monitor with crisp HTML beside it; case-study pages open on the room, then quiet
reading. Open: whether Tokens folds in (e.g. the monitor image builds from tokens) or the room
replaces it.

Context Cello asked me to read: channel brief (`cello-dev-vault:Reference/channel-brief.md`,
LOCKED 2026-07-26): "Portland and the PNW are a character … location-marked"; the location card
is a kit primitive; motion identity is "a portfolio project on its own track … grafts onto the
channel around E6"; income and job-application specifics stay off camera. Observation only (not
promoted): the site's Portland world could become the shared world of site and channel.
Guardrails from the 2026-07-26 reset: this is close to The World (parked; Phase 0 was a
"Studio/Desk room parallax test"). The site never waits on the channel or vice versa; no video
pipeline gets built around it; none of The World's removed premises come back.

### Q11. How the apartment and Portland are drawn (2026-10-12)

Options: A WPA-poster layers in real depth · B low-poly Blender 3D · C painted/generated layers.
**Answer: "YESSSS 1" → A.** Flat color layers (1930s national-park poster × Saul Bass) placed in
real depth; three.js gives parallax and camera; time of day is a palette change (the same poster
reprinted in dawn/noon/dusk/night inks; window light moves across the desk; city windows and the
White Stag sign light at night). Built in code from shapes; no 3D modeling.
Cello: "i have some pictures that we could try to recreate as the background scenes." Pending:
the pictures, and Q12 (literal view vs composed view).
