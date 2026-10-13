# Landscape build: checks (S0–S3, 2026-10-12)

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

---

# S3: /card, the indexes, 404, and the reading pages' slow-network fix (2026-10-12)

Same setup as above: production build on `astro preview` (port 4622), headless installed Chrome
through `playwright-core`, GPU on. Throttling is Chrome DevTools' own presets through CDP: **Slow
4G** = 1.44 Mbps down (1.6 × 0.9), 562.5 ms RTT; **Fast 4G** = 8.1 Mbps (9 × 0.9), 165 ms; 4× CPU,
cache off, median of 5. That RTT is the DevTools preset's, so these numbers run slower than S1/S2's
and compare only with each other (the Ghosted before/after below is one harness). Shots:
`shots/s3/` (JPEG q82).

## What changed

| Page | Now |
|---|---|
| `/card` | The event landing page (below). Same URL, same Save Contact and Share Card. |
| `/projects` | SceneSelector (A3 item 7): today's list, copy and order, each with its place's swatch; hover or focus brings the place in behind the list. Archived and retired case studies stay off, as today. |
| `/blog` | Today's published posts, newest first, each with its place's swatch (the post rotation). Drafts stay off. |
| 404 | Today's words ("404", "Page Not Found", "Back to home") over home's scene, arriving as home does. |
| Case studies, posts, `/projects`, `/blog` | Paint a half-size focused still at first paint (the slow-network fix). |
| `/watchlist`, `/design-system` | Unchanged, on today's Layout. `/design-system` shows the Day and Dusk swatches, which a scene page's Dusk-in-both-themes roles would misstate, and the watchlist is a stub the inventory marks "Never". Not cheap and safe, so they wait. |
| `/resume` | Unchanged (stage 3 owns it). |

New pieces, all on tokens: SceneLayout `focus` (html.scene-focus-page), Scene `focused` (the
reading still), SceneSelector, `pnpm scenes:derive` (swatches, the reading still, the case-study
panels' flattened copies, the /card artifacts). One new token, `--type-display-card`; one shared
keyframe, `sceneSettle`. `raw-baseline.json` ratchets 277 → 179 (deletions only).

## /card

1. **First screen:** the name (National Park, one line from 769 px up; two lines on phones),
   cv.json's role line, Portland, Oregon, then **Save Contact** and **Share Card**, two-up, 88 px
   tall, their bottom edge at 695 of 844 px on a phone, and today's share note. Over Mirror Lake:
   the arrival assembles the scene behind the words once the renderer is in.
2. **The case studies:** Asheville Dispensary over Over Hood, Ghosted over Ecola, VegAvengers over
   Sauvie Island, Daybreak over Mt Hood Meadows (`scene-pairings.json`). Each panel is a window onto
   a picture fixed to the viewport, so scrolling reveals one place over the last, and the picture
   settles from `--focus-scale` to rest along the panel's scroll timeline (`--ease-out`). Each has
   the place name (Switchback), the role, the title linking to the case study, one line, and a
   demo-only artifact. The bar names the panel in view.
3. **About** (Geist), email, LinkedIn, GitHub, View Resume, Visit Portfolio, and today's QR code
   ("Scan To Visit", "Direct contact file").

Reduced motion: the same art, no movement (the hero is the still, the renderer is never
requested, each panel's picture scrolls with its panel, no settle).

### Where every word on /card comes from

| Words | Source |
|---|---|
| Marcelo Rondon | `cv.json` basics.name (today's card h1) |
| Product Designer & Design Engineer / Design Systems & AI Tools | `cv.json` basics.label, split at its " — " (today's card role line) |
| Portland, Oregon | `cv.json` location (today's card) |
| Save Contact · VCF for phone or desktop | today's card |
| Share Card · AirDrop or copy link · Copy Card Link (no Web Share) | today's card |
| Open on iPhone to AirDrop, or copy the link anywhere else. · Share sheet opened. · Card link copied to the clipboard. · Share failed on this browser. | today's card (the share script) |
| Share payload: "Marcelo Rondon \| Conference Card", "Connect with Marcelo Rondon.", https://cello.design/card | today's card |
| Selected Case Studies | home |
| Each panel's role and title | the case study's frontmatter (`role`, `title`) |
| Each panel's line | the first sentence of the frontmatter `description`; VegAvengers' and Daybreak's single long sentences are cut at their dash: "Designed and shipped the content platform behind vegavengers.com", "Designed and built a local-first Mac and iPhone planner where people and AI use the same typed, receipt-backed operations" |
| Place names (Over Hood · September …) | `scene-library.json` (as home's place label) |
| About + its paragraph | home's About section |
| email, LinkedIn, GitHub | `cv.json` (today's card) |
| View Resume | home |
| Visit Portfolio · cello.design | today's card |
| Scan To Visit · Direct contact file | today's card |
| Page title, description, og | today's card |

No `[Cello's words]` slot was needed. Dropped from today's card: the "Conference Card" eyebrow, the
summary paragraph on the first screen (it's still the vCard's NOTE), and the QR note.

### The actions (phone 390×844, `isMobile`, touch)

| Check | Result |
|---|---|
| Save Contact | links to `/contact.vcf`; a tap opens it (200). `astro preview` serves the prerendered file with an empty Content-Type, so Chrome shows it inline there; served with the endpoint's own headers (text/vcard, attachment), the tap downloads `marcelo-rondon.vcf`: vCard 3.0, CRLF lines, FN, N, TITLE, EMAIL, URL ×2, ADR, NOTE, REV. `contact.vcf.ts` is unchanged. **Check the headers Netlify serves on the branch preview** (today's card links the same file). |
| Share (Web Share stubbed) | `navigator.share({ title: "Marcelo Rondon \| Conference Card", text: "Connect with Marcelo Rondon.", url: "https://cello.design/card" })`; the note reads "Share sheet opened." |
| Share dismissed (AbortError) | the note stays as it was |
| No Web Share, clipboard | the label reads "Copy Card Link"; the tap copies `https://cello.design/card`; "Card link copied to the clipboard." |
| No Web Share, no clipboard | the note shows the link |
| Links | the four case studies and /resume 200; email, LinkedIn, GitHub, the portfolio, the vCard |
| One change to today's share script | it binds as soon as it's parsed (it sits below the button) instead of at DOMContentLoaded, which waits for every module script: Share is usable at 1.44 s on Slow 4G instead of 3.44 s |

### Behaviour

| Check | 1440 | 390 |
|---|---|---|
| Arrival | the renderer takes over (scene-gl-on); exploring at the top | same |
| Panels | no panel picture or artifact requested at load; after the first screen is complete (loaded, renderer in) the next one preloads; every picture loaded by the time its panel is in view (`flat.webp`) | same, with the 9:16 crops (`flat-tall.webp`) |
| Reading | engages over the projects; the bar names the panel in view ("Daybreak" at the last) | same |
| Horizontal overflow | 0 | 0 (63 px before the panels clipped their copy scrim) |
| Settle | `sceneSettle` on a scroll timeline | same |
| Reduced motion | the still, renderer never requested, panels `position: absolute` (scroll with the page), no settle | same |

## /projects, /blog, 404

| Check | Result |
|---|---|
| /projects hover | Ghosted's row brings `ecola/flat.webp` in behind the list; keyboard focus on VegAvengers brings `sauvie/flat.webp`; a click opens the case study; a tap on a phone opens it directly |
| Index pages | the half-size still on at load (layers hidden), the renderer takes over settled and focused, 0 draws in 1.5 s idle |
| 404 | arrives like home; a focus target just above the hero's end dims the scene before its short scroll runs out |
| Reduced motion (card, projects, blog, 404, Ghosted) | the still; the renderer chunk is never requested |
| Home | unchanged: no reading still, the still waits under the ink for the arrival |

## Reading pages: the slow-network fix (Task 2)

As briefed (the full layered still at first paint) it wasn't enough: the four full layers share
the link with the page's own media, so on Slow 4G the first of them still landed at about 7.8 s and
was the LCP, and on Fast 4G painting them moved the LCP from the lede (0.61 s) to the layer
(1.30 s). So a reading or index page now paints `read.webp`, the scene's layers flattened at 768 px
and lightly pre-blurred (14–45 KB, `fetchpriority=high`), which is only ever seen through the focus
recipe's blur anyway; the full layers load hidden, for the renderer only, which arrives settled and
focused and takes over without a visible change. Home's arrival is unchanged.

Ghosted (the longest case study), median of 5:

| Profile | Before (S2) | Layered still at first paint | **Now (half-size still)** |
|---|---|---|---|
| Phone 390, Slow 4G | 8.54 s (a scene layer) | 7.78 s (a scene layer) | **2.14 s** (`read.webp`); FCP 1.70 s |
| Desktop 1440, Slow 4G | 8.32 s | 8.32 s | **2.13 s**; FCP 1.63 s |
| Phone 390, Fast 4G | 0.61 s (the lede) | 1.30 s (a layer) | **0.64 s** (`read.webp`) |
| Desktop 1440, Fast 4G | 0.59 s | 1.28 s | **0.62 s** |

CLS 0.0008 (390) / 0.019 (1440), as before. The renderer takes over at ≈3.8 s on Fast 4G and ≈19 s
on Slow 4G (the page's media share the link); the still holds until then. "Before" is the same
build with the head script's old condition, served from a copy of the page.

## Performance: /card

| Profile | LCP | FCP | CLS | Share usable | Renderer in | LCP element |
|---|---|---|---|---|---|---|
| **Phone 390, Slow 4G** | **1.54 s** | 1.54 s | 0 | 1.44 s | 6.79 s | the name |
| Desktop 1440, Slow 4G | 1.52 s | 1.52 s | 0.0002 | 1.44 s | 6.87 s | the name |
| Phone 390, Fast 4G | 0.54 s | 0.54 s | 0 | 0.46 s | 1.73 s | the name |
| Desktop 1440, Fast 4G | 0.52 s | 0.52 s | 0 | 0.45 s | 1.82 s | the name |

Target LCP ≤ 2.5 s on Slow 4G with the actions usable before any WebGL: met (Save Contact is a plain
link, usable at first paint; Share binds before first paint).

### Weight (phone, transferred)

| | KB |
|---|---|
| HTML | 11.9 |
| CSS | 10.3 |
| Fonts | 140.9: Geist Mono 400 and 700 and National Park latin (preloaded, 73), Switchback 21, Geist 29, Geist Mono 600 18 (the fallback face Chrome fetches for National Park semibold while it loads). Desktop adds Geist Mono 800 (the bar's "Cello") |
| JS | 148.9: ≈20 before paint (the ⌘K menu, the scene's DOM half, the bar, the theme), then three.js + the renderer 129 after paint, only when the 3D gate allows |
| Mirror Lake's layers (the hero; still and textures) | 574 |
| **First screen** | **≈886** |
| Later, one panel at a time: pictures | phone 355 for all four (65, 115, 96, 79); desktop 873 (132, 313, 224, 204) |
| Later: artifacts | 69 for all four |

Two font files fewer than the first cut: the action titles use the preloaded bold (not 800), and
the panel arrows are set in Geist Mono (National Park's latin subset has no arrows, so it pulled
its latin-ext file).

## Text over art: contrast

Same measure as S1/S2: each line against the 99th-percentile brightest pixel under it, with the
text (and its decorations: link underlines) hidden; text on its own opaque fill or plate excluded
(the actions, the bar, the footer, the QR frame, swatches and artifacts). Every step of 60% of the
viewport down each page; on /projects also with each row hovered (its place in behind the list).
Text colors are read through a canvas, so `--text-on-art-muted` (an oklab mix) is measured as
rendered.

| Page · state | 1440 Dusk | 1440 Day | 390 Dusk | 390 Day |
|---|---|---|---|---|
| /card · WebGL | 7.92 / 7.28 | 5.29 / 6.69 | 9.24 / 7.31 | 6.43 / 5.30 |
| /card · still | 7.86 / 6.69 | 5.90 / 6.69 | 9.13 / 4.37 | 7.80 / 4.37 |
| /projects · WebGL | 11.22 / 7.42 | 7.09 / 7.02 | 12.30 / 7.17 | 8.80 / 6.00 |
| /projects · each row hovered | 7.53 / 5.40 | 7.53 / 5.40 | 12.30 / 7.46 | 8.80 / 7.13 |
| /projects · still | 7.09 / 7.15 | 7.09 / 7.15 | 8.80 / 5.93 | 8.80 / 5.93 |
| /blog · WebGL | 11.22 / 7.42 | 7.09 / 7.02 | 12.43 / 7.16 | 8.80 / 5.99 |
| /blog · still | 7.09 / 7.20 | 7.09 / 7.20 | 8.83 / 5.92 | 8.83 / 5.92 |
| 404 · WebGL | 13.53 / 13.68 | 9.98 / 10.27 | 14.68 / 14.50 | 13.41 / 12.56 |
| 404 · still | 10.32 / 10.05 | 10.32 / 10.05 | 13.39 / 12.38 | 13.39 / 12.38 |
| Ghosted (reading still) · WebGL | 9.83 / 7.48 | 6.93 / 7.17 | 9.83 / 7.59 | 8.61 / 7.30 |
| Ghosted · still | 6.95 / 7.17 | 6.95 / 7.17 | 8.51 / 7.35 | 8.51 / 7.35 |

(lowest small / lowest large.) **0 failures** of 4.5:1 / 3:1 across about 11,900 measured lines.
Thinnest margin: the name on /card over the phone still (4.37:1, large, needs 3).

Failures found and fixed on the way:
- /card panels: the grounding ink was fixed to the viewport with the picture, so when a panel's
  copy scrolled up it sat on bright sky (1.2:1). The ink now belongs to the panel and travels with
  the copy; on phones the artifact comes first so the words sit lowest.
- /card hero: Portland, Oregon was the copy's first line, in the scrim's top feather (4.0:1 over
  the phone still). It now sits under the role line.
- 404: scrolled to its end, "404" sat over the sky (2.8:1). It now dims like home's Work list.

## Build, URL contract, console

- `pnpm build`: green. Tokens up to date, no new raw values; `astro check` 0 errors, 0 warnings,
  0 hints; the build itself 0 warnings.
- The 16 URLs: all **200**. The 8 expected 404s plus `/visuals/graphic-design`: **404**. The two
  301s are Netlify's (`_redirects` unchanged; `astro preview` answers 404). `/cv.json` parses
  (label unchanged), the PDF starts `%PDF-`; `cv.json`, `contact.vcf.ts`, `public/files`,
  `_redirects` and `/resume` untouched.
- **Console:** zero errors and zero warnings across every run above (/card, /projects, /blog,
  404, Ghosted, home; both themes, both widths, both motion modes). The only failed requests are
  Ghosted's videos (webm/mp4 range requests), cancelled when a run closed the page.

## ui:shots (exact; baseline = S2's head f159e05 built in this worktree, two runs)

**36 of 48 screens changed**, all expected: `/card` (4, the new page), `/projects` (4), `/blog` (4),
404 (4), and the four case studies and the post (20: under the reduced motion ui:shots uses, their
still is now the half-size flattened copy). Home, `/resume` and `/design-system` are **0 px** (12).

## For Cello

- **Ecola's seams:** the sharp, flattened Ecola on /card's Ghosted panel shows the outpaint seams at
  the original portrait's edges (x ≈ 384 and 1152 of 1536), most visibly in the sky at 1440. They're
  in the layers (S2's reading pages hide them under the blur). A cleanup pass on Ecola, or a
  different crop, would fix it.
- **Pairings:** /projects, /blog and 404 sit over home's Mirror Lake (no new pairing was claimed).
  Each could get its own place.
- **The panels are Day art in both themes;** in Dusk they get the reading ink over them.
- **/contact.vcf on the deploy:** check that Netlify serves it as a vCard (iOS opens the contact
  sheet then). It's the same file and link as today's card.
- On Slow 4G /card's scene assembles at about 6.8 s; the words and both actions are there from
  1.5 s.
- `ProjectCard` and `BlogCard` are now reachable only from the hidden pages (dead on the live site).

## D3 follow-up (Ghosted images, partly done)

- **Done:** the post "Programmatic Resumes You Can Chat With" no longer shows `v3/archetype.webp`
  (it showed a real resume). Its "Categories and archetypes" paragraph stays, with the category
  screenshot alone at full width, and the file is removed so it isn't served at its URL.
- **Not done yet:** replacing the seven recaptured demo-persona shots (`style-looks`, `phones`,
  `interview`, `tailored`, `history`, `edit-style`, `report`) and building `proposal.webp`,
  `og.png` and `highlights.webp` from Ghosted's demo landing shot. The copy into this repo was
  stopped by the session's permission check, so the alt and caption edits that go with the new
  images wait too (they'd describe images that aren't there).
- **OCR today** (tesseract, counting lines with "Marcelo", "Rondon", "cello@", the GitHub or
  LinkedIn handle): `edit-style` 5, `style-looks` 3, `highlights` 2, `interview` 2, `report` 2,
  `tailored` 2, `og.png` 2, `history` 1, `proposal` 1; `phones` reads 0 at this size but showed the
  real resume in S2's check by eye. Clean: `board`, `board-dark`, `category`, `fit`, `intake`,
  `research`, `tour-look`, `signin`, the Loop poster, and the four /card artifacts.
