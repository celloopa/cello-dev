/** Shared, build-time slot contract. Inactive art can be loaded for review, never paired. */
import slots from "@/data/scene-slots.json";
import { sceneIds } from "./catalog";
export type SceneSlot = "hero" | "background";
export function sceneOptions(slot: SceneSlot): string[] {
  const ids = slots[slot].options;
  if (!ids.length || new Set(ids).size !== ids.length) throw new Error(`[scene] invalid ${slot} options`);
  for (const id of ids) if (!sceneIds().includes(id)) throw new Error(`[scene] inactive ${slot} option: ${id}`);
  if (!ids.includes(slots[slot].fallback)) throw new Error(`[scene] missing ${slot} fallback`);
  return [...ids];
}
export function sceneFallback(slot: SceneSlot): string {
  sceneOptions(slot);
  return slots[slot].fallback;
}
