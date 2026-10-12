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

### Q12. Real view or composed (2026-10-12)

**Answer: composed** (real landmarks from Cello's photos, rearranged into a view no single window
has). Brief, in Cello's words: "it should feel like me taking you on a journey through my
favorite places and the work ive created while being inspired".

### Q13. How each place relates to the work beside it (2026-10-12)

Options: 1 literal only where true · 2 mood pairings.
**Answer: 2, mood pairings.** Mood lines are Cello's to write (house rule from the channel brief:
agents never write the take); drafts carry `[Cello's words]` placeholders, never invented
claims about where work was made.
Structure refinement from Cello: "keep elements in the screen persistently like as if the view
was behind the window and parts of the work and flow of the story of the site are in front and
below. the window will be like a train window showing the places."
→ The desk and window frame stay fixed (foreground). Scroll moves the "train": places pass
outside with train-window parallax (near layers fast, far slow, Mt Hood slowest). Work and story
live in front of and below the window. This replaces "step through the window".
Photos incoming: the desk window and the landscapes. Metadata handling: see below.

Photo handling rule (agreed in this thread): GPS/EXIF from originals on disk is read only to
name a place; coordinates are never written to the repo, Brain or the site; the home/desk photo's
location is not read at all; photos stay out of the repo (only traced shapes are committed).

### Photos read (2026-10-12)

11 iPhone 16 photos in `~/Documents/code/astro/cello-dev-places-2026-10-12/` (private, outside the
repo). Desk: IMG_2001 (location not read). Landscapes, by date: Jun 14 Mt Hood Meadows (×2) · Jun 26
waterfall SE of Cottage Grove (Moon or Spirit Falls, [verify]) · Jul 5 Ecola State Park · Aug 22 ridge
above the Salmon River ([verify]) · Aug 29 Ramona Falls · Sep 7 over Mt Hood from a plane · Sep 20
near Bald Mountain/Top Spur ([verify]) · Sep 27 Mirror Lake · Oct 10 Sauvie Island. Mt Hood is in 7
of 10; no city landmarks. People in 3 photos → tiny unidentifiable silhouettes or omitted.

### Q14. Order of the ride (2026-10-12)

**Answer: chronological, summer → fall. "build it".** Palette follows the season (June meadow → July
coast fog → August dry gold → September high light → October storm sky). Mt Hood recurs. Home/desk
bookends the ride. City landmarks dropped.
Cello: "we don't have enough projects for all the scenes but i wanted to plan them and have them
loaded up over time. maybe blogs can vary them too." → every stop is a slot: a project, a post, or
scenery only, filled over time.
Cello: "all content should be readable over the three recreations of the scenes and we can split
that work." → rule: text never sits on a scene; content sits on system surfaces (wall/desk) or
opaque plates. Scenes are authored as data from a scene kit so the work can be split (agents or
Cello in Figma).
Design-system impact (told to Cello; sent to the audit session as rewrite-only additions): new role
`bg-plate`; art token group `scene.<stop>.*` (day + night variants, exempt from text contrast because
they never carry text); the ride is a motion signature (reduced motion → stills); components Plate,
LocationCard, SceneStop. The staged migration is unchanged.

### Correction: a window, not a train (2026-10-12)

Cello: "we don actually want a train ride i was using a comparison and you took it literally,
window transition is more accurate". The train-ride parallax is dropped (a literal reading of an
analogy, the same latching failure the channel brief warns about).
What he said instead:
- "the desk window setup can also stay as the hero and transition to the other scenes depending
  on blog, case study etc."
- "on load its a different one of the scenes masked through the window hero"
→ Window = the persistent hero/frame; scenes swap *through* it with a window transition; which
  scene shows depends on the content (case study, post…); a different scene on each load.
People in the photos: keep them subtle, behind-the-scenes only (tiny, not obvious). Who they are is
not recorded here: this repo is public.
Audit session (2026-10-12): Cello approved its proposal as written; the scene additions (plate
rule, `bg-plate`, `scene.*`, Signature tier, Plate/LocationCard/SceneStop) come back as one
amendment for his approval once a rewrite direction is picked. Stage 0 of the migration is in
progress on `claude/design-system-migration`; stage 1 keeps legacy aliases, so prototype token
names stay valid.

### Q15. What swaps the scene (2026-10-12)

**Answer: sticky window that follows reading, "build it".** Built as the window storyboard
(`1cfefd0`): room in HTML/SVG, places from the scene kit in three.js, content on plates, blind
transition, random opening place, hover/focus previews.

### Feedback on the shapes (2026-10-12)

Cello: "i don't love the look. what could we do? render textures and layers using gpt images and
you composite them and use three? i don't love the shapes that are coming out sorry. they serve as
story boards tho". → The kit renders are storyboards (composition + depth plan). Next: generated
art via Pi's `codex_imagegen` (prompts in `docs/rewrite/imagegen-prompts.md`), composited in
three.js as depth layers. Step 1: three style frames of one place; Cello picks; then a layer test;
then the rest. Sending a photo to the image model needs Cello's explicit OK (asked).

### Identity revision inherited from the audit thread (2026-10-12)

Cello folded the window concept into cello.dev's identity (`docs/design-system/identity.md` I1–I6
and proposal amendment A1 on `claude/design-system-migration` @ `54bd1e6`). Use in the rewrite:
- I1 the mark reads as C + green sun + Mt Hood (cello.dev only; Daybreak finds its own motif).
- I2 themes are **Day** (light) and **Dusk** (dark), same values; text only on Day/Dusk surfaces or
  opaque plates, never on scene art.
- I3 art tokens `art/season/<month>/{sky, far, snow, forest, ground}` (inks from his photos);
  Dusk = `color-mix(in oklab, ink 40%, #001a11)`, snow 55%.
- I4 display faces: **National Park** for titles, **Switchback** for place names (new `place-name`
  role), Geist Mono for everything else; self-hosted, OFL.
- I5 the window frame (frame 6 · mullion 4 · sill) replaces the offset frame; LocationCard is a
  must-tier rewrite component.
- `bg-plate` approved in A1.
Still this thread's to bring as an amendment: SceneStop + the scene kit's shape, and the window
transition as a Signature motion tier.

### Image generation path (2026-10-12)

Cello: "codex image gen might be outdated in pi. search the best way to tap into the images api
with my sub". Research: `docs/rewrite/imagegen-research.md`. Recommendation put to Cello: call
the Codex Images endpoints directly with his existing login (local script); fallbacks
`pi-codex-image-gen` or the upgraded CLI; metered gpt-image-2.5-sunburst only if quality falls
short. Prompt palettes now use the September inks (I3).

### Q16. The look (2026-10-12)

Three Mirror Lake style frames (screenprint, gouache, risograph; September inks; generated with the
`codex-images` skill). **Answer: A, screenprint** ("how do we accurately recreate that look in the
first option").
Method agreed: frame A is the style anchor passed into every generation (photo crop + storyboard +
frame A) plus a written screenprint spec; each place is generated whole, then cut into layers by
edits of that same master (so edges line up).

### Q17. Figma as the cutting table (2026-10-12)

**Answer: yes.** A Figma file in Harmonic Convergence: a Process page (every look so far, for the
story) and a Scenes page (per place: master + named layers sky/far/mid/near). Cello fixes edges
by hand if needed (pen tool, Figma AI Remove background/Erase); layers are exported from Figma
into the three.js window. Cello: "document our process and different looks. itll make a great
story".

### Layer test: Mirror Lake as depth (2026-10-12)

Ran prompts 6–8 (sky, far, mid) on the subscription; keyed with `prototypes/tools/key.py` (PIL
only) and cut with `tools/cut.py`: the edits are used as mattes and the color comes from the
master wherever it was visible, because the model redraws what it keeps (clouds moved, the mid
edit dropped the lake's reflection of Mt Hood). Details and the per-place pipeline:
`imagegen-prompts.md`, "Layer test result".
Figma file **"cello.dev — window scenes"** (Harmonic Convergence):
https://www.figma.com/design/BHwjRNFmaMra4MUhsSwUXC. Process page: 01 Cut paper, 02 Tokens,
03 Window storyboard, 04 Style frames A/B/C, 05 Layer cut, captioned in build order (Cut paper was
built before Tokens). Scenes page: section `mirror-lake · September` with `master` and a `layers`
frame (sky, far, mid, near, back to front). The window loads the layers exported from Figma
(`gen/layers/mirror-lake/*.webp`, ~570 KB for all four). Node IDs: `figma-ledger.json`.
Open for Cello: the fireweed edit is brighter and a bit larger than in frame A (keep, tone down in
Figma, or regenerate).

Cello (2026-10-12): "once you make a couple document the best way to do it and create a skill to
keep reusing globally", then "once a few scenes work correctly, cutting pieces can be its own
skill." → The method is documented per run in `imagegen-prompts.md`; the global scene-cutting
skill gets written once a few places cut cleanly, not before (Mirror Lake is the first).
Cello on the Process page (2026-10-12): "layer cut is definitely the coolest".

### Q18. Landscape storyboard and focus (2026-10-12, Codex continuation)

Cello wants the landscape to fill most of the hero, with content inhabiting depth rather than
literal paper cards. Scrapbook means how the layers enter, settle/bounce, and respond to input.
Keep the dark menu bar. During reading, the scenery softens, dims, and quiets; the work wins.
Cello approved the v2 storyboard's dim level and asked to remove location/sound indicators during
focus (brief location introduction only when a place changes). Project/scene selection is the
primary navigation group; About and other utilities are separate. Useful context remains in a
small sticky bar; a reachable footer offers next work and personal/contact links.

Storyboard source, corrections, audience, mobile motion theory, and pending decisions:
`docs/rewrite/STORYBOARD.md`. Static desktop/mobile frames:
`http://localhost:4610/storyboard.html`. Production site and original window prototype unchanged.

### Q19. Photo treatment, then cutting, then composition (2026-10-12)

Cello: "it basically uses image gen as a shader on my pictures keeping the composition and
everything. then cutting, and then we will rearrage the composition on the three canvas to
create depth". The image model should retain the source photo's viewpoint, composition, and
aspect ratio; it is a style treatment, not a layout generator. Layout studies that redraw the
landscape are superseded as the rendering method. Portrait scenes may be expanded beyond their
edges (Cello authorized it), with the original center retained. If AI treatment cannot maintain
consistency, evaluate a deterministic cutout/screenprint shader instead.

Ecola is the next end-to-end run (`docs/rewrite/scene-runs/ecola.md`). Once one completes,
update cutting/Figma skills and delegate individual remaining scenes. Claude's “rewrite cello
dev” session receives the assets and reference storyboard. The reusable storyboard → build
report waits until Claude acknowledges the handoff; no acknowledgment yet.

### Q20. Final atmosphere pass (2026-10-12)

Cello: "Also at the end sfx and microinteractiob ambient synth emulation? Super subtle but relaxing".
Record this as a final polish pass after the visual/story flow is settled: explore quiet ambient
synthesis, sparse soft interaction cues and gentle visual response. Reading quiets the sound
further; sound remains opt-in with remembered preference and settings in utilities. Concrete
sounds, synthesis method and listening levels remain to be prototyped and reviewed. Nothing
audio-related is implemented yet. Detailed intent is in `STORYBOARD.md`.

### Q21. Claude takes the storyboard handoff (2026-10-12)

Claude acknowledged the storyboard (`STORYBOARD.md`, "Continuation and process-report gate") and
asked four things before building. Cello's answers:
- **People in scenes: make them tiny or remove.** Moss Falls, Bald Mountain and Salmon Ridge are
  re-treated before anything showing people is committed or shown publicly (done 2026-10-12:
  removed outright, not shrunk). Sauvie's distant figures already fit the "subtle,
  behind-the-scenes" rule.
- **Lean commit.** Docs, manifests, tools and the WebP layers are committed; per-scene QA JPEGs and
  full-size storyboard PNGs stay local (git-ignored), with compressed JPG sheets committed.
- **Plate rule: yes, revise it.** Text may sit over scene art (with the approved focus dim) and
  the window frame is no longer the hero's framing. This revises identity I2/I5 and the
  `bg-plate` rule in the migration; sent to the "Ship cello.dev" conductor to relay.
- **Build: start hero + focus** in three.js from the real layers, Mirror Lake first, Ecola second.

Cello (2026-10-12): "I actually want to update the ghosted stuff to fit the demo profiles I've been
making for its landing page". → The storyboard's Ghosted artifact (`storyboard-artifacts/ghosted-proposal.webp`)
was a screenshot of Cello's own resume; it is now Ghosted's landing-page proposal shot (Rowan Ellis,
the made-up job-search persona; ghosted-app `web/public/landing/proposal.webp`), captioned as such.
Ghosted's demo personas (ghosted-app `web/src/demo/personas.ts`, on its worktrees): four use cases ×
an English person and a Spanish twin, all invented. Any further Ghosted visuals in the rewrite come
from those personas, never real resumes or tester data.

### Q22. The landscape gets built (2026-10-12)

Cello: "rewrite only for now, keep site for now but allow me to see a demo of the new so we can start
ironing it out and cutover this week", then "i like the landscape concept … its time to do it and
make it fit in the design system".
→ **D1 scope: rewrite only.** Today's site keeps I2/I5/`bg-plate` and stays as it is until cutover.
→ **The landscape direction is picked as the build.** It is built on the design system (tokens,
roles, components; DS-HANDOFF proposals go in as an amendment), not as a separate prototype look.
→ **Cutover target: this week**, after Cello irons it out on a demo. Today's site stays live meanwhile.
The build is now a part for the "Ship cello.dev" conductor; the design-system session
("Continue the cello.dev design-system migration") owns how the proposals enter the system.
