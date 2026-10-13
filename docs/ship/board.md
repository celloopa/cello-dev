# Ship board: cello.dev

Kept by the "Ship cello.dev" session (`ship-conductor` skill). Profile: `docs/ship/PROFILE.md`.

**2026-10-12 handover (Cello's choice in chat):** the newer "Ship cello.dev" session keeps
cello.dev; the first conductor is now "Ship Daybreak" (`docs/ship/handoff.md`). Board refreshed by
the new conductor the same day.

## Live

| Sha | Date | Parts | Verified |
|---|---|---|---|
| `060ad5b` | 2026-10-13 | **Part 10:** stage 9, Figma follows code (a "cello.dev Design System" Figma library generated from `tokens.json` by `scripts/figma-sync.mjs`; `tokens --check` fails while Figma is behind the synced groups). Rebuilt as one fresh commit on `b92f443` after Cello's "Strip name and URL": no Figma team name, URL or key anywhere (key from env `CELLO_FIGMA_FILE_KEY` or git-ignored `.figma.local.json`); the first build (`8b38072`/`79aaa7a`) was never pushed and no branch holds it. Cello: "yes go ahead, [the team] is fine" (migration session, for building it), "Strip name and URL", then "Ship it" (here) | Pushed 03:25 PDT. Review: 0/0/0, guard "Figma is in sync"; ui:shots 0 px on 48/48; private grep and commit message clean; specimen shot shows canvas only; conductor tested drift (one-word stroke description edit → exit 1 with re-sync steps; restored → 0). On live: smoke 16 × 200, 2 × 301, cv.json, PDF; home assets = reviewed build. Byte-identical output, so the next visible deploy confirms Netlify ran the guard |
| `b92f443` | 2026-10-13 | **Ghosted demo-persona swap, ahead of cutover** (Cello first chose "Fix at cutover", then, asked again after the rewrite thread relayed "have that thread do it", chose "Yes, swap now" and "Ship it"). Conductor-assembled from `claude/landscape-build`: `594aced` (= `3305ef2`, swipe-keep clips), `0571f5a` (= `cfdb27d`, archetype shot dropped), `5012c12` (= `2c2c1be` minus the landscape-only `docs/landscape/CHECKS.md`), `de34910` (= `c8096ac`), `b92f443` (the post file from `63f3b23`: Cello's three approved sentences). 15 images/clips + alt/captions in the post and the Ghosted case study | Live by 03:07 PDT (the first push dropped; retry went through). Before: build 0/0/0; every replaced image and the swipe clip checked by eye (Rowan Ellis, fictional companies, example.com, 555 numbers only); post og:image = new highlights, case-study og = new og.png; no "my own resume" claim left. On live: all 14 swapped files byte-identical to the reviewed build, archetype 404, post text updated; smoke 16 × 200, 2 × 301 |
| `1881484` | 2026-10-13 | **Cleanup 2:** removed four unlinked files found by the public/ privacy audit (session "Audit cello.dev public/ for unlinked personal files"): `ghosted/preview.webm` and `ghosted/web/tui-list.png` (real applications with statuses), `ghosted/web/stats.png` (response rates by source), `centerforpeacebuilding-home.json` (a client's Lighthouse report). Conductor-authored delete-only commit off `191f068`. Cello: "Remove all 4 now". They stay in git history | Live by 02:50 PDT. Before: no references (`git grep`), build 0/0/0, 14 pages. On live: all four 404; smoke 16 × 200, 2 × 301. This deploy's build ran the stage 8 family guard on Netlify, so it confirms the guard passes there (closes Part 9's caveat) |
| `191f068` | 2026-10-12 | **Part 9:** stage 8, the Cello family layer (`b1097b4`: `src/tokens/family.json` v0.1.0 vendored; `tokens --check` fails on drift of ink, paper, house curve, Geist Mono/Geist, or the reduced-motion delay rule; warns only if a newer local family exists) + CHANGELOG, merged with live `f06cec5` (`191f068`). Cello: "Ship it" | Pushed 2026-10-12 ~20:50 PDT. Review: 0/0/0, guard prints "match Cello family 0.1.0"; ui:shots 0 px on 48/48 vs `f06cec5`; conductor tested drift: `--paper-100` `#f3ede3` → exit 1 with the drift message, restored → exit 0; merge adds only the three video deletions over `b1097b4`. On live: smoke 16 × 200, 2 × 301, cv.json, PDF, videos still 404, home assets = reviewed build. **Caveat:** the built site is byte-identical to `f06cec5`, and Netlify posts no status for `master`, so live can't prove the Netlify build itself passed; Netlify's deploy log (Cello's account) is the only confirmation. Closed by `1881484`'s deploy |
| `f06cec5` | 2026-10-12 | **Cleanup:** removed three unlinked Ghosted videos (`ghosted-intro/end/agent.webm`) that showed a local username and a real list of companies with application statuses; flagged by the rewrite thread. Conductor-authored delete-only commit off `9ea55ab`. Cello: "Remove now, own ship" (in this session). They stay in git history. No CHANGELOG line yet (rides with the next part) | Live by 20:35 PDT. Before: `git grep` found no references; build 0/0/0, 14 pages, nothing in `dist` points at them. On live: all three 404; smoke 16 × 200, 2 × 301 |
| `9ea55ab` | 2026-10-12 | **Part 8:** stage 7, `/design-system` read from `tokens.json` (`d75914d`) + DESIGN.md/brand kit as shipped + CHANGELOG (`9ea55ab`) + `36c89bd` (docs: stages 5–6 move into the landscape build). Unused coral tokens and `--accent-warning` removed (zero uses). Fast-forward from `185c2b1`. Cello: "Looks good, ship it" (after seeing the page in this session) | Live by 20:30 PDT. Review: 0/0/0 + guards (ratchet 199); ui:shots: only the 4 `/design-system` screens change (1440: 2907 → 8464 px), 44 at 0 px; page read in Dusk 1440 and Day 390 (role table wraps use-when under chips on phone; each theme's chip on its own canvas); private-mention grep empty. On live: smoke 16 × 200, 2 × 301, cv.json, PDF, expected 404s; page serves the new content |
| `185c2b1` | 2026-10-12 | **Part 7:** stage 4 values, 4e tints → roles (`7db05b4`), 4f tracking (`31ed65b`), 4g type roles (`2b829f4`), 4h leading (`3528137`), 4i spacing (`cc91c72`) + CHANGELOG (`185c2b1`). Fast-forward from `b267e9a`. Cello: 4e/4f "Sure" and 4g–4i "yes that's okay" (migration session, look); "Ship it" in this session | Live by 19:44 PDT. Review: 0/0/0 + guards (ratchet 359 → 201); no risky config touched; ui:shots 48/48 differ as expected; opened resume 390 (name bigger, two lines), Ghosted 1440/390 (CaseMeta text and h2 on the scale), card 390, home 390, blog 1440: nothing unexplained; ⌘K overlay in Day checked by hand on the build (paper scrim). On live: smoke 16 × 200, 2 × 301, cv.json, PDF, expected 404s |
| `b267e9a` | 2026-10-12 | **Part 6:** stage 4 motion, 4a–4d (`80cfe9b`, `4968a3a`, `c977554`, `cc7b907`) + CHANGELOG for stages 3–4 (`b267e9a`). Not 4e/4f (visible, waiting on Cello's look). Fast-forward from `45fd8e9`; Cello: "Ship it" | Live by 18:00 PDT. Review: 0/0/0 + guards (ratchet 495 → 359); ui:shots **0 px on 48/48** vs `45fd8e9`. Motion table (`motion:table`, both builds): no animations or transitions added or removed; reduced motion: delayed entries 171 → 0, all durations 0.01 ms; entries 0.5–0.9 s → 0.6 s, hovers → 0.3 s, `ease` 72 → 1 (home's own hero, untouched as stated); keyframes renamed to `enter-*` with `--enter-distance` set per component (cards 40 px, /card 48 px, others 30 px: travel unchanged); 404 hero bar `wipeIn` → `enter-wipe` (the one stated change); 52 transitions now name properties. On live: smoke 16 × 200, 2 × 301, cv.json, PDF, expected 404s; live CSS carries the reduced-motion block with zeroed delays |
| `45fd8e9` | 2026-10-12 | **Part 5:** stage 3, Day (`01c79e4`, via `e1e313e` merged with live). Fast-forward from `9deb192`; shipped alone (site-wide theme JS). Cello: "ship part 5 when it checks out". No CHANGELOG entry in this push (rides with the next part) | Live by 12:36 PDT. Review: 0/0/0 + guards; ui:shots vs `9deb192`: exactly the 24 light screens change, 24 dark 0 px, no height changes; theme code read (single module, delegated toggle, no other live setters). Hand test on the build (astro preview, system light): fresh visit Day; home → /projects → Ghosted by client-side swap stays Day; /resume full load follows system, saves nothing; first toggle click flips (home and /resume), labels "Switch to Dusk/Day"; saved Dusk survives client navigation. On live: smoke 16 × 200, 2 × 301, cv.json, PDF, expected 404s; canvas `#f3ede2`; light-system walk home → /projects → Ghosted stays Day by client swap, nothing saved |
| `9deb192` | 2026-10-12 | **Parts 3 + 4:** stage 2b National Park titles (`58b4c81`) + 2c Geist Sans for long reading (`8650b55`), via `d90ec66` (merged with live), + CHANGELOG entry for 0–2c. Fast-forward from `e10cc19`; Cello: "Ship it" (in this session, after seeing the /card desktop name wrap) | Live by 11:42 PDT. Smoke: 16 × 200, 2 × 301 right targets, cv.json label unchanged, PDF, expected 404s. Home preloads = the reviewed build. Chrome on live /projects/ghosted: h1/h2 National Park Variable, prose Geist Variable, inline code Geist Mono, all loaded as webfonts |
| `e10cc19` | 2026-10-12 | **Parts 1 + 2:** design-system stages 0–1b (`df9693e`, 0 px) + 2a Geist Mono (`42824f2`) + docs strip (`ea51148`, `e10cc19`). Fast-forward from `0d4ede0`; Cello: "Strip docs, then ship both", "Files only, keep history" | Live by 11:20 PDT. Smoke: 16 × 200, 2 × 301 to the right targets, cv.json label unchanged, PDF is a PDF, expected 404s still 404. Home serves the 400/700 preloads with the reviewed hashes; Chrome on live: body is "Geist Mono", 400/600/700/800/900 loaded as webfonts, no Courier |
| `0d4ede0` | 2026-10-11 | PR #13 (Nike/Podium draft, merged); everything before it | Smoke checks run 2026-10-12 by the conductor: 16 × 200, 2 × 301 to the right targets, cv.json label current, PDF is a PDF |

## Ready to review / waiting

Nothing handed off. Cello's call (migration session, recorded in `36c89bd`, docs only, rides with the next part): **stages 5–6 move into the landscape build; the migration branch does 7–9.** Stage 7 live at `9ea55ab`, stage 8 at `191f068`; next from the migration: stage 9 (Figma), waiting on Cello's triage links. He also chose that the rewrite thread merges stage 4 into `claude/landscape-build` from the migration's guide (10 files, 35 conflict hunks, all on pages the landscape rewrote); the migration thread reviews that merge before cutover reaches this board. Owed: a CHANGELOG entry for stage 3 (rides with the next part).

| Part | Thread | Commits | Checks | Cello's go | Waits on |
|---|---|---|---|---|---|

In flight, not handed off:

- **Ghosted Loop recording: folded into the landscape build (S2)**, no longer a separate part.
  Cello (2026-10-12, rewrite thread): "use your fixes and include the component upgrade, ship it
  with cutover". Contents: Loop video (webm/mp4/poster, demo persona only) in
  `public/images/projects/ghosted/v3/`, the "five → six chapters/panels" fixes in `ghosted.mdx`,
  and a MediaFull upgrade (poster, mp4 fallback, Pause/Play for WCAG 2.2.2, reduced motion → poster,
  alt). Review at cutover against D3.
- **Event landing page (`/card` remade): in the landscape build's S3, ships with cutover.** Cello,
  2026-10-12, in this session: "can you remake that conference card into a landing page for me to
  have for people i meet at events where i can like my stuff and big projects. flashy and give them
  a chance to learn more about me". Asked who builds it, he chose "Landscape build" (over a new
  thread before cutover, or a separate URL). Brief sent to Rewrite cello.dev: keep `/card`;
  phone-first; Save contact + Share stay first; big projects with visuals linking to the case
  studies; about + stay in touch; landscape motion with reduced-motion parity; fast on venue Wi-Fi;
  tokens only; D2/D3; built on stage 3's ThemeInit. Review at cutover: phone + desktop, both themes.
- **Landscape build (the rewrite becomes a build)**: `claude/landscape-build`, cut from the
  migration branch at `42824f2`. Plan: `docs/landscape/PLAN.md` @ `59629e9`, stages S0–S4. Cello,
  GRILL Q22 @ `f0ff8c0`: "rewrite only for now, keep site for now but allow me to see a demo of
  the new so we can start ironing it out and cutover this week". Today's site stays live until
  cutover; **cutover goes through this board** with his "ship it". Preview route: a **draft PR**
  against `master` (PR deploy previews work, `deploy-preview-<N>--marcelorondon.netlify.app`;
  branch deploys look off). Never merged by anyone but this conductor. **Cello approved the draft PR
  (2026-10-12, rewrite thread): "Yes, open it when ready"**, titled "DRAFT: landscape demo, do not
  merge", opened after S0+S1 pass; the thread sends the PR number and preview URL. The build branch
  merges `master` once Parts 1+2 ship (that brings the docs strip in).
  **Opened 2026-10-12: [PR #14](https://github.com/celloopa/cello-dev/pull/14)** (draft), head
  `claude/landscape-demo`, not `landscape-build`: squashed snapshots on `origin/master` so the
  unpushed migration history doesn't reach GitHub through the demo; tree = `landscape-build` @
  `33efe88` (carries the thread's own strip). Preview `deploy-preview-14--marcelorondon.netlify.app`
  (up; 301s verified by the conductor 2026-10-12). Thread's checks on `33efe88`: guards + astro check/build green, 16/16 200,
  expected 404s, contrast 0 failures, LCP 0.30 s, CLS 0. Cutover merge plan: the conductor's, with Cello's go.
  2026-10-12, preview refreshed (demo `b9a5c1d` = `landscape-build` @ `2c2c1be` on `185c2b1`): /card
  event landing page (slow-4G phone LCP 1.54 s), /projects scene selector, /blog with scenes, 404 in
  the landscape, pre-blurred stills on reading pages (Ghosted slow-4G LCP 8.5 → 2.1 s), stage 4 merged
  (`8c30bff`), D3 checked by OCR of 43 images and video frames. `/contact.vcf` on the preview serves
  `text/vcard` (checked by the conductor; same as live). Cutover must not bring back the three
  removed videos. Demo branch now `162f316` (delete-only, second parent `f06cec5`); conductor checked the
  preview at 21:01 PDT: all three videos 404, /card 200.
  2026-10-12: S2 (case studies + posts) on the preview (demo @ `c0b188f`); Cello: "the new landscape
  demo looks great". S3 running on `claude/landscape-build`: /card event page first, then indexes,
  slow-network fix, D3 Ghosted image swap (approved). The rewrite session hit its usage limit; its S3
  agent commits locally, and the preview refreshes when the session resumes.

## Threads

| Session | Owns | Branch | State |
|---|---|---|---|
| Continue the cello.dev design-system migration | Stages 2a onward; DS-HANDOFF proposals into the system | `claude/design-system-migration` | Building 2b. Handed off Parts 1–2 (via Cello's prompt to this conductor) |
| Audit and unify the cello.dev design system | Stages 0–1b (done) | `claude/design-system-migration` | Idle; its work is Part 1 |
| Rewrite cello.dev | Landscape build (S0–S4) + Ghosted Loop video part | `claude/landscape-build`; `claude/rewrite-exploration` | Building; cutover target this week |
| Ship Daybreak Next (`local_4483d163…`, formerly "Rethink Daybreak from the ground up") | Daybreak's ship board and builder (Cello merged them, 2026-10-12) | (daybreak repo) | Family-root changes go both ways, one line each, **to this session**. The first conductor is now "Ship Daybreak (old)"; don't send it notes |

## Decisions that affect several threads

- 2026-10-12, Cello (via identity I1, recorded in `docs/design-system/identity.md` on the
  migration branch): the mark (C + green sun + Mt Hood) belongs to cello.dev; Daybreak finds its
  own motif. Daybreak was told by the migration thread.
- 2026-10-12, Cello (I1–I6, amendment A1): the rewrite inherits Day/Dusk, the seasonal inks,
  National Park + Switchback + Geist Mono and the window frame from the migration's identity
  rather than defining its own. Rewrite thread already builds on it.
- 2026-10-12, Cello (Daybreak grill-log 27–28, daybreak branch `claude/modest-maxwell-bc1f74`;
  reported by the Daybreak thread): Daybreak's mark is now "Rail and block" (time rail, sun as
  the now node, beside the current block; no mountain, no C, no landscape). I1 is honored.
- 2026-10-12, Cello (same source): Daybreak's `design/tokens.json` carries `family.identifiers`
  (family 0.2.0-draft): house curve, reduced-motion contract, Geist + Geist Mono for data,
  Midnight Ink `#001A11` as text on paper, Paper `#F3EDE2`, the voice (correction from the
  Daybreak thread: primary action color is *not* in the identifiers; it's product-level in
  Daybreak too).
  Daybreak keeps its own paper/ink names, no Day/Dusk. **Rule:** if cello.dev changes any of
  those root values, the conductor sends Daybreak one line to re-sync. Migration thread told.
- 2026-10-12, migration thread's family-root deltas (cello.dev vs Daybreak's 0.2.0-draft),
  relayed to Daybreak: text on paper **same** (Midnight Ink `#001a11`); house curve **same**;
  Paper `#f3ede2` **same value**, but on cello.dev only from stage 3 (live Day canvas is
  `#e0e0e0` today); primary action **differs** (cello.dev Day action is green signal-700
  `#007a33`, Cello's Q4), which is fine, because action is product-level in both; type **differs** (cello.dev uses Geist Mono only, no Geist Sans;
  National Park/Switchback are product-level); reduced-motion contract text **same**, but
  cello.dev's code only meets it from stage 4 (delays not zeroed today). Only Geist Sans is a
  real difference (open call below).
- 2026-10-12, Cello: "yes", Geist Sans **is** a family root. Daybreak keeps 0.2.0-draft as is;
  cello.dev adds Geist Sans (where it's used is new scope, so the migration thread proposes it
  as an amendment, outside 0–1b and 2a). Both threads told.
- 2026-10-12, Cello: "yes" to archiving "Rewrite cello.dev (old, handed off)". Archived (its
  worktree was clean and its HEAD was on daybreak `main`).
- 2026-10-12, Cello (GRILL Q21, `1dddfda` on `claude/rewrite-exploration`; he answered "Yes,
  revise it" to "The storyboard puts text straight on the scene and drops the window frame. That
  revises identity I2 and I5 and the bg-plate rule in the design-system migration. Is that your
  direction now?"). **For the rewrite's landscape direction:** text may sit over scene art with
  the approved focus dim, and the window frame is no longer the hero's framing. I2, I5 and
  `bg-plate` are revised accordingly. **Still open:** whether today's site changes too under I6
  (window frame replacing the offset frame, `bg-plate`). Relayed to the migration thread with
  that caveat.
- 2026-10-12, Cello, via the rewrite thread's `docs/rewrite/DS-HANDOFF.md` (`7a96777` on
  `claude/rewrite-exploration`; his ask: "ensure the new changes to our brand and design system
  are being logged and taken into components"). The audit thread has the doc. Decided, with
  sources in GRILL Q18–Q21:
  - D1: text over art in the rewrite (= the I2/I5 entry above; today's-site scope still open).
  - D2: no people in scene art (all ten scenes cleaned).
  - D3: case-study product artifacts use Ghosted demo personas only, never real resumes or
    tester data. **Applies to every content part I review.**
  - D4: reading dims the scene to the approved level, with no location or sound labels.
  - D5: dark top bar kept; work nav separate from utilities.
  - D6: sound later, opt-in, silent by default.
  Proposed, pending Cello as an amendment: Scene component, Signature motion tier, focus-recipe
  tokens, copy scrim + 4.5:1 contrast rule over art (conflicts with I3's art contrast exemption),
  contextual top bar, place label + Admire, scene selector. Gaps the migration closes: self-host
  National Park + Switchback (I4); Geist Sans for long reading (A2).
- 2026-10-12, Cello: Geist Sans goes to long reading only (case-study and blog body), recorded
  as migration amendment A2, a visible stage after 2b (reported by the audit thread).
- 2026-10-12, Cello (GRILL Q22): **D1 is rewrite only.** Today's site keeps I2/I5/`bg-plate`
  until cutover. The landscape is the build, made on the design system; the migration thread
  ("Continue the cello.dev design-system migration") owns how DS-HANDOFF proposals enter the
  system.
- 2026-10-12: ship order: migration stages reach `master` first; the rewrite's build plan
  follows only after the migration ships (rewrite handoff, "Next, ranked").

## Privacy audit decisions (Cello, 2026-10-13)

- Unlinked files with personal data: removed (`f06cec5`, `1881484`).
- Live post `/blog/programmatic-resumes-you-can-chat-with/` shows his real saved jobs (Ramp, Linear, Vercel, a salary range, AI gap notes) in `ghosted/v3/{highlights (og:image), category, intake, history, tailored, edit-style, report}.webp`: **"Fix at cutover"**. The landscape build's approved demo-persona swap should replace them; the conductor checks every one of those images, and the og:image, before cutover ships. **Rewrite thread confirmed (2026-10-13), yes for every file**, same paths, demo persona Rowan Ellis only: highlights (og:image), history, tailored, edit-style, report @ `2c2c1be`; category, intake @ `c8096ac`; also interview, phones, style-looks, proposal, case-study og.png (`2c2c1be`); archetype.webp removed (`cfdb27d`); swipe-keep clips replaced (`3305ef2`); alt/captions and Cello's three post sentences updated (`2c2c1be`, `c8096ac`). Its OCR of 43 images + video frames found no real name, handle or city. **Shipped early at `b92f443`** (see Live); the cutover just has to keep these files.
- Asheville videos showing the employer's Google Drive (`ad-assets/nightshade.webm` folder URL around 3–5 s; `ad-portal.webm` folder list in the last second): **"Leave them"**.
- **History purge (Cello, 2026-10-13: "yes purge the demo branch history").** `claude/landscape-demo` was squashed to one commit, `d94e121`: the identical tree on `060ad5b`, replacing 14 commits, 3 of which carried the window-scenes Figma file key. This board branch was squashed too, because its decision notes had named the Figma team; the private patterns now live in a local file outside the repo (PROFILE). Old commits may still open by direct sha on GitHub, and in PR #14's force-push timeline, until GitHub garbage-collects them; a full purge needs GitHub Support. Old Netlify deploy-preview permalinks also still serve the old scene manifests; deleting those deploys happens in Netlify's UI. Both are Cello's call.
- 36 other unlinked files (logos, concept boards, old ghosted/web shots): nothing private; housekeeping only, no action.

## Cutover

- 2026-10-13: Cello asked for a new thread, **"Cut over cello.dev"** (`local_b81c77c7…`), which takes the landscape build to a pinned cutover sha: readiness inventory, `docs/landscape/CUTOVER.md` test plan run, a deploy preview of the exact tree, go/no-go with Cello, then a hand-off here. It never pushes `master`. Also new: "Imagine cello.dev's future" (exploration only, ships nothing).
- Cutover will be **one squashed commit** (parent = live master, tree = the verified landscape tree), so `claude/landscape-build`'s history (which once held the window-scenes Figma key, stripped at `063cf27`) never reaches `master`. Rollback: `git revert <sha>` or Netlify "Publish deploy". Plan: `docs/landscape/CUTOVER.md` on `claude/landscape-cutover`. The conductor greps every commit it pushes for Figma keys/team and the removed files.
- **2026-10-13, Cello (grill Q39, cutover thread): cutover HELD.** Today's site stays live until the landscape's new "chapters" direction is built, passes `docs/landscape/CUTOVER.md`, and he has walked its preview on his phone. Pin `250cd03` is **withdrawn**. Direction: home = arrival → full-screen project chapters with a scrub rail → Let's Talk; case studies open through a view-transition doorway; new `/about` (adds a URL, removes none: add it to the 200 list at cutover); `/projects` becomes a calm index. Storyboard first, then the build (Rewrite owns it). Cut over hands off after that, likely several days out. Before cutover ships, the persona-runs check applies to the visible flows.
- 2026-10-13: cutover pin `250cd03` verified by the cutover thread (all guards, URL contract on its Netlify preview, privacy, theme) but **on hold**: Cello asked to replace "Take in the view" with idle motion, added to the design system. Order: build agent → Rewrite merges → migration reviews + Figma re-sync → cutover re-pins and re-runs checks → hand-off here.
- Before the cutover pin: the migration thread re-syncs Figma from landscape-build's tokens (after it merges `060ad5b`) and hands Rewrite a short branch with `src/tokens/figma-synced.json`; Cut over waits on it. After cutover: Figma components (Button, IconButton, ArrowLink, Tag, Card, Panel, Eyebrow, Section) as a small Part 11. The migration session is **not** done; don't offer it for archive yet.
- Open with Cello (via the rewrite thread): whether to purge the PR #14 demo branch's older commits, which still carry that Figma key (current demo tree is clean, `c19a7f6`).

## Open calls for Cello

- (none)

Answered 2026-10-12, in this session: **"Strip docs, then ship both"** (his "ship it" for Parts 1+2,
conditional on the strip) and **"Files only, keep history"** (no rewrites; the old text stays in
git history, both links need his login). Route: the migration thread makes one docs-only commit on
`claude/ds-strip-public-docs` off `42824f2`, covering `audit.md:225` (Figma team + folder URL), `components.md:3` (local path; added after the rewrite thread flagged it) and `identity.md:5` (artifact link); check the private-patterns grep (PROFILE) is empty. The conductor checks it, then fast-forwards `master` to it,
and the thread merges it back afterward.

## After deploy, for Cello

- After `e10cc19`: fonts on live load as webfonts (verified 2026-10-12); Netlify's build now runs the token guards first. If a Netlify build ever fails at `tokens --check`, the token CSS is stale or a raw value was added.
