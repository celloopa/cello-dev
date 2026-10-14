/*
 * Lazy scene art (no three.js): when a page may start fetching pictures that aren't on its first
 * screen, and which ones. From /card's panels (S3), shared with the Scene's backdrops (home).
 */

/**
 * Runs `fn` once, when the first screen is complete (the page has loaded, and the scene's
 * renderer has drawn, or none is expected) or at the first scroll, whichever comes first. So
 * nothing lazy competes with the first screen, and nothing waits once the reader moves.
 */
export function afterFirstScreen(fn) {
  const root = document.documentElement;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  const heroDone = () => !root.classList.contains("scene-3d") || root.classList.contains("scene-gl-on");
  const whenHeroDone = () => {
    if (heroDone()) return run();
    const mo = new MutationObserver(() => {
      if (!heroDone()) return;
      mo.disconnect();
      run();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  };
  if (document.readyState === "complete") whenHeroDone();
  else addEventListener("load", whenHeroDone, { once: true });
  addEventListener("scroll", run, { once: true, passive: true });
}

/**
 * Calls `load(el)` once for each element, as it comes within one viewport below the screen (or at
 * once for all of them without IntersectionObserver).
 */
export function whenNear(els, load) {
  if (!("IntersectionObserver" in window)) return els.forEach(load);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        load(e.target);
      }
    },
    { rootMargin: "0px 0px 100% 0px" },
  );
  els.forEach((el) => io.observe(el));
}
