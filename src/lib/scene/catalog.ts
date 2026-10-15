/*
 * Scene data, resolved at build time (Astro frontmatter only: it reads the manifests from disk).
 *
 * Sources:
 *   src/data/scene-library.json      the catalog: place, month, mobile center, motion readiness
 *   public/scenes/<id>/scene.json    the manifest: layers back → front, depth, source grid, and the
 *                                    tested motion caps (testedHorizontalSourcePx /
 *                                    testedTravelSourcePx, or [x, y] capSourcePx)
 *
 * Ported from the rewrite prototype's loadScene() (shared/scenery.js), which fetched both at
 * runtime; the build embeds the result in the page instead, so the still is in the HTML and
 * the client never waits on a manifest.
 */
import fs from "node:fs";
import path from "node:path";
import library from "@/data/scene-library.json";
import framing from "@/data/scene-framing.json";

export type MotionKind = "drift" | "shimmer" | "sway";

export interface SceneLayer {
  name: string;
  src: string;
  width: number;
  height: number;
  depth: number;
  motion: MotionKind | null;
  shore?: number;
  /** [x, y] in source px: the renderer never moves this layer further. */
  cap: [number, number];
  capSource: string;
  /** Desktop cover-fit anchor (0…1, like object-position). */
  anchor: [number, number];
  /** Phone cover-fit anchor. */
  mobileAnchor: [number, number];
  /** The art reaches the top edge, so the arrival drop must stay inside the overscan. */
  touchesTop: boolean;
  /** Optional independent character sprite, positioned in viewport coordinates. */
  sprite?: { foreground?: boolean; height: number; maxHeight: number; anchor: [number, number]; mobileHeight: number; mobileAnchor: [number, number] };
}

export interface SceneData {
  id: string;
  place: string;
  month: string;
  /** The source pixel grid the cuts (and their tested caps) are measured on. */
  grid: [number, number];
  layers: SceneLayer[];
  /** Complete, sharp initial image. A phone variant preserves independently anchored cuts. */
  still: { src: string; width: number; height: number; mobileX: number;
    mobile: { src: string; width: number; height: number; crops: Record<string, number> } | null };
  /** Half-size flattened reading still, only shown through the focus blur. */
  read: { src: string; width: number; height: number; mobileX: number } | null;
}

interface Settings {
  anchor?: [number, number];
  mobileLayer?: Record<string, [number, number]>;
  layer?: Record<string, { motion?: MotionKind; shore?: number }>;
  touchesTop?: string[];
}

/*
 * Per-scene settings no manifest carries yet (the prototype's SCENES table): framing, the
 * micro-motion kind per layer, and which layers' art reaches the top edge (alpha measured on the
 * webp's first row). A scene without an entry gets a centered anchor and every layer treated as
 * touching the top (more overscan, never a gap).
 */
// Shared with the derivative builder: Mirror Lake keeps its approved 9% phone fireweed anchor.
const SETTINGS = framing as unknown as Record<string, Settings>;

interface ManifestLayer {
  name: string;
  src: string;
  depth?: number;
  capSourcePx?: [number, number];
  testedHorizontalSourcePx?: number;
  testedTravelSourcePx?: number;
  recommendedHorizontalSourcePx?: number;
}
interface Manifest {
  place?: string;
  month?: string;
  sourceSize?: [number, number];
  webSize?: [number, number];
  layers: ManifestLayer[];
  cutoverCleanup?: unknown;
}
interface LibraryEntry {
  id: string;
  place?: string;
  month?: string;
  mobileCenter?: number;
  motionReadiness?: string;
}

export function sceneIds(): string[] {
  return (library.scenes as LibraryEntry[]).map((s) => s.id);
}

export function loadScene(id: string): SceneData {
  const entry = (library.scenes as LibraryEntry[]).find((s) => s.id === id);
  if (!entry) throw new Error(`[scene] no scene "${id}" in src/data/scene-library.json`);
  const file = path.join(process.cwd(), "public", "scenes", id, "scene.json");
  const man = JSON.parse(fs.readFileSync(file, "utf8")) as Manifest;
  const cfg = SETTINGS[id] ?? {};
  const grid = man.sourceSize ?? [1536, 1024];
  const [webW, webH] = man.webSize ?? grid;
  const mobileX = (entry.mobileCenter ?? 50) / 100;
  // Still-first scenes (the catalog's motion readiness says so) keep every layer at rest.
  const still = !man.cutoverCleanup && /^still preferred/i.test(entry.motionReadiness ?? "");
  const layers = man.layers.map((l): SceneLayer => {
    const own = cfg.layer?.[l.name] ?? {};
    const tested = l.recommendedHorizontalSourcePx ?? l.testedHorizontalSourcePx ?? l.testedTravelSourcePx;
    let cap: [number, number] = l.capSourcePx ?? (tested !== undefined ? [tested, 0] : [0, 0]);
    if (still) cap = [0, 0];
    return {
      name: l.name,
      src: l.src,
      width: webW,
      height: webH,
      depth: l.depth ?? 0.5,
      motion: still ? null : (own.motion ?? null),
      shore: own.shore,
      cap,
      capSource: still ? "still-first scene (catalog motion readiness)" : "manifest",
      anchor: cfg.anchor ?? [0.5, 0.5],
      mobileAnchor: cfg.mobileLayer?.[l.name] ?? [mobileX, 0.5],
      touchesTop: cfg.touchesTop ? cfg.touchesTop.includes(l.name) : true,
    };
  });
  const readFile = path.join(process.cwd(), "public", "scenes", id, "read.webp");
  const read = fs.existsSync(readFile)
    ? { src: `/scenes/${id}/read.webp`, width: 768, height: Math.round((768 * webH) / webW), mobileX }
    : null;
  const stillPath = path.join(process.cwd(), "public", "scenes", id, "still.webp");
  if (!fs.existsSync(stillPath)) throw new Error(`[scene] ${id} has no still.webp: run pnpm scenes:derive`);
  const mobilePath = path.join(process.cwd(), "public", "scenes", id, "still-mobile.json");
  const mobile = fs.existsSync(mobilePath) ? JSON.parse(fs.readFileSync(mobilePath, "utf8")) : null;
  const composite = { src: `/scenes/${id}/still.webp`, width: webW, height: webH, mobileX, mobile };
  return { id, place: entry.place ?? man.place ?? id, month: entry.month ?? man.month ?? "", grid, layers, read, still: composite };
}

export interface SceneArt {
  id: string;
  place: string;
  month: string;
  /** 480×320, the layers flattened (scripts/scene-derivatives.mjs): the SceneSelector swatch. */
  swatch: string;
  /** The flattened scene at web size and a 9:16 crop around the mobile center. Only scenes a
   * case study is paired with have them (null otherwise). */
  flat: string | null;
  flatTall: string | null;
  /** Desktop cover-fit anchor of the flattened scene (0…1, like object-position). */
  anchor: [number, number];
}

/**
 * A scene as a picture rather than the live Scene: its swatch and flattened copies, made by
 * `pnpm scenes:derive` (scripts/scene-derivatives.mjs) and committed. Throws at build time if a
 * file is missing, so a new pairing can't ship without its art.
 */
export function sceneArt(id: string): SceneArt {
  const scene = loadScene(id);
  const has = (f: string) => fs.existsSync(path.join(process.cwd(), "public", "scenes", id, f));
  if (!has("swatch.webp")) throw new Error(`[scene] ${id} has no swatch.webp: run pnpm scenes:derive`);
  return {
    id,
    place: scene.place,
    month: scene.month,
    swatch: `/scenes/${id}/swatch.webp`,
    flat: has("flat.webp") ? `/scenes/${id}/flat.webp` : null,
    flatTall: has("flat-tall.webp") ? `/scenes/${id}/flat-tall.webp` : null,
    anchor: SETTINGS[id]?.anchor ?? [0.5, 0.5],
  };
}

export interface SceneBackdrop {
  id: string;
  /** The reading still (read.webp): the place as it's only ever seen, through the focus recipe. */
  src: string;
  width: number;
  height: number;
  /** object-position, desktop and phone (as the Scene's own reading still). */
  position: string;
  scene: SceneData;
}

/**
 * A scene as a backdrop: the reading still that a page brings in behind its focused content,
 * over its own scene, while a part of the page is in view (home's Work list and sections) or a
 * story is pointed at (the /projects index). Throws at build time if read.webp is missing.
 */
export function sceneBackdrop(id: string): SceneBackdrop {
  const scene = loadScene(id);
  if (!scene.read) throw new Error(`[scene] ${id} has no read.webp: run pnpm scenes:derive`);
  const [ax, ay] = scene.layers[0]?.anchor ?? [0.5, 0.5];
  const pct = (v: number) => `${+(v * 100).toFixed(2)}%`;
  return {
    id,
    scene,
    src: scene.read.src,
    width: scene.read.width,
    height: scene.read.height,
    position: `--ax:${pct(ax)};--ay:${pct(ay)};--mx:${pct(scene.read.mobileX)};--my:50%`,
  };
}
