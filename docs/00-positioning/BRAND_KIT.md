# Cello.dev Brand Kit

Working definition for the current portfolio identity and a guide for evolving it without losing the authored, geometric feel.

## Brand Read

Cello.dev is a product design portfolio with technical depth. The brand should feel like a handmade technical poster: precise, earthy, graphic, and a little kinetic. It should communicate that Cello can move between product systems, prototypes, implementation details, and visual storytelling without becoming a generic designer-developer portfolio.

## Brand Promise

Design judgment made buildable.

## Audience

- Product design hiring managers
- Design systems leads
- Design tools and developer tools teams
- SaaS and e-commerce product teams
- Design-dev collaborators who need clarity, systems thinking, and prototype fluency

## Personality

- Earthy, not rustic
- Technical, not cold
- Graphic, not decorative
- Confident, not inflated
- Playful through motion and geometry, not through gimmicks
- Precise enough for product systems, expressive enough for a portfolio

## Core Visual Metaphor

A product designer as a builder of clear structures: rings, frames, bars, slices, diagrams, and proofs. The existing logo already gives the system its metaphor: a C-ring, a signal sun, and an earthy triangular form. Treat those as the brand's primitive shapes.

## Current Visual DNA

### Existing strengths

- High-contrast identity in two themes: Dusk (midnight green) and Day (warm paper)
- Deep midnight green Dusk canvas, warm paper Day canvas
- Bright green signal accent
- Earth-tone secondary accent
- Heavy geometric strokes and offset borders
- Saul Bass-adjacent poster energy
- Animated logo made from separable geometric parts
- Monospace typography that makes the site feel technical and constructed
- Strong uppercase labels, bars, frames, and tactile hover states

### Current risks

- The monospace-only system can become too samey if every page uses the same tone.
- Repeated card grids can weaken the poster-like authorship.
- Lab links dilute confidence while the implementations are not portfolio-ready.
- Visuals need to feel curated like a mini Behance, not like a secondary content collection.

## Palette

Dusk is the hero scene: a hiring manager browsing a distinctive portfolio on a desktop or laptop, likely in a focused review context. The dark green canvas should feel like a studio wall, code editor, and print poster at once. Day is first-class too: warm paper, same structure, and the site follows the visitor's system setting. The source of truth is `src/tokens/tokens.json`; `/design-system` shows every role in both themes.

| Name | Token | Hex | Use |
| --- | --- | --- | --- |
| Midnight Ink | `--ink-950` | `#001a11` | Dusk canvas, Day text |
| Paper 100 | `--paper-100` | `#f3ede2` | Day canvas |
| Starlight | `--paper-200` | `#e0e0e0` | Dusk text |
| Bright Earth | `--earth-400` | `#a89762` | Grounding at Dusk |
| Earth | `--earth-500` | `#887850` | Logo triangle |
| Deep Earth | `--earth-600` | `#6f613e` | Grounding in Day |
| Signal Green | `--signal-500` | `#00bc44` | Action at Dusk, logo sun |
| Deep Signal | `--signal-700` | `#007a33` | Action in Day (4.70:1 on Paper 100) |
| Blueprint Blue | `--blueprint-500` | `#42a5ff` | Construction lines and annotations only |

Components use the semantic roles built on these (`--bg-canvas`, `--action-primary`, `--accent-ground`…), never the primitives. Seasonal poster inks are art only.

### Palette strategy

Committed palette in both themes. At Dusk the surface is mostly midnight ink, in Day warm paper; with signal green acting as a small but unmistakable live/current/buildable cue. Earth tones keep the system human and prevent it from becoming neon developer-tool cliché.

## Typography

Current type system:

- **National Park**: page and section titles, the hero name (routed park-sign lettering).
- **Geist Mono**: the signature for everything else: labels, nav, metadata, data, code and short copy.
- **Geist Sans**: long reading only, in case-study and blog bodies.
- **Switchback**: place names, arriving with the landscape.

Use them deliberately:

- Display: uppercase, heavy, tight, poster-like.
- Body: generous line-height, max 65 to 75 characters.
- Labels: uppercase, tracked, short.
- Avoid all-caps paragraphs.

## Shape Language

Use the logo primitives as a repeatable system:

- C-rings and partial circles for framing, progress, and selection
- Triangles for grounded direction, transition, and emphasis
- Bars for proof, rhythm, and section breaks
- Offset frames for tactile hierarchy
- Thick strokes for poster confidence
- Hard rectangles with minimal radius, not soft SaaS cards
- Occasional orbital or construction-line diagrams for systems content

## Layout Principles

- Prefer poster-like sections over uniform content slabs.
- Use asymmetry to create authorship, but keep reading order obvious.
- Break repeated grids with one large editorial feature, a horizontal scroll, a construction diagram, or an image-led panel.
- Keep macro spacing generous. Let one idea dominate each fold.
- Cards are allowed, but they should feel like printed specimens or framed artifacts, not generic SaaS feature cards.

## Motion Principles

- Motion should feel like assembly: parts slide, lock, reveal, or offset.
- Use `cubic-bezier(0.16, 1, 0.3, 1)` as the signature easing.
- Animate transform and opacity, not layout properties.
- Preserve reduced-motion fallbacks.
- Avoid gratuitous hover jitter. Motion should clarify hierarchy or reinforce the logo's constructed nature.

## Imagery Direction

The site should use imagery as evidence, not decoration.

- Product work: prototypes, Figma frames, systems maps, annotated flows, interface details.
- Visual work: large thumbnails, campaign-like crops, motion stills, packaging/brand systems, photographic sets.
- Atmosphere: paper grain, print texture, scanline, halftone, geometric masks.
- Avoid generic office/person stock imagery.

## Copy Voice

Short, concrete, and product-focused.

Prefer:

- “I prototype the uncertain parts before teams commit to build.”
- “Systems, behaviors, and handoff intent.”
- “Visual work as evidence of taste, composition, and brand judgment.”

Avoid:

- “Elevate,” “unleash,” “next-gen,” “seamless,” “transformative.”
- Broad designer/developer generalist framing.
- Treating labs as polished proof before they are ready.

## Page-Level Brand Rules

### Homepage

Should be the strongest brand poster. Lead with product design positioning, animated name, and proof of design-dev fluency. Keep Lab hidden until the work is strong enough.

### Case Studies

Should feel like product evidence. Use problem, constraints, decisions, prototypes, systems, and outcomes. Visual rhythm can borrow from technical diagrams and editorial proof sheets.

### Visuals

Should become a mini Behance inside the site: image-led, curated, category-filterable, and generous. The page should feel more like an art-directed gallery than a card index.

Recommended structure:

1. Large visual hero with positioning: “A visual archive of brand, packaging, motion, photography, and campaign work.”
2. Featured wall with 1 to 3 large pieces.
3. Filter or category rail.
4. Masonry/gallery grid with bigger images and lighter metadata.
5. Detail pages that show large media, project context, tools, and related pieces.

### Lab

Hide navigation and homepage entry points for now. Keep the route only as an internal staging area until the experiments meet the same craft bar as the portfolio.

## Brand Board Prompt

Use this prompt with an image/brandkit generator to create a future-facing visual board based on the current site:

> Create a premium brand-kit overview image for “Cello.dev”. Category: product design portfolio for design systems, technical prototyping, and design-dev collaboration. Audience: product design hiring managers, design systems teams, design tools teams, developer tools teams. Personality: earthy, technical, geometric, poster-like, precise, human. Core metaphor: a designer who turns ambiguity into buildable structure, expressed through C-rings, signal sun, grounded triangle, frames, bars, construction lines, and prototype artifacts. Layout: 3×3 grid on a dark charcoal/midnight-green presentation canvas with strong gutters, sparse labels, and refined negative space. Panels: logo cover, logo construction from C-ring/sun/triangle primitives, homepage/browser application, tagline panel reading “Design judgment made buildable.”, palette chips, Geist Mono type specimen, case-study artifact mockup, visual archive/gallery direction, UI/detail component strip. Visual mode: dark developer/builder meets Saul Bass poster. Palette: midnight green #001A11, starlight #E0E0E0, signal green #00BC44, earth #887850, paper #F3EDE2, sparing blueprint blue #42A5FF. Style: premium identity deck, sparse, cinematic, tactile, print texture, halftone/grain, thick geometric strokes, no generic SaaS gradients, no glassmorphism, no fake stock people, no copied real-world logos. Typography: Geist Mono-inspired monospace, uppercase labels, heavy display scale, readable sparse text.

## Evolution Guardrails

When evolving the site, preserve:

- Midnight green Dusk and warm paper Day, both first-class
- Signal green as action/build cue
- Earth tone as human grounding
- Geometric logo primitives
- Thick strokes, bars, and offset frames
- Product designer with technical fluency positioning
- Motion as assembly and reveal

Change or improve:

- Reduce generic card-grid reliance
- Make Visuals image-led and curated
- Introduce stronger case-study artifact layouts
- Add richer media, process images, and prototype proof
- Consider one additional display typeface only if it sharpens the brand
