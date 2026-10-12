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

`[more beats: Cello's pick, the build]`

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
