# Blog embeds

## Baseline and scope

Before this change, blog MDX supported Markdown links and explicitly imported media components. The blog renderer passed no shared component map, and had no social/video embed support. Existing published bodies and imported media keep working.

The blog template now registers `Embed`. Use it directly in `.mdx` without an import. Plain Markdown links keep behaving as links; rich embeds are explicit. No API key, new package, scraping service or build-time request is needed.

## Threads

Use the full post permalink, not a share link or profile:

```mdx
<Embed
  url="https://www.threads.com/@blakejakely/post/DecxaX9Fox4"
  title="A conversation about AI and close collaboration"
  caption="The post that got me thinking."
/>
```

Both threads.net and threads.com permalinks are accepted. The official Threads script renders the native embed. A permanent “Open on Threads” link stays outside it. An optional `description` supplies author-verified context if the preview cannot load; it is not scraped or presented as a quotation.

## X / Twitter

```mdx
<Embed
  url="https://x.com/TwitterDev/status/850006245121695744"
  title="Twitter Dev's API announcement"
/>
```

x.com and twitter.com post URLs work. The official widgets script loads on pages with visible social embeds, once per provider. It requests the do-not-track option and hides the parent conversation. Deleted, private or blocked posts keep their original link and fallback title.

## YouTube

```mdx
<Embed
  url="https://www.youtube.com/watch?v=M7lc1UVf-VE"
  title="A descriptive title for the video"
  start={90}
  caption="The part I wanted to point out starts at 1:30."
/>
```

Watch links, youtu.be links, Shorts, live and embed URLs are supported. A descriptive `title` is required for the player. The optional `start` is seconds; shared URLs with `t=1m30s` or `start=90` work too. The player is responsive, lazy-loaded and uses youtube-nocookie.com. It does not autoplay. An “Open on YouTube” link remains available. Referrer policy sends the origin needed by YouTube's embedded player.

## Articles

```mdx
<Embed
  url="https://help.figma.com/hc/en-us/articles/37998629035799-Work-with-the-Figma-agent-in-design-files"
  title="Work with the Figma agent in design files"
  siteName="Figma Help"
  description="Figma's guide to working with an agent inside a design file."
/>
```

Other HTTPS URLs become article previews. Supply the title and description you want to publish, plus an optional local or HTTPS image and alt text. An omitted image renders a text preview. Use `type="article"` to show a supported social/video URL as an article link instead. These are linked previews, not full-page iframes: many sites block framing, and manual metadata keeps builds independent of remote sites. Use imagery that accurately represents the linked article.

## Behavior and limits

- All external link/embed URLs require HTTPS and reject credentials. Provider hostname and post/video IDs are checked before rendering.
- Social SDKs load near the viewport, on demand, and reinitialize after Astro client navigation. Source links are always server-rendered, including with JavaScript disabled or SDKs blocked.
- The social post content is supplied by its platform, and may require login or be unavailable. The surrounding blog remains readable.
- Native social widgets use the site's theme at mount time; toggling the site's theme does not recreate already loaded widgets.
- Article previews and wrappers use the site's type, spacing and surface tokens. Captions remain separate from provider content.
- Existing links are not automatically converted. The design-future article explicitly includes its Threads source beneath the paragraph introducing it; the prose is unchanged.

## Primary references, checked October 14, 2026

- [Astro MDX component mapping](https://docs.astro.build/en/guides/integrations-guide/mdx/#passing-components-to-mdx-content)
- [Meta's official embed integration](https://github.com/facebook/meta-embeds-for-wordpress): Threads' embed script and endpoint. The current first-party `https://www.threads.com/embed.js` was inspected to verify the `text-post-media` markup and `instgrm.Embeds.process()` re-scan API.
- [X's embedding guide](https://help.x.com/en/using-x/how-to-embed-a-post)
- [YouTube embedding, privacy-enhanced mode and referrer requirements](https://support.google.com/youtube/answer/171780?hl=en)


## Local verification, October 14, 2026

Work is isolated on `codex/blog-embeds`, based on published `b2f753d`. The renderer was first verified locally; Cello then authorized shipping it and adding the Threads source embed to “When will the future of design arrive?”. The temporary MDX post exercised the renderer's shared component map without an import, all four providers and a repeated tweet. The fixture is removed from the final source and production build.

Persona: Morgan, reading a design post in English. The real public Threads and X widgets were observed in the in-app browser, including two tweets sharing one widgets script. The Threads widget rendered again after Writing → fixture client navigation without duplicating its SDK. YouTube's official sample displayed its titled player and Play control, with start=90 and no autoplay. Playback itself was not started. The documentation's earlier sample video was private; the working IFrame API sample replaced it for the check.

A narrow-screen issue found during the run was fixed: the video's minimum player height had expanded an auto-width box. Explicit width keeps the 390px page inside its viewport while preserving a 220px minimum player height. Threads also needs a unique blockquote ID so its SDK can remove the source placeholder after sizing the iframe; that is now supplied.

| Id | Flow | Result | Evidence |
| --- | --- | --- | --- |
| morgan-embed-01 | Read a Threads post without leaving the article | Pass: native post, descriptive iframe title and permanent original link; client navigation re-scan | [Desktop](shots/embeds-blog-embed-check-1440.webp), [phone](shots/embeds-blog-embed-check-390.webp) |
| morgan-embed-02 | Read two tweets in one post | Pass: both native widgets observed, one SDK, originals available | Same local fixture screenshots; in-app browser inspection |
| morgan-embed-03 | Find the video and open it or use the player | Pass: titled privacy-enhanced player, start time, source link; phone minimum height and no overflow | Same local fixture screenshots; in-app browser player inspection |
| morgan-embed-04 | Follow an article preview | Pass: image/text preview and normal source link | Same local fixture screenshots |
| morgan-embed-05 | Continue reading with remote providers blocked | Pass: local CSP blocked both social SDKs and remote frames, preserving fallback copy, article preview and all original links | [Desktop](shots/embeds-embed-blocked-1440.webp), [phone](shots/embeds-embed-blocked-390.webp) |

Reused `pnpm ui:shots` for both fixture variants at 1440/390 and both theme settings. Native cross-origin frames can paint blank in full-page captures when outside the viewport; their actual contents were checked in the in-app browser rather than inferred from those captures. Source/URL tests cover HTTPS, credentials, provider spoofing, invalid post/video IDs, share URLs, offsets and article overrides. Server-rendered original links and article previews also remain in HTML without JavaScript.

Final clean `pnpm build`: token/family/Figma checks pass; Astro check 117 files, zero errors/warnings/hints; 16 pages. Temporary fixture routes are absent. The renderer-only check kept article source files identical to the published base. The release adds only the explicit Threads embed markup to the new article.


## Release check

Cello authorized “ship it and add the threads embed to the new blog.” The post now includes its source beneath the paragraph introducing @blakejakely. All original prose, metadata and concept media are preserved; every other blog source is unchanged. The permanent original-source link stays usable when the native preview is blocked.

The actual article, rather than the temporary fixture, passes the 1440/390 screenshot run under both theme settings. In-app browser checks confirm a ready Threads iframe, one SDK, no leftover placeholder, the original link, and no horizontal overflow at 390/768 px. Full-page screenshot evidence: [desktop](shots/threads-release-1440.webp), [phone](shots/threads-release-390.webp). The 16-page build and all guards pass. Delivery uses one scoped commit based on freshly verified live master `b2f753d`; the chat receipt records the pushed revision and verified production outcome.
