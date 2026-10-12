# Ship board: cello.dev

Kept by the "Ship cello.dev" session (`ship-conductor` skill). Profile: `docs/ship/PROFILE.md`.

## Live

| Sha | Date | Parts | Verified |
|---|---|---|---|
| `0d4ede0` | 2026-10-11 | PR #13 (Nike/Podium draft, merged); everything before it | Smoke checks run 2026-10-12 by the conductor: 16 × 200, 2 × 301 to the right targets, cv.json label current, PDF is a PDF |

## Ready to review / waiting

| Part | Thread | Commits | Checks | Cello's go | Waits on |
|---|---|---|---|---|---|
| Design-system stages 0–1b (one 0 px part) | Audit and unify the cello.dev design system | 0–1a ready: `756f5b3`..`e3cb897` (identity docs `d4a64ec..54bd1e6` inside the range). 1b **not committed** | Thread: 1a 0 px vs two baselines. **Conductor review 2026-10-12: `e3cb897` FAILS `pnpm build`.** A clean `CI=true pnpm install --frozen-lockfile` gives `astro check` 31 errors (missing Node types in `scripts/sync-projects.ts`, `src/integrations/resumeSync.ts`). Cause: stage 0 `756f5b3` lockfile dropped `@types/node` (29 → 4 refs). The fix is the thread's uncommitted `@types/node` 22.15.17 pin; it must be committed before any of 0–1b can ship (Netlify would fail the build) | **Yes**: "ship" (2026-10-12, answering "stages 0–1b as one 0 px part, or wait for 2a?") | Thread stopped (usage limit). 1b blocked on the 1 px phone menu-button flicker in `ui:shots` |

In flight, not handed off:

- **Design-system migration** (`claude/design-system-migration`, local, unpushed; the thread
  pushes only when Cello asks): stage 0 token source/generator/guards/`ui:shots` (`756f5b3`,
  0 px intended); identity I1–I6 + amendment A1 (`d4a64ec..54bd1e6`, docs); stage 1a roles at
  today's values (0 px) committed. Next: 1b literals → tokens (0 px), then 2a Geist Mono
  actually loads (first visible stage); the thread stops there for Cello's look. 0 px proof at
  hand-off: `ui:shots --compare b0,b1` against two stage-0 baseline runs (one phone screen has
  a documented 1 px two-state flicker; see `docs/design-system/audit.md`).
- **Rewrite exploration** (`claude/rewrite-exploration` at `6f16df3`, local): exploration only;
  not a part.

## Threads

| Session | Owns | Branch | State |
|---|---|---|---|
| Audit and unify the cello.dev design system | Staged migration of today's site; identity I1–I6 + A1 | `claude/design-system-migration` | **Stopped (usage limit).** Committed through 1a `e3cb897`. Uncommitted in its worktree: 1b codemod (raw values 1208 → 499), lowered ratchet baseline, `@types/node` 22.15.17 pin (its install had dropped it: `astro check` 31 errors → 0). Next session: stabilize the shots harness, re-shoot b0/b1 from `756f5b3`, prove 1b at 0 px, commit, hand off; remove `.claude/worktrees/ds-stage0-baseline`; propose the Geist Sans amendment |
| Rewrite cello.dev | Rewrite exploration: window scenes, layer cut, Figma scenes file | `claude/rewrite-exploration` | Exploring; hands off nothing until Cello picks a direction |
| Rethink Daybreak from the ground up | Daybreak, separate repo | (daybreak repo) | Cross-thread decisions only |

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
- 2026-10-12: ship order: migration stages reach `master` first; the rewrite's build plan
  follows only after the migration ships (rewrite handoff, "Next, ranked").

## Open calls for Cello

- Where cello.dev uses Geist Sans: the migration thread will propose this as an amendment.

## After deploy, for Cello

- (nothing live from this board yet)
