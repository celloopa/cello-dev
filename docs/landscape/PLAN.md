# Landscape build: plan to cutover (2026-10-12)

Branch `claude/landscape-build`, cut from `claude/design-system-migration` @ `42824f2`. Cello picked
the landscape direction to build and to fit into the design system (rewrite GRILL Q22), with
cutover this week after he irons it out on a Netlify branch preview. Today's site (`master`,
cello.design) stays live and unchanged until cutover. Nothing merges to `master` without his go,
through the "Ship cello.dev" conductor (`docs/ship/PROFILE.md` on `claude/ship-conductor`).

Sources: the rewrite branch `claude/rewrite-exploration` holds the decisions (`docs/rewrite/GRILL.md`
Q18–Q22), the storyboard brief (`docs/rewrite/STORYBOARD.md`), the system handoff
(`docs/rewrite/DS-HANDOFF.md`), and the working prototype (`docs/rewrite/prototypes`, `?d=landscape`
at `f1b1e66`). Read them with `git show claude/rewrite-exploration:<path>`.

## Rules

- **Today's copy.** Words come from the live site's content (MDX, `cv.json`, existing page copy).
  No new marketing copy. A slot without existing words gets a visible `[Cello's words]` placeholder.
- **The URL contract holds.** The 16 URLs in `docs/ship/PROFILE.md` stay 200, the two 301s stay,
  and the expected 404s stay 404. `cv.json`, the resume PDF and `public/_redirects` are untouched.
- **The design system is the source.**
  - Styles read `src/tokens/tokens.json` roles through the generated `src/styles/tokens.css`. A new value gets a token, plus a `$description` use-line.
  - New pieces (Scene, focus recipe, copy scrim, the Signature motion tier, contextual bar, place label) enter as **amendment A3**. `pnpm build` (`tokens --check` + `astro check` + `astro build`) stays green.
- **People never appear in scene art.** Case-study artifacts use demo personas only (D2, D3).
- **Text over art** passes 4.5:1 (3:1 for large text) against the 99th-percentile brightest pixel under it. This is the rewrite's revision of I2/I3; today's site keeps I2 until cutover.
- Reduced motion, no WebGL and a hidden tab all get the still. Text never waits on motion.

## Stages

| # | Stage | Done when |
|---|---|---|
| S0 | **Foundation.**<br>• Fonts self-hosted (National Park variable → woff2, Switchback Regular + Rough, OFL files), registered as type tokens (I4).<br>• `three` added.<br>• Scene assets for all ten places in `public/scenes/<place>/` (web WebPs + `scene.json`) and `src/data/scene-library.json`.<br>• Prototype modules ported to `src/lib/scene/`.<br>• A3 tokens added. | `pnpm build` green; fonts render; no page changed yet |
| S1 | **Home in the landscape.**<br>• New Layout with the dark bar (exploring vs reading contexts), the Scene hero (arrival, capped depth, admire), today's hero copy, the Work list.<br>• Focus/reading when the Work list comes into view.<br>• Mobile framing, fallbacks. | 1440/390 shots, console clean, contrast measured, LCP ≤ 2.0 s mobile |
| S2 | **Case studies and posts.** `projects/[slug]` and `blog/[slug]` open over their paired scene in the reading state, with Prose (A2 Geist Sans for long reading if the system has it), MediaFull/Video, a footer (next story, About/Contact/Log/Resume). | every live case study and post renders; URL contract green |
| S3 | **Indexes and utilities.** `/projects` as the scene selector (swatch index), `/blog`, `/resume` (utility, tokens only), `/card`, `/watchlist`, `/design-system`, 404. | all 16 URLs 200, 301s, expected 404s |
| S4 | **QA and preview.**<br>• a11y (keyboard, focus, contrast on every scene), reduced motion, perf budget, ui:shots.<br>• Push the branch for a Netlify preview (Cello's go given 2026-10-12).<br>• Cello irons out; fixes. | Cello's go → conductor ships |

## Scene pairings (proposed for Cello's approval; mood only, no claims about where work was made)

| Page | Scene | Why (mood) |
|---|---|---|
| Home | Mirror Lake | the anchor frame A; calm, Mt Hood |
| Asheville Dispensary | Over Hood | one system seen whole, from above |
| Ghosted | Ecola | a view through the trees; the storyboard already pairs them |
| VegAvengers | Sauvie | open farm field and big sky; food and festivals |
| Daybreak | Meadows | bright June morning |
| Posts | Bald Mountain, Ramona, Moss Falls, Meadows Lift, Salmon Ridge | rotate by post |

Still-first scenes (Over Hood, Moss Falls, Meadows Lift, Salmon Ridge) render with 0 travel; the
reading state is nearly still anyway. "Why this place" lines, if any, are Cello's to write.
