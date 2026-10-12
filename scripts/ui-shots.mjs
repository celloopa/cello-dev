// Screenshots of the built site for design-system work: every key page at 1440 and 390 px,
// dark and light, with reduced motion, so a stage can prove it changed nothing (0 px) or
// show exactly what it changed.
//
//   pnpm build && pnpm ui:shots <outDir> [--compare <baselineDir>[,<baselineDir2>]] [--pages /,/resume/]
//                                       [--tolerance <0-255 per channel>] [--noise <px per screen>]
//
// Uses the Chrome already installed on this Mac through playwright-core (no browser download).
// Exact by default: one changed pixel fails a screen. --tolerance and --noise are explicit
// escape hatches and are printed in the result when used.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const out = argv[0] && !argv[0].startsWith("--") ? path.resolve(argv[0]) : null;
if (!out) { console.error("usage: pnpm ui:shots <outDir> [--compare <dir>] [--pages /,/resume/] [--tolerance n] [--noise n]"); process.exit(2); }
const dist = path.resolve("dist");
if (!fs.existsSync(path.join(dist, "index.html"))) { console.error("dist/ is missing: run pnpm build first"); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

const PAGES = arg("--pages")?.split(",") ?? [
  "/", "/projects/", "/projects/ghosted/", "/projects/asheville-dispensary/", "/projects/vegavengers/",
  "/projects/daybreak/", "/blog/", "/blog/designing-for-the-second-user/", "/resume/", "/design-system/",
  "/card/", "/404.html",
];
const WIDTHS = [[1440, 900], [390, 844]];
const THEMES = ["dark", "light"];
// --compare takes one baseline dir or several, comma-separated: a screen passes if it matches any.
// Several runs of the same baseline cover known two-state flickers (see docs/design-system/audit.md).
const compare = arg("--compare") ? arg("--compare").split(",").map((d) => path.resolve(d)) : null;
const tolerance = Number(arg("--tolerance") ?? 0);
const noise = Number(arg("--noise") ?? 0);

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".woff2": "font/woff2", ".woff": "font/woff", ".webm": "video/webm", ".mp4": "video/mp4", ".json": "application/json", ".pdf": "application/pdf", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  let f = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(f).toLowerCase()] ?? "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: "chrome", args: ["--font-render-hinting=none", "--disable-gpu", "--force-color-profile=srgb", "--hide-scrollbars", "--disable-lcd-text"] });
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\.html$/, "").replace(/\//g, "-"));
const failures = [];
let shots = 0, retried = 0;
function diff(prevFile, file) {
  const a = PNG.sync.read(fs.readFileSync(prevFile)), b = PNG.sync.read(fs.readFileSync(file));
  if (a.width !== b.width || a.height !== b.height) return `size ${a.width}×${a.height} → ${b.width}×${b.height}`;
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: tolerance / 255, includeAA: true });
  if (n > noise) { fs.writeFileSync(file.replace(/\.png$/, ".diff.png"), PNG.sync.write(d)); return `${n} px changed`; }
  return null;
}

for (const [w, h] of WIDTHS) for (const theme of THEMES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: theme, hasTouch: w < 700 });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem("theme", t); } catch {}
    Math.random = () => 0.5;
    // Reduced motion promises final states; switching transitions off from the first frame keeps
    // a late hover/scroll/class change from being caught mid-transition (a 1 px flicker otherwise).
    const css = "*,*::before,*::after{transition:none!important}";
    const add = () => { const s = document.createElement("style"); s.textContent = css; document.documentElement.append(s); };
    if (document.documentElement) add(); else document.addEventListener("DOMContentLoaded", add);
  }, theme);
  for (const p of PAGES) {
    let page = await load(ctx, base + p);
    const name = `${slug(p)}-${w}-${theme}.png`;
    const file = path.join(out, name);
    await capture(page, file);
    shots++;
    if (compare) {
      const prevs = compare.map((d) => path.join(d, name)).filter((f) => fs.existsSync(f));
      if (!prevs.length) failures.push(`${name}: no baseline`);
      else {
        const diffAny = (file) => { let v = null; for (const prev of prevs) { v = diff(prev, file); if (!v) return null; } return v; };
        // A real change reproduces on every capture; a timing flicker doesn't. A changed screen is
        // reloaded and re-shot up to twice, and passes only if a re-shot matches the baseline exactly.
        let verdict = diffAny(file);
        for (let retry = 0; verdict && retry < 2; retry++) { await page.close(); page = await load(ctx, base + p); await capture(page, file); verdict = diffAny(file); if (!verdict) retried++; }
        if (verdict) failures.push(`${name}: ${verdict}`);
      }
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();

// Load a page and settle it: lazy media loaded, videos at frame 0, reveals and entry animations
// in their final state, loops at frame 0.
async function load(ctx, url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    await Promise.all([...document.querySelectorAll("video")].map((v) => new Promise((r) => {
      v.pause(); v.removeAttribute("autoplay");
      const done = () => { v.pause(); v.currentTime = 0; v.addEventListener("seeked", r, { once: true }); setTimeout(r, 1500); };
      if (v.readyState >= 2) done(); else { v.preload = "auto"; v.addEventListener("loadeddata", done, { once: true }); v.load(); setTimeout(r, 5000); }
    })));
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  // Settle every scroll reveal in its final state. Transitions are switched off first, because
  // reveal delays survive reduced motion and would otherwise catch some elements mid-flight.
  await page.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;caret-color:transparent!important}[data-reveal],[data-reveal]::before{transition:none!important}" });
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-revealed"));
    // Entry animations end in their final frame; loops (logo, texture, marquee) rest at frame 0.
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming?.();
      if (t && Number.isFinite(t.endTime)) a.finish(); else { a.pause(); a.currentTime = 0; }
    }
  });
  await page.waitForTimeout(300);
  return page;
}

// Chrome can't capture more than 16,384 px in one go (the long case studies are ~25,000 px),
// so tall pages are captured in 8,000 px slices and stitched.
// Each capture is repeated until two in a row match, so late media decoding can't leak into a baseline.
async function capture(page, file) {
  const SLICE = 8000;
  await settle(page);
  const { width, height } = await page.evaluate(() => ({ width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight }));
  const stable = async (opts) => {
    let prev = await page.screenshot(opts);
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(250);
      const next = await page.screenshot(opts);
      if (next.equals(prev)) return next;
      prev = next;
    }
    return prev;
  };
  if (height <= SLICE) return fs.writeFileSync(file, await stable({ fullPage: true }));
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y += SLICE) {
    const h = Math.min(SLICE, height - y);
    const part = PNG.sync.read(await stable({ fullPage: true, clip: { x: 0, y, width, height: h } }));
    PNG.bitblt(part, out, 0, 0, width, h, 0, y);
  }
  fs.writeFileSync(file, PNG.sync.write(out));
}

// Wait until the page height and every media box stop moving.
async function settle(page) {
  let last = "";
  for (let i = 0; i < 20; i++) {
    const sig = await page.evaluate(() => document.documentElement.scrollHeight + ":" + [...document.querySelectorAll("img,video,figure,iframe")].map((e) => { const r = e.getBoundingClientRect(); return `${r.top|0},${r.height|0}`; }).join(";"));
    if (sig === last) return;
    last = sig;
    await page.waitForTimeout(250);
  }
}

if (!compare) console.log(`${shots} screenshots in ${path.relative(process.cwd(), out)}`);
else if (failures.length) { console.log(`${failures.length} of ${shots} screens changed${tolerance || noise ? ` (tolerance ${tolerance}, noise ${noise})` : ""}:\n  ` + failures.join("\n  ")); process.exitCode = 1; }
else console.log(`0 px changed on all ${shots} screens${retried ? ` (${retried} matched on a re-shot)` : ""}${tolerance || noise ? ` (tolerance ${tolerance}, noise ${noise})` : ""}`);
