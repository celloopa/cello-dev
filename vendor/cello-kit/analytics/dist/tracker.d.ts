import { type EventName, type EventProps } from "./events.ts";
/** What the tracker needs from a vendor SDK. posthog-js fits it as is. */
export interface AnalyticsClient {
    capture(event: string, properties?: Record<string, unknown>): void;
    identify(distinctId: string): void;
    reset(): void;
}
export interface TrackerOptions {
    /** The site's stable id ("ghosted", "cello-design"); sent on every event as `site`. */
    site: string;
    /** null while analytics is off (no key, a dev build, a visitor who opted out): every call is then a no-op. */
    client: AnalyticsClient | null;
}
export interface Tracker {
    track<N extends EventName>(event: N, ...props: EventProps<N> extends never ? [] : [EventProps<N>?]): void;
    /** After sign-in, with the account's opaque id. */
    identify(accountId: string): void;
    /** On sign-out, so the next person on this browser starts fresh. */
    reset(): void;
}
export declare function createTracker({ site, client }: TrackerOptions): Tracker;
/** Sends scroll_depth once each at 25, 50, 75 and 100 percent. Returns a function that stops watching. */
export declare function watchScrollDepth(tracker: Tracker, path: string, win?: Window): () => void;
