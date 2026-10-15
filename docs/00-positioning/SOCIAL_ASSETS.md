# Social and video assets

Editable source: **Cello — Social & Video Kit** in the personal Cello.Design Figma workspace. The private file URL and node ledger stay outside this public repository.

## Asset inventory

- LinkedIn: Day and Dusk banners, 1584 × 396.
- Link sharing: 1200 × 630 editable preview of the current homepage: Hi, I’m Cello, the illustrated guide, landscape, and actual navigation.
- YouTube: 2560 × 1440 geometric and Mirror Lake banners, 800 × 800 avatar, transparent 150 × 150 watermark.
- Video: three 1280 × 720 thumbnail starting layouts (Build / ship, Deep dive, Reflective), a transparent 1920 × 1080 lower third, and a 1920 × 1080 end screen.
- Logo: editable original vector paths, transparent mark, and a three-second assembly timeline.

Headlines on the thumbnail templates are examples, not a publishing commitment. Channel assets follow the existing channel direction: making real things and learning in public.

## Landscapes by depth

The Figma file contains ten Scene components and 33 Plane components, built from the current `public/scenes/*/scene.json` files. Each Scene nests instances of its own planes at the same origin. Boolean properties expose individual plane visibility without a variant for every possible combination.

| Scene | Planes |
| --- | --- |
| Mirror Lake | sky, far, mid, near |
| Bald Mountain | sky, far, near |
| Ecola | sky, far, mid, near |
| Mt Hood Meadows | sky, far, mid, near |
| Meadows lift line | sky, terrain, lift |
| Cottage Grove waterfall | sky, mid, near |
| Over Hood | sky, terrain, wing |
| Ramona Falls | sky, mid, near |
| Salmon ridge | sky, far, near |
| Sauvie Island | sky, far, near |

Depth and inspected travel limits are documented on the Plane components from their manifests; they are not opacity values. Imported PNGs preserve the decoded source artwork and transparency. They are image fills whose crop, position, visibility, and replacement can be edited; they are not vector reconstructions. Existing aesthetic-approval and motion limitations remain in the component descriptions.

To use a landscape:

1. Copy a Scene instance from the landscape picker, or insert it from Figma's Assets panel.
2. Toggle `Show sky`, `Show far`, and the other available plane switches in the right sidebar.
3. Resize with the aspect-ratio lock on. SCALE constraints keep every plane registered. A 768 × 512 Mirror Lake instance was checked against its 1536 × 1024 source.
4. For a banner or portrait, crop the instance inside a frame. Keep the planes' shared origin and avoid stretching individual planes.
5. Edit a Plane source component to propagate artwork changes to its scene instances. Static banners do not imply that larger parallax travel is safe.

The Mirror Lake banner, reflective thumbnail, and end screen use Scene instances. Portrait collages and their depth/cutout variations are retained as personal brand graphics, separate from the site preview. Typography, logo paths, and artwork remain independently editable.

## Export and sharing

Export banners and cards as PNG at 1×. YouTube's centered text/logo area is approximately 1544 × 422 on the 2560 × 1440 master; the guide is hidden from exports. Check the platform's upload preview before publishing. Keep the YouTube banner under 6 MB, watermark under 1 MB, and LinkedIn banner under 8 MB.

The default website card is `public/images/social/cello-homepage-2026-10.png`. Both site layouts read its versioned path, dimensions, and alt text from `src/data/social.ts`. Explicit project/article covers retain priority. Platforms may retain old previews until they recrawl the deployed page.

Specs: [LinkedIn cover images](https://www.linkedin.com/help/linkedin/answer/a568217), [YouTube channel branding](https://support.google.com/youtube/answer/10456525?hl=en).

## Sharing-card direction

The default link card previews the destination website. It is reconstructed as editable Figma layers from the real homepage, with a linked scene instance, the original illustrated guide, exact greeting/positioning/navigation copy, and source project marks. The initial layout came from the homepage’s 1440 × 756 first view, scaled to 1200 × 630. Cello then adjusted the composition in Figma; that edited frame is now authoritative. Re-export it directly rather than resetting its layout to the browser reference. The photographed portrait compositions are separate personal-brand/social graphics, not the website preview.
