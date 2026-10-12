/*
 * The room: Cello's desk and window, pinned behind the content.
 *
 * - The window shows a place. On load it's a random one (never the same as last visit).
 * - Whatever piece of content is in focus (the one crossing the reading line) sets the place;
 *   hovering another piece previews its place. Content declares its place with data-scene and
 *   its screen image with data-screen.
 * - Changing place is a window transition: the roller blind comes down, the view swaps, the
 *   blind goes back up (house curve). Reduced motion: an instant swap, no blind.
 * - The view is an SVG still first; three.js takes over on idle when allowed (depth parallax,
 *   falling water, drifting clouds…).
 * Everything here is decorative (aria-hidden). The content itself is ordinary HTML on plates.
 */
import { PLACES, byId } from "../scenes/places.js";
import { svgFor, skyFor } from "../scenes/svg.js";

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const ROOM = `
<div class="room" aria-hidden="true">
  <div class="room-window">
    <div class="room-glass"><div class="room-still"></div></div>
    <div class="room-mullions"></div>
    <div class="room-blind"><div class="room-blind-shade"></div></div>
    <div class="room-shade-roll"></div>
  </div>
  <div class="room-sill"></div>
  <div class="room-desk"></div>
  <div class="room-monitor">
    <div class="room-screen"><img alt="" decoding="async"><div class="room-code"></div></div>
    <div class="room-stand"></div>
  </div>
  <svg class="room-things" viewBox="0 0 1000 120" preserveAspectRatio="xMidYMax meet">
    <rect class="t-ink" x="40" y="70" width="230" height="40" rx="8" transform="rotate(-6 155 90)"/>
    <rect class="t-ink" x="730" y="70" width="230" height="40" rx="8" transform="rotate(6 845 90)"/>
    <rect class="t-key" x="370" y="44" width="250" height="34" rx="3"/>
    <g class="t-keys">${Array.from({ length: 14 }, (_, i) => `<rect x="${376 + i * 17.4}" y="58" width="2" height="20"/>`).join("")}</g>
    <rect class="t-mini" x="660" y="54" width="90" height="22" rx="6"/>
    <path class="t-mug" d="M520 80 h44 v30 a8 8 0 0 1 -8 8 h-28 a8 8 0 0 1 -8 -8 z"/>
    <path class="t-mug-handle" d="M564 88 a10 10 0 0 1 0 18" fill="none"/>
    <ellipse class="t-coffee" cx="542" cy="81" rx="21" ry="4"/>
  </svg>
</div>
<p class="location-card" aria-hidden="true"><span class="lc-place"></span><span class="lc-month"></span></p>`;

export async function start({ skip3D }) {
  document.body.insertAdjacentHTML("afterbegin", ROOM);
  const $ = (s) => document.querySelector(s);
  const glass = $(".room-glass"), still = $(".room-still"), blind = $(".room-blind");
  const screenImg = $(".room-screen img"), code = $(".room-code"), card = $(".location-card");
  code.innerHTML = Array.from({ length: 9 }, (_, i) => `<i style="width:${30 + ((i * 37) % 55)}%"></i>`).join("");

  /* ---- the opening place: random, never the same as last visit ---- */
  let lastHero = null;
  try { lastHero = localStorage.getItem("room:last"); } catch {}
  const pool = PLACES.filter((p) => p.id !== lastHero);
  const forced = new URLSearchParams(location.search).get("place");
  const heroPlace = byId[forced] || pool[Math.floor(Math.random() * pool.length)];
  try { localStorage.setItem("room:last", heroPlace.id); } catch {}

  let gl = null;
  let shown = null;        // place id in the window
  let wanted = heroPlace.id;
  let busy = false;

  function paint(id, screen) {
    const place = byId[id];
    const dark = isDark();
    still.innerHTML = svgFor(place, dark);
    glass.style.background = skyFor(place, dark);
    card.querySelector(".lc-place").textContent = place.place;
    card.querySelector(".lc-month").textContent = place.month;
    if (screen) { screenImg.src = screen; screenImg.hidden = false; code.hidden = true; }
    else { screenImg.hidden = true; code.hidden = false; }
    gl?.show(place, dark);
    shown = id;
  }

  /* ---- what's in focus ---- */
  const stops = [...document.querySelectorAll("[data-scene]")];
  const sceneOf = (el) => (el.dataset.scene === "random" ? heroPlace.id : el.dataset.scene);
  const screenOf = (el) => el?.dataset.screen || null;
  let focusEl = stops[0], hoverEl = null;

  function pickFocus() {
    const line = innerHeight * (innerWidth <= 900 ? 0.72 : 0.5);
    let best = null, bestD = Infinity;
    for (const el of stops) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const d = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
      if (d < bestD) { bestD = d; best = el; }
    }
    return best || focusEl;
  }

  async function settle() {
    const el = hoverEl || focusEl;
    const id = sceneOf(el), screen = screenOf(el);
    wanted = id;
    if (busy) return;
    if (id === shown) { paintScreen(screen); return; }
    if (reduce.matches) { paint(id, screen); return; }
    busy = true;
    blind.classList.add("is-down");
    await wait(420);
    paint(wanted, screenOf(hoverEl || focusEl));
    await wait(90);
    blind.classList.remove("is-down");
    await wait(560);
    busy = false;
    if (wanted !== shown) settle();
  }
  function paintScreen(screen) {
    if (screen) { if (!screenImg.src.endsWith(screen)) screenImg.src = screen; screenImg.hidden = false; code.hidden = true; }
    else { screenImg.hidden = true; code.hidden = false; }
  }

  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; const f = pickFocus(); if (f !== focusEl) { focusEl = f; settle(); } });
  }, { passive: true });

  if (matchMedia("(pointer: fine)").matches) {
    for (const el of stops) {
      if (el.dataset.scene === "random") continue;
      el.addEventListener("pointerenter", () => { hoverEl = el; settle(); });
      el.addEventListener("pointerleave", () => { if (hoverEl === el) { hoverEl = null; settle(); } });
      el.addEventListener("focusin", () => { hoverEl = el; settle(); });
      el.addEventListener("focusout", () => { if (hoverEl === el) { hoverEl = null; settle(); } });
    }
  }

  const onTheme = () => { const id = shown; shown = null; paint(id, screenOf(hoverEl || focusEl)); };
  new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onTheme);

  focusEl = pickFocus();
  paint(sceneOf(focusEl), screenOf(focusEl));
  requestAnimationFrame(() => root.classList.add("room-ready"));

  /* ---- three.js on idle, when allowed ---- */
  if (!skip3D) {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(async () => {
      try {
        const { createWindowRenderer } = await import("../directions/window.js");
        const canvas = document.createElement("canvas");
        canvas.className = "room-gl";
        glass.append(canvas);
        gl = await createWindowRenderer(canvas);
        gl.show(byId[shown], isDark());
        requestAnimationFrame(() => root.classList.add("gl-on"));
        canvas.addEventListener("gl-lost", () => { root.classList.remove("gl-on"); gl = null; });
        reduce.addEventListener("change", () => { if (reduce.matches) { gl?.stop(); gl = null; root.classList.remove("gl-on"); } });
        window.__room = { gl, places: PLACES.map((p) => p.id), go: (id) => { hoverEl = null; focusEl = { dataset: { scene: id } }; settle(); } };
      } catch (err) { console.warn("[room] 3D disabled:", err); }
    }, { timeout: 1500 });
  }
}
