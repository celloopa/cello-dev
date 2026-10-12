// Screenshot set for the rewrite prototypes. Uses the installed Chrome (no browser download).
// Usage: node shoot.mjs [baseURL] (default http://localhost:4611, i.e. `npm run preview`)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.argv[2] || "http://localhost:4611";
const OUT = resolve(import.meta.dirname, "../shots");
mkdirSync(OUT, { recursive: true });

const sizes = { 1440: { width: 1440, height: 900, deviceScaleFactor: 1 }, 390: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });

const posterCenter = () => {
  const r = document.querySelector('[data-gl="poster"]').getBoundingClientRect();
  return r.top + scrollY + r.height / 2 - innerHeight / 2;
};

async function shot({ dir, page: path, w, scheme, moment = "rest", reduced = false, name }) {
  const ctx = await browser.newContext({ viewport: { width: sizes[w].width, height: sizes[w].height }, ...sizes[w], colorScheme: scheme, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${path}?d=${dir}&shoot`, { waitUntil: "load" });
  await page.waitForTimeout(3200);
  if (moment === "flight") { await page.evaluate((y) => scrollTo(0, y), (await page.evaluate(posterCenter)) * 0.5); await page.waitForTimeout(150); }
  if (moment === "landed") { await page.evaluate((y) => scrollTo(0, y), await page.evaluate(posterCenter)); await page.waitForTimeout(3200); }
  const file = `${OUT}/${name || `${dir}-${path.replace(".html", "")}-${w}-${scheme}-${moment}${reduced ? "-reduced" : ""}`}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 82 });
  const gl = await page.evaluate(() => document.documentElement.classList.contains("gl-on"));
  console.log(gl ? "gl " : "dom", file.split("/").pop());
  await ctx.close();
}

for (const dir of ["tokens"]) {
  for (const w of [1440, 390]) for (const scheme of ["dark", "light"]) {
    for (const moment of ["rest", "flight", "landed"]) await shot({ dir, page: "home.html", w, scheme, moment });
    await shot({ dir, page: "asheville.html", w, scheme });
    await shot({ dir, page: "home.html", w, scheme, reduced: true });
  }
}
await shot({ dir: "paper", page: "home.html", w: 1440, scheme: "dark" });
await shot({ dir: "paper", page: "home.html", w: 390, scheme: "light" });
await browser.close();
