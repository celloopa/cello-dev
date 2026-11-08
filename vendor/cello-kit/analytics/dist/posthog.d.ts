/** Where a page sits: public pages run cookieless; signed-in pages keep the id in memory only, never in cookies or storage. */
export type PageKind = "public" | "signed-in";
export interface PostHogSiteOptions {
    kind: PageKind;
    /** "us" (default) or "eu". A PostHog project can't move region later. */
    region?: "us" | "eu";
    /** Session replay; off unless asked for. When on, every text node and input is masked. */
    replay?: boolean;
    heatmaps?: boolean;
}
/** The attribute that lets one element's text show in replay. Use it only on text with no personal content. */
export declare const UNMASK_ATTRIBUTE = "data-kit-unmask";
/**
 * posthog-js init options for a kit site. Autocapture and automatic pageviews are off, so only the
 * typed events in contracts/analytics are sent, and no clicked text or attribute leaves the page.
 */
export declare function posthogOptions({ kind, region, replay, heatmaps }: PostHogSiteOptions): {
    person_profiles: "identified_only";
    autocapture: boolean;
    capture_pageview: boolean;
    capture_pageleave: boolean;
    mask_all_text: boolean;
    mask_all_element_attributes: boolean;
    capture_heatmaps: boolean;
    disable_session_recording: boolean;
    session_recording: {
        maskAllInputs: boolean;
        maskTextSelector: string;
        maskTextFn: typeof maskText;
    };
    cookieless_mode: "always";
    api_host: string;
} | {
    person_profiles: "identified_only";
    autocapture: boolean;
    capture_pageview: boolean;
    capture_pageleave: boolean;
    mask_all_text: boolean;
    mask_all_element_attributes: boolean;
    capture_heatmaps: boolean;
    disable_session_recording: boolean;
    session_recording: {
        maskAllInputs: boolean;
        maskTextSelector: string;
        maskTextFn: typeof maskText;
    };
    persistence: "memory";
    api_host: string;
};
/** Replay's text mask: every character becomes *, unless an ancestor carries UNMASK_ATTRIBUTE. */
export declare function maskText(text: string, element?: Element | null): string;
