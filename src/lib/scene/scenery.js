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
 * the canvas), scene-gl-on (the canvas has drawn), scene-reading. The inline head
 * script in SceneLayout sets scene-3d / scene-still-on before first paint.
 */
import { readingLayers } from "./reading-drift.js";
import { afterFirstScreen, whenNear } from "./lazy.js";
// re-exported so a page script (/card) takes them from this chunk, not a request of their own
export { afterFirstScreen, whenNear };

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const mobileQ = matchMedia("(max-width: 768px)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * The Scene's backdrop layer (Scene.astro renders it empty; the places are JSON at the end of the
 * page, from SceneLayout). One item per place, its still without a src until load(id) or show(id).
 * show(id) brings that place in over the scene, on top of whatever is showing, and drops the
 * others once it's in; show("") (or an id the page has no backdrop for) returns to the page's
 * own scene.
 */
function createBackdrop(host, covered) {
  const layer = host.querySelector("[data-scene-backdrops]");
  const json = document.querySelector("script[data-scene-backdrops-json]");
  if (!layer || !json) return null;
  const motionAllowed = () => root.classList.contains("scene-gl-on") && !reduce.matches && navigator.connection?.saveData !== true;
  const items = new Map();
  const art = new Map();
  const drift = new Map();
  for (const b of JSON.parse(json.textContent)) {
    const item = document.createElement("i");
    item.className = "scene-backdrop-item";
    item.dataset.backdrop = b.id;
    const img = document.createElement("img");
    img.className = "scene-read";
    img.alt = "";
    img.decoding = "async";
    img.width = b.width;
    img.height = b.height;
    img.dataset.src = b.src;
    img.style.cssText = b.position;
    item.append(img);
    layer.append(item);
    items.set(b.id, item);
    art.set(b.id,b.scene);
  }
  let current = "", top = 0, settle = 0;
  const load = (id) => {
    const img = items.get(id)?.querySelector("img");
    if (img && !img.getAttribute("src")) img.src = img.dataset.src;
    return img;
  };
  const animate = (id,item,img) => {
    if (!drift.has(id) && motionAllowed()) {
        drift.set(id,null);
        readingLayers(item,art.get(id),img,motionAllowed).then(stop => {
          if (current !== id) stop?.();
          else if (stop) drift.set(id,stop);
          else drift.delete(id);
        });
      }
  };
  // the cross-fade's length, as the CSS has it (a hair under reduced motion)
  const fadeMs = (el) => parseFloat(getComputedStyle(el).transitionDuration) * 1000 || 0;
  const show = (id) => {
    const item = items.get(id);
    const next = item ? id : "";
    if (next === current) return;
    current = next;
    covered(!!next);
    layer.dataset.on = next;
    clearTimeout(settle);
    if (!item) {
      drift.forEach(stop => stop?.()); drift.clear();
      items.forEach((el) => {
        el.style.transition = "";
        el.classList.remove("is-on");
      });
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
      animate(id,item,img);
      // once it's in, the ones under it go at once (hidden anyway: no fade left to composite)
      settle = setTimeout(() => items.forEach((el, k) => {
        if (k === current) return;
        drift.get(k)?.(); drift.delete(k);
        el.style.transition = "none";
        el.classList.remove("is-on");
      }), fadeMs(item) + 50);
    };
    if (img.complete && img.naturalWidth) reveal();
    else img.addEventListener("load", reveal, { once: true });
  };
  return { show, load, freeze: () => { drift.forEach(stop => stop?.()); drift.clear(); }, current: () => current, refresh: () => {
    const item=items.get(current);
    if (item?.classList.contains('is-on')) animate(current,item,item.querySelector('img'));
  } };
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

  const hero = document.querySelector("[data-scene-hero]");
  const context = document.querySelector("[data-scene-context]");
  const title = context?.querySelector("[data-scene-context-title]");

  /* ---- attention state ---- */
  // A reading page (a case study or a post: html.scene-read-page, server-rendered with
  // scene-reading) opens in the reading state and stays there; it has no focus target.
  const readPage = root.classList.contains("scene-read-page");
  // An index page (html.scene-focus-page: /projects, /blog) keeps the scene focused from the
  // first paint like a reading page, while the bar stays in the exploring context.
  const focusPage = root.classList.contains("scene-focus-page");
  const state = { reading: readPage };
  let gl = null;
  const glState = () => ({ reading: state.reading || focusPage });
  const apply = () => {
    root.classList.toggle("scene-reading", state.reading);
    context?.toggleAttribute("inert", !state.reading);
    gl?.setState(glState());
  };

  /* ---- reading: the focus target crossing the reading line ---- */
  const first = document.querySelector("[data-scene-focus]");
  const stops = [...document.querySelectorAll("[data-scene-stop]")];
  const backdrop = createBackdrop(host, on => gl?.setCovered(on));
  backdropApi = backdrop;
  const zones = backdrop ? [...document.querySelectorAll("[data-scene-stop], [data-scene-backdrop]")] : [];
  // The reading line, 45% down the screen. On a page with backdrops it slides to the bottom edge
  // over the last half-screen of scroll, so the short parts at the end (home's Let's Talk and
  // footer, which can't scroll up to 45%) each get their turn, the footer last.
  function readingLine() {
    const line = innerHeight * 0.45;
    // Reading pages keep the line fixed: on short About layouts, moving it toward the
    // bottom would select Contact while How I Build still occupies the reading area.
    if (!backdrop || readPage) return line;
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
      // Dim before the Work heading enters the bright art, with a small hysteresis
      const reading = state.reading ? top < innerHeight * 0.98 : top < innerHeight * 0.94;
      if (reading !== state.reading) {
        state.reading = reading;
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
    backdrop?.freeze();
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
    backdrop?.refresh();
    if (root.classList.contains("scene-still-on")) stillOff = setTimeout(() => root.classList.remove("scene-still-on"), 400);
  };
  const go = async () => {
    if (skip3D()) return;
    try {
      for (const img of imgs) if (!img.getAttribute('src') && img.dataset.src) img.src=img.dataset.src;
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
      gl.setCovered(!!backdrop?.current());
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
  const queue = () => {
    if (document.hidden) document.addEventListener('visibilitychange',queue,{once:true});
    else idle(go,{timeout:600});
  };
  const readingStill = host.querySelector('.scene-read');
  if (readingStill) {
    // Paint the small reading still and text before fetching full, initially hidden cuts.
    Promise.all([readingStill.decode().catch(() => {}), document.fonts.ready]).then(() =>
      requestAnimationFrame(() => requestAnimationFrame(queue)));
  } else queue();
}
