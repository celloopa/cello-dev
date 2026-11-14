// AK-9 screenshots: the page at 390×844 and 1440×900 in Dusk and Day, full page, plus the studio
// panel at its end state. Run from the WSL worktree root with the preview server on BASE:
//   node docs/agent-kit/ak-9-shots.mjs [base]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright-core");

const BASE = process.argv[2] ?? "http://127.0.0.1:4450";
const SHOTS = path.join(root, "docs/agent-kit/shots/ak-9");
fs.mkdirSync(SHOTS, { recursive: true });
const exe = path.join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const scheme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${BASE}/agent-kit/`, { waitUntil: "networkidle" });
    const tag = `${w}-${scheme === "dark" ? "dusk" : "day"}`;
    await page.screenshot({ path: path.join(SHOTS, `agent-kit-${tag}.png`), fullPage: true });
    await page.screenshot({ path: path.join(SHOTS, `agent-kit-${tag}-fold.png`) });
    await page.locator("#studio").screenshot({ path: path.join(SHOTS, `studio-${tag}.png`) });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(tag, "overflow", overflow, "errors", errors.length, errors.join(" | "));
    await ctx.close();
  }
}
await browser.close();
