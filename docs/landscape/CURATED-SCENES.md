# Curated portfolio backgrounds

Release candidate, 2026-10-15. Cello approved publication after the scene and cable review. The live mainline is `master`; `main` is an older inactive branch.

`src/data/scene-slots.json` owns the allowed choices and no-JS fallback. `scene-library.json` owns scene availability and source facts. `scene-pairings.json` assigns reading backgrounds. Pairing resolution rejects inactive choices at build time. `loadScene()` can still read parked/experimental art for previews; `sceneIds()` returns active choices unless explicitly asked for all.

| Slot | Options |
| --- | --- |
| Hero | Bald Mountain, Meadows lift line, Mt Hood Meadows, Mirror Lake |
| Background | Hero options plus Ecola, Salmon ridge, Ramona Falls |
| Experimental | Over Hood |
| Parked, sources retained | Sauvie Island, Cottage Grove waterfall |

Home selects once per page visit, before rendering the greeting. Session storage prevents an immediate repeat; blocked storage falls back to a random allowed choice. A reload is a visit. The back button may restore the browser's existing page snapshot. There is no rotation timer. `?scene=<hero-id>` pins an allowed Hood choice for review; other IDs are ignored. Without JavaScript, Mirror Lake remains visible. Reduced motion, save-data and no-WebGL keep the selected complete still.

`Scene.astro` holds inert templates and mounts one `SceneFrame.astro`, so unselected scene art does not download. SceneFrame contains the source loading-fix component's composite, label and original guide configuration. Renderer ownership remains with the landscape-handoff chat; its reviewed snapshot is integrated here, with hashes retained in the local review bundle. Future loading changes should be reconciled against that snapshot, not copied over the slot wrapper blindly.

## Replaceable depth planes

Cello rejected whole-image cursor panning and requested separate Far/Mid/Near artwork, as in Mirror Lake. That camera implementation has been removed. `ScenePlane.astro` renders each registered cut; `planes.ts` defines the common Sky/Far/Mid/Near depth and spring roles. Each scene supplies its own images and source-pixel caps through its manifest. Missing Mid does not change Near's spring. The renderer and reading backdrops use the same semantic roles; the guide and content stay planted.

The three new Hood heroes use versioned `*-depth.webp` cuts with Mirror Lake's per-plane travel scaled to their source grids. The actual Mirror reference is 1536×1024, with Near ±38×19 source px. At 1440×900, horizontal pointer excursion is approximately 2.4 CSS px for Sky, 12 for Far, 36 for Mid and 75 for Near across all four heroes. Lift's mountain is Far, terrain Mid, and suspended chairs/cables Near. Mirror Lake artwork and caps remain unchanged.

The current manifests reference `*-depth-clean.webp`. Cello reported exposed outlines during movement: the earlier sky retained fragments and the old forest alpha included mountain pixels. Those cuts and their exact-restack checks are superseded. The cleanup uses a generated uninterrupted sky, separate clean distant-land silhouettes, and source-refined forest/foreground masks. Original foreground RGB is retained; Meadows uses a soft grass transition with up to one 8-bit level of compositing rounding; background and ambiguous boundary pixels are intentionally corrected. Independent travel and springs are unchanged. Inspect isolated cuts and displaced composites, not just the rest position. Original assets and rejected candidates remain available for comparison. The native Figma plane masters use corresponding cleaned PNGs.

Meadows lift cable correction: `lift-cables.webp` replaces the thresholded cable cut with continuous, antialiased masks fitted to the four source cable paths. Dark cable ink is decontaminated from the blue sky; chair artwork is retained. Hidden tails extend to web y760. The opaque left slope/forest also has its stray mask holes closed in `terrain-cable-occlusion.webp`. Painter order is Sky → Far → Lift → Terrain, so the forest occludes the cable ends; Lift still uses the Near motion role and caps. Figma Near master `12:63` uses the matching visible/static cut, with hidden portions clipped against the resting terrain. Web keeps those tails for motion. The other scene layers are unchanged.

Figma has one native **Portfolio / Scene rig** component, `58:80`, with `Sky artwork`, `Far artwork`, `Mid artwork`, and `Near artwork` instance-swap properties plus visibility switches. Presets: Bald `60:86`, Meadows `60:91`, lift `60:96`. Lift uses proportional cover-crop adapters for the shared 3:2 rig; its original 4:3 source remains native. Replace the matching plane artwork without rebuilding the scene. The editable source link is retained in the local review bundle. Local motion review: `http://127.0.0.1:4636/#cursor-motion`.

Current assignments: Asheville → Bald Mountain while Over Hood is reviewed; Ghosted → Ecola; VegAvengers → Ramona; Daybreak → Meadows. Posts hash through Bald Mountain, Ramona, Meadows, Meadows lift and Salmon ridge. Home's reading sections retain their own assignments.

Ecola and Salmon reference versioned `sky-v2.webp` plates. Original sky/master files remain intact; other cuts are byte-identical to production. Rebuild derived composites, reading stills and swatches after changing a layer: `pnpm scenes:derive`. Figma sky masters were updated with the native PNG equivalents. The seven editable Background slot variants contain existing Scene instances, retaining plane switches and source aspect ratios. Meadows lift's 4:3 source is cover-cropped inside the common 3:2 slot rather than stretched. Parked masters and cards remain available in a separate group.

Over Hood's new cuts remain in the local review bundle, outside runtime. A generated matte separates the nearer ridges, visible RGB comes from the original terrain, and generated hidden fill is used only behind them. Restack difference is zero. Preview travel is distance ±0.5 and near ±2 source px, wing 0, sky 0. This improves the depth hierarchy but remains too subtle for a convincing extended flyby at the original cap. Do not adopt a stronger travel or new cutting model from this prototype without reviewing its motion and hidden edges.

Validation and limitations: [persona/run record](../runs/2026-10-15-curated-scenes.md). Physical iPhone Safari and long-lived browser sessions remain unverified. The social-kit checkout and sharing-card hand edits are untouched. Publication uses a fresh clean commit sole-parented on verified production, preserving the loading fix, original logo motion and sharing card; historical worker ancestry is excluded.
