# Ship board: cello.dev

Kept by the "Ship cello.dev" session (`ship-conductor` skill). Profile: `docs/ship/PROFILE.md`.

## Live

| Sha | Date | Parts | Verified |
|---|---|---|---|
| `0d4ede0` | 2026-10-11 | PR #13 (Nike/Podium draft, merged); everything before it | Smoke checks run 2026-10-12 by the conductor: 16 × 200, 2 × 301 to the right targets, cv.json label current, PDF is a PDF |

## Ready to review / waiting

| Part | Thread | Commits | Checks | Cello's go | Waits on |
|---|---|---|---|---|---|
| Design-system stages 0–1b (one 0 px part) | Audit and unify the cello.dev design system | **Pinned `03daa69`** (fast-forward from `0d4ede0`; 15 commits incl. audit/proposal/identity docs, stage 0, 1a, `a9d1289` @types/node fix, 1b) | **Conductor review 2026-10-12, green:** clean `CI=true pnpm install --frozen-lockfile` + `pnpm build` (tokens --check, astro check 0/0/0, 14 pages); `ui:shots` of `03daa69` vs live master `0d4ede0` built locally with the same script: **0 px on all 48 screens**; deleted files unreferenced; no risky-area files touched beyond styles/tokens; privacy pass (Sonnet, verified): no blockers; optional cleanup: Figma folder URL + team name in `audit.md` Q8, private artifact link in `identity.md` | **Yes**: "ship" (2026-10-12) | A second "Ship cello.dev" session appeared; holding the push until it confirms it isn't shipping this too |

In flight, not handed off:

- **Design-system migration** (`claude/design-system-migration`, local, unpushed; the thread
  pushes only when Cello asks): stage 0 token source/generator/guards/`ui:shots` (`756f5b3`,
  0 px intended); identity I1–I6 + amendment A1 (`d4a64ec..54bd1e6`, docs); stage 1a roles at
  today's values (0 px) committed. Next: 1b literals → tokens (0 px), then 2a Geist Mono
  actually loads (first visible stage); the thread stops there for Cello's look. 0 px proof at
  hand-off: `ui:shots --compare b0,b1` against two stage-0 baseline runs (one phone screen has
  a documented 1 px two-state flicker; see `docs/design-system/audit.md`).
- **Ghosted case study: live landing Loop recording** (rewrite thread; Cello: "Both"). Expected
  as a real part, with files, the exact MDX change and go status. It also fixes the stale "five
  chapters" line (the live landing has six). Review against D3: demo personas only.
- **Landscape build (the rewrite becomes a build)**: `claude/landscape-build`, cut from the
  migration branch at `42824f2` (it contains `03daa69`). Plan: `docs/landscape/PLAN.md` @
  `59629e9`, stages S0–S4. Cello, GRILL Q22 @ `f0ff8c0`: "i like the landscape concept … its
  time to do it and make it fit in the design system"; "rewrite only for now, keep site for now
  but allow me to see a demo of the new so we can start ironing it out and cutover this week".
  Today's site stays live until cutover; **cutover goes through this board** with his "ship it".
  Preview: Netlify **branch deploys look off** (pushed branches get no Netlify status; the
  `claude-ship-conductor--marcelorondon.netlify.app` URL is 404), but **PR deploy previews work**
  (`deploy-preview-<N>--marcelorondon.netlify.app`, e.g. PR #13). So the demo route is a
  **draft PR** against `master`, never merged by anyone but this conductor. The thread asks Cello
  before opening it.
- **Rewrite exploration (superseded by the build above)** (`claude/rewrite-exploration` at `6f16df3`, local): exploration only;
  not a part.

## Threads

| Session | Owns | Branch | State |
|---|---|---|---|
| Audit and unify the cello.dev design system | Staged migration of today's site; identity I1–I6 + A1 | `claude/design-system-migration` | **Stopped (usage limit).** Committed through 1a `e3cb897`. Uncommitted in its worktree: 1b codemod (raw values 1208 → 499), lowered ratchet baseline, `@types/node` 22.15.17 pin (its install had dropped it: `astro check` 31 errors → 0). Next session: stabilize the shots harness, re-shoot b0/b1 from `756f5b3`, prove 1b at 0 px, commit, hand off; remove `.claude/worktrees/ds-stage0-baseline`; propose the Geist Sans amendment |
| Rewrite cello.dev | Landscape build (S0–S4) + Ghosted Loop video part | `claude/landscape-build`; `claude/rewrite-exploration` | **Building** (Cello picked the landscape, Q22); cutover target this week |
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

## Open calls for Cello

- Where cello.dev uses Geist Sans: the migration thread will propose this as an amendment.

## After deploy, for Cello

- (nothing live from this board yet)
