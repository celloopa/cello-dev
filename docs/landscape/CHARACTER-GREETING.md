# Cello’s layered hiking greeting

Preview iteration, October 14, 2026. Character and greeting changes remain preview-only; the preview includes the independent writing publication `b2f753d`.

The selected character uses Cello’s current likeness cues, modern mullet, thin round glasses, subtle facial hair, rain jacket and backpack. The face and body share one simplified cut-paper style. Source portrait and hiking photographs remain private. Generated with the built-in imagegen tool; the selected transparent PNG is retained in the private generation output and the current 384×576 WebP derivative lives at `public/images/characters/cello-hiker-v2.webp`. The prior v1 derivative remains available.

## Runtime depth

Current placement follows Cello’s feedback that the guide was lost in the scene’s shadow. The character is now a foreground DOM cutout beside the text, above the scenery’s grading, atmosphere and copy scrim. The four landscape planes remain separate in Three.js. The existing renderer’s bounded guide spring updates the foreground’s CSS offsets within the same frame loop; no additional pointer listener or animation loop is introduced. The guide metadata appears last in the depth inventory, with `surface: foreground`, rather than creating another textured GPU mesh.

Character travel remains capped at 28/14 source pixels, scaled through the scene’s current fit. Chat geometry is fixed. HTML layout anchors the foreground directly beside the chat on desktop and phone, with his feet level with the bottom of the chat box (88px wide on phones, 176px on desktop; a token-based negative top margin lets him rise above a short greeting without stretching its row). Without JavaScript/WebGL, under reduced motion, or after context loss, the character stays as a normal transparent image at rest. It scrolls out naturally with the hero.

The original prototype placed the guide between terrain and foreground; this front placement supersedes that composition. The old v1 asset is retained; v2 is clean-shaven.

## Generation prompt

Create one friendly full-body illustrated cut-paper hiking character on a truly transparent background. This is a COMPLETE UNIFIED REDRAW, not a face pasted onto another body. Input1 is the actual landscape illustration style of the portfolio: simple bold painted shapes, limited colors, slight paper grain. Input2 is the real person for a few identifying cues only. Input3 is the earlier cheerful character the user liked, for friendly approachable character design, NOT for its younger haircut/clothes. Aim for the warmth and appealing simplicity of input3 rendered with the flatter cut-paper technique of input1, consistently from head to boots. The recent attempt failed because its face was too realistic while its body was cartoony. Make face MUCH SIMPLER: two or three broad warm flat color shapes, tiny relaxed dark eyes, a simple friendly smile, simple nose mark, understated moustache/stubble as one soft shape. NO portrait rendering, NO realistic facial anatomy shading, NO individual hair strands or beard hairs, NO skin detail, NO gradients, NO glossy eyes. Current likeness cues: adult man, dark wavy MODERN MULLET with short sides and a longer back, large thin round glasses, subtle facial hair, warm olive skin. Do not make him a child. Wear a plain charcoal waterproof hooded rain jacket (hood down), dark backpack, dark trail pants and hiking boots. Keep jacket shadows sparse and quiet, not camouflage. Slightly stylized friendly adult proportions; one hand raised in a relaxed hello, other on backpack strap. All details at the SAME simplified level. Crisp irregular painted-paper silhouette, restrained grain, muted charcoal/bluegreen/olive and warm skin palette, no thick comic outline. Whole figure head to boots, small transparent margin. NO camera, NO scenery, NO halo, NO glow, NO vignette, NO ground, NO shadow, NO words. Deliver actual alpha outside the person.

## Checks

Local build passes with zero errors/warnings. GPU-enabled Chrome confirms five planes in the expected order, distinct left/right cursor offsets for the guide, travel within caps, and identical chat geometry. Synthetic context loss returns to the static stack with the guide still present. Phone/tablet/desktop flows and reduced-motion stills pass. The final published version receives the same focused check before delivery. This checks implementation, not human preference or measured conversion.

## Clean-shaven version

Cello requested a clean shave after showing the character to his fiancée. Built-in imagegen removed the moustache and chin/jaw stubble while retaining the character design. The same 384×576 alpha cutout is now `public/images/characters/cello-hiker-v2.webp`; v1 remains available as the prior version. The clean shave changes only the raster asset. The later foreground placement is described above.

Edit prompt:

Edit only the facial hair on this exact existing illustrated character. Give him a clean shave: remove the moustache above the lip, the stubble marks along the jaw and chin, and the small facial-hair patch below the lip. Replace these areas with the same simple flat warm skin colors and subtle paper grain used elsewhere on his face. Preserve the existing smile, nose, face shape, eyes and eyebrows, round glasses, modern mullet, pose, waving hand, rain jacket, backpack, pants, boots, palette, proportions, cut-paper shapes and exact full-body framing. Do not redraw or restyle any other part. No beard shadow, no moustache, no stubble. Keep the transparent alpha background and all transparent margins; no scenery or extra objects.

Current local checks also pass for the foreground DOM offset following the shared spring, four background canvas draw calls, context-loss return to the resting image, one active body message with its predecessor faded, and phone bottom-Menu touch/focus behavior.
