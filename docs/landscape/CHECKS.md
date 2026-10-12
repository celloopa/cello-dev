# Landscape build: checks (S0–S2, 2026-10-12)

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
- D3 (demo personas only): see S2 below. The swipe-keep clips are now demo-only; several
  Ghosted stills still show a real resume.

---

# S2: case studies and posts in the landscape (2026-10-12)

Same setup as above (production build on `astro preview`, headless installed Chrome with the GPU
on). Pages: the four case studies (Asheville Dispensary → Over Hood, Ghosted → Ecola,
VegAvengers → Sauvie, Daybreak → Meadows) and the two live posts (Designing for the Second User
→ Moss Falls, Programmatic Resumes → Bald Mountain; the rotation hash picks them). Shots:
`shots/s2/`.

## Merges before S2

- `claude/design-system-migration` @ 01c79e4 (2c + stage 3 Day), then @ e1e313e (the
  public-docs strip, which contains `master` e10cc19; merging `origin/master` afterwards was
  already up to date). The conductor's strip check (local paths, private Figma and board links,
  the team name) over `docs/` and `src/` comes back empty.
- Home after the merge, Day and Dusk: contrast re-run, **0 failures**, the same minimums as the
  S1 table above (e.g. Day WebGL reading 7.72 small / 3.53 large at 1440).

## Build and URL contract

`pnpm build` green: tokens up to date, no new raw values; `astro check` 95 files, 0 errors,
0 warnings, 0 hints. `raw-baseline.json` ratchets 401 → 277 (the old [slug] templates' and media
components' literals). The 16 URLs are 200; the 8 expected 404s are 404 (the two drafts
included); `cv.json` parses, the PDF starts `%PDF-`; the two 301s are Netlify's (unchanged
`_redirects`).

## Behavior (6 pages × 1440/390 × Day/Dusk = 24 runs)

| Check | Result |
|---|---|
| Reading state at first paint | `html.scene-reading scene-read-page` from the server; still filter `blur(7px) brightness(0.45) saturate(0.65)` (390: 5px, .36, .6); `--atmos-read` 1; place label opacity 0 |
| Renderer | arrives settled and focused: focus 1, every plane's travel 0,0, every layer faded in (no assembly) |
| Nearly still | **0 frames** in 1.5 s idle and **0 frames** while the pointer sweeps the window and the page scrolls 600 px, in all 24 runs |
| Bar | the h1's title + "All work" → /projects (posts: "All posts" → /blog); context not inert; Work and the utility links hidden; menu and theme kept ("Switch to Day" / "Switch to Dusk") |
| Prose (2c) | direct-child paragraphs in Geist Variable at 31em (1440; full column at 390); h2 National Park; h3, captions and CaseMeta Geist Mono; body links underlined |
| End | next story (case studies by order, wrapping; posts newest first), the previous one, the index; footer Work + About · Writing · Contact · Resume |
| Horizontal overflow | 0 px everywhere |
| Reduced motion | the still with the CSS focus recipe; the renderer chunk is never requested |
| `?gl=0`, Day | the still; no renderer request |
| Hidden tab (Daybreak, hidden from before load, 8 s) | the still on screen, 0 frames; on visible the canvas takes over already focused (2 frames) |
| Day across navigation | Day picked on /projects/ghosted → "All work" (full load of a Layout page) → /resume (ClientRouter swap, same window) → /projects/vegavengers (full load): `data-theme="light"` throughout |

**Console:** none (zero errors, zero warnings, no failed requests) across every run above and the
contrast runs.

## Ghosted: the Loop video (MediaVideo)

| Check | 1440 | 390 |
|---|---|---|
| Plays on screen | `ghosted-loop.webm`, readyState 4, time advancing | same |
| Pause / Play | Pause → paused, time holds, label "Play" ("Play video"); scrolling away and back keeps it paused; Play resumes; Enter on the focused button toggles | same |
| Reduced motion | paused at 0 s on `ghosted-loop-poster.webp`, no `autoplay` attribute, button reads "Play"; 0 videos playing on the page | same |

## Text over art: contrast (S2 pages, top to bottom)

Same measure as S1 (each line vs the 99th-percentile brightest pixel under it; text on its own
fill or on a plate excluded; videos paused). Every viewport step down all six pages:

| State | 1440 small | 1440 large | 390 small | 390 large |
|---|---|---|---|---|
| Dusk, WebGL | 9.83 | 5.70 | 9.83 | 6.28 |
| Dusk, still | 6.92 | 3.60 | 8.35 | 4.42 |
| Day, WebGL | 6.93 | 3.60 | 8.36 | 4.48 |
| Day, still | 6.92 | 3.60 | 8.35 | 4.42 |

**0 failures** of 4.5:1 / 3:1 across 15,316 measured lines. Thinnest margin: VegAvengers' green
h2 "Publishing Without F…" in Day (3.60:1, large text, needs 3). Small green text never sits on
art: labels over art use `--text-on-art-muted`, and CaseMeta, FlowDiagram, tables, quotes and
inline code sit on `bg-plate`.

## Performance (Ghosted, the longest case study)

Phone 390, Fast 4G, 4× CPU, cache off, median of 5: **LCP 0.38 s** (the lede), FCP 0.38 s,
**CLS 0.0008**. Desktop 1440 Fast 4G: LCP 0.39 s, CLS 0.019. The renderer (129.9 KB) arrives at
≈1.3–1.7 s.

Slow 4G (1.6 Mbps): FCP 0.80 s, but LCP 7.6 s (390) / 8.0 s (1440), and the LCP element is the
scene's near layer. The page's own media (the cover video and nearby images) share the slow
link, so the renderer arrives after the 6 s give-up; the still then fades in and becomes the
largest paint. Text is readable from 0.8 s. Not fixed in S2: see the note for Cello.

## ui:shots (exact, baseline = the migration tip e1e313e from a clean export, two runs)

**28 of 48 screens changed**, all expected: home (the footer's utilities), the four case
studies and the post (the landscape), and `/projects` (86,547 px at 1440: only the Ghosted
card, whose video is now the demo clip). Resume, design-system, card, blog index and 404 are
0 px.

## D3: demo personas only (Ghosted)

Every Ghosted image was OCR'd (tesseract at 2×) and every video frame-sampled (1–2 fps), then
checked by eye.

- **Fixed:** `v3/swipe-keep.webm` (cover and card) and `v3/swipe-keep-full.webm` showed Cello's
  real resume (name, email, LinkedIn, GitHub, city). Both are now Ghosted's own landing clip of
  the made-up "Rowan Ellis" (example.com contact lines), re-encoded to VP9 at the same paths.
  OCR of every frame: only the demo persona. The new `ghosted-loop` video: the same.
- **Still showing the real resume**, left for Cello (no demo replacements exist yet):
  - in the Ghosted case study: `v3/proposal.webp`, `v3/phones.webp`, `v3/style-looks.webp`,
    and `v3/og.png` (the social image);
  - in "Programmatic Resumes You Can Chat With": `v3/highlights.webp` (its cover),
    `v3/interview.webp`, `v3/tailored.webp`, `v3/history.webp`, `v3/edit-style.webp`,
    `v3/archetype.webp`, `v3/report.webp`.
- Possible tester data: `v3/signin.webp`'s access-code placeholder reads "e.g. kim-7x2qpd".
- Clean: the brand and design-system images, `board`, `board-dark`, `category`, `fit`,
  `intake`, `research`, `tour-look`, and every `web/*` image (demo "Sam Rivera").
- The old files stay in git history.
