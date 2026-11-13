// AK-3 verification: run from the WSL worktree root with the preview server on BASE.
//   node <this> [base]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright-core");

const BASE = process.argv[2] ?? "http://localhost:4321";
const URL_ = `${BASE}/agent-kit/`;
const SHOTS = path.join(root, "docs/agent-kit/shots/ak-3");
fs.mkdirSync(SHOTS, { recursive: true });
const exe = path.join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });

for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const scheme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(URL_, { waitUntil: "networkidle" });
    const tag = `${w}-${scheme === "dark" ? "dusk" : "day"}`;
    ok(`${tag} status 200`, res.status() === 200, String(res.status()));
    ok(`${tag} theme`, (await page.getAttribute("html", "data-theme")) === scheme);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`${tag} no horizontal page scroll`, overflow <= 0, `${overflow}px`);
    // every rail stub visible without sideways scroll
    const stubs = await page.$$eval(".ak-index-link", (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { href: e.getAttribute("href"), inView: r.left >= 0 && r.right <= innerWidth }; }));
    ok(`${tag} 5 rail stubs are links in view`, stubs.length === 5 && stubs.every((s) => s.inView), JSON.stringify(stubs.map((s) => s.href)));
    if (w === 390) {
      const order = await page.evaluate(() => {
        const c = document.querySelector(".ak-controls").getBoundingClientRect().top;
        const b = document.querySelector(".ak-board").getBoundingClientRect().top;
        return c < b;
      });
      ok(`${tag} studio controls above board`, order);
      const sc = await page.$eval(".ak-rate-scroll", (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, tab: e.getAttribute("tabindex"), label: e.getAttribute("aria-label") }));
      ok(`${tag} rate card scrolls in its own labelled container`, sc.sw > sc.cw && sc.tab === "0" && !!sc.label, JSON.stringify(sc));
    }
    await page.screenshot({ path: path.join(SHOTS, `agent-kit-${tag}.png`), fullPage: true });

    if (w === 1440 && scheme === "dark") {
      // nav
      const nav = await page.$eval('header a[href="/agent-kit"]', (a) => ({ cur: a.getAttribute("aria-current"), prev: a.closest("li").previousElementSibling?.textContent.trim(), next: a.closest("li").nextElementSibling?.textContent.trim() }));
      ok("nav Agent Kit between Writing and Design System, aria-current=page", nav.cur === "page" && nav.prev === "Writing" && nav.next === "Design System", JSON.stringify(nav));
      // copy each prompt
      for (const f of ["1-second-brain.md", "2-session-notes.md", "3-studio-pipeline.md"]) {
        const src = fs.readFileSync(path.join(root, "src/content/agent-kit/prompts", f), "utf8");
        const art = page.locator(`article[data-prompt="${f}"]`);
        const meta = JSON.parse(fs.readFileSync(path.join(root, "src/content/agent-kit/prompts/meta.json"), "utf8"))[f];
        const ver = (await art.locator("[data-prompt-version]").textContent()).replace(/\s+/g, " ").trim();
        ok(`${f} version line from meta.json`, ver === `v${meta.version} · Last checked against my setup ${meta.checked}`, ver);
        const shown = await art.locator("pre").textContent();
        ok(`${f} shown text equals source`, shown === src);
        await art.locator("[data-copy-prompt]").click();
        await page.waitForTimeout(200);
        const clip = await page.evaluate(() => navigator.clipboard.readText());
        const status = await art.locator('[role="status"]').textContent();
        ok(`${f} clipboard equals source + "Copied"`, clip === src && status === "Copied", `status=${status}`);
        await page.waitForTimeout(2300);
        ok(`${f} status resets`, (await art.locator('[role="status"]').textContent()) === "");
        const dl = await art.locator("a[download]").getAttribute("href");
        const body = await (await page.request.get(BASE + dl)).body();
        ok(`${f} download bytes equal source`, Buffer.compare(body, fs.readFileSync(path.join(root, "src/content/agent-kit/prompts", f))) === 0, dl);
        const t = art.locator("[data-toggle-prompt]");
        await t.click();
        ok(`${f} Show all expands`, (await t.getAttribute("aria-expanded")) === "true" && (await art.locator("pre").getAttribute("data-collapsed")) === null);
        await t.click();
      }
      // studio bug switch
      await page.locator(".ak-switch").click();
      ok("bug off shows PASS", await page.locator(".ak-lane--eval .ak-stamp--pass").isVisible() && !(await page.locator(".ak-stamp--back").isVisible()));
      await page.screenshot({ path: path.join(SHOTS, "agent-kit-1440-dusk-studio-clean.png"), clip: await page.locator("#studio").boundingBox() });
      await page.locator(".ak-switch").click();
      ok("bug on shows SENT BACK", await page.locator(".ak-stamp--back").isVisible());
      // focus-visible on every focusable control
      const focusables = await page.$$eval("main a[href], main button:not([disabled]), main input, main [tabindex='0']", (els) => els.length);
      await page.focus("body");
      let missing = [];
      for (let i = 0; i < 80; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || !el.closest("main")) return null;
          const target = el.matches(".ak-bug-input") ? el.nextElementSibling : el;
          const s = getComputedStyle(target);
          return { id: el.outerHTML.slice(0, 80), outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2 };
        });
        if (info && !info.outline) missing.push(info.id);
      }
      ok(`focus-visible outline on main controls (${focusables} focusable)`, missing.length === 0, missing.join(" | "));
      // headings
      const hs = await page.$$eval("main h1, main h2, main h3, main h4", (els) => els.map((e) => +e.tagName[1]));
      const jumps = hs.filter((l, i) => i > 0 && l > hs[i - 1] + 1);
      ok("one h1, no skipped heading levels", hs.filter((l) => l === 1).length === 1 && jumps.length === 0, hs.join(""));
    }

    if (w === 390 && scheme === "dark") {
      // clipboard failure fallback
      await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true }); });
      const art = page.locator('article[data-prompt="1-second-brain.md"]');
      await art.locator("[data-copy-prompt]").click();
      await page.waitForTimeout(200);
      const status = await art.locator('[role="status"]').textContent();
      const sel = await page.evaluate(() => String(window.getSelection()));
      const src = fs.readFileSync(path.join(root, "src/content/agent-kit/prompts/1-second-brain.md"), "utf8");
      ok("clipboard failure selects text and announces", status === "Selected — press Ctrl+C" && sel.trim() === src.trim(), `status=${status} sel=${sel.length}/${src.length}`);
    }
    ok(`${tag} console errors = 0`, errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
}
await browser.close();
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
console.log(results.every((r) => r.pass) ? "ALL PASS" : `${results.filter((r) => !r.pass).length} FAIL`);
