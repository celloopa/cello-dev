// Figma follows code: generate the Figma sync script from src/tokens/tokens.json, and record
// which tokens Figma was last synced from.
//
//   node scripts/figma-sync.mjs --emit <out.js>    write one use_figma script (payload + applier)
//                                                  for the "cello.dev Design System" Figma file;
//                                                  run it with use_figma on that file's key
//
// The file key is not in this public repo. Set CELLO_FIGMA_FILE_KEY, or put {"fileKey": "..."} in
// .figma.local.json at the repo root (git-ignored). Only --emit reads it, to print where to run.
//   node scripts/figma-sync.mjs --record <hash>    after a successful run (the script returns the
//                                                  hash), record it in src/tokens/figma-synced.json;
//                                                  refuses a hash that doesn't match tokens.json
//   node scripts/figma-sync.mjs --hash             print the current hash
//
// What syncs: primitives (hidden), the color roles (Day and Dusk modes, aliasing primitives; tints
// as RGBA), the seasonal art inks, type (families, sizes at 1440px, weights), space, layout and
// stroke dimensions, motion values, and one text style per type role. Legacy aliases never sync.
// The hash covers exactly those groups, so `pnpm tokens --check` fails while Figma is behind them.
// IDs live in docs/design-system/figma-ledger.json (calls share no state).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOKENS = path.join(root, "src/tokens/tokens.json");
const SYNCED = path.join(root, "src/tokens/figma-synced.json");
const LOCAL = path.join(root, ".figma.local.json");
const fileKey = () => process.env.CELLO_FIGMA_FILE_KEY || (fs.existsSync(LOCAL) ? JSON.parse(fs.readFileSync(LOCAL, "utf8")).fileKey : null);
const VIEWPORT = 1440; // clamp() and vw values are resolved at the desktop design width
const REM = 16;

export const SYNCED_GROUPS = ["Primitives: color", "Roles: color", "Art:", "Type", "Space", "Layout", "Shape and stroke", "Motion"];

export function syncedSubset(spec) {
  return spec.groups.filter((g) => SYNCED_GROUPS.some((p) => g.name.startsWith(p)));
}

export function figmaHash(spec = JSON.parse(fs.readFileSync(TOKENS, "utf8"))) {
  return crypto.createHash("sha256").update(JSON.stringify(syncedSubset(spec))).digest("hex").slice(0, 16);
}

// ---------- value parsing ----------
const px = (v) => {
  v = String(v).trim();
  let m;
  if ((m = v.match(/^(-?[\d.]+)rem$/))) return +m[1] * REM;
  if ((m = v.match(/^(-?[\d.]+)px$/))) return +m[1];
  if ((m = v.match(/^(-?[\d.]+)vw$/))) return (+m[1] * VIEWPORT) / 100;
  if ((m = v.match(/^clamp\((.+),(.+),(.+)\)$/))) return Math.min(Math.max(px(m[2]), px(m[1])), px(m[3]));
  return null;
};
const ms = (v) => {
  const m = String(v).trim().match(/^([\d.]+)(ms|s)$/);
  return m ? (m[2] === "s" ? +m[1] * 1000 : +m[1]) : null;
};
const hex = (h) => {
  const n = h.replace("#", "");
  return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255 };
};
const round = (x) => Math.round(x * 1000) / 1000;
// sRGB <-> OKLab (Björn Ottosson's matrices), for color-mix(in oklab, ...).
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const toOklab = ({ r, g, b }) => {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
const fromOklab = ([L, A, B]) => {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const c = (x) => Math.min(1, Math.max(0, gam(x)));
  return { r: c(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), g: c(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), b: c(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) };
};
const mix = (a, b, w, space) => {
  if (space === "srgb") return { r: a.r * w + b.r * (1 - w), g: a.g * w + b.g * (1 - w), b: a.b * w + b.b * (1 - w) };
  const x = toOklab(a), y = toOklab(b);
  return fromOklab(x.map((v, i) => v * w + y[i] * (1 - w)));
};
const rgba = (c, a = 1) => [round(c.r), round(c.g), round(c.b), round(a)];

// "--ink-950" -> "ink/950"; "--bg-canvas" -> "bg/canvas"; "--space-16" -> "space/16"
const figmaName = (css) => css.replace(/^--/, "").replace(/-/, "/");

function build() {
  const spec = JSON.parse(fs.readFileSync(TOKENS, "utf8"));
  const groups = syncedSubset(spec);
  const by = (p) => groups.find((g) => g.name.startsWith(p))?.tokens ?? [];
  const legacy = (t) => /^Legacy/.test(t.$description ?? "");

  const primitives = by("Primitives: color").filter((t) => !legacy(t));
  const primHex = Object.fromEntries(primitives.map((t) => [t.css, t.$value]));
  const P = primitives.map((t) => ({ n: figmaName(t.css), c: t.css, d: t.$description ?? "", v: rgba(hex(t.$value)) }));
  const A = by("Art:").map((t) => ({ n: "art/" + t.css.replace("--art-", "").replace(/-/g, "/"), c: t.css, v: rgba(hex(t.$value)) }));

  // Roles: an alias to a primitive or another role, or an RGBA tint (Figma can't alias + alpha).
  const roleScopes = (css) =>
    css.startsWith("--bg-") || css === "--scrim" ? ["FRAME_FILL", "SHAPE_FILL"]
    : css.startsWith("--text-") ? ["TEXT_FILL"]
    : css.startsWith("--border-") || css === "--focus-ring" ? ["STROKE_COLOR"]
    : css === "--action-primary" ? ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]
    : ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"];
  const colorOf = (x) => {
    x = x.trim();
    let m;
    if ((m = x.match(/^var\((--[\w-]+)\)$/)) && primHex[m[1]]) return hex(primHex[m[1]]);
    if (/^#/.test(x)) return hex(x);
    throw new Error(`figma-sync: can't resolve color ${x}`);
  };
  const roleValue = (v) => {
    let m;
    if ((m = v.match(/^var\((--[\w-]+)\)$/))) return { a: figmaName(m[1]) };
    if (/^#/.test(v)) return { v: rgba(hex(v)) };
    // color-mix(in srgb|oklab, A p%, B): a tint over transparent becomes RGBA; two colors are mixed
    // here (Figma can't alias a mix), in the space the CSS names.
    if ((m = v.match(/^color-mix\(in (srgb|oklab), (.+?) ([\d.]+)%, (.+)\)$/))) {
      const [, space, a, p, b] = m;
      const w = +p / 100;
      if (b.trim() === "transparent") return { v: rgba(colorOf(a), w) };
      return { v: rgba(mix(colorOf(a), colorOf(b), w, space)) };
    }
    throw new Error(`figma-sync: can't express role value ${v}`);
  };
  const R = by("Roles: color").map((t) => {
    const val = typeof t.$value === "string" ? { day: t.$value, dusk: t.$value } : t.$value;
    return { n: figmaName(t.css), c: t.css, d: t.$description ?? "", s: roleScopes(t.css), day: roleValue(val.day), dusk: roleValue(val.dusk) };
  });

  // Numbers: sizes in px at 1440, weights, strokes, motion in ms. ch/em/% values stay in code only.
  const N = [];
  const num = (t, scopes, value, note = "") => value !== null && N.push({ n: figmaName(t.css), c: t.css, d: [t.$description, note].filter(Boolean).join(" "), s: scopes, v: round(value) });
  for (const t of by("Type")) {
    if (t.css.startsWith("--type-")) num(t, ["FONT_SIZE"], px(t.$value), /clamp|vw/.test(t.$value) ? `Code: ${t.$value}; ${VIEWPORT}px value here.` : "");
    else if (t.css.startsWith("--weight-") && !legacy(t)) num(t, ["FONT_WEIGHT"], +t.$value);
  }
  for (const t of by("Space")) num(t, ["GAP", "WIDTH_HEIGHT"], px(t.$value));
  for (const t of by("Layout")) num(t, t.css === "--touch-target" ? ["WIDTH_HEIGHT"] : ["WIDTH_HEIGHT", "GAP"], px(t.$value), /clamp|vw/.test(t.$value) ? `Code: ${t.$value}; ${VIEWPORT}px value here.` : "");
  for (const t of by("Shape and stroke")) {
    if (t.css.startsWith("--stroke-")) num(t, ["STROKE_FLOAT"], px(t.$value));
    if (t.css === "--shadow-offset") num(t, ["EFFECT_FLOAT"], px(t.$value));
  }
  for (const t of by("Motion")) {
    const d = ms(t.$value);
    if (d !== null) num(t, [], d, "Milliseconds.");
    else if (/^[\d.]+$/.test(String(t.$value))) num(t, [], +t.$value);
  }
  // Strings: font families and the easing curve.
  const S = [];
  for (const t of by("Type").filter((t) => t.css.startsWith("--font-"))) {
    const fam = String(t.$value).split(",")[0].trim().replace(/^"|"$/g, "").replace(/ Variable$/, "");
    S.push({ n: figmaName(t.css), c: t.css, d: t.$description ?? "", s: ["FONT_FAMILY"], v: fam });
  }
  for (const t of by("Motion").filter((t) => /cubic-bezier|linear/.test(String(t.$value)))) S.push({ n: figmaName(t.css), c: t.css, d: t.$description ?? "", s: [], v: t.$value });

  // Text styles: the type roles (proposal §3 + A1/A2), with leading and tracking resolved.
  const tok = Object.fromEntries(groups.flatMap((g) => g.tokens).map((t) => [t.css, t.$value]));
  const lead = (c) => round(+tok[c] * 100);
  const track = (c) => (c ? round(parseFloat(tok[c]) * 100) : 0);
  const fam = (c) => S.find((s) => s.c === c).v;
  const styleOf = { 400: "Regular", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" };
  const roles = [
    ["display/hero", "--type-display-hero", "--font-title", 800, "--leading-display", "--track-tight", true, "The hero name only."],
    ["title/page", "--type-page-title", "--font-title", 800, "--leading-tight", null, true, "h1 of every page."],
    ["title/section", "--type-section-title", "--font-title", 800, "--leading-tight", "--track-caps", true, "h2 sections."],
    ["heading", "--type-heading", "--font-mono", 700, "--leading-heading", null, false, "In-article h2, large card titles."],
    ["title", "--type-title", "--font-mono", 700, "--leading-title", null, false, "h3, card titles."],
    ["body/large", "--type-body-lg", "--font-mono", 400, "--leading-read", null, false, "Ledes on listings."],
    ["body", "--type-body", "--font-mono", 400, "--leading-read", null, false, "Cards, the resume, every paragraph outside an article."],
    ["body/read", "--type-body", "--font-read", 400, "--leading-read", null, false, "Long reading only: case-study and blog body (A2)."],
    ["ui", "--type-ui", "--font-mono", 700, "--leading-ui", "--track-caps", true, "Buttons, nav, back links."],
    ["small", "--type-small", "--font-mono", 400, "--leading-small", null, false, "Captions, card descriptions, metadata."],
    ["label", "--type-label", "--font-mono", 700, "--leading-tight", "--track-wide", true, "Eyebrows, tags, badges."],
  ];
  const T = roles.map(([n, size, font, w, l, tr, caps, d]) => ({
    n, d, f: fam(font), st: styleOf[w], sz: figmaName(size), ff: figmaName(font), lh: lead(l), ls: track(tr), up: caps,
  }));

  return { hash: figmaHash(spec), P, A, R, N, S, T };
}

// ---------- the applier (runs inside Figma via use_figma; must stay self-contained) ----------
const APPLIER = String.raw`
const COLLS = { prim: "Primitives", art: "Art", color: "Color", num: "Dimensions", str: "Type families and curves" };
const all = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const ids = {};
async function coll(name, modes) {
  let c = cols.find((x) => x.name === name) || figma.variables.createVariableCollection(name);
  modes.forEach((m, i) => { if (c.modes[i]) c.renameMode(c.modes[i].modeId, m); else c.addMode(m); });
  ids[name] = c.id;
  return c;
}
const kept = {};
function upsert(c, name, type) {
  let v = all.find((x) => x.name === name && x.variableCollectionId === c.id);
  if (!v) { v = figma.variables.createVariable(name, c, type); all.push(v); }
  (kept[c.id] ??= new Set()).add(name);
  return v;
}
const rgba = (a) => ({ r: a[0], g: a[1], b: a[2], a: a[3] });
const web = (css) => "var(" + css + ")";

const prim = await coll(COLLS.prim, ["Value"]);
for (const t of T.P) { const v = upsert(prim, t.n, "COLOR"); v.setValueForMode(prim.modes[0].modeId, rgba(t.v)); v.scopes = []; v.hiddenFromPublishing = true; v.description = t.d; v.setVariableCodeSyntax("WEB", web(t.c)); }
const art = await coll(COLLS.art, ["Value"]);
for (const t of T.A) { const v = upsert(art, t.n, "COLOR"); v.setValueForMode(art.modes[0].modeId, rgba(t.v)); v.scopes = ["FRAME_FILL", "SHAPE_FILL"]; v.description = "Art only: never text, never action. Dusk: mix 60% toward Midnight Ink."; v.setVariableCodeSyntax("WEB", web(t.c)); }

const color = await coll(COLLS.color, ["Day", "Dusk"]);
const byName = (n) => all.find((x) => x.name === n && (x.variableCollectionId === prim.id || x.variableCollectionId === color.id));
const roleVars = T.R.map((t) => [t, upsert(color, t.n, "COLOR")]);
for (const [t, v] of roleVars) {
  for (const [mode, val] of [[color.modes[0].modeId, t.day], [color.modes[1].modeId, t.dusk]]) {
    if (val.a) { const target = byName(val.a); if (!target) throw new Error("no alias target " + val.a); v.setValueForMode(mode, { type: "VARIABLE_ALIAS", id: target.id }); }
    else v.setValueForMode(mode, rgba(val.v));
  }
  v.scopes = t.s; v.description = t.d; v.setVariableCodeSyntax("WEB", web(t.c));
}

const num = await coll(COLLS.num, ["Value"]);
for (const t of T.N) { const v = upsert(num, t.n, "FLOAT"); v.setValueForMode(num.modes[0].modeId, t.v); v.scopes = t.s; v.description = t.d; v.setVariableCodeSyntax("WEB", web(t.c)); }
const str = await coll(COLLS.str, ["Value"]);
for (const t of T.S) { const v = upsert(str, t.n, "STRING"); v.setValueForMode(str.modes[0].modeId, t.v); v.scopes = t.s; v.description = t.d; v.setVariableCodeSyntax("WEB", web(t.c)); }

// Text styles, with font size and family bound to their variables.
const styles = await figma.getLocalTextStylesAsync();
const styleIds = {};
const numVar = (n) => all.find((x) => x.name === n && x.variableCollectionId === num.id);
const strVar = (n) => all.find((x) => x.name === n && x.variableCollectionId === str.id);
for (const t of T.T) {
  await figma.loadFontAsync({ family: t.f, style: t.st });
  let s = styles.find((x) => x.name === t.n) || figma.createTextStyle();
  s.name = t.n; s.description = t.d;
  s.fontName = { family: t.f, style: t.st };
  s.lineHeight = { unit: "PERCENT", value: t.lh };
  s.letterSpacing = { unit: "PERCENT", value: t.ls };
  s.textCase = t.up ? "UPPER" : "ORIGINAL";
  s.setBoundVariable("fontSize", numVar(t.sz));
  s.setBoundVariable("fontFamily", strVar(t.ff));
  styleIds[t.n] = s.id;
}

// Stale variables go last, after every alias was re-pointed (field notes).
const removed = [];
for (const c of [prim, art, color, num, str]) for (const v of all.filter((x) => x.variableCollectionId === c.id && !kept[c.id]?.has(x.name))) { removed.push(v.name); v.remove(); }

return { hash: T.hash, collections: ids, counts: { primitives: T.P.length, art: T.A.length, roles: T.R.length, numbers: T.N.length, strings: T.S.length, textStyles: T.T.length }, styleIds, removed };
`;

// ---------- CLI (only when run directly; scripts/tokens.mjs imports figmaHash) ----------
function main(argv) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  if (argv.includes("--hash")) {
    console.log(figmaHash());
  } else if (arg("--emit")) {
    const T = build();
    const out = path.resolve(arg("--emit"));
    fs.writeFileSync(out, `// Generated by scripts/figma-sync.mjs from src/tokens/tokens.json (hash ${T.hash}). Run with use_figma.\nconst T = ${JSON.stringify(T)};\n${APPLIER}`);
    console.log(`Figma sync script written: ${out} (${fs.statSync(out).size} bytes, hash ${T.hash})`);
    const key = fileKey();
    console.log(key ? `Run it with use_figma on fileKey ${key}, then --record the hash it returns.` : "Set CELLO_FIGMA_FILE_KEY (or .figma.local.json) to the Design System file's key, run the script there with use_figma, then --record the hash.");
  } else if (arg("--record")) {
    const hash = arg("--record"), current = figmaHash();
    if (hash !== current) { console.error(`--record ${hash} doesn't match the current tokens (${current}). Emit and run the sync again.`); process.exit(1); }
    fs.writeFileSync(SYNCED, JSON.stringify({ hash, syncedAt: new Date().toISOString().slice(0, 10) }, null, 2) + "\n");
    console.log(`Recorded: Figma is in sync with tokens ${hash}.`);
  } else {
    console.error("usage: node scripts/figma-sync.mjs --emit <out.js> | --record <hash> | --hash");
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main(process.argv.slice(2));
