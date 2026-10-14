// The same bounded drift for WebGL reading pages and lazy DOM backdrop planes.
// Twenty-four seconds of slow movement, then a minute at rest. No camera or text movement.
const css = getComputedStyle(document.documentElement);
const seconds = name => { const value=css.getPropertyValue(name).trim(); return parseFloat(value)*(value.endsWith('ms')?1:1000); };
const ACTIVE = seconds('--motion-reading-active');
const CYCLE = ACTIVE + seconds('--motion-reading-rest');
const STRENGTH = parseFloat(css.getPropertyValue('--motion-reading-strength'));
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
  const planes = scene.layers.map(l => {
    const img = new Image(l.width, l.height);
    img.alt = ''; img.decoding = 'async'; img.src = l.src;
    img.className = 'scene-layer';
    img.style.cssText = `--ax:${l.anchor[0]*100}%;--ay:${l.anchor[1]*100}%;--mx:${l.mobileAnchor[0]*100}%;--my:${l.mobileAnchor[1]*100}%`;
    stack.append(img);
    return { img, layer:l };
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
    last=now;
    const k=scale();
    for (const {img,layer} of planes) {
      const p=readingDrift(now,layer.cap);
      img.style.translate=`${p.x*k}px ${p.y*k}px`;
    }
    const p=readingDrift(now,[0,0]);
    if (p.active) request();
    else timer=setTimeout(request,p.rest);
  }
  function visibility() {
    cancelAnimationFrame(raf); raf=0; clearTimeout(timer);
    if (!document.hidden) request();
  }
  document.addEventListener('visibilitychange',visibility);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  function preference() { if (!allowed()) dispose(); }
  reduce.addEventListener('change',preference);
  function dispose() {
    disposed=true;cancelAnimationFrame(raf);clearTimeout(timer);
    document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference);
    stack.remove();still.style.visibility='';
  }
  request();
  return dispose;
}
