# Image generation on Cello's ChatGPT subscription (research, 2026-10-12)

Question: the best way to generate the window-scene art with Cello's subscription (not a metered
API key), given Pi's `codex_imagegen` may be outdated.

## Findings

1. **Pi's `codex_imagegen` shells out to the Codex CLI** (`codex exec` + `$imagegen`). The local CLI
   is **0.154.0**; the current release is **0.162.1** (`npm view @openai/codex version`). It works,
   but every call carries Codex's agent overhead (~17–22k input tokens on this Mac; see the
   `byo-subscription` skill), and the old CLI may not have the current image path.
2. **Codex itself moved image generation to dedicated "Codex Images" endpoints** (openai/codex PRs
   #23989 2026-05-22, #24723 2026-05-28, #31596 2026-07-09, which made it the default):
   `POST https://chatgpt.com/backend-api/codex/images/generations` and `…/codex/images/edits`,
   with the same ChatGPT-login headers as the Codex Responses call (`Authorization: Bearer`,
   `ChatGPT-Account-Id`, `originator`). Probed 2026-10-06 by a third party
   ([opencode-gpt-imagegen #107](https://github.com/yuji-hatakeyama/opencode-gpt-imagegen/issues/107)):
   - model is effectively fixed to **gpt-image-2** (the `model` field is ignored);
   - `background: transparent` returns an RGBA PNG (rough edge, slight halo);
   - edits take reference images as data URLs (`images: [{ image_url }]`);
   - output ≈ 1.57 MP (aspect follows the request), always PNG; **`quality` is ignored**
     (the backend picked low or medium);
   - ~26 s per image vs ~38 s on the older Responses-tool path; headers suggest a separate image
     quota (`imagegen_premium`, 1-day window), which is inferred, not documented.
3. **`pi-codex-image-gen`** (Pi package v0.2.0, 2026-10-09, [pi.dev](https://pi.dev/packages/pi-codex-image-gen)):
   subscription image generation through the Codex Responses endpoint with the `image_generation`
   tool; its own `/login codex-images`; up to 5 references; chroma-key transparency; no size,
   quality or background control (the backend picks the image model).
4. **Newest models:** GPT Image 2.5 *Sunburst* (detailed, slower) and *Flare* (faster), released
   2026-09-08 in the Image API and the Responses image tool. Per the pi package page, the
   subscription path doesn't expose them; they need a metered API key. Native transparency is a
   preview for gpt-image-2 (since August 2026); unconfirmed for 2.5.
   ([OpenAI changelog](https://developers.openai.com/api/docs/changelog),
   [community: transparent backgrounds preview](https://community.openai.com/t/transparent-backgrounds-are-now-available-in-preview-for-gpt-image-2-in-the-api/1391541))
5. All subscription paths use **undocumented endpoints** that OpenAI can change; they draw on the
   plan's limits, not API credit.

## Recommendation

A small local script in the prototypes that calls the **Codex Images endpoints directly** with
Cello's existing Codex login: generations for style frames, edits for photo/storyboard references,
`background: transparent` for layers (with chroma-key as the fallback). No Pi handoff, no CLI
overhead, and quota headers are logged per call. Token refresh follows the byo-subscription rule:
only near expiry, written back to `~/.codex/auth.json` with 0600.
Fallbacks: `pi-codex-image-gen`, or the existing `codex_imagegen` after upgrading the CLI to
0.162.x. Escalation, only if subscription quality isn't good enough: a metered API key with
`gpt-image-2.5-sunburst` at high quality (Cello's call; it costs money).
