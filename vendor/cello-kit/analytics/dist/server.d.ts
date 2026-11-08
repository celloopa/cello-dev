import { type EventName, type EventProps } from "./events.ts";
export interface ServerSenderOptions {
    /** The PostHog project key (public by design; still kept in the app's env, not in git). */
    apiKey: string;
    site: string;
    region?: "us" | "eu";
    fetch?: typeof globalThis.fetch;
}
export interface ServerSendOptions {
    /** The account's opaque id, or an opaque invite id before an account exists. */
    distinctId: string;
    timestamp?: Date;
}
/** Sends server-side events (invite_sent, reminder_email_sent) to PostHog's capture API. Resolves false on any failure; never throws on the network. */
export declare function createServerSender({ apiKey, site, region, fetch }: ServerSenderOptions): <N extends EventName>(event: N, { distinctId, timestamp }: ServerSendOptions, ...props: EventProps<N> extends never ? [] : [EventProps<N>?]) => Promise<boolean>;
