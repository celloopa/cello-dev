// Screen audit: visits every built route at six widths in Dusk and Day and flags text that is
// cut off, spills out of its box, breaks mid-word or leaves a one-word last line, anything that
// runs off the side of the screen, horizontal page scroll, and tap targets under 44 px.
// Each flagged element is screenshotted with its surroundings and an outline.
//
//   pnpm build && pnpm screen:audit [outDir]
//     [--pages /,/about/]          only these routes (default: every page in dist/)
//     [--widths 360,390,...]       default 360,390,768,1024,1440,1920
//     [--themes dark,light]        Dusk and Day (default both)
//     [--sizes 1280x720,844x390]   exact viewports instead of --widths (short laptops, phones on their side)
//     [--base https://...]         audit a deployed site (a deploy preview) instead of dist/
//     [--baseline <findings.json>] list groups that are new or gone since an earlier run
//     [--shots n]                  screenshots per finding group (default 3)
//     [--concurrency n]            pages open at once (default 4)
//
// Writes <outDir>/findings.json (every instance), <outDir>/summary.md (findings grouped by
// cause, worst first) and <outDir>/shots/*.png. Default outDir: .screen-audit/<date>/.
// Uses the Chrome or Playwright Chromium already on the machine (no download); set
// CHROME_PATH to pick one.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const today = new Date().toISOString().slice(0, 10);
const out = path.resolve(argv[0] && !argv[0].startsWith("--") ? argv[0] : `.screen-audit/${today}`);
const SIZES = arg("--sizes")?.split(",").map((s) => s.split("x").map(Number));
const WIDTHS = SIZES ? SIZES.map(([w]) => w) : (arg("--widths") ?? "360,390,768,1024,1440,1920").split(",").map(Number);
const THEMES = (arg("--themes") ?? "dark,light").split(",");
const SHOTS_PER_GROUP = Number(arg("--shots") ?? 3);
const CONCURRENCY = Number(arg("--concurrency") ?? 4);
const THEME_NAME = { dark: "Dusk", light: "Day" };
const HEIGHT = (w) => SIZES?.find(([x]) => x === w)?.[1] ?? (w < 700 ? 844 : w < 1200 ? 1024 : 900);
fs.mkdirSync(path.join(out, "shots"), { recursive: true });

// ---- routes and server -------------------------------------------------------------------
const dist = path.resolve("dist");
let base = arg("--base")?.replace(/\/$/, "");
let server;
function routesFromDist() {
  if (!fs.existsSync(path.join(dist, "index.html"))) { console.error("dist/ is missing: run pnpm build first (or pass --pages with --base)"); process.exit(2); }
  const routes = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) { if (!["_astro", "images", "videos", "fonts", "pagefind"].includes(e.name)) walk(f); }
      else if (e.name === "index.html") routes.push("/" + path.relative(dist, dir).split(path.sep).join("/") + (dir === dist ? "" : "/"));
      else if (e.name === "404.html" && dir === dist) routes.push("/404.html");
    }
  };
  walk(dist);
  return routes.map((r) => r.replace(/^\/\//, "/")).sort((a, b) => a.length - b.length || a.localeCompare(b));
}
const PAGES = arg("--pages")?.split(",") ?? routesFromDist();
if (!base) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".woff2": "font/woff2", ".woff": "font/woff", ".webm": "video/webm", ".mp4": "video/mp4", ".json": "application/json", ".pdf": "application/pdf", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml" };
  server = http.createServer((req, res) => {
    let f = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": types[path.extname(f).toLowerCase()] ?? "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
}

// ---- browser -------------------------------------------------------------------------------
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = path.join(os.homedir(), ".cache", "ms-playwright");
  if (fs.existsSync(cache)) {
    const dirs = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
    for (const d of dirs) for (const rel of ["chrome-linux64/chrome", "chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
      const f = path.join(cache, d, rel);
      if (fs.existsSync(f)) return f;
    }
  }
  return null; // fall back to an installed Chrome
}
const exe = findChrome();
const browser = await chromium.launch({
  ...(exe ? { executablePath: exe } : { channel: "chrome" }),
  args: ["--font-render-hinting=none", "--disable-gpu", "--force-color-profile=srgb", "--hide-scrollbars"],
});

// ---- the in-page checks ----------------------------------------------------------------------
// Runs inside the page. Returns raw findings with a CSS path for re-finding the element.
function inspect({ width }) {
  const vw = document.documentElement.clientWidth;
  const out = [];
  const cs = (e) => getComputedStyle(e);
  const TEXT_SET = "h1,h2,h3,h4,h5,h6,button,a,label,li,p,figcaption,dt,dd,th,td,summary,blockquote,span,small,strong,em,time,div";
  const UI_CLASS = /title|label|eyebrow|tag|chip|badge|pill|kicker|meta|name|heading|caption|btn|button|link|nav|role|date/i;

  const cssPath = (el) => {
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && e !== document.documentElement; e = e.parentElement) {
      const p = e.parentElement;
      const i = p ? [...p.children].indexOf(e) + 1 : 1;
      parts.unshift(`${e.tagName.toLowerCase()}:nth-child(${i})`);
    }
    return "html > " + parts.join(" > ");
  };
  // A readable, stable name for grouping: tag + its own classes (Astro's scoped classes dropped),
  // with the nearest classed ancestor when the element itself has none.
  const sig = (el) => {
    const own = (e) => {
      const cls = [...e.classList].filter((c) => !/^astro-|^svelte-|^is-|^has-/.test(c)).slice(0, 2);
      return e.tagName.toLowerCase() + cls.map((c) => "." + c).join("");
    };
    let s = own(el);
    if (!/\./.test(s)) {
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const o = own(a);
        if (/\./.test(o) || ["header", "footer", "nav", "main", "article", "aside"].includes(a.tagName.toLowerCase())) { s = o + " " + s; break; }
      }
    }
    return s;
  };
  const hiddenTree = (el) => {
    const shut = el.closest("details:not([open])");
    if (shut && !el.closest("summary")) return true; // inside a closed disclosure
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (e.getAttribute("aria-hidden") === "true" || e.hasAttribute("inert") || e.hidden) return true;
      const s = cs(e);
      if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return true;
      const r = e.getBoundingClientRect();
      if (r.width <= 2 && r.height <= 2 && (s.position === "absolute" || s.overflow !== "visible")) return true; // sr-only
      if (/inset\(50%|inset\(100%/.test(s.clipPath) || s.clip?.startsWith("rect(0")) return true;
    }
    return false;
  };
  const isBlockish = (e) => !["inline", "contents"].includes(cs(e).display);
  const blockOf = (e) => { while (e && !isBlockish(e)) e = e.parentElement; return e; };
  const pad = (e) => { const s = cs(e), r = e.getBoundingClientRect(); return { left: r.left + e.clientLeft, top: r.top + e.clientTop, right: r.left + e.clientLeft + e.clientWidth, bottom: r.top + e.clientTop + e.clientHeight }; };
  const shortText = (e) => (e.innerText || e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 90);
  const docRect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const style = (el) => { const s = cs(el); return { fontSize: s.fontSize, fontFamily: s.fontFamily.split(",")[0].replace(/"/g, ""), textWrap: s.textWrap || s.textWrapStyle, whiteSpace: s.whiteSpace, overflowWrap: s.overflowWrap, wordBreak: s.wordBreak, hyphens: s.hyphens, letterSpacing: s.letterSpacing, textTransform: s.textTransform }; };
  const push = (kind, el, detail, extra = {}) => out.push({ kind, sig: sig(el), path: cssPath(el), text: shortText(el), detail, rect: docRect(el), style: style(el), ...extra });

  // Text nodes worth checking: visible, not decorative, not code (code blocks scroll on purpose).
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest("script,style,noscript,svg,pre,code,textarea,template") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const seen = { clip: new Set(), spill: new Set(), off: new Set(), word: new Set(), fade: new Set(), cover: new Set() };
  const textBoxes = [];
  const hiddenCache = new Map();
  const isHidden = (el) => { if (!hiddenCache.has(el)) hiddenCache.set(el, hiddenTree(el)); return hiddenCache.get(el); };
  for (let n; (n = walker.nextNode()); ) {
    const el = n.parentElement;
    if (isHidden(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
    if (!rects.length) continue;
    const fs_ = parseFloat(cs(el).fontSize) || 16;
    const L = Math.min(...rects.map((r) => r.left)), R = Math.max(...rects.map((r) => r.right));
    const T = Math.min(...rects.map((r) => r.top)), B = Math.max(...rects.map((r) => r.bottom));

    // 1. clipped by an ancestor with overflow hidden/clip (html and body count as the viewport)
    let clipped = null, scroller = false;
    for (let a = el; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
      const s = cs(a);
      const ox = s.overflowX, oy = s.overflowY;
      if (/auto|scroll/.test(ox) || (/auto|scroll/.test(oy) && a.scrollHeight > a.clientHeight + 1)) { scroller = true; break; }
      if (/hidden|clip/.test(ox) || /hidden|clip/.test(oy)) {
        const p = pad(a);
        const dx = /hidden|clip/.test(ox) ? Math.max(p.left - L, R - p.right) : 0;
        const dy = /hidden|clip/.test(oy) ? Math.max(p.top - T, B - p.bottom) : 0;
        if (dx > 2 || dy > fs_ * 0.35) { clipped = { by: sig(a), dx: Math.round(dx), dy: Math.round(dy), path: cssPath(a) }; break; }
      }
    }
    if (scroller) continue;
    const host = blockOf(el);
    textBoxes.push({ node: n, el, host });

    // faded: a mask or a low opacity on the way up dims the words themselves
    if (host && !seen.fade.has(host)) {
      let op = 1, mask = null;
      for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
        const s = cs(a);
        op *= Number(s.opacity);
        const m = s.maskImage && s.maskImage !== "none" ? s.maskImage : s.webkitMaskImage && s.webkitMaskImage !== "none" ? s.webkitMaskImage : null;
        if (m && !mask) mask = sig(a);
      }
      if (mask || op < 0.75) { seen.fade.add(host); push("faded", host, mask ? `text sits under a mask on ${mask}` : `text drawn at ${Math.round(op * 100)}% opacity`, { opacity: op }); }
    }
    if (clipped && !seen.clip.has(host)) { seen.clip.add(host); push("clipped", host, `text cut off by ${clipped.by} (${clipped.dx ? clipped.dx + "px sideways" : ""}${clipped.dx && clipped.dy ? ", " : ""}${clipped.dy ? clipped.dy + "px vertically" : ""})`, { clipper: clipped.path }); continue; }

    // 2. off the side of the screen
    if ((R > vw + 1 || L < -1) && !seen.off.has(host)) { seen.off.add(host); push("text-offscreen", host, `text runs ${R > vw + 1 ? Math.round(R - vw) + "px past the right edge" : Math.round(-L) + "px past the left edge"}`); continue; }

    // 3. spills out of its own box (sideways; vertically only when clearly past the line box)
    if (host && !seen.spill.has(host)) {
      const p = pad(host);
      const dx = Math.max(R - p.right, p.left - L), dy = B - p.bottom;
      if (dx > 2 || (dy > fs_ * 0.6 && cs(host).height !== "auto")) { seen.spill.add(host); push("spills", host, `text spills ${dx > 2 ? Math.round(dx) + "px past its box sideways" : Math.round(dy) + "px below its box"}`); }
    }
  }

  // 4. ellipsis and line-clamp truncation
  for (const el of document.querySelectorAll("body *")) {
    const s = cs(el);
    if (s.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1 && !isHidden(el)) push("ellipsis", el, `truncated with an ellipsis (${el.scrollWidth}px of text in ${el.clientWidth}px)`);
    const clamp = s.webkitLineClamp || s.lineClamp;
    if (clamp && clamp !== "none" && el.scrollHeight > el.clientHeight + 1 && !isHidden(el)) push("line-clamp", el, `clamped to ${clamp} lines, ${el.scrollHeight - el.clientHeight}px of text hidden`);
  }

  // 5. scrollWidth/scrollHeight overflow on non-scrolling text components
  for (const el of document.querySelectorAll(TEXT_SET)) {
    if (el.tagName === "DIV" || el.tagName === "SPAN") { if (!UI_CLASS.test(el.className)) continue; }
    if (!isBlockish(el) || isHidden(el) || seen.spill.has(el) || seen.clip.has(el)) continue;
    const s = cs(el);
    if (/auto|scroll/.test(s.overflowX + s.overflowY)) continue;
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && (el.innerText || "").trim()) {
      // only content that takes up room counts; an absolutely placed frame or shadow is decoration
      const right = pad(el).right;
      const culprit = [...el.querySelectorAll("*")].find((d) => !/absolute|fixed/.test(cs(d).position) && !d.closest("[aria-hidden=true]") && d.getBoundingClientRect().right > right + 2);
      if (culprit) push("overflow-box", el, `content is ${el.scrollWidth - el.clientWidth}px wider than its box (${sig(culprit)})`);
    }
  }

  // 5b. covered: something opaque is painted over the words (a fixed bar, the rail, the guide,
  // an image). Each text is tested where a reader would meet it: first-screen text at the top of
  // the page, everything else scrolled to the middle of the screen.
  const vh = innerHeight;
  const pe = document.createElement("style");
  pe.textContent = "*,*::before,*::after{pointer-events:auto!important}";
  document.head.append(pe);
  const opaque = (e) => {
    const s = cs(e);
    if (Number(s.opacity) < 0.5 || s.mixBlendMode !== "normal" || s.visibility === "hidden") return false;
    if (/^(IMG|CANVAS|VIDEO|PICTURE|IFRAME|svg)$/.test(e.tagName)) return true;
    const bg = s.backgroundColor.match(/[\d.]+/g);
    return (bg && (bg.length < 4 || Number(bg[3]) > 0.5)) || s.backgroundImage !== "none";
  };
  for (const { node, el, host } of textBoxes.slice(0, 2500)) {
    if (!host || seen.cover.has(host) || seen.clip.has(host) || seen.off.has(host)) continue;
    const r0 = (() => { const r = document.createRange(); r.selectNodeContents(node); return r; })();
    const first = r0.getClientRects()[0];
    if (!first) continue;
    const docTop = first.top + scrollY;
    const target = docTop < vh * 0.6 ? 0 : docTop - vh / 2;
    if (Math.abs(scrollY - target) > 1) window.scrollTo(0, target);
    const lines = [...r0.getClientRects()].filter((r) => r.width > 4).slice(0, 3);
    let hit = null;
    for (const r of lines) {
      for (const x of [r.left + 3, (r.left + r.right) / 2, r.right - 3]) {
        const y = (r.top + r.bottom) / 2;
        if (x < 0 || x > vw || y < 0 || y > vh) continue;
        for (const top of document.elementsFromPoint(x, y)) {
          if (top === el || el.contains(top) || top.contains(el)) break;
          if (top === pe) continue;
          // hit through a ::before/::after (a stretched card link): only an opaque pseudo counts
          const inBox = [...top.getClientRects()].some((b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom);
          if (!inBox) {
            const solid = ["::before", "::after"].some((ps) => {
              const s = getComputedStyle(top, ps);
              if (s.content === "none" || s.content === "normal" || Number(s.opacity) < 0.5) return false;
              const bg = s.backgroundColor.match(/[\d.]+/g);
              return (bg && (bg.length < 4 || Number(bg[3]) > 0.5)) || s.backgroundImage !== "none";
            });
            if (solid) { hit = top; break; }
            continue;
          }
          if (opaque(top)) { hit = top; break; }
        }
        if (hit) break;
      }
      if (hit) break;
    }
    if (hit) { seen.cover.add(host); const fixed = /fixed|sticky/.test(cs(hit).position) || !!hit.closest("[style*=fixed]"); push("covered", host, `text covered by ${sig(hit)}${target === 0 ? " on first load" : " when scrolled to mid-screen"}`, { coveredBy: sig(hit), fixed, scrollTo: Math.round(scrollY) }); }
  }
  pe.remove();
  window.scrollTo(0, 0);

  // 6. headings: one-word last line, words broken mid-word
  const wordLines = (el) => {
    const words = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode()); ) {
      if (n.parentElement.closest("[aria-hidden=true]") || isHidden(n.parentElement)) continue;
      for (const m of n.nodeValue.matchAll(/\S+/g)) {
        const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        const rs = [...r.getClientRects()].filter((x) => x.width > 0.5);
        if (rs.length) words.push({ w: m[0], node: n, start: m.index, rects: rs });
      }
    }
    return words;
  };
  const brokenAt = (wd) => {
    // find the character where the word wraps; report whether it wraps after a hyphen or slash
    const r = document.createRange();
    let prevTop = null;
    for (let i = 0; i < wd.w.length; i++) {
      r.setStart(wd.node, wd.start + i); r.setEnd(wd.node, wd.start + i + 1);
      const c = r.getClientRects()[0];
      if (!c) continue;
      if (prevTop !== null && Math.abs(c.top - prevTop) > 2) return { at: i, soft: /[-/–—]/.test(wd.w[i - 1]) };
      prevTop = c.top;
    }
    return { at: -1, soft: true };
  };
  const SHORT = "h1,h2,h3,h4,h5,h6,button,a,label,summary,dt,th,figcaption,[class*=title],[class*=label],[class*=eyebrow],[class*=tag],[class*=name],[class*=role],[class*=btn]";
  for (const el of document.querySelectorAll(SHORT)) {
    if (isHidden(el) || !isBlockish(el) && !/^H\d$/.test(el.tagName)) continue;
    const text = shortText(el);
    if (!text || text.length > 160) continue;
    if (el.querySelector("h1,h2,h3,h4,h5,h6,p,li") && !/^H\d$/.test(el.tagName)) continue; // containers, not labels
    const words = wordLines(el);
    for (const wd of words) {
      const tops = new Set(wd.rects.map((x) => Math.round(x.top / 3)));
      if (tops.size > 1 && !seen.word.has(el)) {
        const b = brokenAt(wd);
        if (b.at > 0 && !b.soft) { seen.word.add(el); push("broken-word", el, `"${wd.w}" breaks mid-word as "${wd.w.slice(0, b.at)}|${wd.w.slice(b.at)}"`); }
      }
    }
    if (/^H\d$/.test(el.tagName) && words.length >= 3) {
      const lines = [];
      for (const wd of words) {
        const top = wd.rects[0].top;
        const line = lines.find((l) => Math.abs(l.top - top) < (parseFloat(cs(el).fontSize) || 16) * 0.5);
        if (line) line.words.push(wd.w); else lines.push({ top, words: [wd.w] });
      }
      lines.sort((a, b) => a.top - b.top);
      const last = lines[lines.length - 1];
      if (lines.length >= 2 && last.words.length === 1 && last.words[0].replace(/\W/g, "").length > 0) push("orphan", el, `last of ${lines.length} lines is the single word "${last.words[0]}"`, { lines: lines.length });
    }
  }

  // 7. elements that run off the side of the screen (top-most offender only)
  const off = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.right > vw + 1 || r.left < -1); };
  const clippedByAncestor = (e) => {
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const s = cs(a);
      if (/hidden|clip|auto|scroll/.test(s.overflowX)) { const r = a.getBoundingClientRect(); if (r.right <= vw + 1 && r.left >= -1) return true; }
      if (s.position === "fixed" && /translate|matrix/.test(s.transform) && off(a)) return true; // off-canvas panel
    }
    return false;
  };
  for (const el of document.querySelectorAll("body *")) {
    if (!off(el) || isHidden(el) || clippedByAncestor(el)) continue;
    if (el.parentElement && el.parentElement !== document.body && off(el.parentElement) && !clippedByAncestor(el.parentElement)) continue;
    const s = cs(el);
    if (s.position === "fixed" && s.pointerEvents === "none") continue;
    const r = el.getBoundingClientRect();
    const hasText = !!(el.innerText || "").trim();
    push(hasText ? "element-offscreen" : "art-bleeds", el, `${Math.round(Math.max(r.right - vw, -r.left))}px past the ${r.right > vw + 1 ? "right" : "left"} edge${hasText ? "" : " (no text: decorative bleed?)"}`);
  }

  // 8. horizontal page scroll
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) out.push({ kind: "page-scroll", sig: "page", path: "html", text: "", detail: `page scrolls sideways by ${sw - vw}px`, rect: { x: 0, y: 0, w: sw, h: 1 }, style: {} });

  // 9. tap targets under 44 px (phones and tablets only; links inside running text are exempt).
  // The size is what takes the tap: probed outward from the centre with elementFromPoint, so an
  // invisible ::before hit area counts and a box covered by something else doesn't.
  const hitArea = (el) => {
    const r0 = el.getBoundingClientRect();
    const top = r0.top + scrollY;
    if (r0.top < 60 || r0.bottom > innerHeight - 60) window.scrollTo(0, Math.max(0, top - innerHeight / 2));
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const mine = (x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === el || el.contains(t)); };
    const reach = (dx, dy) => { let n = 0; while (n < 40 && mine(cx + dx * (n + 1), cy + dy * (n + 1))) n++; return n; };
    if (!mine(cx, cy)) return { w: Math.round(r.width), h: Math.round(r.height) };
    return { w: reach(-1, 0) + reach(1, 0) + 1, h: reach(0, -1) + reach(0, 1) + 1 };
  };
  if (width <= 1024) {
    for (const el of document.querySelectorAll("a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[tabindex]:not([tabindex='-1'])")) {
      if (isHidden(el)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (cs(el).display === "inline" && el.parentElement && [...el.parentElement.childNodes].some((c) => c !== el && c.nodeType === 3 && c.nodeValue.trim())) continue;
      if (el.closest("p,li,dd,blockquote,figcaption") && cs(el).display === "inline") continue;
      if (r.width >= 44 && r.height >= 44) continue;
      const hit = hitArea(el);
      if (hit.w < 44 || hit.h < 44) push("small-target", el, `tap target ${hit.w}×${hit.h}px`, { target: [hit.w, hit.h] });
    }
  }
  return out;
}

// ---- type-role lookup: which --type-* token a computed font size comes from ---------------------
function typeRoles() {
  const names = new Set();
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules; } catch { continue; }
    for (const r of rules) if (r.style) for (const p of r.style) if (p.startsWith("--type-") && !/leading|tracking|weight|family/.test(p)) names.add(p);
  }
  const probe = document.createElement("div");
  probe.style.position = "absolute"; probe.style.visibility = "hidden";
  document.body.append(probe);
  const map = {};
  for (const n of names) { probe.style.fontSize = `var(${n})`; const v = getComputedStyle(probe).fontSize; (map[v] ??= []).push(n); }
  probe.remove();
  return map;
}

// ---- page loading (same settling as ui-shots: reveals finished, lazy media loaded) -----------
async function load(page, url) {
  const res = await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    await Promise.race([Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))), new Promise((r) => setTimeout(r, 4000))]);
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({ content: "*,*::before,*::after{caret-color:transparent!important}[data-reveal],[data-reveal]::before{transition:none!important}" });
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-revealed"));
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming?.();
      if (t && Number.isFinite(t.endTime)) a.finish(); else { a.pause(); a.currentTime = 0; }
    }
  });
  await page.waitForTimeout(250);
  return res?.status() ?? 0;
}

// Outline the element and capture it with some page around it.
async function shoot(page, f, file) {
  const ctx = 120;
  const dims = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
  if (f.kind === "covered") {
    // what's on top depends on where the page is scrolled: shoot the screen as the reader sees it
    await page.evaluate((y) => window.scrollTo(0, y), f.scrollTo ?? 0);
    await page.waitForTimeout(150);
    const v = page.viewportSize();
    const top = f.rect.y - (f.scrollTo ?? 0);
    await page.evaluate(({ r, top }) => {
      const o = document.createElement("div"); o.id = "__audit_outline";
      Object.assign(o.style, { position: "fixed", left: r.x - 3 + "px", top: top - 3 + "px", width: r.w + 6 + "px", height: r.h + 6 + "px", outline: "3px dashed #ff2d55", zIndex: 2147483647, pointerEvents: "none" });
      document.body.append(o);
    }, { r: f.rect, top });
    const y0 = Math.max(0, top - ctx), clip = { x: 0, y: y0, width: v.width, height: Math.min(v.height - y0, f.rect.h + ctx * 2) };
    try { await page.screenshot({ path: file, clip }); } catch { file = null; }
    await page.evaluate(() => { document.getElementById("__audit_outline")?.remove(); window.scrollTo(0, 0); });
    return file;
  }
  const r = f.kind === "page-scroll" ? { x: 0, y: 0, w: dims.w, h: Math.min(900, dims.h) } : f.rect;
  await page.evaluate(({ r, kind }) => {
    const o = document.createElement("div");
    o.id = "__audit_outline";
    Object.assign(o.style, { position: "absolute", left: r.x - 3 + "px", top: r.y - 3 + "px", width: r.w + 6 + "px", height: r.h + 6 + "px", outline: "3px solid #ff2d55", outlineOffset: "0", zIndex: 2147483647, pointerEvents: "none", background: kind === "small-target" ? "rgba(255,45,85,.12)" : "transparent" });
    document.body.append(o);
  }, { r, kind: f.kind });
  const x = Math.max(0, r.x - ctx), y = Math.max(0, r.y - ctx);
  const clip = { x, y, width: Math.min(dims.w - x, r.w + ctx * 2), height: Math.min(dims.h - y, r.h + ctx * 2, 1400) };
  try { await page.screenshot({ path: file, fullPage: true, clip }); } catch (e) { file = null; }
  await page.evaluate(() => document.getElementById("__audit_outline")?.remove());
  return file;
}

// ---- grouping and severity ------------------------------------------------------------------------
const SEVERITY = { "covered": 1, "faded": 3, "clipped": 1, "text-offscreen": 1, "page-scroll": 1, "broken-word": 2, "ellipsis": 2, "line-clamp": 3, "spills": 2, "overflow-box": 2, "element-offscreen": 2, "orphan": 3, "small-target": 3, "art-bleeds": 4 };
const SEV_NAME = { 1: "P1 cut off / broken", 2: "P2 visibly wrong", 3: "P3 polish", 4: "P4 check" };
function severityOf(f) {
  let s = SEVERITY[f.kind] ?? 3;
  if (f.kind === "broken-word" && !/^h[1-3]/.test(f.sig.split(" ").pop())) s = 2;
  if (f.kind === "orphan" && /^h1/.test(f.sig.split(" ").pop())) s = 2;
  if (f.kind === "faded" && f.opacity < 0.5) s = 2;
  return s;
}
const groupKey = (f) => `${f.kind}|${f.kind === "page-scroll" ? f.route : f.sig}`;

// ---- run ----------------------------------------------------------------------------------------
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\.html$/, "").replace(/\//g, "-"));
const contexts = new Map();
for (const w of WIDTHS) for (const t of THEMES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: HEIGHT(w) }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: t, hasTouch: w < 1025, isMobile: w < 700 });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} Math.random = () => 0.5; }, t);
  contexts.set(`${w}|${t}`, ctx);
}
const jobs = [];
for (const p of PAGES) for (const w of WIDTHS) for (const t of THEMES) jobs.push({ route: p, width: w, theme: t });
const all = [], shotCount = new Map(), statuses = {};
let roles = null, done = 0, shotSeq = 0;
const started = Date.now();
async function worker() {
  for (let job; (job = jobs.shift()); ) {
    const page = await contexts.get(`${job.width}|${job.theme}`).newPage();
    try {
      const status = await load(page, base + job.route);
      statuses[job.route] = status;
      if (!roles) roles = await page.evaluate(typeRoles);
      const found = await page.evaluate(inspect, { width: job.width });
      for (const f of found) {
        Object.assign(f, { route: job.route, width: job.width, theme: job.theme });
        f.severity = severityOf(f);
        f.typeRole = roles[f.style?.fontSize]?.join(" / ") ?? null;
        f.group = groupKey(f);
        // up to N screenshots per group, spread over phone / tablet / desktop
        const band = job.width < 700 ? "phone" : job.width < 1200 ? "tablet" : "desktop";
        const k = f.group, have = shotCount.get(k) ?? { n: 0, bands: new Set() };
        if (have.n < SHOTS_PER_GROUP && !have.bands.has(band) && f.kind !== "small-target" || (f.kind === "small-target" && have.n < 1)) {
          have.n++; have.bands.add(band); shotCount.set(k, have);
          const file = path.join(out, "shots", `${String(++shotSeq).padStart(3, "0")}-${f.kind}-${slug(job.route)}-${job.width}-${THEME_NAME[job.theme].toLowerCase()}-${have.n}.png`);
          f.shot = (await shoot(page, f, file)) ? path.relative(out, file).split(path.sep).join("/") : null;
        }
        all.push(f);
      }
    } catch (e) {
      all.push({ kind: "load-error", route: job.route, width: job.width, theme: job.theme, detail: String(e.message).slice(0, 200), severity: 4, group: `load-error|${job.route}`, sig: "page" });
    } finally {
      await page.close();
      done++;
      if (done % 20 === 0) console.log(`${done} screens, ${all.length} findings, ${Math.round((Date.now() - started) / 1000)}s`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
for (const c of contexts.values()) await c.close();
await browser.close();
server?.close();

// ---- write --------------------------------------------------------------------------------------
const groups = new Map();
for (const f of all) {
  const g = groups.get(f.group) ?? { key: f.group, kind: f.kind, sig: f.sig, severity: f.severity, instances: [], routes: new Set(), widths: new Set(), themes: new Set(), shots: [], sample: f };
  g.severity = Math.min(g.severity, f.severity);
  g.instances.push(f); g.routes.add(f.route); g.widths.add(f.width); g.themes.add(f.theme);
  if (f.shot) g.shots.push(f.shot);
  groups.set(f.group, g);
}
const ranked = [...groups.values()].sort((a, b) => a.severity - b.severity || b.routes.size * b.widths.size - a.routes.size * a.widths.size);
const json = {
  date: today, base: arg("--base") ?? "dist/", widths: WIDTHS, themes: THEMES, routes: PAGES, statuses,
  groups: ranked.map((g) => ({ key: g.key, kind: g.kind, sig: g.sig, severity: g.severity, count: g.instances.length, routes: [...g.routes], widths: [...g.widths].sort((a, b) => a - b), themes: [...g.themes], shots: g.shots, sample: { text: g.sample.text, detail: g.sample.detail, style: g.sample.style, typeRole: g.sample.typeRole, route: g.sample.route, width: g.sample.width } })),
  findings: all,
};
fs.writeFileSync(path.join(out, "findings.json"), JSON.stringify(json, null, 1));

let md = `# Screen audit ${today}\n\n${PAGES.length} routes × ${WIDTHS.join("/")} px × ${THEMES.map((t) => THEME_NAME[t]).join("/")} = ${PAGES.length * WIDTHS.length * THEMES.length} screens · ${all.length} findings in ${ranked.length} groups · source ${json.base}\n\n`;
const counts = {}; for (const g of ranked) counts[g.severity] = (counts[g.severity] ?? 0) + 1;
md += Object.entries(counts).map(([s, n]) => `- ${SEV_NAME[s]}: ${n} groups`).join("\n") + "\n\n";
md += "| Sev | Kind | Element | Pages | Widths | Themes | Example |\n|---|---|---|---:|---|---|---|\n";
for (const g of ranked) md += `| ${g.severity} | ${g.kind} | \`${g.sig}\` | ${g.routes.size} | ${[...g.widths].sort((a, b) => a - b).join(" ")} | ${[...g.themes].map((t) => THEME_NAME[t]).join(" ")} | ${g.sample.route} @${g.sample.width}: ${g.sample.detail.replace(/\|/g, "/")}${g.sample.text ? ` — "${g.sample.text.slice(0, 50).replace(/\|/g, "/")}"` : ""}${g.shots[0] ? ` ([shot](${g.shots[0]}))` : ""} |\n`;
fs.writeFileSync(path.join(out, "summary.md"), md);

if (arg("--baseline")) {
  const prev = JSON.parse(fs.readFileSync(arg("--baseline"), "utf8"));
  const before = new Set(prev.groups.map((g) => g.key)), now = new Set(ranked.map((g) => g.key));
  const added = ranked.filter((g) => !before.has(g.key)), gone = prev.groups.filter((g) => !now.has(g.key));
  console.log(`vs baseline: ${added.length} new groups, ${gone.length} fixed`);
  for (const g of added) console.log(`  + [${g.severity}] ${g.kind} ${g.sig} (${g.routes.size} pages)`);
  for (const g of gone) console.log(`  - [${g.severity}] ${g.kind} ${g.sig}`);
}
const p1 = ranked.filter((g) => g.severity === 1).length;
console.log(`${PAGES.length * WIDTHS.length * THEMES.length} screens · ${ranked.length} groups (${p1} P1) → ${path.relative(process.cwd(), out)}/summary.md`);
