/** One reusable depth contract. A landscape changes plane artwork, not its animation rig. */
export type PlaneSlot = "sky" | "far" | "mid" | "near";
export const PLANE_SLOTS: PlaneSlot[] = ["sky", "far", "mid", "near"];
export const PLANE_DEPTH: Record<PlaneSlot, number> = { sky: .97, far: .85, mid: .55, near: .05 };
export const PLANE_SPRING: Record<PlaneSlot, number> = { sky: 0, far: 1, mid: 2, near: 3 };
export function planeSlot(name: string): PlaneSlot | null {
  if (PLANE_SLOTS.includes(name as PlaneSlot)) return name as PlaneSlot;
  if (name === "terrain") return "mid";
  if (name === "lift" || name === "wing") return "near";
  return null;
}
