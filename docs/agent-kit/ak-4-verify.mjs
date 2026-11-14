// AK-4 verification (updated for AK-9's tool page): the studio moment, Pause motion, reduced
// motion and no-JS. Run from the WSL worktree root after
// `pnpm build`, with `pnpm preview --port 4420` serving dist:
//   node docs/agent-kit/ak-4-verify.mjs [base]
// Covers 390×844 and 1440×900, Day and Dusk, with and without reduced motion, once without JS,
// plus a 4× CPU-throttled scroll trace. Screenshots and a 6-frame run go to docs/agent-kit/shots/ak-4.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("playwright-core");

const splitDownload = (buf) => { const s = buf.toString("utf8"); const i = s.indexOf("\n\n"); return { header: s.slice(0, i), body: Buffer.from(s.slice(i + 2), "utf8") }; };
const BASE = process.argv[2] ?? "http://127.0.0.1:4420";
const URL_ = `${BASE}/agent-kit/`;
const SHOTS = path.join(root, "docs/agent-kit/shots/ak-4");
fs.mkdirSync(SHOTS, { recursive: true });
const exe = path.join(process.env.HOME, ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome");
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass: !!pass, detail });
const STOPS = ["how", "studio", "proof", "setup", "costs", "lessons", "faq", "start"];
const BUG_RUN = [
  "Lead: PANTRY-4 planned, 3 testable criteria",
  "Worker: built on branch pantry-4, test added",
  "Evaluator: sent back. TypeError on /list",
  "Worker: PANTRY-4 is back, fix pushed for round 2",
  "Evaluator: pass, round 2 of 3",
  "Shipper: PANTRY-4 is live",
];
const CLEAN_RUN = [
  "Lead: PANTRY-4 planned, 3 testable criteria",
  "Worker: built on branch pantry-4, test added",
  "Evaluator: pass, all 3 criteria",
  "Shipper: PANTRY-4 is live",
];

// records every announcement in the studio log, with a timestamp, and counts layout reads made by
// the story script (stack contains its chunk) so the scroll path can be checked for none
const INSTRUMENT = () => {
  window.__log = [];
  window.__reads = 0;
  window.__countReads = false;
  // reads inside a ResizeObserver / IntersectionObserver callback are the measure-on-resize path,
  // not the scroll path; everything else the story script reads while scrolling counts
  let inObserver = 0;
  for (const name of ["ResizeObserver", "IntersectionObserver"]) {
    const Orig = window[name];
    window[name] = class extends Orig {
      constructor(cb, opts) { super((...a) => { inObserver++; try { cb(...a); } finally { inObserver--; } }, opts); }
    };
  }
  const mark = () => {
    if (window.__countReads && !inObserver && /AgentKitStory/.test(new Error().stack ?? "")) window.__reads++;
  };
  const gbcr = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () { mark(); return gbcr.call(this); };
  const gcs = window.getComputedStyle;
  window.getComputedStyle = function (...a) { mark(); return gcs.apply(this, a); };
  for (const [proto, props] of [[HTMLElement.prototype, ["offsetWidth", "offsetHeight", "offsetTop", "offsetLeft"]], [Element.prototype, ["clientWidth", "clientHeight", "scrollHeight", "scrollWidth", "scrollTop"]]]) {
    for (const p of props) {
      const d = Object.getOwnPropertyDescriptor(proto, p);
      if (d?.get) Object.defineProperty(proto, p, { ...d, get() { mark(); return d.get.call(this); } });
    }
  }
  // the html's data-motion at the moment <body> is created (before anything can paint)
  new MutationObserver((_, mo) => {
    if (document.body) { window.__motionAtBody = document.documentElement.dataset.motion ?? null; mo.disconnect(); }
  }).observe(document, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", () => {
    const log = document.querySelector("[data-studio-log]");
    if (log) new MutationObserver(() => log.textContent && window.__log.push({ t: performance.now(), s: log.textContent })).observe(log, { childList: true, characterData: true, subtree: true });
  });
};

const toMs = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
const frames = (page, n = 3) => page.evaluate((n) => new Promise((r) => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const state = (page) => page.evaluate(() => {
  const m = document.querySelector("[data-studio-moment]");
  return { step: m.dataset.step ?? null, instant: m.hasAttribute("data-instant"), note: document.getElementById("studio-still").textContent, run: document.querySelector("[data-run-ticket]").textContent.trim() };
});
const waitLog = (page, n, timeout = 15000) => page.waitForFunction((n) => window.__log.length >= n, n, { timeout });
const logs = (page) => page.evaluate(() => window.__log.map((l) => l.s));
async function scrollToStop(page, id) {
  await page.evaluate((id) => window.scrollTo({ top: document.getElementById(id).getBoundingClientRect().top + scrollY - innerHeight * 0.2, behavior: "instant" }), id);
  await frames(page, 4);
}

for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const scheme of ["dark", "light"]) {
    for (const motion of ["no-preference", "reduce"]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: motion, permissions: ["clipboard-read", "clipboard-write"] });
      await ctx.addInitScript(INSTRUMENT);
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      const res = await page.goto(URL_, { waitUntil: "networkidle" });
      const tag = `${w}-${scheme === "dark" ? "dusk" : "day"}${motion === "reduce" ? "-reduced" : ""}`;
      ok(`${tag} status 200`, res.status() === 200);
      ok(`${tag} theme`, (await page.getAttribute("html", "data-theme")) === scheme);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(`${tag} AC6 no horizontal page scroll`, overflow <= 0, `${overflow}px`);
      if (w === 390) {
        const above = await page.evaluate(() => document.querySelector(".ak-controls").getBoundingClientRect().bottom <= document.querySelector(".ak-board").getBoundingClientRect().top);
        ok(`${tag} AC6 studio controls above the board`, above);
      }

      // AC1 (AK-9): the chapter driver is gone; scrolling the page makes no layout reads from the
      // story script, and every section is fully visible as it arrives (no scroll reveals)
      await page.evaluate(() => { window.__reads = 0; window.__countReads = true; });
      for (const id of STOPS) await scrollToStop(page, id);
      const reads = await page.evaluate(() => { window.__countReads = false; return window.__reads; });
      ok(`${tag} AC1 no layout reads by the story script while scrolling`, reads === 0, `${reads} reads`);
      const hidden = await page.evaluate(() => [...document.querySelectorAll(".ak > section, .ak > section *")].filter((e) => !e.closest(".ak-studio") && getComputedStyle(e).opacity !== "1").length);
      ok(`${tag} every section fully visible, no reveal waits`, hidden === 0, `${hidden} hidden`);

      const pauseVisible = await page.locator("[data-motion-toggle]").isVisible();
      if (motion === "reduce") {
        // AC4: everything visible at once with no animation; the studio is the AK-3 still
        await page.goto(URL_, { waitUntil: "networkidle" });
        await scrollToStop(page, "proof");
        const anims = await page.evaluate(() => [...document.querySelectorAll(".ak *")].reduce((n, e) => n + e.getAnimations().length, 0));
        const allVisible = await page.evaluate(() => [...document.querySelectorAll(".ak > section")].every((e) => getComputedStyle(e).opacity === "1"));
        ok(`${tag} AC4 sections fully visible at once, 0 running animations`, allVisible && anims === 0, `animations=${anims}`);
        const st = await state(page);
        const still = await page.evaluate(() => ({ back: !!document.querySelector(".ak-badge--back")?.checkVisibility(), ret: !!document.querySelector(".ak-return")?.checkVisibility() }));
        ok(`${tag} AC4 studio is the static still (no data-step, SENT BACK and route shown)`, st.step === null && still.back && still.ret, JSON.stringify({ ...st, ...still }));
        ok(`${tag} AC3 Pause motion hidden under reduced motion`, !pauseVisible);
        await scrollToStop(page, "studio");
        await page.locator("[data-run-ticket]").focus();
        await page.keyboard.press("Enter");
        await frames(page, 2);
        const after = await state(page);
        const said = await logs(page);
        ok(`${tag} AC4 Run ticket lands the end at once and announces it`, after.step === "ppph" && after.instant && /^Run complete/.test(said.at(-1) ?? ""), `${JSON.stringify(after)} ${said.at(-1)}`);
        if (scheme === "dark") await page.locator("#studio").screenshot({ path: path.join(SHOTS, `studio-${w}-reduced-after-run.png`) });
      } else {
        ok(`${tag} AC3 Pause motion visible, aria-pressed=false`, pauseVisible && (await page.getAttribute("[data-motion-toggle]", "aria-pressed")) === "false");
        // the moment is past by now (scrolled to setup), so it must have settled finished
        const st = await state(page);
        ok(`${tag} AC2 a moment scrolled past settles finished (no burst)`, st.step === "ppph" && st.instant, JSON.stringify(st));
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await frames(page, 2);
      await page.screenshot({ path: path.join(SHOTS, `agent-kit-${tag}.png`), fullPage: true });
      ok(`${tag} AC5 no JS errors`, errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
}

// AC2 + AC3 in depth, both widths, Dusk, normal motion
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
  await ctx.addInitScript(INSTRUMENT);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL_, { waitUntil: "networkidle" });
  const tag = `${w}-dusk`;
  const before = await state(page);
  const outc0 = await page.evaluate(() => document.getElementById("studio-outcome").textContent);
  ok(`${tag} AC7 outcome live region starts with only the current sentence`, outc0 === "Bug planted: the evaluator sends PANTRY-4 back to the worker.", outc0);
  ok(`${tag} AC2 untouched and below the fold: empty rail, waiting`, before.step === "...." && /Run ticket/.test(before.note), JSON.stringify(before));
  ok(`${tag} AC2 Run ticket enabled`, await page.locator("[data-run-ticket]").isEnabled());
  // durations come from the showcase tokens
  const tok = await page.evaluate(() => { const s = getComputedStyle(document.documentElement); return { travel: s.getPropertyValue("--motion-showcase-travel").trim(), stamp: s.getPropertyValue("--motion-showcase-verdict").trim() }; });

  // plays itself once ≥50% of the board is in view; record 6 frames on the wide run
  let stampTiming = null;
  await page.evaluate(() => { const b = document.querySelector(".ak-board"); window.scrollTo({ top: b.getBoundingClientRect().top + scrollY - (innerHeight - Math.min(b.offsetHeight, innerHeight)) / 2, behavior: "instant" }); });
  const shot = async (i) => { if (w === 1440) await page.locator(".ak-studio").screenshot({ path: path.join(SHOTS, `run-frame-${i}.png`), animations: "allow" }); };
  for (let i = 1; i <= 6; i++) {
    await waitLog(page, i);
    if (i === 3) stampTiming = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('[data-lane="eval"] .ak-badge--back')); return { duration: s.animationDuration, delay: s.animationDelay }; });
    // mid-travel on the step it just started
    await page.waitForTimeout(i === 3 || i === 5 ? 1100 : 350);
    await shot(i);
  }
  const auto = await logs(page);
  ok(`${tag} AC2 autoplays once in view (bug on): lead → worker → evaluator sent back → worker → pass → ship`, JSON.stringify(auto) === JSON.stringify(BUG_RUN), auto.join(" | "));
  const durs = await page.evaluate(() => {
    const m = document.querySelector("[data-studio-moment]");
    return { ticket: getComputedStyle(m.querySelector('[data-lane="ship"] .ak-ticket')).animationDuration, gaps: window.__log.slice(1).map((l, i) => Math.round(l.t - window.__log[i].t)) };
  });
  // travel 700 → ticket animation 0.7s; verdict badge 300ms after a 700ms delay; steps every travel+stamp (1000ms), verdicts +stamp (1300ms)
  const gapsOk = durs.gaps.every((g, i) => Math.abs(g - ([2, 4].includes(i) ? 1300 : 1000)) < 120);
  ok(`${tag} AC2 durations from the showcase tokens (travel ${tok.travel}, stamp ${tok.stamp})`, toMs(tok.travel) === 700 && toMs(tok.stamp) === 300 && durs.ticket === "0.7s" && stampTiming?.duration === "0.3s" && stampTiming?.delay === "0.7s" && gapsOk, JSON.stringify({ ...durs, stamp: stampTiming }));
  await page.waitForTimeout(1200);
  const end = await state(page);
  const stamps = await page.evaluate(() => ({ pass: document.querySelector(".ak-badge--pass").checkVisibility(), back: document.querySelector(".ak-badge--back").checkVisibility(), round: document.querySelector('[data-lane="eval"] [data-alt]').textContent, live: document.querySelector('[data-lane="ship"] .ak-ticket').checkVisibility() }));
  ok(`${tag} AC2 ends shipped: round 2 PASS badge, shipper live`, end.step === "ppph" && stamps.pass && !stamps.back && stamps.round === "Round 2 / 3" && stamps.live && end.note === "Showing the end of the run.", JSON.stringify({ ...end, ...stamps }));
  // once only: scrolling away and back doesn't replay
  const n = auto.length;
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await frames(page, 3);
  await page.evaluate(() => document.querySelector(".ak-board").scrollIntoView());
  await page.waitForTimeout(800);
  ok(`${tag} AC2 plays itself only once`, (await logs(page)).length === n);

  // keyboard: switch off with Space, Run with Enter → passes first time
  await page.locator(".ak-bug-input").focus();
  await page.keyboard.press("Space");
  const outc = await page.evaluate(() => { const o = document.getElementById("studio-outcome"); return { live: o.getAttribute("aria-live"), kids: o.children.length, text: o.textContent }; });
  ok(`${tag} AC7 outcome live region holds only the current sentence after the toggle`, outc.live === "polite" && outc.kids === 0 && outc.text === "No bug: PANTRY-4 passes and ships.", JSON.stringify(outc));
  ok(`${tag} AC2 keyboard: Space turns Plant a bug off`, !(await page.locator(".ak-bug-input").isChecked()));
  await page.locator("[data-run-ticket]").focus();
  await page.keyboard.press("Enter");
  await waitLog(page, n + 4);
  await page.waitForTimeout(1200);
  const clean = (await logs(page)).slice(n);
  const cend = await state(page);
  const cstamp = await page.evaluate(() => ({ pass: document.querySelector(".ak-badge--pass").checkVisibility(), back: document.querySelector(".ak-badge--back").checkVisibility(), ret: document.querySelector(".ak-return").checkVisibility(), round: document.querySelector('[data-lane="eval"] [data-alt]').textContent }));
  ok(`${tag} AC2 bug off: Run ticket (Enter) passes first time and ships, replayable`, JSON.stringify(clean) === JSON.stringify(CLEAN_RUN) && cend.step === "ppph" && cstamp.pass && !cstamp.back && !cstamp.ret && cstamp.round === "Round 1 / 3", `${clean.join(" | ")} ${JSON.stringify(cstamp)}`);
  if (w === 1440) await page.locator(".ak-studio").screenshot({ path: path.join(SHOTS, "studio-1440-dusk-clean-end.png") });

  // bug back on, Run with Space: replays the full sent-back story
  await page.locator(".ak-bug-input").focus();
  await page.keyboard.press("Space");
  await page.locator("[data-run-ticket]").focus();
  const m0 = (await logs(page)).length;
  await page.keyboard.press("Space");
  await waitLog(page, m0 + 3);
  const st3 = await state(page);
  ok(`${tag} AC2 replay (Space) with the bug: evaluator marks SENT BACK`, (await logs(page))[m0 + 2] === BUG_RUN[2] && st3.step === "pph." && (await page.locator(".ak-badge--back").isVisible()), JSON.stringify(st3));
  const live = await page.getAttribute("[data-studio-log]", "aria-live");
  ok(`${tag} AC2 steps announced in a polite live region`, live === "polite");

  // AC3: Pause mid-run lands at the end at once
  await page.locator("[data-motion-toggle]").focus();
  await page.keyboard.press("Enter");
  await frames(page, 2);
  const paused = await page.evaluate(() => ({ pressed: document.querySelector("[data-motion-toggle]").getAttribute("aria-pressed"), html: document.documentElement.dataset.motion, saved: localStorage.getItem("ak-motion"), texture: (({ animationName: n, animationPlayState: p }) => (n === "none" ? "off" : p))(getComputedStyle(document.querySelector(".texture-layer"))), running: document.getAnimations().filter((a) => a instanceof CSSAnimation && a.playState === "running").length }));
  const pst = await state(page);
  ok(`${tag} AC3 Pause motion: aria-pressed, saved, every loop stopped, moment landed at its end`, paused.pressed === "true" && paused.html === "paused" && paused.saved === "paused" && paused.texture !== "running" && paused.running === 0 && pst.step === "ppph" && pst.instant, JSON.stringify({ ...paused, ...pst }));
  if (w === 1440) {
    await page.reload({ waitUntil: "networkidle" });
    const re = await page.evaluate(() => ({ atBody: window.__motionAtBody, pressed: document.querySelector("[data-motion-toggle]").getAttribute("aria-pressed"), step: document.querySelector("[data-studio-moment]").dataset.step, running: document.getAnimations().filter((a) => a instanceof CSSAnimation && a.playState === "running").length }));
    ok(`${tag} AC3 after reload: paused before <body> exists (before first paint), moment at its end, nothing running`, re.atBody === "paused" && re.pressed === "true" && re.step === "ppph" && re.running === 0, JSON.stringify(re));
    await page.evaluate(() => document.querySelector(".ak-board").scrollIntoView());
    await page.locator("[data-run-ticket]").click();
    await frames(page, 2);
    ok(`${tag} AC3 Run ticket while paused lands the end and announces it`, /^Run complete/.test((await logs(page)).at(-1) ?? "") && (await state(page)).instant);
    await page.locator("[data-motion-toggle]").click();
    ok(`${tag} AC3 un-pause clears the saved choice`, (await page.evaluate(() => localStorage.getItem("ak-motion"))) === null && (await page.getAttribute("[data-motion-toggle]", "aria-pressed")) === "false");
  }
  ok(`${tag} AC5 no JS errors in the run`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// AC2: a moment jumped over (the hero's Get prompt 01, straight to Setup) settles finished, no burst
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "networkidle" });
  await page.locator('.ak-hero a.button--primary[href="#setup"]').click();
  await page.waitForTimeout(1500);
  const st = await state(page);
  ok("AC2 jumping past the studio from the hero settles it finished (instant end state)", st.step === "ppph" && st.instant, JSON.stringify(st));
  await ctx.close();
}

// AC6: without JS the page is complete: the studio still, every section visible
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark", javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({
    enhanced: document.querySelector("[data-studio-moment]").hasAttribute("data-enhanced"),
    step: document.querySelector("[data-studio-moment]").hasAttribute("data-step"),
    back: document.querySelector(".ak-badge--back").checkVisibility(),
    lanes: [...document.querySelectorAll(".ak-lane .ak-ticket")].filter((e) => e.checkVisibility()).length,
    disabled: [...document.querySelectorAll("[data-run-ticket], [data-motion-toggle]")].every((b) => b.disabled),
    faq: document.querySelectorAll(".ak-faq-item summary").length,
    fallback: [...document.querySelectorAll("#studio-outcome [data-when]")].filter((e) => e.checkVisibility()).map((e) => e.textContent).join(),
    hidden: [...document.querySelectorAll(".ak > section, .ak-story, .ak-step, .ak-prompt")].filter((e) => getComputedStyle(e).opacity !== "1").length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  ok("no-JS AC6/AC7 the still: not enhanced, SENT BACK still, buttons disabled, FAQ present, everything visible, static outcome sentence", !r.enhanced && !r.step && r.back && r.lanes === 3 && r.disabled && r.faq >= 5 && r.hidden === 0 && r.overflow <= 0 && r.fallback === "Bug planted: the evaluator sends PANTRY-4 back to the worker.", JSON.stringify(r));
  await page.screenshot({ path: path.join(SHOTS, "agent-kit-390-dusk-nojs.png"), fullPage: true });
  await ctx.close();
}

// AC6: copy / download still work (one prompt, 1440 Day)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "networkidle" });
  const f = "2-session-notes.md";
  const src = fs.readFileSync(path.join(root, "src/content/agent-kit/prompts", f), "utf8");
  const art = page.locator(`article[data-prompt="${f}"]`);
  await art.locator("[data-copy-prompt]").click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  const dl = await art.locator("a[download]").getAttribute("href");
  const body = await (await page.request.get(BASE + dl)).body();
  ok("AC6 copy still copies the exact prompt, download serves the exact bytes", clip === src && splitDownload(body).header.startsWith("<!-- Agent Studio Kit, prompt") && Buffer.compare(splitDownload(body).body, Buffer.from(src)) === 0);
  await ctx.close();
}

// AC5: script weight and a 4× CPU-throttled scroll trace
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  const page = await ctx.newPage();
  const js = new Map();
  page.on("response", async (r) => { if (r.request().resourceType() === "script" && r.url().startsWith(BASE)) js.set(r.url(), await r.body().catch(() => Buffer.alloc(0))); });
  await page.goto(URL_, { waitUntil: "networkidle" });
  const html = await (await page.request.get(URL_)).text();
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((s) => /data-copy-prompt|ak-motion/.test(s)).join("\n");
  const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
  const story = [...js].filter(([u]) => /AgentKitStory/.test(u)).reduce((n, [, b]) => n + gz(b), 0);
  const pageOwn = story + gz(Buffer.from(inline));
  const all = [...js].reduce((n, [, b]) => n + gz(b), 0);
  const distStory = fs.readdirSync(path.join(root, "dist/_astro")).filter((f) => /^AgentKitStory.*\.js$/.test(f)).map((f) => `${f} ${gz(fs.readFileSync(path.join(root, "dist/_astro", f)))} B gz`);
  ok(`AC5 agent-kit island + scripts ≤ 20 kB gz (story ${story} B + inline copy/motion ${gz(Buffer.from(inline))} B = ${pageOwn} B; for scale, every script the page loads incl. the site-wide router/analytics: ${all} B)`, pageOwn <= 20480, distStory.join(", "));

  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
  const t0 = await page.evaluate(() => performance.now());
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(50);
  }
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);
  const trace = JSON.parse((await browser.stopTracing()).toString());
  const ev = trace.traceEvents;
  const main = ev.find((e) => e.name === "thread_name" && e.args?.name === "CrRendererMain" && ev.some((x) => x.pid === e.pid && x.name === "RunTask"));
  const tasks = ev.filter((e) => e.name === "RunTask" && e.ph === "X" && main && e.pid === main.pid && e.tid === main.tid).map((e) => e.dur / 1000);
  const max = Math.max(0, ...tasks);
  ok(`AC5 4× CPU throttle scroll trace: longest main-thread task ${max.toFixed(1)} ms (≤ 50), ${tasks.length} tasks`, max <= 50);
  void t0;
  await ctx.close();
}

await browser.close();
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
console.log(results.every((r) => r.pass) ? `ALL PASS (${results.length})` : `${results.filter((r) => !r.pass).length} FAIL of ${results.length}`);
