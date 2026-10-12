# Landscape storyboard — working decisions

Updated 2026-10-12. Exploration, not a shipped redesign. Durable project state is in
Cello Brain's `projects/cello-dev-portfolio.md`; this file is storyboard evidence and the build brief.

## Latest direction from Cello

- Landscape occupies most of the screen; content inhabits its depth rather than sitting on a paper card.
- Keep the dark green menu bar. Scrapbook means layers entering, settling, and responding with a soft spring; it does not mean torn borders, tape, or literal cards.
- Admiring and reading are distinct attention states. When reading, soften/dim the scenery and quiet its movement so the work takes the foreground.
- **Approved:** the dim level in v2's reading frame. Hide persistent location and sound indicators during reading. A changed location may be introduced briefly, then clear.
- **Method correction:** image generation acts like a style treatment on the actual photo. Keep its viewpoint, aspect ratio, landmarks, and composition. Cut that master; rearrange the cut layers on the three.js canvas afterward. Do not regenerate the landscape to solve layout.
- Arrival leads to a project/scene selector or directly to the first case study. Different projects bring different scenes. Separate work navigation from About and other utilities.
- Storyboard desktop and mobile sequentially; nail the opening before expanding the experience. Claude will build from the storyboard.
- Process report is requested **after** handoff and Claude's acknowledgment. The target is Claude's “rewrite cello dev” session, unavailable until 4:30 per Cello. No acknowledgment received yet. The exact-session handoff was attempted: an inherited API-key override returned low credits; retrying with the existing subscription login returned “OAuth session expired and could not be refreshed.” Cello has been asked to sign back in.
- Once one new scene completes the full generation/cut/Figma/storyboard loop, update the cutting skill and Figma notes, then delegate individual remaining scenes.
- If AI style treatment cannot keep composition and visual consistency, investigate an actual deterministic cutout/screenprint shader (Figma or another source) instead. This is a fallback to evaluate, not an implemented shader or a selected replacement.

## Current visual evidence

- [Live storyboard](http://localhost:4610/storyboard.html): static paired frames, not an animation implementation. Source: `prototypes/storyboard.html`.
- `storyboards/arrival-v3/`: updated captures and style review; v2 preserves the earlier approved focus reference and source-layer hashes.
- `storyboards/arrival-v1/`: ten historical AI studies and manifest. Card treatments were rejected; Focus Pull, Horizon Name, and Living Contents explored layouts but changed the art. **Superseded as the rendering method** by direct composition of the cut layers. No final layout selected.
- Source art: `prototypes/public/gen/style/mirror-lake-a-screenprint.webp`; source cuts: `prototypes/public/gen/layers/mirror-lake/{sky,far,mid,near}.webp`.
- Figma: [cello.dev — window scenes](https://www.figma.com/design/BHwjRNFmaMra4MUhsSwUXC). Process page inspected: Cut paper → Tokens → Window storyboard → A/B/C style frames → Layer cut. Scenes page inspected: Mirror Lake master + four aligned layers; Ecola cutting table section6:2 with portrait, expanded master and four aligned PNG planes. Ledger: `figma-ledger.json`.
- Private originals remain outside the public repo; upload references are orientation-normalized, metadata-free files under ignored `private/refs/`. Inspect for people before using a reference.

## Sequential beats

| Beat | What is visible | Intended next action | Status |
|---|---|---|---|
| 01 Arrival | Large landscape, identity/role, direct route to work, quieter view invitation | Choose work or pause for the view | Real Mirror Lake layers composed; copy/font/layout provisional |
| 02 Admire | Art regains attention; work/return routes remain | Return to intro or select a story | Static composition; no motion implemented |
| 03 Focus | Sharp story copy, soft/dim landscape, minimal project context and All work | Read | Dim approved; clutter removed |
| 04 Selector | Named projects with scene swatches; utilities separated | Select a project | Static visual proposal |
| 05 Change view | New project's landscape replaces current one | Open selected story | Ecola now uses its photo-treated, expanded four-plane cut candidate; native Figma PNG round trip verified |
| 06 Case-study opener | Chosen title and story occupy foreground over its own quiet scene | Continue to actual product artifact | Placeholder copy; no outcomes invented |
| 07 Product artifact | Existing Ghosted proposal screenshot, sharp and stationary, over quiet Ecola | Continue into decisions and evidence | Real artifact and source-backed copy; enlarged mobile view is a build requirement |
| 08 Ending | Next-project invitation plus separate personal/contact footer | Next story, About, contact, Resume | Proposed reachable document footer |

Scene/project pairings are illustrative, not approved and not evidence of where work was made. Earlier Q13 chose mood pairings; Cello supplies any personal place/story connection. Do not invent one.

## Motion and sound intent for Claude

**Arrival:** make useful text available immediately. Landscape assembly can run behind it: sky → far → mid → near, short stagger, restrained overshoot strongest in the nearest layer. Scrapbook feeling comes from physical settling, not extra paper decoration. No content waits for an intro.

**Desktop:** unequal cursor travel by depth with a damped spring back to rest. Mountain moves least, near plants most. Reading sharply reduces travel and ambient motion. Useful copy remains fixed and never becomes occluded; only decorative lettering may sit behind trees.

**Mobile:** keep the same scene identity with deliberate per-layer framing. Use small arrival/release settling and modest native-scroll depth rather than copying desktop pointer movement. Project links work directly on tap; do not require hover, tilt permission, a horizontal swipe, or learning a gesture. Reduced motion retains the same art as a still with immediate text. This is motion theory, not device-tested animation.

**Focus:** v2 reference uses `blur(7px) brightness(.45) saturate(.65)` on desktop, `blur(5px) brightness(.36) saturate(.6)` in the mobile CSS, plus the ink atmosphere. Preserve the perceived dim result when adapting to WebGL; CSS numbers are reference values, not a required shader implementation. Location/sound labels disappear, utilities collapse, and the bar carries project context + All work. A changed place label may appear during a transition then disappear.

**Scene selector:** a landscape swatch rail/index, not a fictional geographical map. Each named project previews/opens its own place. Desktop hover/keyboard focus may preview, click commits; mobile tap opens directly. Propose a foreground occlusion/match of horizons into the next scene, then settle its layers and focus the story. Do not reintroduce the literal train ride or assume the old roller blind is still selected.

**Sticky information:** a small contextual bar. Exploring: identity + Work, utilities separate. Reading: project context + All work; progress can be added only if useful in a real long article. Keep it stable through scene changes. Native scrolling and ordinary routes remain usable.

**Footer:** a real reachable document ending. Finish the case-study narrative, offer next work, then separate About/Contact/Log/Resume. The landscape may regain clarity as the reading ends. Sound/motion settings belong in utilities rather than persistent reading labels. This is not an infinite scene carousel.

**Final atmosphere pass — requested by Cello:** after the hero, focus, selector and story flow are settled, explore super-subtle, relaxing SFX, microinteractions and ambient synth emulation. Proposed palette: a low warm pad, filtered airy texture, and sparse soft tonal cues for a committed project choice or focus change. Let scene changes gently change timbre; reading eases the ambience further into the background. Sound stays opt-in, initially silent, with the preference remembered and controls in utilities; preserve the uncluttered reading state.

Keep cues infrequent and softly enveloped. Mobile taps and keyboard activation should receive the same intentional cues as a desktop click; an event should trigger its sound once. Gentle visual settling remains useful with audio off. Procedural synthesis is a candidate implementation to test in the later build, not an implemented engine or approved sound palette. No audio asset/behavior exists yet, and no claim is made that ambience was recorded at a place. Evaluate the result through actual listening on phone speakers and headphones after the visual flow works.

## Audience checks

- Hiring managers: see identity, role, and work route immediately; direct project access, clear problem/role/decisions/outcomes, no animation gate.
- Developers: artifact/demo and implementation decisions within the actual case study, without turning the landing page into a technical dashboard.
- Friends/family: plain-language explanations, clear choices, room to enjoy the scenery without needing to know the tooling.

## Implementation boundaries and open decisions

Mirror Lake's forest, shoreline, lake, and reflection currently share one mid layer. Independently moving or focusing these requires additional cutting. Do not pretend they are already separate. All cuts retain a shared source-image coordinate grid; layer transforms and camera composition happen afterward. Portrait source photos stay portrait during stylization; authorized outpainting expands outside their bounds, then restores the untouched treated center. Cuts share that resulting grid. Desktop reframing is a separate composition problem.

The storyboard display font is temporary system sans, not the selected National Park face. Copy is a layout draft, not published content. The old room/window prototype remains unchanged. These exploration boards suggest a revision to the old opaque-plate/window-frame rule; they do not silently change the parallel design-system migration.

Next review: arrival placement and readability, selector feel, which projects pair with which places, and the first content artifact. Later validate full keyboard/scroll behavior, contrast against every scene, reduced motion, mobile crop and movement, loading/failure states, and native links. Static frames do not establish runtime performance or accessibility conformance.

## Continuation and process-report gate

Claude should read this file, `GRILL.md`, `imagegen-prompts.md`, and the Figma ledger; inspect the boards and scene asset status; acknowledge the current direction and the remaining provisional choices before building. Scope begins with the hero and focus behavior, then the selector and the next scene.

**Acknowledged by Claude ("Rewrite cello.dev" session), 2026-10-12.** Read this file, the GRILL
Q18–Q20 diff, the WRITEUP beats 16–20, the `scene-cutting` skill, `scene-library.json`, the Ecola
manifest and the scene-run logs; viewed `arrival-v3` boards and `storyboard.html` (loads, 0 console
errors, 0 broken images). Understood: landscape fills the hero, content lives in its depth;
dark bar kept; arrival → admire → focus (v2 dim approved, no location/sound labels while reading)
→ selector → change view → opener → artifact → footer; photo treatment, then cut, then compose in
three.js; build scope starts with hero + focus, then selector + next scene.
Still provisional (not treated as decided): copy and type (system sans, not National Park), place
↔ project pairings, the batch's style consistency, motion clearance for the still-first scenes,
the shader fallback, and sound. Conflicts surfaced to Cello before building: (1) text over scene
art and no window frame revise identity I2/I5 and the `bg-plate` rule in the migration, so they
go to the conductor once he confirms; (2) prominent people in Moss Falls, Bald Mountain and
Salmon Ridge vs the earlier "subtle, behind-the-scenes only" rule; (3) what of the ~95 MB of new
images belongs in the public repo. Build not started.

The final reusable storyboard → build report is **pending Claude's acknowledgment**, not written in advance. Handoff is currently blocked by Claude Code authentication, not missing assets. It should be based on the actual artifact round trips, corrections, accepted/rejected decisions, asset checks, and handoff/build verification—not on an assumed successful pipeline.

## Scene batch — current evidence

Ecola local cut candidate is complete: `scene-runs/ecola.md`, `prototypes/public/gen/layers/ecola/scene.json`, and `tools/cut-coast.py`. Its expanded2172×1448 master retains the1086×1448 treated portrait center exactly. Restack max/mean RGB diff0; small horizontal extremes1/4/6 source pixels inspected. Larger travel needs hidden forest cleanup. AI treatment changes fine detail, so aesthetic approval and shader fallback stay open. Figma upload/placement verified. The URL endpoint returned an empty202 challenge, then native isolated PNG image outputs recovered the round trip: all four planes match visible RGB and alpha exactly. WebPs now derive from these renders.

Shared skill: `~/.agents/skills/scene-cutting/SKILL.md`, linked into Codex and Claude; validated with quick_validate. Figma field notes corrected the obsolete no-parallel-calls advice and recorded portrait preservation, restack limitations, native export recovery and pixel-aligned tile recovery for large responses.

Eight individual agents completed Meadows, Ramona, Over Hood, Sauvie, Moss Falls, Bald Mountain, Meadows Lift and Salmon Ridge after the Ecola proof. Parent merged the ledger/catalog and verified native Figma exports. Together with the existing Mirror Lake, all ten places now have cut sets in the catalog. Nine new scenes contain29 native-exported planes; all source-resolution alpha/visible RGB/restack checks are exact0. Eight portrait centers are locked; Meadows Lift retains its original4:3 landscape aspect without expansion. See per-scene manifests and run logs for exact prompts, dimensions, crop proofs and limitations.

| Scene | Planes | Motion qualification |
|---|---:|---|
| Mirror Lake | 4 | Existing runtime; pointer not manually tested in this continuation |
| Ecola | 4 | Only far1/mid4/near6 source px inspected; larger travel needs fill cleanup |
| Meadows | 4 | Only far1/mid3/near5 source px inspected |
| Ramona | 3 | Only forest2/cascade4 source px inspected; waterfall/basalt remain together |
| Sauvie | 3 | Only land2/foreground5 source px inspected; people/wagons stay with land |
| Bald Mountain | 3 | Only mountain1/trail4 source px inspected; exact trail unconfirmed |
| Over Hood | 3 | Still preferred: wing edge ghost at5sourcepx |
| Moss Falls | 3 | Still preferred: foreground hidden-fill halos |
| Meadows Lift | 3 | Still preferred: thin cable kinks; mobile mountain crop excludes nearest chairs |
| Salmon Ridge | 3 | Still preferred: visible outpaint join/edge residue; location/month unconfirmed |

People were removed from Moss Falls, Bald Mountain and Salmon Ridge on 2026-10-12 (Cello's decision, GRILL Q21) by masked edits on the locked portrait masters; all three were re-cut and their native Figma round trips are exact.

**Style verdict:** palette and grain broadly relate, but foliage/rock simplification varies; Moss Falls, Bald Mountain and aerial detail can read more photographic than the Mirror Lake anchor. The batch is candidate art, not a finished visual identity. Before expanding production motion, review these side by side and decide whether to refine the treatment or evaluate a deterministic screenprint shader. No actual shader has been selected or implemented.

`storyboards/arrival-v3/mobile-scene-review.jpg` shows proposed still crops, not device animation. `scene-library.json` carries explicit motion readiness. Mobile framing is per scene: Salmon40%, Lift72%, Meadows62%, Ecola51%, Over Hood53%, Sauvie53%; other scenes50%. Each scene's planes share that projection. Mirror Lake alone reframes the transparent near fireweed independently in the hero board.

Native export recovery: an empty202 asset endpoint did not prevent isolated native PNG rendering. Moss mid's large response closed transport, so two temporary1086×1448 transparent Figma clipping frames yielded scale1 tiles; joining them without resampling matched the full plane exactly. Temporary nodes were removed. `tools/verify-figma-cuts.py` verifies saved native PNGs and derives WebPs; it does not certify cut quality.

Browser review: all16 paired frames loaded their art and the real product artifact. Reading hides utility/location/sound clutter. Older unattributed MutationObserver errors were recorded; after preserving a stable storyboard root and refreshing, no new errors appeared. This is static review evidence, not a production animation or full device test. Storyboard is served by Vite dev; it is not in the prototype build entry list.

## Deterministic fallback — library inspection, not a selected effect

Figma's current account library includes first-party Dither (`f5c0a2ff-247f-434e-ada4-ecce79213874`), Gradient map (`bf1fec3e-3a92-4662-a402-288c7df7e4ba`), Color adjust (`d22a8814-e106-4808-82c1-d1046f3c93ef`) and Halftone (`163623c4-6aee-413a-9123-4906ad38e9f7`). Cello's existing Pixelate effect (`1e545b33-faf5-4b57-97e8-e5134baf3399`) advertises optional color reduction. This is a concrete test route, not evidence that any recreates Mirror Lake's cutout edges. None has been applied or selected in this continuation.

A useful comparison should keep original photo UV geometry fixed and compare controlled palette reduction, local detail simplification and grain against the chosen Mirror Lake anchor. Palette mapping alone cannot establish the same silhouette language; dithering can add distracting fine detail. Try a single photo before altering the batch. Figma previews also do not prove equivalent three.js runtime behavior, alpha preservation or mobile performance. Preserve the current candidates as evidence while making that comparison.

## Future experiment — Weave automation

Cello requested this exploration **after the current storyboard → scene production → build handoff flow is finished**. First finish the current flow and its acknowledgment/report gate; do not replace it with automation work now. Confirm which Weave product/integration Cello means before evaluating capabilities.

Candidate steps to automate: prepare metadata-free photo references; orchestrate treatment/cut jobs using the locked master and style anchor; preserve portrait centers during expansion; run dimension/alpha/restack checks; upload and verify Figma assets; refresh manifests and desktop/mobile review boards; package the builder handoff and record acknowledgment. Reuse the actual scene manifests, scoped helpers and run logs as the workflow contract.

Keep visual judgment explicit: style consistency, photographic composition, hidden-fill quality, mobile framing and movement extremes need review. Exact pixel checks cannot approve segmentation or motion. Prototype the automation on one scene and compare its artifacts, failures, retries and review effort against this manual baseline before expanding it.

No Weave integration has been researched or started; these are candidate automation boundaries, not claims about its capabilities. The eventual pipeline report should include this as a follow-up experiment.
