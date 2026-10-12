# Image generation prompts: the window scenes

Run with the `codex-images` skill (`node ~/.agents/skills/codex-images/scripts/codex-images.mjs --from docs/rewrite/imagegen-prompts.md#N`)
from the worktree root
(`/Users/cello_r/Documents/code/astro/cello-dev/.claude/worktrees/rewrite-exploration`).
Selection belongs to Cello; generation runs never judge results.

Context: the site's hero is Cello's desk window; his favorite places show through it. The
kit-drawn shapes (`docs/rewrite/shots/window-*.jpg`) are **storyboards**: composition and depth
plan only. These prompts replace their look with generated art that three.js composites in
depth.

Palettes are the seasonal art inks approved in the identity revision (`identity.md` I3 on
`claude/design-system-migration`).

References live in `docs/rewrite/private/refs/` (git-ignored; photos are re-encoded with no
GPS, date or device metadata). People are never generated.

## Plan

1. **Style frames (this run).** One place, Mirror Lake, in three styles. Cello picks one (or
   asks for a blend).
2. **Layer test (next run, after the pick).** Mirror Lake as separate depth layers on a flat
   `#FF00FF` background that the build keys out: sky, far (Mt Hood), mid (firs + lake +
   reflection), near (fireweed). Proves the layers line up and parallax reads.
3. **The remaining places**, same style and layer recipe, a few per run. Night versions are
   either a color grade in the shader or a separate run, decided after the layer test.

---

## 1. Mirror Lake: screenprint

`outputPath`: `docs/rewrite/prototypes/public/gen/style/mirror-lake-a-screenprint.png`
`references`: `docs/rewrite/private/refs/mirror-lake-photo-3x2.jpg`, `docs/rewrite/private/refs/mirror-lake-storyboard.jpg`
`variants`: 2

> Intended use: background art seen through a window on a personal portfolio website. It will be
> composited in a 3D web scene behind an illustrated window frame. A desk monitor will cover part
> of the lower-right third and a small label sits in the lower-left corner, so keep the key
> subject (Mt Hood and its reflection) in the upper-middle and left-center.
>
> Subject: Mirror Lake, Oregon, on a clear early-autumn afternoon. Mt Hood rises behind a line of
> dark firs; the mountain is mirrored in a calm lake; magenta fireweed stands in the near
> foreground on the left; a few large white cumulus clouds.
>
> References: image 1 is a photo of this exact place (ignore the two blurred patches on the shore). Follow its landscape (the mountain's
> shape and snowfields, the tree lines, the lake, the fireweed), not its exact framing. Image 2 is
> a flat storyboard of the intended composition and depth (sky, far mountain, mid trees, lake,
> near foreground). Follow its composition, not its style.
>
> Style: a 1930s national-park screenprint poster. Six to eight flat ink colors with crisp,
> hand-cut edges; subtle paper grain and slight ink texture; simplified but specific shapes
> (each fir a distinct silhouette, the mountain's snowfields shaped as real glaciers and ridges).
> Light from the upper left. Palette: the September inks taken from this place: sky #4885e3,
> far ridges and lake #38618c, snow #d4dce4, firs #323f44, ground #7c6145, deepened toward
> green-black #001a11 for the darkest shadows, warm paper #f3ede2 for the brightest highlights, and
> the fireweed magenta as the one vivid accent.
>
> Format: landscape 3:2, full-bleed, no border or frame.
>
> Avoid: any text, lettering, signatures, logos or watermarks; people or animals; photographic
> realism; glossy digital gradients; generic vector clip-art; borders or window frames.

## 2. Mirror Lake: gouache

`outputPath`: `docs/rewrite/prototypes/public/gen/style/mirror-lake-b-gouache.png`
`references`: `docs/rewrite/private/refs/mirror-lake-photo-3x2.jpg`, `docs/rewrite/private/refs/mirror-lake-storyboard.jpg`
`variants`: 2

> Intended use: background art seen through a window on a personal portfolio website. It will be
> composited in a 3D web scene behind an illustrated window frame. A desk monitor will cover part
> of the lower-right third and a small label sits in the lower-left corner, so keep the key
> subject (Mt Hood and its reflection) in the upper-middle and left-center.
>
> Subject: Mirror Lake, Oregon, on a clear early-autumn afternoon. Mt Hood rises behind a line of
> dark firs; the mountain is mirrored in a calm lake; magenta fireweed stands in the near
> foreground on the left; a few large white cumulus clouds.
>
> References: image 1 is a photo of this exact place (ignore the two blurred patches on the shore). Follow its landscape (the mountain's
> shape and snowfields, the tree lines, the lake, the fireweed), not its exact framing. Image 2 is
> a flat storyboard of the intended composition and depth (sky, far mountain, mid trees, lake,
> near foreground). Follow its composition, not its style.
>
> Style: a matte gouache illustration on paper. Flat painted shapes with visible brush texture and
> dry-brush edges; soft hand-painted gradients in the sky and the lake; warm late-afternoon light
> from the upper left; a restrained palette built on the September inks taken from this place
> (sky #4885e3, far ridges and lake #38618c, snow #d4dce4, firs #323f44, ground #7c6145), with
> green-black #001a11 in the deepest shadows, warm paper #f3ede2 in the highlights, and fireweed
> magenta as the single vivid accent. Calm and quiet, like a page from an illustrated field journal.
>
> Format: landscape 3:2, full-bleed, no border or frame.
>
> Avoid: any text, lettering, signatures, logos or watermarks; people or animals; photographic
> realism; glossy digital gradients; anime styling; borders or window frames.

## 3. Mirror Lake: risograph

`outputPath`: `docs/rewrite/prototypes/public/gen/style/mirror-lake-c-riso.png`
`references`: `docs/rewrite/private/refs/mirror-lake-photo-3x2.jpg`, `docs/rewrite/private/refs/mirror-lake-storyboard.jpg`
`variants`: 2

> Intended use: background art seen through a window on a personal portfolio website. It will be
> composited in a 3D web scene behind an illustrated window frame. A desk monitor will cover part
> of the lower-right third and a small label sits in the lower-left corner, so keep the key
> subject (Mt Hood and its reflection) in the upper-middle and left-center.
>
> Subject: Mirror Lake, Oregon, on a clear early-autumn afternoon. Mt Hood rises behind a line of
> dark firs; the mountain is mirrored in a calm lake; magenta fireweed stands in the near
> foreground on the left; a few large white cumulus clouds.
>
> References: image 1 is a photo of this exact place (ignore the two blurred patches on the shore). Follow its landscape (the mountain's
> shape and snowfields, the tree lines, the lake, the fireweed), not its exact framing. Image 2 is
> a flat storyboard of the intended composition and depth (sky, far mountain, mid trees, lake,
> near foreground). Follow its composition, not its style.
>
> Style: a risograph print in two inks, lake blue (#38618c) and earth (#7c6145) (this place's
> September inks), on cream paper (#f3ede2). Shading made with halftone dots; where the two inks overlap they make a dark
> olive third color; a slight misregistration between the inks; visible paper grain and uneven
> ink coverage. Bold, simplified shapes; the snow and highlights are the bare paper.
>
> Format: landscape 3:2, full-bleed, no border or frame.
>
> Avoid: any text, lettering, signatures, logos or watermarks; people or animals; more than two
> inks; photographic realism; borders or window frames.

---

# Layer cuts: Mirror Lake (screenprint A is the master)

Cello picked A (2026-10-12). The master is cut into depth layers by **edits of the same image**,
so edges line up. Layers on flat `#FF00FF` are keyed to transparency by
`docs/rewrite/prototypes/tools/key.py`. Then everything goes to the Figma cutting table, and the
three.js window loads the layers Figma exports. Order matters: 4 first; 6–8 edit 4's result.

## 4. Clean plate (fireweed removed)

`outputPath`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/clean.png`
`references`: `docs/rewrite/prototypes/public/gen/style/mirror-lake-a-screenprint.png`

> Edit image 1. Remove the magenta fireweed plants in the left foreground completely. Where they
> were, continue what is behind them: the lakeshore rocks, the lake with its reflections, and the
> low shrubs and firs, drawn in exactly the same screenprint style, inks, edges and paper grain.
> Change nothing else: the mountain, sky, clouds, firs, lake and every edge stay exactly where
> they are. No text, no people.

## 5. Near layer: fireweed only

`outputPath`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/near-raw.png`
`references`: `docs/rewrite/prototypes/public/gen/style/mirror-lake-a-screenprint.png`

> Edit image 1. Keep only the magenta fireweed plants in the left foreground, exactly as drawn:
> same shapes, inks, position and size. Replace everything else (sky, clouds, mountain, trees,
> lake, shore) with one perfectly flat, solid #FF00FF color: no texture, no grain, no shading,
> no gradient. No text.

## 6. Sky layer: sky and clouds only

`outputPath`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/sky.png`
`references`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/clean.png`

> Edit image 1. Keep only the sky and the clouds. Remove the mountain, the trees, the shore and the
> lake, and continue the sky down to the bottom edge as if the land weren't there: the same blue
> and the same screenprint grain, a little lighter toward the bottom, with the clouds unchanged
> where they are. No land, no horizon, no text.

## 7. Far layer: Mt Hood only

`outputPath`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/far-raw.png`
`references`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/clean.png`

> Edit image 1. Keep only Mt Hood, the snow-covered mountain, exactly as drawn: same shape,
> position, size, inks and grain. Continue its lower slopes downward where the firs hide them,
> down to about two-thirds of the image height, in the same style. Replace everything else (sky,
> clouds, trees, lake, shore) with one perfectly flat, solid #FF00FF color. No text.

## 8. Mid layer: firs, shore and lake only

`outputPath`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/mid-raw.png`
`references`: `docs/rewrite/prototypes/public/gen/layers/mirror-lake/clean.png`

> Edit image 1. Keep the firs, the shrubs, the shoreline rocks and the lake with its reflections
> exactly as drawn: same shapes, position, inks and grain. Replace the sky, the clouds and the
> mountain with one perfectly flat, solid #FF00FF color, keeping the treetops' silhouettes crisp
> against it. No text.
