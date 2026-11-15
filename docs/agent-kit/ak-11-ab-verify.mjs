// AK-11 A/B verification: run from the WSL worktree root with the built site on BASE.
//   node <this> [base]
// PostHog requests are blocked, so this run counts nothing.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright-core");

const BASE = process.argv[2] ?? "http://127.0.0.1:4431";
const URL_ = `${BASE}/agent-kit/`;
const SHOTS = path.join(root, "docs/agent-kit/shots/ak-11");
fs.mkdirSync(SHOTS, { recursive: true });
const exe = path.join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });
const A = "Hand off a ticket, go get pizza, come back to a checked build";
const B = "A full software team in your hand, and nothing ships until you say so";

async function open(ctx, url) {
  const page = await ctx.newPage();
  await page.route(/posthog|i\.posthog\.com/, (r) => r.abort());
  const errors = [];
  page.on("console", (m) => m.type() === "error" && !/posthog|ERR_FAILED/i.test(m.text()) && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  const st = await page.evaluate(() => ({
    hero: document.querySelector(".ak-hero").dataset.hero ?? null,
    h1: document.querySelector("h1").innerText.replace(/\s+/g, " ").trim(),
    stored: (() => { try { return localStorage.getItem("ak-hero"); } catch { return "throws"; } })(),
    ctas: [...document.querySelectorAll('[data-cta^="ak-"]')].map((e) => e.dataset.cta),
    h1Height: Math.round(document.querySelector("h1").getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  return { page, st, errors };
}

for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const v of ["a", "b"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const { page, st, errors } = await open(ctx, `${URL_}?hero=${v}`);
    const want = v === "a" ? A : B;
    ok(`${w} ?hero=${v} shows only headline ${v.toUpperCase()}`, st.hero === v && st.h1 === want, JSON.stringify({ hero: st.hero, h1: st.h1 }));
    ok(`${w} ?hero=${v} preview is not saved`, st.stored === null, String(st.stored));
    const expect = ["ak-hero-setup", "ak-hero-studio", "ak-copy-01", "ak-download-01", "ak-copy-02", "ak-download-02", "ak-copy-03", "ak-download-03", "ak-close-setup"].map((c) => `${c}-${v}`).sort();
    ok(`${w} ?hero=${v} every ak- click code carries -${v}`, JSON.stringify([...st.ctas].sort()) === JSON.stringify(expect), JSON.stringify(st.ctas));
    ok(`${w} ?hero=${v} no horizontal scroll, console clean`, st.overflow <= 0 && errors.length === 0, JSON.stringify({ overflow: st.overflow, errors }));
    await page.screenshot({ path: path.join(SHOTS, `hero-${w}-${v}.png`) });
    await ctx.close();
  }
}

// a first visit picks a letter, saves it, and keeps it on return
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const first = await open(ctx, URL_);
  const second = await open(ctx, URL_);
  ok("first visit saves a letter and a return visit keeps it", ["a", "b"].includes(first.st.stored) && first.st.hero === first.st.stored && second.st.hero === first.st.stored, JSON.stringify({ first: first.st.hero, stored: first.st.stored, again: second.st.hero }));
  await ctx.close();
}

// both letters show up across fresh browsers (40 tries: the chance of all one letter is ~2e-12)
{
  const seen = { a: 0, b: 0 };
  for (let i = 0; i < 40; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.route(/posthog/, (r) => r.abort());
    await page.goto(URL_, { waitUntil: "domcontentloaded" });
    seen[await page.evaluate(() => document.querySelector(".ak-hero").dataset.hero)]++;
    await ctx.close();
  }
  ok("fresh browsers split between A and B", seen.a > 5 && seen.b > 5, JSON.stringify(seen));
}

// without script: headline A, no letter
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "load" });
  const st = await page.evaluate(() => ({ h1: document.querySelector("h1").innerText.replace(/\s+/g, " ").trim(), hero: document.querySelector(".ak-hero").dataset.hero ?? null }));
  ok("no-JS shows headline A", st.h1 === A && st.hero === null, JSON.stringify(st));
  await ctx.close();
}

// local storage blocked: still one headline, no error
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  const { st, errors } = await open(ctx, URL_);
  ok("blocked storage still shows one headline, no errors", [A, B].includes(st.h1) && errors.length === 0, JSON.stringify({ h1: st.h1, errors }));
  await ctx.close();
}

await browser.close();
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
const failed = results.filter((r) => !r.pass).length;
console.log(failed ? `${failed} FAILED` : `ALL PASS (${results.length})`);
process.exit(failed ? 1 : 0);
