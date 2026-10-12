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
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, ShapeGeometry, MeshBasicMaterial,
  ShaderMaterial, Color, SRGBColorSpace, Vector2,
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

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
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
    if (current) animate(current, time);
    renderer.render(scene, camera);
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
      renderer.render(scene, camera);
      request();
    },
    setDark(isDark) { if (placeRef) this.show(placeRef, isDark); },
    stop() { lost = true; cancelAnimationFrame(raf); },
    info: () => renderer.info.render,
  };
}
