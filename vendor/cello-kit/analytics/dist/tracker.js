import { assertOpaqueId, isEventName } from "./events.js";
export function createTracker({ site, client }) {
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(site))
        throw new Error(`analytics: site must be a short lowercase id, got ${JSON.stringify(site)}`);
    return {
        track(event, ...rest) {
            if (!isEventName(event))
                throw new Error(`analytics: unknown event ${JSON.stringify(event)}; add it to contracts/analytics first.`);
            client?.capture(event, { ...rest[0], site });
        },
        identify(accountId) { client?.identify(assertOpaqueId(accountId)); },
        reset() { client?.reset(); },
    };
}
/** Sends scroll_depth once each at 25, 50, 75 and 100 percent. Returns a function that stops watching. */
export function watchScrollDepth(tracker, path, win = window) {
    const sent = new Set();
    const onScroll = () => {
        const doc = win.document.documentElement;
        const room = doc.scrollHeight - win.innerHeight;
        const pct = room <= 0 ? 100 : ((win.scrollY + 1) / room) * 100;
        for (const step of [25, 50, 75, 100]) {
            if (pct >= step && !sent.has(step)) {
                sent.add(step);
                tracker.track("scroll_depth", { percent: step, path });
            }
        }
    };
    win.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => win.removeEventListener("scroll", onScroll);
}
