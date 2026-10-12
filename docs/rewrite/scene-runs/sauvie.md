# Sauvie scene run — 2026-10-12

Status: local three-plane cut candidate, Figma placement and native round trip complete; people removed from the art 2026-10-12 (see the last section; the hay wagons stay, empty). Aesthetic approval pending.

Note: the sections from Inputs through Parent native export verification record the original cut (with people in the art) and are kept as history; the original master and expansion prompts, and the wording about people in them, were superseded by the people-removal section at the end. Current files are the people-free ones.

## Inputs and invariants

- Private source: IMG_3563.HEIC, inspected locally at full resolution. Small people are present on the hay wagons and beside the track; treatment simplifies them into anonymous screenprint silhouettes.
- Sanitized upload derivative: ignored `docs/rewrite/private/refs/sauvie-photo.jpg`, 1440 × 1920, orientation normalized and EXIF empty.
- Style only: `prototypes/public/gen/style/mirror-lake-a-screenprint.webp`.
- Photo controls portrait 3:4 crop, huge storm canopy, low horizon, distant hills/tree line, ploughed field, converging dirt track, leaning fence post, hay wagons and small people. Do not borrow Mirror Lake geography.
- Expanded sides are authorized by Cello. If used, invented side geography is labeled and the treated portrait center is restored mechanically with zero pixel difference.
- Every plane stays on one full source grid. AI edits supply masks and hidden fill; visible RGB comes from the locked treated master.
- Figma section reserved at x0/y8400 in existing Scenes page 1:48. No production runtime or scene/project associations changed.

## Prompts and validation

## Exact prompts

### Master

Use case: style-transfer. Edit IMAGE 1, the actual Sauvie Island photograph. IMAGE 1 alone controls composition: SAME portrait 3:4 ratio, same camera viewpoint, extremely large dramatic storm-cloud canopy occupying upper 58%, low distant hills and tree line, level ploughed field at left, dirt track at right receding toward center, weathered leaning fence post lower left-of-center, grasses in bottom left, and two hay wagons with their small passengers at center-right. Keep all major locations, scale, perspective, horizon height and ground paths; no zoom, crop or rearrangement. Simplify existing tiny people into anonymous printable silhouettes without identifiable face details, preserving their position and number broadly. IMAGE 2 is STYLE ONLY: use its restrained flat national-park screenprint inks, crisp irregular printable edges, subtle paper grain, limited layered tonal simplification. Do not borrow the mountain, lake, flowers, trees or composition of image 2. Preserve the Sauvie photo's October storm mood: pale blue-grey and warm cream openings, broad layered charcoal/slate storm clouds, muted olive trees, ochre stubble and muted brown earth, deep green grasses. Do not replace clouds with sunny decorative puffs; keep the same enormous sweeping cloud formation. Full bleed, no text, labels, logo, watermark, border or frame. This is a style treatment on the same real photograph, not a redesigned scene. Output the SAME portrait 3:4 composition.

### Expansion

Outpaint ONLY the flat magenta left and right margins of this landscape 3:2 canvas. The central portrait screenprint is FIXED existing art: preserve its scale, position, full vertical extent and all cloud, horizon, field, post, people and hay wagon details. Continue the same Sauvie Island storm sky sweeping outward, with low distant hills and tree line at the same height, ploughed earth/field, dirt track, stubble and foreground grasses through the margins. Maintain the exact screenprint palette, flat irregular ink shapes and subtle grain. No new wagons, people, houses, mountains, text, frame or borders. Do not redesign/crop/zoom central portrait. Replace all magenta with plausible natural continuation. Same landscape 3:2 ratio. This is expansion of existing photo-derived art, not a new composition.

The treated portrait is 1086 × 1448. Expanded grid: 2172 × 1448; original portrait restored at [543, 0, 1629, 1448]. Maximum center pixel difference is 0. Side geography is invented continuation. Broad photo composition is retained; individual cloud edges and fine ground details change under AI treatment.

### sky

Edit this exact landscape 3:2 Sauvie screenprint as a SKY hidden-background clean plate. Remove ALL hills, distant tree line, field, ground, path, grasses, fence post, hay wagons and people. Continue the SAME immense storm-cloud canopy, slate/blue-grey layered ink forms, blue sky and cream openings to fill the entire canvas. Keep originally visible sky shapes, scale and positions unchanged; only reveal plausible hidden sky behind removed land. No new objects, landmarks, text, borders, zoom or crop. Same original landscape 3:2 canvas.

### land

CUTTING MATTE on the exact source grid of this landscape 3:2 Sauvie screenprint. Keep ALL land from its real irregular skyline downward: distant hills, tree line, fields, dirt track, hay wagons and people, fence post, grass and foreground earth. Replace ONLY every sky and cloud pixel above the actual hills/tree tops with perfectly flat #FF00FF magenta, no grain in magenta. Preserve exact original irregular skyline silhouette, positions, scale and all source land art. No redraw, zoom, crop, or new objects; same canvas.

### near

CUTTING MATTE on the exact source grid of this landscape 3:2 Sauvie screenprint. Keep ONLY the nearest dark green/olive grassy bank in the lower LEFT and its leaning weathered fence post left-of-center. Include this bank's fine grasses/strands and earthy clumps within its irregular silhouette down to the bottom left edge. The post stays at its exact position and original scale. Remove ALL sky/clouds/hills/distant trees/field/hay wagons/people and the dirt road to the right: replace those with perfectly flat #FF00FF magenta, no grain. Preserve every kept grass/post silhouette exactly, no added vegetation, no redraw, zoom, crop; same canvas.

### clean

Edit this exact landscape 3:2 Sauvie screenprint as a hidden-ground fill plate. Remove ONLY the nearest dark green/olive grassy bank in lower LEFT and its leaning fence post left-of-center. Fill those removed areas with plausible continuation of the existing nearby ochre stubble and muted brown earth. Keep all sky/clouds/hills/trees/wagons/people/track positions unchanged. No new objects, grass bank, post, text or borders. Same source landscape 3:2 crop and scale, same ink/grain. This is hidden ground for parallax, not scene redesign.


## Result and validation

- Master portrait 1086 × 1448; expanded source 2172 × 1448; web planes 1536 × 1024. Expanded portrait center max pixel difference 0.
- Three full-grid planes: sky/cloud canopy; hills/tree line/farmland/track/wagons/anonymous people; near grassy bank/fence post. Three planes follow real occlusion rather than forcing a fourth arbitrary band.
- Source visible RGB is restored from the locked master; AI mattes supply alpha and hidden sky/ground plates fill disocclusion. Local source-color continuation within eight pixels reduces tonal edge seams.
- Restack max difference 0; mean difference 0. This proves source coverage/color only. Isolated far and near silhouettes inspected on neutral gray. Both horizontal extremes inspected with sky0, far±2 and near±5 source pixels. Fence-post detail confirms no duplicated post at those bounds. Larger movement remains unproven.
- Desktop 1440 × 900 and mobile390 ×844 crops inspected. Mobile horizontal center .53 keeps wagon, post and huge cloud canopy visible. These are image crop proofs, not device/runtime interaction testing.
- Figma Scenes1:48, section19:2 at x0/y8400, master19:10, portrait19:20, registered stack19:13, planes sky19:14 / far19:15 / near19:16. All five PNG fills, sizes/origins and cutting-table screenshot verified.
- Initial concurrent uploads dropped four connections while near succeeded. Four fresh URLs uploaded sequentially succeeded HTTP200; do not assume a failed concurrent batch left every node empty.
- Correct filled sky node download attempted once: expected5,344,869 bytes, returned HTTP202, zero bytes, text/html, WAF challenge. Local cuts match verified Figma uploads; no exported round trip is claimed. Ephemeral URLs are not persisted.

Artifacts: `scene.json`, `figma.json`, `figma-upload.json`, `figma-roundtrip.json`, `cut-check.json`, `expansion.json`, `isolated-*.jpg`, `motion-left.jpg`, `motion-right.jpg`, `post-motion-detail.jpg`, `crop-desktop.jpg`, `crop-mobile.jpg` in `prototypes/public/gen/layers/sauvie/`. Reproduce cuts with `python3 docs/rewrite/prototypes/tools/cut-sauvie.py docs/rewrite/prototypes/public/gen/layers/sauvie` from the rewrite worktree.

## Limits for composition

- The treated cloud contours and ground details differ from the photograph; this remains an AI style-treatment candidate, not a literal deterministic shader or approved final art.
- Sky/clouds remain one plane; the (now empty) wagons remain grounded with farmland. Separate cloud depth or moving wagons would require intentional recutting.
- Overscan and viewport clipping must hide the translated outer edges. Use small motion bounds above until larger disocclusion is reviewed.
- Mobile motion remains proposed: gentle entry/release settle and small scroll depth, with a still reduced-motion presentation. No hover, orientation-permission or swipe-only navigation assumptions.
- No project/location pairing is asserted. No production runtime changes, commits, push or deployment.

## Parent native export verification

Native isolated PNG renders recovered the Figma round trip after the empty202 download response. All three planes match source dimensions, alpha and visible RGB exactly; native restack maxdiff0. WebPs now derive from those renders. See `figma-roundtrip.json`. This changes export provenance, not visual or motion approval.


## People removal — 2026-10-12

Decision (Cello, verbatim): "remove the sauvie people too". The repo is public; people never appear in the public art. The treatment held a group of riders on two coupled hay wagons (center-right, heads rising above the tree line) and a standing group of three beside the fence post, left of the wagons. All of them were **removed** (not shrunk). The two wagons are **kept, empty**: with the riders gone the wagon beds, side rails, wheels and hitch still read as parked farm wagons on the track, so no further change was needed. The small yellow vehicle on the far horizon is not a person and stays.

### Prompt 1 — people removal on the locked portrait master (codex-images edits, ref: master.png, 1 call after one transport retry, output 1086 × 1448 `nofigure-raw-v1.png`)

Use case: precise-object-edit. Edit target image 1 is a finished screenprint-style landscape illustration of a stormy sky over a ploughed field, a dirt track, a leaning wooden fence post and a hay wagon train. Remove ALL people from the picture: (1) every passenger sitting on the two hay wagons at center-right, so the wagons are left completely empty (bare wooden wagon beds with their side rails, wheels and hitch, no passengers, no bales added), and (2) the small group of standing figures on the field just left of the wagons, between the fence post and the wagons, including their shadows. Fill ONLY the space those people occupied by naturally continuing the surroundings: the wagon beds and rails continue empty, the ploughed ochre field and muted brown earth continue behind them, with the same flat screenprint inks, same paper grain, same irregular solid edges and same lighting direction. The result must contain no person, no silhouette, no ghost outline, no new people, no animals, no new objects, no text. The hay wagons themselves, the small yellow vehicle on the far horizon, the fence post, the grass, the track, the trees, the hills and the entire storm sky must stay exactly as they are: same aspect ratio 3:4, same crop, same pixel positions.

Result: people gone, wagons empty, no ghosts, no new people or text. The edit re-rendered the whole frame (mean abs RGB diff vs the locked portrait 8.9/255 over the frame, 5.2 in the top half; ground grain differs everywhere), so it is **not** used as the master. `tools/cut-sauvie.py --rebuild-master <backup-dir>` blends it into the locked portrait only inside a feathered patch: the change map (25 px smoothed diff > 22) is trusted only for the two components that sit where the people were (riders: about x 539-744, y 830-904; standing group: about x 396-457, y 873-950), dilated 28 px and feathered with a 9 px Gaussian (87,151 px, bbox x 332-808, y 766-1014 in portrait px, about 5.6% of the portrait). Outside the patch the new portrait is pixel-identical to the previous one (max diff **0**). Full-size and 2x inspection of the patch (both former positions and seams): no people, no ghost silhouettes, no text, seams invisible; the wagon beds, rails and wheels continue cleanly and the field behind them continues.

### Wide master rebuild

New portrait pasted into the same bounds [543, 0, 1629, 1448] of the previous wide master. Center crop vs new portrait max diff **0**; outpainted sides (x < 543, x >= 1629) vs previous wide master max diff **0**. The invented sides are unchanged. Sauvie does have an expansion, so this step applied. The pre-removal masters and planes are kept outside the repo; the pre-removal WebPs remain in git history.

### Prompt 2 — land matte on the people-free wide (ref: 1536 × 1024 resize of the new master-wide.png, output 1536 × 1024 `land-raw-v2.png`)

CUTTING MATTE on the exact source grid of this landscape 3:2 Sauvie screenprint. Keep ALL land from its real irregular skyline downward: distant hills, tree line, fields, dirt track, the two empty hay wagons, fence post, grass and foreground earth. Replace ONLY every sky and cloud pixel above the actual hills/tree tops with perfectly flat #FF00FF magenta, no grain in magenta. Preserve exact original irregular skyline silhouette, positions, scale and all source land art. There are no people in this picture and none may be added. No redraw, zoom, crop, or new objects; same canvas.

The old land matte carried the riders' heads as skyline bumps over the tree line, so it was regenerated. The new matte is used only inside the former-people zone [850, 730, 1400, 1040] (wide source px); the previously inspected matte `land-raw.png` is kept elsewhere. The near matte (`near-raw.png`: bank and fence post only), the hidden-ground plate `clean.png` and the sky fill `sky-raw.png` carried no people and are reused (viewed to confirm).

### Cut and checks

- Restack vs new master-wide: max diff **0**, mean **0.0**. Tested motion unchanged: far ±2, near ±5 source px; isolated alphas, motion-left/right, post-motion-detail (regenerated, the old one still showed the standing group), crop-desktop (1440 × 900) and crop-mobile (390 × 844, center .53) re-inspected: empty wagons, no head or figure remnant in any plane, no gap at the former positions.
- Changed vs the previous planes: sky 0 alpha px, 18,266 visible RGB px (bbox x 858-1421, y 785-867, hidden-sky continuation under the old riders' heads); far 880 alpha px, 40,905 RGB px (x 877-1399, y 794-990); near 0 alpha px, 2,881 RGB px (x 901-1024, y 896-996, the post's surroundings).
- New plane sha256 (local): sky `b534a443f957e5760331e37043a1e346fbd3f8cdaee74b53f1e08e258ff2c0d4`, far `82ce5f8c7370b77463330b9c09c721546a75801409f61b60d0a7f90cd26df1f8`, near `f003be47b98c7ed4ba4c8e3aa1200bfbbfad6d043d4a2a08fcca5cb21bccf34b`; native Figma PNG sha256: see `figma-roundtrip.json`.
- Figma (file BHwjRNFmaMra4MUhsSwUXC, Scenes page 1:48): fills replaced on the existing rectangles master-wide 19:10, portrait 19:20, sky 19:14, far 19:15, near 19:16 (raw PNG, image/png, fresh single-use URLs one at a time, all HTTP 200; new image hashes in `figma-upload.json`). Caption 19:5 updated. Native isolated renders (get_screenshot contentsOnly, maxDimension = source long edge, URL download worked): sky/far/near 2172 × 1448, alpha diff 0, visible RGB diff 0 vs local PNGs, native restack vs master diff 0; master-wide and portrait renders RGB diff 0. Section screenshot (19:3) inspected: empty wagons, no people. WebPs re-derived from the native PNGs by `tools/verify-figma-cuts.py sauvie`; master.webp / master-wide.webp re-encoded by the rebuild step.
- Before/after review: `people-removed-review.jpg` (local, git-ignored; its left half still shows the people, so do not publish it).
- Review sheets in `storyboards/arrival-v3/` regenerated 2026-10-12 from the people-free masters (see STORYBOARD.md).
