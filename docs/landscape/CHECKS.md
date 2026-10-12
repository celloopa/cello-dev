# Landscape build: checks (S0–S1, 2026-10-12)

Branch `claude/landscape-build`. Production build served by `astro preview` on this Mac; browser
checks in headless installed Chrome through `playwright-core` (GPU on, so WebGL runs). The scratch
scripts that produced these numbers are not committed. Shots: `shots/` (JPEG q82).

## Build

`pnpm build` (= `tokens --check` + `astro check` + `astro build`): **green**. Tokens up to date, no
new raw values or hand-built patterns, `astro check` 89 files with 0 errors, 0 warnings and 0 hints, and the
build itself has 0 warnings. `raw-baseline.json` ratcheted down (index.astro's old literals gone,
nothing added).

## URL contract (`docs/ship/PROFILE.md` on `claude/ship-conductor`)

| Check | Result |
|---|---|
| 16 URLs | all **200** |
| `/projects/ad-asset-directory`, `/projects/ascendant-traders` | 404 on `astro preview`, which doesn't serve Netlify's `_redirects`. `public/_redirects` is unchanged on this branch, so the 301s are Netlify's to serve (check on the branch preview) |
| 8 expected 404s | all **404** |
| `/cv.json` | parses; label unchanged |
| resume PDF | starts `%PDF-`; `cv.json`, `public/files`, `_redirects` untouched |

## Behavior (home, Mirror Lake)

| Check | 1440×900 | 390×844 |
|---|---|---|
| Arrival | text at first paint; the renderer assembles behind it, sky → far → mid → near (`1440-arrival-0.3s.jpg`); settled by ≈2 s | same, half the drop |
| Pointer extremes | every plane exactly at its cap, then springs back to rest: sky 1.2/0.6, far 5.99/2.99, mid 17.96/8.98, near 37.92/18.96 screen px (x/y), the prototype's numbers | no pointer depth; scroll depth on the same caps |
| Admire | "Take in the view" hides the intro (inert), the view names the place; focus goes to "Back to Cello"; Esc or the button returns focus to "Take in the view" (both motion modes) | same |
| Reading | engages as the Work section crosses 62% of the viewport (out at 72%); the focus recipe reaches 1; the place label goes (opacity 0); the bar shows the project in view ("Asheville Dispensary", then "Ghosted") + All work | same (the section header names itself first) |
| Loop | 0 frames in 1.5 s of still reading; 0 frames 18 s after the last input | same |
| Reduced motion | the still with the CSS focus recipe; text at once; the renderer chunk is never requested | same |
| `?gl=0` (no WebGL), Day | the still | same |
| Texture failure (near.webp blocked) | the still; one `[scene] 3D disabled` warning (expected) plus the blocked request's own error | — |
| Loaded in a hidden tab (hidden from before load, 8 s) | the still stays on screen, 0 frames, no 6 s fallback; on visible the canvas takes over already settled (near layer fade 1) | — |
| Keyboard | Tab order: skip link, Cello (home), Work, About, Writing, Design System, Resume, Menu, theme, View Case Studies, View Resume, Take in the view, then the case studies | — |

**Console:** zero errors and zero warnings from this code in every run above (the only entries are
the two induced by the texture-failure test).

## Text over art: contrast (each line vs the 99th-percentile brightest pixel under it)

Method: every text line over the scene (Range client rects of each text node; text on its own
fill, like the green button, and text on media excluded), measured with the text hidden and
everything else as rendered. The lowest ratio per state (states: arrival, Admire, reading at
every viewport step down the page, settled):

| State | 1440 small | 1440 large | 390 small | 390 large |
|---|---|---|---|---|
| Dusk, WebGL: arrival | 11.04 | 10.10 | 11.02 | 9.86 |
| Dusk, WebGL: Admire | 14.05 | 12.19 | 12.73 | 11.70 |
| Dusk, WebGL: reading | 10.78 | 5.59 | 11.08 | 6.15 |
| Day, WebGL: arrival | 10.00 | 5.00 | 8.44 | 5.06 |
| Day, WebGL: Admire | 11.41 | 7.02 | 8.46 | 7.85 |
| Day, WebGL: reading | 7.72 | 3.53 | 9.48 | 4.40 |
| Still (reduced motion, no WebGL; Day art in both themes): arrival | 9.83 | 4.91 | 8.14 | 4.21 |
| Still: Admire | 11.24 | 7.13 | 8.64 | 7.95 |
| Still: reading | 7.71 | 3.54 | 9.38 | 4.35 |

**0 failures** of 4.5:1 (small) / 3:1 (large) across 1,136 measured lines. One failure found and
fixed on the way: How I Build's green "Proof: …" links measured 4.46:1 over the focused still;
they now use `--text-on-art-muted`. Thinnest margin: the green section titles while reading in
Day (3.53:1, large text, needs 3).

## Performance (home)

Throttling: Chrome DevTools presets through CDP, 4× CPU, cache off, median of 5.

| Profile | LCP | FCP | CLS (max) | LCP element |
|---|---|---|---|---|
| **Phone 390, Fast 4G** (9 Mbps, 60 ms) | **0.30 s** | 0.30 s | **0.000** | the hero summary |
| Desktop 1440, Fast 4G | 0.31 s | 0.31 s | 0.000 | the hero summary |
| Phone 390, Slow 4G (1.6 Mbps, 150 ms) | 0.64 s | 0.64 s | 0.0005 | the hero summary |
| Desktop 1440, Slow 4G | 0.63 s | 0.63 s | 0.0003 | the hero summary |

Targets: LCP ≤ 2.0 s and CLS ≤ 0.05, both met. Slow 4G CLS was 0.079 before the fix (the menu key
label and the Admire button now settle before paint). On Fast 4G the WebGL scene takes over at
≈0.9 s, and at ≈4.4 s on Slow 4G (the still never shows meanwhile: the copy sits on the ink).

## Weight (home, production build)

| | gzip |
|---|---|
| First-paint JS (module scripts) | **16.2 KB**: ⌘K menu + Svelte runtime 13.2, Scene DOM half 2.5, bar 0.2, theme util 0.1 |
| Inline scripts | head script (theme, 3D gate, menu key) 0.7 KB; Astro's island loader for the ⌘K menu 1.5 KB |
| CSS | 8.0 KB |
| After paint, only when the 3D gate allows: three.js + renderer | **128.9 KB** (512 KB min) |
| Scene images (Mirror Lake, 4 WebPs, shared by the still and the textures) | 574 KB transferred |
| Fonts transferred on home | 111 KB (Geist Mono 400/700/800, National Park Variable latin, Switchback) |
| HTML | 11.0 KB |

## ui:shots (`scripts/ui-shots.mjs`, exact)

Against the migration's head (`58b4c81`, built from a clean export): **4 of 48 screens changed,
all home** (1440 and 390, dark and light). The other 44 (projects, case studies, blog, post,
resume, design-system, card, 404) are 0 px.

## Known limits

- The still is Day art in both themes (the Dusk grade is WebGL only), as in the prototype.
- Not tested on a real phone GPU.
- Ghosted's card media (today's `swipe-keep.webm`) shows a real resume; D3 says case-study
  artifacts use demo personas. Content is today's, unchanged here; it's Cello's call.
