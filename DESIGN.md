# DESIGN.md

Current design context for cello.dev.

## Register

Brand portfolio. The design itself is part of the proof of taste, judgment, and product-design craft.

## Direction

Geometric, tactile, and poster-like: the view from a desk window at daybreak. Two themes, Day and Dusk, both first-class; the site follows the visitor's system setting until they pick one. The site should feel like a handmade technical poster for a product designer who bridges design systems, technical prototyping, and design-dev collaboration.

Reference lane: Saul Bass-adjacent geometric poster language meets builder-native product design portfolio. Preserve the current authored look; avoid generic SaaS minimalism and generic editorial magazine styling.

## Colors

Every value lives in `src/tokens/tokens.json`; `pnpm tokens` writes `src/styles/tokens.css`, and `/design-system` shows it all. Components use **roles** (`--bg-canvas`, `--text-primary`, `--action-primary`, `--accent-ground`…), never primitives or raw values; `pnpm build` fails on a new raw color.

- Midnight Ink `#001a11`: the Dusk canvas and Day text (Cello family neutral)
- Paper 100 `#f3ede2`: the Day canvas (Cello family neutral)
- Starlight `#e0e0e0`: Dusk text
- Signal green `#00bc44` (Dusk) / `#007a33` (Day): action, in both themes
- Earth `#a89762` (Dusk) / `#6f613e` (Day): grounding shapes, never text or action
- Blueprint `#42a5ff`: construction lines and annotations only
- Seasonal poster inks: art only, never text or action

Text only ever sits on a surface (a theme canvas or an opaque plate), never on art.

## Typography

- **National Park**: page and section titles, the hero name.
- **Geist Mono**: everything else — labels, nav, data, code, and every paragraph outside an article. The site's voice.
- **Geist Sans**: long reading only (case-study and blog body), at about 69 characters a line.
- **Switchback**: place names, with the landscape.

Use the type roles (`--type-label` … `--type-display-hero`) and their leading and tracking tokens:

- Heavy uppercase display for poster moments
- Short tracked uppercase labels
- Avoid all-caps body copy

## Shape Language

Use logo primitives throughout the system:

- C-rings and partial circles
- Signal sun circles/ovals
- Grounding triangles
- Thick bars
- Offset frames (the window frame replaces them in the landscape build)
- Construction lines
- Hard-edged cards and specimens with no radius

## Layout

- Favor authored, poster-like sections over repeated templates.
- Use asymmetry with clear reading order.
- Keep macro spacing generous; spacing comes from the space scale.
- Use card grids sparingly; when needed, make them feel like artifacts or proof sheets.
- Visual pages should be image-led, with larger crops and lighter metadata.

## Motion

One curve, `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`), and tiers: UI 300ms, entry 600ms with a 60ms stagger, signature moments (page wipe, logo) at their own named values. Motion should feel like assembly, reveal, lock-in, and settle. Animate transforms and opacity, name the properties you transition, and keep keyframes in `src/styles/animations.css`. With reduced motion everything finishes at once and no delay is kept.

## Page Intent

- Homepage: strongest product-design positioning and brand poster.
- Projects: case-study-first proof of product thinking and technical fluency.
- Visuals: mini Behance/gallery inside the site, curated and image-led.
- Lab: hidden until implementations meet portfolio quality.

See `docs/00-positioning/BRAND_KIT.md` for the fuller brand kit and evolution rules.
