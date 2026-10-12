/*
 * Direction "landscape": the scene fills the page under the dark bar and the content lives in
 * front of it. This module is the DOM half (loaded right after first paint, no three.js):
 *
 * - The scene's cut layers as a stacked-<img> still. It IS the page when there's no WebGL, under
 *   reduced motion, with ?gl=0, or if textures fail; otherwise the WebGL renderer
 *   (directions/landscape.js) draws the same <img>s (no second download) and the still stays hidden.
 * - Attention states, all reversible:
 *     arrival  the intro copy over the scene, readable at once (nothing waits for the assembly)
 *     admire   "Take in the view" hides the intro; "Back to Cello" (or Esc) returns
 *     reading  once the first case study reaches the reading line, the scene softens, dims and
 *              quiets; the location label goes; the bar shows the project in view + All work
 * - Scene data comes from the manifests: scene-library.json (place, month, mobileCenter, and
 *   Mirror Lake's layer list) and, where a scene has one, gen/layers/<id>/scene.json (layers,
 *   source grid, tested motion bounds). Framing and arrival choices that no manifest records yet
 *   are the per-scene settings below.
 */
const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const mobileQ = matchMedia("(max-width: 768px)");
const BASE = import.meta.env.BASE_URL;
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);

/*
 * Per-scene settings no manifest carries yet.
 *   manifest   per-scene scene.json (layers + tested bounds), or null to use scene-library.json
 *   grid       the source pixel grid the cuts (and their tested bounds) are measured on
 *   anchor     desktop cover-fit anchor (like object-position, 0…1); mobile uses the library's
 *              mobileCenter unless a layer overrides it (mobileLayer)
 *   caps       [x, y] source px per layer, when the manifest has none (Mirror Lake)
 *   layer      depth / micro-motion per layer, when the manifest has none
 *   touchesTop layers whose art reaches the top edge (alpha measured on the webp's first row), so
 *              the arrival drop must stay inside the overscan
 */
const SCENES = {
  "mirror-lake": {
    manifest: null,
    grid: [1536, 1024],
    anchor: [0.46, 0.34], // scenes/places.js layersAnchor: Mt Hood's summit stays in view
    mobileLayer: { near: [0.09, 0.5] }, // STORYBOARD hero board: only the transparent fireweed reframes
    // The window prototype's travel (directions/window.js: SHIFT·(1 − depth)·width, vertical ½),
    // measured from its runtime at 1280, 1440 and 1920 px wide: constant in source px.
    caps: { sky: [1.2, 0.6], far: [6, 3], mid: [18, 9], near: [38, 19] },
    layer: { // same as scenes/places.js
      sky: { depth: 0.97, motion: "drift" },
      far: { depth: 0.85 },
      mid: { depth: 0.55, motion: "shimmer", shore: 0.745 },
      near: { depth: 0.05, motion: "sway" },
    },
    touchesTop: ["mid"], // 3% of the first row (tree tips)
  },
  ecola: {
    manifest: "gen/layers/ecola/scene.json",
    anchor: [0.5, 0.5],
    touchesTop: ["mid"], // 73% of the first row (forest canopy)
    // Only horizontal shifts were inspected (scene.json testedHorizontalSourcePx): vertical travel 0.
  },
};

const html = (s) => { const t = document.createElement("template"); t.innerHTML = s.trim(); return t.content.firstElementChild; };
const clamp01 = (v) => Math.min(1, Math.max(0, v));

async function loadScene(id) {
  const cfg = SCENES[id];
  const lib = await fetch(`${BASE}gen/scene-library.json`).then((r) => r.json());
  const entry = lib.scenes.find((s) => s.id === id);
  const man = cfg.manifest ? await fetch(BASE + cfg.manifest).then((r) => r.json()) : entry;
  const grid = cfg.grid ?? man.sourceSize;
  const mobileX = (entry.mobileCenter ?? 50) / 100;
  const layers = man.layers.map((l) => {
    const own = cfg.layer?.[l.name] ?? {};
    const tested = l.testedHorizontalSourcePx ?? l.testedTravelSourcePx;
    const cap = tested !== undefined ? [tested, 0] : cfg.caps?.[l.name] ?? [0, 0];
    return {
      name: l.name,
      src: BASE + l.src.replace(/^\//, ""),
      depth: l.depth ?? own.depth ?? 0.5,
      motion: own.motion ?? null,
      shore: own.shore,
      cap, // [x, y] source px
      capSource: tested !== undefined ? "manifest" : "window prototype",
      anchor: cfg.anchor,
      mobileAnchor: cfg.mobileLayer?.[l.name] ?? [mobileX, 0.5],
      touchesTop: cfg.touchesTop?.includes(l.name) ?? false,
    };
  });
  return { id, place: entry.place ?? man.place, month: entry.month ?? man.month, grid, layers };
}

export async function start({ skip3D }) {
  const params = new URLSearchParams(location.search);
  const id = SCENES[params.get("place")] ? params.get("place") : "mirror-lake";
  root.classList.add("ls");
  // 3D attempted. The still is withheld only while the page is visible and the renderer is
  // expected (so the arrival can assemble over the ink, text already in front); a page that
  // loads hidden keeps the still and its renderer arrives settled (see the handoff below).
  if (!skip3D) root.classList.add("ls-3d");
  if (!skip3D && document.hidden) root.classList.add("ls-still-on");

  /* ---- DOM: the still, the atmosphere, labels and the extra controls ---- */
  const scenery = html(`<div class="ls-scenery" aria-hidden="true">
    <div class="ls-still"></div>
    <div class="ls-atmos"><i class="ls-atmos-arrive"></i><i class="ls-atmos-view"></i><i class="ls-atmos-read"></i></div>
  </div>`);
  document.body.prepend(scenery);
  const still = scenery.querySelector(".ls-still");
  const placeLabel = html(`<p class="ls-place" aria-hidden="true"></p>`);
  document.body.append(placeLabel);

  const hero = document.querySelector(".hero");
  const copy = hero.querySelector(".hero-copy");
  const workLink = copy.querySelector(".arrow-link");
  const admireBtn = html(`<button class="ls-admire-btn" type="button">Take in the view</button>`);
  workLink.after(admireBtn);
  const view = html(`<div class="ls-view" hidden>
    <p class="ls-view-place"></p>
    <div class="ls-view-actions"><button class="ls-return" type="button">Back to Cello</button><a class="arrow-link" href="#work">See the work <span aria-hidden="true">↓</span></a></div>
  </div>`);
  hero.append(view);

  const header = document.querySelector(".site-header .container");
  const context = html(`<div class="ls-context"><span class="ls-context-title"></span><a class="ls-allwork" href="#work">All work</a></div>`);
  header.querySelector(".site-nav").before(context);

  /* ---- scene data → the still ---- */
  let scene;
  try { scene = await loadScene(id); } catch (err) {
    console.warn("[landscape] scene manifest failed to load", err);
    root.classList.remove("ls-3d");
    return; // the page stays complete: copy over the ink background
  }
  const label = `${scene.place} · ${scene.month}`;
  placeLabel.textContent = label;
  view.querySelector(".ls-view-place").textContent = label;
  const imgs = scene.layers.map((l) => {
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.className = `ls-layer ls-${l.name}`;
    img.style.cssText = `--ax:${l.anchor[0] * 100}%;--ay:${l.anchor[1] * 100}%;--mx:${l.mobileAnchor[0] * 100}%;--my:${l.mobileAnchor[1] * 100}%`;
    img.src = l.src;
    still.append(img);
    return img;
  });
  root.dataset.place = id;

  /* ---- attention state ---- */
  const state = { admire: false, reading: false };
  let gl = null;
  const apply = () => {
    root.classList.toggle("ls-admire", state.admire);
    root.classList.toggle("ls-reading", state.reading);
    gl?.setState({ admire: state.admire, reading: state.reading });
  };

  function setAdmire(on, { focusReturn = true } = {}) {
    if (state.admire === on) return;
    state.admire = on;
    view.hidden = !on;
    apply();
    if (on) view.querySelector(".ls-return").focus({ preventScroll: true });
    else if (focusReturn && document.activeElement && view.contains(document.activeElement)) admireBtn.focus({ preventScroll: true });
  }
  admireBtn.addEventListener("click", () => setAdmire(true));
  view.querySelector(".ls-return").addEventListener("click", () => setAdmire(false));
  view.querySelector(".arrow-link").addEventListener("click", () => setAdmire(false, { focusReturn: false }));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && state.admire && !document.querySelector("dialog[open]")) setAdmire(false); });

  /* ---- reading: the first case study crossing the reading line ---- */
  const first = document.querySelector(".work .poster");
  const stops = [...document.querySelectorAll(".work .poster, .log")];
  const title = context.querySelector(".ls-context-title");
  function contextFor() {
    const line = innerHeight * 0.45;
    let best = null, bestD = Infinity;
    for (const el of stops) {
      const r = el.getBoundingClientRect();
      const d = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
      if (d < bestD) { bestD = d; best = el; }
    }
    if (!best) return "";
    return (best.querySelector("h3") ?? best.querySelector(".section-title"))?.textContent.trim() ?? "";
  }
  let ticking = false;
  function onScroll() {
    ticking = false;
    const top = first.getBoundingClientRect().top;
    // hysteresis: in at 62% of the viewport height, out at 72%
    const reading = state.reading ? top < innerHeight * 0.72 : top < innerHeight * 0.62;
    if (reading !== state.reading) {
      state.reading = reading;
      if (reading && state.admire) setAdmire(false, { focusReturn: false });
      apply();
    }
    if (reading) { const t = contextFor(); if (title.textContent !== t) title.textContent = t; }
    gl?.setScroll(clamp01(scrollY / Math.max(1, hero.offsetHeight)));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // The still shows when there's no renderer (yet): it stays under the opaque canvas if the
  // renderer arrives late, and shows again if the context is lost.
  const showStill = (why) => {
    if (why) console.info(`[landscape] showing the still: ${why}`);
    clearTimeout(stillOff);
    root.classList.add("ls-still-on");
    root.classList.remove("ls-gl-on");
  };
  let stillOff = 0;

  window.__landscape = { scene, state: () => ({ ...state, gl: !!gl && root.classList.contains("ls-gl-on"), still: !root.classList.contains("ls-3d") || root.classList.contains("ls-still-on") }), gl: () => gl };

  /* ---- WebGL, after paint, when allowed ---- */
  if (skip3D) return;
  // "ready" = the canvas has drawn a frame on screen (never while hidden). The 6 s fallback
  // counts visible time only: it's cancelled while hidden and re-armed when visible again.
  let ready = false, giveUp = 0;
  const armGiveUp = () => {
    clearTimeout(giveUp);
    if (!ready && !document.hidden) giveUp = setTimeout(() => { if (!ready && !document.hidden) showStill("renderer not ready after 6 s"); }, 6000);
  };
  armGiveUp();
  document.addEventListener("visibilitychange", () => {
    if (ready) return;
    if (document.hidden) {
      clearTimeout(giveUp);
      // hidden before the first frame: keep the art on screen, skip the assembly later
      root.classList.add("ls-still-on");
      gl?.skipArrival();
    } else armGiveUp();
  });
  // the canvas has drawn on screen: cross-fade it in, then stop compositing the still under it
  const handoff = () => {
    ready = true;
    clearTimeout(giveUp);
    root.classList.add("ls-gl-on");
    if (root.classList.contains("ls-still-on")) stillOff = setTimeout(() => root.classList.remove("ls-still-on"), 400);
  };
  const go = async () => {
    try {
      const { createLandscape } = await import("../directions/landscape.js");
      const canvas = document.createElement("canvas");
      canvas.className = "ls-gl";
      scenery.querySelector(".ls-atmos").before(canvas);
      gl = await createLandscape({
        canvas, scene, imgs,
        mobile: () => mobileQ.matches,
        dark: isDark(),
        // the still took over meanwhile: arrive already settled, then cross-fade over it
        settled: () => root.classList.contains("ls-still-on"),
        onLost: () => { gl = null; showStill("WebGL context lost"); },
        onFirstFrame: handoff,
      });
      gl.setState({ admire: state.admire, reading: state.reading });
      gl.setScroll(clamp01(scrollY / Math.max(1, hero.offsetHeight)));
      gl.start(); // its first on-screen frame calls handoff (deferred while the tab is hidden)
      const onTheme = () => gl?.setDark(isDark());
      new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onTheme);
    } catch (err) {
      clearTimeout(giveUp);
      gl?.stop(); gl = null;
      console.warn("[landscape] 3D disabled, showing the still:", err);
      showStill();
    }
  };
  reduce.addEventListener("change", () => { if (reduce.matches) { gl?.stop(); gl = null; showStill("reduced motion turned on"); } });
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 120));
  idle(go, { timeout: 600 });
}
