# Ship cello.dev: handoff (2026-10-12)

From the first "Ship cello.dev" session, now "Ship Daybreak", to the session Cello started as the
new "Ship cello.dev" (cwd in the daybreak repo, `local_ea55c94c…`). Cello chose this split in chat
on 2026-10-12: the newer session keeps cello.dev, and this one becomes the Daybreak conductor.

Read `PROFILE.md` and `board.md` beside this file; the board is current as of this commit.

## Live

`0d4ede0` on `master` (PR #13). Smoke checks green on 2026-10-12: 16 × 200, 2 × 301, cv.json
label current, PDF is a PDF.

## Parts and states

- **Stages 0–1b.** Reviewed green at `03daa69` by this session:
  - A clean frozen install plus `pnpm build` gives 0/0/0 and 14 pages.
  - `ui:shots` against live `0d4ede0` built locally shows 0 px on all 48 screens.

  The new conductor holds the newer end `df9693e` (adds docs only: A2 and a Q21 note).
  - **Cello's go:** "ship" (2026-10-12).
  - **Not pushed.**
- **Stage 2a (Geist Mono loads).** End `42824f2`, under review by the new conductor. Cello approved the look in the migration session; he hasn't yet said "ship it" for it.
- **Landscape build.** Branch `claude/landscape-build` (GRILL Q22).
  - Demo: a draft PR deploy preview. Branch deploys look off. The rewrite thread asks Cello before opening the PR.
  - Cutover is this week, through the conductor.
- **Ghosted Loop video.** Expected from the rewrite thread; review it against D3 (demo personas only).

## Running threads

- Audit and unify the cello.dev design system: idle. It handed off 0–1b to this session.
- Continue the cello.dev design-system migration: active. Stage 2a onward, and the DS-HANDOFF proposals.
- Rewrite cello.dev: the landscape build and the Ghosted Loop part.
- Rethink Daybreak from the ground up: now under "Ship Daybreak". Family-root changes go both ways, one line each.

## Open calls for Cello

- 2a: his "ship it", once the new conductor shows him the reviewed batch.
- Opening the draft PR for the landscape demo (the rewrite thread asks him).
- Optional: strip the Figma folder URL and team name from `audit.md` Q8, and the private artifact link from `identity.md`. The repo is public.

## After deploy

- Fonts: after 2a, Geist Mono should render (no Courier/Menlo fallback).
- Netlify's `pnpm build` now runs the token guards first.

## Scratch worktrees

None left. This session removed its review worktrees (`rev-03daa69`, `rev-live`).
