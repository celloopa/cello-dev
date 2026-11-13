// Inject the escaped p3 prompt into each concept, then screenshot each at 390x844 and 1440x900, Dusk and Day.
// Run from the repo root: node <this> [names...]
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const root = process.cwd();
const dir = path.join(root, "docs/agent-kit/concepts");
const p3 = fs.readFileSync(path.join(root, "docs/agent-kit/source/p3.md"), "utf8")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").trimEnd();

const only = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => /^[abc]-.*\.html$/.test(f))
  .filter((f) => !only.length || only.some((o) => f.startsWith(o)));

for (const f of files) {
  const p = path.join(dir, f);
  let html = fs.readFileSync(p, "utf8");
  html = html.replace(/(<pre class="prompt-text[^"]*" id="p3">)[\s\S]*?(<\/pre>)/, (_, a, b) => a + "<!--P3-->" + b);
  html = html.replace("<!--P3-->", p3);
  fs.writeFileSync(p, html);
}

const exe = path.join(os.homedir(), ".cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell");
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
const sizes = [[390, 844], [1440, 900]];
for (const f of files) {
  const name = f.replace(".html", "");
  for (const [w, h] of sizes) {
    for (const theme of ["dusk", "day"]) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.goto("file://" + path.join(dir, f));
      await page.evaluate((t) => { if (t === "day") document.documentElement.dataset.theme = "light"; }, theme);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(900);
      const fonts = await page.evaluate(() => [...document.fonts].filter((x) => x.status === "loaded").map((x) => x.family + " " + x.weight));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const out = path.join(dir, "shots", `${name}-${w}-${theme}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log(out.replace(root + "/", ""), "overflowX=" + overflow, "fonts=" + [...new Set(fonts)].join("|"));
      await page.close();
    }
  }
}
await browser.close();
