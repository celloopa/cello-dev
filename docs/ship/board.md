# Ship board: cello.dev

Kept by the "Ship cello.dev" session (`ship-conductor` skill). Profile: `docs/ship/PROFILE.md`.

## Live

| Sha | Date | Parts | Verified |
|---|---|---|---|
| `0d4ede0` | 2026-10-11 | PR #13 (Nike/Podium draft, merged); everything before it | Smoke checks run 2026-10-12 by the conductor: 16 × 200, 2 × 301 to the right targets, cv.json label current, PDF is a PDF |

## Ready to review / waiting

| Part | Thread | Commits | Checks | Cello's go | Waits on |
|---|---|---|---|---|---|
| (none handed off yet) | | | | | |

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
| Audit and unify the cello.dev design system | Staged migration of today's site; identity I1–I6 + A1 | `claude/design-system-migration` | Stages 0 + 1a committed; 1b then 2a next; stops at 2a for Cello's look |
| Rewrite cello.dev | Rewrite exploration: window scenes, layer cut, Figma scenes file | `claude/rewrite-exploration` | Exploring; hands off nothing until Cello picks a direction |
| Rewrite cello.dev (old, handed off) | Predecessor of the above | — | Handed off; archive candidate (Cello's OK) |
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
- 2026-10-12: ship order: migration stages reach `master` first; the rewrite's build plan
  follows only after the migration ships (rewrite handoff, "Next, ranked").

## Open calls for Cello

- Is stage 0 (`756f5b3`, no visual change intended) a part to ship on its own, once the
  migration thread hands it off with a 0 px `ui:shots` compare? It puts the token guard into
  `pnpm build` for every later part.
- Archive "Rewrite cello.dev (old, handed off)"?
- Family roots: is **Geist Sans** a family root (Daybreak's `family.identifiers` 0.2.0-draft
  lists Geist + Geist Mono) when cello.dev uses Geist Mono only? Either answer works: Daybreak's
  family file drops Geist Sans to "Daybreak's own", or cello.dev adds it. Daybreak is holding
  0.2.0-draft until you answer.

## After deploy, for Cello

- (nothing live from this board yet)
