# Efecto: quick REA and exploration direction

2026-10-13, America/Los_Angeles. Public research only, requested directly by Cello.

## Direction clarified by Cello

The appeal of Pablo's reference is **the illustrated world and exploring it**:
“i want mine to feel like a place you can discover, while still making the work easy to find.”
Exploration is now a design requirement for the next storyboard, beyond visual coherence alone.
The interaction mechanics remain open; this does not automatically select free-roaming controls
or amend the existing C0–C5 plan.

## Verdict

Efecto is useful as a candidate **art-treatment laboratory** and a reference for pairing rich
illustration with clear actions. The next design hypothesis is an explorable illustrated
landscape, recognizable project landmarks, and a persistent route to the work index.

## Observed versus documented

| Evidence | Finding | Possible use for cello.dev |
| --- | --- | --- |
| REA: [landing page](https://efecto.app/) | A substantial illustrated scene shares the first screen with readable copy and clear actions. [Screenshot](research/efecto/landing.png). | Let people recognize identity and find work while the place invites discovery. |
| REA: [FX](https://efecto.app/fx) | Public media, effect families, controls and presets are separate. Selected Beach Sunset and switched Halftone → Art/Engraving; controls and canvas changed. [Halftone](research/efecto/halftone.png), [engraving](research/efecto/engraving.png). | Separate scene source, palette, texture and motion parameters so a coherent look can be tuned and repeated. These video frames are not a controlled visual comparison. |
| REA: sampled Engraving export dialog | Export code opened a prompt with algorithm/settings and React Three Fiber integration instructions. The captured output did not include a complete fragment-shader implementation. | Treat this as an implementation brief requiring adaptation and verification for Astro/three.js. No export was copied into the site. |
| [FX documentation](https://efecto.app/docs/fx) | Describes effects, layers and post-processing. | Candidate workflow for reusable art treatments; no runtime dependency selected. |
| [Palette docs](https://efecto.app/docs/fx/postprocess/palette) | Documents custom-color mapping and adjustable intensity. | Test the existing seasonal inks as one reusable treatment. Not executed here. |
| [Kuwahara docs](https://efecto.app/docs/fx/effects/art/kuwahara) | Describes an edge-preserving painterly filter. | A candidate deterministic treatment to compare against the current generated screenprint method. Not executed or selected. |
| [3D layer docs](https://efecto.app/docs/fx/layers/3d) | Documents models, primitives and extruded SVGs. | Potential small landmark/prop experiments. Navigable-world behavior was not established by this feature list. |
| [Design Tool](https://efecto.app/docs), [layout docs](https://efecto.app/docs/layout) | Separately documents agent-driven artboards and JSX/Tailwind layouts. | Optional layout exploration; the authenticated design workflow, exports and token fidelity were not tested. |

## Recommended next experiment

A throwaway storyboard/prototype of **one place with one project landmark**, plus a visible Work
index shortcut. Compare selecting the landmark with using the direct route. Opening the project
should reveal its current role/problem/decision/status summary and a calm reading surface;
returning should restore the place. Test desktop pointer, narrow-screen taps, keyboard and still
fallback before choosing movement or navigation mechanics.

For art, compare the existing treatment with one palette/print recipe on synthetic or public
material. This remains a proposal: no private photos, scene art or site files were processed.

## Evidence and limits

Three sequential REA 6.4.0 controlled scenarios; Chromium 155.0.8059.40, 1440 × 900, scale 1,
light preference, normal motion. [Evidence index](research/efecto/evidence-index.json) records
capture hashes and successful IDs:

- Home/docs: `ev_4ef9c6f6987dc3dd385bfa6ba20058291e627052bd9bab56b1d9c5e5a075941a`.
- FX initial: `ev_fb82cb1a73abed5b79ecb79d3e9a0acc4a0f2c5973655e1f4e3d98366acb29dc`.
- FX controls/export: `ev_ed542eccd5763410571aa23911f760430a30c347788cee21e98a0819fcde96ad`.

All declared actions completed and REA reported termination of owned browsers. No account,
installation, private uploads, paid action, publishing, render-API call or code implementation.
No source/bundle reconstruction, phone test, performance benchmark, license review or validation
of export equivalence. Documentation statements are distinguished from executed controls.

The quick questions are answered: useful visual/authoring concepts exist, with observed controls
and a bounded export result. Whether any effect fits the portfolio's existing art direction or
performance budget requires the proposed experiment. GRILL/PLAN and application code are unchanged.
