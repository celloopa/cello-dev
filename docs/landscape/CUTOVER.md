# Landscape cutover: readiness, test plan, results (2026-10-13)

> Latest: Cello returned to the existing landscape and removed the separate viewing mode. See [POLISH.md](POLISH.md) for the new candidate and checks; the chapters hold below is historical. Production still awaits release approval.


Kept by the "Cut over cello.dev" session. It takes `claude/landscape-build` from close to live on
cello.design. It doesn't build features; fixes go to "Rewrite cello.dev". The pushes belong to
"Ship cello.dev" (`docs/ship/PROFILE.md` on `claude/ship-conductor`), and only after Cello's go
in chat.

## Status (2026-10-13, 09:30): cutover on hold for the chapters direction

- Cello held the cutover (grill Q39) to rework the experience as "the scene owns the thresholds,
  the work owns the middle". The decisions are Q23–Q47 in `docs/rewrite/GRILL.md` (rewrite branch):
  - home becomes arrival → four full-screen project chapters with a scrub rail → Let's Talk;
  - case studies open through a view-transition doorway, read calm, and end with the next chapter rising;
  - a new **/about** page (one URL added to the contract, none removed);
  - /projects and /blog become calm indexes;
  - /card becomes the event pitch page (pitch screen, then mini chapters);
  - "Take in the view" goes.

  A storyboard comes first (a private Artifact from Rewrite), then the build, then this test plan again on that build.
- Pin `250cd03` (tree `5212c4e`) is **withdrawn** as a cutover candidate. It was verified: the build with every guard, the Netlify
  preview's URL contract, privacy, theme across navigation, ui:shots, motion, keyboard/contrast (results below).
- "Ship cello.dev" archived while the cutover is held. At hand-off time, Cello starts a new session
  named "Ship cello.dev", whose prompt is: read the `ship-conductor` skill plus `docs/ship/{PROFILE,board,handoff}.md` on
  `origin/claude/ship-conductor` (`5940ad6` at the time of writing). The hand-off it expects has:
  - the squashed sha on live master;
  - the URL fates with `/about` added;
  - the checks run;
  - Cello's go, quoted.
- The privacy grep reads its patterns from the local file named in `PROFILE.md` (outside the repo),
  plus a real-valued `fileKey`. Clean on `250cd03`, the demo, landscape-build and master `060ad5b`.
- The demo branch (PR #14) was purged to one commit (`d94e121`, the pin's tree on `060ad5b`), so
  O9's "history left as is" is superseded.

## 1. Readiness inventory

### Branches

| | Sha | State |
|---|---|---|
| Live (`origin/master`) | `b92f443` | Design-system stages 0–8; D3 demo-persona images and post copy (`5012c12..b92f443`) |
| `claude/landscape-build` | `063cf27` (moving) | Contains master `b92f443` (merged at `e257e59`) |
| Stage 9 (`claude/design-system-migration`) | `060ad5b` (one commit on `b92f443`) | **Not in the landscape yet.** Figma ledger + drift check, docs, changelog. Rebuilt so no Figma team name, URL or file key enters the repo; the old shas `8b38072`/`79aaa7a` are gone and must never be merged |
| Demo (PR #14, `claude/landscape-demo`) | `af31f8b` | Snapshot of landscape @ `dcbed21` + `1881484`. Behind the tip by the background-follows-focus work (`5b49ce0..700ff11`) and master `b92f443` |

### Every live URL and its fate at cutover

The contract: 16 URLs at 200 and 2 redirects at 301 (`PROFILE.md` smoke checks).

| URL | Today | After cutover |
|---|---|---|
| `/` | Home | Home in the landscape (Mirror Lake). The sections bring their own places while in view (How: Meadows Lift, About: Bald Mountain, Contact: Ramona) |
| `/projects/` | Card grid | Scene selector over Mirror Lake. Hovering a story brings its place in behind |
| `/projects/asheville-dispensary/` | Case study | Reading page over Over Hood |
| `/projects/daybreak/` | Case study | Reading page over Meadows |
| `/projects/ghosted/` | Case study | Reading page over Ecola. Images replaced with the demo persona (D3) |
| `/projects/vegavengers/` | Case study | Reading page over Sauvie |
| `/blog/` | Index | Index over Mirror Lake |
| `/blog/designing-for-the-second-user/` | Post | Reading page over its rotating scene |
| `/blog/programmatic-resumes-you-can-chat-with/` | Post | Reading page; `v3/archetype.webp` (a real resume) removed |
| `/card/` | Contact card | New /card: scene panels, QR, save contact, share |
| `/resume/` | Resume | Same page. One token swap (`max-width: var(--layout-container)`); ui:shots 0 px |
| `/design-system/` | DS page | Same page (stage 7, read from `tokens.json`) |
| `/watchlist/` | Movies | Same page (`Layout`) |
| `/cv.json` | JSON Resume | **Byte-identical** to live |
| `/files/marcelo_rondon-resume.pdf` | PDF | **Byte-identical** to live |
| `/contact.vcf` | vCard | Identical except `REV:` (the build time, every deploy) |
| `/projects/ad-asset-directory` | 301 → `/projects/asheville-dispensary` | Same (`public/_redirects` unchanged) |
| `/projects/ascendant-traders` | 301 → `/projects` | Same |
| Expected 404s (8, `PROFILE.md`) | 404 | 404 (the new 404 page, over Mirror Lake) |

Risky areas from the profile, landscape vs master: `public/_redirects`, `cv.json`,
`src/pages/cv.json.ts`, `public/files/**` and `src/content.config.ts` are **unchanged**.
`astro.config.mjs` adds only `vite.build.chunkSizeWarningLimit: 600` (the three.js chunk).
Global styles, tokens and fonts change on purpose (A3, self-hosted National Park + Switchback).

Public assets: 100 added (ten scenes, /card images, Switchback), 14 Ghosted images/clips
replaced (D3), 1 deleted (`v3/archetype.webp`). Nothing else is removed, so no outside link
to an asset breaks.

### How the cutover reaches master: one squashed commit

Cello's rule: no Figma team name, Figma URL or file key in the public repo, history included.
landscape-build's older commits carry the scene cutting-table file key and node IDs (stripped
from the tip at `063cf27`), so its history is never pushed. The cutover is **one commit whose
parent is live `master` and whose tree is the pinned landscape tree** (`git commit-tree
<pin>^{tree} -p origin/master`), the way `claude/landscape-demo` snapshots it. Master keeps its
own history ("files only, keep history"). The conductor greps that one commit before pushing.

The demo (PR #14) is refreshed by the Rewrite thread to exactly the pinned tree, so the preview
Cello reviews is byte-for-byte the tree that ships.

### Open items and merges before the pin

| # | Item | Owner | State |
|---|---|---|---|
| O1 | Home's background follows the focused project or section (Cello's ask) | Rewrite | In flight (`5b49ce0..700ff11` so far); Rewrite sends the pin sha once verified |
| O2 | Merge stage 9 (`060ad5b`) into landscape-build. Not shipped on its own yet (Part 10 on the board). If the pin comes first, it ships without stage 9 and stage 9 follows | Rewrite | Open |
| O3 | Figma re-sync after O2: `node scripts/figma-sync.mjs --emit` → `use_figma` on the library file (key from `CELLO_FIGMA_FILE_KEY` or the git-ignored `.figma.local.json`, never in the repo) → `--record`. The build fails until it's done | Migration (DS owner): commits `figma-synced.json` (+ ledger counts) on `claude/figma-resync-<sha>` off the merge, for Rewrite to merge | Open |
| O4 | §8 class-name guard: deferred to after cutover (CHECKS "Later") | Cello confirms | Ask |
| O5 | ⌘K menu Tab/focus-return fix: deferred to after cutover (CHECKS "Later") | Cello confirms | Ask |
| O6 | 41 unlinked files in `public/`, all already unlinked on live (none added by the landscape apart from the scene manifests and a font licence). Housekeeping only: OCR finds no real name, email or handle in any of the 30 images; the avatar is an illustration; the Ghosted web shots use a demo persona (Sam Rivera) | Cello decides: keep for now, or remove in their own ship after cutover | Ask |
| O7 | Post copy that no longer matched the D3 images | Cello | **Done** on master (`b92f443`, his approved lines), merged into landscape at `e257e59` |
| O8 | SEO already wrong on live, not regressions: `/resume`, `/design-system`, `/watchlist` set their canonical to home; canonicals have no trailing slash (each 301s); no sitemap or robots.txt | Rewrite (small) or after | Ask |
| O9 | The public demo branch (`claude/landscape-demo`, PR #14): its tip (`c19a7f6`) no longer carries the scene cutting-table Figma IDs, but its 12 earlier commits do. Deleting the branch wouldn't remove them, because GitHub keeps them reachable through `refs/pull/14/head` | Cello | **Decided: leave the history as is** (his call to the rewrite thread; "your call" here, same answer). The cutover commit to master is squashed, so the IDs never reach master |

## 2. Test plan

Run on the pinned tree (a clean `CI=true pnpm install --frozen-lockfile` + `pnpm build`), served
the way Netlify serves it where it matters (the deploy preview), or by `astro preview` / the
scripts' static server. Each line: what passes, then the result. Scratch shots stay outside the
repo; only the summary and a few shots land here.

| # | Check | Passes when | Result |
|---|---|---|---|
| T1 | `pnpm build` with every guard | tokens up to date, family 0.1.0 match, Figma ledger hash current, `astro check` 0/0/0, build 0 warnings, 14 pages | |
| T2 | URL contract | 16 × 200, 2 × 301 to the right targets, 8 expected 404s; `/cv.json` + PDF byte-identical to live; `.vcf` served as `text/vcard` | |
| T3 | `ui:shots`, all 13 pages (the script's 12 + `/watchlist/`) × Day/Dusk × 1440/390 | Every changed screen is expected: the landscape pages change; `/resume`, `/design-system`, `/watchlist` are 0 px vs live | |
| T4 | `pnpm motion:table`, normal and reduced | Reduced: no animation or transition longer than the reduced-motion contract, no delays (stills, no waits) | |
| T5 | Keyboard and focus | Every interactive element reachable in order and shows the ring + halo; Admire returns focus; Esc closes; `aria-current` = `page` on the exact page, `true` on the parent | |
| T6 | Text-over-art contrast (A3) | Each text line ≥ 4.5:1 (≥ 3:1 large) vs the 99th-percentile brightest pixel under it; every scene page, Day/Dusk, 1440/390, WebGL and still | |
| T7 | Performance and fallbacks | Slow 4G mobile LCP ≤ 2.0 s and CLS ≤ 0.05 on home, /card, Ghosted; `?gl=0`, a blocked texture and a tab hidden from load all show the still with a clean console | |
| T8 | Browsers | Chrome, desktop Safari and Firefox (desktop); iPhone Safari (Simulator here; Cello's phone on the preview) render, scroll, theme-toggle and play video without console errors | |
| T9 | View transitions and theme | Theme persists across client navigation (`Layout` ↔ `SceneLayout`, back/forward, reload); no flash of the wrong theme; `ClientRouter` pages swap `main` cleanly | |
| T10 | SEO | Every page: title, description, canonical, OG title/description/image (image resolves, 200); one `h1`; `lang="en"`; no regression vs live | |
| T11 | Privacy | No private links or local paths in the cutover commit; no Figma team name, Figma URL, `fileKey` or either Figma file key in it (the threads' grep, kept outside the repo, returns nothing); no file removed in `f06cec5` or `1881484` comes back; the swapped `ghosted/v3` images are the live blobs; no people in scene art (D2); product artifacts show demo personas only (D3, OCR + eye); no new unlinked files | |
| T12 | Deploy preview of the exact cutover tree | The preview's sha = the pin; T2 and a spot check of T3 pass against the preview URL | |

## 3. Results

Pre-pin run on the moving tip (`1153fe9`..`063cf27`); everything re-runs on the pin.

- **T1** at `1153fe9`: green. Tokens up to date, family 0.1.0 match, `astro check` 0/0/0 (108 files), 14 pages, no build warnings. Figma guard not on the branch yet (O2).
- **T2** (Netlify-shaped local server): 16 × 200; `/projects/ad-asset-directory` → 301 `/projects/asheville-dispensary`, `/projects/ascendant-traders` → 301 `/projects`; the 8 expected 404s are 404. `/cv.json` and the PDF byte-identical to live; `.vcf` differs only in `REV:`.
- **T3** vs live built locally (two runs): 52 of 56 screens changed, all expected. `/watchlist` 0 px (4). `/resume` changes only the hero's icon links and theme button growing 36 → 44 px, as named in CHECKS S6 (390 page 8 px taller). `/design-system` is taller because it now lists the A3 tokens. Every landscape page changes by design.
- **T10**: no regression. Fixed by the landscape: canonical/`og:url` on `/blog`, `/projects` and both posts (live points them at home). Pre-existing, still open (O8). Every page has one `h1` and `lang="en"`.
- **T11** at `063cf27`: the Figma grep is empty; none of the 7 files removed in `f06cec5`/`1881484` is back; `ghosted/v3` = live blobs plus the three Loop files (`ghosted-loop.{webm,mp4}`, poster). D3 on the Loop: every second of both encodes OCR'd (upscaled): "Rowan" 34 times, real-identity strings 0; checked by eye on a contact sheet (Rowan Ellis, example.com, fictional employers). Public assets: nothing added that's unlinked except the scene manifests and Switchback's OFL.
- **T4** at `1153fe9`, 14 pages: reduced motion leaves no motion and no waits. All 1,402 animation/transition rows run at 0.00001 s with 0 s delay. Normal motion: 268 rows (table in scratch; diffed again on the pin).
- **T8**: desktop Safari can't be automated here (Safari's "Allow remote automation" is off; not changed). Firefox isn't installed. Both go to Cello's own check on the preview unless he enables them.

## 4. Go/no-go

Not reached: Cello held the cutover before the go/no-go (see Status).

Results on `250cd03` (= `d6eb7a3`'s site output) that carry over as a baseline:
- **Keyboard and focus:** passes in 112 runs. ⌘K focus-return remains deferred, and the case-study TOC chips still clip the ring on phones.
- **Focus-ring contrast:** passes; lowest 4.39 across 2,320 stops.
- **Text over art, settled states:** passes.
- **Text over art, newly measured between arrival and the reading line:** **fails**, Day art only, on home and /card. The hero copy and the green section title over the bright peak and flowers reach 2.03 at the lowest (3 needed). This predates `dcbed21`; the chapters direction removes that scroll range, so re-measure it there.
- **iPhone (Simulator):** 9 of 11 pages pass. The 19 WebM-only, poster-less videos show as empty boxes (same on live; Cello checks on his phone). /design-system pans 5 pt (same on live). There's a sticky green tap state on the theme toggle and Pause/Play, and the Menu dot sits against the edge on reading pages.

## 5. Rollback

1. Instant: Netlify UI → Deploys → the last `master` deploy before the cutover → "Publish deploy"
   (Cello's account). Then re-run the smoke checks.
2. Durable: `git revert <cutover sha>` (a single commit, not a merge) on a branch, Cello's go, the conductor pushes
   to `master`, Netlify redeploys, smoke checks again.

## 6. Hand-off to Ship cello.dev

(end sha, what changes, checks run, Cello's go quoted, what to watch after deploy)
