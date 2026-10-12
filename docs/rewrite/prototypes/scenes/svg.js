/*
 * The still version of a place: the same kit data drawn as SVG polygons. It's what reduced-motion
 * and no-WebGL visitors see, and what everyone sees for the first moments before three.js arrives.
 */
import { nightPalette } from "./kit.js";

const cache = new Map();

export function paletteFor(place, dark) {
  return dark ? (place._night ??= nightPalette(place.palette)) : place.palette;
}

export function itemsFor(place) {
  if (!place._items) {
    place._items = place.build().map((it, i) => ({ ...it, i })).sort((a, b) => b.depth - a.depth || a.i - b.i);
  }
  return place._items;
}

/** SVG markup (scene y-up → SVG y-down). viewBox keeps the ground on the bottom edge. */
export function svgFor(place, dark) {
  const key = place.id + (dark ? ":n" : ":d");
  if (cache.has(key)) return cache.get(key);
  const pal = paletteFor(place, dark);
  const polys = itemsFor(place)
    .map((it) => `<polygon points="${it.pts.map(([x, y]) => `${x.toFixed(1)},${(1000 - y).toFixed(1)}`).join(" ")}" fill="${pal[it.role] || "#f0f"}"${it.role === "mist" ? ' opacity=".85"' : ""}/>`)
    .join("");
  const svg = `<svg viewBox="-1100 -10 2200 1050" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${polys}</svg>`;
  cache.set(key, svg);
  return svg;
}

export function skyFor(place, dark) {
  const pal = paletteFor(place, dark);
  return `linear-gradient(180deg, ${pal.sky0} 0%, ${pal.sky1} 78%)`;
}
