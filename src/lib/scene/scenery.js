/*
 * Scene, the DOM half (no three.js). Ported from the rewrite prototype (shared/scenery.js on
 * claude/rewrite-exploration, verified there); behavior unchanged. What changed in the port: the
 * still, the atmosphere, the place label, the Admire controls and the bar's reading context are
 * server-rendered by Scene.astro / ContextBar.astro (so the still is in the HTML and works with no
 * JavaScript), the scene data is embedded by the build (catalog.ts), and the focus and motion
 * values come from the A3 tokens.
 *
 * - The scene's cut layers as a stacked-<img> still. It IS the page when there's no WebGL, under
 *   reduced motion, with ?gl=0, or if textures fail; otherwise the WebGL renderer (renderer.js)
 *   draws the same <img>s (no second download) and the still stays hidden.
 * - Attention states, all reversible:
 *     arrival  the intro copy over the scene, readable at once (nothing waits for the assembly)
 *     admire   "Take in the view" hides the intro; "Back to Cello" (or Esc) returns
 *     reading  once the focus target (the Work section) reaches the reading line, the scene
 *              softens, dims and quiets; the place label goes; the bar shows the project in view
 *              + All work. A reading page (html.scene-read-page: a case study or a post) is in
 *              this state from the first paint and never leaves it; its renderer arrives
 *              settled and already focused.
 * - Backdrops (Scene `backdrops`): while reading, the part of the page in view (the nearest
 *   [data-scene-stop] or [data-scene-backdrop] to the reading line, or the one holding keyboard
 *   focus) brings its own place in behind the words: its reading still, focused like the scene,
 *   cross-fading in over the last (--motion-scene-fade, the house curve; a cut under reduced
 *   motion). A part with no place of its own shows the page's scene. Each still loads as its part
 *   nears, after the first screen. The renderer is untouched: it settles focused and stops drawing
 *   under the still. /projects drives the same layer from its hover (setBackdrop).
 *
 * Root classes: scene-3d (a renderer is expected), scene-still-on (show the still under/instead of
 * the canvas), scene-gl-on (the canvas has drawn), scene-admire, scene-reading. The inline head
 * script in SceneLayout sets scene-3d / scene-still-on before first paint.
 */
import { afterFirstScreen, whenNear } from "./lazy.js";

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const mobileQ = matchMedia("(max-width: 768px)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * The Scene's backdrop layer (Scene.astro renders one item per place, without a src). show(id)
 * brings that place in over the scene, on top of whatever is showing, and drops the others once
 * it's in; show("") (or an id the page has no backdrop for) returns to the page's own scene.
 * load(id) fetches a place's still ahead of time.
 */
function createBackdrop(host) {
  const layer = host.querySelector("[data-scene-backdrops]");
  if (!layer) return null;
  const items = new Map([...layer.querySelectorAll("[data-backdrop]")].map((el) => [el.dataset.backdrop, el]));
  let current = "", top = 0, settle = 0;
  const load = (id) => {
    const img = items.get(id)?.querySelector("img");
    if (img && !img.getAttribute("src")) img.src = img.dataset.src;
    return img;
  };
  // the cross-fade's length, as the CSS has it (a hair under reduced motion)
  const fadeMs = (el) => parseFloat(getComputedStyle(el).transitionDuration) * 1000 || 0;
  const show = (id) => {
    const item = items.get(id);
    const next = item ? id : "";
    if (next === current) return;
    current = next;
    layer.dataset.on = next;
    clearTimeout(settle);
    if (!item) {
      items.forEach((el) => el.classList.remove("is-on"));
      return;
    }
    const img = load(id);
    const reveal = () => {
      if (current !== id) return;
      // on top of the others and from transparent, so it always fades in over what's showing
      item.style.transition = "none";
      item.classList.remove("is-on");
      item.style.zIndex = String(++top);
      void item.offsetWidth;
      item.style.transition = "";
      item.classList.add("is-on");
      settle = setTimeout(() => items.forEach((el, k) => k !== current && el.classList.remove("is-on")), fadeMs(item) + 50);
    };
    if (img.complete && img.naturalWidth) reveal();
    else img.addEventListener("load", reveal, { once: true });
  };
  return { show, load };
}
let backdropApi = null;

/**
 * Bring a place in behind the page's content (/projects: the story pointed at), or "" for the
 * page's own scene. The same layer and cross-fade as home's reading parts.
 */
export function setBackdrop(id) {
  backdropApi?.show(id);
}

/** The A3 tokens the renderer needs, read from the generated tokens.css. */
function readTokens() {
  const cs = getComputedStyle(root);
  const num = (n) => parseFloat(cs.getPropertyValue(n));
  const sec = (n) => { const v = cs.getPropertyValue(n).trim(); return v.endsWith("ms") ? parseFloat(v) / 1000 : parseFloat(v); };
  return {
    focus: {
      desktop: { blur: num("--focus-blur"), bright: num("--focus-brightness"), sat: num("--focus-saturate") },
      mobile: { blur: num("--focus-blur-mobile"), bright: num("--focus-brightness-mobile"), sat: num("--focus-saturate-mobile") },
      scale: num("--focus-scale"),
    },
    focusSeconds: sec("--motion-focus"),
    arrivalStagger: sec("--motion-arrival-stagger"),
    arrivalOvershoot: num("--motion-arrival-overshoot"),
  };
}

/**
 * The 3D gate. No 3D (the still is the page) under reduced motion, Save-Data, 2G, ?gl=0, or
 * without WebGL. The head script already ruled out the first four before paint.
 */
function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}
export function skip3D() {
  const conn = navigator.connection || {};
  return reduce.matches || conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || "") ||
    new URLSearchParams(location.search).get("gl") === "0" || !webglOK();
}

export function start() {
  const host = document.querySelector("[data-scene]");
  if (!host) return;
  const scene = JSON.parse(host.querySelector("script[data-scene-json]").textContent);
  const scenery = host;
  const imgs = [...host.querySelectorAll(".scene-layer")];
  const noGL = skip3D();
  if (noGL) root.classList.remove("scene-3d", "scene-still-on");

  /* ---- Admire: "Take in the view" / "Back to Cello" ---- */
  const hero = document.querySelector("[data-scene-hero]");
  const admireBtn = document.querySelector("[data-admire-open]");
  const view = document.querySelector("[data-admire-view]");
  const intro = document.querySelector("[data-scene-intro]");
  const context = document.querySelector("[data-scene-context]");
  const title = context?.querySelector("[data-scene-context-title]");

  /* ---- attention state ---- */
  // A reading page (a case study or a post: html.scene-read-page, server-rendered with
  // scene-reading) opens in the reading state and stays there; it has no focus target.
  const readPage = root.classList.contains("scene-read-page");
  // An index page (html.scene-focus-page: /projects, /blog) keeps the scene focused from the
  // first paint like a reading page, while the bar stays in the exploring context.
  const focusPage = root.classList.contains("scene-focus-page");
  const state = { admire: false, reading: readPage };
  let gl = null;
  const glState = () => ({ admire: state.admire, reading: state.reading || focusPage });
  const apply = () => {
    root.classList.toggle("scene-admire", state.admire);
    root.classList.toggle("scene-reading", state.reading);
    context?.toggleAttribute("inert", !state.reading);
    gl?.setState(glState());
  };

  function setAdmire(on, { focusReturn = true } = {}) {
    if (!view || state.admire === on) return;
    // read before hiding the view: hiding it drops its focus to <body>
    const focusWasInView = !!document.activeElement && view.contains(document.activeElement);
    state.admire = on;
    view.hidden = !on;
    if (intro) intro.inert = on; // faded out in Admire: out of the tab order and the a11y tree
    apply();
    if (on) view.querySelector("[data-admire-close]").focus({ preventScroll: true });
    else if (focusReturn && focusWasInView) admireBtn.focus({ preventScroll: true });
  }
  if (admireBtn && view) {
    admireBtn.addEventListener("click", () => setAdmire(true));
    view.querySelector("[data-admire-close]").addEventListener("click", () => setAdmire(false));
    view.querySelector("[data-admire-work]")?.addEventListener("click", () => setAdmire(false, { focusReturn: false }));
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.admire && !document.getElementById("keyboard-shortcuts-menu")) setAdmire(false);
    });
  }

  /* ---- reading: the focus target crossing the reading line ---- */
  const first = document.querySelector("[data-scene-focus]");
  const stops = [...document.querySelectorAll("[data-scene-stop]")];
  const backdrop = createBackdrop(host);
  backdropApi = backdrop;
  const zones = backdrop ? [...document.querySelectorAll("[data-scene-stop], [data-scene-backdrop]")] : [];
  // The reading line, 45% down the screen. On a page with backdrops it slides to the bottom edge
  // over the last half-screen of scroll, so the short parts at the end (home's Let's Talk and
  // footer, which can't scroll up to 45%) each get their turn, the footer last.
  function readingLine() {
    const line = innerHeight * 0.45;
    if (!backdrop) return line;
    const left = root.scrollHeight - innerHeight - scrollY;
    return line + (innerHeight - 1 - line) * clamp01(1 - left / (innerHeight * 0.5));
  }
  // the element of `els` across (or nearest to) the reading line
  function nearest(els) {
    const line = readingLine();
    let best = null, bestD = Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const d = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
      if (d < bestD) { bestD = d; best = el; }
    }
    return best;
  }
  // Keyboard focus picks the part too: a Tab that lands in a part scrolls it into view, but not
  // necessarily onto the reading line, so the part holding focus wins while it's on screen, until
  // the reader moves some other way (a key other than Tab, the pointer, the wheel, a touch).
  let pinned = null;
  let tabbing = false;
  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  };
  addEventListener("keydown", (e) => {
    tabbing = e.key === "Tab";
    if (!tabbing) pinned = null;
  }, true);
  for (const ev of ["pointerdown", "wheel", "touchstart"])
    addEventListener(ev, () => { tabbing = false; pinned = null; }, { passive: true, capture: true });
  document.addEventListener("focusin", (e) => {
    if (!tabbing || !(e.target instanceof Element)) return;
    pinned = e.target.closest("[data-scene-stop], [data-scene-backdrop]");
    requestAnimationFrame(onScroll);
  });
  // what the reading line (or keyboard focus) is on: the bar's title, and the place behind it
  function readingParts() {
    const pin = pinned && onScreen(pinned) ? pinned : null;
    const stop = pin?.hasAttribute("data-scene-stop") ? pin : nearest(stops);
    const zone = pin ?? (zones.length ? nearest(zones) : null);
    return { title: stop?.dataset.sceneStop ?? "", place: zone?.dataset.sceneBackdrop ?? "" };
  }
  let ticking = false;
  function onScroll() {
    ticking = false;
    if (first) {
      const top = first.getBoundingClientRect().top;
      // hysteresis: in at 62% of the viewport height, out at 72%
      const reading = state.reading ? top < innerHeight * 0.72 : top < innerHeight * 0.62;
      if (reading !== state.reading) {
        state.reading = reading;
        if (reading && state.admire) setAdmire(false, { focusReturn: false });
        apply();
      }
      const parts = reading ? readingParts() : { title: "", place: "" };
      if (reading && title && title.textContent !== parts.title) title.textContent = parts.title;
      backdrop?.show(parts.place);
    }
    gl?.setScroll(clamp01(scrollY / Math.max(1, hero?.offsetHeight ?? innerHeight)));
  }
  // each place's still loads as its part nears, once the first screen is complete
  const placed = zones.filter((z) => z.dataset.sceneBackdrop);
  if (backdrop && placed.length) afterFirstScreen(() => whenNear(placed, (z) => backdrop.load(z.dataset.sceneBackdrop)));
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  apply();
  onScroll();

  // The still shows when there's no renderer (yet): it stays under the opaque canvas if the
  // renderer arrives late, and shows again if the context is lost.
  let stillOff = 0;
  const showStill = (why) => {
    if (why) console.info(`[scene] showing the still: ${why}`);
    clearTimeout(stillOff);
    root.classList.add("scene-still-on");
    root.classList.remove("scene-gl-on");
  };

  // review hook (also used by the build's checks)
  window.__scene = { scene, state: () => ({ ...state, gl: !!gl && root.classList.contains("scene-gl-on"), still: !root.classList.contains("scene-3d") || root.classList.contains("scene-still-on"), backdrop: host.querySelector("[data-scene-backdrops]")?.dataset.on ?? null }), gl: () => gl };

  /* ---- WebGL, after paint, when allowed ---- */
  if (noGL) return;
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
      root.classList.add("scene-still-on");
      gl?.skipArrival();
    } else armGiveUp();
  });
  // the canvas has drawn on screen: cross-fade it in, then stop compositing the still under it
  const handoff = () => {
    ready = true;
    clearTimeout(giveUp);
    root.classList.add("scene-gl-on");
    if (root.classList.contains("scene-still-on")) stillOff = setTimeout(() => root.classList.remove("scene-still-on"), 400);
  };
  const go = async () => {
    try {
      const { createLandscape } = await import("./renderer.js");
      const canvas = document.createElement("canvas");
      canvas.className = "scene-gl";
      scenery.querySelector(".scene-still").after(canvas); // under the backdrops and the atmosphere
      gl = await createLandscape({
        canvas, scene, imgs,
        tokens: readTokens(),
        mobile: () => mobileQ.matches,
        dark: isDark(),
        reading: readPage || focusPage,
        // the still took over meanwhile, or this is a reading or index page (no assembly behind
        // an article or a list): arrive already settled, then cross-fade in
        settled: () => readPage || focusPage || root.classList.contains("scene-still-on"),
        onLost: () => { gl = null; showStill("WebGL context lost"); },
        onFirstFrame: handoff,
      });
      gl.setState(glState());
      gl.setScroll(clamp01(scrollY / Math.max(1, hero?.offsetHeight ?? innerHeight)));
      gl.start(); // its first on-screen frame calls handoff (deferred while the tab is hidden)
      const onTheme = () => gl?.setDark(isDark());
      new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onTheme);
    } catch (err) {
      clearTimeout(giveUp);
      gl?.stop(); gl = null;
      console.warn("[scene] 3D disabled, showing the still:", err);
      showStill();
    }
  };
  reduce.addEventListener("change", () => { if (reduce.matches) { gl?.stop(); gl = null; showStill("reduced motion turned on"); } });
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 120));
  idle(go, { timeout: 600 });
}
