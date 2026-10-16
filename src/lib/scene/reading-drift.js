import { PLANE_SPRING } from "./planes";
// The same bounded drift for WebGL reading pages and lazy DOM backdrop planes.
// Twenty-four seconds of slow movement, then a minute at rest. No camera or text movement.
const css = getComputedStyle(document.documentElement);
const seconds = name => { const value=css.getPropertyValue(name).trim(); return parseFloat(value)*(value.endsWith('ms')?1:1000); };
const ACTIVE = seconds('--motion-reading-active');
const CYCLE = ACTIVE + seconds('--motion-reading-rest');
const STRENGTH = parseFloat(css.getPropertyValue('--motion-reading-strength'));
// Shared hero spring tuning, back to front. Pointer coordinates are CSS screen directions.
export const DEPTH_SPRINGS = [{ zeta: 1, omega: 6 }, { zeta: 0.9, omega: 6 }, { zeta: 0.75, omega: 6.5 }, { zeta: 0.62, omega: 7 }];
const cursor = { x: 0, y: 0 };
const cursorListeners = new Set();
const finePointer = matchMedia('(pointer: fine)');
function notifyCursor() { cursorListeners.forEach(wake => wake()); }
addEventListener('pointermove', e => {
  if (!finePointer.matches || e.pointerType === 'touch') return;
  cursor.x = Math.max(-1, Math.min(1, e.clientX / innerWidth * 2 - 1));
  cursor.y = Math.max(-1, Math.min(1, e.clientY / innerHeight * 2 - 1));
  notifyCursor();
}, { passive: true });
function resetCursor() { cursor.x=0; cursor.y=0; notifyCursor(); }
document.documentElement.addEventListener('pointerleave', resetCursor);
addEventListener('blur', resetCursor);
finePointer.addEventListener('change', resetCursor);
export const readingOrigin = performance.now();
export function readingDrift(now, cap) {
  const phase = (now - readingOrigin) % CYCLE;
  const envelope = phase < ACTIVE ? Math.sin(Math.PI * phase / ACTIVE) ** 2 : 0;
  const wave = envelope * Math.sin(2 * Math.PI * phase / ACTIVE) * STRENGTH;
  return { x: cap[0] * wave, y: cap[1] * wave, active: phase < ACTIVE, rest: CYCLE - phase };
}

/** One active backdrop stack; caller disposes it when its cross-fade completes. */
export async function readingLayers(item, scene, still, allowed) {
  if (!allowed()) return null;
  const stack = document.createElement('span');
  stack.className = 'scene-reading-layers';
  const planes = scene.layers.map((l, i) => {
    const img = new Image(l.width, l.height);
    img.alt = ''; img.decoding = 'async'; img.src = l.src;
    img.className = 'scene-layer';
    img.style.cssText = `--ax:${l.anchor[0]*100}%;--ay:${l.anchor[1]*100}%;--mx:${l.mobileAnchor[0]*100}%;--my:${l.mobileAnchor[1]*100}%`;
    stack.append(img);
    return { img, layer:l, spring:DEPTH_SPRINGS[l.slot ? PLANE_SPRING[l.slot] : Math.min(i, DEPTH_SPRINGS.length-1)], x:0, y:0, vx:0, vy:0 };
  });
  try { await Promise.all(planes.map(p => p.img.decode())); }
  catch { return null; } // the reading still remains visible
  if (!item.isConnected || !item.classList.contains('is-on') || !allowed()) return null;
  item.append(stack);
  still.style.visibility = 'hidden';
  let raf=0, timer=0, last=0, disposed=false;
  const scale = () => Math.max(item.clientWidth / scene.grid[0], item.clientHeight / scene.grid[1]);
  function request() { if (!raf && !disposed && allowed() && !document.hidden) raf=requestAnimationFrame(draw); }
  function draw(now) {
    raf=0;
    if (disposed || document.hidden) return;
    if (!allowed()) return dispose();
    if (now-last < 1000/30-2) return request();
    const dt=Math.min((now-last)/1000, .05); last=now;
    const k=scale(); let moving=false;
    for (const plane of planes) {
      const {img,layer,spring:{zeta,omega}}=plane;
      const tx=-cursor.x*layer.cap[0], ty=-cursor.y*layer.cap[1];
      for(let n=Math.max(1,Math.ceil(dt*240)),h=dt/n,i=0;i<n;i++) {
        plane.vx+=(-omega*omega*(plane.x-tx)-2*zeta*omega*plane.vx)*h; plane.x+=plane.vx*h;
        plane.vy+=(-omega*omega*(plane.y-ty)-2*zeta*omega*plane.vy)*h; plane.y+=plane.vy*h;
      }
      if(Math.abs(plane.x-tx)+Math.abs(plane.y-ty)+Math.abs(plane.vx)+Math.abs(plane.vy)<.01) {
        plane.x=tx;plane.y=ty;plane.vx=0;plane.vy=0;
      } else moving=true;
      const p=readingDrift(now,layer.cap);
      const x=Math.max(-layer.cap[0],Math.min(layer.cap[0],plane.x+p.x));
      const y=Math.max(-layer.cap[1],Math.min(layer.cap[1],plane.y+p.y));
      img.style.translate=`${x*k}px ${y*k}px`;
    }
    const p=readingDrift(now,[0,0]);
    if (p.active || moving) request();
    else timer=setTimeout(request,p.rest);
  }
  function visibility() {
    cancelAnimationFrame(raf); raf=0; clearTimeout(timer);
    if (!document.hidden) request();
  }
  document.addEventListener('visibilitychange',visibility);
  function cursorWake() { clearTimeout(timer); request(); }
  cursorListeners.add(cursorWake);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  function preference() { if (!allowed()) dispose(); }
  reduce.addEventListener('change',preference);
  function dispose() {
    disposed=true;cancelAnimationFrame(raf);clearTimeout(timer);
    document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference);
    cursorListeners.delete(cursorWake);
    stack.remove();still.style.visibility='';
  }
  request();
  return dispose;
}
