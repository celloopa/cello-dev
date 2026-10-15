# Scene handoff fix, October 15, 2026

Reviewed release based on freshly fetched production master `4399f26`. Cello approved publication on October 15 after reviewing the updated desktop and phone recordings.

Morgan, a hiring manager visiting in English for the first time, should see one continuous landscape while the optional animation loads. A returning visitor sees the same transition without replaying the greeting. No account or private seed data is needed.

## Baseline

The server-rendered still is already a complete stack of registered cuts. The renderer previously started an assembly animation anyway, and handed over when only the sky reached 99% opacity. In the slowed desktop capture, the mid plane was 82.7% opaque and 22.1px below rest; the near plane was invisible and 63px below rest. On phone the near plane was 0.2% opaque and 29.5px below rest. The canvas replaced the complete picture with an incomplete one.

Two additional discontinuities compounded the refresh: the DOM uses plain cover-fit and brightness(.8), while the canvas immediately uses overscan and the Oklab Dusk grade. The still and canvas also faded simultaneously, exposing the dark background between them. Decode and upload completed without errors in both baseline captures. This reproduces a presentation problem, not a navigation or page reload.

## Change

- Start every runtime plane fully assembled. Keep the old arrival seek hook for review compatibility.
- Match the DOM cover-fit, per-plane phone anchors, brightness and focus recipe in the first canvas frame. Flattened reading stills use their shared phone anchor.
- Keep the opaque still under the entire canvas fade. Read the fade duration from CSS instead of hard-coding a timer.
- After the fade, ease into the existing overscan, Dusk grade and motion over 900ms. Final framing, artwork, depth, source-pixel travel caps, drawing-buffer limit and sleeping behavior stay intact.
- Initialize from the current reading state if the visitor scrolled during loading. Respect reduced motion if it changed during import/decode.
- Clamp the first RAF delta to zero: after synchronous initialization, the browser can supply a timestamp earlier than start(), which previously produced negative ambient amplitude.

The runtime changes are in Scene.astro, scene.css, catalog.ts, renderer.js and scenery.js. SceneLayout.astro, all ten scene manifests and every existing raster cut remain unchanged. The derivative builder produces additional composite stills; framing settings are shared with the runtime in scene-framing.json. The ten scenes retain their existing three or four registered planes and their documented hidden-edge/style-approval limitations. Mirror Lake has sky/far/mid/near; the guide remains a separate planted DOM foreground.

## Experience run

Chrome with the Metal GPU backend; desktop 1440×900 and phone emulation 390×844. Captures use 120ms network latency, 180,000 bytes/s download, CPU slowdown 4, and an additional 1.8s renderer-module delay. The greeting is marked seen to isolate scenery; the existing conversation driver separately walks first-visit typing and controls. Recordings and timestamped frame/state samples are retained in the local review bundle. CDP compositor padding is cropped and frames are normalized to the viewport for video encoding; the raw JPEGs, normalization rectangles and full PNG screenshots are preserved.

| Id | Flow | Result | Evidence |
| --- | --- | --- | --- |
| morgan-load | Open home and wait for animation on desktop and phone | Pass | Before/after MP4s and sampled plane states: first enhanced frame now has every plane at opacity 1, offset [0,0], handoff mix 0 |
| morgan-continuity | Compare frozen first canvas frame with the still | Pass | Mean RGB byte difference approximately 0.77 desktop / 1.25 phone (0–255); minor resampling differences remain, not pixel-identical |
| morgan-explore | Move cursor, use project rail, open/close Menu, replay greeting | Pass | Existing conversation driver, seven grouped checks at 390/768/1440/1676px; fixed guide and copy, scenery responds within caps |
| morgan-read | Open Ghosted case study on phone and desktop | Pass | Focused scene, all background planes opaque; native context-loss extension restores the still |
| morgan-fallback | Reduced motion, ?gl=0, no JS, unavailable WebGL, blocked module, image-load failure, upload error, preference change during load | Pass | Still remains visible, no visible canvas, no horizontal overflow; an unavailable image remains unavailable in the SSR stack |
| morgan-loading-input | Change reduced motion or scroll after the renderer import request starts, while it is held for 1.8s | Pass | Preference change keeps canvas hidden; scroll initializes the renderer at full reading focus |
| morgan-first-paint | Hold the mid/lake download while sky/far/near have finished, desktop and phone | Pass | Complete composite stays visible, every original cut stays hidden, canvas absent; cold-load recording has zero visible undecoded-poster or cut-plane samples |
| morgan-large | Open home at 3840px, DPR 2 | Pass | Drawing buffer capped at 3072px, complete scene |

Build: `pnpm build`, 120 checked Astro files, zero errors/warnings/hints; 16 pages. Vite retains its pre-existing empty SceneLayout chunk notice. No new package dependency.

## Limits and delivery

These are desktop Chrome and emulated-phone checks. Physical iPhone Safari, the user's long-lived browser profile and real-device GPU stalls remain unverified. The change removes the reproduced reassembly, crop jump and double-fade dip; it does not claim to eliminate every cold shader/upload pause. A short, smooth acquisition of the established motion grade and framing is intentional after the seamless canvas fade.

The social-kit worktree is untouched. Publication uses a fresh clean commit sole-parented on verified production master, with the required private-pattern scan. Verify that exact commit on the Netlify preview before advancing master without a merge commit, then verify the live HTML, art, renderer and fallbacks. Historical worker ancestry is never published. The local release receipt records the deployed revision and verification results.

## Initial loading follow-up

Cello spotted the missing lake in the first frames of the original after clips. Those frames preceded the WebGL handoff: the still's independently downloading mid image was incomplete, allowing the opaque sky plate underneath to show through. The original pixel comparison only began after every still image had decoded, so it did not cover this state.

The first screen now uses one full-resolution composite, made deterministically from the existing registered cuts. Its inline reveal waits for decode before making it visible and works even if the module is blocked. Full cuts have data-src only, stay hidden, and start fetching after the complete poster and text paint. Reading pages keep their existing smaller flattened images. Reduced-motion and no-WebGL visitors do not download hidden cuts. If the poster alone fails, the inline fallback decodes the original stack before revealing it together.

Mirror Lake's phone poster is a portrait composite of the established per-layer crops (including the near plane's 9% anchor), with the source crop offsets recorded in still-mobile.json. The renderer reconstructs those offsets for the first frame at any phone aspect ratio before easing to the original runtime framing. No scene is recut and no travel cap is increased.

Regenerate only these derivatives with `pnpm scenes:derive --stills-only`; the regular `pnpm scenes:derive` also maintains them. Desktop Mirror Lake poster: about 443 KiB; phone: about 168 KiB. Lossy derivative compression accounts for small first-frame texture differences. Cold captures keep the original 120ms latency / 180,000 bytes per second / CPU 4 settings and renderer delay. Updated review excerpts start at the first decoded poster; full navigation recordings, raw frames and performance.timeOrigin are retained for checking the earlier loading interval too.
