# Curated landscapes — local review

Historical local baseline: freshly fetched production `4399f26` on 2026-10-15; separate curated-scenes checkout. Publication was subsequently approved; see the final section.

Before: hero fixed to Mirror Lake; VegAvengers paired to Sauvie; post rotation includes Cottage Grove waterfall. All ten masters/cuts exist, with scene-specific travel limits. The initial DOM still consists of independently loading cuts. Another chat owns the atomic still/decoded-cut handoff; the completed local snapshot was subsequently reviewed and integrated as documented below.

Scope: four Hood hero options; seven recommended background options; Over Hood motion experiment; Sauvie and Cottage Grove parked with sources retained. Preserve copy, guide, navigation and social artwork. Original cut bounds were retained initially; the independent-plane follow-up below explicitly introduces new candidate bounds.

Review files and recordings: local artifact bundle, `curated-scenes`, dated 2026-10-15. See the final validation section below.

## Implementation and evidence

Worker: isolated `curated-scenes` checkout from production `4399f26`. Build: `pnpm build`, 122 Astro files, zero errors/warnings/hints, 16 pages. No package changes. `git diff --check` and private-pattern scan clean.

Local site: `http://127.0.0.1:4635/`. Review gallery: `http://127.0.0.1:4636/`. Native PNGs, exact image prompts, Figma ledger, recordings and verification JSON live in the local `curated-scenes` artifact bundle dated 2026-10-15. That bundle includes reproducible drivers, all four Hood desktop/phone captures, isolated skies and prototype cuts, and SHA-256 fingerprints of the completed loading-fix source snapshot.

Persona: **Morgan**, fictional product design hiring manager, English, first visit on desktop or phone, looking for the work. No account or seeded private data.

| Flow | Expected and observed | Result | Evidence |
| --- | --- | --- | --- |
| Arrive in each Hood scene | Selected scene and matching label; greeting, planted guide and navigation preserved; no overflow at 1440×900 or 390×844 | Pass, 8 | `hero-<id>-<width>.png`, `verification.json` |
| Return to the hero | Six visits use only four Hood choices, no adjacent repeat when storage works; selection stays fixed while viewing | Pass | `verification.json` |
| Read with fallbacks | No-JS Mirror Lake; no-WebGL/save-data chosen still; blocked storage still selects a valid scene; reduced motion has no renderer | Pass, 4 plus hero checks | `fallback-*-390.png` |
| See depth without reassembly | Each Hood choice reaches WebGL; initial movement caps retained (superseded below) | Pass, 4 | `motion-<id>-1440.png` |
| Wait for a missing cut | Hold far/terrain download for each Hood choice at both widths: complete decoded poster visible, all cuts hidden, no partial canvas; release → complete canvas | Pass, 8 | `held-<id>-<width>.png`, `held-loading.json` |
| Wait for the first still | Hold poster at desktop/phone: art hidden until decode, words visible, full cuts not requested yet | Pass, 2 | `held-loading.json` |
| Return to a hidden tab | Simulated initial hidden state defers WebGL; visibility event allows it to start | Pass, 1 | `held-loading.json` |
| Inspect repaired artwork | Ecola and Salmon isolated skies + assembled views inspected. Native Figma 1536×1024 exports match local PNGs exactly; all non-sky cuts match production bytes | Pass | `art-validation.json`, `art/`, native PNG exports |

28 browser checks total; the existing screenshot driver also captured 8 desktop/phone home and project-index shots. Over Hood restack max/mean difference = 0. Its 6-second before/after clips render the documented caps at 24fps, full-frame and centered phone crop. Site after clips capture this integrated checkout from navigation at desktop/phone; site before clips are the prior production handoff recordings from the loading-fix bundle. They are labeled references, not a controlled comparison of hero art alone.

## Open and publication boundary

Over Hood remains experimental: its fixed-wing hierarchy is better, but 2 source px terrain travel is too subtle for a convincing longer plane passage. The new cutting model is not in the runtime manifest or source master. No stronger movement clearance claimed. The two sky repairs remain aesthetic review candidates; pre-existing far/near fringe artifacts and invented outpaint are retained. Physical iPhone Safari remains unverified. The loading fix removes the reproduced partial still and canvas reassembly; it does not promise elimination of every GPU compilation pause.

No commit, public push or deployment. Social assets, sharing card and unrelated dirty files were preserved. Safe publication must rebuild a clean tree on freshly fetched production, scan it and use a sole-parent publication commit.

## Independent-plane component follow-up

Cello clarified that moving the whole image did not satisfy the request, then asked for a reusable component with replaceable Far/Mid/Near artwork. The earlier common camera pan was rejected and removed. Its `cursor-after` recordings and camera coverage logs are historical evidence, not the current implementation.

`ScenePlane.astro` now renders each cut. `planes.ts` shares semantic Sky/Far/Mid/Near depth and spring assignments across the hero renderer and DOM reading layers. The three new scenes have registered versioned cuts, new candidate caps scaled from Mirror Lake's actual 1536×1024 grid, original assets retained, and visible RGB restored. Generated hidden terrain and corrected mattes are local image-generation artifacts. All three exact restacks have max/mean difference 0. Isolated planes and diagonal motion extremes were inspected; some needle/cable fringe remains a local art-review limitation.

Figma native component `58:80` has four instance-swap artwork properties and four visibility switches; existing masters supply the planes. Matching preset instances are `60:86`, `60:91`, `60:96`. Missing lift Far was added as `59:84`; lift's native 4:3 scene has proportional 3:2 adapters, rather than stretched images. Native PNG fills update the source masters and their instances. Mirror Lake planes and social artwork remain untouched.

Morgan's checks cover desktop pointer extremes across all four heroes, individual cap bounds, fixed guide/content, desktop/phone arrival, per-visit selection, no-JS/reduced-motion/no-WebGL/save-data stills, held cuts, delayed poster and initially hidden page. Current motion clips are `depth-<id>.mp4`; current offset JSON is `cursor-depth-component.json`. The gallery provides these clips plus the Figma rig link. Build and browser results are retained in `independent-planes/`; original loading-fix snapshot hashes remain in `handoff-integration.json`, before the semantic-spring integration.

Nothing committed, pushed or deployed. Physical iPhone Safari remains unverified. The larger independent cuts remain a local review candidate.

Final component verification: `pnpm build` passes (124 Astro files; 0 errors/warnings/hints; 16 pages). All four pointer checks have strictly increasing per-plane excursion, bounded offsets, no shared camera pan and a fixed guide; see `independent-planes/travel-check.json`. All 17 arrival/selection/fallback checks and 11 held/slow/hidden checks pass. Gallery checks pass at 1440 and 390. New native lift Far export matches the uploaded PNG exactly (maximum RGBA difference 0); Figma component properties and preset bindings are captured in `independent-planes/figma-ledger.json`. Saved image prompts: `independent-planes/image-prompts.json`.

## Exposed-outline correction

Cello supplied a Meadows lift screenshot showing mountain and cable remnants when planes separate. Isolated inspection reproduced fragments in the sky and mountain pixels on the forest plane. The prior zero-difference restack preserved those mistakes; it is historical evidence, not a success criterion for the cleaned cut set.

The current cleanup replaces the contaminated sky with a generated uninterrupted plate, uses clean land silhouettes, refines source forest mattes instead of unioning contaminated old alpha, and removes trees accidentally included below the suspended-chair cut. Native foreground RGB is restored; the soft Meadows grass transition adds at most one 8-bit compositing level of rounding; corrected background and edge pixels intentionally differ. Travel caps and semantic springs are unchanged. Evidence: `independent-planes/trace-cleanup-checks.json`, isolated `*-clean.png`, displaced composites and `cursor-clean*.png`. Built-in image generation prompt and source are saved in `trace-image-prompts.json`; runtime assets are versioned `*-depth-clean.webp`.

Morgan cleanup run: all four Hood heroes checked at both desktop cursor extremes; Meadows lift additionally checked at 2815×1282, matching the reported screenshot size. The exposed mountain/cable remnants are absent in the inspected wide screenshot. All offsets stay bounded and the guide remains planted. Desktop/phone arrival and fallback checks: 17 pass. Held cuts, slow poster, hidden tab: 11 pass. Build: 124 Astro files, 0 errors/warnings/hints, 16 pages. Native cleaned lift Mid PNG round trip: exact RGBA match (max difference 0). Eleven native Figma plane fills confirmed; upload receipts and source PNGs retained. Updated `depth-<id>.mp4` clips show the clean cut set. Original sources and earlier candidates remain retained; no deployment.

## Left lift cable correction

Cello isolated the remaining issue to the left lift cables. Binary sky thresholds had removed parts of thin cables and clipped the ends before the tree line. Four source-fitted quadratic paths now supply continuous antialiased coverage, with dark ink recovered from neighbouring opaque cable pixels; original chair bodies and hangers composite in front. No new AI generation was needed for this source-mask refinement. Hidden tails extend to web y760. The Lift plane paints before Terrain for occlusion while retaining the Near spring and travel caps.

Cable coverage checks pass for every source row through y489 (minimum summed coverage 1.015625 px). At all 16 independent Near/Mid x/y cap combinations, all cable tail pixels in web y740–759 remain covered by Terrain: 0 exposed pixels. Records: `meadows-lift/cable-checks.json`, `cable-occlusion-checks.json`. Figma source Near `12:63` receives a static, terrain-clipped equivalent; web uses the extended tail version. Only Meadows lift art/order and its derived stills change. Stray alpha holes in its opaque left slope/forest are filled from the native master so extended cable ends stay occluded.

Cable validation complete: build passes (0 errors/warnings/hints; 16 pages). Browser pointer extremes pass at 1440×900 and 2815×1282; phone arrival inspected at 390×844. Individual offsets stay bounded. Current shots: `cursor-cables-final-*` and `cursor-cables-phone-final-*`; the Meadows lift motion clip is updated. Native Figma cable export has identical alpha, opaque RGB and premultiplied RGB (max difference 0); raw RGB under low alpha rounds differently and is not claimed exact. No publication.

## Publication approval and integration

Cello: “great let's ship to main.” The repo's live branch is `master`; `main` is stale. A clean publication checkout starts from production `12f3225`, preserving the already-shipped `9cd0d13` loading fix and `12f3225` social-card/logo release. Three-way integration preserves current sharing metadata. The Scene component conflict is a file extraction: its completed atomic-still body is retained in SceneFrame, with the slot wrapper in Scene. Catalog keeps both the shipped framing/still fields and semantic plane roles. No unrelated dirty checkout files are included. Only current runtime cuts and derivatives are published; rejected intermediate image candidates remain in the local worker/artifact bundle.

Publication validation: clean release build passes with zero errors/warnings/hints and 16 pages. All 17 arrival/selection/fallback checks, 11 held/slow/hidden checks, and the wide lift pointer check pass against the publication checkout. Runtime cut references resolve; current production resume, sharing artwork and logo implementation remain byte-identical. Preview/live deployment receipts are retained in the local review bundle.
