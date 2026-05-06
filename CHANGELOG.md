# Changelog

All notable changes to this portfolio site should be documented here.

## 2026-05-06

### Lab

- Added `/lab/3d-printer-toy-safety`, a shareable 3D printer buying database for parent-focused toy printing research.
- Added normalized printer comparison data covering price, build volume, enclosure posture, multicolor capacity, filament guidance, under-3 mouthing risk posture, purge waste, and source confidence.
- Added filters, presets, sorting, card/table/pinned views, URL state sharing, and shortlist copying for comparing consumer and reach-option multicolor printers.
- Added canonical URL support to the shared layout metadata and linked the new guide from `/lab`.

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
