# cello.dev design system: proposal

2026-10-12 · for Cello's approval · builds on [`audit.md`](audit.md) (the count) and his answers Q1–Q7 (audit §11). Nothing here is built yet. Migration starts only after he approves, on a branch, one stage at a time. Never merged or deployed without his go.

## 0. What's already decided

| | Decision |
|---|---|
| Scope | Full staged migration of today's site; each stage changes nothing visible (pixel diff = 0) or one named thing |
| Face | Geist Mono, loaded for real |
| Light canvas | Paper 100 `#f3ede2` |
| Green | Means action in both themes; light mode uses `signal-700 #007a33`; earth is grounding everywhere |
| First visit | Follows the system setting, on every page |
| Blueprint / coral | Blueprint = construction and annotation only; coral removed |
| Family layer | Its own repo, `~/Documents/code/cello-family`, pinned per product |
| Figma | Waiting on Cello's links; Figma follows code either way |

## 1. Architecture

```
cello-family/family.json  (v0.1.0, vendored copy)  ── type families, neutrals, house curve, reduced-motion contract, voice
            │ referenced by
src/tokens/tokens.json    ── the only hand-edited source
   primitive  → raw ramps, no meaning, never used in components
   semantic   → usage-named aliases with dark/light modes, one usage line each
   component  → only Button and Tag (states differ by variant)
   space · layout · type · stroke · motion · layer · breakpoint
            │ pnpm tokens
src/styles/tokens.css  (generated)   docs/design-system/tokens.md (generated tables)   src/lib/motion.ts (generated, for the few JS timings)
```

The rules are Ghosted's, restated for this site:
- **A raw value in a semantic token is a defect.** Semantics alias primitives. Tints are built from primitives with `color-mix()`, never typed as `rgba(224,224,224,.18)`.
- **Names are roles, not looks:** `--action-primary`, not `--green`. In CSS a role is `--group-role`; in Figma it's `group/role`.
- **Every semantic token and type role carries a use-when / don't line.** It's stored as `$description` in the JSON, and travels into CSS comments, the generated tables, the `/design-system` page and Figma.
- **One left edge per container. Inner blocks never add side padding.**
- **Legacy names stay as aliases for one release** (`--color-accent: var(--action-primary)`), so the rewrite branch and any open work keep building. They're removed once no branch uses them, or after two weeks, whichever is later.

## 2. Color

### Primitives (`tokens.json → primitive`)

| Primitive | Value | Status |
|---|---|---|
| ink-950 | `#001a11` | keep (family neutral) |
| paper-100 | `#f3ede2` | keep (family neutral; light canvas) |
| paper-200 | `#e0e0e0` | keep (dark-mode text, "Starlight") |
| earth-400 / 500 / 600 | `#a89762` `#887850` `#6f613e` | keep |
| signal-500 | `#00bc44` | keep |
| signal-700 | `#007a33` | **new** (light-mode action; 4.70:1 on paper-100) |
| blueprint-500 | `#42a5ff` | keep |
| ink-900, ink-800, paper-50, signal-400, coral-500 | | **removed** (0 uses; coral by Q6). `/card`'s QR keeps its literal `#FFF8ED`, which is on purpose: the QR library can't read CSS |

### Semantic roles

| Role | Dark | Light | Use when · don't |
|---|---|---|---|
| `bg-canvas` | ink-950 | paper-100 | The page. Never inside a component. |
| `bg-raised` | text 3.5% over canvas | text 3.5% over canvas | Panels, CaseMeta boxes, card bodies at rest. Don't stack two. |
| `bg-muted` | text 8% | text 8% | Hover fields, code blocks, table stripes. Not for selected or current states. |
| `bg-inverse` | paper-200 | ink-950 | The rare inverted block (⌘K hint, marquee-style bars). Text on it is `text-inverse`. |
| `text-primary` | paper-200 | ink-950 | All reading text. 13.8:1 / 15.6:1. |
| `text-muted` | text 82% | text 78% | Metadata, dates, captions, ledes. Never below this tint for text. |
| `text-inverse` | ink-950 | paper-100 | Text on `bg-inverse` or on `action-primary`. |
| `text-accent` | signal-500 | signal-700 | Section titles (h2), eyebrows, the hero name. Same color as action, on purpose: it's the site's voice. **Never the only cue for a link**, because links also carry an arrow or underline. |
| `action-primary` | signal-500 | signal-700 | Primary buttons, links, the current nav item, the scroll bar, the selection highlight. |
| `action-primary-hover` | signal-500 + inverse | signal-700 + inverse | The hover/press inversion of a filled action (the existing fill-swap behavior). |
| `focus-ring` | signal-500 | signal-700 | Keyboard focus on everything: 3px, offset 3px (today's `animations.css:352` ring, kept). On cards, the ring sits outside the fill so it never merges with the hover fill. |
| `accent-ground` | earth-400 | earth-600 | Grounding shapes: triangles, offset frames' shadow plates, the logo triangle, decorative bars. Never text, never action. |
| `accent-construction` | blueprint-500 | blueprint-500 | Construction lines and annotations in diagrams and the hero. Never text, never action. (Decorative, so it's exempt from 3:1; see the audit's contrast table.) |
| `border-strong` | = text-primary | = text-primary | Specimen frames, buttons, tags. |
| `border-muted` | text 18% | text 18% | Dividers and rules only, never a control's edge (1.6:1). |
| `scrim` | canvas 60% | canvas 60% | Behind text on images; behind the ⌘K menu. |
| `shadow-offset` | = accent-ground / action | same | The brand's hard offset plate (see §5). |

That's **16 roles** for the 22 tint alphas and 3 color layers counted in the audit. Each audit row maps to one role, in the migration table that stage 1 writes.

## 3. Type

Families come from the family layer: **Geist Mono** for everything (OFL 1.1, weights 400/600/700/800/900 only; the 500 and the 100–300 imports go). Sizes stay in rem so browser text size still works.

| Role | Size | Line | Weight · tracking | Use when · don't | Absorbs (audit) |
|---|---|---|---|---|---|
| `display-hero` | clamp(4.5rem, 10vw, 10rem) | .95 | 900 · −.04em | The hero name only | 1 |
| `display-poster` | named one-offs | .9–1 | 900 | Marquee, 404 numeral, `/card` name. Art, not a ramp step; each is a named token | ~6 clamps |
| `page-title` | clamp(2.5rem, 8vw, 4rem) | 1.1 | 900 caps | h1 of every page | 11 h1 styles |
| `section-title` | clamp(2rem, 5vw, 3rem) | 1.1 | 800 caps · .05em, `text-accent` | h2 sections | 8 h2 styles |
| `heading` | 1.5rem | 1.2 | 700 | In-article h2, card titles at large size | 1.45, 1.5, 1.6 |
| `title` | 1.25rem | 1.3 | 700 | h3, card titles | 1.2, 1.25 |
| `body-lg` | 1.1rem | 1.75 | 400 | Homepage and listing ledes | 1.1, 1.15 |
| `body` | 1rem | 1.75 | 400 | Articles, cards, resume | 1rem (articles 1.8 → 1.75: under 1px per line, stage 4) |
| `ui` | .9rem | 1.4 | 700 caps · .05em | Buttons, nav, back links | .9, .92, .95 |
| `small` | .85rem | 1.55 | 400 | Card descriptions, captions, meta | .8, .84, .85, .88 |
| `label` | .75rem | 1.2 | 700 caps · .1em | Eyebrows, tags, badges, micro-labels | .7, .72, .75, .78 (and .65) |

Tracking collapses to 3 values: `tight` −.04em, `caps` .05em, `wide` .1em; .08em goes to wide and .02–.04em to caps. Weights are 5 (400/600/700/800/900). Line heights: the 18 values in use become the 6 above.

## 4. Space and layout

Scale in rem, named by px: `space-4` .25 · `space-8` .5 · `space-12` .75 · `space-16` 1 · `space-20` 1.25 · `space-24` 1.5 · `space-32` 2 · `space-48` 3 · `space-64` 4 · `space-96` 6. It covers 78% of today's uses as is; the rest (.35, .4, .6, .65, .8, .85, .9rem) snap to the nearest step in stage 4.

Layout tokens are used before a raw step:

| Token | Value | Use |
|---|---|---|
| `layout-container` | 1100px | the page column (written out 10 times today) |
| `layout-container-wide` | 1500px | breakout carousels |
| `layout-gutter` | 2rem → 1rem ≤700px | page side padding; **only** the page container uses it |
| `layout-measure` | 68ch | reading width for prose (58–76ch today) |
| `layout-measure-narrow` | 46ch | ledes and card copy |
| `layout-section` | clamp(3rem, 8vh, 5rem) | between page sections |
| `layout-stack` | 1.5rem | between groups in a section |
| `layout-stack-tight` | .75rem | within a group |

The three layout rules:
1. **One left edge per container.** Every direct child starts at the container's content edge. This fixes the 0.8rem article inset (215 → 202, 29 → 16).
2. **Inner blocks don't add side padding.** Prose, galleries and meta boxes sit on the column.
3. **Named indents only:** list bullets, and the content inside framed boxes (`card-pad` 1.25rem).

Breakpoints: `bp-phone` 700, `bp-tablet` 900, written one way (`width <= …`). 480/600/960/1100 snap to these.

## 5. Shape, stroke, elevation, layers

- **Radius:** none, with `50%` for dots. On purpose (the brand's hard edges); no radius tokens beyond `radius-circle`.
- **Stroke:** `stroke-rule` 1px (dividers), `stroke-control` 2px (buttons, tags, media), `stroke-frame` 3px (cards, specimens), `stroke-bar` 4px (heavy bars). CSS triangles keep their geometry values (shapes, not strokes).
- **Elevation:** one, `shadow-offset` = `10px 10px 0` in the frame's plate color. It's the brand's offset frame, built by hand 7 times today, and becomes the OffsetFrame component. The one soft `0 20px 40px` hover shadow goes.
- **Layers** (code only): `layer-base` 0 · `layer-raised` 1 · `layer-header` 100 · `layer-menu` 1000 · `layer-overlay` 2000. The −1/2 uses stay local inside their own stacking contexts.

## 6. Motion

Family: the house curve `cubic-bezier(0.16, 1, 0.3, 1)` is `ease-out` for everything. `linear` is for loops only. `ease`/`ease-out` keywords go (39 uses).

| Tier | Token | Value | Contents | Reduced motion |
|---|---|---|---|---|
| UI | `motion-ui` | 300ms | hover, color, press, menu (0.2–0.4s today) | direct |
| Entry | `motion-entry` | 600ms + `motion-stagger` 60ms | reveal, slide, wipe, scale (0.5–0.8s; staggers .03–.1s) | content shown at once, no delay |
| Signature | named | today's values | hero lock-in (type 150ms/char → settle 240 → bar sweep 420 → lines 900), logo assembly/break (12s loop, 700ms break), page wipe 450 | static logo, final text |
| Ambient | named | today's values | texture 40s (72s touch), marquee 32s, kicker pulse 2.4s | stopped |

- **The reduced-motion contract** (from the family): one block (today it's written twice), and it zeroes `animation-delay` and `transition-delay` too, so content never waits on motion.
- **Keyframes live in one file** with unique names. Astro doesn't scope `@keyframes`, so today's 8 `slideUp` definitions overwrite each other.
- **`transition: all` → named properties** (24 uses).
- `--motion-*` and `--ds-duration-*` collapse into the tokens above. The 300 vs 320ms disagreement resolves to 300.
- Motion can't be pixel-diffed, so motion stages are proved by a generated motion table (every animation: trigger, property, duration, easing, tier, reduced-motion handling, file:line), compared before and after.

## 7. Components (v1)

From the inventory (components.md). Each lives in `src/components/ui/`, owns its own states (hover, focus-visible, active, disabled where it applies), reads only semantic tokens, and replaces the listed hand-builds.

| Component | Variants | Replaces |
|---|---|---|
| Button | Primary (filled), Secondary (outline) · md, sm · `href` renders `<a>` | 9 button styles |
| ArrowLink | Forward →, Back ←, External ↗ | 7 arrow/back links (`.cta-link` = `.back-link` today) |
| IconButton | 44px only, `aria-label` required | 4 sizes (two under the touch target) |
| ThemeToggle | — | 3 scripts with different sources of truth |
| Tag | Tech, Role, Date, Count (+N) | 21 selectors for ~6 ideas |
| Card | Project, Post (Post = Project minus external link) · one hover language: the accent sweep | ProjectCard + BlogCard + 2 hover styles |
| Panel | Plain, Labeled (eyebrow + body) | 6 static box styles (CaseMeta, proof cards…) |
| Eyebrow + AccentBar | Eyebrow; bar sm/md | 14 label styles, 8 bars in 6 sizes |
| Section | with title, without | h2 re-declared in pages instead of using `<Section>` |
| Prose | one, for all MDX | the two drifted article copies; adds link underline, tables, blockquote |
| Media + OffsetFrame | Full, Two, Three · frame plate color | 5 galleries (one full copy inside `projects/[slug]`), 7 hand-built offset frames |
| Focus ring | global, one | the two conflicting global rings |

- **Later:** NavLink from one nav config, Divider, PageHeader, Pager, Kbd, the ⌘K menu's accessibility pass (Tab is blocked today, and focus doesn't return on close). ResumeEntry also moves to later, because the resume is no longer the site's point (Cello, 2026-10-12, an exploration).
- **Never:** one-off Modal, Carousel or Marquee components; hover on non-interactive chips; the watchlist stub; dead utility classes.

Fixes that ride with their component: case-study body links get an underline (today they look like text), blog tables get styles, `aria-current` on the current nav item, the resume toggle's accessible name.

## 8. Guards (`pnpm check`, also run inside `pnpm build` so Netlify can't deploy drift)

1. **Generated files are stale.** Regenerate `tokens.css`, `motion.ts` and the generated tables in memory, and compare byte for byte with disk.
2. **Raw-value ratchet.** Count per file: hex/rgb colors, `font-size`, spacing (`margin`/`padding`/`gap`), `font-weight`, `line-height`, `letter-spacing`, durations and `cubic-bezier`, all outside `src/tokens` and `print.css`. Fail if any (file, value) count rises above `src/tokens/raw-baseline.json`. `--baseline` is rerun only after removing literals. The on-purpose leftovers (theme-color meta, QR, brand icons, Ghosted's colors, print) stay in the baseline with a reason.
3. **Hand-built component bans**, line by line in `src/pages`, `src/layouts`, `src/components` (except `ui/`):
   - `@keyframes` outside `src/styles/animations.css`
   - `font-family:` outside tokens
   - `transition: all`
   - `max-width: 1100px` (use the container)
   - a class matching `btn|button|cta|tag|badge|chip|eyebrow|kicker|back-link|offset-frame` on an element that isn't the ui component
   - `localStorage.setItem('theme'` outside ThemeToggle
4. **Family drift.** The vendored `src/tokens/family.json` must match the values tokens.json uses (fonts, neutrals, house curve) → fail. If `~/Documents/code/cello-family` exists and has a newer version → **warn only**, so CI never depends on a local folder.
5. **Figma is stale** (once the Figma file exists). The tokens.json hash ≠ `src/tokens/figma-synced.json` → fail, with the exact sync steps in the message.
6. **Screenshots.** `pnpm ui:shots <dir> [--compare <dir>]`: 10 pages × 1440/390 × dark/light, reduced motion, system Chrome via `playwright-core`, exact by default (`--tolerance`/`--noise` as explicit escape hatches). It's the script this audit already used, moved into `scripts/`.

When all pass it prints one line naming every guard.

## 9. The Cello family layer, v0.1.0 (proposed contents)

Written once, in `~/Documents/code/cello-family/family.json`; cello.dev and Daybreak each vendor a pinned copy. It holds only what the count shows is already Cello-wide:

```json
{
  "version": "0.1.0",
  "type": {
    "mono": { "family": "Geist Mono", "license": "OFL-1.1",
      "$description": "Data, labels, time, code. Every Cello product may use it; none is required to make it the body face." },
    "sans": { "family": "Geist", "license": "OFL-1.1",
      "$description": "The sibling for long reading where a product wants one. cello.dev doesn't use it today." }
  },
  "neutral": {
    "ink":   { "$value": "#001a11", "$description": "The darkest neutral: a green-black, never pure black." },
    "paper": { "$value": "#f3ede2", "$description": "The lightest neutral: warm paper, never pure white." },
    "rule": "Each product builds its own ramp between ink and paper and may shift it; text on canvas stays at or above 7:1."
  },
  "motion": {
    "ease-out": { "$value": "cubic-bezier(0.16, 1, 0.3, 1)", "$description": "The house curve. Arrivals, reveals, hovers. Loops use linear." },
    "character": "Assembly: parts arrive, lock in, and settle. Motion explains a change; it never decorates content.",
    "reduced-motion": "Every animation has a direct-state fallback; delays are zeroed; content never waits on motion; loops stop."
  },
  "voice": {
    "principles": ["Short, concrete, specific before broad", "Claim, then proof", "Honest maturity labels (in progress, private beta, personal)", "No guilt, no hype"],
    "banned": ["elevate", "unleash", "next-gen", "seamless", "transformative"]
  }
}
```

**Not family**, each product's own: action color, earth, the C-ring/sun/triangle mark, display faces and scale, texture, spacing, components. Daybreak's identity starts from scratch (its grill, item 14); this layer only constrains type families, the two neutral endpoints, the curve and reduced-motion contract, and voice.

Daybreak records the version it follows and runs the same drift check; that's Daybreak's own session's work, and this one doesn't touch its repo.

## 10. Stages

One stage = one commit series on `claude/design-system-migration` (cut from master after approval). Each stage changes **nothing visible** (`ui:shots --compare` = 0 px on all 40 screens) **or one named thing** (before/after shots for Cello). Each ends with `pnpm check` + `astro check` + build passing. Cello reviews each visible stage before the next starts.

| # | Stage | Visible? | Proof |
|---|---|---|---|
| 0 | **Groundwork:** tokens.json holding today's exact values, the generator, all guards with today's baselines, `ui:shots` in `scripts/`, the baseline shots; remove the 21 unreachable files and dead primitives | no | 0 px |
| 1 | **Literals → tokens at today's values:** one semantic color layer (legacy names become aliases), type/space/stroke/motion tokens wherever a token equals today's value; off-scale values stay raw so the ratchet lists them | no | 0 px; ratchet baseline drops |
| 2 | **Geist Mono loads** (the family-name fix; 9 weight imports → 5) | **yes: the face** | before/after, both themes, both widths |
| 3 | **Light mode:** Paper 100 canvas, green as action (signal-700), earth as grounding; one ThemeToggle; /resume follows the system | **yes: light mode only** | dark shots 0 px; light before/after |
| 4 | **Consolidation:** type roles, the spacing snap, line heights, tracking, tints → roles, durations/easing → tiers, one reduced-motion block with zeroed delays, keyframes deduped, the soft shadow → offset | **yes, small**, one commit per property | before/after per commit + motion table diff |
| 5 | **Layout rules:** one left edge (article inset removed), one container, shared Prose | **yes: article edge** | before/after on case studies and posts; others 0 px |
| 6 | **Components** (§7), one per commit; global hover/focus rules removed as each component owns its states; the ⌘K and link/table fixes | mostly no; focus and link fixes visible | 0 px or named |
| 7 | **Docs and the `/design-system` page** generated from tokens.json; CLAUDE.md/DESIGN.md/BRAND_KIT corrected (stale palette, light canvas, dark-first wording) | /design-system only | before/after |
| 8 | **Family repo v0.1.0** created and vendored; the family drift guard switched on | no | guard output |
| 9 | **Figma follows code:** variables (primitives hidden, semantics with modes and descriptions), text styles, the v1 components; existing files compared first if Cello sends links | — | Figma screenshots + read-only drift check |

Rewrite-aware effort (from the rewrite thread's grill, 2026-10-12, exploration-level): a rewrite would retire the marquee and the hero typewriter lock-in and move the hero photo to About. These migrate **at today's values only**, with no polish. Stage 2 preloads only the two most-rendered weights (400 body, 700 headings and labels) and loads 600/800/900 on demand, which matches the rewrite's performance budget.

Coordination: the rewrite-exploration branch (`claude/rewrite-exploration`) reads tokens.json once stage 1 lands. Legacy aliases keep it building. No other open branch touches styles today (checked 2026-10-12).

## 11. What Cello is approving

1. The architecture and the 16 semantic roles (§1–2), with their use-when lines.
2. The type roles (§3), spacing and layout rules (§4), and the motion tiers (§6), including the snaps stage 4 will make visible.
3. The v1 component list and tiers (§7).
4. The guards (§8), including running them inside `pnpm build`.
5. The family layer v0.1.0 contents (§9).
6. The stage order (§10).


## Amendment A1: the identity revision (2026-10-12)

Source: `identity.md`, decisions I1–I6. Each was asked one at a time and answered by Cello.
Everything above still holds unless this section changes it.

**Themes (I2).** The two modes are named **Day** (the light values) and **Dusk** (the dark
values). The values themselves don't change. Rule: text only sits on Day or Dusk surfaces or on a
plate, never on scene art.

**New semantic role:**

| Role | Day | Dusk | Use when · don't |
|---|---|---|---|
| `bg-plate` | paper-100 at 100% | ink-950 at 100% | An opaque panel carrying text over a scene or image. Never translucent: if a scene shows through, it isn't a plate. |

**New art group (I3).** `art/season/<month>/{sky, far, snow, forest, ground}` at the values in
`identity.md`, plus the dusk rule: `color-mix(in oklab, <ink> 40%, ink-950)`, with snow at 55%.
Art never carries text or action, and it's exempt from text contrast because of the rule above.
These tokens aren't semantic roles.

**Type (I4).** Two display families are added; Geist Mono stays the body face:

| Family | Roles | License |
|---|---|---|
| National Park (variable weight) | `display-hero`, `page-title`, `section-title` | OFL 1.1, self-hosted |
| Switchback (Regular; Rough for weathered art) | new role `place-name`, used on location cards and scenes | OFL 1.1, self-hosted from github.com/national-park-service/fonts |

`place-name`: for the name of a place, never for the name of a project or a page. Its size and
tracking get set when the location card is built.

**Shape (I5).** The window frame replaces the offset frame as the framing primitive: frame 6px ·
mullion 4px · sill. `shadow-offset` becomes the sill plate. In §7, Media + OffsetFrame becomes
**Media + WindowFrame**. LocationCard is added as a later-tier component for today's site and a
must-tier one for the rewrite.

**Mark (I1).** It reads as C + green sun + Mt Hood and belongs to cello.dev. Daybreak was told.

**Stages (I6).** Stage 2 splits in two:
- **2a.** Geist Mono loads (visible: the face).
- **2b.** National Park sets titles (visible: the titles).

Stage 3 also renames the toggle and the docs to Day/Dusk. Stage 6 builds WindowFrame in place of
OffsetFrame (visible: the frames). The art tokens, `bg-plate`, `place-name` and LocationCard are
defined but stay unused until the rewrite.

**Family layer.** No change. The display faces belong to cello.dev, not to the family layer.


## Amendment A2: Geist Sans for long reading (2026-10-12)

Cello made Geist Sans a Cello family root and placed it on cello.dev: **long reading only.**

| Family | Roles | License |
|---|---|---|
| Geist (Sans) | `body` inside Prose, which is case-study and blog body text | OFL 1.1 (family layer) |

Geist Mono stays the voice for UI, labels, nav, metadata, data and code, and for every other
paragraph on the site. New token: `--font-read`, used by the Prose component only. It's its own
visible stage, **2c**, after 2b, covering articles only. That shows best once Prose exists, so if
2c lands before stage 6 it styles the two article templates' `.content` directly.


## Scope note: the landscape cutover (Cello, 2026-10-12)

The rewrite's landscape build (`claude/landscape-build`, cut from this branch) replaces home,
the projects index and the blog index at cutover. Cello answered two questions about that on
2026-10-12 ("1-2 good yes"):
- Stage 3 (Day canvas, green as action, one ThemeToggle, /resume follows the system) still ships to
  today's site before the cutover.
- Stages 4–6 skip the pages the landscape replaces. They cover what survives the cutover: case
  studies, posts, /resume, /card, /design-system and 404.
The same answer approved stage 2b's look.

## Amendment A3 (proposed, pending Cello): what the rewrite's landscape build adds

Source: `docs/rewrite/DS-HANDOFF.md` at `7a96777` and the prototype at `f1b1e66`, both on
`claude/rewrite-exploration`. The decisions behind it are D1–D6 in `identity.md`. **None of this is
approved.** It applies only to the rewrite and stays off today's site until Cello picks the build.

1. **Scene component.** Replaces the earlier SceneStop/scene-kit idea.
   - Built from one manifest per place: layers back to front, depth, tested motion caps per layer,
     desktop anchor, mobile center, Figma IDs.
   - Renders as WebGL planes. The same layers stacked in the DOM are the still, used for reduced
     motion, no WebGL, a texture failure or a hidden tab.
2. **A signature motion tier**, beside the tiers in §6:
   - arrival: sky → far → mid → near with a 0.12 s stagger and spring overshoot by depth, half the
     drop on mobile, and text never waits;
   - pointer depth, clamped to each scene's tested caps;
   - a 0.55 s focus transition;
   - a still under reduced motion, and the loop stops when idle or hidden.
3. **Focus-recipe tokens.** Desktop: blur 7px, brightness 0.45, saturate 0.65. Mobile: blur 5px,
   brightness 0.36, saturate 0.6. Art scale 1.025. These are the storyboard v2 levels Cello approved (D4).
4. **Copy scrim + contrast rule.**
   - Scrim: a feathered ink layer behind copy over art, 64% by default, 70–80% on mobile, 85% on
     Ecola desktop.
   - Rule: text over art passes 4.5:1 (3:1 for large text) against the 99th-percentile brightest
     pixel under it.
   - **Conflict for Cello:** this replaces A1/I3's "art is exempt from text contrast because text
     never sits on it", which stops being true once D1 lets text sit on art. Two options: keep I3
     for today's site and use this rule in the rewrite, or adopt this rule everywhere.
5. **Contextual top bar.** While exploring it shows identity + Work, with utilities kept separate.
   While reading it shows the project in view + "All work" (D5).
6. **Place label** (the `place-name` role in Switchback) and the **Admire** control.
7. **Scene selector**: storyboarded, not built.

How the landscape build (`claude/landscape-build`, S0–S1) encodes this, for review:
- **Tokens**, group "Scene" in `tokens.json`, each with a use-line: focus recipe `--focus-blur`,
  `--focus-brightness`, `--focus-saturate` (+ `-mobile`), `--focus-scale`, and the composed
  `--focus-filter`/`--focus-filter-mobile` for the DOM still; copy scrim `--scrim-copy` 64%,
  `--scrim-copy-mobile` 70%, `--scrim-copy-ecola`/`-ecola-mobile` 85%/80%, with
  `--scrim-copy-fill` and `--scrim-copy-mask`; the ink atmosphere `--atmos-arrive` (+ mobile),
  `--atmos-view`, `--atmos-read`; signature motion `--motion-arrival-stagger` 120ms,
  `--motion-arrival-overshoot` 0.107 (≈11%, damping .58), `--motion-focus` 550ms,
  `--motion-scene-fade` 700ms, `--motion-handoff` 400ms; `--scene-bar` and the copy insets
  `--scene-copy-start/end/bottom`. The WebGL renderer reads the same tokens at runtime.
- **Motion caps are not tokens.** They live in each scene's manifest (`public/scenes/<id>/scene.json`),
  because they're measured per cut; still-first scenes get 0 travel.
- **Type and color** it needed beyond the list above: `--type-display-scene`, `--type-hero-line`,
  `--type-place-name`, `--type-place-label`, `--text-on-art`, `--text-on-art-muted`,
  `--font-place-rough`. Switchback is declared from `tokens.json` ("faces"), so a family still only
  enters through the type tokens.
- **The contrast conflict (item 4) in the build:** scene pages use the rule here, and today's
  pages keep I3 until Cello picks. Every line of text over art is measured against the
  99th-percentile brightest pixel under it, at 1440 and 390, in Day and Dusk, WebGL and the still,
  in arrival, Admire and reading (`docs/landscape/CHECKS.md`). A line that fails gets a stronger
  scrim or an on-art color, never a weaker check.

What the migration owes the rewrite:
- National Park self-hosted (stage 2b).
- Switchback self-hosted, which can land with 2b as a defined but unused face.
- Geist Sans `--font-read` (stage 2c). The rewrite's landscape copy becomes its second consumer.
