# Changelog

All notable changes to this portfolio site should be documented here.

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
