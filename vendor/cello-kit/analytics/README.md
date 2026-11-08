# @cello-kit/analytics

Page, click and onboarding analytics on the shared event names in [`contracts/analytics`](../../contracts/analytics). It sends only typed events, never clicked text, typed text or document content. PostHog is today's tool (US cloud), behind a small client interface so it can be swapped.

## Browser

```ts
import posthog from "posthog-js";
import { createTracker, posthogOptions, watchScrollDepth } from "@cello-kit/analytics";

const key = import.meta.env.VITE_POSTHOG_KEY;            // the project key, from the app's env
posthog.init(key, posthogOptions({ kind: "public" }));    // or "signed-in"; replay and heatmaps are off unless asked
const analytics = createTracker({ site: "ghosted", client: key ? posthog : null });

analytics.track("page_view", { path: location.pathname });
watchScrollDepth(analytics, location.pathname);
analytics.track("cta_click", { cta: "request-invite", path: "/" });
```

- **Public pages** run cookieless (`cookieless_mode: "always"`, which must also be switched on in the PostHog project settings).
- **Signed-in pages** keep the id in memory only. Call `analytics.identify(accountId)` after sign-in with the account's opaque id; it throws on anything that looks like an email, name or code. Call `analytics.reset()` on sign-out.
- **Replay** (`replay: true`) masks every text node and every input. One element's text shows only if it or an ancestor has `data-kit-unmask`; never put that on personal content. Unverified against a real recording yet: check the first replays.
- Autocapture and automatic pageviews are off, so send `page_view` yourself on each route change.
- `client: null` (no key, dev, opted out) makes every call a no-op.

## Server

```ts
import { createServerSender } from "@cello-kit/analytics/server";
const send = createServerSender({ apiKey: process.env.POSTHOG_KEY!, site: "ghosted" });
await send("invite_sent", { distinctId: inviteId }, { source: "manual" });   // false on failure, never throws on the network
```

Use the same opaque id the browser identifies with, so server and browser events join one person. Before an account exists, use an opaque invite id.

## Adding an event

Add it to `contracts/analytics/event.schema.json`, run `pnpm gen`, then add the name to `EVENT_NAMES` (a test keeps the two equal). Add values to an enum rather than renaming one.
