/*
 * Direction 1: CUT PAPER (Saul Bass in print).
 *
 * The mark's C-ring, sun and triangle are matte paper cut-outs with a little thickness,
 * stacked at different depths. Case-study posters are printed sheets on the brand's hard
 * offset plate; they bend slightly with scroll speed, like paper does.
 *
 * Prudent choices (why it's cheap enough for phones):
 * - No real-time shadow maps. Each cut-out's shadow is its own silhouette, blurred ONCE on a
 *   2D canvas, then drawn as a flat textured plane behind it. Pulling the layers apart just
 *   moves and fades those planes.
 * - One tiny custom shader instead of three.js's lit materials: color × a fixed light × paper
 *   grain. Same look on every GPU, no light setup to tune.
 * - Thickness comes from ExtrudeGeometry with 6 units of depth and no bevels.
 */
import {
  Group, Mesh, PlaneGeometry, ExtrudeGeometry, ShaderMaterial, MeshBasicMaterial, CanvasTexture,
  Vector3, DoubleSide, Color,
} from "three";
import {
  createChoreo, markShapes, blurredPathTexture, blurredRectCanvas, MARK_W, MARK_H, SUN_CENTER,
} from "../shared/choreo.js";
import { textureFromImage } from "../shared/stage.js";

const LIGHT = new Vector3(-0.45, 0.6, 1).normalize(); // top-left, like the shadows

/* ---------- shaders ---------- */

// Paper surface: flat color (or an image), lit by one fixed light, with fiber grain.
const paperVert = /* glsl */ `
  uniform float uCurl;      // px of bend at the sheet's edges (posters only)
  varying vec2 vUv;
  varying vec3 vN;
  varying vec2 vLocal;
  void main() {
    vUv = uv;
    vLocal = position.xy;
    vec3 p = position;
    // Bend: edges move back in z, proportional to scroll speed. Normal follows the slope.
    float e = (uv.x - 0.5) * 2.0;
    p.z += -uCurl * e * e;
    vec3 n = normalize(vec3(2.0 * uCurl * e / 300.0, 0.0, 1.0));
    vN = normalize(normalMatrix * (length(normal) > 0.0 && uCurl == 0.0 ? normal : n));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const paperFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform vec2 uCover;      // scale for object-fit: cover
  uniform float uAspect;    // plane width / height
  uniform float uReveal;    // 0..1 circle reveal from the center
  uniform float uOpacity;
  uniform vec3 uLight;
  uniform float uGrainScale;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec2 vLocal;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float grain(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec3 base = uColor;
    if (uHasMap > 0.5) {
      vec2 uv = (vUv - 0.5) * uCover + 0.5;
      base = texture2D(uMap, uv).rgb;
    }
    // Circle reveal (the sun handoff and every poster's arrival).
    // (Skipped at 1.0, which is also how the mark's cut-outs opt out: their uv is in shape units.)
    float inside = 1.0;
    if (uReveal < 1.0) {
      vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
      float r = uReveal * 0.5 * length(vec2(uAspect, 1.0)) * 1.02;
      inside = 1.0 - smoothstep(r - 0.004, r, length(q));
      if (inside <= 0.0) discard;
    }

    float light = 0.86 + 0.14 * max(dot(normalize(vN), uLight), 0.0);
    float g = grain(vLocal * uGrainScale) * 0.6 + grain(vLocal * uGrainScale * 3.1) * 0.4;
    vec3 c = base * light * (0.95 + 0.07 * g);
    gl_FragColor = vec4(c, uOpacity * inside);
    #include <colorspace_fragment>
  }
`;

function paperMaterial({ color = new Color(1, 1, 1), map = null, grainScale = 0.9 } = {}) {
  return new ShaderMaterial({
    vertexShader: paperVert,
    fragmentShader: paperFrag,
    transparent: true,
    side: DoubleSide,
    uniforms: {
      uColor: { value: color.clone() },
      uMap: { value: map },
      uHasMap: { value: map ? 1 : 0 },
      uCover: { value: [1, 1] },
      uAspect: { value: 1 },
      uReveal: { value: 1 },
      uOpacity: { value: 1 },
      uLight: { value: LIGHT },
      uCurl: { value: 0 },
      uGrainScale: { value: grainScale },
    },
  });
}

function shadowMaterial(canvas, color) {
  const tex = new CanvasTexture(canvas);
  return new MeshBasicMaterial({ color, alphaMap: tex, transparent: true, depthWrite: false, opacity: 0.4 });
}

/* ---------- the direction ---------- */

export default async function paper(stage) {
  const { scene, renderer, isMobile } = stage;
  const choreo = createChoreo(stage);
  const C = stage.colors;
  const shadowColor = new Color(0x000000);

  /* --- the mark --- */
  const markGroup = new Group();
  scene.add(markGroup);
  const pieces = {};
  if (choreo.markRec) {
    const parts = markShapes();
    for (const name of ["triangle", "c", "sun"]) {
      const geo = new ExtrudeGeometry(parts[name].shapes, {
        depth: 6, bevelEnabled: false, curveSegments: isMobile ? 10 : 20,
      });
      // Pivot: the sun turns around its own center (it leaves the mark); the rest around the mark's.
      const pivot = name === "sun" ? { x: SUN_CENTER.x + MARK_W / 2, y: MARK_H / 2 - SUN_CENTER.y } : { x: MARK_W / 2, y: MARK_H / 2 };
      geo.translate(-pivot.x, -pivot.y, 0);
      const colorKey = { c: "markC", sun: "markSun", triangle: "markTriangle" }[name];
      const mesh = new Mesh(geo, paperMaterial({ color: C[colorKey], grainScale: 0.35 }));

      // Shadow: the same silhouette, blurred once on a 2D canvas, as a plane behind.
      const blurred = blurredPathTexture(parts[name].d, { size: isMobile ? 192 : 256, blur: isMobile ? 5 : 7 });
      const sh = new Mesh(new PlaneGeometry(blurred.worldSize, blurred.worldSize), shadowMaterial(darkCanvas(blurred.canvas), shadowColor));
      sh.material.alphaMap.flipY = false; // the piece is mirrored in y (SVG is y-down)
      sh.position.set(MARK_W / 2 - pivot.x, MARK_H / 2 - pivot.y, -3);
      sh.renderOrder = -1;
      mesh.add(sh);

      pieces[name] = { mesh, shadow: sh, colorKey };
      if (name === "sun") scene.add(mesh); // the sun can leave the mark (handoff)
      else markGroup.add(mesh);
    }
  }

  /* --- posters (home) and brand sheets (case page) --- */
  const rect = blurredRectCanvas(128, isMobile ? 10 : 14);
  const rectShadowTex = new CanvasTexture(darkCanvas(rect.canvas));
  const sheets = [];
  async function makeSheet(img) {
    const tex = await textureFromImage(img, renderer);
    const g = new Group();
    const seg = isMobile ? 12 : 28;
    const face = new Mesh(new PlaneGeometry(1, 1, seg, 1), paperMaterial({ map: tex, grainScale: 0.6 }));
    const plate = new Mesh(new PlaneGeometry(1, 1), paperMaterial({ color: C.ground, grainScale: 0.6 }));
    const shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: shadowColor, alphaMap: rectShadowTex, transparent: true, depthWrite: false, opacity: 0.45 }));
    plate.position.z = -4;
    shadow.position.z = -8;
    shadow.renderOrder = -1;
    g.add(shadow, plate, face);
    scene.add(g);
    return { g, face, plate, shadow, tex };
  }
  for (const img of choreo.posterImgs) sheets.push(await makeSheet(img));
  const brands = [];
  for (const img of choreo.brandImgs) brands.push(await makeSheet(img));

  function sizeSheet(s, w, h) {
    s.face.scale.set(w, h, 1);
    const u = s.face.material.uniforms;
    u.uAspect.value = w / h;
    const ia = s.tex.userData.aspect, pa = w / h;
    u.uCover.value = ia > pa ? [pa / ia, 1] : [1, ia / pa];
    s.plate.scale.set(w, h, 1);
    s.plate.position.set(12, -12, -4); // the brand's hard offset plate
    const grow = 1 / (1 - rect.inset * 2);
    s.shadow.scale.set(w * grow * 1.04, h * grow * 1.04, 1);
  }

  /* --- per frame: apply the shared choreography to paper --- */
  function update() {
    const f = choreo.frame();
    const curl = Math.max(-1, Math.min(1, stage.velocity / 2600)) * (isMobile ? 18 : 34);

    if (f.mark) {
      const m = f.mark;
      markGroup.position.set(m.x, m.y, 0);
      markGroup.rotation.set(m.tiltX, m.tiltY, 0);
      for (const name of ["c", "triangle"]) {
        const pc = m.parts[name], { mesh, shadow } = pieces[name];
        mesh.position.set(pc.x * m.scale, pc.y * m.scale, pc.z);
        mesh.rotation.z = pc.rot;
        mesh.scale.set(m.scale, -m.scale, m.scale);
        mesh.material.uniforms.uOpacity.value = pc.opacity;
        placeShadow(shadow, pc, m.explode, m.scale);
      }
      // The sun: in the mark until the handoff carries it to poster 01.
      const sp = m.parts.sun, sun = pieces.sun, h = f.handoff;
      const homeX = m.x + sp.x * m.scale + SUN_CENTER.x * m.scale;
      const homeY = m.y + sp.y * m.scale + SUN_CENTER.y * m.scale;
      const hx = h ? h.x - (m.x + SUN_CENTER.x * m.scale) : 0, hy = h ? h.y - (m.y + SUN_CENTER.y * m.scale) : 0;
      sun.mesh.position.set(homeX + hx, homeY + hy, sp.z * (1 - (h?.h ?? 0)) - 20 * (h?.h ?? 0));
      const s = h ? h.s : m.scale;
      sun.mesh.scale.set(s, -s, s);
      sun.mesh.rotation.set(m.tiltX * (1 - (h?.h ?? 0)), m.tiltY * (1 - (h?.h ?? 0)), sp.rot);
      sun.mesh.material.uniforms.uOpacity.value = sp.opacity * (h ? h.fade : 1);
      placeShadow(sun.shadow, sp, m.explode + (h?.h ?? 0), s, h ? h.fade : 1);
    }

    f.posters.forEach((p, i) => {
      const s = sheets[i];
      s.g.visible = p.visible;
      if (!p.visible) return;
      sizeSheet(s, p.w, p.h);
      s.g.position.set(p.x, p.y, p.z);
      s.g.rotation.set(p.rotX, p.rotY, 0);
      s.face.material.uniforms.uReveal.value = p.reveal;
      s.face.material.uniforms.uCurl.value = curl * p.arrive;
      s.plate.material.uniforms.uReveal.value = p.reveal;
      // The shadow lengthens while the sheet is lifted off the page, shortens as it lands.
      const lift = 1 - p.arrive + p.leave;
      s.shadow.position.set(14 + lift * 40, -18 - lift * 50, -8 - lift * 30);
      s.shadow.material.opacity = (0.45 - lift * 0.2) * p.reveal;
    });

    f.brands.forEach((b, i) => {
      const s = brands[i];
      sizeSheet(s, b.w, b.h);
      s.g.position.set(b.x, b.y, b.z);
      s.g.rotation.set(b.rotX, b.rotY, 0);
      for (const m of [s.face, s.plate]) m.material.uniforms.uOpacity.value = b.opacity;
      s.face.material.uniforms.uCurl.value = curl;
      s.shadow.position.set(16 + b.fan * 24, -20 - b.fan * 30, -8);
      s.shadow.material.opacity = 0.42 * b.opacity;
    });

    return f.busy;
  }

  function placeShadow(sh, part, explode, scale, fade = 1) {
    // Offsets are in the piece's local (mirrored, scaled) units.
    const lift = 1 + explode * 2.4;
    sh.position.x = sh.userData.x ??= sh.position.x;
    sh.position.y = sh.userData.y ??= sh.position.y;
    sh.position.x = sh.userData.x + (10 * lift) / Math.max(scale, 0.01);
    sh.position.y = sh.userData.y + (14 * lift) / Math.max(scale, 0.01); // +y here is down on screen
    sh.scale.setScalar(1 + explode * 0.18);
    sh.material.opacity = (stage.dark ? 0.5 : 0.28) * (1 - explode * 0.35) * part.opacity * fade;
  }

  function setTheme(colors, dark) {
    for (const k in pieces) pieces[k].mesh.material.uniforms.uColor.value.copy(colors[pieces[k].colorKey]);
    for (const s of [...sheets, ...brands]) s.plate.material.uniforms.uColor.value.copy(colors.ground);
    shadowColor.set(dark ? 0x000000 : 0x2a2416);
  }
  setTheme(C, stage.dark);

  return { update, setTheme };
}

/** alphaMap reads the green channel, so draw white-on-black (no premultiplied-alpha surprises). */
function darkCanvas(src) {
  const c = document.createElement("canvas");
  c.width = src.width; c.height = src.height;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = "invert(1)";
  ctx.drawImage(src, 0, 0);
  return c;
}
