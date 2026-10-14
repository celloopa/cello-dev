# Existing landscape: cutover polish, 2026-10-13

This supersedes the earlier chapters hold and four still-first scene limits. Cello chose the existing scrolling portfolio over the separate world prototype, requested motion behind the work, and removed “Take in the view”: the scenery is simply the space. C0–C5 and the prototype route are outside this candidate.

## Implemented

- Remove the separate viewing mode. Keep work and case studies directly available.
- Cello clarified that all scenes must use the hero’s cursor-driven depth, including case-study backgrounds, with content fixed. Both WebGL reading scenes and lazy backdrop layers now use the same back-to-front spring tuning and full inspected pointer caps; subtle idle drift remains additive and clamped. Pointer leave/blur returns layers toward center; reduced motion retains stills.
- Case-study summary fills the same frame as the cover and artifacts: two columns, Tools spanning the final row, one column on phones. Headings and body share a centered reading column; media uses the wider frame.
- All ten places have registered depth planes. Reading drift uses 20% of inspected caps, with a 24-second phrase followed by 60 seconds at rest, capped at 30fps. Only the current backdrop stack stays loaded after crossfade; the covered base renderer sleeps. Reduced motion, Save-Data and unavailable WebGL keep stills.
- Four former still-first scenes have repaired hidden fills and edges. Visible source RGB is restored from the locked masters; generated pixels supply only occluded continuation. Native PNG restack max/mean difference is zero for all four. WebP is a lossy delivery derivative. This is a local registered cleanup, not a new Figma art export.
- Every linked video has a poster and MP4 fallback, reserved dimensions and Pause/Play. Video runs only near the viewport and respects reduced motion. Focused pages paint their small still before full textures load.
- Earlier reading dim fixes Day contrast at the arrival/work boundary. Phone hover, TOC focus clipping, Menu spacing and keyboard focus handling are corrected. Utility canonicals use their own routes and trailing slashes.

## Scene limits

Caps below are source pixels, back to front. Nine scenes allow horizontal movement only. These are bounded depth effects; no independent waterfall shader or lift-chair animation is claimed.

| Scene | Layer caps x (y where nonzero) | Source |
|---|---|---|
| Mirror Lake | 1.2/.6, 6/3, 18/9, 38/19 | Retained hero cuts |
| Meadows | 0, 1, 3, 5 | Retained |
| Ecola | 0, 1, 4, 6 | Retained |
| Ramona | 0, 2, 4 | Retained |
| Bald Mountain | 0, 1, 4 | Retained |
| Sauvie | 0, 2, 5 | Retained |
| Over Hood | 0, 2, 8 | Hidden fill and wing edge cleanup |
| Moss Falls | 0, 2, 6 | Hidden fill cleanup |
| Meadows Lift | 0, 2, 2 | Hidden fill and cable refinement; lift/terrain travel together |
| Salmon Ridge | 0, 1, 5 | Hidden fill cleanup |

Reproduction: `python3 scripts/scene-cleanup.py SOURCE_DIR FILL_DIR REVIEW_DIR`, then `pnpm scenes:derive`. Source masters and generated fill inputs remain private. Each public manifest records layer hashes, restack measurements and caps. `node scripts/video-fallbacks.mjs` derives compatible siblings only for built-page videos. Commit delivery assets after running it.

Three reading-motion tokens were added to the existing Figma Dimensions collection. Token hash `c9051b90ee701c7a`; comparison matched 114 variables and 11 text styles. The public ledger contains variable IDs, never the private file key.

## Verification

- `pnpm build`: token, family and Figma checks pass; Astro 112 files, zero errors/warnings/hints; 14 pages built.
- Day contrast: home and card, 390/1440px, WebGL/still, eight runs covering 174 states and 1,946 text lines. Minimum small text 7.31:1; minimum large text 3.54:1; no console errors.
- Final Chrome persona run: 19 passed flows at 390/1440px in Day/Dusk, including live drift, cover/summary alignment, no horizontal overflow, reduced motion, forced MP4 playback/Pause and no-JavaScript posters.
- All four cases and both posts: 18 passed responsive checks at 390/768/1440px; heading/body edges align and no horizontal overflow. Keyboard menu Tab/Shift-Tab remains inside, Escape closes and restores the opener.
- All ten scenes at 390/1440px: 20 passes, offsets stay within caps and reading offsets change. No page errors.

- Phone Slow 4G (1.44Mbps, 562.5ms latency, 4× CPU, cold cache, gzip), three runs: Ghosted LCP 1.712/2.012/2.008s, median 2.008s; CLS 0.0001; no console errors. The prior 0.0531 layout shift is fixed. The strict 2.000s target is narrowly missed; record it as open rather than rounding to a pass. Earlier unchanged home/card measurements were 1.776/1.792s, CLS 0.
- Cursor follow-up: build passes; directional pointer checks cover Ghosted, Asheville and the scrolling work backdrop, with case-summary bounds unchanged and offsets within caps; reduced motion remains static.
- CV JSON and resume PDF remain byte-identical to live; redirects unchanged. Staged privacy patterns and whitespace checks pass.
- Native Safari check was attempted but the Mac was locked; no Safari pass is claimed.

Screenshots: [desktop](shots/polish/ghosted-desktop.png), [phone](shots/polish/ghosted-phone.png).

## Helium background fallback

A fresh automated Helium session loaded the scene images, so the reported profile-specific failure was not reproduced directly. An initialization gap was found: the inline gate hid the still before the module ran, leaving a blank background if modules were blocked. The CSS now hides it only after `scene-gl-on` confirms a rendered frame. Helium checks cover home and Asheville, both normally and with all external JavaScript blocked: image decoding and visible stills pass. Build guards pass.

## Release boundary

PR14 is a review preview, never a merge vehicle. Refresh it with a fresh single commit parented directly on live master; do not push historical landscape ancestry. Keep CV JSON, resume PDF and URL redirects byte-identical. Production requires Cello's go on the concrete candidate and the cutover checklist. Physical iPhone and Firefox are not verified in this pass. The prior deferred class-name guard and unrelated unlinked legacy assets remain outside this polish.
