/** Build-time compatible siblings; generated only from linked, approved media. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const req = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
const sharp = req('sharp');
const dimensions = new Map<string, Promise<{ width?: number; height?: number }>>();
export async function videoFallbacks(src: string) {
  const stem = src.replace(/\.(webm|mp4)$/, '');
  const file = (name: string) => path.join(process.cwd(), 'public', name);
  const has = (name: string) => fs.existsSync(file(name));
  const poster = has(`${stem}-poster.webp`) ? `${stem}-poster.webp` : undefined;
  if (poster && !dimensions.has(poster)) dimensions.set(poster, sharp(file(poster)).metadata());
  const size = poster ? await dimensions.get(poster) : undefined;
  return {
    mp4: has(`${stem}.mp4`) ? `${stem}.mp4` : undefined,
    poster,
    width: size?.width,
    height: size?.height,
  };
}
