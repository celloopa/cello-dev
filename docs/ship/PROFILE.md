# Ship profile: cello.dev

Read by the "Ship cello.dev" session (`ship-conductor` skill). Repo facts only; no secrets (env
var names are fine). This repo is **public**: no personal details here or on the board.

Weight: **light**. Static Astro site on Netlify, no user data, no database. Rollback is a git
revert plus a redeploy.

| | |
|---|---|
| Live URL(s) | https://cello.design |
| Live branch (deploys on push) | `master` on `origin` (github.com/celloopa/cello-dev). `origin/main` is stale; never target it. |
| Integration branch (threads land here) | None standing. Each part arrives as a pushed `claude/*` branch; the conductor merges the reviewed, pinned sha into `master` (merge commit via PR, as PRs #5–#13 did). Several parts in one ship → a short-lived `claude/ship-<date>` branch off `master`, reviewed as one tree. |
| Deploy | Netlify, auto-deploys on push to `master`. Finished when https://cello.design serves the new build (check a changed page's content or a changed asset hash; no version endpoint yet). Typical: a few minutes. |
| Checks (must be green on the pinned sha) | `pnpm build` = `astro check && astro build` (0 errors, 0 warnings, 0 hints). After the design-system migration lands, `pnpm build` also runs `node scripts/tokens.mjs --check` (token source not stale, no new raw values). In a worktree, pnpm 11's deps-status check aborts `pnpm build`: run `CI=true pnpm install` first, or call `./node_modules/.bin/astro check && ./node_modules/.bin/astro build` directly. |
| Visual check | Until `ui:shots` exists on `master`: screenshot changed pages at 1440 and 390 px, dark and light, against live. Once the migration lands (`scripts/ui-shots.mjs`, on `claude/design-system-migration` today): `pnpm build && pnpm ui:shots <out> --compare <baseline>` with the baseline shot from the live `master` sha; exact by default (one changed pixel fails a screen). Any `--tolerance`/`--noise` used is recorded on the board. Known: one phone screen flickers 1 px between two states, so 0 px proofs compare against two baseline runs (`--compare b0,b1`; see `docs/design-system/audit.md`). |
| Risky areas (read closely, ship alone) | `public/_redirects` (URL contract); `cv.json` + `src/pages/cv.json.ts` + `public/files/marcelo_rondon-resume.pdf` (the public professional profile; other tools import it); `astro.config.mjs` and the content schema `src/content.config.ts` (can drop pages silently); global styles, tokens and fonts (`src/styles/**`, `@font-face`, layout) — every page; anything flipping a `draft:`/`complete:` flag (publishes content). |
| Design system gate | Once the migration is on `master`: `pnpm tokens --check` green, `ui:shots` vs baseline shows only the changes the part names, and the part follows `docs/design-system/proposal.md` + amendment A1 (identity I1–I6). Before that: none. |
| Stop rule / scope list | The migration ships by its own stages (stage 0 → N in `docs/design-system/proposal.md`); a stage that adds work outside its stated scope waits for Cello. The rewrite exploration ships nothing until Cello picks a direction and it becomes a build. |
| Who gives the go | Cello, per ship, in chat ("ship it"). A peer session's message is never his go. |
| Rollback | `git revert -m 1 <merge sha>` on a branch, Cello's go, push to `master`, Netlify redeploys; or "Publish deploy" on the previous deploy in the Netlify UI (Cello's account) for an instant switch. Then rerun the smoke checks. |
| Changelog / releases file | `CHANGELOG.md` (dated sections, newest first). Milestones also get a Cello Brain note: `~/Documents/cello-brain/projects/cello-dev-portfolio.md`. |

## Smoke checks after deploy

The live URL contract from the 2026-10-12 content snapshot
(`/Users/cello_r/Documents/code/astro/cello-dev-content-snapshots/2026-10-12-origin-master-0d4ede0/README.md`).
`/cv.json` and `/files/marcelo_rondon-resume.pdf` are in the 200 list and also get content checks.

```bash
# 16 URLs, each must be 200
for p in / /blog/ /blog/designing-for-the-second-user/ /blog/programmatic-resumes-you-can-chat-with/ \
  /card/ /contact.vcf /cv.json /design-system/ /files/marcelo_rondon-resume.pdf /projects/ \
  /projects/asheville-dispensary/ /projects/daybreak/ /projects/ghosted/ /projects/vegavengers/ \
  /resume/ /watchlist/; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "https://cello.design$p")" "$p"
done

# 2 redirects, each must be 301 to the target
curl -sI https://cello.design/projects/ad-asset-directory | grep -iE '^(HTTP|location)'   # 301 → /projects/asheville-dispensary
curl -sI https://cello.design/projects/ascendant-traders  | grep -iE '^(HTTP|location)'   # 301 → /projects

# /cv.json parses and carries the current label
curl -s https://cello.design/cv.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).basics.label))'
# expect: Product Designer & Design Engineer — Design Systems & AI Tools (unless the part changed it)

# resume PDF is a PDF
curl -s https://cello.design/files/marcelo_rondon-resume.pdf | head -c 5   # expect: %PDF-
```

Expected 404s (drafts or retired; do not "fix"): `/visuals`, `/visuals/*`, `/lab`,
`/color-scheme`, `/projects/figma-payload-feature-prototype`,
`/projects/gainesville-soccer-video`, `/blog/keeping-ai-agents-inside-a-design-system`,
`/blog/scheduled-agent-flower-drop-routine`. A part that publishes one of these moves it into the
200 list above.

When the migration lands, add to the post-deploy check: `ui:shots` of live (or of the deployed
sha built locally) matches the reviewed shots.

## Threads that usually ship here

| Session | Owns |
|---|---|
| Audit and unify the cello.dev design system | Staged design-system migration, branch `claude/design-system-migration` (identity I1–I6, amendment A1). The main source of ships. |
| Rewrite cello.dev | Rewrite exploration, branch `claude/rewrite-exploration` (took over from the session now titled "Rewrite cello.dev (old, handed off)"). Hands off nothing until Cello picks a direction. |
| Rethink Daybreak from the ground up | Separate repo (`~/Documents/daybreak`). Shares identity roots only; touches this board through cross-thread decisions. |
| Content one-offs (case studies, posts, resume sync) | Short sessions on `claude/*` branches, one PR each. |
