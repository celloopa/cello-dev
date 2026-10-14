// Generate compatible siblings only for videos linked by a built page.
// pnpm build, then node scripts/video-fallbacks.mjs [dist]
// ffmpeg is a local preparation tool; Netlify uses the committed outputs.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const req = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
const sharp = req('sharp');
const dist = path.resolve(process.argv[2] || 'dist');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const sources = new Set();
for (const file of walk(dist).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  for (const tag of html.matchAll(/<(?:video|source)\b[^>]*\bsrc="([^"?]+\.webm)"/g)) sources.add(tag[1]);
}
for (const src of sources) {
  if (!src.startsWith('/images/')) throw new Error(`Unexpected video path: ${src}`);
  const input = path.join('public', src);
  const mp4 = input.replace(/\.webm$/, '.mp4');
  const poster = input.replace(/\.webm$/, '-poster.webp');
  if (!fs.existsSync(mp4)) execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-nostdin','-i',input,'-an','-vf',"scale=w='min(1440,iw)':h=-2",'-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-threads','2',mp4], { stdio:'inherit' });
  if (!fs.existsSync(poster)) {
    const png = execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-nostdin','-ss','0.1','-i',input,'-frames:v','1','-vf',"scale=w='min(1440,iw)':h=-2",'-c:v','png','-f','image2pipe','pipe:1'], { maxBuffer: 20 * 1024 * 1024 });
    await sharp(png).webp({ quality: 82 }).toFile(poster);
  }
  console.log(src);
}
console.log(`${sources.size} linked videos have MP4 and poster siblings.`);
