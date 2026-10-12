# Rewrite → design system: what the landscape work adds (2026-10-12)

For the audit thread ("Audit and unify the cello.dev design system", `claude/design-system-migration`)
and the "Ship cello.dev" conductor. Source: this branch, `claude/rewrite-exploration` (local), the
landscape build at `f1b1e66`. Exploration: nothing here ships until Cello picks the build.
Cello (2026-10-12): "ensure the new changes to our brand and design system are being logged and
taken into components".

## Decided by Cello (log as decisions)

| # | Decision | Source |
|---|---|---|
| D1 | Text may sit over scene art in the rewrite's landscape direction, with the approved focus dim; the window frame no longer frames the hero. Scope for today's site is still his call (already logged as "I2 and I5 revised for the rewrite only"). | GRILL Q21 |
| D2 | People never appear in scene art. All ten scenes were cleaned (Moss Falls, Bald Mountain, Salmon Ridge, Sauvie). | GRILL Q21; "remove the sauvie people too" |
| D3 | Product artifacts in case studies use Ghosted's made-up demo personas (Rowan Ellis and the persona set), never a real resume or tester data. | GRILL Q21 note |
| D4 | Reading state: the scene softens and dims to the approved level; location and sound labels disappear; a changed place may be named briefly, then clear. | GRILL Q18 |
| D5 | Keep the dark green top bar. Work navigation is separate from About and the other utilities. | GRILL Q18 |
| D6 | Sound is a later, opt-in pass (silent by default, remembered preference, settings in utilities). | GRILL Q20 |

## Proposed components and tokens (built in the prototype; for an amendment, pending Cello)

1. **Scene** (replaces the earlier SceneStop/scene-kit proposal). Layered art planes from one
   manifest per place (`public/gen/layers/<place>/scene.json`; catalog `public/gen/scene-library.json`):
   layers back → front, depth, **tested motion caps** per layer, desktop anchor and mobile center,
   Figma IDs, status/limitations. Renders as WebGL planes; the same webps stacked in the DOM are
   the still (reduced motion, no WebGL, texture failure, hidden tab). Code: `prototypes/shared/scenery.js`,
   `directions/landscape.js`, `scenes/art-shader.js`.
2. **Signature motion tier.**
   - **Arrival:** sky → far → mid → near, 0.12 s stagger, spring overshoot by depth (nearest about 11%), half the drop on mobile; text never waits.
   - **Pointer depth:** per-layer springs, hard-clamped to the scene's tested caps (Mirror Lake near 38 source px; Ecola near 6).
   - **Focus transition:** 0.55 s.
   - **Reduced motion:** a still.
   - **Idle:** the loop stops when idle or hidden.
3. **Focus recipe (tokens).**
   - Desktop: blur 7 px, brightness 0.45, saturate 0.65.
   - Mobile: blur 5 px, brightness 0.36, saturate 0.6.
   - Art scale 1.025, plus the ink atmosphere.
   - Approved by Cello as the v2 storyboard level (D4).
4. **Copy scrim + contrast rule.**
   - **Scrim:** a feathered ink layer behind copy over art: 64% by default, 85% on Ecola desktop, 70–80% on mobile.
   - **Rule:** text over art must pass 4.5:1 (3:1 for large text) against the 99th-percentile brightest pixel under it.
   - **Conflict to resolve:** this replaces I3's "art is exempt from text contrast because text never sits on it", which no longer holds once text sits on art (D1).
5. **Contextual top bar:** exploring shows identity + Work, with utilities separate. Reading shows the project in view + "All work".
6. **Place label** (the Switchback `place-name` role) and **Admire** control ("Take in the view" / "Back to Cello").
7. **Scene selector** (storyboard only, not built): a landscape swatch index of projects, each with its own place.

## Gaps the migration can close for the rewrite

- **National Park and Switchback font files are not in this repo or its history.** The landscape build uses temporary system sans. The rewrite can use them only once the migration self-hosts them (I4).
- **Geist Sans for long reading (A2):** the landscape copy is a natural first consumer.
- **Pending with Cello:** whether D1 also changes today's site (I6), and copy and type for the hero.

## Pointers

- Decisions: `docs/rewrite/GRILL.md` Q18–Q21.
- Storyboard brief: `docs/rewrite/STORYBOARD.md`.
- Build notes and measurements: `docs/rewrite/prototypes/README.md`.
- Scene method: `~/.agents/skills/scene-cutting/`.
- Figma: [cello.dev — window scenes](https://www.figma.com/design/BHwjRNFmaMra4MUhsSwUXC).
