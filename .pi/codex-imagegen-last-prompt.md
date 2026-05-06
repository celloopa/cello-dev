Use the imagegen skill.

You are being launched by Pi as a narrow image-generation worker. Pi is the orchestrator.

Important operating constraints:
- Use Codex's imagegen skill for the raster image generation/editing work.
- Do not modify source code, package files, or unrelated project files.
- Only create or update the requested image asset and any temporary imagegen files needed to do so.
- If the built-in image_gen output lands under CODEX_HOME, copy or move the selected final asset into the requested workspace path.
- Do not overwrite unrelated existing files.

Workspace: /Users/cello_r/Documents/code/astro/cello-dev
Output path: public/images/audiosnip/audiosnip-logo-concept-01.png
Variant count: 1

Reference files to inspect first:
- src/styles/tokens.css
- src/styles/colors.css
- src/pages/design-system.astro

Image-generation brief:
Use case: logo-brand
Asset type: raster logo concept for a tool named audioSnip
Primary request: Create a better logo concept for "audioSnip", a lightweight tool for clipping, trimming, and extracting useful snippets from audio.
Subject: a distinctive mark combining an audio waveform, a precise cut/snipping gesture, and a compact app-tool identity.
Style/medium: polished raster logo exploration, vector-friendly, clean geometric forms, technical but friendly, suitable for eventual SVG recreation.
Composition/framing: square canvas with centered logo mark plus optional small wordmark; strong silhouette; readable at small sizes.
Color palette: align with Cello design system — midnight green #001A11, starlight gray #E0E0E0, electric green #00BC44, earthy tan #887850, warm paper #FFF8ED. Use restrained blueprint blue only if helpful.
Text verbatim: "audioSnip" if a wordmark is included. Keep text clean and legible.
Constraints: avoid generic microphone icons, avoid headphones, avoid fake app-store badges, avoid complex gradients, avoid glassmorphism, avoid overly soft rounded SaaS styling. Make the mark feel ownable and practical for a product design/prototyping tool.
Output: save the selected image to public/images/audiosnip/audiosnip-logo-concept-01.png

Final response requirements:
- Report the saved image path.
- Report the final imagegen prompt used.
