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

- **Design-system migration, stage 0 + identity** (`claude/design-system-migration` at
  `54bd1e6`, local, unpushed): stage 0 token source/generator/guards/`ui:shots` (`756f5b3`,
  "no visual change intended") plus identity I1–I6 docs and amendment A1. Stage 1 paused by
  Cello to fold in the window identity.
- **Rewrite exploration** (`claude/rewrite-exploration` at `6f16df3`, local): exploration only;
  not a part.

## Threads

| Session | Owns | Branch | State |
|---|---|---|---|
| Audit and unify the cello.dev design system | Staged migration of today's site; identity I1–I6 + A1 | `claude/design-system-migration` | Stage 0 committed; stage 1 paused for identity; idle |
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
- 2026-10-12: ship order: migration stages reach `master` first; the rewrite's build plan
  follows only after the migration ships (rewrite handoff, "Next, ranked").

## Open calls for Cello

- Is stage 0 (`756f5b3`, no visual change intended) a part to ship on its own, once the
  migration thread hands it off with a 0 px `ui:shots` compare? It puts the token guard into
  `pnpm build` for every later part.
- Archive "Rewrite cello.dev (old, handed off)"?

## After deploy, for Cello

- (nothing live from this board yet)
