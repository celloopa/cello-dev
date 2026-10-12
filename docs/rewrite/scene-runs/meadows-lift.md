# Meadows lift — photo treatment and registered cut candidate

Date: 2026-10-12. Scene agent: lift_scene. Aesthetic approval pending.

## Source and style

Source: private original IMG_2164.HEIC in cello-dev-places-2026-10-12. Converted with macOS sips, normalized with ImageOps.exif_transpose into ignored private/refs/meadows-lift-source.png; metadata stripped. Upload derivative1800×1350. No people apparent. Original landscape4:3 retained; no outpainting or invented side geography.
Style-only anchor: public/gen/style/mirror-lake-a-screenprint.webp. Built-in image_gen used for master and three matte/hidden-fill candidates. No CLI image provider.

Master1448×1086. Full-grid planes1448×1086; web copies1440×1080. Major scene arrangement retained: cables/chairs left, mountain right of center, forest/terminal and summer slope, curved gravel path. Snow contours, tree spacing, path width and individual lift geometry simplified/shifted; this is a candidate treatment, not a literal shader.

## Exact prompts

### Master

Use case: style-transfer. Image 1 is the edit target and sole composition source: summer chairlift photograph at Mount Hood Meadows, landscape4:3. Image2 is style reference ONLY: use its screenprinted ink shapes, rough organic edges, subtle paper grain, dark pine/olive, muted blue and warm ivory inks. Treat image1 like a visual shader: retain exact viewpoint, field of view, 4:3 aspect, every major landmark position and relative scale: chairlift cables entering upper left, two empty chairs left half, distant lift towers, snow mountain right of center, forest across middle, right lift terminal, grassy summer slopes, foreground gravel path curve. Do not add clouds, lake, fireweed or any scene object from image2. Preserve clear summer sky with subtle uneven blue ink; preserve chair silhouettes and thin cables. No new people, no text, no frame, no graphic layout, no invented cropping or composition. Flatten photographic textures into a limited handmade screenprint while retaining source structure.

### Hidden sky

Use case: precise-object-edit. This exact4:3 screenprint is edit target. Create a hidden sky plate for animation. Remove ALL mountain, trees, grass, ground, lift terminals, towers, chairs and cables and replace them with an uninterrupted subtle mottled blue screenprint sky matching the existing sky inks and grain. Keep the existing sky unchanged as much as possible. Full original4:3 canvas, no crop, no clouds, no borders, no new objects, no text.

### Land matte

Use case: background-extraction. From this exact4:3 screenprint retain the mountain, ALL forest, ground/summer grassy slope, gravel path, distant lift towers and right terminal at exact pixel positions. Replace sky and the overhead nearest two lift chairs plus cables in the sky with solid pure magenta #ff00ff. Keep scene landform silhouette accurately including fine tree tips. Full original4:3 canvas unchanged. This is a segmentation matte reference; no crop or rearrangement, no new detail, no text.

### Overhead lift matte

Use case: background-extraction. Isolate ONLY the overhead cables extending from upper left toward central horizon and TWO nearest suspended empty chairlift seats in the left half of this exact4:3 illustration. Retain their exact positions, shape and fine cables; replace EVERYTHING ELSE including mountain/trees/ground/right terminal/distant towers with flat pure magenta #ff00ff. Full original4:3 canvas unchanged, no crop, no new wires, no extra chairs, no text.

## Cutting and validation

Reproduce from prototype root:

```sh
python3 tools/cut-meadows-lift.py public/gen/layers/meadows-lift
```

All masks use the locked master RGB. Generated magenta extraction supplies positional guides; scene-specific source blue discrimination supplies detailed ink boundaries. One-pixel dilation includes cable antialias fringe. Generated sky supplies hidden blue behind occluders. Terrain remains one contiguous plane (mountain, forest, slope, terminal, distant towers); overhead nearest two chairs/cables form a separate near plane. All planes retain canvas registration and transparent bounds.

Restack max and mean RGB difference:0. This proves color/coverage, not segmentation quality. Inspected neutral-background sky/terrain/lift silhouettes, both horizontal extremes (terrain±1sourcepx, lift±2sourcepx), desktop1440×900 and mobile390×844 crops.

First lift matte included a small horizon forest fragment. Refinement excluded the land guide and removed that fragment; reviewed both final extremes again. Thin cable fragments/gaps remain: at±2px there are visible small kinks/ghosts, so recommended shift is0for now. Upper cable anchors also need fixed-edge warp if later animated. **Still preferred until cable cleanup.** Large parallax is not safe or claimed.

Mountain, forest and ground are not separately disoccluded. Mobile crop72% favors mountain but loses the nearest left chairs; an alternate chair crop loses peak. Do not stretch to include both. Mobile-specific layer arrangement is still a design choice.

## Figma

Existing file BHwjRNFmaMra4MUhsSwUXC; Scenes page1:48. Section24:2 at0,14700; root24:3; master24:4; depth stack24:5; sky24:6, terrain24:7, lift24:8. Every PNG uploaded via raw image/png; all four uploadsHTTP200. Figma screenshot of section inspected: master and rest stack visually match, full4:3 canvas. No URL download attempted (parent already diagnosed empty challenge responses). Native isolated PNG export is pending parent verification; current web copies are honestly local cuts.

## Delivery and boundaries

scene.json, cut-check.json and figma-upload.json record candidate status, source/web dimensions, layer order, tested shifts, recommended still state and IDs. PNG intermediates/private refs remain ignored; web review assets and recipe/log are intended for handoff. No shared storyboard/ledger/Brain edits, production changes, commit, push or Claude message by this agent.


## Parent native export verification

All three Figma isolated PNG renders saved at source resolution. Dimensions, alpha and visible RGB match local cuts exactly; native restack maxdiff0. WebPs now derive from those native renders. See `figma-roundtrip.json`. Motion/style qualifications above still apply.
