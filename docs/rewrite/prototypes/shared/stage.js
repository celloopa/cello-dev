/*
 * The 3D stage, shared by all three directions.
 *
 * What it does and why:
 * - The page layout is the DOM. Every 3D object is pinned to a real element ("tracking"), so
 *   the 3D layer reflows with the page on any screen size, and text never collides with it.
 * - The camera is set so that 1 world unit = 1 CSS pixel at z = 0. A plane at z = 0 covers its
 *   element exactly; pushing it back (negative z) or forward is what makes depth.
 * - It renders only when something changes (scroll, pointer, resize, theme, an animation in
 *   progress). An idle page costs no GPU time. It stops in hidden tabs.
 * - Mobile gets fewer pixels (DPR ≤ 1.5, no MSAA) and no pointer drift.
 * - If the GPU context is lost, the DOM version fades back in.
 */
import { WebGLRenderer, Scene, PerspectiveCamera, Color, SRGBColorSpace, Texture, MathUtils } from "three";

const DIST = 1000; // camera distance; with the fov below, 1 unit = 1 CSS px at z = 0
const root = document.documentElement;

export const ease = {
  // The house curve, cubic-bezier(0.16, 1, 0.3, 1), approximated for per-frame use.
  out: (t) => 1 - Math.pow(1 - MathUtils.clamp(t, 0, 1), 4.2),
  inOut: (t) => { t = MathUtils.clamp(t, 0, 1); return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2; },
};
export const clamp01 = (t) => MathUtils.clamp(t, 0, 1);
export const range = (t, a, b) => clamp01((t - a) / (b - a));

class Stage {
  constructor() {
    this.isMobile = matchMedia("(pointer: coarse)").matches || innerWidth <= 700;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "stage";
    this.canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(this.canvas);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(45, 1, 1, 6000);
    this.camera.position.z = DIST;

    this.tracked = [];
    this.time = 0;
    this.scrollY = scrollY;
    this.velocity = 0; // px per second, smoothed
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.lastInput = performance.now();
    this.raf = 0;
    this.last = performance.now();
    this.stats = new URLSearchParams(location.search).has("stats") ? makeStats() : null;

    this.resize();
    this.readTheme();
    this.bind();
  }

  /* ---------- tracking: pin 3D objects to DOM elements ---------- */
  track(el) {
    const rec = { el, left: 0, top: 0, w: 0, h: 0 };
    this.tracked.push(rec);
    this.measure(rec);
    return rec;
  }
  measure(rec) {
    const r = rec.el.getBoundingClientRect();
    rec.left = r.left;
    rec.top = r.top + scrollY; // document-relative, so scrolling needs no re-measure
    rec.w = r.width;
    rec.h = r.height;
  }
  measureAll() { for (const r of this.tracked) this.measure(r); }

  /** Where a tracked element sits right now, in world units, plus scroll progress. */
  place(rec) {
    const top = rec.top - this.scrollY;
    return {
      x: rec.left + rec.w / 2 - this.width / 2,
      y: -(top + rec.h / 2 - this.height / 2),
      w: rec.w,
      h: rec.h,
      // 0 = top edge just entering at the bottom of the screen, 1 = bottom edge just left the top
      progress: (this.height - top) / (this.height + rec.h),
      // -1 = centered at the bottom edge, 0 = centered on screen, 1 = centered at the top edge
      centered: (this.height / 2 - (top + rec.h / 2)) / (this.height / 2),
    };
  }

  /* ---------- theme: read the CSS roles so 3D and DOM always match ---------- */
  readTheme() {
    const cs = getComputedStyle(root);
    const get = (n) => new Color(cs.getPropertyValue(n).trim() || "#ff00ff");
    this.dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    this.colors = {
      canvas: get("--bg-canvas"),
      text: get("--text-primary"),
      action: get("--action-primary"),
      ground: get("--accent-ground"),
      construction: get("--accent-construction"),
      markC: get("--mark-c"),
      markSun: get("--mark-sun"),
      markTriangle: get("--mark-triangle"),
      ink: get("--ink-950"),
      paper: get("--paper-100"),
      starlight: get("--paper-200"),
      signal: get("--signal-500"),
      earth: get("--earth-500"),
      earthLight: get("--earth-400"),
    };
  }

  /* ---------- size ---------- */
  resize() {
    const w = root.clientWidth;
    const h = innerHeight;
    // On phones the URL bar resizes the viewport while scrolling; ignore small height-only changes.
    if (this.width === w && this.height && Math.abs(this.height - h) < 140 && this.isMobile) return false;
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.fov = MathUtils.radToDeg(2 * Math.atan(h / 2 / DIST));
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.measureAll();
    this.direction?.resize?.(w, h);
    return true;
  }

  /* ---------- events: anything that changes the picture wakes the loop ---------- */
  bind() {
    const wake = () => { this.lastInput = performance.now(); this.request(); };
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", () => { if (this.resize()) wake(); });
    new ResizeObserver(() => { this.measureAll(); wake(); }).observe(document.body);
    document.fonts?.addEventListener?.("loadingdone", () => { this.measureAll(); wake(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { this.last = performance.now(); wake(); } });

    if (matchMedia("(pointer: fine)").matches) {
      addEventListener("pointermove", (e) => {
        this.pointer.tx = (e.clientX / this.width) * 2 - 1;
        this.pointer.ty = -((e.clientY / this.height) * 2 - 1);
        wake();
      }, { passive: true });
    }

    const onTheme = () => { this.readTheme(); this.direction?.setTheme?.(this.colors, this.dark); wake(); };
    new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onTheme);

    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      cancelAnimationFrame(this.raf);
      this.lost = true;
      root.classList.remove("gl-on");
    });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
      if (e.matches) { cancelAnimationFrame(this.raf); this.lost = true; }
    });
  }

  request() {
    if (this.direction && !this.raf && !document.hidden && !this.lost) this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  tick(now) {
    this.raf = 0;
    const dt = Math.min((now - this.last) / 1000, 1 / 20);
    this.last = now;
    this.time += dt;

    const y = scrollY;
    const v = (y - this.scrollY) / Math.max(dt, 1 / 240);
    this.velocity += (v - this.velocity) * Math.min(1, dt * 8);
    this.scrollY = y;

    const p = this.pointer;
    const k = Math.min(1, dt * 4);
    p.x += (p.tx - p.x) * k;
    p.y += (p.ty - p.y) * k;

    const t0 = performance.now();
    const busy = this.direction.update(dt, this);
    if (this.direction.render) this.direction.render(this);
    else this.renderer.render(this.scene, this.camera);
    this.stats?.(this, performance.now() - t0);

    // Keep going while an animation runs, input is recent, or values are still settling.
    const settling = now - this.lastInput < 900 || Math.abs(this.velocity) > 2 ||
      Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.001;
    if (busy || settling) this.request();
  }
}

/** A texture from an <img> already on the page (no second download). */
export async function textureFromImage(img, renderer) {
  img.loading = "eager";
  if (!img.complete || !img.naturalWidth) await img.decode().catch(() => {});
  const tex = new Texture(img);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  tex.needsUpdate = true;
  tex.userData.aspect = img.naturalWidth / img.naturalHeight || 1;
  return tex;
}

function makeStats() {
  const el = document.createElement("div");
  el.className = "stats";
  document.body.append(el);
  let frames = 0, acc = 0, cpu = 0, lastShow = performance.now();
  return (stage, ms) => {
    frames++; cpu += ms;
    const now = performance.now();
    acc = now - lastShow;
    if (acc > 500) {
      const info = stage.renderer.info.render;
      el.textContent =
        `fps(rendering) ${Math.round((frames * 1000) / acc)}\n` +
        `cpu/frame ${(cpu / frames).toFixed(2)} ms\n` +
        `calls ${info.calls}  tris ${info.triangles}\n` +
        `dpr ${stage.renderer.getPixelRatio()}  ${stage.isMobile ? "mobile tier" : "desktop tier"}`;
      frames = 0; cpu = 0; lastShow = now;
    }
  };
}

export async function start(direction) {
  const loaders = {
    tokens: () => import("../directions/tokens.js"),
    paper: () => import("../directions/paper.js"),
    construction: () => import("../directions/construction.js"),
    print: () => import("../directions/print.js"),
  };
  const [mod] = await Promise.all([loaders[direction](), document.fonts?.ready]);
  const stage = new Stage();
  stage.direction = await mod.default(stage);
  stage.measureAll();
  // First frame drawn while the canvas is still invisible, then cross-fade (CSS, house curve).
  stage.tick(performance.now());
  requestAnimationFrame(() => root.classList.add("gl-on"));
  window.__stage = stage; // for measurement from devtools
  return stage;
}
