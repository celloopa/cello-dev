# cello.dev rewrite prototypes (throwaway)

Exploration only, 2026-10-12. Not the site, not a plan. Decisions behind it: `../GRILL.md`.
Same structure and content in every direction; only the 3D treatment changes.

| Direction | State |
|---|---|
| **Tokens** (default) | Built. The fresh pass after Cello's "I don't love the current look". |
| **Landscape** (`?d=landscape`) | Hero + focus built from the real cut layers (Mirror Lake, Ecola). Storyboard beats 01–03; see below. |
| Cut paper | Hero + posters built; parked. |
| Construction, Print run | On hold, not built (placeholders load Cut paper). |

## Run

```bash
npm install
npm run dev        # http://localhost:4610/  (index lists the directions)
npm run build && npm run preview   # production build on :4611
node shoot.mjs     # screenshot set → ../shots/ (needs the preview running; uses installed Chrome)
```

URL flags: `?d=tokens|paper|window|landscape` direction · `?stats` frame meter · `?gl=0` the no-WebGL page ·
`?shoot` hides prototype chrome · `?place=mirror-lake|ecola` the landscape's scene (default Mirror Lake).

## How it's built

- `shared/main.js`: the only JS loaded up front (theme, ⌘K `<dialog>`, text reveals, the 3D gate).
  No 3D under reduced motion, Save-Data, 2G, no WebGL, or `?gl=0`; otherwise three.js loads on
  idle after paint.
- `shared/stage.js`: renderer, camera at 1 unit = 1 CSS px, DOM tracking, render-on-change
  loop (idle = 0 GPU), DPR caps, hidden-tab pause, context-loss fallback.
- `shared/choreo.js`: the shared moves (assemble, handoff, arrive, fan out).
- `directions/tokens.js`: one `THREE.Points` draw call; positions/colors/sizes computed in the
  vertex shader from per-token attributes. Images sampled once into one-texel-per-token canvases.
  Once tokens land, the crisp DOM image takes over.
- Tokens come from the audit session's proposal (`shared/tokens.css`).

## Measured (2026-10-12, production build)

| Budget | Target | Tokens |
|---|---|---|
| First-paint JS | ≤ 30 KB gz | **2.0 KB** (`main.js`) |
| three.js + stage (after paint) | ≈150–180 KB gz | **143 KB** + choreo 11.4 KB + tokens 4.0 KB |
| CSS | — | 4.0 KB gz |
| Fonts | 2 preloaded | Geist Mono latin 400/700/900, ~10 KB each (woff2). Not preloaded yet; preload 400/700 in the real build |
| LCP, mobile, Fast 4G + 4× CPU | ≤ 2.0 s | **1.51 s** |
| CLS | ≤ 0.05 | **0.00** |
| Lighthouse accessibility (mobile) | 100 | **100** (best practices 100; SEO 91 = prototype server has no robots.txt) |
| Scroll through the handoff, 4× CPU | ≥ 30 fps phone | 100 fps, p95 10.9 ms, 0 frames > 33 ms, stage CPU 0.85 ms/frame. **Caveat:** Mac GPU with throttled CPU; a real phone GPU still needs testing on a device |
| Draw calls | — | **1** (Tokens), ~13.4k tokens desktop / ~6.6k phone |
| Reduced motion | still, no waiting | No 3D; text visible at once; verified in shots `*-reduced.jpg` |

## Known trade-offs

- Mid-flight, tokens pass behind the hero and Work text for about a second. Text stays on top
  and crisp, but the moment is busy. Fix options if picked: keep the flight path out of the
  text column, or fade tokens near text.
- Daybreak's poster crops its 1820×1519 screenshot to 1200:630 (same as today's site).
- Grid resolution caps how much detail tokens carry; they're a transition, never the resting
  image (the crisp DOM image is).

## Landscape direction (`home.html?d=landscape`, 2026-10-12)

Build of STORYBOARD.md beats 01 Arrival, 02 Admire and 03 Focus, from the cut layers (Q21: text
may sit over the art). Same home.html content; no new copy, no placeholders were needed. UI labels
"Take in the view", "Back to Cello" and "All work" come from the storyboard.

- `shared/scenery.js` (DOM, no three.js): reads the scene from the manifests
  (`gen/scene-library.json`; Ecola also `gen/layers/ecola/scene.json`), stacks the layer webps as
  a still, adds the ink atmosphere, location label, admire controls and the bar's reading context,
  and runs the attention states. The still *is* the page under reduced motion, `?gl=0`, no WebGL,
  or a texture failure; otherwise it stays hidden under the canvas.
- `directions/landscape.js` (three.js, after paint): the same `<img>`s as textures (no second
  download), cover-fit with one scale plus just enough overscan; arrival (sky fades, far → mid →
  near drop in with damped springs, overshoot ≈11% on the nearest only); desktop pointer depth /
  mobile scroll depth through per-layer springs **clamped to the scene's tested travel**; reading =
  blur (separable Gaussian at half CSS resolution) + brightness/saturation per layer, cross-faded.
  Renders only while something moves; ambient micro-motion ≤ 30 fps and only for 15 s after input.
- `scenes/art-shader.js`: color helpers, Dusk grade, micro-motion and texture prep, now shared with
  the window (`directions/window.js` imports it; output unchanged, mean pixel diff 0.23/255).
- `shared/landscape.css`: layout, scrims and state styles, scoped to `data-direction="landscape"`.

Travel caps (source px → screen px at 1440×900; vertical in brackets):

| Scene | Source of the caps | sky | far | mid | near |
|---|---|---|---|---|---|
| Mirror Lake (1536 grid) | window prototype's runtime travel, constant in source px at 1280–1920 | 1.2 [0.6] → 1.2 | 6 [3] → 6.0 | 18 [9] → 18.0 | 38 [19] → 37.9 |
| Ecola (2172 grid) | `scene.json` testedHorizontalSourcePx; vertical untested → 0 | 0 | 1 → 0.67 | 4 → 2.67 | 6 → 4.01 |

On a 390×844 phone the same caps are 0.79–0.91× (Mirror Lake near 30.2 [15.1] px); Ecola has no
scroll depth (vertical untested). Reading drops travel to 0.

Measured (2026-10-12, headless installed Chrome on this Mac; shots `../shots/landscape-*.jpg`):

| Check | Result |
|---|---|
| First-paint JS | **2.2 KB gz** `main.js` (shared with every direction) · CSS 6.9 KB gz for all directions |
| Right after paint (no three.js) | `scenery.js` **2.9 KB gz** |
| After paint, WebGL only | three.js 141.1 KB + `landscape.js` 4.1 KB + `art-shader.js` 1.5 KB gz (transferred: 149.6 KB JS total) |
| Scene images | Mirror Lake 4 webps ≈ 586 KB, fetched once (still + textures share them) |
| LCP / CLS, mobile, ~Fast 4G + 4× CPU (preview build) | LCP 0.50 s (hero copy) · CLS 0.000 · scene running ≈ 2.0 s · desktop CLS 0.006 |
| Pointer extremes | every plane exactly at its cap (logged offsets), springs back to rest |
| Loop | 0 frames in 1.5 s of still reading, 0 frames 17.5 s after the last input, 0 while hidden |
| Focus vs approved v2 dim | luminance 35.6 vs 34.1 (sharp 97.9), sharpness 0.26 vs 0.26 (desktop); mobile 33.1 vs 32.2 · `../shots/landscape-focus-vs-reference.jpg` |
| Text contrast over the scene (p99 brightest px under each line) | all lines pass 4.5:1 (small) / 3:1 (large) in arrival, admire and focus, both scenes, 1440 and 390, and the `?gl=0` still |
| Console | none from this code; the page's missing `/favicon.ico` 404 predates it (also in `?d=window`) |
| Reduced motion / `?gl=0` | still + text at DOMContentLoaded, three.js never requested; reading uses the CSS reference filter |
| Texture failure (near.webp blocked) | still shown, one `[landscape] 3D disabled` warning |
| Loaded in a hidden tab (`document.hidden` from before load, 8 s) | still stays on screen, 0 frames, no 6 s fallback (it counts visible time only); on visible the canvas takes over already settled after its first frame. Hidden mid-load: same |

Provisional: display type is system sans (no National Park / Switchback files in this repo);
Ecola's copy scrim (85%) reads as a visible dark patch over its sky; Ecola's outpaint joins
show as vertical seams at desktop framing (in the asset); Dusk grade is WebGL-only (the still is
Day art in both themes); decorative lettering behind the trees is not built; `asheville.html`
doesn't know `landscape` and falls back to the window direction. Not tested on a real phone GPU.

