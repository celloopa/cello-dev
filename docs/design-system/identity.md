# cello.dev identity revision

Started 2026-10-12, when Cello paused the migration after stage 0 to fold the rewrite's window
concept into the identity before the system is built. Board (private):
https://claude.ai/artifact/4c5Z8TdCE2L7ktPFYaM9Um. Concept source: `docs/rewrite/GRILL.md` Q10–Q14
and the window correction, on `claude/rewrite-exploration`.

**The idea:** the site is the view from Cello's desk window at daybreak. His favorite Pacific
Northwest places pass through it as WPA-style poster prints, and the work sits in front of and
below the window. The mark was already this scene: a sun rising behind a mountain, framed by the C.

**What folds in** (Cello, 2026-10-12, all four):
1. Daybreak window and times of day: the light theme is Day, the dark theme is Dusk.
2. Seasonal poster inks, as an art palette.
3. A poster display face for titles and place names.
4. The window frame as a shape primitive, and the location card as a component.

## Decisions

- **I1. Sun over Mt Hood belongs to cello.dev (2026-10-12).** The mark reads as C, a green sun
  and Mt Hood. The Daybreak app's from-scratch identity picks a different motif, which keeps
  "shared family roots, separate systems" (Daybreak grill-log item 18). The Daybreak session
  was told.

## Seasonal inks (draft, from the photos)

Pixel colors from Cello's ten landscape photos, read without metadata, then flattened the way
a WPA print simplifies a view (saturation ×1.35).

| Season | sky | far | snow | forest | ground |
|---|---|---|---|---|---|
| June · Meadow | `#6a9de8` | `#365ea0` | `#e6eef6` | `#1c2c1d` | `#737741` |
| July · Coast fog | `#bed4e3` | `#9aa7ab` | `#e2ecf1` | `#202118` | `#656b61` |
| August · Dry gold | `#93c7fa` | `#8e9dad` | `#dae6f1` | `#2b3026` | `#9a7d47` |
| September · High light | `#4885e3` | `#38618c` | `#d4dce4` | `#323f44` | `#7c6145` |
| October · Storm sky | `#a1abbf` | `#717172` | `#c0cee4` | `#3c3c2c` | `#8b7b66` |

Dusk is one rule rather than a second palette: each ink is mixed 60% toward Midnight Ink
(`color-mix(in oklab, <ink> 40%, #001a11)`, the snow at 55%).

## Still open, one at a time

1. Day/Dusk naming, and the rule that text only meets Day or Dusk surfaces.
2. The seasonal inks and the dusk rule.
3. The display face (Big Shoulders Display recommended; League Gothic and Alfa Slab One shown).
4. The window frame primitive and the location card (their tier).
5. How much of this reaches today's site in the migration.
