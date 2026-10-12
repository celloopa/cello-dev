# Bald Mountain scene run — 2026-10-12

Status: candidate artwork and local cuts complete; people removed from the art 2026-10-12 (see the last section); Figma uploads and native round trip re-verified. Aesthetic approval pending.

Note: the sections from Inputs through Parent native export verification record the original cut (with people in the art) and are kept as history; the original prompts for the treatment, expansion and the near/clean/terrain mattes were superseded for the near plane by the 2026-10-12 people-removal section at the end. Current files are the people-free ones.

## Inputs

Private IMG_3434.HEIC, displayed at normalized portrait 4284 × 5712. The original treatment included an anonymous figure on the trail and a small distant group; both were removed on 2026-10-12 (last section). Exact Bald Mountain/Top Spur trail identification remains uncertain; existing label retained without adding location claims. Upload derivative is ignored private/refs/bald-mountain-photo.jpg, 1440 × 1920, orientation normalized, EXIF removed. Style anchor is Mirror Lake screenprint A, used only for inks, edges and grain.

## Exact treatment prompt

Apply a screenprint style treatment to IMAGE 1, Cello's actual mountain-trail photograph. IMAGE 1 is the edit target and controls the ENTIRE composition: retain portrait 3:4 aspect ratio, exact viewpoint and crop, blue clear sky occupying upper 38 percent, Mt Hood's exact jagged summit silhouette just right of center, snow/rock pattern, forested valley and ravine, diagonally descending tan rocky trail and cliff face on left. [Wording about retaining the pictured people as anonymous simplified shapes, with position and clothing detail, omitted from this public log; the treatment kept an anonymous figure on the trail and a small distant group, later removed.] IMAGE 2 is STYLE ONLY: its national park flat screenprint inks, crisp irregular cut-shape edges, restrained layered simplification, subtle paper grain. Do not borrow its lake, clouds, fireweed, trees or composition. Keep the source sky clear with no added clouds. Preserve original terrain and the dry September ground, slate/cream mountain, deep forest greens and blue sky. Think of applying an illustrative shader to this exact photograph, not inventing a new location illustration. Full bleed, no text, logo, border, frame or watermark. Output the SAME portrait 3:4 composition.

## Exact expansion prompt

Outpaint ONLY the solid magenta left and right margins of this landscape 3:2 canvas. The central portrait screenprint is fixed existing art: preserve its entire width, height, scale, position, mountain summit, trail and every hiker. Extend the same clear blue sky and mountain/forested valley naturally to the right and the same rocky dry hillside/trail ground to the left. Continue its existing screenprint inks, irregular flat shapes, subtle grain, daytime lighting and perspective. No additional people, mountains, clouds, lakes, text, borders or invented focal features. Do not recompose or zoom the center. Canvas extension beyond the photographed bounds only; replace all magenta with plausible continuation.

## Exact cutting prompts

### near

CUTTING MATTE for this exact landscape 3:2 screenprint. Keep ONLY the near rocky cliff face on the left, its sparse shrubs/trees, the diagonal tan trail/ground sweeping down to bottom-right and ALL hikers standing on that trail. Keep their exact positions and silhouettes, do not redraw or shift them. Replace the entire distant mountain, forested valley and blue sky with perfectly flat solid #FF00FF magenta, including all openings around the hikers. Trace the irregular boundary where the nearby tan rock/ground meets the distant green forest. No crop, zoom, additions, shadows outside the kept subject or text. Keep full source canvas registration.

### clean

Hidden-background clean plate from this exact landscape 3:2 screenprint. Remove ONLY the nearby rocky cliff/trail ground, its sparse shrubs/trees and ALL hikers. Continue the distant green forested valley/ravines and clear blue sky behind these removed foreground objects. Keep the existing distant mountain summit silhouette and all currently visible mountain/valley/sky shapes and positions unchanged. The trail, hikers and near cliff must be completely absent, no duplicate ghost silhouettes. Match the same screenprint inks/grain and source viewpoint. No extra mountain, people, clouds, text, crop or zoom.

### terrain skyline

Create a precise cutting matte of this exact landscape 3:2 image. Keep ALL terrain, trees, cliff, trail and hikers, every mountain peak and ridge at its exact position. Replace ONLY the clear blue sky above their precise skyline with perfectly flat #FF00FF magenta. Follow the exact mountain silhouette and fine tree tips, no blocky vertical cuts or straight rectangle edges. Do not move, crop, rescale or redraw any retained shape. Full source grid, flat magenta sky only, original retained colors, no text.

## Result and checks

Treated portrait 1086 × 1448. Expanded grid 2172 × 1448, portrait restored at [543, 0, 1629, 1448], zero maximum center pixel difference. Side geography is invented extension, not a claim about the actual view. Mountain, ravine, trail, hiker placement and clear sky broadly retained in treatment; fine rocks, trees and snow patterns changed. This is an AI treatment candidate, not a literal deterministic shader.

Three planes: opaque sky; mountain and forested valley; near cliff/trail and hikers. All PNGs full source grid. AI edits supply the terrain/trail mattes and occluded valley fill. Visible RGB restored from locked master. Forest valley stays attached to the mountain, hikers stay attached to trail. Sky uses a source sky stripe continued under terrain; valley fill under near ground uses a small local source-color continuation before generated fill.

Restack maximum/mean RGB difference zero. The initial clear-sky color threshold incorrectly cut blue mountain shadows into vertical strips; visual isolated-alpha review caught this even with exact restack. Replaced with a registered AI terrain matte. Reviewed final isolated sky, far and near images, both shifted extremes (far ±1, near ±4 source pixels), desktop 1440 × 900 crop and mobile 390 × 844 crop at x46%. No large ghost silhouettes in bounded previews; fine skyline needs cleanup before increasing mountain travel. Small source edge residue in the hidden sky plate remains; still/reduced-motion is the reliable baseline. Added terrain outside original portrait is recognizable as invented side extension. No runtime animation or physical-device test claimed.

## Figma

File BHwjRNFmaMra4MUhsSwUXC, Scenes1:48, section22:2 at [0,12600], root22:3, master-wide22:27, sky22:28, far22:29, near22:30, portrait22:31; stack22:18. Parent owns exported round-trip verification after upload fills are confirmed. Four wide uploads initially failed transport (Broken pipe / empty reply); portrait succeeded. Final upload status to be appended.

## Reproduce

From prototypes: `python3 tools/cut-bald-mountain.py public/gen/layers/bald-mountain`. Requires Pillow and the ignored PNG master/matte/fill assets. See expansion.json and cut-check.json for exact grid and hashes. Web copies1536 ×1024 are local source cuts until parent records the Figma round trip.


Final upload: fresh sequential raw-PNG urllib POST succeeded for wide master and far; sky and near had succeeded on earlier sequential curl retry. All five image fills and source-grid dimensions verified in Figma; full cutting-table screenshot inspected. Far PNG zeros RGB only beneath alpha0 to reduce lossless transport size. Parent may now export nodes22:28,22:29,22:30.

## Parent native export verification

All three Figma isolated PNG renders saved at source resolution. Dimensions, alpha and visible RGB match local cuts exactly; native restack maxdiff0. WebPs now derive from those native renders. See `figma-roundtrip.json`. Motion/style qualifications above still apply.


## People removal — 2026-10-12

Decision (Cello, verbatim): "Make them tiny or remove". The repo is public; people stay subtle, behind-the-scenes only. The treatment held an anonymous figure in the lower middle (large in the frame) and a small distant group on the trail. Both were **removed**, not shrunk. Reason: at desktop 1440 × 900 the distant group measured about 33 px wide and at mobile 390 × 844 about 29 px, with a saturated accent that read as people, so it did not meet "tiny and non-obvious"; removal did not break the composition (the trail continues across the former space and the ground stays unbroken), so shrinking was not needed.

### Exact edit prompt (image edit of the locked treated portrait master, one reference: master.png 1086 × 1448)

Edit IMAGE 1, a finished flat screenprint illustration of a mountain trail (portrait 3:4). Remove ALL people from the picture: (1) the large figure walking away on the trail in the lower middle, and (2) the small group of figures farther along the trail near the center right, just below the horizon of the trail. Fill ONLY the space those figures occupied, plus their cast shadows on the ground, with a natural continuation of the sandy, gravelly tan trail and rocky dry hillside, in exactly the same flat screenprint inks, crisp irregular cut-shape edges and subtle paper grain. The trail keeps its existing course and width, and continues unbroken through where the figures stood, with a few matching pebbles and small dry shrub shapes allowed. Every other pixel stays exactly as it is: same sky, mountain, forest, cliff face on the left, shrubs, shadows, trail position, scale, crop and framing. No ghost silhouettes or outlines of the removed figures, no new people, animals, objects, text, logo, border or watermark. Output the SAME portrait 3:4 composition, same size.

One generation, 1086 × 1448 PNG (master-nopeople-raw.png). The model re-rendered the whole frame with small texture drift everywhere (mean abs RGB difference 10.4 across the frame), so the raw output was **not** used as the master. Instead the new pixels were composited into the previous master only inside a feathered mask (diff-derived, bbox [94, 819, 635, 1347] in portrait pixels, 7.6% of the portrait, 14 px dilation, 7 px Gaussian feather). Outside the mask the portrait is byte-identical to the previous master (0 changed pixels, max diff 0). Full-size inspection of the fill (2x zoom of both former locations): no ghost silhouette, no new people, no text; seams invisible; the trail and hillside continue with matching pebble and shrub shapes.

### Wide master and cuts

- Wide master rebuilt by pasting the new portrait into the same center bounds [543, 0, 1629, 1448] of the previous wide master. Verified: center crop vs new portrait max diff 0; both outpainted sides max diff 0 vs the previous wide master; changed pixels in the wide master 102,445, all inside bbox [644, 823, 1174, 1343].
- Near matte regenerated from the people-free wide master (the old matte carried the figure silhouette and a head-shaped notch at the forest edge). Exact prompt: CUTTING MATTE for this exact landscape 3:2 screenprint. Keep ONLY the near rocky cliff face on the left, its sparse shrubs/trees, and the diagonal tan trail/ground sweeping down to bottom-right. Keep their exact positions and silhouettes, do not redraw or shift them. Replace the entire distant mountain, forested valley and blue sky with perfectly flat solid #FF00FF magenta. Trace the irregular boundary where the nearby tan rock/ground meets the distant green forest. There are no people in this picture and none may be added. No crop, zoom, additions, shadows outside the kept subject or text. Keep full source canvas registration. (near-raw-v2.png, 1536 × 1024; reference: the new master-wide.png.) Inspected: no people, clean magenta.
- Reused unchanged: terrain (skyline) matte terrain-raw.png and clean.png (hidden-background plate, no people; viewed and confirmed). Sky/far planes recomputed by tools/cut-bald-mountain.py (now reads near-raw-v2.png) because the near alpha feeds them.
- Plane changes vs previous cut: sky 298 px (alpha unchanged); far 298 alpha px, ~38.7k RGB px; near 6,250 alpha px changed (matte edge near the old figure), RGB differences only inside x 644-1174, y 838-1343.
- Restack max/mean RGB difference vs the new master: 0 / 0.0. Isolated sky/far/near viewed; no people in any plane. Motion extremes re-rendered and viewed at the recorded displacement only (far ±1, near ±4 source px): no gaps or ghosts around the former figure area. Desktop 1440 × 900 and mobile 390 × 844 (x 46%) crops viewed: trail reads as empty trail, nothing figure-like at either size.
- Known unchanged blemishes: faint vertical sky seams at the outpaint joins (visible at x about 543 and 1629 in the wide master) and the invented side geography, both pre-existing.

### Figma

Existing rectangles reused: master-wide 22:27, portrait 22:31, sky 22:28, far 22:29, near 22:30. Raw image/png POST of each file. The far upload dropped the connection on the first try (as before) and succeeded on a fresh URL. Native export round trip (get_screenshot contentsOnly, 2172 × 1448, image URL download): sky, far, near alpha max diff 0, visible RGB max diff 0, native restack max diff 0 / mean 0; master-wide and portrait fills vs local PNGs RGB max diff 0, alpha 255. WebPs derived from the native PNGs by tools/verify-figma-cuts.py (1536 × 1024); master and master-wide WebPs regenerated from the new masters (quality 91). Section 22:2 captions updated (people removed). Review image: people-removed-review.jpg (before | after, 1600 wide, ignored by git).
