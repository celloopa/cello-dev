# Ship cello.dev: handoff (2026-10-13)

From the second "Ship cello.dev" session (archived at Cello's request while nothing is ready to
ship) to whichever session Cello starts next as "Ship cello.dev". Read the `ship-conductor` skill,
`PROFILE.md` and `board.md` beside this file first. The board is current as of this commit.

## Live

`060ad5b` on `master`. It carries:
- design-system stages 0–4 and 7–9;
- the Ghosted demo-persona swap (`b92f443`);
- the privacy removals (`f06cec5`, `1881484`).

Smoke checks were green after every push, and each ship is in the board's Live table.

## Nothing is waiting to ship

| Thread | Owns | State |
|---|---|---|
| Continue the cello.dev design-system migration | Figma re-sync for the cutover tree; Part 11 (Figma components) after cutover | Not done; don't offer for archive |
| Rewrite cello.dev | The landscape build, now the "chapters" direction (storyboard, then build) | Building |
| Cut over cello.dev | Takes the landscape build to one **squashed** commit on live `master`, runs `docs/landscape/CUTOVER.md`, gets Cello's go | Cutover **held** (Cello, grill Q39) until chapters is built, passes the plan, and he has walked the preview on his phone. Likely several days out |
| Imagine cello.dev's future | Exploration | Ships nothing |
| Audit and unify the cello.dev design system | Stages 0–1b (shipped) | Safe to archive |
| Audit cello.dev public/ for unlinked personal files | One-off privacy audit (done) | Safe to archive |
| Ship Daybreak Next | Daybreak's conductor | Family-root notes go to it, one line each way |

## When the cutover hand-off arrives

1. Check the parent is live `master` and the commit is a single squash, not landscape-build's history.
2. Run the PROFILE privacy grep over every commit being pushed, using the local patterns file. Check that none of the files removed in `f06cec5`/`1881484` are back and that the `ghosted/v3` demo-persona images are kept. Eye-check changed media for demo personas only.
3. Run the PROFILE checks, `ui:shots` vs live, the motion table if motion changed, and a persona run of the visible flows.
4. Add `/about` to the smoke list (it's a new URL).
5. Get Cello's "ship it" in your own session, then push. Large pushes sometimes drop on the first try; retry once and confirm `origin/master` moved.

## Open calls for Cello

- None are blocking. Optional: ask GitHub Support to purge the orphaned demo-branch commits and the PR #14 history, and delete old deploy previews in Netlify (see the board's privacy section).

## Lessons for the next conductor (repo facts; the skill has the general ones)

- Netlify posts no commit status for `master`. For a 0 px push, the live site can't prove the deploy ran; the next visible deploy does.
- The private patterns file lives outside the repo, so the patterns themselves never become public. Never write its contents into the board or the profile.
- This shell is zsh, so `$VAR` holding several paths doesn't word-split; use arrays.
