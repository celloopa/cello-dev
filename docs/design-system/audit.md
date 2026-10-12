# cello.dev design-system audit

2026-10-12 · branch `claude/design-system-audit` from `origin/master` `0d4ede0` · research only, nothing in `src/` changed.

Method: count, then sort (Ghosted's audit, Cello's `design-systems` skill). Count every value with its uses and its line. Draw guides on screenshots for what counts can't see. Then sort each difference into **drift** (merge it), **on purpose** (keep it and write the reason down) or **ask the owner** (it changes what something means; Cello decides).

Scope: the 80 files reachable from a page (`src/pages`, `src/content`, and everything they import). The 21 unreachable files (`src/hidden-pages/*`, `ColorSchemeGenerator`, `VisualsCard`, `projectLayout`, the printer-toy Svelte database, test components) are listed in [`counts.md`](counts.md) and not counted. `print.css` is counted but sorted as on purpose (pt/cm units and pure black/white are print).

Evidence:
- [`counts.md`](counts.md): every value, its uses, first locations (generated)
- [`components.md`](components.md): every component and hand-built look-alike
- `shots/`: edge-guide crops; the full set is 40 screenshots (10 pages × 1440/390 × dark/light, reduced motion)

---

## 1. Headline findings

1. **The site has never rendered Geist Mono.** `@fontsource/geist-mono` registers the face as `"Geist Mono"`. `html` asks for `"GeistMono"` (`src/layouts/Layout.astro:266`), and so do the token (`src/styles/tokens.css:22`) and `/card` (`src/pages/card.astro:253`). The browser never matches the face and never downloads it, then falls back to the generic `monospace`. Measured with Chrome's own font report: **cello.design renders in Courier Bold** in Chrome, and the local build in Menlo. iOS Safari's default monospace is Courier as well. Every screenshot of the site so far shows the fallback, not the brand face. Only `ResumeSync.svelte:182` (dev-only) spells it right. The nine weight imports (`Layout.astro:4-12`) ship CSS for a font nobody requests.
2. **The token layer exists and almost nothing uses it.** `tokens.css` defines 70 `--ds-*` primitives and 11 semantic aliases. Uses through a token: font size 6 of 155 (4%), spacing 22 of 714 (3%), border width 4 of 91, letter spacing 1 of 66, and **0** for line height, font weight, duration and z-index. Color is the exception. It reaches pages through a *second*, older semantic layer (`--color-text` ×106, `--color-accent` ×157, `--color-background` ×65 in `colors.css`), not through `--surface-*`/`--text-*`, which have 1–2 uses each.
3. **Two motion token sets disagree.** `--ds-duration-base: 300ms` (`tokens.css:79`) vs `--motion-base: 320ms` (`animations.css:7`). `--ds-ease-out` and `--ease-out-expo` are the same curve under two names. The `--ds-duration-*` tokens have 0 uses, and 171 durations are written as literals.
4. **49 font sizes on screen.** The rem sizes cluster into about 6 roles: labels 0.65–0.78 (26 uses), small 0.8–0.95 (60), body 1–1.15 (23), lead 1.2–1.25 (5), title 1.45–1.6 (9) and heading 2–2.5 (3). On top of those sit **20 different `clamp()` display sizes**, with 3 of them forcing `!important`.
5. **One left edge site-wide except two templates.** The header, home, listings and resume start at x=202 on desktop (16 on phone). Every case study and blog post body starts at **215 / 29**, a 0.8rem inset nobody chose (see §4).
6. **The case-study and blog templates are copies, and the copies have drifted.** 26 selectors are duplicated between `src/pages/projects/[slug].astro` and `src/pages/blog/[slug].astro`. `blockquote` has a tinted background on the blog only, and `h3` is styled on the blog only. Together they hold 332 of the site's 1,520 raw values (22%).
7. **Light mode swaps what green means.** Dark: green is the action color (buttons, links, h2), and earth is decoration. Light: earth is the action color, and green drops to a decorative accent at 1.92:1 on the gray background (`colors.css:28-40`). The brand kit's guardrail says "Signal green as action/build cue" in both.
8. **The reduced-motion rule is written twice and misses delays.** `animations.css:371` and `Layout.astro:677` both clamp durations, but neither zeroes `animation-delay`. With reduced motion on, staggered items (`animations.css:244-272`, up to 0.8s, `backwards` fill) stay invisible until their delay passes.
9. **The docs disagree with the code.** CLAUDE.md's palette (`#0a0f1f`, `#228B22`, `#FF6B35`) exists nowhere in code. DESIGN.md and the brand kit say the light background is Paper `#fff8ed`; code uses gray `#e0e0e0`. Docs say dark-first, but a first visit follows the system setting (`Layout.astro:78-90`).

## 2. Color

Primitives (`tokens.css:7-19`) and their reach:

| Primitive | Value | Direct uses | Reach | Sort |
|---|---|---:|---|---|
| ink-950 | `#001a11` | 3 | dark canvas, light text, via `--color-midnight` | keep |
| ink-900 | `#05271b` | 0 | none | drift: dead, or becomes `surface/raised` (ask with Q3) |
| ink-800 | `#0c3a29` | 0 | none | drift: dead |
| paper-50 | `#fff8ed` | 1 (`--color-paper`) | `/card` QR only | ask (Q3: light canvas) |
| paper-100 | `#f3ede2` | 0 | none | drift: dead |
| paper-200 | `#e0e0e0` | 3 | dark text **and** light canvas | keep (one value, two roles is fine) |
| earth-600 / 500 / 400 | `#6f613e` `#887850` `#a89762` | 2 / 1 / 2 | light action, logo triangle, dark decoration | keep |
| signal-500 | `#00bc44` | 3 | dark action, about 157 uses via `--color-accent` | keep |
| signal-400 | `#31df70` | 0 | none | drift: dead |
| blueprint-500 | `#42a5ff` | 3 | hero construction lines only (`index.astro:445,455`) | ask (Q6) |
| coral-500 | `#ff6b4a` | 0 (design-system page swatch) | none | ask (Q6) |

Tints are written as `rgba(var(--color-text-rgb), a)` and similar, with **22 alpha values** in use. Text tints: .02 .03 .035 .04 .08 .12 .15 .18 .35 .5 .7 .72 .8 .88. Accent tints: .05 .08 .1 .12 .16 .2 .5. Background tints: .6. Drift: these collapse into about 4 roles (raised fill, muted line, muted text, scrim).

Raw hex outside the token files: 20 occurrences. **All of them are on purpose:** print (`print.css` `#000 #fff #444`), `theme-color` meta (`Layout.astro:63`, `card.astro:52`; meta tags can't read CSS variables), QR code colors passed to a library (`card.astro:34-35`), third-party brand marks (`icons/astro.astro:11`, `icons/figma.astro:12`), and Ghosted's own colors shown in its case study (`ghosted.mdx:81-213`, `#ffe58a` `#7d93ff` `#2f4bd1`). The hex ratchet starts from this baseline.

### Contrast (WCAG 2.x; text 4.5:1, non-text 3:1)

| Pair | Dark | Light | Note |
|---|---:|---:|---|
| text on canvas | 13.76 | 13.76 | pass |
| muted text (`--text-muted`, .82/.78) | 9.47 | 7.65 | pass |
| text @ .5 (FlowDiagram borders) | 4.24 | 3.25 | pass as a border (3:1); never as text |
| text @ .35 (`FlowDiagram.astro:99`, `ResumeSync.svelte:120`) | 2.69 | 2.16 | decorative rules only; fine |
| accent on canvas (h2, links, labels) | 7.16 | 4.60 | light passes by 0.1 |
| canvas on accent (primary button label) | 7.16 | 4.60 | same |
| accent-secondary (decorative triangles, arcs) | 6.29 | **1.92** | green on light gray; decorative today, fails if it ever carries meaning |
| blueprint lines | 6.97 | **1.97** | decorative construction lines |
| coral | 6.45 | **2.13** | unused; unusable as light-mode text as is |
| `--border-muted` (.18) | 1.59 | 1.45 | fine for dividers; too faint for any control's edge |

Everything that carries text passes. The light-mode accent passes AA by 0.1, so any darkening of the light canvas would break it.

## 3. Type

| Property | Distinct | Uses | Via token | Values (screen, by uses) |
|---|---:|---:|---:|---|
| font-size | 49 | 155 | 6 | .85×18 · 1×15 · .8×14 · .9×13 · .75×12 · .7×9 · 1.1×7 · 1.5×7 · .88×5 · 1.25×4 · .72×3 · .95×3 · 2.5×2 · .84×2 · then 1 each, plus 20 `clamp()`s |
| font-weight | 6 | 87 | 0 | 700×43 · 900×14 · 600×12 · 800×11 · 400×5 · 500×2 |
| line-height | 18 | 67 | 0 | 1.2×9 · 1.7×9 · 1.1×8 · 1.55×6 · 1.5×5 · 1.6×5 · 1.3×5 · 1.8×4 · 1.4×3 · 1.75, .95, 1.12, 1.15, .9, .92 ×1 |
| letter-spacing | 13 | 66 | 1 | .05em×35 · .1em×10 · .08em×6 · .03/.02em×2 · .15/.18/.04em, −.05rem, −.08em ×1 |
| font-family | 2 spellings | 4 | — | `"GeistMono"` ×3 (wrong) · `"Geist Mono"` ×1 |

Sort:
- **Drift:** the 0.02em steps between small sizes (.84/.85, .88/.9, .72/.75) are invisible side by side. They become about 6 roles. Line heights 1.5/1.55/1.6 → one "read" value; 1.1/1.12/1.15/1.2 → one "tight". Tracking .03/.04/.05 → one caps value, and .08/.1 → one wide.
- **Drift:** body copy is 1rem/1.8 in articles, 1.1rem/1.75 in `Layout.astro:496`, and token `--ds-leading-copy` is 1.7.
- **On purpose:** the hero name and poster moments (`clamp(4.5rem, 10vw, 10rem)`, the marquee, 404's `clamp(8rem, 30vw, 22rem)`) are display art, not ramp steps. They keep named one-off tokens.
- **Ask (Q2):** the face itself, now that the fallback is known.

## 4. Space, layout and edges

Spacing: 55 distinct values, 714 uses, 22 through a token. In rem, by uses: 1×75 · .5×63 · .75×50 · 1.5×34 · 2×30 · .8×22 · 1.25×21 · .25×20 · .4×14 · .35×10 · 3×6 · .6×5 · .85×5 · .65×4 · .2×4 · .15×3 · .9×3 · then 1–2 each, plus 9 viewport `clamp()`s. A 4px scale (.25/.5/.75/1/1.25/1.5/2/3) already covers **78%** of the 383 rem uses. The rest (.35, .4, .6, .65, .8, .85, .9) snap to their nearest step: drift.

Edges, measured on screenshots (block elements inside `<main>`, x position × count; crops in `shots/`):

| Page | 1440 | 390 |
|---|---|---|
| home, resume, design-system | **202** | **16** |
| /projects, /blog lists | 202 (titles), 205/225 inside cards | 16 / 19 / 35 |
| case studies | 202 (two items), **215 ×97**, 233/234 inside boxes | **29 ×101**, 47/48 |
| blog post | **215 ×36** | **29 ×36** |

The header logo and every listing sit on 202; the article body sits 13px inside it. Cause: the article `.content` adds `0.8rem` of its own padding inside the page container (pattern, not one-off). Ghosted's rule fixes it: **one left edge per container; inner blocks don't add side padding.** Drift.

Containers: 24 `max-width` values. 1100px ×9 and `var(--ds-container)` ×1 are the page width. Text measures are 58, 60, 66, 68, 72, 76ch and 38/42rem, which is drift around one ~68ch reading measure, plus a narrower lede.

Breakpoints: 700 (×26, written three ways: `width <= 700px` ×22, `max-width: 700px` ×3, and once combined with `pointer: coarse`), 900 (×5), and one-offs at 480, 600, 960, 1100. Drift: 480/600/960 snap to 700/900.

## 5. Shape, stroke, elevation, layers

- **Radius:** `50%` ×3 (dots). Everything else is square, and that's on purpose (brand: hard-edged specimens). One token is enough (`radius/none` is implied); keep `50%` as the circle.
- **Border width:** 2px ×40 · 3px ×28 · 4px ×10 · 1px ×5, plus 11px ×2 and 19px ×1 (CSS triangles, `index.astro:1022`; shapes, not borders). Stroke tokens exist for all four widths and are used 4 times. Meaning today: 3px = card/specimen frame, 2px = buttons/tags/media, 4px = heavy bars, 1px = rules. Drift only in the inconsistent use per component (see components.md).
- **Shadow:** 3 total. `10px 10px 0 accent` (`/card`, the brand's hard offset), `0 20px 40px text@.15` (one soft hover shadow, off-brand), and a text-protection shadow. Ask nothing: the soft one is drift toward the hard offset.
- **Z-index:** −1 ×7 · 0 ×4 · 1 ×14 · 2 ×4 · 100 · 1000 · 2000. Code-only layer tokens (base, raised, header, menu, overlay).
- **Opacity:** 20 values, mostly animation keyframes (0/1). Non-keyframe: .85 ×7, .88, .8, .7, .5, .45, .4, .3. Drift.

## 6. Motion

| | Count |
|---|---|
| Easing | `cubic-bezier(0.16,1,0.3,1)` ×90 literal + ×11 via `--ease-out-expo` = **74% of all easings** · `ease` ×25 · `ease-out` ×14 · `linear` ×4 (loops) · `(0.25,1,0.5,1)` ×2 · `ease-in-out` ×1 |
| Duration | 0.3s ×52 · 0.6s ×22 · 0.5s ×17 · 0.7s ×12 · 0.2s ×12 · 0.1s ×10 (stagger steps) · 0.4s ×9 · 0.8s ×5 · then 21 values used once or twice (0.18, 0.24, 0.25, 0.34, 0.42, 0.45, 0.55, 0.9, 1s…) |
| Loops | logo 12s ×3, texture 40s (72s on touch), marquee 32s, kicker pulse 2.4s, caret blink 0.7s |
| Keyframes | 30 names. Near-duplicates: `wipeIn`/`wipe-in`, `slideLeft`/`slideFromLeft`/`headerSlideLeft`/`logoSlideFromLeft`, `slideUp`/`skillSlideUp`, `scaleIn`/`scaleReveal` |
| `transition: all` | 24 (18 with the house curve). Drift: animates layout properties the brand kit says not to |

Sort:
- **On purpose:** the house curve (brand kit, DESIGN.md), the logo's assembly loop and hover break-apart, the hero lock-in sequence, the texture drift. These are signatures. Each gets a named tier (below), not a generic token.
- **Drift:** 39 transitions and animations use `ease`/`ease-out` where the house curve is the rule. 0.2s/0.25s/0.3s/0.34s/0.4s on hovers → one UI duration. 0.5–0.9s entry animations → one or two entry durations. The duplicate keyframes.
- **Bug:** the delay gap in reduced motion (finding 8).

Tier draft (from the counts, Ghosted's shape, cello.dev's verbs):

| Tier | Today | Contents |
|---|---|---|
| UI | 0.2–0.4s | hover, press, color, menu |
| Entry | 0.5–0.9s + 0.03–0.1s stagger | reveal, slide, wipe, scale |
| Signature | 0.24–1s, sequenced | hero lock-in, logo assembly/break, page wipe 0.45s |
| Ambient | 2.4–72s loops | texture, marquee, kicker pulse, logo loop |

## 7. Components

See [`components.md`](components.md) for every implementation with file:line.

| Element | Implementations | What differs |
|---|---:|---|
| Button | 9 | weight 700/800/900, 4 paddings, hover inverts to transparent in one and to canvas in another; `.button-demo` has no hover or focus |
| Arrow / back link | 7 | `.cta-link` (index, 404) and `.back-link` (both article templates) are exact copies |
| Icon button | 4 | 44 / 40 / 36px; two are under the 44px touch target |
| Tag / badge / chip | 21 selectors for ~6 ideas | borders 1/2/3px, sizes .7–.85rem; `.role`=`.date`, `.role-badge`=`.date-badge`; date chip copied 3× in resume sections |
| Card / panel | 2 cards + 6 box styles | BlogCard's CSS is a subset of ProjectCard's; two hover languages (accent wipe vs border + lift) |
| Eyebrow / label | 14 | 5 trackings; 8 title underline bars in 6 sizes; 11 h1 and 8 h2 styles |
| Offset frame | 7 hand-built | the brand motif has no component |
| Media gallery | 5 | a full copy of MediaFull/Two/Three inside `projects/[slug].astro:450-544` |
| Page container | 10 | `max-width: 1100px` + gutter written out each time |

Bugs found while counting (verified):
- **`@keyframes` aren't scoped by Astro.** `slideUp` is defined 8 times in source (6 in the built CSS) and `wipeIn` 5 times, with different motions (clip-path in one, scaleX in others). Whichever stylesheet loads last wins for the whole page.
- **Case-study body links look like text.** `projects/[slug].astro` never styles `.content a`; only the blog template does (`blog/[slug].astro:348`).
- **Two global focus rings**, `animations.css:352` and `Layout.astro:328`; the first wins, so the second is dead. Hover-only elements with no focus style of their own: view-all link, ProjectCard external link, resume hero icons and theme button, resume title links, the download button fill, ⌘K menu rows. On cards the focus ring and the hover fill are both accent, so a keyboard user can't tell which link has focus.
- **⌘K menu** blocks Tab while open and doesn't return focus to the menu button on close (`KeyboardShortcutsMenu.svelte:85-86`).
- **Three theme-toggle scripts** with different sources of truth; `/resume` forces dark over the system setting; the resume toggle's accessible name is "Sun Icon". Header marks the current page with a class, not `aria-current`.
- Blog tables are unstyled in the two posts that have them.

Tiers:
- **Must (v1):** Button, ArrowLink, IconButton, ThemeToggle, Tag, Card + Panel, Eyebrow + AccentBar, Section (used everywhere), Prose (MDX content), Media + OffsetFrame, the focus ring.
- **Later:** NavLink from one nav config, Divider, PageHeader, Pager, ResumeEntry, Kbd, an accessibility pass on the ⌘K menu.
- **Never:** one-off Modal/Carousel/Marquee components; hover on non-interactive chips; keeping the watchlist stub and the dead utility classes in `animations.css`.

## 8. Figma

No portfolio file was found. Nothing in the repo, the vault or Cello's skills links a cello.dev Figma file, and the Figma account's libraries list only community kits. **Question for Cello: the link to the cello.dev file(s)**, so the code-vs-Figma comparison can run. Until then, the comparison is code vs docs (above). `public/images/design-system/design-system-direction-01.png` and `public/images/brand/cello-dev-brand-kit-board-v1.png` are the only design artifacts in the repo; the first uses Space Mono, not Geist Mono.

## 9. Sorted

### Drift (merge to the more-used value; no question needed)
- `"GeistMono"` → `"Geist Mono"`. The fix is one string, but **visible everywhere**, so it ships as its own stage with before/after shots.
- Two semantic color layers (`--color-*` legacy, used; `--surface-*`/`--text-*`, unused) → one.
- Two motion token sets (300 vs 320ms) → one.
- 49 font sizes → about 6 roles + named display one-offs; 18 line heights → 3; 13 trackings → 3.
- 55 spacing values → 4px scale + layout tokens; the 0.8rem article inset → one left edge.
- 22 tint alphas → about 4 roles.
- 39 `ease`/`ease-out` uses → house curve; 29 durations → tiers; `transition: all` → named properties; duplicate keyframes merged.
- Reduced-motion block written twice → once, zeroing delays.
- Case-study and blog prose styles → one shared prose style.
- Breakpoints 480/600/960 → 700/900; `max-width:` vs `width <=` syntax → one.
- Dead primitives (ink-800, paper-100, signal-400) and dead files (21 unreachable) → removed in their own commit.
- One soft hover shadow → the brand's hard offset.
- CLAUDE.md's stale palette → replaced by a pointer to the token source.

### On purpose (keep; reason recorded)
- Square corners everywhere; `50%` only for dots. Reason: the brand kit's "hard rectangles with minimal radius".
- Print stylesheet units and colors. Reason: print.
- Raw hex in `theme-color` meta, the QR code and brand-logo icons, and Ghosted's colors in its case study. Reason: these can't read CSS variables, or they're someone else's brand.
- Display one-offs (hero name, marquee, 404 numeral). Reason: poster moments are art, not ramp steps.
- The house curve and the four motion signatures. Reason: brand kit motion principles.

### Ask the owner (one at a time; recommendations in the proposal)
- **Q1 Scope.** Migrate this site in stages, or treat this audit as the spec for a rewrite (Cello raised an Awwwards-level rewrite on 2026-10-12)?
- **Q2 The face.** Load Geist Mono as intended, keep the look visitors have actually seen (Courier/Menlo), or choose a new face?
- **Q3 Light canvas.** Gray `#e0e0e0` (code) or Paper `#fff8ed` (docs)?
- **Q4 What green means in light mode.** Keep the swap (earth = action in light), or make green the action color in both themes (green fill with ink label passes 7.2:1; green *text* on light needs a darker green)?
- **Q5 First visit.** Follow the system setting (code), or open dark (docs: "dark-first")?
- **Q6 Blueprint and coral.** Keep them as sparing accents with a defined meaning, or remove them (blueprint has 2 uses, coral none)?
- **Q7 The Cello family layer.** What goes in, and where it lives (see the proposal).
- **Q8 Figma.** The file link (or confirm there isn't a maintained file, in which case Figma is generated from code).

## 10. What the count says about the Cello family layer

Candidates are values or rules that are **already** Cello-wide, i.e. shared with a second product today or explicitly brand-level, rather than cello.dev-specific:

| Candidate | Evidence | Shared today? |
|---|---|---|
| House curve `cubic-bezier(0.16, 1, 0.3, 1)` | 74% of cello.dev easings; Ghosted's `--ease-out` is the same curve | yes (cello.dev + Ghosted) |
| Reduced-motion contract (motion turns off, content never waits on it) | cello.dev clamps, Ghosted ADR, Daybreak's `accessibilityReduceMotion` | yes in spirit, inconsistent in code |
| Mono for data, labels and time | cello.dev is all-mono; Daybreak directions A/B keep Geist Mono for times | partly |
| Geist (Sans + Mono, OFL 1.1) as the type families | cello.dev intends Geist Mono; Daybreak direction A uses both | candidate |
| Neutral base: green-black ink `#001a11` + warm paper | cello.dev canvas/text; Daybreak directions all derive from it | candidate (values differ per direction) |
| Voice: short, concrete, honest maturity labels, banned words (elevate, unleash, seamless…), no guilt | `VOICE_AND_TONE.md`, Daybreak CLAUDE.md principles | yes |

Not family: green as action, earth as human tone, the C-ring/sun/triangle mark, poster display scale, texture. Those are cello.dev's identity, and Daybreak's grill (item 14) says its identity starts from scratch.

## 11. Cello's answers

- **Q1 Scope (2026-10-12): full staged migration** of today's site, each stage proved by pixel diff or named as one visible change. A rewrite stays possible later (its own thread) and would start from the migrated system.
- **Q2 The face (2026-10-12): Geist Mono.** Fix the family name so the intended face loads in every browser; its own visible stage with before/after shots (`shots/faces-compare.jpg` shows Courier, Menlo and Geist Mono side by side).
- **Q3 Light canvas (2026-10-12): Paper 100 `#f3ede2`.** Earth accent rises from 4.60:1 to 5.22:1. One visible stage, light mode only (`shots/canvas-compare.jpg`).
- **Q4 Green's job (2026-10-12): green = action in both themes.** Light mode uses a new primitive `signal-700 #007a33` (4.70:1 on Paper 100, paper label on it 4.70:1); earth is grounding/decoration in both themes (`shots/green-compare.jpg`). Visible in light mode only.
- **Q5 First visit (2026-10-12): follow the system setting.** `/resume` stops forcing dark, the three toggle scripts become one, and the docs change "dark-first" to "dark is the hero scene; both themes are first-class". No visible change except /resume for light-preferring visitors.
- **Q6 Blueprint and coral (2026-10-12): keep blueprint, drop coral.** Blueprint means construction lines and annotations only, never text, never action. Coral is removed; a future warning/in-progress color is a new token decision.
- **Q7 Family home (2026-10-12): its own tiny repo**, `~/Documents/code/cello-family` (family.json + README + CHANGELOG, tagged versions). Products vendor a pinned copy; their checks warn, never fail, when the local canonical is newer. Contents go to Cello in the proposal.
- **Q8 Figma (2026-10-12): no maintained cello.dev file.** Cello's old files (now in a private triage folder) are predecessor identities: C10ud (2021, lavender/plum) and Cello.Design (dark-green forest, "dark mountain", the direct ancestor). History, not a reference. Figma is generated from code (proposal stage 9).
- **Proposal approved (2026-10-12)**, as written in `proposal.md`. Migration runs on `claude/design-system-migration`, one stage at a time.

## Known flicker in the screenshot check (2026-10-12, fixed in the harness)

On phone widths, the header's menu button sits at a fractional x (299.22 px) inside the sticky
header. Its finished entry animation (`headerSlideRight`, fill forwards) left a composited layer
that snapped to either of two pixels from run to run (rows ~35–58, 222–461 px). `ui:shots` now
shows that one button in its end state (opacity 1, no transform, animation off): exactly the last
keyframe, so the check sees what visitors see once the animation ends. With that, two runs of the
same build agree on all 48 screens (0 px), and stages are proved against a single baseline.
The fractional position itself goes away when the header becomes a component (stage 6).
