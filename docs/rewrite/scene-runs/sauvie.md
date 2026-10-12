# Sauvie scene run — 2026-10-12

Status: local three-plane cut candidate and Figma placement complete; exported round trip blocked. Aesthetic approval pending.

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
- Sky/clouds remain one plane; wagons/people remain grounded with farmland. Separate cloud depth or moving wagons would require intentional recutting.
- Overscan and viewport clipping must hide the translated outer edges. Use small motion bounds above until larger disocclusion is reviewed.
- Mobile motion remains proposed: gentle entry/release settle and small scroll depth, with a still reduced-motion presentation. No hover, orientation-permission or swipe-only navigation assumptions.
- No project/location pairing is asserted. No production runtime changes, commits, push or deployment.

## Parent native export verification

Native isolated PNG renders recovered the Figma round trip after the empty202 download response. All three planes match source dimensions, alpha and visible RGB exactly; native restack maxdiff0. WebPs now derive from those renders. See `figma-roundtrip.json`. This changes export provenance, not visual or motion approval.
