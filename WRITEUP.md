# WRITEUP: rebuilding cello.dev with my current process

Running source doc (build-writeup, mode 1), kept as the rewrite thread goes. It's the source
for the held post (and maybe a video) in the Brain note "Held for Cello (2026-10-12)", drafted
only when the rewrite ships. Facts only. Anything unconfirmed is marked `[verify]`.

Status: **exploration**, started 2026-10-12. No direction picked yet. Nothing merged, pushed or
deployed.

## 1. The manual workflow it replaced

The old way of building this site, by hand (the git history gives the facts; the rest is
Cello's to confirm):

1. First commit 2024-04-17 ("initial commit"), then a few days of hand-built setup ("heading
   and style setup", "hero setup and README"). 162 commits through 2026-10-12: 42 in 2024,
   13 in 2025, 107 in 2026.
2. Styles were written per component in scoped `<style>` blocks, as each page needed them.
   A token file came later and was barely adopted (audit: about 3% of spacing goes through it).
3. Case-study and blog templates were copied rather than shared, and the copies drifted
   (26 duplicated selectors).
4. Docs described a palette the code didn't use, and a font the browser never loaded.
5. Time cost of the original build: `[verify: ask Cello]`.

Why it hurt: every new page added values rather than reusing them (49 font sizes, 55 spacing
values), and nobody could see the drift, because the site still looked fine in Courier.

## 2. The end state

`[pending: written when a direction is picked and the rewrite ships]`

## 3. Architecture

`[pending]`

## 4. Build story — the beats worth telling

1. **The font that never loaded.** (From the parallel audit, 2026-10-12.) The site was
   designed around Geist Mono. The `@font-face` registered `"Geist Mono"`, but every rule
   asked for `"GeistMono"`. The browser never matched the face, so it never downloaded it, and
   every visitor since the site launched saw Courier Bold (Chrome) or Menlo. It surfaced only
   once the audit counted values instead of eyeballing them: the font report in Chrome's
   devtools named the face actually used. Lesson for the post: you can't see the drift you're
   used to.
2. **Back up before you touch anything.** Before the rewrite, a dated, read-only snapshot of
   all content, taken from `origin/master` (`0d4ede0`, what's actually live). The local
   `master` was 4 commits behind, so a snapshot from the working copy would have missed the
   latest case-study edits. Path:
   `/Users/cello_r/Documents/code/astro/cello-dev-content-snapshots/2026-10-12-origin-master-0d4ede0/`
   (142 files, 35 MB, SHA-256 manifest, chmod read-only, plus a tarball).
3. **The URL contract.** Before designing, curl every route. 16 live URLs and 2 existing 301s
   are the contract. 8 URLs already 404 (drafts, plus `/visuals`, `/lab` and `/color-scheme`,
   which CLAUDE.md still lists as live). No sitemap is deployed.

4. **Migrate first, explore in parallel.** In the audit session Cello chose a staged migration
   of the existing site over a rewrite. A rewrite would start from the migrated system. This
   thread kept going as throwaway prototypes only, so the migration has a target. The two
   sessions traded answers instead of asking him the same questions twice.
5. **Work first, resume second.** "maybe the resume isnt the point of the site anymore" (Cello,
   2026-10-12). The rewrite moves the resume to a utility link and puts work, demos and a
   writing/video "Log" at the center.
6. **The ambition call: first three.js project.** Offered a native-first, no-WebGL stack with a
   tight budget, Cello said "i want something truly awesome … use this as my first three
   project". The budget was rewritten to fit three.js rather than dropped: SVG first paint,
   three.js on idle, still frame under reduced motion.

7. **First look, then a reset.** The first direction built was Cut paper: the mark as matte
   paper cut-outs with pre-blurred shadows. On first sight Cello said "I don't love the current
   look" and asked what makes three.js sites good. The answer that reset the work: on the best
   ones, take the 3D away and the idea is gone. Cut paper failed that test; it was a nicer logo.
8. **Tokens: a design system, literally.** The fresh pass maps three.js's strength (thousands
   of particles, image pixels dissolving and re-forming) to the site's spine. The mark is built
   from ~13k square "tokens" that stream out and rebuild each case study's image, then hand
   off to the crisp image. One draw call. Kaptain Kristian's match cuts (Cello's reference) are
   the grammar: the same tokens flow from shot to shot.
9. **The screenshot detour.** The devtools browser could only write files inside its own
   workspace, so the 22-shot set moved to a small Playwright script driving the installed Chrome
   (`docs/rewrite/prototypes/shoot.mjs`). It also checks the reduced-motion page really drops
   the 3D.

10. **From logo to place.** Cello moved the stage from the mark to his Portland desk window, with
    his favorite places showing through it as WPA-style posters, built from 11 of his own photos
    (Mt Hood is in 7 of the 10 landscapes; no city landmarks). Twice the agent took an analogy
    literally ("like a train window" became a scrolling train ride) and had to back out: the same
    latching his channel brief warns about. The fix was to play the model back before building.
11. **Shapes as storyboards.** Procedural "scene kit" posters (firs, ridges, a traced Mt Hood) gave
    every place a composition and depth plan in an afternoon. Cello didn't love the look, but
    kept them as storyboards. The identity session folded the concept into the system the same
    day (Day/Dusk themes, seasonal inks from the photos, National Park + Switchback faces, the
    window frame as the framing primitive).
12. **Finding the current image path.** Pi's image tool shelled out to an old Codex CLI (0.154 vs
    0.162). Research showed Codex itself had moved to dedicated Images endpoints that accept the
    ChatGPT login. A 200-line script (now the shared `codex-images` skill) produced three style
    frames of Mirror Lake in about 22 s each on the subscription. Before upload, the "no people"
    reference photo turned out to have two tiny figures and a tent at full size; they were
    blurred out first.

13. **The pick.** Three Mirror Lake frames (screenprint, gouache, risograph). Cello picked the
    screenprint and asked how to recreate that look accurately. The answer: frame A becomes the
    style anchor for every place, and each place is generated whole, then cut into layers by
    editing that same image, so the edges line up.
14. **The model redraws what it keeps.** Asked for "only the sky" or "only the trees" on flat
    magenta, the edits came back on the master's pixel grid, but redrawn: the clouds moved, Mt
    Hood's snowfields shifted, and the trees-and-lake edit quietly dropped the mountain's
    reflection. The fix was to stop trusting the edits as art and use them as mattes: a
    100-line PIL key (no numpy) turns each magenta edit into an alpha mask, and the color comes
    from the master wherever it was visible. Only what the master never showed (sky behind the
    mountain, slopes behind the firs) comes from the edits. Same lesson as the font: measure,
    don't eyeball (the restack check is a pixel diff against the master).
15. **Figma as the cutting table.** A file in Harmonic Convergence holds the story (a Process
    page with every look, in build order) and the scenes (master + named layers). The window
    loads what Figma exports, so Cello can fix an edge by hand without touching code. The round
    trip is lossless on visible pixels (max 3/255). Small snags: Figma's uploader rejects WebP
    without an explicit content type, and its renderer showed uploaded WebP blank, so JPEG/PNG go in.

16. **The landscape becomes the stage.** In the Codex continuation, Cello moved away from
    paper cards toward full-screen scenery and content in depth. Ten generated layout studies
    explored cards, a name on the horizon, focus, and a project index. They changed the art;
    Cello corrected the method: compose the actual cut layers instead. Static paired desktop
    and mobile storyboards now use Mirror Lake's existing layers and the kit for uncut places.
    He approved the reading dim level, then removed location and sound clutter during focus.
17. **Photo first, composition later.** Cello clarified “image gen as a shader”: keep the
    actual photo composition, stylize it, cut the resulting master, then rearrange layers in
    three.js. Portrait scenes may be outpainted, with their center preserved. Ecola now has an expanded master with its treated portrait center restored exactly and four
    source-colored cuts. Restack matches exactly, with small depth extremes reviewed. The six
    PNGs are placed in Figma. The URL export endpoint returned an empty challenge response;
    native isolated PNG image outputs recovered the round trip with exact visible color/alpha. A shared scene-cutting skill and updated Figma
    notes carry the method into individual Meadows, Ramona and Over Hood agents. Other scenes
    follow. A real Ghosted artifact now shows where the landscape yields to product evidence.

18. **One proof, eight agents.** Ecola established the workflow before eight individual scene
    agents each owned a photo, run log, cut recipe and Figma section. The parent merged the
    ledger and verified native exports: nine new candidates,29 planes, eight locked portrait
    centers, all exact0 pixel checks. Meadows Lift was already landscape4:3 and needed no
    expansion. Fine-detail consistency still varies. Over Hood, Moss Falls, Meadows Lift and
    Salmon Ridge are marked still-first because motion exposes wing, foreground, cable or
    expansion seams. Asset completion does not mean animation clearance.
19. **The export can be tiled.** Moss mid's full native PNG response closed transport while
    a smaller preview worked. Two temporary pixel-aligned transparent clipping frames produced
    scale1 PNG tiles. Joining them restored the source-resolution plane exactly; the temporary
    nodes were removed. The cutting skill and Figma notes now include this recovery, and the
    storyboard shows the real cuts with explicit limitations.

20. **The handoff has a real gate.** The prepared brief targets the exact `Rewrite cello.dev`
    session. An inherited API-key override failed on credits; retrying the existing subscription
    login failed because OAuth expired and refresh failed. No acknowledgment is claimed. Cello
    was asked to sign in; the process report remains pending until Claude actually receives and
    acknowledges the storyboard.

`[next: retry Claude after sign-in, then the requested storyboard → build process report]`

## 5. Numbers

| | Before (2026-10-12) | After |
|---|---|---|
| Font actually rendered | Courier / Menlo (fallback) | `[pending]` |
| Distinct font sizes | 49 | `[pending]` |
| Distinct spacing values | 55 | `[pending]` |
| Spacing through a token | 22 of 714 (3%) | `[pending]` |
| Case-study/blog duplicated selectors | 26 | `[pending]` |
| Pages built | 14 | `[pending]` |
| Lighthouse perf / a11y (mobile) | `[measure live site]` | prototype: a11y 100, LCP 1.51 s, CLS 0 (Fast 4G, 4× CPU) |
| JS before first paint (home) | `[measure live site]` | prototype: 2.0 KB gz; three.js 143 KB gz after paint |
| Draw calls for the 3D layer | n/a | prototype (Tokens): 1 |

## 6. Stack

Today: Astro 5, Svelte 5 (runes), MDX content collections, `@fontsource/geist-mono`,
`qrcode`, Netlify (deploys from `master`), and JSON Resume `cv.json` driving `/resume`, `/cv.json`
and the resume PDF (`scripts/generate-resume-pdf.mjs`). Rewrite stack: `[pending]`.

## 7. Video beat list

`[pending: cold open candidate: side-by-side of the same heading in Courier vs Geist Mono]`
