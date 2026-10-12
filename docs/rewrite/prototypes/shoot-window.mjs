// Screenshot set for the window direction → ../shots/window-*.jpg (needs `npm run preview` on :4611)
import { chromium } from "playwright-core";
import { resolve } from "node:path";
const BASE = process.argv[2] || "http://localhost:4611";
const OUT = resolve(import.meta.dirname, "../shots");
const b = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const sizes = { 1440: [1440, 900, 1], 390: [390, 844, 2] };
async function shot(name, { w, scheme, path = "home.html", place = "meadows", scrollTo = null, reduced = false }) {
  const [W, H, dpr] = sizes[w];
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, isMobile: w === 390, hasTouch: w === 390, colorScheme: scheme, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/${path}?d=window&shoot&place=${place}`, { waitUntil: "load" });
  await p.waitForTimeout(2600);
  if (scrollTo !== null) {
    const y = await p.evaluate((i) => { const el = document.querySelectorAll("[data-scene]")[i]; return el.getBoundingClientRect().top + scrollY - innerHeight * 0.25; }, scrollTo);
    for (let v = 0; v <= y; v += 140) { await p.evaluate((q) => scrollTo(0, q), v); await p.waitForTimeout(12); }
    await p.evaluate((q) => scrollTo(0, q), y);
    await p.waitForTimeout(1900);
  }
  await p.screenshot({ path: `${OUT}/window-${name}.jpg`, type: "jpeg", quality: 82 });
  const s = await p.evaluate(() => ({ gl: document.documentElement.classList.contains("gl-on"), place: document.querySelector(".lc-place")?.textContent }));
  console.log(name, JSON.stringify(s));
  await ctx.close();
}
for (const w of [1440, 390]) for (const scheme of ["light", "dark"]) {
  await shot(`home-${w}-${scheme}-hero`, { w, scheme, place: w === 1440 ? "mirror-lake" : "meadows" });
  await shot(`home-${w}-${scheme}-asheville`, { w, scheme, scrollTo: 1 });
  await shot(`home-${w}-${scheme}-vegavengers`, { w, scheme, scrollTo: 3 });
  await shot(`asheville-${w}-${scheme}`, { w, scheme, path: "asheville.html" });
}
await shot("home-1440-dark-reduced", { w: 1440, scheme: "dark", reduced: true, place: "bald-mountain" });
await shot("home-390-light-reduced", { w: 390, scheme: "light", reduced: true, place: "sauvie" });
await b.close();
