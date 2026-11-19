// Usage analytics for cello.design (@cello-kit/analytics, PostHog US cloud): page views, how far down a page people
// scroll, and clicks on a few named links and buttons. Codes and paths only: never link text, typed text or content.
// Cookieless, no autocapture, no automatic pageviews, no session replay, no heatmaps (posthogOptions, kind "public").
//
// Production builds only: `astro dev` sends nothing. posthog-js loads after first paint, and events wait in a queue
// until it's ready. Two layouts feed this one module: Layout.astro (ClientRouter: a page-load event on every
// navigation) and SceneLayout.astro (full page loads, no ClientRouter).
import { createTracker, posthogOptions, watchScrollDepth, type EventName, type Tracker } from "@cello-kit/analytics";
import { ANALYTICS_SITE, POSTHOG_PROJECT_KEY } from "./config";

// The names and props are checked against the contract where they are written (page_view, scroll_depth, cta_click).
type Send = (event: EventName, props?: Record<string, unknown>) => void;

const queue: Array<(t: Tracker) => void> = [];
let tracker: Tracker | null = null;
let stopScroll: (() => void) | null = null;

function track(event: EventName, props?: Record<string, unknown>) {
  const run = (t: Tracker) => (t.track as Send)(event, props);
  if (tracker) run(tracker);
  else queue.push(run);
}

/** The tracker the scroll watcher talks to: it queues like everything else until posthog-js is ready. */
const queued: Tracker = {
  track: track as Tracker["track"],
  identify: () => {},
  reset: () => {},
};

/** posthog-js after the page has painted and the browser is idle, so it never weighs on first paint. */
function load() {
  void import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_PROJECT_KEY, posthogOptions({ kind: "public", region: "us", replay: false, heatmaps: false }));
      tracker = createTracker({ site: ANALYTICS_SITE, client: posthog });
      for (const run of queue.splice(0)) run(tracker);
    })
    .catch(() => {
      queue.length = 0; // blocked or offline: analytics just doesn't run
    });
}

function whenIdle(fn: () => void) {
  const go = () => ("requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 1500));
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
}

let lastPage = { href: "", at: 0 };

/** Once per page shown: a full load, or a ClientRouter navigation. */
function pageShown() {
  const now = Date.now();
  if (location.href === lastPage.href && now - lastPage.at < 1000) return; // the same view, announced twice
  lastPage = { href: location.href, at: now };
  const path = location.pathname.slice(0, 200);
  track("page_view", { path });
  stopScroll?.();
  stopScroll = watchScrollDepth(queued, path);
}

/** One delegated listener: an element (or an ancestor) with data-cta="<code>" sends cta_click with that code. */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest?.("[data-cta]");
  const cta = el?.getAttribute("data-cta") ?? "";
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(cta)) return;
  track("cta_click", { cta, path: location.pathname.slice(0, 200) });
}

function start() {
  if (import.meta.env.DEV) return;
  const w = window as { __celloAnalytics?: boolean };
  if (w.__celloAnalytics) return;
  w.__celloAnalytics = true;

  document.addEventListener("click", onClick, { capture: true });
  whenIdle(load);

  // ClientRouter pages announce every view (the first too) with astro:page-load; pages without it load once.
  if (document.querySelector('meta[name="astro-view-transitions-enabled"]')) {
    document.addEventListener("astro:page-load", pageShown);
  } else {
    pageShown();
  }
}

start();
