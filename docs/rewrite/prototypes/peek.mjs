// Quick headless look at one page: console errors + a screenshot. Dev tool for the prototypes.
// node peek.mjs <url> <out.jpg> [width] [height] [light|dark] [scrollY] [waitMs]
import { chromium } from "playwright-core";
const [url, out, w = "1440", h = "900", scheme = "light", y = "0", ms = "2600"] = process.argv.slice(2);
const mobile = Number(w) < 700;
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, colorScheme: scheme });
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
if (+y) { await page.evaluate((v) => scrollTo(0, v), +y); }
await page.waitForTimeout(+ms);
await page.screenshot({ path: out, type: "jpeg", quality: 80 });
const state = await page.evaluate(() => ({ gl: document.documentElement.classList.contains("gl-on"), place: document.querySelector(".lc-place")?.textContent, calls: window.__room?.gl?.info?.().calls }));
console.log(JSON.stringify(state));
for (const l of logs) console.log(l);
await browser.close();
