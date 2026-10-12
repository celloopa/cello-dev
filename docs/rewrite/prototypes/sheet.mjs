// Contact sheet of every place through the window (the glass only), day and night.
// node sheet.mjs <outDir> [baseURL]
import { chromium } from "playwright-core";
const [outDir, BASE = "http://localhost:4610"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ids = ["moss-falls", "meadows", "meadows-lift", "ecola", "salmon-ridge", "ramona", "over-hood", "bald-mountain", "mirror-lake", "sauvie"];
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const id of ids) {
    await page.goto(`${BASE}/home.html?d=window&shoot&place=${id}`, { waitUntil: "load" });
    await page.waitForFunction(() => document.documentElement.classList.contains("gl-on"), null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.locator(".room-window").screenshot({ path: `${outDir}/${scheme}-${id}.jpg`, type: "jpeg", quality: 80 });
  }
  await ctx.close();
}
await browser.close();
console.log("ok");
