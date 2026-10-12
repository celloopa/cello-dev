# Ecola scene run — 2026-10-12

Status: photo-treatment/cut candidate and native Figma PNG round trip complete; aesthetic approval pending. Generated master is a candidate, not an aesthetic selection by Cello.

## Inputs and method

- Original: private Ecola coast photo, inspected locally at full resolution. No people observed.
- Upload derivative: ignored `docs/rewrite/private/refs/ecola-photo.jpg`, orientation normalized to 1440 × 1920, no EXIF.
- Style anchor: approved Mirror Lake screenprint A. The photo controls composition; the anchor controls ink/edge/grain treatment only.
- First stylized master: `prototypes/public/gen/layers/ecola/master.png` and `master.webp`, 1086 × 1448 (3:4).
- Original trunks, foreground path, coastal opening, and sea-stack arrangement broadly retained by visual inspection; this is not a pixel-identical shader. Fine branches and cloud/haze shapes change. Keep the deterministic-shader fallback open if consistency proves inadequate.
- Cello authorized expanding portrait scenes. Outpaint only beyond original edges; preserve the stylized center mechanically when assembling the expanded master. Do not stretch the photograph.
- Planned layer order: sky/haze → ocean/rocks → forest framing → near ground/path. Keep source grid and source colors; AI cutting edits are masks/hidden fills rather than replacement visible art.
- Figma placement and bounded depth checks completed below; export round trip remains blocked.

## Exact master prompt

Apply a screenprint style treatment to IMAGE 1, Cello's actual Ecola coast photograph. IMAGE 1 controls the ENTIRE composition: retain its portrait 3:4 aspect ratio, the exact camera viewpoint, crop, large left tree trunks, major thick trunk just right of center, crossing branches framing an opening, ocean horizon seen through that opening, exact arrangement and relative scale of offshore rock stacks in the lower middle, and descending foreground path at bottom. Do not recompose, widen, crop, move the horizon or tree trunks, add mountains, buildings or people, or invent new landforms. Think of a stylizing shader on the same photograph, not a new illustration of the location. IMAGE 2 is STYLE ONLY: transfer its flat national-park screenprint inks, crisp irregular cut-shape edges, restrained layered simplification, subtle paper grain and ink coverage. Do not borrow IMAGE 2's mountain, lake, fireweed, clouds or composition. Keep the fine branched tree silhouettes legible but simplified into printable shapes. July coast palette: pale fog/sky #bed4e3, distant ocean/rocks #9aa7ab and muted blue grey, light surf #e2ecf1, near forest #202118 deepened toward #001a11, ground #656b61 plus restrained moss green. Warm paper highlights #f3ede2. Full bleed, no text, logo, border, frame, watermark. Preserve the pictured scene identity and composition, including its dense forest foreground. Output the SAME portrait 3:4 composition as image 1.

## Exact portrait cutting/fill prompts

### clean

Edit this exact portrait screenprint as a background clean plate for depth compositing. Remove ALL foreground forest trunks, branches, foliage, grass, roots and path. Reveal and plausibly continue the same coastal sky, haze, ocean, surf and offshore rock stacks behind them. Preserve the original sea horizon at roughly 59 percent of image height, exact visible rock-stack positions and scale in lower middle, palette, grain and portrait 3:4 canvas. Do not add extra rocks or change viewpoint. Keep all originally visible sky/ocean/rock pixels visually unchanged; fill only the removed foreground. Full bleed no text.

### sky

Edit this exact portrait screenprint to produce its sky background plate. Remove ALL foreground trunks, branches, foliage, ground, all ocean, surf and offshore rocks. Continue only the SAME pale blue/grey sky, broad cream haze/cloud bands, screenprint grain and inks to fill the entire canvas, including hidden regions. Preserve the visible sky shapes and their positions. No land, sea, trees, horizon, text or border. Same portrait 3:4 canvas.

### forest

Produce a CUTTING MATTE for this exact image on its identical portrait 3:4 pixel grid. Keep ALL foreground forest tree trunks, branches and needle/leaf silhouettes, roots, grasses, shrubs and descending path exactly where they are, including fine openings between branches. Remove only background sky, clouds, ocean, foam and offshore rocks, replacing them with perfectly flat solid #FF00FF magenta with no grain. Do not move, redraw, thicken or resize any foreground silhouette. The kept art may retain its source colors; no text or border.

### ground

Produce a CUTTING MATTE for this exact portrait image. Keep ONLY the lowest foreground path, roots, grass and low shrubs at the bottom approximately quarter of the image; preserve the exact irregular top silhouette of this ground vegetation and exact positions. Do not retain upper tree trunks or branches: below the ground's irregular top edge the path/soil/tree roots may remain, above it all tree trunks/branches/sky/sea become perfectly flat solid #FF00FF. Keep the source canvas and viewpoint unchanged, no zoom/crop/redraw. Solid magenta outside this nearest ground strip; no text.

## Expansion and wide cuts

### Exact outpaint prompt

Outpaint ONLY the solid magenta left and right margins of this landscape canvas. The central portrait screenprint is fixed existing art: keep its entire width, vertical extent, scale and position unchanged. Continue the Ecola coastal forest naturally into both side margins, extending the same tree branches, near forest floor/grass and ocean/sky behind them. Maintain the same horizon height, lighting, ink colors, restrained flat screenprint shapes and fine paper grain. Do NOT add mountains, people, buildings, text, borders or frames. Do NOT crop, zoom or move the central trees, path or sea stacks. This is canvas extension beyond the existing photo-derived composition, not a new composition. Output a landscape 3:2 canvas; replace all magenta with plausible continuation.

### clean

Edit image 1 as a hidden-background clean plate. Remove ALL foreground forest trees/trunks/branches/needles/grass/soil/path; continue ONLY the same sky and ocean/coast behind them. Preserve landscape 3:2 viewpoint and horizon at 59.4% from top. Preserve existing visible sea stacks, surf and sky where they currently show. Plausibly fill the hidden ocean down to the bottom. Same flat screenprint inks and paper grain, no new mountain/people/buildings/text. No camera movement or crop.

### forest

CUTTING MATTE for image 1. Retain ALL foreground forest trunks, branches, needles/leaves, shrubs, grass, roots and path exactly on the source grid. Replace ONLY sky/haze/clouds, ocean, offshore rocks and surf with perfectly flat #FF00FF magenta. Retain holes between fine branches as magenta. Preserve every silhouette, position, scale and irregular edge. No redesign, crop or zoom. Same landscape 3:2 aspect ratio. Source colors within the kept forest; flat magenta elsewhere.

### ground

CUTTING MATTE for image 1. Keep ONLY the nearest bottom foreground grass, low shrubs, soil, roots and descending path. Preserve the irregular top silhouette of this ground strip (roughly the bottom quarter) and its exact source position. Everything above that irregular silhouette, including upper tree trunks/branches, ocean and sky, becomes perfectly flat #FF00FF magenta. Preserve source colors and same landscape 3:2 canvas, no redraw, reposition, crop or text.

## Result and checks

The 3:4 treated master is 1086 × 1448. The expanded grid is 2172 × 1448, with the original portrait restored at [543, 0, 1629, 1448]; the center crop has zero pixel difference. Sides are AI outpainted, not a claim of actual geography.

Four planes: sky, ocean/rocks, forest framing, near ground. PNG restack matches the locked wide master with maximum and mean RGB difference zero. This validates color/coverage only. Source-color mask refinement and local color continuation under thin branches reduced tonal halos. Inspected motion-left with far1/mid4/near6 source-pixel travel; large travel remains unproven and needs hidden forest cleanup. Web copies1536 ×1024.

Figma Scenes section6:2, expanded master6:10, portrait6:21, stack6:13, planes6:14–17. All six PNG uploads succeeded; layer origins/sizes/fills and whole cutting-table screenshot verified. Download returned empty HTTP202 challenge; native exportAsync produced expected PNG byte counts, but large JSON output exceeded20KB and io.write exposed no retrievable files. Therefore storyboard v3 uses matching LOCAL cuts, not Figma exports. Round trip remains pending. See scene.json, cut-check.json, expansion.json, figma-upload.json, figma-roundtrip.json.

Aesthetic approval is pending. Treatment preserves major photographed composition, but changes fine branches/haze; keep deterministic shader fallback open.

### Export recovery — completed

The URL download endpoint remained blocked. `get_screenshot` with `contentsOnly:true`, `maxDimension:2172`, `enableBase64Response:true` returned isolated native PNG image blocks. Saved their exact bytes and checked all four:2172×1448, alpha maxdiff0, RGB maxdiff0 where alpha≥128; composite RGB max/mean0 against master. WebPs now derive from these Figma renders. `figma-roundtrip.json` records the checks. A large inline node_repl code string was rejected at its64KB review limit; transporting image data on stdin to a short file-save helper succeeded without embedding it as executable code. No image content was changed in transport. Earlier blocked status describes the failed URL path, not the final state.
