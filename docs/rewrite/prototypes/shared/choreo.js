/*
 * Choreography shared by all three directions: WHERE things are and HOW FAR along each move
 * is. Directions decide only how it looks (paper, drawing, ink). Keeping the moves in one
 * place means the three prototypes are a fair comparison of treatments, not of timing.
 *
 * The moves (Kaptain Kristian-style match cuts: one element carries into the next shot):
 *  1. Assemble: the mark's three parts arrive the way the old logo did (C from the left,
 *     sun from the top right, triangle from below), on the house curve.
 *  2. Explode: scrolling away from the hero pulls the parts apart in depth.
 *  3. Handoff: the sun leaves the mark, travels to poster 01 and grows into the circle that
 *     reveals it.
 *  4. Arrive: every poster comes from depth, tilted, and settles flat when centered; then
 *     drifts forward as it leaves.
 *  5. Fan out (case page): Asheville's single image splits into three brand planes.
 */
import { ease, range, clamp01 } from "./stage.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import paths from "./mark-paths.json";

export const MARK_W = paths.viewBox[0];
export const MARK_H = paths.viewBox[1];
export const SUN_CENTER = { x: 335.4 - MARK_W / 2, y: -(215 - MARK_H / 2) }; // in centered mark units
export const SUN_RADIUS = 150;

/** The mark's three parts as three.js Shapes, plus raw path strings (for 2D canvas work). */
export function markShapes() {
  const loader = new SVGLoader();
  const out = {};
  for (const part of ["c", "sun", "triangle"]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${paths[part].map((d) => `<path d="${d}"/>`).join("")}</svg>`;
    const parsed = loader.parse(svg);
    out[part] = { shapes: parsed.paths.flatMap((p) => p.toShapes(true)), d: paths[part] };
  }
  return out;
}

/** Order back to front, matching the logo's layers. */
export const LAYERS = { sun: -60, triangle: -30, c: 0 };
const FROM = {
  c: { x: -320, y: 0, rot: -0.4 },
  sun: { x: 240, y: 260, rot: 0.25 },
  triangle: { x: 0, y: -300, rot: 0 },
};
const ASSEMBLE = { sun: [0.15, 1.35], triangle: [0.3, 1.5], c: [0.45, 1.65] };

export function createChoreo(stage) {
  const q = (s) => document.querySelector(s);
  const markEl = q('[data-gl="mark"]');
  const posterEls = [...document.querySelectorAll('[data-gl="poster"]')];
  const brandImgs = [...document.querySelectorAll('[data-gl="brands"] img')];

  const markRec = markEl && stage.track(markEl);
  const posterRecs = posterEls.map((el) => stage.track(el));
  const brandRecs = brandImgs.map((el) => stage.track(el));
  const t0 = stage.time;

  return {
    markRec, posterRecs, brandRecs,
    posterImgs: posterEls.map((el) => el.querySelector("img")),
    brandImgs,

    /** Per-frame state. Pure numbers; no three.js objects are touched here. */
    frame() {
      const t = stage.time - t0;
      const p = stage.pointer;
      const out = { busy: t < 2.2, pointer: p };

      if (markRec) {
        const m = stage.place(markRec);
        const scale = m.h / MARK_H;
        const explode = ease.inOut(range(stage.scrollY, 0, stage.height * 0.9));
        const parts = {};
        for (const k of ["c", "sun", "triangle"]) {
          const a = ease.out(range(t, ...ASSEMBLE[k]));
          const f = FROM[k];
          parts[k] = {
            assemble: a,
            x: (1 - a) * f.x,
            y: (1 - a) * f.y,
            z: LAYERS[k] + explode * { c: 160, sun: -260, triangle: -120 }[k],
            rot: (1 - a) * f.rot,
            opacity: a,
          };
        }
        out.mark = { ...m, scale, explode, parts, tiltX: -p.y * 0.18, tiltY: p.x * 0.28 };

        // Handoff: the sun travels from the mark to poster 01 and becomes its reveal.
        if (posterRecs[0]) {
          const p0 = stage.place(posterRecs[0]);
          const h = ease.inOut(range(p0.centered, -0.95, -0.1));
          const sunHome = {
            x: m.x + SUN_CENTER.x * scale,
            y: m.y + SUN_CENTER.y * scale,
            s: scale,
          };
          const targetS = (Math.hypot(p0.w, p0.h) / 2 / SUN_RADIUS) * 1.08;
          out.handoff = {
            h,
            x: sunHome.x + (p0.x - sunHome.x) * h,
            y: sunHome.y + (p0.y - sunHome.y) * h,
            s: sunHome.s + (targetS - sunHome.s) * h,
            fade: 1 - range(h, 0.8, 1), // the sun gives way once the poster is revealed
          };
        }
      }

      out.posters = posterRecs.map((rec, i) => {
        const pl = stage.place(rec);
        const arrive = ease.out(range(pl.centered, -1.05, -0.12));
        const leave = ease.inOut(range(pl.centered, 0.35, 1.1));
        const side = i % 2 ? -1 : 1;
        const reveal = i === 0 && out.handoff
          ? range(out.handoff.h, 0.45, 1)
          : ease.out(range(pl.centered, -0.95, -0.3));
        return {
          ...pl,
          index: i,
          arrive, leave, reveal,
          z: -(1 - arrive) * 720 + leave * 140,
          rotX: (1 - arrive) * 0.42 - leave * 0.12 - p.y * 0.05 * arrive,
          rotY: side * (1 - arrive) * 0.32 + p.x * 0.07 * arrive,
          visible: pl.progress > -0.05 && pl.progress < 1.05,
        };
      });

      out.brands = brandRecs.map((rec, i) => {
        const pl = stage.place(rec);
        const first = stage.place(brandRecs[0]);
        const fan = ease.out(range(t, 0.35 + i * 0.14, 1.55 + i * 0.14));
        const leave = ease.inOut(range(stage.scrollY, 0, stage.height));
        return {
          ...pl,
          fan, leave,
          x: first.x + (pl.x - first.x) * fan + p.x * 10 * (i + 1),
          y: first.y + (pl.y - first.y) * fan + p.y * 6 * (i + 1),
          z: -i * (3 + 87 * fan) - leave * 260,
          rotY: -0.22 * fan + p.x * 0.06,
          rotX: 0.08 * fan - p.y * 0.04,
          opacity: 1 - leave * 0.6,
        };
      });

      return out;
    },
  };
}

/** A soft drop-shadow texture for a set of SVG paths, drawn once on a 2D canvas. */
export function blurredPathTexture(ds, { size = 256, blur = 14, viewBox = [MARK_W, MARK_H] } = {}) {
  const pad = blur * 3;
  const scale = (size - pad * 2) / Math.max(viewBox[0], viewBox[1]);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.filter = `blur(${blur}px)`;
  ctx.translate(pad + (size - pad * 2 - viewBox[0] * scale) / 2, pad + (size - pad * 2 - viewBox[1] * scale) / 2);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#000";
  for (const d of ds) ctx.fill(new Path2D(d));
  return { canvas: c, worldSize: size / scale }; // worldSize = how many mark units the canvas spans
}

/** A soft rectangle shadow (posters), drawn once. */
export function blurredRectCanvas(size = 128, blur = 14) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = "#000";
  const pad = blur * 2.2;
  ctx.fillRect(pad, pad, size - pad * 2, size - pad * 2);
  return { canvas: c, inset: pad / size };
}

export { clamp01, range, ease };
