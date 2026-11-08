import { assertOpaqueId, isEventName } from "./events.js";
/** Sends server-side events (invite_sent, reminder_email_sent) to PostHog's capture API. Resolves false on any failure; never throws on the network. */
export function createServerSender({ apiKey, site, region = "us", fetch = globalThis.fetch }) {
    const url = `https://${region}.i.posthog.com/i/v0/e/`;
    return async function send(event, { distinctId, timestamp }, ...props) {
        if (!isEventName(event))
            throw new Error(`analytics: unknown event ${JSON.stringify(event)}`);
        const body = {
            api_key: apiKey,
            event,
            distinct_id: assertOpaqueId(distinctId),
            properties: { ...props[0], site },
            ...(timestamp ? { timestamp: timestamp.toISOString() } : {}),
        };
        try {
            const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
            return res.ok;
        }
        catch {
            return false;
        }
    };
}
