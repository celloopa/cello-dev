/** Normalize author-supplied URLs before they can become an embed or link. No remote fetches. */
export type EmbedType = "threads" | "tweet" | "youtube" | "article";

export function webURL(value: string): URL {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`[Embed] Use an absolute HTTPS URL: ${value}`); }
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("[Embed] URLs must use HTTPS and must not include credentials.");
  }
  return url;
}

function seconds(value: string): number {
  if (/^\d+$/.test(value)) return Number(value);
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match || !match[0]) throw new Error("[Embed] YouTube start time must be seconds or a time such as 1m30s.");
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

export function embedSource(value: string, type?: EmbedType, start?: number) {
  const url = webURL(value);
  const host = url.hostname.replace(/^(www\.|m\.|mobile\.|music\.)/, "");
  const inferred: EmbedType = ["threads.com", "threads.net"].includes(host) ? "threads"
    : ["x.com", "twitter.com"].includes(host) ? "tweet"
    : ["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host) ? "youtube" : "article";
  const provider = type ?? inferred;
  if (provider === "article") return { provider, href: url.href, host: url.hostname, id: "", src: "" };
  if (provider !== inferred) throw new Error(`[Embed] ${provider} does not match this URL's provider.`);
  if (provider === "threads") {
    const match = /^\/@([\w.]+)\/post\/([\w-]+)\/?$/.exec(url.pathname);
    if (!match) throw new Error("[Embed] Use a Threads post permalink, not a profile or share URL.");
    return { provider, href: `https://www.threads.com/@${match[1]}/post/${match[2]}`, host: "threads.com", id: match[2], src: "" };
  }
  if (provider === "tweet") {
    const match = /^\/(?:[\w]+|i\/web)\/status\/(\d+)(?:\/.*)?$/.exec(url.pathname);
    if (!match) throw new Error("[Embed] Use an X/Twitter post permalink containing /status/ and a numeric ID.");
    return { provider, href: `https://twitter.com/i/web/status/${match[1]}`, host: "x.com", id: match[1], src: "" };
  }
  const id = host === "youtu.be" ? url.pathname.slice(1).split("/")[0]
    : url.pathname === "/watch" ? url.searchParams.get("v")
    : /^\/(?:embed|shorts|live)\/([\w-]+)\/?$/.exec(url.pathname)?.[1];
  if (!id || !/^[\w-]{11}$/.test(id)) throw new Error("[Embed] Use a YouTube video URL with an 11-character video ID.");
  const offset = start ?? seconds(url.searchParams.get("start") ?? url.searchParams.get("t") ?? "0");
  if (!Number.isSafeInteger(offset) || offset < 0) throw new Error("[Embed] YouTube start must be a non-negative integer in seconds.");
  const params = new URLSearchParams({ playsinline: "1" });
  if (offset) params.set("start", String(offset));
  return { provider, href: `https://www.youtube.com/watch?v=${id}${offset ? `&t=${offset}s` : ""}`, host: "youtube.com", id, src: `https://www.youtube-nocookie.com/embed/${id}?${params}` };
}

export function previewImage(value?: string): string | undefined {
  if (!value) return;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return webURL(value).href;
}
