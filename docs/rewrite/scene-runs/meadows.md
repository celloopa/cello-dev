# Meadows scene run — 2026-10-12

Status: photo-treatment and registered-cut candidate produced and placed in Figma; aesthetic approval pending. Local web copies are ready for storyboard review. Figma download round trip is blocked.

## Inputs

- Selected private source `IMG_2113.HEIC`: portrait meadow and fir forest with Mt Hood. `IMG_2164.HEIC` is the separate ski-lift scene and was reserved for another agent.
- Inspected full scene and bottom quadrants at native resolution; no people observed. No location metadata read or copied. Orientation normalized to 1440 × 1920 in ignored `private/refs/meadows-photo.jpg`, EXIF stripped.
- Style anchor: existing Mirror Lake screenprint A. The photo controls composition, the anchor only inks/edges/grain.
- Treated portrait master 1086 × 1448; expanded master 2172 × 1448. Original treated portrait restored at bounds `[543,0,1629,1448]` with zero pixel difference. Added side geography is invented continuation.
- Broad summit, major left fir, forest opening and meadow shadow bands retained; fine trees, snow edges and grass marks are simplified. Brighter olive/yellow greens than source photo; candidate needs comparison against other scenes. Not a pixel-exact photo shader.

## Exact prompts

### master

Treat IMAGE 1, Cello's actual June Mt Hood Meadows photograph, as the exact composition to stylize. Preserve its portrait 3:4 canvas, original viewpoint, crop, large dark fir filling the left edge from top down, central forest opening and green grassy meadow at bottom, exact positions and relative heights of fir trees, Mt Hood summit near x78% y31% with broad snowy slopes partly occluded by forest, and large clear blue sky above. Keep the photograph's specific mountain silhouette and asymmetry. IMAGE 2 is STYLE ONLY: apply its national-park screenprint flat ink palette, irregular crisp cut-shape edges, restrained simplification, and subtle paper grain/ink coverage. Do NOT borrow IMAGE 2's composition, lake, pink flowers, clouds or mountain shape. Do not add clouds absent from the source, a lake, paths, buildings, lifts, people or new landforms. Green early-summer meadow, deep evergreen/olive forest with small muted sage highlights, snowy cream-white and slate-blue mountain, clear medium-blue sky. This is the same photograph with an illustrative ink treatment, not a new scenic composition. No text, border, logo or watermark. Same portrait 3:4 aspect ratio.

### outpaint

Expand this exact screenprint into the flat magenta side margins ONLY. The center portrait panel is locked: preserve its mountain, trees, meadow, blue sky, colors, scale and viewpoint, with no zoom, crop or vertical change. Replace magenta left and right areas with plausible continuations of the pictured clear blue sky, fir forest and green shadow-striped meadow in the exact same ink/grain style. This is horizontal outpainting, not recomposition. Keep the original Mt Hood summit where it is, add no extra mountain peaks, clouds, buildings, paths, lifts, water, people, typography or frame. Full 3:2 landscape canvas, identical height and central content. Side extensions are invented continuation only.

### sky

Edit this exact 3:2 landscape screenprint into its SKY BACKGROUND PLATE. Remove all trees, branches, meadow, mountain, snow and ground. Continue only the same clear blue sky ink and fine paper grain across the entire canvas. There are NO clouds in this scene: add none. Same original blue hue/texture, no text/border/gradient/color shift. Identical 3:2 full canvas.

### clean

Make a hidden mountain/background fill for this exact 3:2 screenprint. Remove all evergreen trees, branches, meadow and foreground, revealing the continuation of the same Mt Hood snowy mountain slopes behind the trees. Preserve the exact visible summit position, summit silhouette, snow/rock shape positions and scale. Preserve clear blue sky unchanged. Do not enlarge or move the mountain, add peaks, clouds, water, people or text. Continue lower mountain slopes only into removed areas. Same screenprint inks/grain, same full 3:2 canvas.

### forest

Produce a CUTTING MATTE for this exact landscape screenprint on its identical 3:2 full canvas and viewpoint. Keep every evergreen tree silhouette, trunk, branch, needle cluster, forest floor and green meadow exactly in place, with all original holes between branches. Remove ONLY the blue sky and snowy/rocky Mt Hood mountain, replacing these with perfectly flat solid #FF00FF magenta, no texture on magenta. Do not move, thicken, resize or redraw any kept silhouette. Keep colors of retained forest/meadow; no text or frame.

### ground

Produce a CUTTING MATTE for this exact 3:2 landscape screenprint. Keep ONLY the closest green meadow strip in the bottom roughly 18% of the canvas, including tiny grasses/seedlings and its irregular top edge following a grassy band, exactly in place. Everything above this nearest grassy strip including taller trees, forest, mountain and sky becomes perfectly flat solid #FF00FF magenta. No texture on magenta, no zoom/crop/redraw, identical full canvas. No text or frame.


## Cuts and validation

- Four registered full-grid planes: clear sky, snowy mountain, forest/meadow, nearest meadow strip. Source grid 2172 × 1448, web copies 1536 × 1024. Full grids share origin; no sprites trimmed.
- AI forest matte drift and source-color leakage were visible in isolated planes despite exact restack. The final helper uses this scene's blue/green/cream ink separation to restore branch geometry from master colors, and the AI matte for the nearest ground strip. `cut-meadows.py` is scene-specific, not a generic mountain cutter.
- Visible RGB comes from the locked master. AI clean mountain and sky plates fill hidden areas; local normalized color continuation extends under fine branches. The hidden mountain plate still has faint branch-tone continuation near some occluders. Larger separation needs cleanup rather than larger offsets.
- `cut-check.json`: restack maximum difference **0**, mean difference **0**. `expansion.json`: original treated portrait center difference **0**. These checks are lossless PNG checks, not WebP equality or proof of perfect segmentation.
- Visually inspected `isolated-far.jpg`, `isolated-mid.jpg`, `isolated-near.jpg`, and both `motion-left.jpg`/`motion-right.jpg`. Test offsets in source pixels: sky 0, far ±1, mid ±3, near ±5. Small horizontal preview only; no vertical motion, WebGL runtime, or spring behavior validated.
- `crop-desktop.jpg` is a 1440 × 900 centered cover crop. `crop-mobile.jpg` is 390 × 844 at horizontal center .62 to preserve the summit; it is an artwork crop review, not a mobile browser/device test. All depth planes must use the same crop.
- Original source composition is retained in the portrait center. Side outpainting shows subtle vertical sky-tone seams at original bounds; mark the expanded master as a candidate. The original portrait remains usable without invented sides.
- Foreground meadow shadows cross the near/mid boundary and the mid retains duplicated near ground. Strong near-strip movement would expose it. Keep these motion bounds conservative or use a still image.

## Figma

- Existing file: `BHwjRNFmaMra4MUhsSwUXC`, Scenes page `1:48`.
- Section `15:26`, at x0/y4200; root `15:27`; row `15:30`; wide master `15:31`; stack `15:32`; sky `15:33`, far `15:34`, mid `15:35`, near `15:36`; portrait `15:37`.
- Six PNG image fills placed and then verified by Plugin API: all depth rectangles are 2172 × 1448 at x0/y0; portrait 1086 × 1448. The cutting-table screenshot shows matching master/restack and the original portrait.
- One upload transport attempt partly failed; live fills were inspected, missing/changed slots uploaded with fresh URLs, then all six image fills verified. No duplicate nodes created.
- `download_assets` checked once for near node `15:36`. HTTP202, 0 bytes, text/html challenge response. No Figma export round trip claimed. Web files are the local cuts uploaded to Figma, clearly labeled in `scene.json`.
- Node IDs and safe metadata are recorded in `figma.json`, `figma-upload.json`, `figma-verification.json`; ephemeral upload/export URLs excluded.

## Build-facing review

Use `scene.json` and the four local WebPs. Candidate desktop composition has a generous clear sky area and a forest/meadow foreground; mobile keeps the asymmetrical summit and nearby firs. Do not assign a real project/location history from this image. Cello must select the treatment, expanded-side seams need review, and stronger movement needs additional hidden-region work. No production implementation or commit made.

## Parent export recovery

Native get_screenshot isolated PNG image outputs at full source resolution recovered the Figma roundtrip after URL downloads failed. Alpha matches exactly and visible RGB within3/255; see figma-roundtrip.json. WebPs now derive from these Figma renders. Scene/motion limitations above remain.
