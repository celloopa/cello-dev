/** One official SDK per provider; re-scan after Astro's client-side page swaps. */
type TwitterSDK = {
  widgets: { createTweet(id: string, target: HTMLElement, options: Record<string, unknown>): Promise<HTMLElement | undefined> };
};
type EmbedWindow = Window & {
  twttr?: TwitterSDK;
  instgrm?: { Embeds?: { process?: () => void } };
};
const embedWindow = window as EmbedWindow;
const scripts = new Map<string, Promise<void>>();
const bound = new WeakSet<HTMLElement>();
let threadsSequence = 0;

function loadSDK(provider: "tweet" | "threads"): Promise<void> {
  const previous = scripts.get(provider);
  if (previous) return previous;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = provider === "tweet" ? "https://platform.twitter.com/widgets.js" : "https://www.threads.com/embed.js";
    script.async = true;
    const timeout = window.setTimeout(() => reject(new Error("Embed script timed out")), 15000);
    script.onload = () => { window.clearTimeout(timeout); resolve(); };
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("Embed script unavailable")); };
    document.head.append(script);
  });
  scripts.set(provider, promise);
  return promise;
}

async function hydrate(host: HTMLElement) {
  if (!host.isConnected) return;
  const provider = host.dataset.socialEmbed;
  if (provider !== "tweet" && provider !== "threads") return;
  const fallback = host.querySelector<HTMLElement>("[data-social-fallback]");
  const target = document.createElement("div");
  target.dataset.socialTarget = "";
  host.append(target);
  const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const ready = () => {
    if (!host.isConnected) return;
    target.querySelectorAll("iframe").forEach((frame) => { frame.title = host.dataset.embedTitle || "Embedded post"; });
    if (fallback) fallback.hidden = true;
    host.dataset.embedState = "ready";
  };
  host.dataset.embedState = "loading";
  try {
    if (provider === "tweet") {
      await loadSDK(provider);
      if (!host.isConnected) return;
      const widget = await embedWindow.twttr?.widgets.createTweet(host.dataset.postId!, target, { theme, dnt: true, conversation: "none" });
      if (!widget) throw new Error("Post unavailable");
      ready();
    } else {
      // Threads' SDK owns iframe sizing and message validation. Keep our source link outside it.
      const quote = document.createElement("blockquote");
      quote.className = "text-post-media";
      quote.id = `cello-threads-${threadsSequence++}`;
      quote.dataset.textPostPermalink = host.dataset.url;
      quote.dataset.theme = theme;
      target.append(quote);
      const observer = new MutationObserver(() => {
        const frame = target.querySelector("iframe");
        if (frame) frame.title = host.dataset.embedTitle || "Threads post";
        if (frame && frame.getBoundingClientRect().height > 0) { observer.disconnect(); ready(); }
      });
      observer.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "height"] });
      const timeout = window.setTimeout(() => {
        observer.disconnect();
        if (host.dataset.embedState !== "ready") { target.remove(); host.dataset.embedState = "unavailable"; }
      }, 15000);
      document.addEventListener("astro:before-swap", () => { observer.disconnect(); window.clearTimeout(timeout); }, { once: true });
      await loadSDK(provider);
      if (!host.isConnected) return;
      embedWindow.instgrm?.Embeds?.process?.();
    }
  } catch {
    target.remove();
    host.dataset.embedState = "unavailable";
    // The server-rendered title, optional description and original link remain usable.
  }
}

function initialize() {
  const hosts = [...document.querySelectorAll<HTMLElement>("[data-social-embed]")].filter((host) => !bound.has(host));
  if (!hosts.length) return;
  if (!("IntersectionObserver" in window)) {
    hosts.forEach((host) => { bound.add(host); void hydrate(host); });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      void hydrate(entry.target as HTMLElement);
    }
  }, { rootMargin: "300px" });
  hosts.forEach((host) => { bound.add(host); observer.observe(host); });
  document.addEventListener("astro:before-swap", () => observer.disconnect(), { once: true });
}

initialize();
document.addEventListener("astro:page-load", initialize);
