// AK-3 verification: run from the WSL worktree root with the preview server on BASE.
//   node <this> [base]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright-core");

const splitDownload = (buf) => { const s = buf.toString("utf8"); const i = s.indexOf("\n\n"); return { header: s.slice(0, i), body: Buffer.from(s.slice(i + 2), "utf8") }; };
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
    // AK-9: a centered hero with one primary action (to Setup) and a quiet link to the studio
    const hero = await page.evaluate(() => {
      const h = document.querySelector(".ak-hero");
      const prim = [...h.querySelectorAll(".button--primary")].map((b) => b.getAttribute("href"));
      return { prim, link: h.querySelector(".arrow-link")?.getAttribute("href"), align: getComputedStyle(h.querySelector("h1")).textAlign };
    });
    ok(`${tag} hero: one primary action to #setup, a link to #studio, centered`, hero.prim.length === 1 && hero.prim[0] === "#setup" && hero.link === "#studio" && hero.align === "center", JSON.stringify(hero));
    // AK-9: the page's sections in order, each with an accent eyebrow
    const secs = await page.$$eval(".ak > section", (els) => els.map((e) => ({ id: e.id, eyebrow: !!e.querySelector(".eyebrow--accent") })));
    ok(`${tag} sections in order, each eyebrowed`, JSON.stringify(secs.map((s) => s.id)) === JSON.stringify(["top", "how", "studio", "proof", "setup", "costs", "lessons", "faq", "start"]) && secs.every((s) => s.eyebrow), JSON.stringify(secs));
    // AK-9: no placeholder text
    const text = await page.evaluate(() => document.body.innerText + document.documentElement.outerHTML);
    ok(`${tag} no placeholder text`, !/\[Cello|\[Story|\[verify\]|CelloWords|ak-slot/.test(text));
    if (w === 390) {
      const order = await page.evaluate(() => {
        const c = document.querySelector(".ak-controls").getBoundingClientRect().top;
        const b = document.querySelector(".ak-board").getBoundingClientRect().top;
        return c < b;
      });
      ok(`${tag} studio controls above board`, order);
      const sc = await page.$eval(".ak-costs-table", (t) => { const r = t.getBoundingClientRect(); const p = t.parentElement.getBoundingClientRect(); return { right: Math.round(r.right), parent: Math.round(p.right), caption: !!t.querySelector("caption"), cols: t.querySelectorAll("thead th").length }; });
      ok(`${tag} costs table fits the phone with no sideways scroll, captioned, 4 columns`, sc.right <= sc.parent && sc.caption && sc.cols === 4, JSON.stringify(sc));
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
        const dlParts = splitDownload(body);
        ok(`${f} download = version header + source bytes`, /^<!-- Agent Studio Kit, prompt \d\d of 03, v\d+\.\d+, last checked \d{4}-\d\d-\d\d\. Latest: https:\/\/cello\.design\/agent-kit\/ -->$/.test(dlParts.header) && Buffer.compare(dlParts.body, fs.readFileSync(path.join(root, "src/content/agent-kit/prompts", f))) === 0, dlParts.header);
        const t = art.locator("[data-toggle-prompt]");
        await t.click();
        ok(`${f} Show all expands`, (await t.getAttribute("aria-expanded")) === "true" && (await art.locator("pre").getAttribute("data-collapsed")) === null);
        await t.click();
      }
      // studio bug switch
      await page.locator(".ak-switch").click();
      ok("bug off shows PASS", await page.locator(".ak-lane--eval .ak-badge--pass").isVisible() && !(await page.locator(".ak-badge--back").isVisible()));
      await page.screenshot({ path: path.join(SHOTS, "agent-kit-1440-dusk-studio-clean.png"), clip: await page.locator("#studio").boundingBox() });
      await page.locator(".ak-switch").click();
      // with JS the run ends shipped after the fix round (AK-4), so check the outcome sentence; the
      // static SENT BACK still is covered by ak-4-verify under reduced motion and without JS
      ok("bug on announces the planted bug", (await page.locator("#studio-outcome").innerText()).startsWith("Bug planted"));
      // focus-visible on every focusable control
      const focusables = await page.$$eval("main a[href], main button:not([disabled]), main input, main summary, main [tabindex='0']", (els) => els.length);
      await page.focus("body");
      let missing = [];
      for (let i = 0; i < 140; i++) {
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
      // FAQ: keyboard opens and closes each question
      const sums = page.locator(".ak-faq-item summary");
      const nFaq = await sums.count();
      let faqOk = nFaq >= 5 && nFaq <= 7;
      for (let i = 0; i < nFaq; i++) {
        await sums.nth(i).focus();
        await page.keyboard.press(i % 2 ? "Space" : "Enter");
        const open = await page.locator(".ak-faq-item").nth(i).getAttribute("open");
        await page.keyboard.press("Enter");
        const closed = await page.locator(".ak-faq-item").nth(i).getAttribute("open");
        faqOk &&= open !== null && closed === null;
      }
      ok(`FAQ: ${nFaq} questions, each opens and closes from the keyboard`, faqOk);
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
      ok("clipboard failure selects text and announces", status === "Selected. Press Ctrl+C (⌘C on a Mac) to copy." && sel.trim() === src.trim(), `status=${status} sel=${sel.length}/${src.length}`);
    }
    ok(`${tag} console errors = 0`, errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
}
await browser.close();
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
console.log(results.every((r) => r.pass) ? "ALL PASS" : `${results.filter((r) => !r.pass).length} FAIL`);
