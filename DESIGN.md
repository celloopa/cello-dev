# DESIGN.md

Current design context for cello.dev.

## Register

Brand portfolio. The design itself is part of the proof of taste, judgment, and product-design craft.

## Direction

Dark-first, geometric, tactile, and poster-like. The site should feel like a handmade technical poster for a product designer who bridges design systems, technical prototyping, and design-dev collaboration.

Reference lane: Saul Bass-adjacent geometric poster language meets builder-native product design portfolio. Preserve the current authored look; avoid generic SaaS minimalism and generic editorial magazine styling.

## Colors

Primary palette is defined in `src/styles/tokens.css`.

- Midnight Ink: `#001a11`, primary dark background
- Starlight: `#e0e0e0`, primary dark-mode text
- Paper: `#fff8ed`, warm paper tone
- Earth: `#887850`, grounded secondary accent and logo triangle
- Signal Green: `#00bc44`, primary action and logo sun
- Blueprint Blue: `#42a5ff`, sparing technical annotation accent
- Coral: `#ff6b4a`, sparing editorial or warning accent

Use dark mode as first-class. Light mode should remain intentional and accessible, not an afterthought.

## Typography

Current family: Geist Mono.

Use it as a brand signature:

- Heavy uppercase display for poster moments
- Short tracked uppercase labels
- Regular or medium body text with generous line-height
- Avoid all-caps body copy
- Keep copy line lengths around 65 to 75 characters

## Shape Language

Use logo primitives throughout the system:

- C-rings and partial circles
- Signal sun circles/ovals
- Grounding triangles
- Thick bars
- Offset frames
- Construction lines
- Hard-edged cards and specimens with minimal radius

## Layout

- Favor authored, poster-like sections over repeated templates.
- Use asymmetry with clear reading order.
- Keep macro spacing generous.
- Use card grids sparingly; when needed, make them feel like artifacts or proof sheets.
- Visual pages should be image-led, with larger crops and lighter metadata.

## Motion

Signature easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

Motion should feel like assembly, reveal, lock-in, and offset. Animate transforms and opacity. Preserve reduced-motion fallbacks.

## Page Intent

- Homepage: strongest product-design positioning and brand poster.
- Projects: case-study-first proof of product thinking and technical fluency.
- Visuals: mini Behance/gallery inside the site, curated and image-led.
- Lab: hidden until implementations meet portfolio quality.

See `docs/00-positioning/BRAND_KIT.md` for the fuller brand kit and evolution rules.
