# Over Hood scene run — 2026-10-12

Status: assets and Figma cutting table complete as a candidate; aesthetic approval and wing-edge motion cleanup pending. Three planes: sky, terrain, aircraft wing. Original photo inspected locally; no people observed. Portrait derivative 1440 × 1920, normalized orientation, no EXIF. Original is private.

The style treatment preserves the wing/mountain viewpoint broadly, but simplifies forest detail and strengthens the horizon into cream cloud bands. Expanded sides are invented. Original stylized center restored mechanically with zero difference (expansion.json). No project/location story association is claimed.

## Result and checks

- Locked portrait 1086 × 1448; expanded grid 2172 × 1448; web planes 1536 × 1024.
- `expansion.json`: exact center bounds [543, 0, 1629, 1448], maximum difference 0. Side geography is invented. Slight vertical tone/grain joins remain visible at the expanded boundary, especially left.
- `cut-over-hood.py` keys the generated wing matte, preserves visible master RGB, uses AI clean plate only for occluded background and local color bleed under wing edges. Atmosphere, cloud bank, Mount Hood and ridges stay together. Its upper mask edge crosses clear blue sky above the cloud bank; this is not a separate mountain silhouette cut.
- `cut-check.json`: restack maximum and mean difference 0. Both isolated alpha views, both horizontal extremes, 1440 × 900 desktop and 390 × 844 mobile crops inspected.
- Tested source travel: terrain ±1 px, wing ±5 px, sky fixed. The wing matte is slightly inset at places, leaving a thin original edge in the backing plate; the left extreme shows a ghost line. **Use still composition until edge cleanup.** These numbers are test bounds, not a production motion approval.
- Mobile crop at horizontal center 53% retains the winglet, summit and foreground ridge. No device tilt or runtime motion is implemented.
- Figma Scenes page 1:48, section 14:2 at (0, 6300), master 15:21, registered stack 15:22; sky 15:23, terrain 15:24, wing 15:25. All rectangles are full 2172 × 1448 at shared origin (0,0); PNG uploads succeeded and screenshot/fill dimensions were inspected. Master and stack visually agree.
- One download attempt on wing export returned HTTP 202, zero bytes, WAF challenge. Round trip is blocked; WebPs explicitly originate from local cuts matching the uploaded PNGs. No export fidelity claim.
- Manifest: `prototypes/public/gen/layers/over-hood/scene.json`; scoped helper: `prototypes/tools/cut-over-hood.py`. No production source, shared ledger, or storyboard edited.

## Exact prompts

### Master

Use case: style-transfer. Apply a screenprint treatment to IMAGE 1, the actual portrait aerial airplane photograph above Mount Hood. IMAGE 1 alone controls the composition and viewpoint. Preserve its portrait 3:4 aspect, the large blue clear sky covering the upper third, airplane winglet rising at x44–59% from y13–33%, wing sweeping from that winglet diagonally down to the right edge at y44%, snow-covered Mount Hood peak at x55% y37%, distant rolling horizon, small cloud banks and intricate descending forest ridges filling the lower half. Preserve positions, scales, and silhouettes of the wing and mountain exactly; do not crop/recompose, move the wing or mountain, add features, trees in foreground, buildings or people. IMAGE 2 is STYLE ONLY: flat national-park screenprint ink shapes with crisp irregular edges, restrained layered simplification and fine paper grain. Do not copy its lake, trees, flowers, clouds or composition. Use the photo's cool clear September blue sky, pale cream snow, hazy blue-grey distant ridges, deep muted forest green/navy closer slopes, and blue-grey wing with its existing colored winglet bands. Treat the same photograph, rather than illustrating a new scene. Wing remains recognizable mechanically rigid aircraft geometry, not a plant or abstract shape. Full bleed, no text/logo/border/watermark. Same portrait 3:4 output.

### Side expansion

Outpaint ONLY the perfectly solid magenta margins in this image. The center is a locked portrait screenprint of Cello's airplane view over Mount Hood; keep every center pixel visually unchanged, including winglet, diagonal airplane wing, central Mount Hood summit, sky, distant horizon and forest ridges. Extend the existing blue sky and lower forest ridges smoothly to left and right in the same restrained flat ink screenprint style and fine grain. Continue the airplane wing out to the right edge where it crosses the center boundary, with physically straight consistent geometry. Do not add another mountain peak, plane, foreground object, buildings or people. No new clouds in clear upper sky. Match existing scale, horizon heights and diagonal ridge continuation. Full rectangular landscape 3:2 canvas; no magenta remains, no text, logo, frame. Center must keep exact original viewpoint and mountain position; only side scenery is newly invented.

### clean

Edit this exact landscape screenprint as a hidden background plate. Remove ONLY the complete airplane wing and upturned winglet, including the blue/green tip bands, small lower strakes and broad wing exiting the right edge. Continue the existing blue sky and the same distant mountain ridges/cloud bank plausibly in that occluded area. Preserve Mount Hood summit, terrain, ridges, horizon and all originally visible background positions, scale, colors and grain. Do not remove or move the mountain. No new peaks, trees, objects or airplane. Exact same landscape 3:2 canvas and viewpoint; no crop/zoom. Full bleed no text.

### wing

Produce a segmentation CUTTING MATTE for this EXACT landscape screenprint on the identical 3:2 canvas. Keep ONLY the entire airplane wing and winglet precisely in place: tall curved tip near middle upper left, long diagonal rigid wing to the right edge, and lower strakes. Replace EVERY sky, cloud, mountain, snow, ridge and forest pixel with perfectly flat solid #FF00FF magenta, no grain. Preserve the wing's exact silhouette and position/scale, do not thicken/redraw/crop. Solid magenta through the negative spaces around the wing. Kept pixels may retain colors; no labels, text or border.

### sky

Edit this exact landscape screenprint to create a full sky backing plate. Remove the ENTIRE airplane wing and winglet, all mountains, ridges, snow, ground, cloud bands and distant horizon. Continue only the original clear blue sky and subtle paper ink grain across the full image, maintaining gentle original blue tone changes. No horizon, clouds, objects, mountains or land. Same 3:2 canvas, no text or frame.


## Parent export recovery

Native get_screenshot isolated PNG image outputs at full source resolution recovered the Figma roundtrip after URL downloads failed. Alpha matches exactly and visible RGB within3/255; see figma-roundtrip.json. WebPs now derive from these Figma renders. Scene/motion limitations above remain.
