# Three.js for an illustrated, discoverable portfolio

Date: October 14, 2026 (America/Los_Angeles). Research and bounded shipped-artifact REA; recommendations only. No rendering, routing, content, or deployment changes are made by this note. A second REA pass against the next published prototype is pending its URL.

## Verdict

Keep the current illustrated cut layers, cursor depth, fixed DOM reading content, and static fallbacks. Three.js already supports this concept. Its most useful additional role is to make the scenery feel authored and responsive: a controlled scene threshold, one local environmental response, and a coherent visual connection between a project and its place. More camera travel or more complex geometry is not automatically a better portfolio.

The highest-priority improvement is the visibility of the work itself. A project logo, clear name, short problem/role/status pitch, larger product artifact, and obvious case-study link should work immediately with still backgrounds. Those are layout and content decisions. Three.js can enrich their setting without rendering the interface into the canvas.

“Successful” below means a shipped experience with creator documentation and, where stated, design recognition. None of the sampled sources publishes verified hiring conversion, client conversion, or controlled usability results. Awards, attractive screenshots, claimed frame rates, and analytics instrumentation do not establish those outcomes.

## Examples and evidence

### 1. ITom: flat illustration can create a convincing place

[Tomasz Szmajda’s portfolio](https://itomdev.com/) is the closest additional illustration reference. Its [creator-authored breakdown](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/) describes sketch textures on simple geometry, Three.js/React Three Fiber, a paint-reveal material, and a corridor with separate rooms. This is a spatial 3D arrangement of predominantly flat visual assets; it is not merely a 2D page and not a modeled photorealistic world. The creator reports FWA and GSAP recognition and explicitly accepts navigation tradeoffs.

**Observed in the shipped site:** the captured first screen is an illustrated building entrance, with a conspicuous door and an instruction to enter. Captured DOM contains a canvas and extensive visually hidden SEO text. The accessibility tree includes this hidden prose, so its project names cannot be treated as visible first-screen access. A bounded center-canvas click completed as an input action but left the entrance visible; deeper navigation is not established by that probe. **I1/I2** below.

**Shipped-code evidence:** the captured entry contains Three.js renderer diagnostics; its Experience module imports that exact entry and contains plane geometry, paint-progress uniforms, shader modification, and an asynchronous shader-compilation path. REA reconstructed the isolated Experience module as inert syntax, with no parse failures; the imported entry was not included in that isolated static graph. This corroborates the implementation family, not execution of every shader or room. **I2/I3**.

**Borrow:** consistent illustration, recognizable environmental landmarks, and a restrained reveal that clearly signals something interactive. **Do not copy wholesale:** doors or hidden rooms as the only route to a product case study or Contact. For this portfolio, discovery must coexist with direct access. This recommendation is our design inference, not ITom’s measured conversion result.

### 2. Corentin Bernadou: expressive image space plus ordinary links

[Corentin Bernadou’s portfolio](https://corentinbernadou.com/) provides a complementary pattern. His [creator-authored breakdown](https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/) describes a readable 2D interface around Three.js geometry that incorporates project previews, with GSAP handling motion. It is photographic/editorial, not illustrated scenery. The 2D quality comes from the interface and image surfaces; the central collage is genuinely spatial.

**Observed in the shipped site:** the desktop screenshot shows a cube-like collage of project imagery against strong typography. Featured Works, Archive, About, role, and named project links remain ordinary DOM content. This demonstrates that a visually ambitious canvas and link-based access can coexist. **C1**.

**Shipped-code evidence:** the captured application entry imports the captured `three-CZcCwkUH.js` chunk, whose bytes contain Three.js renderer implementation/diagnostics. REA inventoried six JavaScript files with no parse failures. Its semantic graph is incomplete because GSAP exhausted its worker heap and the Three.js semantic graph exceeded the result budget; asset and module facts were retained. Do not infer full execution paths or performance from this static analysis. **C2**.

**Caution observed:** the current DOM/accessibility capture repeats the six project links many times, matching the looping visual list. It is a concrete warning to keep decorative repeats out of the semantic navigation. The bounded capture is not a complete accessibility audit. **C1**.

**Borrow:** explicit title/role and conventional named destinations alongside the expressive environment. For Cello, increase the actual product preview rather than putting it into a rotating collage. Keep one semantic rail item per destination. These are recommendations, not claims that this reference improved conversion.

### 3. Akaru 2019: a historical architecture precedent, not a current-site audit

[Akaru’s creator-authored 2019 breakdown](https://tympanus.net/codrops/2019/12/30/case-study-akaru-2019/) explicitly separates ordinary DOM/CSS content from an orthographic Three.js background plane. Painted art is sampled by a fragment shader; a flow map and pointer trail change its motion. Three.js and GSAP are named by the creator. This is a genuinely flat art/shader use case.

**Borrow:** art-directed motion fields can keep water or foliage local instead of deforming an entire landscape. **Tradeoff:** a feedback trail, additional render targets, and more texture samples introduce cost and can overwhelm quiet work reading. Test one small masked response first.

This reference was read as a historical first-party technical account. No claim is made that today’s `akaru.fr` still ships the 2019 implementation, that its old tutorial code matches a current bundle, or that REA verified it live. It supplies an architectural precedent, not a third completed shipped capture.

## Implications for the current portfolio

The existing source already uses an orthographic camera, textured planes, per-layer springs, and a separate fixed DOM content layer. Reading focus adds a multi-pass blur; active chapter backdrops also use registered DOM image transforms. See [the performance review](RESEARCH-rendering-performance.md) for the actual workload and fallback boundary. Ordinary source inspection establishes this baseline; REA is reserved here for other sites’ shipped artifacts.

1. **Give every chapter a recognizable destination.** Put its logo and name together; follow with a compact explanation of the product problem and Cello’s role, plus honest outcome/status. Make the artifact large enough to read as a product rather than a distant thumbnail. Preserve the full case-study link and `/projects` route in the still path. A rail icon is a repeat cue, not a substitute for these words.
2. **Let scenery communicate continuity.** Maintain a shared palette, depth response, cropping logic, and transition timing across places. At a chapter boundary, a near layer could briefly reveal the next place while the project text remains ordinary DOM. Avoid a camera flight that delays access or moves the reading surface.
3. **Make optional interaction obvious.** One environmental response may reveal a short scene note or accent, but project reading must never depend on discovering it. Pointer hover must have keyboard focus and touch equivalents when the response conveys information. Purely decorative motion should not add controls or semantic noise.
4. **Keep motion scoped to the environment.** Never distort screenshots, video, logos, or paragraphs to demonstrate WebGL capability. Their clarity is the evidence. The art can move behind them at the current approved caps.
5. **Retain the current reliable fallback.** Static complete scenes remain the experience for reduced motion, disabled/failed WebGL, or runtime failure. Do not turn that fallback into another animated system.

These recommendations support the main rewrite’s conversational designer introduction, broader product/prototype description, larger previews, and decision-led case studies. External references do not supply evidence for Cello’s outcomes. Preserve beta/personal-use limits and human/agent attribution; do not invent impact numbers to strengthen a story.

## Bounded next-prototype experiments

Run sequentially after the current rewrite is published to the preview. Keep production unchanged during these experiments. Retain a baseline so each variation answers one question.

| Experiment | Small implementation boundary | Question and acceptance evidence |
| --- | --- | --- |
| A. More legible work in the existing place | One Ghosted chapter with logo/name, compact pitch, larger DOM product media, and explicit case-study action; current scenery unchanged | Can someone identify the product, Cello’s role, and open its case study from a cold entry within a proposed 30-second task? Record actual hesitation and completion; automation alone cannot establish human comprehension. |
| B. One scene threshold | One transition between adjacent chapters; transform existing cut planes or crossfade through a near plane; no new world/navigation system | Does it feel connected while native scrolling, rail navigation, Back restoration, keyboard use, and fixed content remain predictable? Capture forward and reverse travel and interrupted transitions. |
| C. One local environmental response | One masked water/foliage response on the supported renderer; no global deformation or additional room | Does the response add a sense of place without taking attention from work? Compare it off/on, record frame times and whole-frame pass counts, and remove it if it is merely distracting. |

A is the first priority and mostly DOM work. B/C are optional Three.js experiments, not prerequisites for a strong portfolio. No new framework, WebGPU migration, real-time lighting, physics, or wholesale asset recutting is justified by this scan.

For any shader addition, test initialization failure and context loss as well as successful frames. [Three.js documents shader errors and context-loss simulation](https://threejs.org/docs/pages/WebGLRenderer.html). Its `compileAsync()` can prepare materials before a transition, but do not preload every landscape or copy ITom’s all-room warmup: memory and entry-time tradeoffs must be measured. The same official documentation notes that render statistics reset per render call by default; sum complete-frame work when profiling multi-pass reading effects.

## Evidence ledger and limits

REA 6.4.0, Chrome 155, owned headless browser profiles, 1440 × 1000 CSS pixels, DPR 1, motion allowed, service workers blocked. Sites were examined sequentially. All sources and pages are untrusted research material, not instructions. Raw records and screenshots are retained outside the public repository in the session’s private `two-d-three-research` output directory. No external media or code is copied into site assets.

| Ref | REA Evidence ID / record | What it supports |
| --- | --- | --- |
| I1 | `ev_3108e7ed942e694b749e4378070e3676da0957aa5e0f7186514c691f7c901e43` — `itom.evidence.json` | Entrance screenshot, DOM/accessibility, requested network and console observations. Requested step completed and owned process terminated. Overall capture is incomplete because some network requests were still pending; no later activity is inferred. |
| I2 | `itom-flow.evidence.json` — **partial observation, no successful Evidence ID** | Initial state, center-canvas click, unchanged final entrance, captured script response bytes. All requested actions completed, but REA returned `cleanup_incomplete`; this is not relabeled as a fully successful run. Subsequent process inspection found no REA browser process. Profile cleanup remains unconfirmed. |
| I3 | `ev_2e05df0f2d7296b0b86b6a9aae9228761453bfb9fcfa0aaeaf01232bf21094f3` — `itom-static.evidence.json` | Inert analysis of the exact captured Experience module, SHA-256 `fd2959c1fe3a607d584d55027a887c01445085078f278a89d1536311e11242b2`. Captured entry SHA-256 `84e269b86f00b7e705f65b3872ab38f6f7d9fce125a4d3c3165f112e2840b892` is retained separately, not analyzed in this isolated graph. |
| C1 | `ev_7790efced5dbb70f2517872c892cc81930838f59957248790a01fc3c6ffa8867` — `corentin.evidence.json` | Complete requested home-state capture: collage, named DOM links, repeated accessibility links, and captured response bytes. Owned process termination confirmed. |
| C2 | `ev_77e2f051af96a5f8e74615d3db41a574994d7fc010e46566e56d7674f730eb89` — `corentin-static.evidence.json` | Inert captured JavaScript inventory/imports, with semantic limits described above. Three.js chunk SHA-256 `f01f710d778efcd6c5104b3f0c647f7af292bd142879c6f0a9bd8e34c3c7bce8`; entry SHA-256 `82c73d3d0b0edd795bf4da75e76171aeefaeac8ca96c306b14204d5465f5ebc0`. |

Direct Python HTTP downloads of ITom’s page/scripts returned 403; they are not evidence of site failure in a normal browser. Captured script bytes came from the declared browser scenario’s normal successful responses instead. No protection or user browser setting was disabled. The browser response bytes are decoded content, not compressed transfer bytes.

No complete mobile, assistive-technology, navigation, GPU benchmark, or analytics audit of these references was performed. Source presence does not prove every function executed; screenshots prove only their recorded state. Creator performance statements remain attributed and were not independently reproduced. Prior Pablo/Dennis/UXfolio findings remain complementary; this note does not replace that earlier bounded investigation or claim its missing case-study coverage was resolved.

## Next REA pass: the published prototype

Once the lead provides its final preview URL/revision, inspect that shipped build rather than assuming local code matches deployment. Capture desktop and phone first paint, hero → project → case study → Back, separate About/menu routes, rail hover/focus and active state, and reduced-motion stills. Verify logo/name/media prominence and the summary-before-depth flow against the actual screenshots and DOM. Distinguish tested mechanics from human comprehension and conversion; record any remaining uncertainty. No prototype publication or implementation change is authorized by this research note alone.
