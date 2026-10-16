/*
 * Scene renderer (three.js; loaded after paint by a dynamic import). The DOM half is scenery.js.
 * Ported from the rewrite prototype (docs/rewrite/prototypes/directions/landscape.js on
 * claude/rewrite-exploration, verified there); behavior unchanged. What changed in the port:
 * the focus recipe, the focus duration, the arrival stagger and the nearest layer's overshoot come
 * from the A3 tokens (src/tokens/tokens.json → tokens.css, read at runtime by scenery.js and
 * passed in as `tokens`), and the motion caps come from each scene's manifest.
 *
 * The cut layers (back → front) are textured planes in a pixel camera, cover-fit into the viewport
 * below the bar with one scale (so they stay registered) plus just enough overscan for every
 * movement below. Texture handling, the Dusk grade and the micro-motion are in art-shader.js.
 *
 * - Handoff: a complete frame matches the DOM still, then eases into the motion framing and
 *   grade after the canvas fade. The arrival recipe remains seekable for review only.
 * - Depth: desktop pointer, mobile native scroll. Each layer follows its target with a damped
 *   spring and its offset is clamped to the scene's tested travel ("caps", source px → screen px
 *   through the cover-fit scale), so no hidden fill beyond what was inspected is ever shown.
 * - Reading: blur + dim + desaturate, the perceived result of the approved v2 reference
 *   (the focus recipe tokens: blur 7px, brightness .45, saturate .65; mobile 5px, .36, .6):
 *   brightness/saturation are applied per layer in sRGB-encoded space (linear operations, so the
 *   same as grading the composite, which is how the CSS filter works); the blur is a separable
 *   Gaussian at half CSS resolution, cross-faded over the sharp frame. Travel goes to 0 and the
 *   micro-motion quiets. The ink atmosphere is DOM (shared with the still).
 * - Loop: renders only while something moves; ambient micro-motion runs at ≤ 30 fps and only for
 *   a while after the last input (then eases to rest and the loop stops). Stops in hidden tabs.
 *   DPR ≤ 2 desktop, ≤ 1.5 mobile. Context loss → onLost (the still takes over).
 */
import {
  WebGLRenderer, Scene, OrthographicCamera, Group, Mesh, PlaneGeometry, ShaderMaterial, Texture,
  WebGLRenderTarget, LinearFilter, Color, NormalBlending,
} from "three";
import { DUSK, artVert, colorGLSL, motionGLSL, motionDefines, prepareLayerTexture, MOTION_MAX_UV } from "./art-shader.js";

import { readingDrift, DEPTH_SPRINGS as SPRING } from "./reading-drift.js";
import { PLANE_SPRING } from "./planes";
const AMBIENT_IDLE = 15000;   // ms of ambient micro-motion after the last input
const AMBIENT_FPS = 30;
const POINTER_TRAVEL = 1;     // × caps at the pointer extremes
const HANDOFF_SETTLE = 0.9;   // s, after the CSS canvas fade, to acquire the motion framing/grade
const ARRIVE_LEAD = 0.02;     // s: the far layer starts this much after the first stagger step

/** Damping ζ that gives this overshoot (fraction) on a unit step: the inverse of overshoot() below. */
const zetaFor = (os) => { const l = Math.log(os); return -l / Math.sqrt(Math.PI * Math.PI + l * l); };

/**
 * The tuning that comes from tokens. With the A3 values (stagger 120ms, overshoot 0.107, focus
 * 550ms) this is exactly the prototype's table: starts 0 / .14 / .26 / .38 s, nearest ζ 0.58,
 * focus rate 5.5/s.
 */
function tuning(tokens) {
  const s = tokens.arrivalStagger;
  // arrival: per layer from the back. drop = fraction of the viewport height; ζ damping; ω rad/s
  // (short fades: the cut planes read as paper dropped into place, not a dissolve)
  const ARRIVE = [
    { start: 0.0, fade: 0.4, drop: 0, zeta: 1, omega: 9 },                                // sky: fade only
    { start: ARRIVE_LEAD + s, fade: 0.16, drop: 0.02, zeta: 0.9, omega: 9 },              // far / mountain
    { start: ARRIVE_LEAD + 2 * s, fade: 0.16, drop: 0.035, zeta: 0.75, omega: 8.5 },
    { start: ARRIVE_LEAD + 3 * s, fade: 0.16, drop: 0.07, zeta: +zetaFor(tokens.arrivalOvershoot).toFixed(2), omega: 8 }, // nearest: the softest spring
  ];
  return {
    REF: tokens.focus, // the approved v2 reading frame: { desktop, mobile } × { blur, bright, sat }
    READ_SCALE: tokens.focus.scale - 1, // the reference also scales the art while reading
    FOCUS_RATE: 3.025 / tokens.focusSeconds, // 1/s, exponential approach (≈ 95% at the focus duration)
    ARRIVE,
  };
}
// pointer / scroll springs, by layer from the back (ζ lower = livelier near layers)


const artFrag = /* glsl */ `
  uniform sampler2D uMap; uniform float uTime, uFade, uDusk, uShore, uMotion, uBright, uSat; uniform vec3 uDuskInk;
  varying vec2 vUv;
  ${colorGLSL}
  ${motionGLSL}
  void main() {
    vec4 t = texture2D(uMap, artMotion(vUv));
    if (t.a < 0.002) discard;
    vec3 e = toSRGB(duskGrade(toLinear(t.rgb / t.a)));
    // CSS brightness() then saturate() (filter-effects matrices), on encoded values
    e *= uBright;
    e = mix(vec3(dot(e, vec3(0.213, 0.715, 0.072))), e, uSat);
    float a = t.a * uFade;
    gl_FragColor = vec4(e * a, a); // canvas/target hold premultiplied sRGB bytes
  }`;

const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const TAPS = 8;
const blurFrag = /* glsl */ `
  uniform sampler2D tSrc; uniform vec2 uStep; uniform float uOff[${TAPS}], uW[${TAPS}];
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(tSrc, vUv) * uW[0];
    for (int i = 1; i < ${TAPS}; i++) {
      vec2 o = uStep * uOff[i];
      c += (texture2D(tSrc, vUv + o) + texture2D(tSrc, vUv - o)) * uW[i];
    }
    gl_FragColor = c;
  }`;
const compFrag = /* glsl */ `
  uniform sampler2D tSrc; uniform float uMix;
  varying vec2 vUv;
  void main() { gl_FragColor = vec4(texture2D(tSrc, vUv).rgb, uMix); }`;

/** Gaussian σ (texels) → linear-sampling taps (center + pairs merged into one bilinear fetch). */
function gaussian(sigma) {
  const r = Math.min(Math.ceil(sigma * 3), 2 * (TAPS - 1));
  const w = []; let sum = 0;
  for (let k = 0; k <= r; k++) { w[k] = Math.exp(-(k * k) / (2 * sigma * sigma)); sum += k ? 2 * w[k] : w[k]; }
  const off = new Array(TAPS).fill(0), wt = new Array(TAPS).fill(0);
  wt[0] = w[0] / sum;
  for (let i = 1, k = 1; i < TAPS && k <= r; i++, k += 2) {
    const a = w[k] / sum, b = k + 1 <= r ? w[k + 1] / sum : 0;
    wt[i] = a + b;
    off[i] = (k * a + (k + 1) * b) / (a + b);
  }
  return { off, wt };
}

/** Unit step response of a damped spring, as the remaining displacement (1 → 0, may overshoot < 0). */
function springResidual(t, zeta, omega) {
  if (t <= 0) return 1;
  if (zeta >= 1) return (1 + omega * t) * Math.exp(-omega * t);
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  return Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
}
const overshoot = (zeta) => (zeta >= 1 ? 0 : Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta)));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export async function createLandscape({ canvas, scene, imgs, tokens, mobile, dark = false, reading = false, onLost, onFirstFrame }) {
  // Upload from detached copies: three.js sizes a texture from an <img>'s *displayed* width, and the
  // layers are stretched to cover the screen, so past ~2048px wide it asked for more mip levels than
  // a 1536px image has and WebGL rejected every layer (a black scene on large displays). A detached
  // image reports its own size. Cached, so no second download.
  imgs = await Promise.all(imgs.map(async (img) => {
    const copy = new Image();
    copy.src = img.currentSrc || img.src;
    try { await copy.decode(); return copy; } catch { return img; }
  }));
  const { REF, READ_SCALE, FOCUS_RATE, ARRIVE } = tuning(tokens);
  // Decoded detached images: no second download
  await Promise.all(imgs.map((img) => (img.complete && img.naturalWidth ? null : img.decode())));
  if (imgs.some((img) => !img.naturalWidth)) throw new Error("layer images failed to load");

  let isMobile = mobile();
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };
  // The art is 1536px wide, so a drawing buffer past ~2x that adds no detail, and on large
  // high-DPI displays (2560pt+ at 2x) WebGL failed to allocate it and drew nothing (black).
  const MAX_BUFFER = 3072;
  const pixelRatio = (w, h) => Math.min(devicePixelRatio, isMobile ? 1.5 : 2, MAX_BUFFER / Math.max(w, h, 1));
  renderer.setPixelRatio(pixelRatio(canvas.clientWidth, canvas.clientHeight));
  renderer.setClearColor(new Color("#001a11"), 1);

  const artScene = new Scene();
  const group = new Group();
  artScene.add(group);
  const cam = new OrthographicCamera(-1, 1, 1, -1, -10, 10);
  const plane = new PlaneGeometry(1, 1);
  // the grade's strength (scene pages set one in-between grade); 1 = the full Dusk grade
  const duskStrength = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scene-dusk-strength")) || 1;
  const shared = {
    uTime: { value: 0 }, uDusk: { value: dark ? duskStrength : 0 }, uDuskInk: { value: DUSK },
    uMotion: { value: 0 }, uBright: { value: 1 }, uSat: { value: 1 },
  };

  const layers = scene.layers.map((l, i) => {
    const foreground = l.sprite?.foreground ? document.querySelector("[data-scene-guide-foreground]") : null;
    if (foreground) return {
      l, foreground, mesh: null, uFade: { value: 1 }, arrive: ARRIVE[0], spring: SPRING[SPRING.length - 1],
      size: [imgs[i].naturalWidth, imgs[i].naturalHeight], base: [0, 0], cap: [0, 0], drop: 0,
      x: 0, vx: 0, y: 0, vy: 0, out: [0, 0],
    };
    const tex = prepareLayerTexture(new Texture(imgs[i]));
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const uFade = { value: 0 };
    const mat = new ShaderMaterial({
      vertexShader: artVert, fragmentShader: artFrag,
      uniforms: { ...shared, uMap: { value: tex }, uFade, uShore: { value: l.shore ?? 0.75 } },
      defines: motionDefines(l.motion),
      transparent: true, premultipliedAlpha: true, depthTest: false, depthWrite: false,
    });
    const mesh = new Mesh(plane, mat);
    mesh.renderOrder = i;
    group.add(mesh);
    renderer.initTexture(tex);
    const arrive = ARRIVE[Math.min(i, ARRIVE.length - 1)];
    const spring = SPRING[l.slot ? PLANE_SPRING[l.slot] : Math.min(i, SPRING.length - 1)];
    return {
      l, mesh, uFade, arrive, spring, size: [imgs[i].naturalWidth, imgs[i].naturalHeight],
      base: [0, 0], cap: [0, 0], drop: 0,
      x: 0, vx: 0, y: 0, vy: 0, // depth spring state (screen px)
      out: [0, 0],
    };
  });
  // Any WebGL error while uploading the art would leave a black scene: bail out so the still stays.
  const uploadError = renderer.getContext().getError();
  if (uploadError) throw new Error(`WebGL error ${uploadError} while uploading the scene`);
  const hasMotion = layers.some((p) => p.l.motion);

  /* ---- passes: half-res scene → H blur → V blur → composite ---- */
  const rtOpts = { depthBuffer: false, minFilter: LinearFilter, magFilter: LinearFilter, generateMipmaps: false };
  const rtA = new WebGLRenderTarget(2, 2, rtOpts), rtB = new WebGLRenderTarget(2, 2, rtOpts);
  const passScene = new Scene();
  const quad = new Mesh(new PlaneGeometry(2, 2));
  quad.frustumCulled = false;
  passScene.add(quad);
  const blurMat = new ShaderMaterial({
    vertexShader: quadVert, fragmentShader: blurFrag, depthTest: false, depthWrite: false,
    uniforms: { tSrc: { value: null }, uStep: { value: [0, 0] }, uOff: { value: new Array(TAPS).fill(0) }, uW: { value: new Array(TAPS).fill(0) } },
  });
  const compMat = new ShaderMaterial({
    vertexShader: quadVert, fragmentShader: compFrag, depthTest: false, depthWrite: false,
    transparent: true, blending: NormalBlending, premultipliedAlpha: false,
    uniforms: { tSrc: { value: rtA.texture }, uMix: { value: 0 } },
  });
  let kernel = null; // per σ, rebuilt when the tier changes

  /* ---- layout: cover-fit + overscan, caps in screen px ---- */
  let H = 0, fit = null;
  const stillEl = canvas.previousElementSibling;
  const readStill = stillEl?.hasAttribute("data-read-still");
  const compositeStill = stillEl?.hasAttribute("data-composite-still") && !stillEl.hasAttribute("data-cut-fallback");
  const handoffValue = getComputedStyle(canvas).transitionDuration.split(",")[0].trim();
  const handoffSeconds = parseFloat(handoffValue) * (handoffValue.endsWith("ms") ? .001 : 1) || 0;
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return false;
    isMobile = mobile();
    H = h;
    renderer.setPixelRatio(pixelRatio(w, h));
    renderer.setSize(w, h, false);
    cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2;
    cam.updateProjectionMatrix();
    rtA.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
    rtB.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
    const ref = isMobile ? REF.mobile : REF.desktop;
    kernel = gaussian(ref.blur / 2); // σ in half-res texels
    blurMat.uniforms.uOff.value = kernel.off;
    blurMat.uniforms.uW.value = kernel.wt;

    const [iw, ih] = layers[0].size;
    const srcToWeb = iw / scene.grid[0];
    const dropScale = isMobile ? 0.5 : 1;
    for (const p of layers) p.drop = p.arrive.drop * h * dropScale;
    // overscan must hold the largest move at every edge: travel caps, micro-motion, and the arrival
    // (drop at the top edge for art touching it; overshoot above rest at the bottom edge)
    let s = Math.max(w / iw, h / ih), ox = 0, oy = 0;
    for (let it = 0; it < 4; it++) {
      const k = s * srcToWeb;
      ox = 0; oy = 0;
      for (const p of layers) {
        const motion = p.l.motion ? MOTION_MAX_UV[p.l.motion] * iw * s : 0;
        ox = Math.max(ox, p.l.cap[0] * k + motion);
        oy = Math.max(oy, p.l.cap[1] * k, p.drop * overshoot(p.arrive.zeta), p.l.touchesTop ? p.drop : 0);
      }
      ox += 2; oy += 2;
      s = Math.max((w + 2 * ox) / iw, (h + 2 * oy) / ih);
    }
    const k = s * srcToWeb;
    const boxW = w + 2 * ox, boxH = h + 2 * oy, Wd = iw * s, Hd = ih * s;
    for (const p of layers) {
      p.cap = [p.l.cap[0] * k, p.l.cap[1] * k];
      if (p.l.sprite) {
        const sprite = p.l.sprite;
        const height = Math.min(h * (isMobile ? sprite.mobileHeight : sprite.height), sprite.maxHeight);
        const width = height * p.size[0] / p.size[1];
        const [ax, ay] = isMobile ? sprite.mobileAnchor : sprite.anchor;
        p.base = [w * ax - w / 2, h / 2 - h * ay + height / 2];
        p.mesh?.scale.set(width, height, 1);
      } else {
        const [ax, ay] = isMobile ? p.l.mobileAnchor : p.l.anchor;
        p.base = [(Wd - boxW) * (0.5 - ax), -(Hd - boxH) * (0.5 - ay)];
        // object-fit: cover, including the flattened reading still's phone anchor.
        const domScale = Math.max(w / iw, h / ih);
        const domW = iw * domScale, domH = ih * domScale;
        const domAx = isMobile && readStill && scene.read ? scene.read.mobileX
          : isMobile && compositeStill ? scene.still.mobileX : ax;
        p.domBase = [(domW - w) * (.5 - domAx), -(domH - h) * (.5 - ay)];
        p.domSize = [domW, domH];
        if (isMobile && compositeStill && scene.still.mobile) {
          // Reconstruct the phone poster's registered source crops at ANY viewport ratio.
          // The first canvas frame therefore matches it even on a short or wide phone.
          const m = scene.still.mobile, scale = Math.max(w / m.width, h / m.height);
          const left = m.crops[p.l.name];
          p.domSize = [iw * scale, ih * scale];
          p.domBase = [((iw - m.width) / 2 - left) * scale, 0];
        }
        p.mesh?.scale.set(Wd, Hd, 1);
      }
    }
    fit = { w, h, scale: s, screenPerSourcePx: k, overscan: [ox, oy], art: [Wd, Hd] };
    return true;
  }

  /* ---- state ---- */
  // a reading page starts (and stays) fully focused: no focus transition on arrival
  const target = { reading: reading ? 1 : 0, scroll: 0 };
  let focus = target.reading, ambient = 0;
  let covered = false, restTimer = 0;
  // Reading keeps cursor depth; mobile scroll travel still settles while reading.
  const settledReading = () => target.reading === 1 && focus === 1;
  // The still already showed a complete landscape. Never replay its assembly on upgrade.
  // Keep the first canvas frame identical in crop/filter; acquire overscan only once visible.
  let arrivalT = 99, arrivalHeld = null, handoffT = 0, handoffMix = 0;
  const pointer = { x: 0, y: 0 };
  let lastInput = performance.now(), last = performance.now(), lastDraw = 0, time = 0, raf = 0, lost = false, running = false, frames = 0, handedOff = false;

  function update(dt, now) {
    // Hold DOM framing through the opacity fade, then smoothly acquire the existing GL look.
    if (handedOff) handoffT += dt;
    const progress = clamp((handoffT - handoffSeconds) / HANDOFF_SETTLE, 0, 1);
    handoffMix = progress * progress * (3 - 2 * progress);
    // attention
    focus += (target.reading - focus) * (1 - Math.exp(-dt * FOCUS_RATE));
    if (Math.abs(target.reading - focus) < 0.002) focus = target.reading;
    const wantAmbient = hasMotion && target.reading === 0 && now - lastInput < AMBIENT_IDLE ? 1 : 0;
    ambient += clamp(wantAmbient - ambient, -dt * 0.8, dt * 1.5);
    shared.uMotion.value = ambient * (1 - focus) * handoffMix;
    shared.uDusk.value = (dark ? duskStrength : 0) * handoffMix;
    shared.uTime.value = time;

    const ref = isMobile ? REF.mobile : REF.desktop;
    const domBright = .8 + (ref.bright - .8) * focus;
    const glBright = 1 + (ref.bright - 1) * focus;
    shared.uBright.value = domBright + (glBright - domBright) * handoffMix;
    shared.uSat.value = 1 + (ref.sat - 1) * focus;
    group.scale.setScalar(1 + READ_SCALE * focus);

    // arrival clock (seekable for review)
    if (arrivalHeld === null) arrivalT += dt;
    const at = arrivalHeld ?? arrivalT;

    const travel = 1 - focus; // mobile scroll travel only
    let moving = false;
    for (const p of layers) {
      // depth targets: pointer (desktop) or scroll (mobile); pointer right → near layers slide left
      let tx = 0, ty = 0;
      if (isMobile) ty = target.scroll * p.cap[1] * travel;
      else { tx = -pointer.x * p.cap[0] * POINTER_TRAVEL; ty = -pointer.y * p.cap[1] * POINTER_TRAVEL; }
      // damped spring (semi-implicit Euler, fixed substeps)
      const { zeta, omega } = p.spring;
      for (let n = Math.max(1, Math.ceil(dt * 240)), h = dt / n, i = 0; i < n; i++) {
        p.vx += (-omega * omega * (p.x - tx) - 2 * zeta * omega * p.vx) * h; p.x += p.vx * h;
        p.vy += (-omega * omega * (p.y - ty) - 2 * zeta * omega * p.vy) * h; p.y += p.vy * h;
      }
      if (Math.abs(p.x - tx) + Math.abs(p.y - ty) + Math.abs(p.vx) + Math.abs(p.vy) < 0.01) { p.x = tx; p.y = ty; p.vx = p.vy = 0; }
      else moving = true;
      // never past the tested travel, even on a spring's overshoot
      const drift = readingDrift(now,p.cap);
      const ox = clamp(p.x + drift.x * focus, -p.cap[0], p.cap[0]);
      const oy = clamp(p.y + drift.y * focus, -p.cap[1], p.cap[1]);
      // arrival
      const t = at - p.arrive.start;
      const fade = clamp(t / p.arrive.fade, 0, 1);
      const res = springResidual(t, p.arrive.zeta, p.arrive.omega);
      const drop = p.drop * (Math.abs(res) < 0.0005 && t > 0 ? 0 : res);
      p.uFade.value = fade * fade * (3 - 2 * fade) * (p.l.sprite ? 1 - focus : 1);
      p.out = [ox * handoffMix, oy * handoffMix - drop];
      if (p.foreground) {
        p.foreground.style.setProperty("--guide-shift-x", `${ox}px`);
        p.foreground.style.setProperty("--guide-shift-y", `${-oy}px`);
      }
      if (p.mesh) {
        const base = p.domBase ?? p.base;
        if (p.domSize) p.mesh.scale.set(
          p.domSize[0] + (fit.art[0] - p.domSize[0]) * handoffMix,
          p.domSize[1] + (fit.art[1] - p.domSize[1]) * handoffMix, 1);
        p.mesh.position.set(
          base[0] + (p.base[0] - base[0]) * handoffMix + p.out[0],
          base[1] + (p.base[1] - base[1]) * handoffMix + p.out[1], 0);
      }
    }
    const arriving = layers.some((p) => at - p.arrive.start < 2.2);
    const transitioning = focus !== target.reading;
    const reading = readingDrift(now,[0,0]);
    const ambientOn = (ambient > 0.001 && focus < 1) || (focus > 0 && reading.active);
    if (focus > 0 && !reading.active && !restTimer && !covered) restTimer = setTimeout(() => { restTimer=0; request(); },reading.rest);
    return { busy: handoffMix < 1 || moving || (arriving && arrivalHeld === null) || transitioning || ambient !== wantAmbient, ambientOn };
  }

  function draw() {
    const mix = Math.min(1, focus * 2.5);
    if (mix < 0.001) {
      renderer.setRenderTarget(null);
      renderer.render(artScene, cam);
      return;
    }
    // blurred copy: scene at half res, H then V Gaussian (σ grows with focus)
    renderer.setRenderTarget(rtA);
    renderer.render(artScene, cam);
    quad.material = blurMat;
    blurMat.uniforms.tSrc.value = rtA.texture;
    blurMat.uniforms.uStep.value = [focus / rtA.width, 0];
    renderer.setRenderTarget(rtB);
    renderer.render(passScene, cam);
    blurMat.uniforms.tSrc.value = rtB.texture;
    blurMat.uniforms.uStep.value = [0, focus / rtA.height];
    renderer.setRenderTarget(rtA);
    renderer.render(passScene, cam);
    renderer.setRenderTarget(null);
    if (mix < 0.999) renderer.render(artScene, cam); // sharp under the cross-fade
    renderer.autoClear = false;
    quad.material = compMat;
    compMat.uniforms.uMix.value = mix >= 0.999 ? 1 : mix;
    renderer.render(passScene, cam);
    renderer.autoClear = true;
  }

  function checkedDraw() {
    if (renderer.getContext().isContextLost()) throw new Error('Scene WebGL context unavailable');
    draw();
    if (shaderFailed || renderer.getContext().isContextLost()) throw new Error('Scene render failed');
  }

  function frame(now) {
    raf = 0;
    if (lost || !running) return;
    // A RAF timestamp can precede start() after synchronous texture/shader work.
    const dt = clamp((now - last) / 1000, 0, 1 / 20);
    const st = update(dt, now);
    // ambient-only frames are capped at 30 fps
    if (!st.busy && st.ambientOn && now - lastDraw < 1000 / AMBIENT_FPS - 2) { request(); return; }
    last = now;
    time += dt;
    lastDraw = now;
    try { checkedDraw(); }
    catch (error) {
      console.warn('[scene] keeping the still after a render failure', error);
      lost = true; running = false; clearTimeout(restTimer); onLost?.(); return;
    }
    frames++;
    // Only a complete landscape earns the handoff, never the sky alone.
    if (!handedOff && layers.every((p) => p.l.sprite || p.uFade.value >= .99)) { handedOff = true; onFirstFrame?.(); }
    if (st.busy || st.ambientOn) request();
  }
  function request() { if (!raf && running && !lost && (!covered || !handedOff) && !document.hidden) raf = requestAnimationFrame(frame); }
  const wake = () => { lastInput = performance.now(); request(); };

  /* ---- input ---- */
  const fine = matchMedia("(pointer: fine)");
  addEventListener("pointermove", (e) => {
    if (!fine.matches || isMobile || e.pointerType === "touch") return;
    pointer.x = clamp((e.clientX / innerWidth) * 2 - 1, -1, 1);
    pointer.y = clamp(-(((e.clientY - canvas.getBoundingClientRect().top) / H) * 2 - 1), -1, 1);
    wake();
  }, { passive: true });
  // pointer leaves the window → spring back to rest
  document.documentElement.addEventListener("pointerleave", () => { pointer.x = 0; pointer.y = 0; wake(); });
  addEventListener("blur", () => { pointer.x = 0; pointer.y = 0; wake(); });
  addEventListener("resize", () => { if (layout()) wake(); });
  new ResizeObserver(() => { if (layout()) wake(); }).observe(canvas);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { last = performance.now(); wake(); } });
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); onLost?.(); });

  layout();
  last = performance.now();
  update(0, last);
  checkedDraw(); // validate initialization; the still stays until the sky is visible

  return {
    start() { running = true; last = performance.now(); wake(); },
    setState({ reading }) { target.reading = reading ? 1 : 0; wake(); },
    setCovered(on) { covered=on; clearTimeout(restTimer);restTimer=0;if (on) {cancelAnimationFrame(raf);raf=0;} else request(); },
    setScroll(p) { if (Math.abs(p - target.scroll) > 1e-4) { target.scroll = p; if (isMobile && !settledReading()) wake(); } },
    setDark(d) { dark = d; wake(); },
    stop() { running = false; lost = true; cancelAnimationFrame(raf); clearTimeout(restTimer); },
    /** Review hooks: hold the arrival at t seconds (null resumes), and report plane offsets. */
    seekArrival(t) { arrivalHeld = t; wake(); },
    /** The still has been on screen: arrive already settled (no assembly from a full picture). */
    skipArrival() { if (frames === 0) arrivalT = 99; },
    info: () => ({
      fit, focus, ambient, handoffMix, covered, mobile: isMobile, frames, calls: renderer.info.render.calls,
      planes: layers.map((p) => ({
        name: p.l.name, surface: p.foreground ? "foreground" : "canvas", depth: p.l.depth, capSourcePx: p.l.cap, capSource: p.l.capSource,
        capScreenPx: p.cap.map((v) => +v.toFixed(2)), offset: p.out.map((v) => +v.toFixed(2)),
        fade: +p.uFade.value.toFixed(3),
      })),
    }),
  };
}
