/*
 * Scene kit: the primitives every place is drawn from (WPA-poster style: flat shapes, few inks).
 *
 * Pure math, no three.js and no DOM, so the same data draws both the three.js window and the
 * SVG still (reduced motion / no WebGL). A scene is a config that calls these and returns items.
 *
 * Coordinates: scene units, y UP. The ground line is y = 0, the top of the window is y = 1000.
 * x is centered on 0. Author for x in about −1100…1100: the window crops x by its aspect.
 *
 * An item is { pts: [[x, y], …], role, depth, type?, anim? }
 *   role  : a palette key (sky colors live on the glass, not in items)
 *   depth : 0 = nearest, 1 = farthest (sets parallax and draw order)
 *   type  : "flat" (default) · "falls" · "water" · "cloud" · "chair" · "sway"
 */

/* ---------- seeded randomness (scenes look the same on every load) ---------- */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;

/** Smooth 1D value noise from a seeded table. */
function noise1(seed) {
  const r = rng(seed), table = Array.from({ length: 256 }, r);
  return (x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(table[i & 255], table[(i + 1) & 255], u) * 2 - 1;
  };
}

/* ---------- terrain ---------- */

/** A ridge line across the window, filled down to y = bottom. */
export function ridge({ y, amp = 60, freq = 2.2, seed = 1, role, depth, x0 = -1150, x1 = 1150, bottom = -50, steps = 90, jag = 0.25 }) {
  const n = noise1(seed), r = rng(seed + 7);
  const pts = [[x0, bottom]];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, x = lerp(x0, x1, t);
    const h = y + n(t * freq * 4) * amp + n(t * freq * 13 + 50) * amp * 0.25 + (r() - 0.5) * amp * jag * 0.3;
    pts.push([x, h]);
  }
  pts.push([x1, bottom]);
  return { pts, role, depth };
}

/** A flat band (ground, field, sea). */
export function band({ y0, y1, role, depth, x0 = -1150, x1 = 1150 }) {
  return { pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], role, depth };
}

/**
 * Mt Hood. A traced profile (from the Bald Mountain photo): steep, slightly asymmetric summit,
 * a notch and shoulder to the right. Returns the mountain, its snowfield and rock streaks.
 */
const HOOD = [
  [-1, 0], [-0.8, 0.1], [-0.6, 0.19], [-0.45, 0.29], [-0.33, 0.4], [-0.23, 0.53], [-0.15, 0.66],
  [-0.09, 0.78], [-0.045, 0.9], [-0.015, 0.97], [0.02, 1], [0.06, 0.96], [0.1, 0.9], [0.13, 0.9],
  [0.17, 0.84], [0.25, 0.72], [0.35, 0.6], [0.46, 0.5], [0.58, 0.42], [0.7, 0.35], [0.84, 0.22],
  [1, 0.1], [1, 0],
];
const hoodAt = (u) => {
  for (let i = 0; i < HOOD.length - 1; i++) {
    const [u0, v0] = HOOD[i], [u1, v1] = HOOD[i + 1];
    if (u >= u0 && u <= u1 && u1 > u0) return v0 + ((u - u0) / (u1 - u0)) * (v1 - v0);
  }
  return 0;
};
export function hood({ x = 0, base = 300, height = 520, width = 900, snowline = 0.55, seed = 3, depth = 0.9, roles = { far: "far", snow: "snow" }, flip = false }) {
  const sx = flip ? -1 : 1;
  const at = ([u, v]) => [x + u * sx * width / 2, base + v * height];
  const mountain = HOOD.map(at);
  // Snow: everything above the snowline, with glacier fingers reaching down the gullies.
  const r = rng(seed);
  const left = HOOD.find(([, v]) => v >= snowline), right = [...HOOD].reverse().find(([, v]) => v >= snowline);
  const snow = HOOD.filter(([, v]) => v >= snowline).map(at);
  const fingers = 7, steps = fingers * 6;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = right[0] + (left[0] - right[0]) * t;
    const k = Math.sin(t * Math.PI * fingers);
    const reach = k > 0 ? Math.pow(k, 3) * (0.1 + r() * 0.06) : 0;
    const v = Math.min(hoodAt(u), snowline - reach);
    snow.push(at([u, v]));
  }
  return [
    { pts: mountain, role: roles.far, depth: depth + 0.001 },
    { pts: snow, role: roles.snow, depth },
  ];
}

/** Mirror an item set across y = axis (a lake reflection), squashed vertically. */
export function reflect(items, { axis, squash = 0.6, role, depth }) {
  return items.map((it) => ({
    pts: it.pts.map(([x, y]) => [x, axis - (y - axis) * squash]),
    role: role || it.role, depth: depth ?? it.depth, type: "flat",
  }));
}

/* ---------- trees ---------- */

/** One fir: stacked tiers that widen toward the base. */
export function fir(x, y, h, r, w = 0.32) {
  const tiers = 5 + Math.floor(r() * 3), pts = [[x, y + h]];
  const half = h * w;
  // right side going down, then left side going up
  const side = [];
  for (let i = 1; i <= tiers; i++) {
    const t = i / tiers, ty = y + h * (1 - t) + h * 0.08;
    const tw = half * Math.pow(t, 0.9) * (0.85 + r() * 0.3);
    side.push([tw, ty], [tw * 0.45, ty - h * 0.02]);
  }
  for (const [dx, yy] of side) pts.push([x + dx, yy]);
  pts.push([x + h * 0.03, y], [x - h * 0.03, y]);
  for (const [dx, yy] of [...side].reverse()) pts.push([x - dx * (0.9 + r() * 0.2), yy]);
  return pts;
}

/** A row of firs along a ridge or the ground. Returns one item per tree. */
export function firs({ y, h = 160, count = 20, seed = 5, role, depth, x0 = -1150, x1 = 1150, jitter = 0.35, hVar = 0.45, groundY = null }) {
  const r = rng(seed), out = [];
  for (let i = 0; i < count; i++) {
    const x = lerp(x0, x1, (i + 0.5) / count) + (r() - 0.5) * ((x1 - x0) / count) * jitter * 2;
    const hh = h * (1 - hVar / 2 + r() * hVar);
    const yy = (typeof groundY === "function" ? groundY(x) : y) - hh * 0.05;
    out.push({ pts: fir(x, yy, hh, r), role, depth });
  }
  return out;
}

/** Tall straight trunks (spruce/fir corridors, coast framing). */
export function trunks({ xs, y0 = -50, y1 = 1100, w = 26, role, depth, seed = 9, lean = 0.02 }) {
  const r = rng(seed);
  return xs.map((x) => {
    const l = (r() - 0.5) * lean * (y1 - y0), ww = w * (0.8 + r() * 0.5);
    return { pts: [[x - ww / 2, y0], [x + ww / 2, y0], [x + l + ww * 0.3, y1], [x + l - ww * 0.3, y1]], role, depth };
  });
}

/** A ragged canopy mass hanging from the top edge (forest framing). */
export function canopy({ side = "left", x0, x1, yBottom, seed = 11, role, depth }) {
  const n = noise1(seed), pts = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, y = lerp(1100, yBottom, t);
    const reach = lerp(x0, x1, 0.5 + n(t * 9) * 0.5) ;
    pts.push([side === "left" ? reach : reach, y]);
  }
  const edge = side === "left" ? -1200 : 1200;
  return { pts: [[edge, 1100], ...pts, [edge, yBottom]], role, depth };
}

/* ---------- water ---------- */

export function water({ y0, y1, role = "water", depth, x0 = -1150, x1 = 1150 }) {
  return { pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], role, depth, type: "water" };
}

/** A waterfall ribbon, slightly wavy, with a mist pool at the base. */
export function falls({ x, top, bottom, w = 60, seed = 13, role = "waterLight", depth }) {
  const n = noise1(seed), left = [], right = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, y = lerp(top, bottom, t), wob = n(t * 5) * w * 0.25, ww = w * (0.7 + t * 0.6);
    left.push([x + wob - ww / 2, y]); right.push([x + wob + ww / 2, y]);
  }
  return [
    { pts: [...left, ...right.reverse()], role, depth, type: "falls" },
    { pts: ellipse(x, bottom, w * 1.6, w * 0.35, 18), role: "mist", depth: depth - 0.001 },
  ];
}

/* ---------- sky things ---------- */

export function ellipse(cx, cy, rx, ry, n = 24) {
  return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
}

/** A flat poster cloud: a row of overlapping lobes on a flat base. */
export function cloud({ x, y, w = 260, seed = 17, role = "cloud", depth = 0.95, lobes = 5, drift = 6, flat = true }) {
  const r = rng(seed), pts = [], steps = 64;
  const centers = Array.from({ length: lobes }, (_, i) => [lerp(-w / 2, w / 2, (i + 0.5) / lobes), (0.3 + r() * 0.7) * w * 0.28, w / lobes * (0.7 + r() * 0.5)]);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, px = lerp(-w / 2 - w * 0.08, w / 2 + w * 0.08, t);
    let h = 0;
    for (const [cx, ch, cr] of centers) { const d = Math.abs(px - cx) / cr; if (d < 1) h = Math.max(h, ch * Math.sqrt(1 - d * d) + cr * 0.3); }
    pts.push([x + px, y + h]);
  }
  pts.push([x + w / 2 + w * 0.08, y], [x - w / 2 - w * 0.08, y]);
  return { pts: flat ? pts : pts, role, depth, type: "cloud", anim: { drift } };
}

/** A storm deck: a heavy cloud mass with a scalloped underside (mammatus). */
export function stormDeck({ y, seed = 19, role = "cloud", depth = 0.97, x0 = -1200, x1 = 1200 }) {
  const n = noise1(seed), pts = [[x0, 1100], [x1, 1100]];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = 1 - i / steps, x = lerp(x0, x1, t);
    const scallop = Math.abs(Math.sin(t * Math.PI * 14)) * 30;
    pts.push([x, y + n(t * 6) * 60 + scallop]);
  }
  return { pts, role, depth, type: "cloud", anim: { drift: 3 } };
}

/* ---------- human-made ---------- */

/** A road narrowing to a vanishing point. */
export function road({ x = 0, y0 = -50, y1 = 260, w0 = 520, w1 = 18, bend = 0, role = "road", depth = 0.1 }) {
  return { pts: [[x - w0 / 2, y0], [x + w0 / 2, y0], [x + bend + w1 / 2, y1], [x + bend - w1 / 2, y1]], role, depth };
}

/** A thin straight line as a quad (cables, fence wire, contrails). */
export function line([ax, ay], [bx, by], { w = 3, role, depth, type = "flat" }) {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy), nx = (-dy / len) * w / 2, ny = (dx / len) * w / 2;
  return { pts: [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]], role, depth, type };
}

/** Chairlift chairs riding a cable from a to b (animated). */
export function chairs(a, b, { count = 4, role = "figure", depth, size = 16 }) {
  return Array.from({ length: count }, (_, i) => ({
    pts: [[-size / 2, -size * 1.4], [size / 2, -size * 1.4], [size / 2, -size * 0.6], [size * 0.1, -size * 0.6], [size * 0.1, 0], [-size * 0.1, 0], [-size * 0.1, -size * 0.6], [-size / 2, -size * 0.6]],
    role, depth, type: "chair", anim: { a, b, phase: i / count, speed: 0.025 },
  }));
}

/** Sea stacks: blocky rocks with flat-ish tops. */
export function stack({ x, y = 0, w = 120, h = 220, seed = 23, role = "rock", depth }) {
  const r = rng(seed), pts = [[x - w / 2, y]];
  const steps = 7;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, xx = lerp(x - w / 2, x + w / 2, t);
    const yy = y + h * (0.55 + 0.45 * Math.sin(t * Math.PI)) * (0.85 + r() * 0.3);
    pts.push([xx, yy]);
  }
  pts.push([x + w / 2, y]);
  return { pts, role, depth };
}

/** An airliner wing seen from a window seat. */
export function wing({ role = "wing", tipRole = "accent", depth = 0.02 }) {
  return [
    { pts: [[1200, 420], [1200, 260], [300, 560], [230, 610], [260, 620], [420, 575]], role, depth },
    { pts: [[230, 610], [190, 760], [215, 765], [270, 625]], role: tipRole, depth: depth - 0.001 },
  ];
}

/** Fireweed: magenta spikes in the foreground (sway). */
export function fireweed({ x0, x1, y = -20, count = 14, h = 160, seed = 29, role = "accent", stemRole = "trees2", depth = 0.02 }) {
  const r = rng(seed), out = [];
  for (let i = 0; i < count; i++) {
    const x = lerp(x0, x1, r()), hh = h * (0.6 + r() * 0.6), w = 9 + r() * 6;
    out.push({ pts: [[x - 2, y], [x + 2, y], [x + 1, y + hh * 0.55], [x - 1, y + hh * 0.55]], role: stemRole, depth, type: "sway", anim: { base: [x, y] } });
    out.push({ pts: [[x, y + hh], [x + w / 2, y + hh * 0.75], [x + w / 2.5, y + hh * 0.5], [x - w / 2.5, y + hh * 0.5], [x - w / 2, y + hh * 0.75]], role, depth, type: "sway", anim: { base: [x, y] } });
  }
  return out;
}

/** Behind-the-scenes figures: tiny, never identifiable. */
export function figure({ x, y, h = 34, kind = "walker", role = "figure", depth = 0.05 }) {
  const s = h / 34;
  const P = (pts) => pts.map(([px, py]) => [x + px * s, y + py * s]);
  if (kind === "dog") return { pts: P([[-9, 0], [-7, 7], [-8, 11], [6, 11], [9, 15], [12, 13], [10, 9], [8, 0], [6, 0], [5, 6], [-4, 6], [-5, 0]]), role, depth };
  if (kind === "sitter") return { pts: P([[-6, 0], [10, 0], [12, 3], [2, 6], [3, 18], [5, 22], [0, 26], [-5, 22], [-3, 14], [-6, 6]]), role, depth };
  return { pts: P([[-4, 0], [-1, 0], [0, 12], [1, 0], [4, 0], [3, 16], [5, 26], [2, 29], [0, 34], [-2, 29], [-5, 26], [-3, 16]]), role, depth };
}

/* ---------- palettes ---------- */

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
export const mix = (a, b, t) => toHex(hex(a).map((v, i) => lerp(v, hex(b)[i], t)));

/**
 * Night inks for a day palette: the same poster reprinted at dusk. Roles fall toward a night blue
 * by different amounts; snow and water keep some light, accents keep some color.
 */
const NIGHT = "#0a1626";
const NIGHT_AMOUNT = { sky0: 0.86, sky1: 0.72, far: 0.62, snow: 0.5, rock: 0.7, ridge: 0.72, ridge2: 0.76, trees: 0.8, trees2: 0.84, ground: 0.78, ground2: 0.8, water: 0.7, waterLight: 0.52, mist: 0.6, cloud: 0.66, road: 0.75, accent: 0.45, figure: 0.85, wing: 0.6 };
export function nightPalette(day) {
  const out = {};
  for (const [k, v] of Object.entries(day)) out[k] = mix(v, NIGHT, NIGHT_AMOUNT[k] ?? 0.7);
  out.sky0 = mix(day.sky0, "#04101f", 0.9);
  out.sky1 = mix(day.sky1, "#1d3350", 0.75);
  return out;
}
