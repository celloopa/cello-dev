/** The attribute that lets one element's text show in replay. Use it only on text with no personal content. */
export const UNMASK_ATTRIBUTE = "data-kit-unmask";
/**
 * posthog-js init options for a kit site. Autocapture and automatic pageviews are off, so only the
 * typed events in contracts/analytics are sent, and no clicked text or attribute leaves the page.
 */
export function posthogOptions({ kind, region = "us", replay = false, heatmaps = false }) {
    return {
        api_host: region === "eu" ? "https://eu.i.posthog.com" : "https://us.i.posthog.com",
        ...(kind === "public" ? { cookieless_mode: "always" } : { persistence: "memory" }),
        person_profiles: "identified_only",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        mask_all_text: true,
        mask_all_element_attributes: true,
        capture_heatmaps: heatmaps,
        disable_session_recording: !replay,
        session_recording: {
            maskAllInputs: true,
            maskTextSelector: "*",
            maskTextFn: maskText,
        },
    };
}
/** Replay's text mask: every character becomes *, unless an ancestor carries UNMASK_ATTRIBUTE. */
export function maskText(text, element) {
    if (element?.closest?.(`[${UNMASK_ATTRIBUTE}]`))
        return text;
    return text.replace(/\S/g, "*");
}
