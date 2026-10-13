/*
 * Scene pairings for reading pages (build time). The pairing is data, in
 * src/data/scene-pairings.json; this only resolves it.
 *   case study  its entry in `projects`, else the post rotation
 *   post        the rotation in `posts`, picked by a hash of the slug (FNV-1a), so a post keeps
 *               its scene whatever other posts come and go
 *   home        `home` (the hero's scene), and `homeSections`: the place behind each of home's
 *               reading sections that isn't a case study (How I Build, About, Let's Talk, the
 *               footer) while it's in view
 */
import pairings from "@/data/scene-pairings.json";
import { sceneIds } from "./catalog";

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function checked(id: string, from: string): string {
  if (!sceneIds().includes(id)) throw new Error(`[scene] ${from} names "${id}", which isn't in src/data/scene-library.json`);
  return id;
}

export function sceneForPost(slug: string): string {
  const rotation = pairings.posts;
  return checked(rotation[fnv1a(slug) % rotation.length], `the post rotation (${slug})`);
}

export function sceneForProject(slug: string): string {
  const own = (pairings.projects as Record<string, string>)[slug];
  return own ? checked(own, `projects.${slug}`) : sceneForPost(slug);
}

export const homeScene = (): string => checked(pairings.home, "home");

export function homeSection(key: string): string {
  const id = (pairings.homeSections as Record<string, string>)[key];
  if (!id) throw new Error(`[scene] src/data/scene-pairings.json has no homeSections.${key}`);
  return checked(id, `homeSections.${key}`);
}
