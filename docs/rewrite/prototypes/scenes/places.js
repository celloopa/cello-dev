/*
 * The places, in the order Cello visited them (summer → fall, 2026). Each is a poster built from
 * the scene kit, drawn from one of his photos. Composed, not literal: no scene reproduces an exact
 * viewpoint. People appear only as tiny behind-the-scenes silhouettes.
 *
 * To add or redraw a place: copy one entry, change the palette and build(). Nothing else changes.
 * `pair` is a placeholder until Cello picks which work belongs to which place (mood pairings,
 * his words).
 */
import * as K from "./kit.js";

const BASE = {
  sky0: "#3b7fd4", sky1: "#a8cdef", far: "#6f8299", snow: "#f4f6f8", rock: "#4f5a68",
  ridge: "#3c5a3a", ridge2: "#557a4c", trees: "#24412b", trees2: "#17301d", ground: "#6d9a3c",
  ground2: "#8bb04a", water: "#3f6878", waterLight: "#e9f1f3", mist: "#e6ecea", cloud: "#f6f7f8",
  road: "#a08a66", accent: "#e0b33a", figure: "#1d2328", wing: "#c9d3dc",
};
const P = (o) => ({ ...BASE, ...o });

/*
 * Generated art layers. A place with `layers` is drawn by the window from these textures
 * (back → front) instead of its kit shapes; the kit stays its fallback (still, no WebGL, reduced
 * motion, or a texture that fails to load). All layers of a place share one frame (same size,
 * pixel-aligned). Files live at public/gen/layers/<place id>/<file>.webp and are re-exported from
 * Figma under the same names, so this is the only place the paths are built.
 *
 *   depth  : 0 = nearest … 1 = farthest, like kit items (sets pointer parallax)
 *   motion : shader micro-motion: "drift" (sky) · "shimmer" (water below `shore`) · "sway" (plants)
 *   shore  : for "shimmer", the shoreline as a fraction of the image height from the top
 * `layersAnchor` is the cover-fit anchor (like CSS object-position, 0…1) that keeps the subject in
 * view when the window crops the art.
 */
const LAYER_DIR = `${import.meta.env.BASE_URL}gen/layers`;
const layers = (id, list) => list.map((l) => ({ ...l, src: `${LAYER_DIR}/${id}/${l.file ?? l.name}.webp` }));

export const PLACES = [
  {
    id: "moss-falls", place: "Forest falls, Cottage Grove", month: "June",
    palette: P({ sky0: "#b9cbc2", sky1: "#e4eae2", far: "#7d9583", ridge: "#5c7863", ridge2: "#48644f", trees: "#2e4a35", trees2: "#1d3324", rock: "#35362e", ground: "#5f6d38", ground2: "#7f8c44", water: "#c7d3cf", waterLight: "#f3f5f0", mist: "#e9eee8", accent: "#c44b7c" }),
    build() {
      return [
        ...K.firs({ y: 260, h: 420, count: 16, seed: 3, role: "far", depth: 0.9 }),
        ...K.firs({ y: 200, h: 480, count: 12, seed: 4, role: "ridge", depth: 0.75, x0: -1150, x1: -150 }),
        ...K.firs({ y: 200, h: 520, count: 9, seed: 5, role: "ridge2", depth: 0.7, x0: 250, x1: 1150 }),
        { pts: [[-420, 120], [-330, 420], [-200, 640], [-60, 770], [90, 790], [220, 700], [330, 520], [420, 120]], role: "rock", depth: 0.5 },
        { pts: [[-420, 120], [-330, 420], [-250, 520], [-220, 300], [-300, 120]], role: "ground", depth: 0.49 },
        { pts: [[420, 120], [330, 520], [260, 560], [250, 300], [320, 120]], role: "ground", depth: 0.49 },
        ...K.falls({ x: -60, top: 740, bottom: 160, w: 50, seed: 2, depth: 0.45 }),
        ...K.falls({ x: 140, top: 560, bottom: 170, w: 26, seed: 6, depth: 0.44 }),
        K.ridge({ y: 140, amp: 40, seed: 8, role: "ground", depth: 0.3, bottom: -60 }),
        { pts: [[-1150, -60], [-1150, 260], [-520, 150], [-80, 60], [520, -60]], role: "ground2", depth: 0.12 },
        ...K.trunks({ xs: [-980, -760, 860, 1040], w: 34, role: "trees2", depth: 0.08, seed: 21 }),
        K.figure({ x: 560, y: 70, h: 30, kind: "walker", role: "accent", depth: 0.2 }),
        K.figure({ x: 528, y: 70, h: 30, kind: "dog", role: "waterLight", depth: 0.2 }),
      ];
    },
  },
  {
    id: "meadows", place: "Mt Hood Meadows", month: "June",
    palette: P({ sky0: "#2a6ccd", sky1: "#93c3ef" }),
    build() {
      return [
        ...K.hood({ x: 220, base: 330, height: 560, width: 980, snowline: 0.42, seed: 4, depth: 0.95 }),
        K.ridge({ y: 330, amp: 30, seed: 2, role: "ridge2", depth: 0.8 }),
        ...K.firs({ y: 300, h: 260, count: 28, seed: 7, role: "trees", depth: 0.6 }),
        ...K.firs({ y: 230, h: 360, count: 9, seed: 8, role: "trees2", depth: 0.45, x0: 500, x1: 1150 }),
        K.band({ y0: -60, y1: 250, role: "ground", depth: 0.3 }),
        K.ridge({ y: 90, amp: 30, seed: 9, role: "ground2", depth: 0.15 }),
        ...K.firs({ y: 40, h: 900, count: 3, seed: 10, role: "trees2", depth: 0.05, x0: -1150, x1: -620 }),
      ];
    },
  },
  {
    id: "meadows-lift", place: "Mt Hood Meadows, the lift line", month: "June",
    palette: P({ sky0: "#2f74d6", sky1: "#a3cdf2", ground: "#79a447", ground2: "#93b65a", road: "#8c8476" }),
    build() {
      const a = [-1150, 980], b = [420, 420], a2 = [-1150, 900], b2 = [470, 400];
      return [
        ...K.hood({ x: 120, base: 360, height: 300, width: 560, snowline: 0.4, seed: 6, depth: 0.96 }),
        ...K.firs({ y: 330, h: 150, count: 40, seed: 11, role: "trees", depth: 0.7 }),
        K.band({ y0: -60, y1: 340, role: "ground", depth: 0.4 }),
        K.road({ x: 0, y0: -60, y1: 330, w0: 760, w1: 24, bend: 80, role: "road", depth: 0.2 }),
        K.line(a, b, { w: 3, role: "figure", depth: 0.3 }),
        K.line(a2, b2, { w: 3, role: "figure", depth: 0.3 }),
        ...K.chairs(a, b, { count: 3, depth: 0.29 }),
        K.line([380, 300], [440, 470], { w: 10, role: "figure", depth: 0.31 }),
        ...K.firs({ y: 300, h: 330, count: 7, seed: 12, role: "trees2", depth: 0.35, x0: 600, x1: 1150 }),
      ];
    },
  },
  {
    id: "ecola", place: "Ecola, the coast", month: "July",
    palette: P({ sky0: "#9fbcd0", sky1: "#e2eaee", far: "#86a3b1", rock: "#36444b", water: "#5b8ca3", waterLight: "#eef4f5", ridge: "#4a675a", trees: "#22382b", trees2: "#152620", ground: "#667b44", ground2: "#86985a" }),
    build() {
      return [
        K.ridge({ y: 330, amp: 40, freq: 1.2, seed: 5, role: "far", depth: 0.95, x0: -1150, x1: -100 }),
        K.water({ y0: -60, y1: 330, role: "water", depth: 0.8 }),
        K.stack({ x: -380, y: 140, w: 150, h: 260, seed: 3, role: "rock", depth: 0.6 }),
        K.stack({ x: -170, y: 120, w: 90, h: 170, seed: 4, role: "rock", depth: 0.62 }),
        K.stack({ x: 210, y: 150, w: 210, h: 210, seed: 5, role: "rock", depth: 0.65 }),
        K.line([-700, 130], [-260, 150], { w: 5, role: "waterLight", depth: 0.55, type: "water" }),
        K.line([-80, 120], [520, 140], { w: 5, role: "waterLight", depth: 0.55, type: "water" }),
        { pts: [[-1150, -60], [-1150, 230], [-700, 140], [-200, 40], [300, -60]], role: "ground", depth: 0.2 },
        ...K.firs({ y: -40, h: 1250, count: 2, seed: 33, role: "trees", depth: 0.09, x0: -1250, x1: -700, hVar: 0.2 }),
        ...K.firs({ y: -40, h: 1150, count: 2, seed: 34, role: "trees2", depth: 0.08, x0: 650, x1: 1250, hVar: 0.2 }),
      ];
    },
  },
  {
    id: "salmon-ridge", place: "A ridge above the Salmon River", month: "August",
    palette: P({ sky0: "#3a83d6", sky1: "#abd0f0", far: "#3f6b4b", ridge: "#2c5236", ridge2: "#4e7848", trees: "#22402a", ground: "#c9a65a", ground2: "#a8874b", rock: "#8a7a5c", figure: "#1d2328" }),
    build() {
      return [
        K.ridge({ y: 560, amp: 170, freq: 0.9, seed: 21, role: "far", depth: 0.9 }),
        K.ridge({ y: 380, amp: 120, freq: 1.3, seed: 22, role: "ridge", depth: 0.7 }),
        K.ridge({ y: 250, amp: 80, freq: 2, seed: 23, role: "ridge2", depth: 0.55 }),
        { pts: [[-1150, -60], [-1150, 520], [-700, 430], [-200, 260], [400, 60], [700, -60]], role: "ground", depth: 0.15 },
        { pts: [[-1150, -60], [-1150, 300], [-600, 160], [-100, -60]], role: "ground2", depth: 0.1 },
        ...K.trunks({ xs: [820, 980], w: 12, role: "rock", depth: 0.12, seed: 41, y0: 150 }),
        ...K.firs({ y: 120, h: 640, count: 2, seed: 42, role: "trees", depth: 0.13, x0: 780, x1: 1150 }),
        K.figure({ x: -380, y: 320, h: 34, kind: "sitter", depth: 0.14 }),
      ];
    },
  },
  {
    id: "ramona", place: "Ramona Falls", month: "August",
    palette: P({ sky0: "#c6dbeb", sky1: "#f1f4f6", far: "#3d5946", trees: "#1e3526", trees2: "#122418", rock: "#2a2e2b", water: "#c7d4d6", waterLight: "#eef3f3", ground: "#3e5934", mist: "#dde6e4" }),
    build() {
      const out = [
        K.cloud({ x: 40, y: 860, w: 240, seed: 3, depth: 0.99 }),
        ...K.firs({ y: 420, h: 380, count: 6, seed: 51, role: "far", depth: 0.85, x0: -380, x1: 380 }),
        { pts: [[-420, 60], [-300, 520], [-80, 620], [140, 600], [360, 480], [440, 60]], role: "rock", depth: 0.5 },
      ];
      const streams = [[-300, 14, 470], [-235, 22, 520], [-150, 30, 560], [-60, 18, 590], [20, 34, 600], [110, 20, 580], [190, 26, 540], [270, 16, 490], [330, 12, 440]];
      for (const [i, [x, w, top]] of streams.entries()) out.push(...K.falls({ x, top, bottom: 90, w, seed: 60 + i, depth: 0.45 }));
      out.push(
        K.ridge({ y: 70, amp: 30, seed: 52, role: "ground", depth: 0.3 }),
        ...K.firs({ y: -40, h: 1200, count: 2, seed: 56, role: "trees", depth: 0.09, x0: -1250, x1: -640, hVar: 0.2 }),
        ...K.firs({ y: -40, h: 1250, count: 2, seed: 57, role: "trees2", depth: 0.08, x0: 640, x1: 1250, hVar: 0.2 }),
      );
      return out;
    },
  },
  {
    id: "over-hood", place: "Over Mt Hood, window seat", month: "September",
    palette: P({ sky0: "#1b58b4", sky1: "#99c0e8", far: "#9fafbf", snow: "#f5f7fa", rock: "#7a8a9a", ridge: "#46668a", ridge2: "#6b88a6", ground: "#38587a", cloud: "#f3f5f8", wing: "#c7d1db", accent: "#1d8c89" }),
    build() {
      return [
        ...K.hood({ x: 140, base: 470, height: 220, width: 420, snowline: 0.35, seed: 8, depth: 0.97 }),
        K.cloud({ x: 560, y: 470, w: 520, seed: 9, depth: 0.9, drift: 4 }),
        K.ridge({ y: 470, amp: 26, seed: 71, role: "ridge2", depth: 0.85 }),
        K.ridge({ y: 380, amp: 40, seed: 72, role: "ridge", depth: 0.7 }),
        K.ridge({ y: 260, amp: 50, seed: 73, role: "ground", depth: 0.55 }),
        K.ridge({ y: 120, amp: 60, seed: 74, role: "ridge", depth: 0.45 }),
        ...K.wing({ depth: 0.03 }),
      ];
    },
  },
  {
    id: "bald-mountain", place: "Near Bald Mountain", month: "September",
    palette: P({ sky0: "#2b74d4", sky1: "#9cc8f0", far: "#7b7d85", snow: "#f2f2ee", rock: "#55565c", ridge: "#2d5235", ridge2: "#3f6844", trees: "#1f3a26", ground: "#b39a72", ground2: "#8e795a", figure: "#1d2833" }),
    build() {
      return [
        ...K.hood({ x: 30, base: 360, height: 560, width: 1250, snowline: 0.55, seed: 12, depth: 0.95 }),
        K.ridge({ y: 380, amp: 40, seed: 81, role: "ridge2", depth: 0.8 }),
        K.ridge({ y: 230, amp: 110, freq: 1.1, seed: 82, role: "ridge", depth: 0.6 }),
        ...K.firs({ y: 170, h: 120, count: 30, seed: 83, role: "trees", depth: 0.55, x0: 0, x1: 1150 }),
        { pts: [[-1150, -60], [-1150, 560], [-760, 420], [-420, 260], [-60, 160], [380, 60], [700, -60]], role: "ground", depth: 0.15 },
        K.line([-560, 300], [80, 150], { w: 20, role: "ground2", depth: 0.14 }),
        K.figure({ x: -300, y: 230, h: 40, kind: "walker", depth: 0.13 }),
        K.figure({ x: -10, y: 170, h: 18, kind: "walker", depth: 0.13 }),
      ];
    },
  },
  {
    id: "mirror-lake", place: "Mirror Lake", month: "September",
    palette: P({ sky0: "#4b85d2", sky1: "#dde7ef", far: "#968a86", snow: "#f4f1ec", rock: "#6c6361", trees: "#21402c", trees2: "#173123", water: "#3c5e69", waterLight: "#a8c3cb", ground: "#5f5236", accent: "#d0468f", cloud: "#f7f7f5" }),
    // 1536×1024. Mt Hood's summit sits at about (0.47, 0.2); the shoreline rocks end at ~0.745.
    layersAnchor: [0.46, 0.34],
    layers: layers("mirror-lake", [
      { name: "sky", depth: 0.97, motion: "drift" },
      { name: "far", depth: 0.85 },
      { name: "mid", depth: 0.55, motion: "shimmer", shore: 0.745 },
      { name: "near", depth: 0.05, motion: "sway" },
    ]),
    build() {
      const mountain = K.hood({ x: -40, base: 300, height: 360, width: 680, snowline: 0.45, seed: 14, depth: 0.95 });
      return [
        K.cloud({ x: -520, y: 760, w: 520, seed: 91, depth: 0.99, drift: 5 }),
        K.cloud({ x: 480, y: 820, w: 420, seed: 92, depth: 0.99, drift: 7 }),
        ...mountain,
        ...K.firs({ y: 270, h: 300, count: 9, seed: 93, role: "trees", depth: 0.6, x0: -1150, x1: -260 }),
        ...K.firs({ y: 270, h: 330, count: 8, seed: 94, role: "trees", depth: 0.6, x0: 260, x1: 1150 }),
        K.water({ y0: 40, y1: 270, role: "water", depth: 0.5 }),
        ...K.reflect(mountain, { axis: 270, squash: 0.55, role: "waterLight", depth: 0.49 }).slice(0, 2),
        K.line([-900, 160], [-300, 170], { w: 4, role: "waterLight", depth: 0.48, type: "water" }),
        K.line([150, 120], [800, 110], { w: 4, role: "waterLight", depth: 0.48, type: "water" }),
        K.band({ y0: -60, y1: 50, role: "ground", depth: 0.2 }),
        ...K.fireweed({ x0: -1150, x1: -420, y: -40, count: 16, h: 280, seed: 95, depth: 0.05 }),
      ];
    },
  },
  {
    id: "sauvie", place: "Sauvie Island", month: "October",
    palette: P({ sky0: "#4b5563", sky1: "#bcc3c9", cloud: "#6b7480", far: "#6b7860", ridge: "#55663f", trees: "#3d5135", ground: "#8a7951", ground2: "#a8996b", road: "#9a8360", accent: "#b2443a", figure: "#23272b" }),
    build() {
      return [
        K.stormDeck({ y: 520, seed: 101, role: "cloud", depth: 0.99 }),
        K.ridge({ y: 220, amp: 10, freq: 3, seed: 102, role: "far", depth: 0.9 }),
        ...K.firs({ y: 215, h: 60, count: 40, seed: 103, role: "trees", depth: 0.85 }),
        K.band({ y0: -60, y1: 220, role: "ground", depth: 0.6 }),
        { pts: [[-1150, -60], [-1150, 150], [-300, 200], [200, -60]], role: "ground2", depth: 0.4 },
        K.road({ x: 360, y0: -60, y1: 218, w0: 900, w1: 30, bend: -40, role: "road", depth: 0.3 }),
        { pts: [[430, 205], [560, 205], [560, 240], [430, 240]], role: "accent", depth: 0.29 },
        { pts: [[400, 198], [440, 198], [440, 222], [400, 222]], role: "figure", depth: 0.29 },
        K.figure({ x: 300, y: 196, h: 14, depth: 0.28 }),
        K.figure({ x: 318, y: 196, h: 13, depth: 0.28 }),
        ...[-900, -700, -500, -300].map((x, i) => K.line([x, -60 + i * 40], [x, 40 + i * 40], { w: 7, role: "figure", depth: 0.2 })),
      ];
    },
  },
];

export const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));
