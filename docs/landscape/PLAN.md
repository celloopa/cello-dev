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

## Chapters build (planned 2026-10-13; not started)

Cello paused the cutover (Q39) to rework how the experience is presented: **the scene owns the
thresholds, the work owns the middle.** Decisions: rewrite GRILL Q23–Q47 (on `claude/rewrite-exploration`).
Reference: the approved "Landscape Thresholds" storyboard, source at
`docs/rewrite/storyboards/thresholds/` on that branch ("this looks so awesome"). Builds on this branch's
pin `250cd03`; old pin results are the baseline in `CUTOVER.md`.

**Gate:** start only when `rig` is OK or BUSY (it was STOP at planning time). One heavy job at a time:
one build agent, one dev server, no parallel renders. Checkpoint after each stage (commit + a line here).

| # | Stage | Decisions | Touches |
|---|---|---|---|
| C0 | **Chapter + rail components; idle tiers; A4 draft.** `Chapter` (place full-bleed, caption, title/role/pitch, one artifact on the sill, Read / Live), `ChapterRail` (right rail ≥900px, bottom bar on phones above Safari's toolbar; a `<nav>` list of links; tap/drag scrub; progress; `aria-current`), the two idle tiers (chapter: 3–5 s, drift within caps + art motion + pointer parallax, rests 60–90 s; reading: 20–30 s, art-only, rests ~1 min; ≤30 fps; off for reduced motion / Save-Data / hidden), the scroll-tied depth hand-off (out near-first, in back-to-front, reversible, within caps, reduced motion = cut). A4 tokens in tokens.json with use-lines; migration thread reviews; Figma re-sync before preview. | Q26–Q28, Q31, Q32, Q37, Q38, Q43 | `src/components/scene/*`, `src/lib/scene/*`, `src/styles/scene.css`, tokens |
| C1 | **Home = arrival → 4 project chapters → Let's Talk.** Arrival: one screen, living scene, text at first paint, cv.json label as title (Q41), "Open to…" + summary kept, first chapter peeks at the bottom, no "Take in the view" (Admire removed: state, CSS, tokens, ArrowLink `down` if unused). Remove the S3 page-wide backdrop swaps on home. Fix the old arrival→reading-line contrast failure by construction. | Q24, Q25, Q34, Q40–Q42 | `src/pages/index.astro`, SceneLayout, ContextBar |
| C2 | **Case studies + posts.** Cover chapter, cross-document view transition doorway (place stays, title → h1, artifact settles; Back → same chapter; no-VT = normal load; URLs unchanged), calm reading on the settled still with the reading idle, the next project's chapter rises at the end (no auto-navigation). Posts follow the same pattern. Top bar shows the title once the cover scrolls away. | Q29–Q33, Q42, Q43 | `projects/[slug]`, `blog/[slug]`, ReadHead, StoryEnd |
| C3 | **/about (new URL) + indexes.** /about: Bald Mountain cover, About + How I Build calm, ends on Let's Talk; `/#about` and `/#how` forward to it. /projects and /blog: calm swatch indexes (swatch + role + one line + year), no backdrop swaps. | Q35, Q36 | `src/pages/about.astro`, `projects/index`, `blog.astro`, `_redirects` only if needed (risky area: conductor reviews) |
| C4 | **/card: show, then share.** Pitch screen (name, cv.json title, "Open to…", `[Cello's words]` pitch slot, big QR to cello.design, Save Contact + Share), then the four compact chapters (shared component) with `[Cello's words]` 10-second slots, then About (→ /about) + contact. Online only; words/QR/actions at first paint. | Q44–Q47 | `src/pages/card.astro` |
| C5 | **Verify + hand to cutover.** pnpm build 0/0/0 (+ family, Figma in sync), URL contract (+ /about), ui:shots, motion table, keyboard, A3/A4 contrast incl. idle extremes and the arrival→reading range, perf (LCP phone Slow 4G ≤ baseline 1.78 s), iPhone notes from CUTOVER.md (sticky tap state on theme/Pause, Menu dot at the left edge). Then demo refresh (squashed on live master) and the cutover thread re-pins. | Q39 | — |

Copy rule unchanged: today's words only; `[Cello's words]` where a slot has none. Pairings and captions
from `scene-pairings.json` and the catalog (Q40). Motion caps from the manifests; still-first four stay
at 0 travel until the "raise scene motion caps" cleanup task.

**Additions from the cutover thread (2026-10-13), folded into the stages:**
- **C3:** `/#about` and `/#how` can't go through `_redirects` (the fragment never reaches the server).
  Home gets a tiny inline script (`location.hash` → `location.replace('/about#…')`). Without JS it falls
  back to home's top. `_redirects` stays untouched.
- **C1/C4:** every chapter artifact that's a video ships **webm + mp4 + poster** (the Ghosted Loop
  pattern, MediaVideo). iPhone Safari showed WebM-only, poster-less videos as empty boxes, and in a
  chapter that box is the hero of the screen.
- **C5** runs CUTOVER.md T1–T12. The cutover thread re-runs them on the C5 sha and on the preview.
  Hand it the sha with a green build. Beyond the table above:
  - URL contract 17 × 200 (+ /about), 2 × 301, the 8 expected 404s.
  - /cv.json and the PDF byte-identical to live; .vcf as text/vcard.
  - A3 contrast **during** the depth hand-off and while the rail scrubs.
  - Doorway Back/forward lands on the same chapter (scroll restoration with snap + bfcache). The no-VT
    fallback needs Firefox, and desktop Safari is checked by Cello by hand.
  - No wrong-theme frame across the cross-document VT.
  - Keyboard: Tab brings each chapter fully into view, snap never traps focus, skip link first.
  - Reduced motion: scroll-behavior auto, hand-off = cut, no idle.
  - Phone Slow 4G total transfer for a full scroll, lazy places, CLS from snap ≤ 0.05.
  - Fallbacks per chapter: ?gl=0, context loss, blocked texture, hidden tab, Save-Data.
  - /about SEO (title, description, canonical, OG image that resolves). Optional: fix the canonicals
    for /resume, /design-system and /watchlist, which point at home, and add the missing trailing slash.
  - Privacy grep from the local patterns file on the squashed tree; D2/D3 eye check of new artifacts.
