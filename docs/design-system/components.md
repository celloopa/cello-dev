# Component inventory: cello-dev (design-system audit)

Repo: `/Users/cello_r/Documents/code/astro/cello-dev/.claude/worktrees/design-system-audit` (branch `claude/design-system-audit`, clean). Read-only audit; every file:line below was read, not inferred. All paths are relative to `src/`.

## Scope

**Live (ships):** `pages/index.astro`, `pages/projects/index.astro`, `pages/projects/[slug].astro`, `pages/blog.astro`, `pages/blog/[slug].astro`, `pages/resume.astro`, `pages/design-system.astro`, `pages/404.astro`, `pages/card.astro` (standalone HTML, does **not** use `Layout`), `pages/watchlist.astro` (stub), `layouts/Layout.astro`, `styles/{tokens,colors,animations,print}.css`, `components/{Header,AnimatedLogo,Section,ProjectCard,BlogCard,CaseMeta,FlowDiagram,KeyboardManager}.astro`, `components/media/*`, `components/sections/*`, `components/svelte/KeyboardShortcutsMenu.svelte`, `components/watchlist_project/watchlistHeader.astro`, and the MDX under `content/projects` and `content/blog`.

**Excluded (not reachable):** the files you listed, plus three found during the audit:
- `layouts/projectLayout.astro` is imported nowhere.
- `components/svelte/ResumeSync.svelte` only renders under `import.meta.env.DEV` (`pages/resume.astro:66`).
- The `visuals` collection has no route.

**MDX component usage:** MediaFull ×31, MediaTwo ×10, FlowDiagram ×6, CaseMeta ×3, MediaThree ×2. Markdown tables appear in 2 blog posts, blockquotes in 1, code fences in 2. Inline links appear in 4 posts and in `content/projects/ghosted.mdx:66`.

## Cross-cutting findings (read these first)

1. **Tokens exist but nothing uses them.**
   - `styles/tokens.css` defines `--ds-*` primitives (stroke, letter, ease, duration, `--ds-offset-shadow: 10px`, `--ds-touch-target: 44px`, `--border-muted`).
   - Outside `pages/design-system.astro` (23 refs) and `pages/index.astro:445,455` (blueprint color), no live file references them.
   - Across live components and pages there are 114 hard-coded `cubic-bezier(0.16, 1, 0.3, 1)` and 0 uses of `var(--ds-ease-out)` / `var(--ease-out-expo)`.
   - Border literals: `2px solid` ×37, `3px` ×24, `4px` ×10, `1px` ×5.
   - Letter-spacing literals: `0.05em` ×33, `0.1em` ×10, `0.08em` ×6, plus one-offs (0.02, 0.03, 0.04, 0.15, 0.18em, -0.08em, -0.05rem).
   - 12 different micro font-sizes between 0.65rem and 0.95rem.
   - `transition: all` ×23.
2. **`@keyframes` are global in Astro, and names collide.**
   - Verified in the existing `dist/_astro/*.css`: names are unchanged, and there are 6 different `slideUp` bodies across bundles.
   - `slideUp` is defined 8×: `styles/animations.css:116` (60px), `pages/index.astro:1150` (30px), `components/ProjectCard.astro:361` (40px), `components/BlogCard.astro:274` (40px), `media/MediaTwo.astro:87`, `media/MediaThree.astro:87`, `pages/projects/[slug].astro:790`, `pages/blog/[slug].astro:388` (30px).
   - `wipeIn` is defined 5×, and two of the definitions animate different properties: `animations.css:168` uses `clip-path`, while `index.astro:1161`, `projects/[slug].astro:801`, `blog/[slug].astro:399` and `404.astro:115` use `scaleX`.
   - `slideLeft` 4× (80, 60, 40, 48px), `slideRight` 3×, `scaleIn` 5× (identical bodies).
   - Whichever stylesheet loads last wins for the whole page. For example, on `/` ProjectCard's 40px entrance actually runs index.astro's 30px.
3. **Two global focus rules conflict.**
   - `styles/animations.css:352` (`:focus-visible`, 3px accent, offset 3px, specificity 0-1-0) always beats `layouts/Layout.astro:328` (`:where(...)`, offset 4px, specificity 0). The Layout rule is dead.
   - `pages/card.astro` loads neither file, so it gets the browser default ring only.
4. **Dead global CSS.**
   - `animations.css` utilities have no live usage: `.has-texture` (42), `.hover-lift` (318), `.hover-underline` (329), `.accent-bar`/`-vertical` (286/294), `.geo-circle`/`.geo-square` (303/310), `.animate-*` (214–240), `.delay-1..8` (243–273), `.smooth` (281), `.anim-ready` (276).
   - `Layout.astro:310-311` sets `cursor: cell` on `.lab-card` and `.path-card`, which don't exist.
5. **Theme toggle has 3 JS implementations with different sources of truth.**
   - `pages/index.astro:303` and `sections/Hero.astro:109` read `localStorage` (default `"dark"`). `utils/themeToggle.js:1` reads the `data-theme` attribute.
   - **Bug:** Layout (`Layout.astro:79-89`) seeds the theme from the system preference. With nothing saved and a light system theme, the first click on the home toggle computes `"dark"→"light"` and does nothing visible.
   - `Hero.astro:122-142` also forces `saved || "dark"` on DOMContentLoaded and after-swap, which overrides the system preference on /resume.

---

## Inventory table

Legend: **impl** = implementation; values are copied from the CSS. "Ring" means the global `animations.css:352` outline (3px accent, offset 3px).

### 1. Buttons and CTAs (filled / outline)

| Element | Implementations (file:line, class) | Variants | Values that differ | States present / **missing** | Merge candidates |
|---|---|---|---|---|---|
| Primary/outline button | `pages/index.astro:696` `.cta`, `:714` `.cta.primary` | primary only (no outline used) | 3px accent; pad `.75rem 1rem`; min-h 44px; .85rem / **800** / .05em; transition bg/border/color/transform .3s expo | hover+focus-visible (`:719`, `:724`): translateY(-2px), inverts to **transparent** bg; `data-magnetic`. **Missing:** active, disabled | → `Button` |
| | `pages/projects/[slug].astro:416` `.btn`, `:437` `.btn.outline` ("View Live", GitHub) | filled, outline | 3px; pad `.8rem 1.5rem` (`.6rem 1rem` ≤700, `:857`); .85rem / **700** / .05em; `transition: all .3s expo` | hover+focus-visible `:431`/`:443`: filled inverts to **background** (not transparent); no lift. **Missing:** active | → `Button` (same intent as `.cta`; differs in weight, padding, inverted bg, lift) |
| | `pages/resume.astro:100` `.download-btn` (+`::before` offset frame `:118`) | outline + offset frame | 3px text border; pad `.8rem 1.5rem`; .85rem/700/.05em; frame 3px accent, 4px offset | hover `:139` fills accent and nudges svg (`:149`); focus-visible `:131` **only collapses the frame and does not fill**. Hover and focus look different | → `Button variant=outline` + `OffsetFrame` |
| | `components/Header.astro:240` `.menu-btn` (+`::before` `:262`, `.menu-key` `:301`, `.menu-label` `:329`) | outline + offset frame + kbd chip | 3px text; pad `.5rem .75rem`; min 44×44; label .8rem/700/.1em; frame 3px accent, 4px offset (**same pattern as `.download-btn`**) | hover+focus-visible `:275-299`: fill accent, translateY(-2). Accessible name is `aria-label="Menu"` but the visible text is the current page ("Work"), a label-in-name mismatch | Shares `OffsetFrame` with `.download-btn` |
| | `pages/projects/[slug].astro:750` `.nav-link`, `:765` `--adjacent` (prev / all / next pager) | accent, text (adjacent) | 3px; pad `.8rem 1.5rem`; **1rem**/700/.05em (adjacent .85rem); `transition: all` | hover+focus-visible `:772`: fill accent, gap shrinks .75→.5rem | → `Button` |
| | `pages/blog/[slug].astro:367` `.nav-link` ("All Posts") | accent | identical to the project `.nav-link` minus `--adjacent` | hover+focus-visible `:381` | **Exact duplicate** of project `.nav-link` |
| | `pages/design-system.astro:105` `.button-demo` | filled | tokenized: `--ds-stroke-lg`, pad `--ds-space-3/4`, min-h `--ds-touch-target`; weight **900**; **no letter-spacing** | **no hover, no focus-visible, no active**. It is the "spec" button and it is the least complete | The DS page should render the real `Button` |
| | `pages/card.astro:448` `.action`, `:476` `.action-primary` | two-line action tile, primary | **2px** border; min-h 4.5rem; pad `.95rem 1rem`; title .88rem/800/.05em (`:480`), copy .84rem | hover+focus-visible `:468`: fill accent, lift −2px. Ring is browser default (page has no Layout). `.identity-panel` has `contain: paint` (`:328`), which can clip rings on edge tiles | Could be `Button size=lg` with a sub-label; standalone page |
| | `svelte/KeyboardShortcutsMenu.svelte:387` `button` | menu row | 2px transparent; pad `.5rem .75rem`; `transition: all .2s` | hover / `.active` / `.selected` `:401`. **No focus-visible**; see the focus section (Tab is swallowed) | Bespoke; keep |

**Count: 9 implementations** across 7 files: 4 filled styles, 3 outline styles, 2 with the offset-frame motif. Font weight is 700, 800 or 900 depending on the file. Padding is `.75/1`, `.8/1.5`, `.5/.75` or `.95/1`. Hover inverts to `transparent` in one place and to `--color-background` in another.

### 2. Text-with-arrow links / back links

| Element | Implementations | Variants | Differing values | States / **missing** | Merge |
|---|---|---|---|---|---|
| Arrow link | `pages/index.astro:730` `.cta-link` ("View Resume" ×2) | forward | .85rem/800/.05em accent; pad `.75rem .25rem`; gap .5→.75rem, `transition: gap .3s` | hover+focus-visible `:743` | — |
| | `pages/404.astro:97` `.cta-link` | forward | **identical to index** (only property order differs) | hover+focus-visible `:110` | **Exact duplicate** |
| | `pages/index.astro:1080` `.view-all` ("All Case Studies") | forward, larger | **1rem/700**/.05em accent; gap .75→1rem; svg 24px without `aria-hidden` (`:207`) | **hover only (`:1093`); no focus-visible** (ring only) | → `ArrowLink size=lg` |
| Back link | `pages/projects/[slug].astro:309` `.back-link` | back, text tone | .9rem/700/.05em, **text color** → accent on hover; gap .5→.75; `transition: all` | hover+focus-visible `:321` | — |
| | `pages/blog/[slug].astro:143` `.back-link` | back | **byte-identical** to the project `.back-link` (verified with diff) | hover+focus-visible `:155` | **Exact duplicate** |
| Link-styled label | `pages/index.astro:907` `.proof-link` (span inside `.proof-item`) | forward (text "→") | .75rem/700/**.08em** accent | inherits the card's state | Same intent as `ArrowLink size=sm` |
| | `pages/card.astro:556` `.mini-link` | none | .84rem/700/.08em accent | **no hover, no focus style** | — |

**Count: 7.** Two are exact duplicates (cta-link, back-link). The others drift on size (0.75, 0.84, 0.85, 0.9, 1rem), weight (700/800), tracking (.05/.08em), tone (accent vs text→accent), and hover gap (.5→.75 vs .75→1).

### 3. Icon buttons (social, theme, external)

| Element | Implementations | Differing values | States / **missing** | Merge |
|---|---|---|---|---|
| Square icon button | `pages/index.astro:806` `.socials a, .socials button` (incl. theme toggle markup `:136`) | **44×44** (→ **36×36** at ≤700, `:1374`, below the 44px touch token); 2px text border; bg background; transition .3s expo | hover+focus-visible `:824`: fill accent, lift −2; lift disabled on coarse pointers `:834` | → `IconButton` |
| | `layouts/Layout.astro:427` `.footer-socials a` | **40×40**; otherwise identical | hover+focus-visible `:443` | **Near-duplicate** of `.socials` (size only) |
| | `sections/Hero.astro:251` `footer a`, `:223` `button` (theme) | **36×36**; `transition: all .3s expo`; no lift | **hover only** (`:263`, `:237`); no focus-visible. The theme `<button>` has **no aria-label**, so its name comes from the SVG `<title>` "Sun Icon" (`icons/Sun.astro`) | **Near-duplicate** |
| | `components/ProjectCard.astro:344` `.external` | 44×44; 2px; `transition: all .3s ease` | **hover only** (`:355`, inverts to background/accent). On focus the card fills accent and the accent ring disappears into it | → `IconButton` (on-accent tone) |

**Count: 4 implementations (5 selectors), at 3 sizes (44 / 40 / 36), with 2 easings.**
**Theme toggle: 2 button instances + 3 JS implementations** (see cross-cutting finding 5).

### 4. Tags, badges, chips, counters

| Element | Implementations | Differing values | States | Merge |
|---|---|---|---|---|
| **Role/date badge** (accent outline) | `components/ProjectCard.astro:257` `.role` | .75rem/700/.1em; 2px accent; pad `.25rem .5rem`; `transition: all .3s ease` | inverts on card hover/focus-within `:127` | → `Badge size=sm` |
| | `components/BlogCard.astro:192` `.date` | **identical to `.role`** | `:109` | **Exact duplicate** |
| | `pages/projects/[slug].astro:331` `.role-badge` | **.8rem**; pad `.4rem .8rem` | none | → `Badge size=md` |
| | `pages/blog/[slug].astro:165` `.date-badge` | **identical to `.role-badge`** | none | **Exact duplicate** |
| | `pages/design-system.astro:107` `.mini-card span` ("Role Badge" spec) | `--ds-text-xs` (.7rem)/**800**/**no tracking**; pad `--ds-space-1/2` | none | The spec disagrees with all 4 real badges |
| | `components/ProjectCard.astro:187` `.placeholder-box::after` ("Case study in progress") | .72rem/800/.08em; pad `.35rem .55rem` | inverts on card hover `:207` | → `Badge` |
| **Tech pill** (neutral outline) | `components/ProjectCard.astro:324` `.tags li` | .7rem/**600**/.05em; **1px** text border; pad `.2rem .4rem` | inverts on card hover | → `Tag size=sm` |
| | `components/BlogCard.astro:259` `.tags li` | **identical** | same | **Exact duplicate** |
| | `pages/projects/[slug].astro:381` `.tech-stack li` | .75rem/**700**; **2px**; pad `.4rem .8rem`; staggered entrance | **hover fill `:394` on a non-interactive `li`** (false affordance) | → `Tag size=md` |
| | `pages/blog/[slug].astro:209` `.tags li` | **identical to `.tech-stack li`** | hover `:222` (same false affordance) | **Exact duplicate** |
| | `sections/Skills.astro:94` `li` | .8rem/700/.05em; **3px**; pad `.4rem .75rem`; 18px icon; `cursor: default` | **hover fill + lift `:112` on non-interactive** | → `Tag size=md, icon` |
| | `sections/Projects.astro:143` `.keyword` | .7rem/600/.05em; **3px accent**; pad `.25rem .5rem` | none | → `Tag tone=accent` |
| **"+N" counter** | `ProjectCard.astro:334`, `BlogCard.astro:269`, `projects/[slug].astro:399` `.tag-more` | accent border/text; slug version adds hover `:404` | — | → `Tag tone=accent` (one modifier) |
| **Date-range chip** | `sections/Experience.astro:135` `.date-range`, `sections/Education.astro:96` `time`, `sections/Projects.astro:153` `.date-range` | **identical ×3**: .8rem/**900**; 2px accent; pad `.25rem .5rem`; lh 1.1 | none | **Exact triplicate** → `Badge` |
| **Kbd chip** | `components/Header.astro:301` `.menu-key`; `svelte/KeyboardShortcutsMenu.svelte:408` `.key` | .7rem/.03em/pad `.15 .35` vs .8rem/.05em/pad `.25 .5`; both solid text-on-bg | invert on parent hover | → `Kbd` |
| TOC chip-link | `pages/projects/[slug].astro:617` `.section-links a` | .85rem; 2px; pad `.35rem .65rem` (interactive) | hover+focus-visible `:627` | Interactive Tag |

**Count: 21 selectors, about 6 conceptual items.** Border width is 1, 2 or 3px. Font size is .7, .72, .75, .8 or .85rem. Weight is 600, 700, 800 or 900. Five chip styles have hover effects but aren't interactive.

### 5. Cards and panels

| Element | Implementations | Differing values | States / **missing** | Merge |
|---|---|---|---|---|
| **Link card (fill wipe)** | `components/ProjectCard.astro:88` `.card` (+`::before` wipe `:97`, `.has-texture-hover`) | 3px text border; accent wipe .4s expo; image zoom 1.08 over .6s; content pad 1.25rem; h3 1.5rem/900 (`:270`); desc clamp 2 lines | hover + `:focus-within` everywhere (`:110-148`). **Focus problem:** the ring is accent on an accent fill, and the `.card-link` ring is clipped by `overflow:hidden` (`:92`), so you can't tell whether `.card-link` or `.external` is focused | → `Card` |
| | `components/BlogCard.astro:70` `.card` | **The style block is a strict subset of ProjectCard** (75 of ~299 lines differ, all PC-only additions: placeholder, `.external`, texture). `.date` = `.role` | same | **Near-duplicate**: one `Card` with a `meta` slot |
| **Proof card** | `pages/index.astro:873` `.proof-item` ("How I build") | 3px text border; bg `rgba(text,.035)`; pad 1rem; h3 clamp(1rem,2vw,1.2rem) (`:891`); `transition: all .3s` | hover+focus-visible `:885`: border accent, lift −2. No fill wipe (a second card-hover language) | → `Card variant=quiet` |
| **Static panel** | `pages/projects/[slug].astro:560` `.highlights li` | **same values as `.proof-item`** (3px, .035, 1rem) | **hover border + lift `:573` on non-interactive content** | → `Panel` (drop hover) |
| | `components/CaseMeta.astro:33` `.meta-item` | **2px**; bg `.04`; pad 1rem; label `span` `:39` | none | → `Panel size=sm` |
| | `components/FlowDiagram.astro:34` `.flow-diagram` (+`li` `:65`) | outer 3px + accent gradient; steps 2px at **50% alpha**, pad .9rem, bg background | none | Keep as component, rebuild on `Panel` |
| | `pages/design-system.astro:91` `.swatch, .type-card, .mini-card, .principles, .token-list div` | tokenized: `--ds-stroke-lg`, `--surface-raised` (=.035) | **`.mini-card` has `has-texture-hover` (`:67`) but no hover style, though its copy promises a "full-surface accent interaction"** | DS page should render the real `Card` / `Panel` |
| Modal surface | `svelte/KeyboardShortcutsMenu.svelte:255` `.menu` (+`::before` frame `:266`) | **4px** border; 8px offset frame | — | `OffsetFrame` consumer |
| Resume entry | `sections/Experience.astro:60`, `sections/Education.astro:44`, `sections/Projects.astro:58` `li` | **identical ×3**: separator 2px `rgba(accent,.5)`; first-child none; header flex; h3 1.1rem/700; h4 .9rem/600/.05em accent | `article a` hover only (`Experience:95`, `Projects:93`) | → one `ResumeEntry` |

**Count: link cards 2 (PC + BC; near-identical), static boxes 6 (proof-item, highlights li, meta-item, flow-diagram, DS panels, menu).** There are two hover languages: the full accent wipe (cards) and border-to-accent plus lift (proof, highlights).

### 6. Headings, eyebrows, kickers, micro-labels, title bars

**Page titles (h1): 11 implementations.**
- Global `layouts/Layout.astro:520` (clamp 3.5–6rem / 900 / uppercase).
- `pages/projects/index.astro:42` and `pages/blog.astro:45`: identical, 2.5rem / **700** / .05em accent. **Duplicates.**
- `pages/projects/[slug].astro:348` and `pages/blog/[slug].astro:176`: identical, clamp(2.5rem, 8vw, 4rem). **Duplicates.**
- `pages/design-system.astro:87` (`--ds-text-display`).
- `sections/Hero.astro:168` (clamp 2–3rem).
- `pages/card.astro:398` (−0.08em).
- `pages/index.astro:491` `h1.nickname` (clamp 4.5–10rem with `!important`).
- `pages/404.astro:49` `.error-code` (a `<p>`).
- `watchlistHeader.astro:55` (64px, hard-coded `color: white` at `:46`).

**Section titles (h2): 8.**
- Global `Layout.astro:529`: clamp(2–3rem) / 800 / accent / uppercase.
- `components/Section.astro:35`: **1.5rem / 700 / .05em**.
- `pages/index.astro:849` `.how-section > h2` and `:922` `.about-section h2`: **both re-declare exactly the `Section.astro` values** instead of using `<Section title>`.
- `pages/index.astro:1103` `.contact-section h2`: clamp(2.2–4rem) / 900 / .02em.
- `pages/projects/[slug].astro:546` "Highlights": clamp(1.5–2rem).
- Prose h2 at `projects/[slug].astro:659` and `blog/[slug].astro:258`: 1.5rem, no tracking, weight inherited 800. **Duplicates of each other.**

**Eyebrows and micro-labels (uppercase, tracked): 14.**

| Selector | Size / weight / tracking / color |
|---|---|
| `pages/index.astro:625` `.kicker-text` (+ pulsing dot `:633`) | .9rem / 700 / .1em / text |
| `pages/404.astro:89` `.kicker-text` | **identical to index** (no dot) |
| `pages/design-system.astro:86` `.eyebrow` | .85rem / 800 / .1em / accent |
| `pages/card.astro:343` `.eyebrow` | .8rem / 700 / **.18em** / accent |
| `components/CaseMeta.astro:39` `span` | .72rem / 800 / .08em / accent |
| `pages/projects/[slug].astro:598` `.section-links span` | **identical to the CaseMeta label** |
| `components/FlowDiagram.astro:46` `figcaption` | .78rem / 800 / .08em / accent |
| `svelte/KeyboardShortcutsMenu.svelte:356` `h3` (+ trailing rule `::after` `:369`) | .75rem / 700 / **.15em** / accent |
| `pages/index.astro:1053` `.carousel-cue` | .7rem / 700 / .1em / accent |
| `pages/index.astro:907` `.proof-link` | .75rem / 700 / .08em / accent |
| `layouts/Layout.astro:451` `.footer-meta` | .8rem / 700 / .05em / text @ .82 |
| `sections/Experience.astro:99` and `sections/Education.astro:74` `h4` | .9rem / 600 / .05em / accent (**duplicates**) |
| `sections/Hero.astro:173` `.info h2` | clamp(.9–1.1rem) / 600 / .05em / accent |

There are 5 tracking values (.05, .08, .1, .15, .18em) and 7 sizes. The tokens file only defines `--ds-letter-wide` (.05) and `--ds-letter-wider` (.1).

**Title underline bars: 8 implementations, 6 sizes.**

| Selector | Size and animation |
|---|---|
| `pages/index.astro:566` `.bar` | **100×6**, wipeIn .5s / .3s delay |
| `pages/projects/[slug].astro:357` `.bar` and `pages/blog/[slug].astro:185` `.bar` | **80×5**, wipeIn .5s / .2s (**duplicates**) |
| `components/ProjectCard.astro:280` and `components/BlogCard.astro:215` `.bar` | **60×4** (**duplicates**) |
| `components/FlowDiagram.astro:72` `li::before` | **40×4** |
| `pages/index.astro:579` `.hero-bar` | double bar, heavy **60×8** (`:590`) + thin **140×2** (`:610`) + lock sweep |
| `pages/404.astro:58` `.hero-bar` | heavy **80×8** (`:68`) + thin **180×2** (`:74`), a resized copy |

### 7. Links (nav, inline body, utility)

| Element | Implementations | Differing values | States / **missing** | Merge |
|---|---|---|---|---|
| Primary nav link | `components/Header.astro:184` `.nav-link` (+ `::after` underline `:202`, `.active` `:225`) | .85rem/700/.1em; pad `.5rem 1rem`; 2px transparent border; underline grows to 80% | hover+focus-visible `:214`; current state `.active` is a **class only, no `aria-current`** | → `NavLink` |
| | `layouts/Layout.astro:382` `.footer-nav a` (+ `::after` `:398`) | **.8rem**; pad `.5rem .75rem`; otherwise a copy | hover+focus-visible `:410`; **no current state** | **Near-duplicate** |
| | Nav item lists diverge: Header has Work / Writing / Design System / Resume (`Header.astro:5-12`); footer has Work / Resume (`Layout.astro:133-137`); the ⌘K menu has Home / Case Studies / Resume / Writing (`KeyboardShortcutsMenu.svelte:36-39`) | | | One nav source |
| Inline body link | `pages/blog/[slug].astro:348` `.content :global(a)` | accent, underline, offset 2px; `opacity .2s ease` | hover opacity `:355`; **no focus-visible** (ring only) | → `Prose` |
| | `pages/projects/[slug].astro` `.content`: **no `a` rule at all** | inherits `Layout.astro:296` (`color: inherit; text-decoration: none`) | **The link at `content/projects/ghosted.mdx:66` renders like plain text** | → `Prose` (bug) |
| | `sections/Experience.astro:90`, `sections/Projects.astro:88` `article a` | text → accent; `.2s ease`; no underline | **hover only**; `target=_blank` without `rel` (Experience `:21`, Projects `:18`) | → `Prose` / `TextLink` |
| | `pages/card.astro:507` `.detail-link` | text @ .8 alpha; min-h 44 | **no hover, no focus style** | — |
| Prose (other) | `projects/[slug].astro:648-738` and `blog/[slug].astro:258-357`: h2, p, ul (em-dash bullets), ol, code, pre, blockquote | blockquote bg `rgba(accent,.08)` in blog only; h3 rule in blog only; `a` rule in blog only; **no table styles in either** (tables render unstyled in 2 posts) | — | **Near-duplicate blocks** → one `Prose` |

### 8. Media frames, galleries, captions

| Element | Implementations | Differing values | States | Merge |
|---|---|---|---|---|
| **Offset frame** (signature motif) | `pages/index.astro:759/764` `.image-frame` (+ parallax) | 4px text + 4px accent at **10px** (8px ≤700) | img grayscale on hover `:795` | → `OffsetFrame` |
| | `sections/Hero.astro:183/189` `.image-frame` | **3px** + 3px at **8px** | grayscale hover `:209` | same |
| | `pages/projects/[slug].astro:460` `.media-full::before` | 4px accent at 10px (only on the page-level hero media; the `MediaFull` component has no frame) | — | same |
| | `svelte/KeyboardShortcutsMenu.svelte:266` `.menu::before` | 4px at 8px (4px ≤480) | — | same |
| | `components/Header.astro:262` `.menu-btn::before`, `pages/resume.astro:118` `.download-btn::before` | 3px at **4px**; collapses on hover | hover / focus | same (button size) |
| | `pages/card.astro:359` `.avatar-wrap` | 3px + **`box-shadow: 10px 10px 0`** (solid, not outline) | — | same |
| | `tokens.css:73` `--ds-offset-shadow: 10px` | **unused** | | |
| **Gallery** | `media/MediaFull.astro:24`, `media/MediaTwo.astro:30`, `media/MediaThree.astro:30` | Two and Three differ **only** in column count and a 900px breakpoint (verified by diff) | `.project-media:hover` grayscale (non-interactive) | → one `Media layout=full|two|three` |
| | `pages/projects/[slug].astro:450-544` | **Full re-implementation** of the same classes for frontmatter `media`, plus `padding-inline:.8rem` and the offset frame | same | **Duplicate** of the components |
| | `pages/blog/[slug].astro:239` `.post-media` | 4px; max-h 600 (300 ≤700); grayscale 20% | same | same |
| **Figure caption** | `MediaFull.astro:37`, `MediaTwo.astro:47`, `MediaThree.astro:47`, `projects/[slug].astro:490` `.media-item figcaption` | **identical ×4**: .85rem/600/.05em; 2px accent bottom rule | — | → `Media` |
| | `components/FlowDiagram.astro:96` `.caption` | .88rem; 1px top rule at .35 alpha; opacity .85 | — | — |

**Offset frame: 7 implementations** (offsets 4 / 8 / 10px; borders 3 / 4px; one done with box-shadow). **Gallery: 5.**

### 9. Dividers and rules

| Element | Implementations | Differing values |
|---|---|---|
| Muted section divider | `pages/index.astro:948/954` and `pages/resume.astro:153/159` `.section-divider` | Same rule (2px text at .18 opacity). Margins differ: clamp(2.5rem,6vh,4rem) vs clamp(2rem,5vh,3.5rem). Index draws in via `data-reveal="line"` (`Layout.astro:598`); resume doesn't. **Duplicate** |
| | `layouts/Layout.astro:358` `.footer-row--bottom` border-top | 2px `rgba(text,.18)`, the same value as `--border-muted` (`tokens.css:89`, unused) |
| | `svelte/KeyboardShortcutsMenu.svelte:446` `hr` | 2px at **.15** |
| | `components/FlowDiagram.astro:99` | **1px** at **.35** |
| | Resume list separators (×3, see Cards) | 2px **accent** at **.5** |
| Heavy rule | `Layout.astro:342` `.site-footer`; `projects/[slug].astro:746` and `blog/[slug].astro:363` `.footer-nav` | 3px solid text (consistent) |
| | `pages/index.astro:969` `.marquee` | `border-block: 3px` |
| In-component | `ProjectCard.astro:305` / `BlogCard.astro:240` footer; Media figcaption bottom | 2px text; 2px accent |

There are 4 muted-rule opacities (.15 / .18 / .35 / .5) at 2 weights.

### 10. One-off structures

| Element | Implementation | Notes / states |
|---|---|---|
| Marquee | `pages/index.astro:967` `.marquee` (track `:974`, `.m-word` `:991`, `.outline` `:1001`, `.m-sun` `:1010`, `.m-tri` `:1017`) | `aria-hidden`; pauses on hover (`:980`); reduced motion stops it (`:1031`). Single use, fine as is |
| FlowDiagram | `components/FlowDiagram.astro` (×6 in MDX) | Static; hard-coded label styles (see Eyebrows) |
| CaseMeta | `components/CaseMeta.astro` (×3 in MDX + `projects/[slug].astro:199`) | Static; label = `.section-links span` |
| Keyboard menu | `svelte/KeyboardShortcutsMenu.svelte` | Dialog: `aria-modal`, focuses the dialog (`:69`). `handleKeydown` calls `preventDefault()` on **every** key while open (`:85-86`), which blocks Tab, so the buttons never get keyboard focus and `.selected` is the only indicator. Focus is not returned to `#header-menu-btn` on close. Overlay uses a raw `rgba(0,0,0,.7)` (`:247`) |
| Header | `components/Header.astro` | Sticky; blur; nav hidden ≤900px (`:368`), where the ⌘K button becomes the only nav. Logo hover/focus scale (`:156`) |
| Footer | `layouts/Layout.astro:126-181`, styles `:339-460`, responsive `:655-674` | Logo, nav, socials, meta |
| Scroll progress | `layouts/Layout.astro:120` markup, `:558`/`:566` CSS, JS `:215-228` | 5px accent bar, `aria-hidden`, scaleX via rAF. Fine |
| Page transition | `layouts/Layout.astro:462-490` (`wipe-in`/`wipe-out` .45s on `::view-transition-*(root)`, accent group bg) | `<main transition:name="page">` (`:123`) puts the content in its own named group, so the root wipe likely skips main. **Verify in a browser.** Reduced motion handled (`:687`). `wipe-in`/`wipe-out` sit next to the unrelated `wipeIn` |
| Reveal system | `layouts/Layout.astro:575-611` `[data-reveal]`, `[data-reveal="line"]`; magnetic `:230-251` | Good shared primitive; used only on index |
| 404 | `pages/404.astro` | Composed from copies of index's `.hero-bar`, `.kicker-text`, `.cta-link` |
| Watchlist | `pages/watchlist.astro` + `watchlistHeader.astro` | Ships a stub: duplicate h1/h2 "Movie Watchlist", a nested `<main>` inside Layout's `<main>` (`watchlist.astro:8`), hard-coded `white` / `black` (`watchlistHeader.astro:46,48`) |
| Page containers | `components/Section.astro:21`; `index.astro:400` `.hero`, `:843` `.how-section`, `:916` `.about-section`, `:948` `.section-divider`, `:1097` `.contact-section`; `resume.astro:153`; `Header.astro:136`; `Layout.astro:346`; `design-system.astro:85` | **10 re-declarations** of `max-width:1100px` + 2rem / 1rem gutter; `--ds-container` and `--ds-page-gutter` exist and are used only by design-system |

---

## Focus visibility audit

There is no `outline: none` / `outline: 0` anywhere in live files, so the global ring (`animations.css:352`) reaches every Layout page. What is missing is component-level focus styling that matches hover, plus a few places where the ring can't be seen.

**Explicit `:focus-visible` that mirrors hover (good):**
- Header: `.logo`, `.nav-link`, `.menu-btn`.
- Footer: `.footer-logo`, `.footer-nav a`, `.footer-socials a`.
- index: `.cta`, `.cta-link`, `.socials a/button`, `.proof-item`.
- 404: `.cta-link`.
- Detail pages: `.back-link` ×2, `.btn`, `.btn.outline`, `.section-links a`, `.nav-link` ×2.
- card.astro: `.action`.
- Cards via `:focus-within`.

**Hover-only (relies on the generic ring; the hover treatment never shows for keyboard users):**

| Element | Location |
|---|---|
| `.view-all` | `pages/index.astro:1093` |
| `.external` | `components/ProjectCard.astro:355` |
| Resume hero icon links | `sections/Hero.astro:263` |
| Resume theme button | `sections/Hero.astro:237` |
| Experience / Projects title links | `sections/Experience.astro:95`, `sections/Projects.astro:93` |
| Blog body links | `pages/blog/[slug].astro:355` |
| Download button fill (focus only collapses the frame) | `pages/resume.astro:139` |
| Keyboard menu rows (`.selected` stands in for focus) | `svelte/KeyboardShortcutsMenu.svelte:401` |
| Logo break-apart animation | `components/AnimatedLogo.astro:173-184` |

**No state at all:**
- `pages/design-system.astro:105` `.button-demo`.
- `pages/projects/[slug].astro` `.content a` (not even styled as a link).
- `pages/card.astro`: `.detail-link` `:507`, `.qr-frame` `:531`, `.mini-link` `:556`. This page loads neither Layout nor animations.css, so even the global ring is absent and you get only the browser default.

**Ring present but not visible or not distinguishable:**
- ProjectCard and BlogCard: on `:focus-within` the card fills `--color-accent`, and the ring is also `--color-accent`, so `.external`'s ring vanishes. The `.card-link` ring is clipped by `overflow:hidden` (`ProjectCard.astro:92`, `BlogCard.astro:74`). Keyboard users see the whole card light up but can't tell which of the two links has focus.
- Keyboard menu: Tab is suppressed (`KeyboardShortcutsMenu.svelte:85-86`), so DOM focus never reaches the rows.

**Semantics:**
- `Header.astro:35-41` marks the current page with a class, not `aria-current="page"`.
- `.menu-btn` has `aria-label="Menu"` while its visible text is the page name.
- The resume theme button's accessible name is "Sun Icon".

**Hover on non-interactive elements (false affordance):**

| Element | Location |
|---|---|
| `.tech-stack li` | `projects/[slug].astro:394` |
| Blog `.tags li` | `blog/[slug].astro:222` |
| Skills `li` | `Skills.astro:112` |
| `.highlights li` | `projects/[slug].astro:573` |
| `.project-media:hover` | `MediaFull:67`, `MediaTwo:72`, `MediaThree:72`, `projects/[slug].astro:525` |
| `.post-media:hover` | `blog/[slug].astro:248` |
| `.image-frame:hover img` | `index.astro:795`, `Hero.astro:209` |

---

## Tier list

### Must (v1, components the site should own)

| Component | Replaces | Why |
|---|---|---|
| **Focus ring + motion/stroke tokens wired in** | the 2 global focus rules, 114 literal easings, literal 2/3/4px borders | Everything below depends on them. Delete `Layout.astro:328`, keep one ring, and give it an on-accent variant |
| **Button** (`primary` / `outline`, optional icon, optional `frame`) | `.cta`, `.btn`, `.btn.outline`, `.download-btn`, `.nav-link` ×2, `.button-demo` | 7 copies, 3 weights, 2 hover inversions; it's the site's main conversion element |
| **ArrowLink** (`forward` / `back`, `size`) | `.cta-link` ×2, `.view-all`, `.back-link` ×2, `.proof-link` | 6 copies; two are byte-identical; `.view-all` lacks focus |
| **IconButton** (44px only) | `.socials`, `.footer-socials`, Hero footer a/button, `.external` | 3 sizes for one control, two below the 44px token, two hover-only |
| **ThemeToggle** (one component + one JS util) | 2 buttons, 3 scripts | Fixes the first-click no-op and the /resume override, and gives the button a proper name |
| **Tag / Badge** (`badge` accent, `tag` neutral, `count` "+N", `date`) | 21 selectors | The most-duplicated element on the site. Pick one border (2px) and one size scale, and drop hover on non-links |
| **Card** (link card with a `meta` slot) + **Panel** (static box) | ProjectCard, BlogCard, `.proof-item`, `.highlights li`, `.meta-item`, DS panels | PC and BC are already ~95% the same CSS. A single Panel ends the "two hover languages" split. Fix focus-within so each link's focus is visible |
| **Eyebrow** + **AccentBar** | 14 label selectors, 8 bars | The editorial voice of the site. Collapse to 2 tracking values and 2–3 bar sizes |
| **Section** (with title) used everywhere | the 10 container re-declarations, `.how/.about` h2 copies | `Section.astro` already exists; index just doesn't use it |
| **Prose** (MDX content styles: a, h2, h3, lists, code, pre, blockquote, **table**) | the two `.content :global(...)` blocks | Fixes the unstyled case-study link and the unstyled blog tables. One source for all long-form text |
| **Media** (`layout=full|two|three`, caption, `OffsetFrame`) | MediaFull/Two/Three + the slug-page copy + `.post-media` | 5 copies; the offset frame is the signature motif and has 7 hand-rolled versions; `--ds-offset-shadow` already exists |

### Later

| Component | Why it can wait |
|---|---|
| **NavLink** (Header + footer + `aria-current`) and a single nav config | 2 near-copies; low risk; do it when nav items change next |
| **Divider** | 2 copies plus scattered rules; trivial once `--border-muted` is used |
| **PageHeader** for detail pages (badge, back link, h1, bar, description, tags, actions) | The project and blog headers are identical in structure; this is composition once the v1 parts exist |
| **Pager** (prev / all / next) | Two pages; built from Button |
| **ResumeEntry** | 3 identical list styles in `sections/*`; only one page uses them |
| **Kbd** | 2 uses (header button, ⌘K menu) |
| **Keyboard menu a11y pass** | Let Tab work, return focus to the trigger, use `:focus-visible` instead of `.selected`. Real, but it's a power-user feature |
| **Retokenize FlowDiagram / CaseMeta / card.astro** | Keep them as page-specific components; just point them at tokens and Eyebrow / Panel |

### Rewrite (must for the rewrite only; proposal amendment A3, pending Cello)

Kept off today's site until Cello picks the rewrite build. They're listed here so the inventory
stays the one place for components.

| Component | What it is |
|---|---|
| **Scene** | Layered art planes from one manifest per place. WebGL, with a DOM still for reduced motion and fallbacks. Owns the focus recipe (blur, brightness, saturate, scale tokens) and the signature motion tier |
| **CopyScrim** | A feathered ink layer behind text over art, plus the contrast rule against the 99th-percentile pixel |
| **ContextBar** | The dark green top bar: identity + Work while exploring; the project + "All work" while reading |
| **PlaceLabel** + **Admire** | The place name in Switchback (`place-name`) and the control that shows the scene ("Take in the view" / "Back to Cello") |
| **LocationCard** | Already in A1: later for today's site, must for the rewrite |
| **SceneSelector** | Storyboard only |

### Never

| Item | Why |
|---|---|
| Dead `animations.css` utilities (`.hover-lift`, `.hover-underline`, `.geo-*`, `.accent-bar*`, `.animate-*`, `.delay-*`, `.smooth`, `.anim-ready`, `.has-texture`) and the `.lab-card` / `.path-card` cursor selectors | Unused; delete instead of systematizing |
| Hover states on non-interactive chips, highlights and images | Drop them rather than make them a component state |
| Watchlist page / `watchlistHeader` | A stub that ships with nested `<main>` and hard-coded white; remove it or hide it with the other hidden pages |
| Generic Modal / Dialog, Carousel, Marquee, Typewriter, hero-construct components | Each is used once; abstraction costs more than it saves on a personal site |
| Per-component `@keyframes` | Keep one shared motion file with unique names (or `:global` plus prefixes); local copies are what collide today |
| A separate visual system for `/card` | It should consume the tokens, but it doesn't need its own components |
