# Ramona scene run — 2026-10-12

Status: finished local candidate and Figma upload; aesthetic approval pending. Figma export verification blocked.

## Inputs and treatment

- Private source IMG_3114.HEIC, 4284 × 5712 normalized portrait. Full photo inspected locally; no people observed. No GPS read or recorded.
- Ignored upload derivative `docs/rewrite/private/refs/ramona-photo.jpg`, 1440 × 1920, orientation baked and EXIF stripped.
- Style-only anchor `prototypes/public/gen/style/mirror-lake-a-screenprint.webp`. Photo controls composition, anchor controls inks/edge/grain.
- Treated portrait `master.png` 1086 × 1448. Broad upward forest viewpoint, narrow sky opening and low cascade retained. Fine clouds, needles and water ribbons change; this is an AI treatment candidate, not a literal shader.
- Expanded source grid 2172 × 1448 with portrait bounds `[543,0,1629,1448]`. Outpaint resized to that grid, original stylized portrait mechanically restored. Center max difference 0. Sides invented.

## Exact prompts

### Portrait master

Apply a restrained national-park screenprint treatment to IMAGE 1, Cello's actual Ramona Falls photograph. IMAGE 1 controls the entire composition: SAME portrait 3:4 aspect, exact upward-looking camera, deep forest wall on both sides, irregular narrow opening of blue sky and white cloud running through upper center, major tree trunks and crossing branches, waterfall apex low at approximately 64% image height, broad stepped dark basalt cascade spreading down the lower third to the bottom edge. Preserve relative positions, heights, scale and viewpoint. Do not turn it into a generic tall waterfall, move the cascade upward, add a pool, mountain or horizon, rearrange trees, crop or zoom. IMAGE 2 is STYLE ONLY: flat limited screenprint inks, crisp irregular cut-shape edges, subtle paper grain and restrained simplification. Do not borrow its mountain/lake/fireweed/composition. Match its muted blue, cream, deep forest green, moss olive and slate palette. Cascading white water is cream broken ribbons over dark basalt, retaining the photographed cascade structure. Dense foliage has coherent grouped screenprint shapes but preserves the broad photo silhouettes and openings. Full bleed no text, frame, logo, watermark, people. Output SAME 3:4 portrait composition.

### Side expansion

Outpaint ONLY the flat magenta side margins of this exact Ramona Falls screenprint. Keep the entire central portrait image unchanged including its sky opening and low waterfall crest. Extend existing forest trunks/canopy/understory naturally sideways and lower basalt rocky ground where it reaches the margins. No new waterfall, pools, mountains, buildings, people or horizon. Match the existing limited blue, cream, olive and deep green screenprint inks and fine paper grain exactly. Central picture occupies middle 50% of width; margins are 25% each. Keep full landscape 3:2 output, same image height and viewpoint; no crop or zoom. Only outside original bounds is invented scenery.

### sky

Edit this exact landscape 3:2 Ramona screenprint into a full-canvas SKY clean plate. Remove ALL trees, branches, forest, rocks and waterfall, plausibly extending only the SAME muted blue sky and cream clouds with same screenprint grain. Keep originally visible central sky/cloud shapes at their positions, do not alter viewpoint or crop. No land, trees, water, text or frame. Fill all removed regions with continued sky; output same 3:2 canvas.

### forest

Produce a CUTTING MATTE for this exact landscape 3:2 Ramona screenprint on its identical grid. Keep every forest tree, trunk, branch and foliage silhouette exactly at existing locations. Also keep waterfall/rocks/moss/ground at bottom, so the entire scene except sky remains. Replace ONLY sky and cloud openings, including fine openings between foliage, with perfectly flat solid #FF00FF magenta. No grain in magenta. No moving, enlarging, redrawing, recropping or recomposing. Same 3:2 canvas, no text.

### cascade

Produce a CUTTING MATTE for this exact landscape 3:2 Ramona screenprint. Keep ONLY the central low waterfall AND its contiguous basalt rock mound and moss, from the waterfall crest at about64% image height through the bottom edge. Preserve every outer rock/moss silhouette and waterfall ribbon position and exact relative scale. Exclude all upright forest, side trees, branches, distant sky. Everything outside the cascade rock mound becomes perfectly flat solid #FF00FF magenta, with no magenta grain. Source crop/viewpoint/canvas3:2 unchanged. No text.

### clean

Edit this exact landscape 3:2 Ramona screenprint into an occluded-background fill plate. Remove ONLY the low central waterfall and contiguous basalt rock mound in lower third. Continue the existing dark green forest floor, moss and understory naturally behind where the cascade was. Keep all upper trees and sky unchanged. No new waterfalls or sky in lower third. Preserve screenprint palette, grain, original3:2 crop and viewpoint. No text or border.

## Cuts and validation

`prototypes/tools/cut-ramona.py` creates three source-registered planes: sky, forest framing, connected cascade/basalt. All visible RGB comes from the locked expanded master. AI mattes supply candidate regions; source ink refinement recovers sky edges and a manually bounded source-grid polygon constrains the cascade because its generated silhouette rose above the real crest. Cream candidates must also overlap generated sky neighborhoods, preventing pale trunk highlights becoming holes. Hidden regions use the generated clean plate with local source-color bleed at thin edges.

Run: `python3 docs/rewrite/prototypes/tools/cut-ramona.py docs/rewrite/prototypes/public/gen/layers/ramona`

- Full PNG planes 2172 × 1448, web planes 1536 × 1024, shared origin and grid.
- Source restack max/mean difference 0. This validates coverage/color, not cut quality.
- Isolated planes and both ±2 forest / ±4 cascade source-pixel extremes inspected. Restrained movement only. Background fill retains tiny cream water remnants near cascade’s left edge; conservative mask puts some rock-boundary pixels in forest. Larger motion would reveal these.
- Mobile 390 × 844 center cover crop keeps the sky opening/cascade; 1440 × 900 desktop cover clips cascade base. Canvas recomposition/camera crop is a builder decision.
- Clean-plate generation initially hit a network error; same prompt retried successfully.

## Figma

Existing file `BHwjRNFmaMra4MUhsSwUXC`, Scenes `1:48`. Section `15:2` at x0 y2100; root `15:3`; expanded master `15:10`; layers frame `15:13`; sky `15:14`, forest/mid `15:15`, cascade/near `15:16`; portrait `15:20`. All created IDs in `figma.json`. PNG raw image/png upload succeeded on all five rectangles. Initial screenshot and dimensions verified; refined sky/forest uploaded again after source-edge refinement. Layer stack rest matches master visually.

Download endpoint checked once: HTTP202, zero bytes, text/html. Figma round trip blocked; no base64 workaround. WebPs are local source cuts and labeled accordingly. One accidental retry of used single-use upload URLs was rejected; fresh URLs used for the refined two planes. Ephemeral URLs stay out of tracked docs.

## Limitations

- AI style treatment changes fine needles, branches, clouds and water ribbons; broad upward viewpoint/low cascade retained, user approval pending.
- Expanded sides are invented; stylized portrait center is mechanically unchanged.
- Three planes only; waterfall and basalt stay connected. Water motion would require a separate shader/mask.
- Only forest ±2 and cascade ±4 source pixels inspected. Fine-edge color halos remain possible; do not increase travel without cleanup.
- Cascade silhouette is conservative and retains forest at extreme bottom corners; hidden fill has faint residual water near left edge.
- Centered desktop cover crop clips waterfall base. Mobile center crop keeps opening and cascade; actual responsive canvas composition pending.
- Figma export endpoint returned empty HTTP202 text/html challenge; served WebPs are explicitly local cuts.

Final isolated-sky inspection found dark/cream local-continuation specks beneath the foreground foliage. They are hidden at rest, and both small shifted previews were inspected, but the sky plate needs cleanup for larger travel. Final refined Figma screenshot and both changed image hashes verified. No live animation, production integration or on-device mobile test claimed.

## Parent export recovery

Native get_screenshot isolated PNG image outputs at full source resolution recovered the Figma roundtrip after URL downloads failed. Alpha matches exactly and visible RGB within3/255; see figma-roundtrip.json. WebPs now derive from these Figma renders. Scene/motion limitations above remain.
