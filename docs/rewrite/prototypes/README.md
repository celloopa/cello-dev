# cello.dev rewrite prototypes (throwaway)

Exploration only, 2026-10-12. Not the site, not a plan. Decisions behind it: `../GRILL.md`.
Same structure and content in every direction; only the 3D treatment changes.

| Direction | State |
|---|---|
| **Tokens** (default) | Built. The fresh pass after Cello's "I don't love the current look". |
| Cut paper | Hero + posters built; parked. |
| Construction, Print run | On hold, not built (placeholders load Cut paper). |

## Run

```bash
npm install
npm run dev        # http://localhost:4610/  (index lists the directions)
npm run build && npm run preview   # production build on :4611
node shoot.mjs     # screenshot set → ../shots/ (needs the preview running; uses installed Chrome)
```

URL flags: `?d=tokens|paper` direction · `?stats` frame meter · `?gl=0` the no-WebGL page ·
`?shoot` hides prototype chrome.

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
