# Meadows: two fir trees assigned to the wrong depth

Release correction, 2026-10-16. Baseline: production `6ec9cd6`. Branch: `codex/meadows-tree-cuts`. Cello explicitly approved rollout after local review.

Cello identified two central trees that moved with Far rather than the forest. Isolated Far contained their silhouettes; Mid omitted their upper sections and had gaps across the trunks. This was a segmentation error, not a request to redesign the scene.

## Correction

- Preserve the locked master, crop, composition, Sky, Near, springs and travel caps.
- On the registered 1536×1024 grid, recover the two tree silhouettes and trunk pixels from the original master, downsampled once to that grid, with a source-color matte and a narrow antialiased edge. Add them to Mid.
- Use built-in ImageGen on a 160×180 Far detail to reconstruct only the occluded mountain. The generated image is used solely inside the local repair mask; it does not replace the scene or repaint the trees.
- Save versioned Far/Mid WebPs and update both the scene manifest and catalog. Retain the previous cuts. Rebuild still, read, swatch, flat and flat-tall through `pnpm scenes:derive`.
- Update existing Figma masters Far `12:46` and Mid `12:49`. Both isolated 1536×1024 PNG exports match the uploaded cuts exactly in alpha and visible RGB. Existing instances inherit the corrected fills.

ImageGen prompt: remove only the two central evergreen silhouettes, trunks and immediate branch fragments from the supplied Far detail; reconstruct cream snow and muted blue shadows in the existing printed illustration style; preserve framing, aspect ratio and surrounding mountain; no new objects or text. Exact prompt, generated plate, source-color mask, source reconstruction script, original/corrected composites, Figma upload receipts and exports are retained in the local `2026-10-16/meadows-tree-cuts` review bundle.

## Validation

Persona: **Morgan**, fictional product design hiring manager, English, first visit, looking for the work. No accounts or private seed data.

| Flow | Result | Evidence in review bundle |
| --- | --- | --- |
| Arrive at Meadows on desktop and phone | Pass: selected scene, fixed guide, matching label, no overflow, complete reduced-motion still | `hero-meadows-1440.png`, `hero-meadows-390.png` |
| Move the pointer across the scene | Pass: WebGL uses corrected Far/Mid assets; both trees stay with the forest; offsets remain within original caps | `cursor-corrected-meadows-left.png`, `cursor-corrected-meadows-right.png`, `cursor-corrected.json` |
| Inspect separated planes at diagonal extremes | Pass: both central trees absent from Far and continuous on Mid; repaired mountain exposed behind them | `left-top-after-detail.png`, `right-bottom-after-detail.png` |
| Verify source synchronization | Pass: Figma exports have maximum alpha and visible-channel difference 0 | `figma-roundtrip.json` |

The existing curated-scenes browser driver passed all 17 arrival, selection, fallback and WebGL checks. Rest-composite differences from the flawed baseline are restricted to source bounds x894–978, y347–502: 3,285 changed pixels, mean channel difference 0.0703 across the full frame. A zero restack difference is not the target here: the original baseline contained missing tree pixels. The corrected trees are restored from the locked master.

Build: `pnpm build` passes. `git diff --check` passes. No renderer or dependency changes. Physical iPhone Safari was not tested. Other existing scene-cut imperfections are outside this two-tree correction.

## Publication

Publish one commit directly parented on verified production. Verify that exact commit on its Netlify pull-request preview, then advance `master` without a merge commit. Compare production manifests, corrected cuts and all rebuilt derivatives against the checked local build; repeat the existing arrival/fallback and Meadows pointer-extreme browser checks. The local review bundle retains the publication receipt, deployed revision, preview/live endpoint checks and browser evidence. Public identity, resume and sharing assets remain unchanged.
