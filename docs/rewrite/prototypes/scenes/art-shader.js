/*
 * Shared pieces for drawing cut art layers (gen/layers/<place>/*.webp) as textured planes.
 * Used by the window (directions/window.js) and the landscape hero (directions/landscape.js), so
 * both decode, grade and move the art the same way.
 *
 * Textures arrive premultiplied, sRGB-encoded (see prepareLayerTexture): filtering never pulls in
 * the color of fully transparent texels, so keyed edges get no dark fringe. Shaders un-premultiply,
 * decode to linear, grade (Dusk), encode, and premultiply again (blending is ONE, 1 − srcα).
 */
import { Color, SRGBColorSpace } from "three";

export const DUSK = new Color("#001a11"); // I3: Dusk = color-mix(in oklab, ink 40%, #001a11), snow 55%

export const artVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/** Color helpers + the Dusk grade. Needs `uniform float uDusk; uniform vec3 uDuskInk;`. */
export const colorGLSL = /* glsl */ `
  vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
  vec3 toSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
  vec3 toOklab(vec3 c) {
    vec3 lms = vec3(
      0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b,
      0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b,
      0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b);
    lms = pow(max(lms, 0.0), vec3(1.0 / 3.0));
    return vec3(
      0.2104542553 * lms.x + 0.7936177850 * lms.y - 0.0040720468 * lms.z,
      1.9779984951 * lms.x - 2.4285922050 * lms.y + 0.4505937099 * lms.z,
      0.0259040371 * lms.x + 0.7827717662 * lms.y - 0.8086757660 * lms.z);
  }
  vec3 fromOklab(vec3 c) {
    vec3 lms = vec3(
      c.x + 0.3963377774 * c.y + 0.2158037573 * c.z,
      c.x - 0.1055613458 * c.y - 0.0638541728 * c.z,
      c.x - 0.0894841775 * c.y - 1.2914855480 * c.z);
    lms = lms * lms * lms;
    return vec3(
       4.0767416621 * lms.x - 3.3077115913 * lms.y + 0.2309699292 * lms.z,
      -1.2684380046 * lms.x + 2.6097574011 * lms.y - 0.3413193965 * lms.z,
      -0.0041960863 * lms.x - 0.7034186147 * lms.y + 1.7076147010 * lms.z);
  }
  vec3 duskGrade(vec3 c) {
    if (uDusk <= 0.0) return c;
    vec3 lab = toOklab(c);
    float ink = mix(0.4, 0.55, smoothstep(0.82, 0.95, lab.x)); // snow and highlights keep more
    return fromOklab(mix(lab, toOklab(uDuskInk), (1.0 - ink) * uDusk));
  }`;

/**
 * Shader micro-motion, chosen per layer with a define (MOTION_DRIFT · MOTION_SHIMMER · MOTION_SWAY).
 * Needs `uniform float uTime, uShore, uMotion;` (uMotion scales every amplitude: 1 = as tested in
 * the window, 0 = still).
 */
export const motionGLSL = /* glsl */ `
  vec2 artMotion(vec2 uv) {
    float y = 1.0 - uv.y; // 0 = top of the art
    #ifdef MOTION_DRIFT
      // clouds: a very slow sideways drift and a faint breathe (periods ~2 min and ~1 min)
      uv.x += uMotion * sin(uTime * 0.052) * 0.004;
      uv = (uv - 0.5) * (1.0 - uMotion * 0.0025 * (0.5 + 0.5 * sin(uTime * 0.11))) + 0.5;
    #endif
    #ifdef MOTION_SHIMMER
      // lake: thin horizontal wobble that varies with y, only below the shoreline, larger nearer
      float lake = smoothstep(uShore, uShore + 0.03, y);
      float amp = mix(0.6, 1.4, clamp((y - uShore) / (1.0 - uShore), 0.0, 1.0));
      uv.x += uMotion * lake * amp * (sin(y * 420.0 + uTime * 1.7) * 0.0011 + sin(y * 137.0 - uTime * 0.8) * 0.0007);
    #endif
    #ifdef MOTION_SWAY
      // fireweed: bases (bottom edge) fixed, tops sway most; slow gusts, stalks out of phase
      float k = clamp((1.0 - y) / 0.8, 0.0, 1.0); k *= k;
      float gust = 0.6 + 0.4 * sin(uTime * 0.31);
      uv.x += uMotion * k * gust * (sin(uTime * 1.05 + uv.x * 7.0) * 0.0034 + sin(uTime * 1.9 + uv.x * 15.0) * 0.0008);
    #endif
    return uv;
  }`;

/** Largest UV displacement the micro-motion above can make, as a fraction of the art width. */
export const MOTION_MAX_UV = { drift: 0.0053, shimmer: 0.0025, sway: 0.0042 };

export const motionDefines = (motion) => (motion ? { [`MOTION_${motion.toUpperCase()}`]: "" } : {});

/**
 * Tagged sRGB (no unpack conversion) but stored as plain RGBA8 and premultiplied on upload, so
 * filtering and mipmaps work on premultiplied sRGB bytes, the way a browser composites a PNG; the
 * shader decodes (sRGB8_ALPHA8 would decode before premultiplying is undone, darkening edges).
 */
export function prepareLayerTexture(tex) {
  tex.colorSpace = SRGBColorSpace;
  tex.internalFormat = "RGBA8";
  tex.premultiplyAlpha = true;
  tex.needsUpdate = true;
  return tex;
}
