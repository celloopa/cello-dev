/*
 * First-paint script: the only JS every visitor downloads up front (budget ≤ 30 KB gz).
 * It wires the theme toggle, the ⌘K menu and text reveals, then decides whether this
 * visitor gets the 3D layer at all. three.js is never in this file; it arrives later
 * through a dynamic import, only when it's safe and useful.
 */
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/geist-mono/latin-700.css";
import "@fontsource/geist-mono/latin-900.css";
import "./tokens.css";
import "./base.css";
import "./directions.css";
import "./window.css";
import "./landscape.css";

const root = document.documentElement;
const direction = root.dataset.direction;
const params = new URLSearchParams(location.search);

/* ---- keep ?d= (the prototype's direction) on internal links ---- */
for (const a of document.querySelectorAll("a.keep-d")) {
  const url = new URL(a.getAttribute("href"), location.href);
  url.searchParams.set("d", direction);
  a.href = url.pathname + url.search + url.hash;
}

/* ---- theme: follows the system until the visitor picks one ---- */
const systemDark = matchMedia("(prefers-color-scheme: dark)");
function currentTheme() {
  return root.dataset.theme || (systemDark.matches ? "dark" : "light");
}
function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
}
for (const b of document.querySelectorAll("[data-theme-toggle]")) b.addEventListener("click", toggleTheme);

/* ---- ⌘K menu: a native <dialog> (focus trap, Esc, focus return come free) ---- */
const menu = document.querySelector("dialog.menu");
function openMenu() { if (!menu.open) menu.showModal(); }
for (const b of document.querySelectorAll("[data-menu-open]")) b.addEventListener("click", openMenu);
for (const a of menu.querySelectorAll("[data-menu-close]")) a.addEventListener("click", () => menu.close());
menu.addEventListener("click", (e) => { if (e.target === menu) menu.close(); });
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); menu.open ? menu.close() : openMenu(); }
  else if (menu.open && e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) toggleTheme();
});

/* ---- text reveals: CSS does the motion; this only flips a class once ---- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const reveals = document.querySelectorAll(".reveal");
if (reduce.matches || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach((el) => io.observe(el));
}

/* ---- prototype chrome: direction switcher (hidden in screenshots) ---- */
const bar = document.createElement("nav");
bar.className = "proto-bar";
bar.setAttribute("aria-label", "Prototype direction");
for (const [key, label] of [["window", "Window"], ["landscape", "Landscape"], ["tokens", "Tokens"], ["paper", "Cut paper"]]) {
  const a = document.createElement("a");
  const url = new URL(location.href);
  url.searchParams.set("d", key);
  a.href = url.pathname + url.search;
  a.textContent = label;
  if (key === direction) a.setAttribute("aria-current", "true");
  bar.append(a);
}
document.body.append(bar);
if (params.has("shoot")) root.classList.add("shooting");

/* ---- the 3D gate ----
 * No 3D (the page stays the complete SVG + image version) when:
 *  - the visitor asks for reduced motion,
 *  - Save-Data is on or the connection is 2G,
 *  - WebGL isn't available,
 *  - or ?gl=0 (to compare).
 * Otherwise three.js loads on idle, after the page has painted.
 */
function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}
const conn = navigator.connection || {};
const skip3D =
  reduce.matches ||
  conn.saveData === true ||
  /(^|-)2g$/.test(conn.effectiveType || "") ||
  params.get("gl") === "0" ||
  !webglOK();

if (direction === "window") {
  // The room paints right away (SVG still); it loads three.js itself on idle when allowed.
  import("./room.js").then((m) => m.start({ skip3D }));
} else if (direction === "landscape") {
  // The scene's layers as a DOM still right away; three.js on idle when allowed (scenery.js).
  import("./scenery.js").then((m) => m.start({ skip3D }));
} else if (!skip3D) {
  const go = () => import("./stage.js").then((m) => m.start(direction)).catch((err) => {
    console.warn("[stage] 3D disabled:", err);
    root.classList.remove("gl-on");
  });
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  if (document.readyState === "complete") idle(go, { timeout: 1500 });
  else addEventListener("load", () => idle(go, { timeout: 1500 }), { once: true });
}

// If the visitor turns on reduced motion mid-visit, drop the 3D layer and show the still page.
reduce.addEventListener("change", () => { if (reduce.matches) root.classList.remove("gl-on"); });
