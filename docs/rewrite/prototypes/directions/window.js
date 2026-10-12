/*
 * Direction 5: THE WINDOW. three.js renderer for the view through Cello's desk window.
 *
 * Only the glass is a WebGL canvas (the room around it is HTML/SVG), so the GPU draws a small
 * area. Each place is the kit data turned into flat meshes on depth layers:
 * - Depth: layers sit at real distances. A perspective camera that shifts slightly with the
 *   pointer gives true parallax (near firs move more than Mt Hood). Each layer is pre-scaled so
 *   that at rest it lines up exactly with the SVG still.
 * - Micro-motion, cheap: falling water and lake shimmer are tiny shaders; clouds, chairlift chairs
 *   and fireweed move on the CPU (a handful of objects). Capped at 30 fps; stops in hidden tabs.
 * - Static items with the same depth and color are merged into one geometry: a place is ~15–30
 *   draw calls.
 * - Places with generated art (`place.layers`, see scenes/places.js) are drawn as textured planes
 *   instead: one plane per layer in its own scene with a pixel camera, each shifted with the
 *   pointer by its depth, all overscanned so no edge shows. The kit shapes draw until the textures
 *   arrive (then the art fades in), and stay if they fail.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Group, Mesh, Shape, ShapeGeometry,
  PlaneGeometry, MeshBasicMaterial, ShaderMaterial, Color, SRGBColorSpace, Vector2, TextureLoader,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { itemsFor, paletteFor } from "../scenes/svg.js";

const FOV = 30;
const HALF_H = 525;              // scene units visible above/below the camera axis (matches the SVG viewBox)
const AXIS_Y = 485;             // center of the visible band (-40…1010), same as the SVG viewBox
const D = HALF_H / Math.tan((FOV / 2) * Math.PI / 180);
const DEPTH_Z = 1800;            // depth 1 sits this far behind depth 0

const fallsFrag = /* glsl */ `
  uniform vec3 uColor, uLight; uniform float uTime; varying vec2 vPos;
  float h(float n){ return fract(sin(n) * 43758.5453); }
  void main() {
    float col = floor(vPos.x / 7.0);
    float s = fract(vPos.y / 38.0 + uTime * (0.9 + h(col) * 0.6) + h(col * 3.1));
    vec3 c = mix(uLight, uColor, step(0.72, s) * 0.55);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }`;
const waterFrag = /* glsl */ `
  uniform vec3 uColor, uLight; uniform float uTime; varying vec2 vPos;
  float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 cell = floor(vec2(vPos.x / 46.0 + uTime * 0.35, vPos.y / 9.0));
    float on = step(0.93, h(cell)) * step(0.35, fract(vPos.x / 46.0 + uTime * 0.35));
    gl_FragColor = vec4(mix(uColor, uLight, on * 0.8), 1.0);
    #include <colorspace_fragment>
  }`;
const posVert = /* glsl */ `
  varying vec2 vPos;
  void main() { vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/* ---------- generated art layers ---------- */
const SHIFT = 0.028;      // pointer parallax at depth 0, as a fraction of the window width (each side)
const SHIFT_Y = 0.5;      // vertical parallax relative to horizontal (the kit camera uses 16/34)
const MOTION_PAD = 0.006; // extra overscan for the shader micro-motion, fraction of the window width
const ART_FADE = 0.6;     // s, art fading in over the kit shapes once its textures arrive
const DUSK = new Color("#001a11"); // I3: Dusk = color-mix(in oklab, ink 40%, #001a11), snow 55%

const artVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// Textures arrive premultiplied, sRGB-encoded (see loadArt): filtering never pulls in the color of
// fully transparent texels, so keyed edges get no dark fringe. The shader un-premultiplies, decodes
// to linear, grades, and premultiplies again after the output encode (blending is ONE, 1 − srcα).
const artFrag = /* glsl */ `
  uniform sampler2D uMap; uniform float uTime, uFade, uDusk, uShore; uniform vec3 uDuskInk;
  varying vec2 vUv;
  vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
  vec3 toOklab(vec3 c) {
    vec3 lms = vec3(
      0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b,
      0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b,
      0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b);
    lms = pow(max(lms, 0.0), vec3(1.0 / 3.0));
    return vec3(
      0.2104542553 * lms.x + 0.7936177850 * lms.y - 0.0040720468 * lms.z,
      1.9779984951 * lms.x - 2.4285922050 * lms.y + 0.4505937099 * lms.z,
      0.0259040371 * lms.x + 0.7827717662 * lms.y - 0.8086757660 * lms.z);
  }
  vec3 fromOklab(vec3 c) {
    vec3 lms = vec3(
      c.x + 0.3963377774 * c.y + 0.2158037573 * c.z,
      c.x - 0.1055613458 * c.y - 0.0638541728 * c.z,
      c.x - 0.0894841775 * c.y - 1.2914855480 * c.z);
    lms = lms * lms * lms;
    return vec3(
       4.0767416621 * lms.x - 3.3077115913 * lms.y + 0.2309699292 * lms.z,
      -1.2684380046 * lms.x + 2.6097574011 * lms.y - 0.3413193965 * lms.z,
      -0.0041960863 * lms.x - 0.7034186147 * lms.y + 1.7076147010 * lms.z);
  }
  void main() {
    vec2 uv = vUv;
    float y = 1.0 - uv.y; // 0 = top of the art
    #ifdef MOTION_DRIFT
      // clouds: a very slow sideways drift and a faint breathe (periods ~2 min and ~1 min)
      uv.x += sin(uTime * 0.052) * 0.004;
      uv = (uv - 0.5) * (1.0 - 0.0025 * (0.5 + 0.5 * sin(uTime * 0.11))) + 0.5;
    #endif
    #ifdef MOTION_SHIMMER
      // lake: thin horizontal wobble that varies with y, only below the shoreline, larger nearer
      float lake = smoothstep(uShore, uShore + 0.03, y);
      float amp = mix(0.6, 1.4, clamp((y - uShore) / (1.0 - uShore), 0.0, 1.0));
      uv.x += lake * amp * (sin(y * 420.0 + uTime * 1.7) * 0.0011 + sin(y * 137.0 - uTime * 0.8) * 0.0007);
    #endif
    #ifdef MOTION_SWAY
      // fireweed: bases (bottom edge) fixed, tops sway most; slow gusts, stalks out of phase
      float k = clamp((1.0 - y) / 0.8, 0.0, 1.0); k *= k;
      float gust = 0.6 + 0.4 * sin(uTime * 0.31);
      uv.x += k * gust * (sin(uTime * 1.05 + uv.x * 7.0) * 0.0034 + sin(uTime * 1.9 + uv.x * 15.0) * 0.0008);
    #endif
    vec4 t = texture2D(uMap, uv);
    if (t.a < 0.002) discard;
    vec3 c = toLinear(t.rgb / t.a);
    if (uDusk > 0.0) {
      vec3 lab = toOklab(c);
      float ink = mix(0.4, 0.55, smoothstep(0.82, 0.95, lab.x)); // snow and highlights keep more
      c = fromOklab(mix(lab, toOklab(uDuskInk), (1.0 - ink) * uDusk));
    }
    gl_FragColor = vec4(c, t.a * uFade);
    #include <colorspace_fragment>
    gl_FragColor.rgb *= gl_FragColor.a;
  }`;

export async function createWindowRenderer(canvas) {
  const mobile = matchMedia("(pointer: coarse)").matches || innerWidth <= 700;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 10, 6000);
  camera.position.set(0, AXIS_Y, D);

  const built = new Map(); // place id + theme → { group, animated, uniforms }
  let current = null, dark = false, time = 0, last = performance.now(), raf = 0, lost = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  // Art layers: their own scene, camera in window pixels (y up, origin at the window center).
  const artScene = new Scene();
  const artCam = new OrthographicCamera(-1, 1, 1, -1, -10, 10);
  const art = new Map(); // place id → { state: "loading" | "ready" | "failed", group, planes, uniforms, fade }
  const loader = new TextureLoader();
  const plane = new PlaneGeometry(1, 1);
  let artCurrent = null; // the shown place's art entry (any state)

  function loadArt(place) {
    if (!place.layers?.length) return null;
    if (art.has(place.id)) return art.get(place.id);
    const uniforms = { uTime: { value: 0 }, uFade: { value: 0 }, uDusk: { value: 0 }, uDuskInk: { value: DUSK } };
    const entry = { place, state: "loading", group: new Group(), planes: [], uniforms, fade: 0 };
    art.set(place.id, entry);
    Promise.all(place.layers.map((l) => loader.loadAsync(l.src))).then((texs) => {
      if (lost) return;
      texs.forEach((tex, i) => {
        const l = place.layers[i];
        // Tagged sRGB (no unpack conversion) but stored as plain RGBA8 and premultiplied on
        // upload, so filtering and mipmaps work on premultiplied sRGB bytes, the way a browser
        // composites a PNG; the shader decodes (sRGB8_ALPHA8 would decode before premultiplying
        // is undone, darkening anti-aliased edges).
        tex.colorSpace = SRGBColorSpace;
        tex.internalFormat = "RGBA8";
        tex.premultiplyAlpha = true;
        tex.needsUpdate = true;
        const mat = new ShaderMaterial({
          vertexShader: artVert, fragmentShader: artFrag,
          uniforms: { ...uniforms, uMap: { value: tex }, uShore: { value: l.shore ?? 0.75 } },
          defines: l.motion ? { [`MOTION_${l.motion.toUpperCase()}`]: "" } : {},
          transparent: true, premultipliedAlpha: true, depthTest: false, depthWrite: false,
        });
        const mesh = new Mesh(plane, mat);
        mesh.renderOrder = i; // back → front, as listed
        entry.group.add(mesh);
        entry.planes.push({ mesh, l, size: [tex.image.width, tex.image.height], base: [0, 0], amp: [0, 0] });
        renderer.initTexture(tex); // upload now, not on the first frame that shows it
      });
      entry.state = "ready";
      layoutArt(entry);
      if (artCurrent === entry) { showArt(entry, 0); request(); }
    }).catch((err) => {
      entry.state = "failed";
      console.warn(`[window] art layers for ${place.id} failed to load; keeping the kit shapes`, err);
    });
    return entry;
  }

  /** Cover-fit the art into the window plus overscan, and set each plane's parallax amplitude. */
  function layoutArt(entry) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || entry.state !== "ready") return;
    const [ax, ay] = entry.place.layersAnchor ?? [0.5, 0.5];
    const [iw, ih] = entry.planes[0].size;
    let mx = 0, my = 0;
    for (const p of entry.planes) {
      const sx = SHIFT * (1 - p.l.depth) * w;
      p.amp = [sx, sx * SHIFT_Y];
      mx = Math.max(mx, p.amp[0]); my = Math.max(my, p.amp[1]);
    }
    const pad = MOTION_PAD * w;
    const boxW = w + 2 * (mx + pad), boxH = h + 2 * (my + pad);
    const s = Math.max(boxW / iw, boxH / ih); // one scale for all layers, so they stay aligned
    const W = iw * s, H = ih * s;
    // object-position: the anchor point of the art lands on the same point of the box
    const cx = (W - boxW) * (0.5 - ax), cy = -(H - boxH) * (0.5 - ay);
    for (const p of entry.planes) {
      p.mesh.scale.set(W, H, 1);
      p.base = [cx, cy];
    }
    entry.fit = { w, h, W, H, overscan: [mx + pad, my + pad] };
  }

  function showArt(entry, fade) {
    entry.fade = fade;
    entry.uniforms.uFade.value = fade;
    if (entry.group.parent !== artScene) { artScene.clear(); artScene.add(entry.group); }
  }

  function updateArt(dt) {
    const entry = artCurrent;
    if (!entry || entry.state !== "ready") return false;
    if (entry.fade < 1) entry.uniforms.uFade.value = entry.fade = Math.min(1, entry.fade + dt / ART_FADE);
    entry.uniforms.uTime.value = time;
    entry.uniforms.uDusk.value = dark ? 1 : 0;
    for (const p of entry.planes) {
      // pointer right → the eye moves right → nearer layers slide left (same sense as the kit camera)
      p.mesh.position.set(p.base[0] - pointer.x * p.amp[0], p.base[1] - pointer.y * p.amp[1], 0);
    }
    return true;
  }

  function draw(dt = 0) {
    const artOn = updateArt(dt);
    // Kit shapes under the art until it has fully faded in (or always, when there is no art).
    if (!artOn || artCurrent.fade < 1) renderer.render(scene, camera);
    else renderer.clear();
    if (artOn) {
      renderer.autoClear = false;
      renderer.render(artScene, artCam);
      renderer.autoClear = true;
    }
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    artCam.left = -w / 2; artCam.right = w / 2; artCam.top = h / 2; artCam.bottom = -h / 2;
    artCam.updateProjectionMatrix();
    for (const entry of art.values()) layoutArt(entry);
    const aspect = w / h;
    camera.aspect = aspect;
    // Fit the full scene height; if the window is wider than the art, fit the width instead.
    const maxAspect = 2200 / (HALF_H * 2);
    camera.fov = aspect > maxAspect ? (2 * Math.atan((1100 / aspect) / D) * 180) / Math.PI : FOV;
    camera.updateProjectionMatrix();
  }

  function build(place) {
    const key = place.id + (dark ? ":n" : ":d");
    if (built.has(key)) return built.get(key);
    const pal = paletteFor(place, dark);
    const group = new Group();
    const animated = [];
    const uniforms = { uTime: { value: 0 } };
    const color = (role) => new Color(pal[role] || "#ff00ff");
    const geoOf = (pts) => new ShapeGeometry(new Shape(pts.map(([x, y]) => new Vector2(x, y))));

    // Bucket static items by depth + role so each bucket is one draw call.
    const buckets = new Map();
    let order = 0;
    for (const it of itemsFor(place)) {
      const z = -it.depth * DEPTH_Z;
      const s = (D - z) / D;                 // pre-scale so the layer matches the still at rest
      const layer = (mesh) => {
        mesh.position.set(0, AXIS_Y - AXIS_Y * s, z);
        mesh.scale.set(s, s, 1);
        mesh.renderOrder = order++;
        group.add(mesh);
        return mesh;
      };
      const type = it.type || "flat";
      if (type === "flat") {
        const k = `${it.depth}|${it.role}`;
        if (!buckets.has(k)) buckets.set(k, { geos: [], it, layer });
        buckets.get(k).geos.push(geoOf(it.pts));
        continue;
      }
      // flush pending buckets first so draw order stays back-to-front
      flush();
      if (type === "falls" || type === "water") {
        const mat = new ShaderMaterial({
          vertexShader: posVert, fragmentShader: type === "falls" ? fallsFrag : waterFrag,
          uniforms: { uColor: { value: color(type === "falls" ? "water" : it.role) }, uLight: { value: color(type === "falls" ? it.role : "waterLight") }, uTime: uniforms.uTime },
          depthTest: false, depthWrite: false,
        });
        layer(new Mesh(geoOf(it.pts), mat));
      } else {
        const mesh = layer(new Mesh(geoOf(type === "chair" ? it.pts : it.pts), new MeshBasicMaterial({ color: color(it.role), depthTest: false, depthWrite: false })));
        animated.push({ mesh, it, base: mesh.position.clone() });
      }
    }
    flush();

    function flush() {
      for (const { geos, it, layer } of buckets.values()) {
        const mat = new MeshBasicMaterial({ color: color(it.role), depthTest: false, depthWrite: false, transparent: it.role === "mist", opacity: it.role === "mist" ? 0.85 : 1 });
        layer(new Mesh(geos.length > 1 ? mergeGeometries(geos) : geos[0], mat));
      }
      buckets.clear();
    }

    const entry = { group, animated, uniforms };
    built.set(key, entry);
    return entry;
  }

  function animate(entry, t) {
    entry.uniforms.uTime.value = t;
    for (const a of entry.animated) {
      const { mesh, it, base } = a;
      if (it.type === "cloud") mesh.position.x = base.x + Math.sin(t * 0.05 * (it.anim?.drift ?? 5)) * 60;
      else if (it.type === "chair") {
        const { a: A, b: B, phase, speed } = it.anim;
        const u = (phase + t * speed) % 1;
        const s = mesh.scale.x;
        mesh.position.x = base.x + (A[0] + (B[0] - A[0]) * u) * s;
        mesh.position.y = base.y + (A[1] + (B[1] - A[1]) * u) * s;
      } else if (it.type === "sway") {
        const [bx, by] = it.anim.base;
        const ang = Math.sin(t * 1.3 + bx * 0.01) * 0.025;
        mesh.rotation.z = ang;
        // rotate around the stem base, not the origin
        const s = mesh.scale.x, c = Math.cos(ang), sn = Math.sin(ang);
        mesh.position.x = base.x + (bx * s - (bx * s * c - by * s * sn));
        mesh.position.y = base.y + (by * s - (bx * s * sn + by * s * c));
      }
    }
  }

  function frame(now) {
    raf = 0;
    if (lost) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    if (dt < 1 / 31) { request(); return; } // ambient motion capped at ~30 fps
    last = now;
    time += dt;
    const k = Math.min(1, dt * 4);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    camera.position.x = pointer.x * 34;
    camera.position.y = AXIS_Y + pointer.y * 16;
    // (the kit's CPU motion is skipped once the art covers it)
    if (current && !(artCurrent?.state === "ready" && artCurrent.fade >= 1)) animate(current, time);
    draw(dt);
    request();
  }
  function request() { if (!raf && !document.hidden && !lost) raf = requestAnimationFrame(frame); }

  addEventListener("resize", resize);
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener("visibilitychange", () => { last = performance.now(); request(); });
  if (matchMedia("(pointer: fine)").matches) {
    addEventListener("pointermove", (e) => { pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true });
  }
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); lost = true; canvas.dispatchEvent(new CustomEvent("gl-lost", { bubbles: true })); });

  resize();
  let placeRef = null;
  return {
    show(place, isDark) {
      dark = isDark;
      placeRef = place;
      if (current) scene.remove(current.group);
      current = build(place);
      scene.add(current.group);
      // Art already loaded swaps in at once (the blind covers it); otherwise the kit shows and the
      // art fades in when its textures arrive. Places without layers: artCurrent = null, kit only.
      artCurrent = loadArt(place);
      if (artCurrent?.state === "ready") showArt(artCurrent, 1);
      else artScene.clear();
      draw();
      request();
    },
    setDark(isDark) { if (placeRef) this.show(placeRef, isDark); },
    stop() { lost = true; cancelAnimationFrame(raf); },
    info: () => renderer.info.render,
    art: () => artCurrent && { state: artCurrent.state, fade: artCurrent.fade, fit: artCurrent.fit,
      planes: artCurrent.planes.map((p) => ({ name: p.l.name, x: p.mesh.position.x, y: p.mesh.position.y, amp: p.amp })) },
  };
}
