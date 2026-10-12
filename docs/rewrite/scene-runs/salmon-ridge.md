# Salmon ridge candidate — 2026-10-12

Private source: `IMG_2918.HEIC`, orientation-normalized 3024×4032; upload derivative 1350×1800, metadata stripped. Exact location and month unconfirmed. Photo included an anonymous figure on the trail; removed 2026-10-12 (see "Figure removal" below). Mirror Lake A supplies style only.

Built-in image generation used. AI treatment is a candidate style transfer, not a literal shader. Master portrait 1086×1448. Side expansion 2172×1448; untouched portrait pasted at [543,0,1629,1448], center max difference **0**. Sides are invented. A visible join beside left deadwood remains and disqualifies unrestricted wide motion/readiness.

## Exact prompts (original pass; wording about the figure redacted for the public log)

### Master treatment

Use case: style-transfer. Edit target image 1 is a real portrait photograph of a forested ridge and an anonymous figure on a sunlit dry grassy trail. Image 2 is STYLE ONLY: the approved Mirror Lake screenprint illustration. Transform ONLY the photographic rendering into the same restrained screenprint ink language: blue ink sky, deep blue-green fir forest, muted olive/tan vegetation, cream dry-grass highlights, subtle paper grain and softly irregular solid edges. Preserve image 1's exact portrait 3:4 aspect ratio, viewpoint, crop, forest ridge heights, open blue sky, deadwood framing on left and right, steep valley and trail shape. Preserve the anonymous figure as-is (details omitted in this public log); no added face or personal detail. No new mountains, lake, flowers, clouds, text, borders, tape or UI. Reference 2 controls texture and ink simplification only, never its composition. Keep the original photographic composition and relative landmark positions.

### Side expansion

Use case: background extension. Edit the supplied portrait screenprint scene by extending its canvas left and right to a landscape 3:2 image. Keep its ENTIRE original portrait at full height centered, unchanged in scale and content. Continue only beyond its left and right edges: same clear grainy blue sky, connected forested ridge and valley, dry olive/tan grassy trail foreground. Preserve the anonymous figure centered within the original portrait, with no duplicated or added people. Do not shift horizons or landmarks, no new mountains, water or clouds. Side areas are plausible invented continuation, same screenprint palette and texture. No text, border or UI. The center will be mechanically restored after this operation.

### Near segmentation aid

Use case: background-extraction. Segmentation matte for supplied wide screenprint, SAME full 3:2 canvas and exact alignment. Keep ONLY the near dry tan/olive grassy slope and trail across the entire bottom, the anonymous figure, left foreground deadwood trunk and branches, and the right foreground tall dead tree and green framing tree. Preserve their exact silhouettes/position/scale. Replace ALL sky and ALL distant forested valley/ridge behind these foreground items with perfectly flat solid magenta #ff00ff. No new elements, shadows or border. Do not crop or recompose. This is a segmentation aid; visible color will be restored from original.

First call failed with network error; identical retry succeeded.

### Hidden forest fill

Use case: precise-object-edit. Create an occluded background fill from supplied wide screenprint keeping exact 3:2 viewpoint and ridge horizon. Remove ONLY the entire near tan grassy trail slope, the anonymous figure, and left/right foreground framing trees/deadwood. Continue the distant deep blue-green forested valley down through those occluded areas. Continue the clear textured blue sky behind the removed branches. Preserve forested ridge height and outline, same muted olive ink trees/paper grain. No people, no trail, no new mountains/clouds/water, no magenta, text or border. It is a hidden fill plate, not a replacement master.

## Cutting and review

`tools/cut-salmon-ridge.py` creates three registered full-grid planes: opaque sky, forested ridge/valley, near slope/framing trees (originally also the anonymous figure). The AI near extraction is used only as matte. Source blue-ink discrimination refines sky holes. Near matte dilated 5 source px and intersected with actual non-sky ink to absorb grass/branch fringe. Visible RGB always restored from locked wide master. Hidden forest is AI clean plate; sky continuation is local color bleed plus clean plate.

Restack max and mean difference **0**. That verifies color/coverage, not segmentation. Inspected neutral isolated alphas, left/right shifts far±1 and near±3 source px, desktop 1440×900 and mobile390×844 (center .40). Final matte dilation removed most residual foreground branches from forest plate; small grass/branch edge ghosts and hidden sky outlines remain possible. **Still-first candidate**, recommended per-layer travel0 until seam/hidden-fill cleanup. Desktop center clips trail base; mobile .40 retained the figure and ridge (pre-removal). These crops are still QA, not device or runtime validation.

## Figma

Existing file BHwjRNFmaMra4MUhsSwUXC Scenes1:48. Section24:13 at (0,16800), root24:14; wide master24:15, registered stack24:16, sky24:17, far24:18, near24:19, portrait24:20. All layers2172×1448 with common origin. Raw PNG upload: initial concurrent transport closed two connections; master/sky/near fills verified, retry only failed far/portrait with fresh single-use URLs. All five final image fills verified at expected dimensions; registered-stack Figma screenshot inspected. Parent native PNG export verification pending; local WebP origin labeled honestly.

No project pairing approved, no production integration, no commits/push/deploy.


## Parent native export verification

All three Figma isolated PNG renders saved at source resolution. Dimensions, alpha and visible RGB match local cuts exactly; native restack maxdiff0. WebPs now derive from those native renders. See `figma-roundtrip.json`. Still-first/style qualifications above remain.


## Figure removal — 2026-10-12

Cello's decision: "Make them tiny or remove". **Removed** (not shrunk): the figure sat on a plain dry trail and grass bank that continue naturally, so the removal fill is clean at full size and no tiny-silhouette fallback was needed. People rule: the repo is public, people stay subtle/behind the scenes. Selection and approval remain Cello's.

### Prompt 1 — figure removal on the locked portrait master (codex-images edits, ref: master.png, 1 call, output 1086×1448)

Use case: precise-object-edit. Edit target image 1 is a finished screenprint-style landscape illustration of a forested ridge, dry grassy slopes and a dirt trail. Remove ONLY the anonymous seated figure in the lower-left of the image (the whole figure including its shadow, and any items with it). Fill the space the figure occupied by naturally continuing the surrounding scenery: the packed tan dirt trail with small pebbles continues down through that area, the dry cream and olive grass bank on the left continues into the vacated space, with the same flat screenprint inks, same paper grain, same irregular solid edges and same lighting direction. The result must be an empty trail with no person, no silhouette, no ghost outline, no new people, no animals, no objects, no text. Do NOT change anything else: sky, trees, ridge, forest, right-hand grass, deadwood trees and the rest of the trail must stay exactly as they are, same aspect ratio 3:4, same crop, same pixel positions.

Result `before-figure-removal/nofigure-raw-v1.png`: figure gone, no ghost, no new people/text. But the edit re-rendered the whole frame (mean abs diff vs the locked portrait 12.7/255 over the whole image; grain and forest texture differ everywhere), so it is **not** used as the master. Instead `tools/cut-salmon-ridge.py --rebuild-master` blends it into the locked portrait only inside a feathered patch (changed region from a 25 px smoothed diff > 22, largest component, dilated 45 px, 14 px Gaussian feather; 323,988 px, bbox about x 138-634, y 864-1381 in portrait px). Everything outside the patch is pixel-identical to the previous portrait (max diff **0**). Patch inspected at full size: continuous trail with pebbles, grass bank continues, no seam or silhouette.

### Wide master rebuild

New portrait pasted into the same bounds [543,0,1629,1448] of the previous wide master. Center crop vs new portrait max diff **0**; outpainted sides (x<543, x>=1629) vs previous wide master max diff **0**. Previous masters and planes kept locally (git-ignored) in `before-figure-removal/`. The left join beside the deadwood and the duplicated left tree in the invented side are unchanged (still-first status unchanged, not made worse).

### Prompt 2 — near matte on the figure-free wide (ref: 1536×1024 resize of the new master-wide.png, output 1536×1024 `near-raw-v2.png`)

Use case: background-extraction. Segmentation matte for supplied wide screenprint, SAME full 3:2 canvas and exact alignment. Keep ONLY the near dry tan/olive grassy slope and trail across the entire bottom, left foreground deadwood trunk and branches, and the right foreground tall dead tree and green framing tree. Preserve their exact silhouettes/position/scale. Replace ALL sky and ALL distant forested valley/ridge behind these foreground items with perfectly flat solid magenta #ff00ff. No new elements, no people, no shadows or border. Do not crop or recompose. This is a segmentation aid; visible color will be restored from original.

The fully regenerated matte drifted from the validated one on the invented right-hand trees (243k px new-only, 143k px old-only vs the old alpha), so it is used only inside the former figure zone [632,800,1242,1448] (source px); the previously inspected matte `near-raw.png` is kept everywhere else. Hidden forest fill `clean.png` and sky are reused (sky plane sha256 unchanged: no alpha or RGB change at all).

### Cut and checks

- Restack vs new master-wide: max diff **0**, mean **0.0**. Tested motion unchanged: far ±1, near ±3 source px (isolated alphas, motion-left/right, crop-desktop/mobile re-inspected; no head/figure remnant in near or far; recommended travel still 0).
- Changed vs the previous planes: sky 0 px; far visible RGB 7,594 px, alpha 22,176 px (hidden-fill edge around the old head); near alpha 1,968 px and visible RGB 224,008 px, all inside x 603-1252, y 790-1447.
- New plane sha256 (local): far `49b30486c941e8603224697757879f7b868ebc35dda576c0fe55adac6616ce94`, near `eb15d50a9676160a7164e4b4e00405acf0ea8c33f8801f2f0b8fe10047c4c70e`; native Figma PNG sha256: far `b16131b7dce7776e274bd5e497431292386969c3cce9dfeed284821aa03a2b6b`, near `e4380fbd2e43b13babd6147403d3efd4018f89557a4f9ee6ca0ea24ec544ac3d`.
- Figma (file BHwjRNFmaMra4MUhsSwUXC, Scenes page 1:48): fills replaced on the existing rectangles master-wide 24:15, portrait 24:20, far 24:18, near 24:19 (raw PNG, image/png; sky 24:17 untouched). New image hashes: master-wide `c10a2246…`, portrait `753e3759…`, far `d471290a…`, near `e6ed1ccc…`. Native isolated renders (get_screenshot contentsOnly, maxDimension = source long edge; the URL download worked this time): far/near 2172×1448, alpha diff 0, visible RGB diff 0 vs local PNGs; master-wide and portrait renders max RGB diff 0; native restack vs master diff 0. Registered-stack screenshot (24:16) inspected: empty trail, no figure. WebPs re-derived from the native PNGs by `tools/verify-figma-cuts.py salmon-ridge`; master.webp / master-wide.webp re-encoded by the rebuild step.
- Before/after review: `people-removed-review.jpg` (local, git-ignored; its left half still shows the figure, so do not publish it).
- Review sheets regenerated 2026-10-12 from the people-free masters: `storyboards/arrival-v3/` scene-library-pair, mobile-scene-review, motion-review, style-review and style-review-current (checked: no person or animal in any of the ten scenes; Sauvie's tiny distant figures excepted).
