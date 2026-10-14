# Landscape rendering performance

Research date: October 13, 2026. Scope: the current portfolio renderer and official Three.js, MDN, and web.dev guidance. This is a code review and research note, not a GPU benchmark or a confirmed diagnosis of the user's Helium profile. Implementation can change after this review.

## Verdict

Moving three or four image planes should be a modest workload. The current implementation also uploads full-size transparent textures, shades and blends their pixels, applies a custom Dusk grade, and renders a multi-pass reading blur. Those extras are more relevant optimization targets than the handful of triangles. A disappearance is also a reliability problem: reducing rendering cost alone does not establish why the fallback was replaced by an empty canvas.

Keep a complete still for every scene. Only replace it with animation after successful initialization; restore it permanently for the current page on renderer failure. Preserve the approved art, motion caps, fixed content, and cursor interaction on supported devices. Do not add another animated fallback in response to this report.

## Facts in the inspected code

- `src/lib/scene/renderer.js` creates one orthographic scene with one two-triangle plane per cut layer. The ten manifests contain three or four layers, not complex 3D models. Nine use 1536 × 1024 source textures; Meadows Lift uses 1440 × 1080.
- The canvas uses a DPR cap of 2 on desktop and 1.5 on mobile. It has no antialiasing, but requests a high-performance context. That request is a preference, not evidence that a working GPU path exists.
- At full reading focus, each frame draws the art into a target at half the CSS width and height, runs horizontal and vertical blur passes, then composites to the canvas. Each blur fragment has 15 texture sampling expressions. For four planes this is seven draw calls per settled reading frame, or eleven while the sharp scene is also drawn during the focus crossfade. These are code-derived counts, not measured timings.
- `art-shader.js` does premultiplied-alpha handling and color conversion; the Dusk branch includes Oklab conversion. Optional cloud/lake/plant micro-motion adds UV work. Transparent pixels are discarded only after sampling the texture.
- The renderer already sleeps when settled, pauses hidden tabs, and suspends a covered base scene. Ambient-only drawing is capped at 30 fps; active pointer springs can render at display cadence. Reading drift adds recurring active periods even without cursor movement.
- `reading-drift.js` already implements registered DOM image planes using CSS translation for active section backdrops. It shares spring parameters and caps with the hero. Thus the site already has two rendering paths; it does not require WebGL merely to move an image.

## Where the cost comes from

### Pixels and passes

Canvas pixel count scales with the square of DPR: a 1440 × 900 area is 1.296 million pixels at DPR 1 and 5.184 million at DPR 2. Reducing the desktop cap from 2 to 1.5 reduces canvas pixel count by 43.75%, but does not reduce texture dimensions or the separately sized blur targets. This is arithmetic, not a promised frame-time improvement. Three.js explicitly cautions that high-density rendering multiplies the workload. [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html)

The existing half-resolution blur is already a useful saving. A trace should decide whether blur, full-canvas composition, shader grading, uploads, or CPU scheduling dominates before changing its quality.

### Decoded texture memory

Small WebP downloads do not imply small GPU textures. The conventional RGBA texture estimate is width × height × 4 bytes, plus roughly one-third for mipmaps. [Three.js texture memory](https://threejs.org/manual/pages/textures.html)

For this art, one 1536 × 1024 RGBA8 layer is 6 MiB before mipmaps, about 8 MiB with them. Three layers are roughly 24 MiB and four roughly 32 MiB with mipmaps. These estimates exclude CPU image copies, the canvas, compositor surfaces, and render targets. They are not measurements of actual process memory. `prepareLayerTexture()` leaves mipmap defaults enabled; do not remove mipmaps blindly, because downscaled images may sample better with them.

MDN recommends explicit memory budgeting, releasing unused resources, and considering a smaller back buffer. It also warns that extension support and hardware limits vary. [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

### Scheduling and observability

The existing wake-on-input loop matches Three.js guidance to render when something changes and coalesce pending animation-frame requests. Keep it. If the desired effect is primarily cursor depth, reducing autonomous drift could further reduce idle work, but that is a motion decision rather than a correctness fix. [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html)

The current debug hook reads `renderer.info.render.calls` after drawing. Three resets this counter per render call by default, so it can report only the last pass. For diagnostic whole-frame counts, disable `info.autoReset`, reset once per complete frame, and report that total. [WebGLRenderer statistics](https://threejs.org/docs/pages/WebGLRenderer.html#info)

## Readiness and the disappearing image

At inspection, `frame()` called `draw()` and then `onFirstFrame()` without checking shader failure. `scenery.js` treated that callback as permission to hide the still. Three's shader failure path can log an error without throwing: the installed r186 `WebGLProgram.js` checks program link status, calls `debug.onShaderError` if supplied, and otherwise reports an error. Returning from `render()` is therefore insufficient proof that visible artwork rendered. The public API documents this callback and notes that failed shader programs do not render their material. [Three.js renderer diagnostics](https://threejs.org/docs/pages/WebGLRenderer.html#debug), [versioned Three.js source](https://github.com/mrdoob/three.js/blob/r186/src/renderers/webgl/WebGLProgram.js)

The application context-loss listener also appeared after texture initialization. Early failure must be handled before uploads, not only after the renderer starts. Recommended bounded repair:

1. Register loss handling and shader-error handling before uploads or first draw.
2. Gate handoff on no recorded failure and a live context, with at least one intended scene frame completed.
3. Catch exceptions in asynchronous animation-frame draws as well as initial setup.
4. On failure, cancel timers/frames and pending handoff, hide the failed canvas, dispose enhanced backdrop stacks, and retain the complete still for the page. Avoid repeated automatic upgrade attempts.

These checks close identifiable failure paths; they cannot prove actual GPU presentation. Do not add synchronous pixel readbacks to every frame just to establish readiness.

Session evidence supplied by the implementation task: a fresh headless Helium run without forced GPU stayed on the no-WebGL still path, while a run forcing Metal rendered. Neither reproduces the user's normal profile. Shader failure, context loss, driver/backend availability, and handoff timing remain hypotheses. Do not claim that Helium itself or resource exhaustion is the proven cause.

## Bounded optimization plan

First ship and verify stable stills on every scene for no-WebGL, reduced motion, texture rejection, shader rejection, context loss, and runtime draw errors. Exercise failure both before and after handoff, including a case study and a section crossfade.

Then record a normal GPU-enabled desktop trace with fixed viewport and DPR while moving the cursor, resting, scrolling into reading focus, and switching scenes. Record frame distribution, long tasks, full-frame draw counts, loaded texture dimensions/counts, and the state transition reason. Compare one change at a time: DPR 2 versus 1.5, then a lower-cost reading blur. Use one active scene stack and only the temporary second stack required for crossfade; dispose replaced resources.

If the supported WebGL path still proves costly, compare the existing DOM translation path against the hero for one scene, retaining the same cuts, springs, cropping, and caps. CSS transforms and opacity are the browser's preferred animation properties; unnecessary layer promotion can itself hurt performance. Parent filters and large images still need profiling, so CSS is an alternative to test, not a guaranteed free GPU path. [web.dev animation guidance](https://web.dev/articles/animations-guide)

This comparison is a possible simplification of the normal enhancement, not a mandate for a new framework or an animated fallback. Defer KTX2 transcoding, workers, WebGPU, shader rewrites, and asset recutting until evidence identifies a need. Keep still fallbacks and fixed readable content throughout.
