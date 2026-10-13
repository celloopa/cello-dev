# Landscape cutover: readiness, test plan, results (2026-10-13)

Kept by the "Cut over cello.dev" session. It takes `claude/landscape-build` from close to live on
cello.design. It doesn't build features; fixes go to "Rewrite cello.dev". The pushes belong to
"Ship cello.dev" (`docs/ship/PROFILE.md` on `claude/ship-conductor`), and only after Cello's go
in chat.

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

### What merging publishes (the repo is public)

The cutover merge publishes landscape-build's history, not just its tip. Every image or video
blob in that history is either in the final tree or already on `origin`. Of the 139 text
versions found only in history, none has a private link, a local path, a key or a phone number.
The tip has none either. Mentions of testers are case-study copy that's already live.

### Open items and merges before the pin

| # | Item | Owner | State |
|---|---|---|---|
| O1 | Home's background follows the focused project or section (Cello's ask) | Rewrite | In flight (`5b49ce0..700ff11` so far) |
| O2 | Merge stage 9 (`060ad5b`) into landscape-build | Rewrite | Open |
| O3 | Figma re-sync after O2: `node scripts/figma-sync.mjs --emit` → `use_figma` on the library file (key from `CELLO_FIGMA_FILE_KEY` or the git-ignored `.figma.local.json`, never in the repo) → `--record`. The build fails until it's done | Migration (DS owner) | Open |
| O4 | §8 class-name guard: deferred to after cutover (CHECKS "Later") | Cello confirms | Ask |
| O5 | ⌘K menu Tab/focus-return fix: deferred to after cutover (CHECKS "Later") | Cello confirms | Ask |
| O6 | 41 unlinked files in `public/`, all already unlinked on live (none added by the landscape apart from the scene manifests and a font licence) | Cello decides | Ask |
| O7 | Post copy that no longer matched the D3 images | Cello | **Done** on master (`b92f443`, his approved lines), merged into landscape at `e257e59` |
| O8 | SEO already wrong on live, not regressions: `/resume`, `/design-system`, `/watchlist` set their canonical to home; canonicals have no trailing slash (each 301s); no sitemap or robots.txt | Rewrite (small) or after | Ask |
| O9 | The public demo branch (`claude/landscape-demo`, PR #14) still carries the scene manifests with the Figma cutting-table file key and node IDs that `063cf27` removed from landscape-build. Refreshing the demo removes them from the tip only; they stay in its pushed history unless the branch is deleted | Cello decides | Ask |

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
| T11 | Privacy | No private links or local paths in the tree or the history being merged; no Figma team name, Figma URL or file key anywhere in the cutover tree (the migration thread's grep, run from the scratch tools, returns nothing); no people in scene art (D2); product artifacts show demo personas only (D3, OCR + eye); no new unlinked files | |
| T12 | Deploy preview of the exact cutover tree | The preview's sha = the pin; T2 and a spot check of T3 pass against the preview URL | |

## 3. Results

(filled in as the checks run)

## 4. Go/no-go

(the message to Cello, his answers quoted)

## 5. Rollback

1. Instant: Netlify UI → Deploys → the last `master` deploy before the cutover → "Publish deploy"
   (Cello's account). Then re-run the smoke checks.
2. Durable: `git revert -m 1 <cutover merge sha>` on a branch, Cello's go, the conductor pushes
   to `master`, Netlify redeploys, smoke checks again.

## 6. Hand-off to Ship cello.dev

(end sha, what changes, checks run, Cello's go quoted, what to watch after deploy)
