# Moss falls scene run — 2026-10-12

Status: candidate local cuts complete; people removed from the art (Cello's decision, 2026-10-12: "Make them tiny or remove" — removal chosen); Figma planes re-uploaded and native round trip re-verified. Exact waterfall name is uncertain; label Cottage Grove waterfall or Moss falls until Cello confirms. Aesthetic selection is Cello's; nothing here claims approval.

## Inputs and composition

Original private IMG_2309.HEIC inspected in full: an anonymous figure and a dog were present in the foreground. Orientation normalized 3024 × 4032 → sanitized upload 1440 × 1920, empty EXIF. Photograph controls viewpoint, portrait crop, tree framing, central waterfall and logs/rocks. Mirror Lake screenprint A is style-only. Treatment changes fine branches, water rivulets and rock detail: candidate, not literal shader/pixel-identical photo, not user-approved.

History: the first treatment removed the figures, a corrective edit then restored them, and on 2026-10-12 the repo's rule (people stay subtle, behind-the-scenes only; the repo is public) led to the final decision to remove them from the art for good. The art now contains no people and no animals.

Portrait master 1086 × 1448. Wide master 2172 × 1448; the (people-removed) treated portrait is pasted into [543,0,1629,1448] with zero center pixel difference. Side geography is invented outpaint, unchanged by the people removal.

## People removal (2026-10-12)

Decision: remove (not shrink). The earlier removal treatment already showed the area reads fine without the figures, and the new edit confirmed it: the fallen log, loose rocks and trail simply continue, with no composition break and no visible gap.

Method:
1. Edit the locked treated portrait (`master-withfigures.png`, kept locally, git-ignored) with one image edit (codex-images, edits endpoint, one reference = the portrait itself).
2. The model re-renders the whole frame with slight global grain/detail drift (mean abs RGB diff about 8.8 in the untouched top half, geometry registered). To honor "no other change", only the changed region was taken from the edit: a mask built from the diff map, limited to x 290–700, y 740–1400, dilated and feathered 7 px; everything outside the mask is the original locked pixels. Changed bounding box in the portrait: x 271–703, y 748–1386 (about 11.1% of pixels). Raw model output kept as `master-nofig-raw-v1.png`, composite as `master-nofig-v1.png` (now `master.png`).
3. Full-size inspection of the composite (whole frame and native-resolution crops around the former positions and both seams): no people, no animals, no ghost silhouettes, no text, no visible seam.
4. Wide master rebuilt: the new portrait pasted into the exact same center bounds of the previous wide master. Verified: center crop vs new portrait max diff 0; side regions (everything outside x 543–1629) vs previous wide master max diff 0.
5. Re-cut on the same grid (see below), restack vs new master, isolated alphas and motion extremes inspected.

### Exact people-removal prompt (image edit, 1 reference: the locked treated portrait)

Edit IMAGE 1 ONLY: remove the anonymous standing figure in the bottom center and the small animal at its lower left. Fill ONLY the space those two occupied (and a thin margin around them) with a natural continuation of the existing surroundings: the brown fallen log continuing from the right and the left, loose angular grey and tan rocks, the dirt trail, small mossy patches, thin sticks. Match IMAGE 1's flat screenprint inks, crisp cut-shape edges and fine paper grain exactly. Keep ALL other pixels of IMAGE 1 visually unchanged: the waterfall, mossy rocks, forest, mist, fallen logs, composition, scale, 3:4 portrait crop and camera viewpoint. No people, no animals, no ghost silhouettes, no new objects, no text, no border, no watermark.

One call, one result (no retries needed). Output 1086 × 1448 PNG, no alpha.

## Superseded prompts (kept for the record, descriptions of people redacted)

Initial master prompt: a screenprint style treatment of the portrait photo (IMAGE 1 controls composition, aspect, viewpoint, crop, the central multi-stream mossy waterfall, tall enclosing firs, misty pale opening, diagonal fallen trunk, mossy rocks and descending trail; IMAGE 2, the Mirror Lake reference, is style only: flat national-park screenprint inks, crisp cut-shape edges, restrained layered simplification, fine paper grain; misty forest palette of cream/grey mist, deep evergreen, moss olive, golden ochre moss, dark brown wood, warm cream water; no sky blue, mountains, new waterfall, buildings, text, logo, border, watermark). It also asked to remove the anonymous figure and dog and fill only their former space. A later corrective edit restored an anonymous figure and a dog at their original positions; the wording of that prompt described clothing and is deliberately not reproduced here. That restored-figure master is superseded by the people-removed master above.

Outpaint prompt (run while the earlier master was in the center): outpaint ONLY the flat magenta side margins of the 3:2 canvas; the central portrait is fixed art whose scale, position and extent are preserved; continue the dense forest, mist, rocks and forest floor sideways with the same flat screenprint inks and grain; no other waterfall, person, animal, building or mountain; no text, frame, crop or zoom; replace magenta only; 3:2 landscape output.

## Exact cutting prompts

### clean (hidden background plate, unchanged and reused)

Edit this exact landscape 3:2 screenprint as a hidden background plate. Remove the near bottom forest floor, logs, boulders and any foreground figures below roughly 55% height and plausibly continue the SAME waterfall, mossy rocks and forest behind these removed foreground elements. Preserve the waterfall's visible position and scale, upper trees, mist and source palette/grain, no new landforms or extra waterfall. Do not crop, zoom or recompose. Full bleed no text.

### forest (mist/sky matte, unchanged and reused)

CUTTING MATTE for this exact landscape 3:2 screenprint on the same pixel grid. Keep ALL trees, foliage, trunks, waterfall, mossy rocks, logs and forest floor at their exact current positions. Replace ONLY pale mist/sky openings (including holes between upper branches) with perfectly flat #FF00FF magenta. Keep distant silhouetted trees, not magenta. Preserve all silhouettes, scale, source colors within kept art, no repositioning/redraw/crop/text.

The forest matte only separates mist openings above the trees, so the people removal does not affect it and it was reused as is (`forest-raw.png`). The clean plate contains no foreground figures and was reused as is.

### near v2 (regenerated from the new wide master; the old near matte followed the removed figure's silhouette where it rose above the ground line)

Run with the new `master-wide.png` as the single reference, 1536 × 1024 output:

CUTTING MATTE for this exact landscape 3:2 screenprint on the same grid. Keep ONLY the near lower forest floor, diagonal fallen log, near boulders and shrubs, loose rocks and trail below an irregular boundary roughly at 45-65% height, at their exact current positions. Everything above that near ground boundary including upper trees, mist, the tall central waterfall and middle mossy waterfall rocks becomes perfectly flat #FF00FF. No remaining fragments of upper forest. Do not add any person or animal. Exact crop, no zoom, no redraw, no text.

Result `near-raw-v2.png`, keyed with `tools/key.py` (key #F206F7, 49.5% opaque). A first invocation of this call died with a local write error (broken pipe from the shell pipeline) before output; it was re-run once. Image calls this session: 3 attempts (1 removal edit, 2 near-matte invocations, one of which produced no file).

## Cut and motion verification (re-run on the people-removed master)

Three coherent planes: mist/sky; enclosing forest plus waterfall massif; near ground, log and boulders (no figures now). Full source grid and shared origin. AI masks are keyed magenta; source RGB is restored in visible areas; hidden fill uses the generated clean plate and local source colour continuation. Source-specific dark-ink refinement at mist openings. `tools/cut-moss-falls.py` reads `near-raw-v2.png`.

- Restack vs new `master-wide.png`: max difference 0, mean 0.0 (validates colour/coverage only, not segmentation quality).
- The sky plane is byte-identical to the previous one (same sha256), since only foreground changed.
- Mid plane sha256 `a83ae2bc…`, near plane sha256 `26c64654…` (local cuts).
- Inspected isolated mid and near silhouettes: the near silhouette now has no figure-shaped bump; its upper edge follows ground, log and shrubs. The near boundary reaches higher at the right side than in the earlier cut (up to about y 350 of 724 in the isolated preview). The hidden mid still shows the same soft halo/doubled-edge lines along the foreground boundary as before.
- Inspected both motion extremes (mid ±2, near ±4 source pixels) and the desktop and mobile crops: composition coherent, no figure remnants, no new tearing. Larger motions remain unproven and unsafe without better clean-plate registration. Prefer still for review; motion remains candidate. No runtime or device test.

## Figma result

Section 20:2, cutting table 20:3, stack 22:10, expanded master 22:22, portrait 22:26, sky 22:23, mid 22:24, near 22:25 (all ids unchanged). Re-uploaded as raw PNG bytes with image/png (all HTTP 200): master-wide 22:22, mid 22:24, near 22:25, portrait 22:26. Sky 22:23 kept (unchanged art). Rectangles remain 2172 × 1448 (portrait 1086 × 1448) at x/y 0.

Native isolated renders (`get_screenshot` contentsOnly:true, maxDimension at the source long edge, fetched by the returned asset URL this time; no tiling needed, even for mid at full resolution) saved and compared against the local PNGs:
- sky, mid, near: size 2172 × 1448, alpha max diff 0, visible RGB max diff 0, native restack vs master max diff 0.
- master-wide and portrait: size matches, alpha max diff 0, RGB max diff 0 (mean 0.0).
WebPs were derived from the saved native PNGs by `tools/verify-figma-cuts.py`. See `figma-roundtrip.json` and `figma-upload.json`.

## Files

`prototypes/public/gen/layers/moss-falls/scene.json`, `figma.json`, `cut-check.json`, `expansion.json`, `figma-upload.json`, `figma-roundtrip.json`, three plane WebPs, portrait/wide master WebPs, isolated/motion/crop JPG checks, `people-removed-review.jpg` (before | after; the before half shows the earlier figure art, so keep it local; JPGs are git-ignored). Heavy PNGs, the raw edit outputs, the pre-removal planes/masters (`*-withfigures.png`) and the original photo derivative are git-ignored/local. Scoped helper `prototypes/tools/cut-moss-falls.py` reproduces the source-colour cuts.
