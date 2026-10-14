// Throwaway interaction controller. Real links are the no-JS fallback; no persistence or backend.
import { bindThemeToggles } from "@/utils/themeToggle.js";

interface Place { id: string; place: string; name: string; month: string }
export function startWorldPrototype() {
  const root = document.body;
  const data = document.querySelector('[data-world-data]');
  if (!data) return;
  const places: Place[] = JSON.parse(data.textContent || '[]');
  const stage = document.querySelector<HTMLElement>('.world-stage')!;
  const arrival = document.querySelector<HTMLElement>('[data-world-arrival]')!;
  const landmarks = document.querySelector<HTMLElement>('[data-world-explore]')!;
  const landmarkNav = document.querySelector<HTMLElement>('.world-landmarks')!;
  const visited = document.querySelector<HTMLElement>('[data-world-visited]')!;
  const caption = document.querySelector<HTMLElement>('[data-world-caption]')!;
  const state = document.querySelector<HTMLElement>('[data-world-state]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  let current: Place | undefined;
  let reading = false;
  let exploring = false;
  let returnTarget: HTMLElement | null = null;

  const loadImages = (host: Element) => host.querySelectorAll<HTMLImageElement>('img[data-src]').forEach(img => {
    if (!img.getAttribute('src')) img.src = img.dataset.src!;
  });
  const apply = (focus = false) => {
    const place = current?.place || 'mirror-lake';
    root.dataset.place = place;
    root.dataset.worldMode = current ? (reading ? 'reading' : 'place') : (exploring ? 'explore' : 'arrival');
    arrival.hidden = !!current || exploring;
    landmarkNav.hidden = !!current;
    visited.hidden = !current;
    document.querySelectorAll<HTMLElement>('[data-world-scene]').forEach(scene => {
      const active = scene.dataset.worldScene === place;
      if (active) loadImages(scene);
      scene.classList.toggle('is-current', active);
    });
    document.querySelectorAll<HTMLElement>('[data-world-project]').forEach(article => {
      const active = article.dataset.worldProject === current?.id;
      article.hidden = !active;
      article.querySelector<HTMLElement>('[data-world-summary]')!.hidden = !reading;
      if (active) {
        loadImages(article);
        if (focus) article.querySelector<HTMLElement>('h2')!.focus({preventScroll: true});
      }
    });
    document.querySelectorAll<HTMLElement>('[data-world-visit]').forEach(link => {
      if (link.dataset.worldVisit === current?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    document.querySelector<HTMLElement>('[data-current-place]')!.textContent = current?.name || '';
    document.querySelector<HTMLElement>('[data-current-month]')!.textContent = current?.month || '';
    caption.textContent = current ? `${current.name} · ${current.month}` : 'Mirror Lake · September';
    state.textContent = `${root.dataset.worldMode}${current ? ` · ${current.id}` : ''}`;
    resetDepth();
  };
  const historyState = () => {
    const url = new URL(location.href);
    url.hash = '';
    url.searchParams.delete('place'); url.searchParams.delete('view');
    if (current) url.searchParams.set('place', current.id);
    if (reading) url.searchParams.set('view', 'read');
    if (exploring && !current) url.searchParams.set('view', 'explore');
    history.pushState(null, '', url);
  };
  const fromURL = () => {
    const params = new URLSearchParams(location.search);
    current = places.find(p => p.id === params.get('place'));
    reading = !!current && params.get('view') === 'read';
    exploring = !current && params.get('view') === 'explore';
    apply();
  };
  function resetDepth() {
    document.querySelectorAll<HTMLElement>('.world-depth').forEach(layer => layer.style.transform = 'translate(0, 0)');
  }
  document.querySelectorAll<HTMLElement>('[data-world-visit]').forEach(link => {
    link.addEventListener('click', event => {
      if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      returnTarget = link;
      current = places.find(p => p.id === link.dataset.worldVisit);
      reading = false; exploring = false;
      historyState(); apply(true);
      window.scrollTo({top: 0, behavior: 'instant'});
    });
  });
  const home = () => {
    current = undefined; reading = false; exploring = true;
    historyState(); apply();
    window.scrollTo({top: 0, behavior: 'instant'});
    (returnTarget?.closest('.world-landmarks') ? returnTarget : landmarkNav).focus({preventScroll: true});
  };
  document.querySelectorAll<HTMLElement>('[data-world-home]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); home(); }));
  landmarks.addEventListener('click', event => {
    event.preventDefault(); exploring = true; historyState(); apply(); landmarkNav.focus({preventScroll: true});
  });
  document.querySelectorAll<HTMLElement>('[data-world-read]').forEach(button => button.addEventListener('click', () => {
    reading = true; historyState(); apply(true);
  }));
  const backToPlace = () => { reading = false; historyState(); apply(true); };
  document.querySelectorAll<HTMLElement>('[data-world-return]').forEach(button => button.addEventListener('click', backToPlace));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (reading) backToPlace(); else if (current) home();
  });
  addEventListener('popstate', fromURL);
  let frame = 0;
  stage.addEventListener('pointermove', event => {
    if (reduce.matches || !fine.matches || innerWidth < 900 || reading) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = stage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX-box.left)/box.width)*2-1));
      const y = Math.max(-1, Math.min(1, ((event.clientY-box.top)/box.height)*2-1));
      document.querySelectorAll<HTMLImageElement>('.world-place.is-current .world-depth').forEach(layer => {
        // Caps use the original source grid, which can be larger than the web derivative.
        const sourceWidth = Number(layer.style.getPropertyValue('--source-width')) || layer.width;
        const sourceHeight = sourceWidth * layer.height / layer.width;
        const scale = Math.max(box.width/sourceWidth, box.height/sourceHeight);
        const capX = Number(layer.style.getPropertyValue('--cap-x'))*scale;
        const capY = Number(layer.style.getPropertyValue('--cap-y'))*scale;
        layer.style.transform = `translate(${x*capX}px, ${y*capY}px)`;
      });
    });
  }, {passive: true});
  stage.addEventListener('pointerleave', resetDepth);
  reduce.addEventListener('change', resetDepth);
  document.addEventListener('visibilitychange', () => { if (document.hidden) {cancelAnimationFrame(frame); resetDepth();} });
  bindThemeToggles();
  fromURL();
  root.classList.add('world-enhanced');
}
