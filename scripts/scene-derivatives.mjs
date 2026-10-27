// Small, flattened copies of the scene art for the pages that show a place as a picture rather
// than as the live Scene (landscape build S3), plus the /card artifacts. Run after a scene's
// layers change; the outputs are committed.
//
//   pnpm scenes:derive [--stills-only]
//
// For every scene in src/data/scene-library.json:
//   public/scenes/<id>/swatch.webp      480×320, the layers flattened back → front (the
//                                       SceneSelector swatch on /projects and /blog)
//   public/scenes/<id>/read.webp        the layers flattened at half size: the still that reading
//                                       and index pages paint first, under the focus blur
//   public/scenes/<id>/still.webp       sharp complete first paint, before hidden cuts load
//   public/scenes/<id>/still-mobile.*   optional phone composite and source-crop recipe for
//                                       independently anchored foreground (Mirror Lake)
// For every scene a case study is paired with (src/data/scene-pairings.json `projects`):
//   public/scenes/<id>/flat.webp        the flattened scene at its web size (desktop /card
//                                       panel, /projects preview)
//   public/scenes/<id>/flat-tall.webp   a portrait crop around the catalog's mobile center
//                                       (phone /card panel)
// And the /card artifacts (demo personas only, D3), 16:10 crops at 960×600:
//   public/images/card/<slug>.webp
//
// sharp comes from Astro's own dependency tree (no new dependency).
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const req = createRequire(createRequire(import.meta.url).resolve("astro/package.json"));
const sharp = req("sharp");
const pub = (p) => path.join(root, "public", p);
const library = JSON.parse(fs.readFileSync(path.join(root, "src/data/scene-library.json"), "utf8"));
const pairings = JSON.parse(fs.readFileSync(path.join(root, "src/data/scene-pairings.json"), "utf8"));
const framing = JSON.parse(fs.readFileSync(path.join(root, "src/data/scene-framing.json"), "utf8"));
const stillsOnly = process.argv.includes("--stills-only");
const paired = new Set(Object.values(pairings.projects));
const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(1)} KB`;

// The /card artifacts: [source, crop of the source before the 16:10 cover crop (or null)].
const ARTIFACTS = {
  "asheville-dispensary": ["/images/projects/ad-assets/ad-assets-thumbnail.png", null],
  ghosted: ["/images/projects/ghosted/v3/board.webp", null],
  vegavengers: ["/images/projects/veg-avengers-thumbnail.png", null],
  daybreak: ["/images/projects/daybreak/hero.webp", null],
};

async function flatten(id) {
  const man = JSON.parse(fs.readFileSync(pub(`scenes/${id}/scene.json`), "utf8"));
  const [base, ...rest] = man.layers;
  const meta = await sharp(pub(base.src)).metadata();
  const buf = await sharp(pub(base.src))
    .composite(rest.map((l) => ({ input: pub(l.src) })))
    .png()
    .toBuffer();
  return { buf, width: meta.width, height: meta.height };
}

for (const entry of library.scenes) {
  const { id } = entry;
  const { buf, width, height } = await flatten(id);
  // A single complete image cannot expose sky through a still-downloading lake plane.
  const still = pub(`scenes/${id}/still.webp`);
  await sharp(buf).webp({ quality: 95 }).toFile(still);
  const cfg = framing[id] ?? {};
  if (cfg.mobileLayer && Object.keys(cfg.mobileLayer).length) {
    // One portrait window, flattened from the SAME cuts at their established phone anchors.
    const cropW = Math.round(height * 390 / 844);
    const man = JSON.parse(fs.readFileSync(pub(`scenes/${id}/scene.json`), "utf8"));
    const crops = {};
    const plates = await Promise.all(man.layers.map(async (l) => {
      const ax = cfg.mobileLayer[l.name]?.[0] ?? (entry.mobileCenter ?? 50) / 100;
      const left = Math.round((width - cropW) * ax);
      crops[l.name] = left;
      return { input: await sharp(pub(l.src)).extract({ left, top: 0, width: cropW, height }).png().toBuffer() };
    }));
    const mobile = pub(`scenes/${id}/still-mobile.webp`);
    await sharp({ create: { width: cropW, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(plates).webp({ quality: 95 }).toFile(mobile);
    fs.writeFileSync(pub(`scenes/${id}/still-mobile.json`), JSON.stringify({
      src: `/scenes/${id}/still-mobile.webp`, width: cropW, height, crops,
    }, null, 2) + "\n");
  }
  if (stillsOnly) { console.log(`${id}: still ${kb(still)}`); continue; }
  const swatch = pub(`scenes/${id}/swatch.webp`);
  await sharp(buf).resize(480, 320, { fit: "cover" }).webp({ quality: 72 }).toFile(swatch);
  // the reading still: half size, since reading and index pages only ever show it through the
  // focus recipe's blur; it paints early on a slow link, and the full layers stay for the renderer
  const read = pub(`scenes/${id}/read.webp`);
  await sharp(buf).resize(768).blur(1.2).webp({ quality: 60 }).toFile(read);
  let line = `${id}: swatch ${kb(swatch)}, read ${kb(read)}`;
  if (paired.has(id)) {
    const flat = pub(`scenes/${id}/flat.webp`);
    await sharp(buf).webp({ quality: 64 }).toFile(flat);
    // portrait 9:16 around the mobile center, as object-position would place it
    const w = Math.round((height * 9) / 16);
    const left = Math.round((width - w) * ((entry.mobileCenter ?? 50) / 100));
    const tall = pub(`scenes/${id}/flat-tall.webp`);
    await sharp(buf).extract({ left, top: 0, width: w, height }).webp({ quality: 64 }).toFile(tall);
    line += `, flat ${kb(flat)}, flat-tall ${kb(tall)}`;
  }
  console.log(line);
}

if (!stillsOnly) {
  fs.mkdirSync(pub("images/card"), { recursive: true });
  for (const [slug, [src, crop]] of Object.entries(ARTIFACTS)) {
    let img = sharp(pub(src));
    if (crop) img = sharp(await img.extract(crop).png().toBuffer());
    const out = pub(`images/card/${slug}.webp`);
    await img.resize(960, 600, { fit: "cover", position: "top" }).webp({ quality: 76 }).toFile(out);
    console.log(`card artifact ${slug}: ${kb(out)}`);
  }

}
