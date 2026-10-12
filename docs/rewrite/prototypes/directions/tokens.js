/*
 * Direction 4: TOKENS (the fresh pass).
 *
 * Idea: a design system is a small set of parts recomposed into many products. Here the parts
 * are literal: thousands of square particles ("tokens"). They assemble into the mark, react to
 * the cursor like a material, then stream across the page and rebuild as each case study's
 * image, pixel by pixel. Once they land, the crisp real image takes over (so nothing is ever
 * blurry to read); scroll on, and it dissolves back into tokens that rebuild the next one.
 * One continuous match cut: tokens → product → product.
 *
 * How it stays cheap:
 * - ONE draw call: a single THREE.Points object. Every position, color and size is computed in
 *   the vertex shader from per-particle attributes and a few uniforms. The CPU only updates
 *   ~20 numbers a frame.
 * - Images are sampled once into tiny canvases (one texel per particle).
 * - ~13k particles on desktop, ~6.6k on phones. No post-processing.
 *
 * Stations (what the particles can be):
 *   home: 0 = the mark, 1..4 = posters 01–04
 *   case: 0 = the Asheville poster image, 1 = the three brand portals
 */
import {
  BufferGeometry, BufferAttribute, Points, ShaderMaterial, CanvasTexture, NearestFilter,
  SRGBColorSpace, Vector2, Vector3, Vector4, Color, NormalBlending,
} from "three";
import { createChoreo, MARK_W, MARK_H, range, clamp01 } from "../shared/choreo.js";
import paths from "../shared/mark-paths.json";

/* ---------- shaders ---------- */

const vert = /* glsl */ `
  precision highp float;

  attribute vec2 aUv;       // this token's cell in a full-width grid (posters)
  attribute vec3 aBrand;    // group (0..2) + cell in that group's grid (brands)
  attribute vec3 aMark;     // position inside the mark (mark units, centered) + depth jitter
  attribute float aPiece;   // 0 = C-ring, 1 = sun, 2 = triangle
  attribute vec4 aRand;     // per-token randomness

  uniform float uFrom, uTo, uT;       // stations and progress between them
  uniform float uIntro;                // 0..1 assembly from scatter on load
  uniform vec4 uFromRect, uToRect;     // station placement: center xy, size wh (px)
  uniform sampler2D uFromTex, uToTex;  // station colors (posters)
  uniform vec4 uBrandRect0, uBrandRect1, uBrandRect2;
  uniform sampler2D uBrandTex0, uBrandTex1, uBrandTex2;
  uniform float uBrandZ;
  uniform vec3 uMarkC, uMarkSun, uMarkTri;
  uniform float uMarkScale, uMarkSize;
  uniform vec2 uGrid, uBrandGrid;
  uniform vec2 uView;                  // viewport px
  uniform vec3 uPointer;               // world px + strength
  uniform float uDpr, uPage;           // uPage: 0 = home, 1 = case

  varying vec3 vColor;

  float easeOut(float t) { t = clamp(t, 0.0, 1.0); return 1.0 - pow(1.0 - t, 4.0); }
  float easeInOut(float t) { t = clamp(t, 0.0, 1.0); return t < 0.5 ? 8.0*t*t*t*t : 1.0 - pow(-2.0*t + 2.0, 4.0) / 2.0; }

  vec3 scatterPos() {
    return vec3((aRand.x - 0.5) * uView.x * 1.6, (aRand.y - 0.5) * uView.y * 1.6, -300.0 - aRand.z * 1400.0);
  }
  vec3 markColor() { return aPiece < 0.5 ? uMarkC : (aPiece < 1.5 ? uMarkSun : uMarkTri); }

  // Position, color and size of this token at a station.
  void station(float id, vec4 rect, sampler2D tex, out vec3 p, out vec3 c, out float s) {
    bool isMark = uPage < 0.5 && id < 0.5;
    bool isBrands = uPage > 0.5 && id > 0.5;
    if (isMark) {
      p = vec3(rect.xy + aMark.xy * uMarkScale, aMark.z);
      c = markColor();
      s = uMarkSize;
    } else if (isBrands) {
      float g = aBrand.x;
      vec4 r = g < 0.5 ? uBrandRect0 : (g < 1.5 ? uBrandRect1 : uBrandRect2);
      p = vec3(r.xy + (aBrand.yz - 0.5) * r.zw, -g * uBrandZ);
      c = g < 0.5 ? texture2D(uBrandTex0, aBrand.yz).rgb : (g < 1.5 ? texture2D(uBrandTex1, aBrand.yz).rgb : texture2D(uBrandTex2, aBrand.yz).rgb);
      s = r.z / uBrandGrid.x;
    } else {
      p = vec3(rect.xy + (aUv - 0.5) * rect.zw, 0.0);
      c = texture2D(tex, aUv).rgb;
      s = rect.z / uGrid.x;
    }
  }

  void main() {
    vec3 pA, cA, pB, cB; float sA, sB;
    station(uFrom, uFromRect, uFromTex, pA, cA, sA);
    station(uTo, uToRect, uToTex, pB, cB, sB);

    // Load: tokens fly in from a scattered cloud to the first station, staggered.
    float intro = easeOut((uIntro - aRand.w * 0.45) / 0.55);
    pA = mix(scatterPos(), pA, intro);
    sA *= mix(0.4, 1.0, intro);

    // Station to station: each token leaves on its own beat (a sweep plus noise) and arcs in depth.
    float delay = (uPage < 0.5 ? aUv.x : aBrand.y) * 0.25 + aRand.w * 0.2;
    float e = easeInOut((uT - delay) / 0.55);
    float arc = sin(e * 3.14159);
    vec3 p = mix(pA, pB, e);
    p.z += arc * (220.0 + aRand.z * 520.0);
    p.xy += arc * (aRand.xy - 0.5) * 220.0;
    vec3 col = mix(cA, cB, smoothstep(0.25, 0.75, e));
    float size = mix(sA, sB, e);

    // The cursor is a force: tokens near it are pushed away and lifted, then spring back.
    vec2 d = p.xy - uPointer.xy;
    float f = smoothstep(150.0, 0.0, length(d)) * uPointer.z;
    p.xy += normalize(d + 0.0001) * f * 46.0;
    p.z += f * 90.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // 1 world unit = 1 CSS px at z = 0; scale size by depth like the projection does.
    gl_PointSize = max(1.0, size * 0.9 * uDpr * (1000.0 / -mv.z));
    vColor = col;
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, uOpacity);
    #include <colorspace_fragment>
  }
`;

/* ---------- sampling ---------- */

/** Draw an image into a W×H canvas with object-fit: cover, one texel per token. */
function sampleImage(img, W, H) {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const ia = img.naturalWidth / img.naturalHeight, ca = W / H;
  let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
  if (ia > ca) { sw = sh * ca; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / ca; sy = (img.naturalHeight - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = tex.minFilter = NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

async function loadImage(src) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  return img;
}
async function ready(img) {
  img.loading = "eager";
  if (!img.complete || !img.naturalWidth) await img.decode().catch(() => {});
  return img;
}

/** Pick n random points inside the mark, tagged by piece, in centered mark units. */
function sampleMark(n) {
  const S = 2; // raster scale
  const c = document.createElement("canvas");
  c.width = MARK_W * S; c.height = MARK_H * S;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.scale(S, S);
  // Paint each piece in its own channel; front pieces painted last win (like the logo).
  const order = [["sun", "#00ff00"], ["triangle", "#0000ff"], ["c", "#ff0000"]];
  for (const [name, color] of order) { ctx.fillStyle = color; for (const d of paths[name]) ctx.fill(new Path2D(d)); }
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const cells = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const piece = data[i] > 127 ? 0 : data[i + 1] > 127 ? 1 : 2;
    const k = i / 4;
    cells.push(k % c.width, Math.floor(k / c.width), piece);
  }
  const count = cells.length / 3;
  // Stratified: walk the filled cells in a shuffled-stride order so tokens cover the shape
  // evenly (crisp edges) instead of clumping the way pure random picks do.
  const pos = new Float32Array(n * 3), piece = new Float32Array(n);
  const stride = count / n;
  for (let i = 0; i < n; i++) {
    const j = Math.min(count - 1, Math.floor((i + Math.random()) * stride)) * 3;
    pos[i * 3] = (cells[j] + Math.random()) / S - MARK_W / 2;
    pos[i * 3 + 1] = -((cells[j + 1] + Math.random()) / S - MARK_H / 2);
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    piece[i] = cells[j + 2];
  }
  const area = count / (S * S); // mark units²
  return { pos, piece, cellSize: Math.sqrt(area / n) };
}

/* ---------- the direction ---------- */

export default async function tokens(stage) {
  const { scene, isMobile } = stage;
  const choreo = createChoreo(stage);
  const page = choreo.markRec ? 0 : 1;

  const W = isMobile ? 112 : 160;
  const H = Math.round(W / 1.905); // poster art is 1200 × 630
  const N = W * H;
  // Brands: split the same tokens into three equal grids.
  const per = Math.floor(N / 3);
  const BW = Math.floor(Math.sqrt(per * 1.775)), BH = Math.floor(per / BW);

  /* --- per-token attributes --- */
  const aUv = new Float32Array(N * 2), aBrand = new Float32Array(N * 3), aRand = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    aUv[i * 2] = ((i % W) + 0.5) / W;
    aUv[i * 2 + 1] = (Math.floor(i / W) + 0.5) / H;
    const g = Math.min(2, Math.floor(i / per)), j = i - g * per;
    aBrand[i * 3] = g;
    aBrand[i * 3 + 1] = ((j % BW) + 0.5) / BW;
    aBrand[i * 3 + 2] = (Math.min(BH - 1, Math.floor(j / BW)) + 0.5) / BH;
    for (let k = 0; k < 4; k++) aRand[i * 4 + k] = Math.random();
  }
  const mark = sampleMark(N);

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(N * 3), 3)); // unused; required
  geo.setAttribute("aUv", new BufferAttribute(aUv, 2));
  geo.setAttribute("aBrand", new BufferAttribute(aBrand, 3));
  geo.setAttribute("aMark", new BufferAttribute(mark.pos, 3));
  geo.setAttribute("aPiece", new BufferAttribute(mark.piece, 1));
  geo.setAttribute("aRand", new BufferAttribute(aRand, 4));

  /* --- station colors --- */
  let posterTex;
  if (page === 0) posterTex = await Promise.all(choreo.posterImgs.map(async (img) => sampleImage(await ready(img), W, H)));
  else posterTex = [sampleImage(await loadImage("/images/projects/ad-assets/ad-assets-thumbnail.png"), W, H)];
  const brandTex = page === 1 ? await Promise.all(choreo.brandImgs.map(async (img) => sampleImage(await ready(img), BW, BH))) : [];
  const blank = posterTex[0];

  const C = stage.colors;
  const u = {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT: { value: 0 }, uIntro: { value: 0 },
    uFromRect: { value: new Vector4() }, uToRect: { value: new Vector4() },
    uFromTex: { value: blank }, uToTex: { value: blank },
    uBrandRect0: { value: new Vector4() }, uBrandRect1: { value: new Vector4() }, uBrandRect2: { value: new Vector4() },
    uBrandTex0: { value: brandTex[0] || blank }, uBrandTex1: { value: brandTex[1] || blank }, uBrandTex2: { value: brandTex[2] || blank },
    uBrandZ: { value: 0 }, // flat at rest so the DOM handoff doesn't jump
    uMarkC: { value: new Color() }, uMarkSun: { value: new Color() }, uMarkTri: { value: new Color() },
    uMarkScale: { value: 1 }, uMarkSize: { value: 2 },
    uGrid: { value: new Vector2(W, H) }, uBrandGrid: { value: new Vector2(BW, BH) },
    uView: { value: new Vector2() }, uPointer: { value: new Vector3(0, 0, 0) },
    uDpr: { value: stage.renderer.getPixelRatio() }, uPage: { value: page },
    uOpacity: { value: 1 },
  };
  const material = new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, uniforms: u,
    transparent: true, depthTest: false, depthWrite: false, blending: NormalBlending,
  });
  const points = new Points(geo, material);
  points.frustumCulled = false; // positions live in the shader
  scene.add(points);

  /* --- the crisp DOM image takes over once tokens land --- */
  const domImgs = page === 0 ? choreo.posterImgs : choreo.brandImgs;
  const showDom = (which, amount) => {
    domImgs.forEach((img, i) => { img.style.opacity = String(which.includes(i) ? amount : 0); });
  };

  const t0 = stage.time;
  let lastStation = -1;

  function update(dt, s) {
    const f = choreo.frame();
    const t = s.time - t0;
    u.uView.value.set(s.width, s.height);
    u.uIntro.value = clamp01(t / 1.9);
    const busyIntro = t < 2.0;

    // Station placements, in world px.
    const rects = [];
    let S; // continuous station index
    if (page === 0) {
      const m = f.mark;
      u.uMarkScale.value = m.scale;
      u.uMarkSize.value = Math.max(1.6, mark.cellSize * m.scale * 1.25);
      rects.push(new Vector4(m.x, m.y, m.w, m.h));
      f.posters.forEach((p) => rects.push(new Vector4(p.x, p.y, p.w, p.h)));
      // Each poster's arrival adds 1; tokens are "at" poster k when it's centered.
      // Poster 01 starts pulling the tokens out of the mark as soon as the hero begins to scroll.
      S = f.posters.reduce((acc, p, i) => acc + (i === 0 ? range(p.centered, -1.75, -0.08) : range(p.centered, -0.9, -0.08)), 0);
    } else {
      // Station 0 = the poster image, filling the brand stack's footprint (raw DOM rects).
      const br = choreo.brandRecs.map((r) => s.place(r));
      const left = Math.min(...br.map((r) => r.x - r.w / 2)), right = Math.max(...br.map((r) => r.x + r.w / 2));
      const top = Math.max(...br.map((r) => r.y + r.h / 2)), bottom = Math.min(...br.map((r) => r.y - r.h / 2));
      const stackW = right - left, stackH = top - bottom;
      const ph = Math.min(stackH, stackW / 1.905);
      rects.push(new Vector4(left + stackW / 2, bottom + stackH / 2, ph * 1.905, ph));
      [u.uBrandRect0, u.uBrandRect1, u.uBrandRect2].forEach((x, i) => br[i] && x.value.set(br[i].x, br[i].y, br[i].w, br[i].h));
      rects.push(rects[0]); // placeholder; brands use their own rects
      // One system → three brands, on a timer after arrival.
      S = range(t, 1.7, 3.3);
    }

    const last = rects.length - 1;
    S = Math.min(S, last);
    const from = Math.min(Math.floor(S), last), to = Math.min(from + 1, last);
    const tt = S - from;
    u.uFrom.value = from; u.uTo.value = to; u.uT.value = to === from ? 0 : tt;
    u.uFromRect.value.copy(rects[from]); u.uToRect.value.copy(rects[to]);
    if (page === 0) {
      u.uFromTex.value = from > 0 ? posterTex[from - 1] : blank;
      u.uToTex.value = to > 0 ? posterTex[to - 1] : blank;
    } else {
      u.uFromTex.value = u.uToTex.value = posterTex[0];
    }

    // Settled on a product → particles fade, the crisp image shows.
    const atRest = to === from || tt < 0.0001 || tt > 0.999;
    const restOn = tt > 0.5 ? to : from;
    const quiet = Math.abs(s.velocity) < 40 && !busyIntro;
    const settle = atRest && quiet && (page === 1 ? restOn === 1 : restOn > 0);
    u.uOpacity.value += ((settle ? 0 : 1) - u.uOpacity.value) * Math.min(1, dt * 6);
    const dom = 1 - u.uOpacity.value;
    if (page === 0) showDom(restOn > 0 ? [restOn - 1] : [], dom);
    else showDom(restOn === 1 ? [0, 1, 2] : [], dom);
    if (restOn !== lastStation) lastStation = restOn;

    // Cursor force, only while tokens are the mark (the hero).
    const onMark = page === 0 && S < 0.15;
    const strength = onMark && !isMobile ? 1 : 0;
    u.uPointer.value.set((s.pointer.x * s.width) / 2, (s.pointer.y * s.height) / 2, strength);

    const animatingFade = Math.abs(u.uOpacity.value - (settle ? 0 : 1)) > 0.01;
    return busyIntro || animatingFade || (tt > 0 && tt < 1);
  }

  function setTheme(colors) {
    u.uMarkC.value.copy(colors.markC);
    u.uMarkSun.value.copy(colors.markSun);
    u.uMarkTri.value.copy(colors.markTriangle);
  }
  setTheme(C);

  // Tokens own the poster area: start every DOM poster hidden until its tokens land.
  showDom([], 0);

  return { update, setTheme };
}
