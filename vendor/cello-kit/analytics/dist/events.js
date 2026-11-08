/** Every name in contracts/analytics/event.schema.json, in its order. A test keeps the two equal. */
export const EVENT_NAMES = [
    "page_view", "scroll_depth", "cta_click", "invite_request_started", "invite_request_sent",
    "invite_sent", "invite_opened", "sign_in_attempted", "app_opened", "resume_started", "resume_completed",
    "job_new_opened", "job_added", "tailoring_requested", "document_downloaded", "job_marked_applied",
    "onboarding_exit_reason", "reminder_email_sent", "app_returned", "feature_used",
];
const known = new Set(EVENT_NAMES);
export const isEventName = (name) => known.has(name);
const OPAQUE = /^[A-Za-z0-9_-]{8,200}$/;
/** An account id must be opaque: letters, digits, _ and -, so an email, name or invite code can't be passed by mistake. */
export function assertOpaqueId(id) {
    if (!OPAQUE.test(id))
        throw new Error("analytics: an account id must be an opaque id (8-200 of A-Z, a-z, 0-9, _ or -), never an email, name or code.");
    return id;
}
