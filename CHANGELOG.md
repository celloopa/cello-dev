# Changelog

All notable changes to this portfolio site should be documented here.

## Preview iteration: conversational home

- Ground the hiking guide: his feet now line up with the bottom of the chat instead of hanging beside the name, and he is about 1.4× larger (88px wide on phones, 176px on desktop). He can rise above a short greeting without stretching it.

- Bring the clean-shaven character forward beside the chat, preserving independent cursor depth. Replace the builder joke with a useful-product sentiment; fade earlier body messages upward as the next takes focus. On phone home, move Menu to the bottom project rail and hide the duplicate top bar, while retaining case-study back navigation.

- Give the hiking character a clean shave; keep its depth layer and greeting behavior.

- Place the simplified hiking character on Mt. Hood as an independent fifth depth plane between terrain and foreground. Share the existing cursor spring, shader and static fallback; keep chat fixed. Preserve the character’s current haircut, glasses, rain jacket and backpack, with private source photographs kept out of the repository.

- Let the circle avatar enter and the intro messages write themselves in sequence. Add Show all and Replay hello, session-aware return behavior, stable layout, and immediate complete copy for reduced motion/no JavaScript. Keep direct routes available during the greeting.

- Add Cello’s existing avatar, Mt. Hood greeting and immediate routes to Work, Writing and About. Keep YouTube hidden pending the new channel.
- Enlarge home project artifacts, pair project marks with names, and introduce a problem/decision/result opening before case-study media. Condense Ghosted’s main navigation to six chapters while retaining supporting evidence and anchors.
- Preserve the landscape renderer, cursor depth, still fallbacks and approved production release. See `docs/landscape/PREVIEW-CONVERSATIONAL-HOME.md` for scope and checks.

## 2026-10-14 — Blog embeds

- Register a shared `<Embed />` component for blog MDX: native Threads and X/Twitter posts, responsive YouTube players, and article link previews with supplied metadata.
- Load social SDKs near the viewport, once per provider, with Astro navigation re-scans and permanent original-source links. Use YouTube's privacy-enhanced domain, a titled player and optional start time.
- Validate author-supplied URLs and provider IDs; keep article rendering independent of remote metadata services.
- Added the Threads source embed beneath its mention in “When will the future of design arrive?”; approved prose and the concept exploration remain unchanged.
- Authoring examples and local responsive/blocked-provider checks: `docs/writing/embeds.md`.

## 2026-10-14 — Writing

### Writing: future of design and a conversational voice

- Published “When will the future of design arrive?” with the approved article body, source links, and a WebP of the generated collaboration concept. The caption identifies it as an imagined experience, not a functional prototype.
- Rewrote “Designing for the second user” and “Programmatic resumes you can chat with” in the endorsed first-person, concrete, conversational voice. Kept their URLs, original publication dates, evidence, authorship, links and media; revision dates are October 14.
- Applied the same voice to the flower-drop automation and Ghosted design-system drafts. Both remain unpublished. Historical results and plans keep their original context.
- Added an optional uncropped image display to MediaFull so the concept's call profiles and lower canvas remain visible; existing media retains its current sizing.
- Baseline, inventory and reading-check evidence: `docs/writing/2026-10-14-publication.md`.

### Validation

- `pnpm build`: token/family/Figma guards pass, Astro check 114 files with zero errors, warnings or hints, 16 pages built.
- Writing list and all three public posts captured at 1440 and 390 px under both theme settings (16 screenshots); tablet and phone layout checks pass. Browser walk: Writing → new article → second-user post → resume post.
- Original dates, draft flags, links and media references preserved; local built links/images resolve; private capture material excluded; both drafts absent from static output.

## 2026-10-14 — Landscape portfolio

- Add Home/Contact icons and project marks to the connected rail, including Daybreak’s newer Rail and block icon. Enlarge the rail on the hero, shrink it by 10% in reading, and restore its size on hover or keyboard focus. Restyle the menu with a clear close control, grouped rows and About navigation.

- Correct the project timeline to the small connected-node rail Cello intended, with a green current node instead of numbers. Retain existing navigation and scenery.

- Restore a separate `/about/` for About and How I Build; update utility/event-card links and forward historical home fragments. Add a homepage project timeline with desktop rail, mobile bottom bar, click/tap, scrubbing, current-stop tracking, and keyboard/no-JavaScript links. Retain the existing scenery and cursor depth. Navigation checks: `docs/landscape/POLISH.md`.

- Keep all failed-renderer fallbacks static. Shader failures and context loss cannot earn the image-to-canvas handoff; wait for a successful frame with a visible sky. Document the rendering performance investigation.

- Keep background images visible until WebGL actually draws, including when browser protections block the scene module.

- Apply the hero’s cursor-driven depth and shared per-layer spring tuning across scene backdrops and case-study backgrounds, without moving content; keep tested caps and reduced-motion stills.
- Keep the existing scrolling landscape portfolio. Remove the separate “Take in the view” mode; the scenery is the space throughout.
- Clean hidden fills and registered edges for Over Hood, Moss Falls, Meadows Lift and Salmon Ridge. All ten scenes retain bounded cut layers. Add slow reading drift at one fifth of each inspected cap, 24 seconds of movement followed by 60 seconds at rest, at most 30 fps. Load only the active backdrop’s cut stack; suspend the covered renderer. Reduced motion, Save-Data, missing WebGL/textures and hidden tabs keep the still fallback.
- Give case-study summaries the full artifact frame, with two columns and a full-width Tools row; center the reading column and allow media to use the wider frame. Fix phone TOC focus clipping, touch hover states, Menu spacing, and keyboard-menu Tab/focus return.
- Add MP4 sources and poster images for all 15 currently linked videos (20 placements), including home previews. Home previews use the same Pause/Play control as case-study media.
- Fix Day text contrast during the arrival-to-reading scroll range. Add the reading motion values to the token source and existing Figma library. Correct utility-page canonicals and canonical trailing slashes.
- Verification and release limitations: `docs/landscape/POLISH.md`. Release checks and cutover procedure: `docs/landscape/RELEASE-2026-10-14.md`.

## 2026-10-12

### Design system, stage 9: Figma follows code (foundations)

- A Figma library, "cello.dev Design System", generated from `src/tokens/tokens.json`: primitives (hidden), the color roles with Day and Dusk modes and their use-when lines, the seasonal art inks, type, space, layout, stroke and motion values, and one text style per type role (National Park, Geist Mono, Geist) with size and family bound to variables. Every variable carries its CSS name as code syntax.
- `pnpm figma:sync --emit` writes the one re-runnable Figma script; `--record` stores the synced hash in `src/tokens/figma-synced.json`. `pnpm build` fails while Figma is behind the synced tokens and prints the exact steps. Components follow at the landscape cutover. No visible change on the site.

### Design system, stage 8: the Cello family layer

- The roots every Cello product shares now live in their own repo (`~/Documents/code/cello-family`, v0.1.0): Geist Mono and Geist, Midnight Ink and Paper, the house curve and the reduced-motion contract, and voice. cello.dev vendors a pinned copy at `src/tokens/family.json`.
- `pnpm build` fails if the site's tokens drift from it (fonts, neutral endpoints, the curve, delays zeroed under reduced motion), and only warns when the family repo has a newer version, so no build depends on a local folder. No visible change.

### Design system, stage 7: the system documents itself

- `/design-system` is rebuilt from `src/tokens/tokens.json` at build time, so it can't drift from the CSS: Day and Dusk side by side, every color role with both themes and its use-when line, primitives, the seasonal inks, the three faces and every type role, the space, layout, stroke and motion scales, and how a change gets in.
- The unused Coral color and its aliases are gone.
- `DESIGN.md` and the brand kit describe the system as shipped: Day and Dusk both first-class, green as action in both themes, earth as grounding, National Park / Geist Mono / Geist Sans, the motion tiers.

### Design system, stage 4 (values): roles and scales instead of one-offs

- Tints → color roles: inline code and quotes in articles use the neutral `bg-muted` / `border-muted` instead of green tints (green stays for action); the ⌘K overlay and the header backdrop use `scrim` (paper in Day, not black); the resume's section rules are earth (`accent-ground`); case-meta panels use `bg-raised`.
- Type: off-scale font sizes snap to the type roles (label 0.75, small 0.85, UI 0.9, title 1.25, heading 1.5rem); every page h1 is the page title, including the resume name, which is now larger and wraps to two lines on phones. Tracking collapses to three values, and line heights to the leading scale (articles read at 1.75).
- Spacing: off-scale margins, paddings and gaps snap to the space scale (a pixel or two on chips, tags and the menu key).
- Raw values outside the tokens: 1,208 at the start of the migration, 201 now (home, print, art gradients and display posters make up most of the rest).

### Design system, stage 4 (motion): one contract, one keyframes file, tiers

- Reduced motion now follows the Cello family contract in one block: animations and transitions finish at once and every delay is zeroed (new `--motion-none`), so content never waits on motion. Before, reduced-motion visitors still waited up to 1s on staggered entries.
- Keyframes live once, in `src/styles/animations.css`, with unique names. Astro doesn't scope `@keyframes`, so same-named definitions used to fight page by page (`slideUp` had 9 definitions in 3 variants). Shared entry motion is `enter-rise`, `enter-from-left`, `enter-from-right`, `enter-scale` and `enter-wipe`, with each component's travel kept through `--enter-distance`. The dead animation utilities are gone. The 404 bar runs its own wipe instead of a site-wide one that overrode it.
- Durations and easing snap to the tiers: hovers and presses at 300ms (`--motion-ui`), entries at 600ms (`--motion-entry`), staggers at 60ms (`--motion-stagger`; 30ms for long chip lists), every `ease` replaced by the house curve. The page wipe (450ms) and the logo (12s loop, 700ms break) keep their values as named signature tokens. Home's own hero choreography is unchanged; home is replaced at the landscape cutover.
- No `transition: all` left outside home: each one names the properties its hover and focus states change.
- New `pnpm motion:table`: every animation and transition each page runs, read from Chrome, with normal and reduced motion. Motion changes are proved by diffing it. The token guard now also reads transition and animation values that span several lines.

### Design system, stage 3: Day

- Light mode is Day: the Paper 100 canvas (`#f3ede2`), green as the action color in both themes (`#007a33` in Day, 4.70:1 on paper), earth for grounding. Dark mode (Dusk) is unchanged.
- One theme module (`ThemeInit.astro` + `src/utils/themeToggle.js`) fixes three bugs: client-side navigation flipped Day back to Dusk, `/resume` forced and saved Dusk, and the home toggle's first click did nothing for light-preferring visitors. The toggle is named "Switch to Day" / "Switch to Dusk".

### Design system, stages 0–2a: tokens underneath, and Geist Mono for real

- Stage 0: one token source (`src/tokens/tokens.json`) generates `src/styles/tokens.css`. Guards run first in `pnpm build`: the token CSS is current, no new raw values (a per-file ratchet), and no hand-built keyframes, fonts, transitions, containers or theme storage. `pnpm ui:shots` screenshots 12 pages at 1440 and 390 px in both themes and compares them pixel for pixel.
- Stages 1a–1b: semantic roles, art and type tokens at today's values, with the old names kept as aliases; 738 literals became tokens (raw values 1,208 → 499). No visible change: 0 px on all 48 screens against the previous live build.
- Stage 2a: the site now actually renders Geist Mono. The `@font-face` registered "Geist Mono" but every rule asked for "GeistMono", so visitors got Courier or Menlo. `--font-mono` names the right family; the unused 100–300 weights are gone; 400 and 700 are preloaded.
- Design-system docs (`docs/design-system/`): the audit, the proposal and its amendments, the identity decisions I1–I6, and before/after shots. Private links and local paths were removed before publishing.
- Restored `@types/node` (pinned 22.15.17), which a lockfile update had dropped, breaking `astro check` on a clean install.

### Design system, stages 2b–2c: National Park titles, Geist Sans for long reading

- Stage 2b: the hero name, page titles (h1), section titles (h2) and the /card name are set in National Park (OFL 1.1, self-hosted from `@fontsource-variable/national-park`, latin file preloaded). Labels, card titles and body stay Geist Mono.
- Stage 2c: in case studies and blog posts, the article's own paragraphs, lists and quotes are set in Geist Sans (OFL 1.1, `@fontsource-variable/geist`, loaded only on article pages), capped at about 69 characters a line on desktop. Inline code in articles is Geist Mono instead of the browser's Courier. Captions, metadata and embedded components are unchanged.
- The font guard now accepts `font-family: var(--font-…)` (a token) and still rejects any raw font stack.

### Validation

- A clean `CI=true pnpm install --frozen-lockfile` + `pnpm build`: token guards green, `astro check` 0 errors / 0 warnings / 0 hints, 14 pages.
- `ui:shots`: 0 px on 48 screens for stages 0–1b; stage 2a changes only the face and the line wraps it causes; 2b–2c change 44 of 48 screens, only at titles and article prose (the 404 page, which has no titles, is unchanged).
- Live after deploy: 16 public URLs 200, both redirects 301 to the right targets, `/cv.json` label unchanged, resume PDF intact; Chrome loads Geist Mono as a webfont.

## 2026-10-08

### Consolidation around the build philosophy

- Consolidated case studies to four: Asheville Dispensary (new; absorbs Ad Asset Directory), VegAvengers, Ghosted, Daybreak. Archived Ascendant Traders and the Figma/Payload placeholder (`complete: false`, files kept); added Netlify redirects for the retired URLs.
- New Asheville Dispensary case study: the product-to-social video pipeline (code-first page selection, Premiere replaced by ffmpeg, the premature-broadcast day and completeness gate, the script-gated cost redesign), the asset directory as foundation, and other automations at their real stage.
- Rewrote Ghosted across three versions, including the October 2026 rebuild and an honest note on agent-built implementation.
- Homepage, layout metadata, and projects index now lead with "Product Designer & Design Engineer — Design Systems & AI Tools"; proof cards map to code first, a small checkable model job, and approval where it matters.
- Lightened Daybreak (dropped July test counts) and reordered: Asheville → VegAvengers → Ghosted → Daybreak.
- Rewrote the unpublished flower-drop post from the July write-up (still `draft: true`).
- `cv.json`: new label; concrete idle-day cost figure instead of "~60%"; print coordination described as a prototype and other automations as planned; Ghosted described as in early testing with agent-built v3 credited. Resume PDF regenerated.

## 2026-07-31

### Generative AI Portfolio Sprint

- Repositioned the homepage around human-centered AI systems, creative workflow tooling, bounded automation, and product-design-to-engineering translation.
- Added Daybreak as the lead case study with sanitized real product screens, an explicit UI/agent operation model, honest dogfood limits, and fresh test evidence from the native Mac and iPhone codebase.
- Promoted Ghosted behind Daybreak as the clearest bounded-AI workflow and integrated the latest shipped web-product story and assets from upstream.
- Updated VegAvengers from its original front-end case into the current live product-system story: Payload editorial workflows, PostgreSQL and R2 infrastructure, verified live-search fallbacks, selective rebuilds, and a nightly freshness backstop.
- Reordered the featured work so the portfolio opens with Daybreak, Ghosted, and the strongest supporting production systems.
- Updated `cv.json` with the same human-centered AI positioning, truthful Daybreak and VegAvengers evidence, and no unsupported node-based, footwear, 3D, or additive-manufacturing claims.
- Regenerated the downloadable resume from the live CV and tightened print styles so the tailored document renders cleanly in two letter-size pages.
- Added canonical metadata for individual project routes.
- Preserved and validated the homepage construction-line, reveal, scroll-progress, marquee, parallax, and reduced-motion behavior added in the current working tree.

### Validation

- `pnpm build` passed with 0 Astro check errors, warnings, or hints.
- Production-preview Lighthouse passed at 100 for accessibility, best practices, SEO, and agentic browsing on both mobile and desktop.
- Visually checked the homepage and Daybreak case in dark and light themes at desktop and 390px mobile widths; no horizontal overflow or broken media was found.
- Rendered and inspected both pages of `public/files/marcelo_rondon-resume.pdf`; text extraction and visual review found no clipping, overlap, or broken glyphs.

## 2026-05-08

### Agent Workflow

- Moved Pi/Figma agent workflow helpers out of the portfolio repo and into global Pi extensions so they can be reused across projects.
- Removed tracked project-local imagegen prompt/result files and the project-local `codex-imagegen` extension from `.pi/`.
- Ignored future local Pi and generated image artifacts with `.pi/` and `generated/` gitignore entries.
- Preserved Figma/imagegen workflow guidance globally for reusable bitmap building blocks, named replaceable Figma image layers, clipboard paste fallback, and editable design structure.

## 2026-05-06

### Lab

- Added `/lab/3d-printer-toy-safety`, a shareable 3D printer buying database for parent-focused toy printing research.
- Added normalized printer comparison data covering price, build volume, enclosure posture, multicolor capacity, filament guidance, under-3 mouthing risk posture, purge waste, and source confidence.
- Added filters, presets, sorting, card/table/pinned views, URL state sharing, and shortlist copying for comparing consumer and reach-option multicolor printers.
- Added canonical URL support to the shared layout metadata and linked the new guide from `/lab`.
- Refined the printer guide UI so comparison cards emphasize rank, price, ease, build size, evidence quality, color workflow, and one short kid-context note.
- Removed the large toddler-baseline section and posture-heavy filters in favor of a compact safety disclaimer and actual buying differentiators.
- Refreshed the printer data around the May 2026 Top 30 research ranking, adding newer large-format and multicolor candidates, updated prices, build volumes, color mechanisms, purge-waste posture, and watchlist/excluded states.

### Validation

- `pnpm build` passed with 0 Astro check errors, warnings, or hints.

## 2026-04-26

### Polish Pass

- Tightened homepage mobile hero spacing so the first viewport leads with Cello's name, preserves the portrait, and hints at the proof cards below.
- Added global focus-visible treatment and keyboard-focus card reveal states.
- Stabilized card media aspect ratios for images and videos to reduce layout shift.
- Improved light-theme earth accent contrast and added theme-aware visual archive accent tokens.
- Replaced missing visual archive placeholder images with generated bitmap placeholders.
- Repointed missing project media references in the Ad Asset Directory and Ghosted case studies to existing assets.
- Improved the color-scheme lab controls with labels, touch-size targets, live status text, and non-console failure handling.
- Updated the keyboard shortcut overlay event handling to remove dev-server Svelte accessibility/deprecation warnings.

### Validation

- `pnpm build` passed with 0 Astro check errors, warnings, or hints.
- Known unrelated warning remains: `/watchlist-bg.png` is referenced by the watchlist page but does not resolve at build time.

### Product Design Repositioning

- Repositioned the current Astro site around Cello as a Product Designer focused on systems, technical prototypes, and design-dev collaboration.
- Kept the animated `Cello` homepage name treatment while adding shorter product-design positioning copy.
- Added homepage CTAs for `View Case Studies` and `Explore the Lab`.
- Added concise homepage proof cards for Product Systems, Technical Prototyping, and Design-Dev Collaboration.
- Simplified homepage About copy to avoid repeating the positioning.
- Updated navigation labels to Case Studies, Lab, Writing, Visuals, and Resume.
- Added a lightweight `/lab` route.
- Added the `Figma/Payload Feature Prototype` as an in-progress MDX project placeholder.
- Reframed existing project descriptions around product design value and restored VegAvengers to featured work.
- Updated project, writing, visual archive, and metadata copy for the new positioning.
- Updated `cv.json` summary to match the current website story.
- Included existing `src/pages/card.astro` changes in the shipped commit.

### Validation

- `pnpm build` passed with 0 Astro check errors, warnings, or hints.
- Known unrelated warning remains: `/watchlist-bg.png` is referenced by the watchlist page but does not resolve at build time.

### Not Started

- Payload CMS migration.
- Full Figma/Payload case study artifacts, prototype screenshots, demo video, or Payload data model.
