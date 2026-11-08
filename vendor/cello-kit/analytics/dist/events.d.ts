import type { AnalyticsEvent } from "@cello-kit/contracts";
export type EventName = AnalyticsEvent["event"];
/** The properties an event takes, or never when it takes none. */
export type EventProps<N extends EventName> = Extract<AnalyticsEvent, {
    event: N;
}> extends {
    properties?: infer P;
} ? P : never;
/** Every name in contracts/analytics/event.schema.json, in its order. A test keeps the two equal. */
export declare const EVENT_NAMES: readonly ["page_view", "scroll_depth", "cta_click", "invite_request_started", "invite_request_sent", "invite_sent", "invite_opened", "sign_in_attempted", "app_opened", "resume_started", "resume_completed", "job_new_opened", "job_added", "tailoring_requested", "document_downloaded", "job_marked_applied", "onboarding_exit_reason", "reminder_email_sent", "app_returned", "feature_used"];
export declare const isEventName: (name: string) => name is EventName;
/** An account id must be opaque: letters, digits, _ and -, so an email, name or invite code can't be passed by mistake. */
export declare function assertOpaqueId(id: string): string;
