# Flower stories: source record

Internal editorial source, 2026-10-29. The public-facing drafts stay unpublished. Historical numbers below describe earlier routine versions, not measured results for the new motion renderer.

## The manual workflow it replaced

1. Read the drop announcement and identify strains, tiers and offers.
2. Locate current product pages; gather photos and footage.
3. Duplicate the approved Figma story card; replace text and imagery.
4. Convert media where needed in the terminal.
5. Compose footage behind the circular mask in Premiere.
6. Export through Media Encoder and inspect the files.
7. Attach the batch to Asana and post for Slack review.

Cello reported roughly 3–5 hours/week across seven tools. This is a historical working estimate, not a new stopwatch study. Repeating approved composition decisions consumed time that could be spent on design.

## The end state

The earlier scheduled automation is the established production workflow. Its exact current execution lives elsewhere; this Windows session does not run or modify it.

The new review artifacts are an approved-direction candidate for the next flower drop: three seven-second product stories plus one seven-second logo/website story, joined into a 28-second review sequence and available individually. Jimmy's positive feedback and Cello's intention to use it next are evidenced by October 29 Slack messages. Wiring the motion renderer into the next live batch remains ahead. Human review, exception handling and template maintenance remain.

## Architecture

```text
drop announcement ----- offer / tier / product identity
        |
website media ---------- matching product photos + footage
        |
production renderer ---- existing routine (current production)
        |                    ^
        |                    | next-batch integration ahead
        |                Familiar motion renderer + approved recipe
        |
quiet attachment ------ completeness + notification-hours gates
        |
Asana review ---------- Slack combined preview / approval

design exploration: Storybook study -> saved recipe -> offline study export
                         (same frame function; distinct from Familiar renderer)
```

Logic and evidence:
- Original article and production history: pre-rewrite src/content/blog/scheduled-agent-flower-drop-routine.mdx at base 22f3bf7; historical, not a current live execution audit.
- Storybook: /home/kitsune/projects/ad-hub-flower-storybook/web/stories/flower/{Flower.stories.tsx,StudyLab.tsx,motion.ts}; export web/scripts/export-flower-study.mjs. Screenshot source commit 1c48516, captured with prepared local media and frame 60.
- Familiar build: Windows work/Asheville-Dispensary/output/2026-10-29-flower-motion-review/build-review.py and familiar-v7/render-ender.mjs.
- Final review packet: that output's jimmy-preview-v7/ and sharing/delivery-receipt.json; original 28-second MP4 retained there.
- Article derivatives and provenance: docs/writing/2026-10-29-flower-media-sources.json.
- Case-study writing direction: docs/writing/2026-10-29-brand-case-study-brief.md.

## Build story — the beats worth telling

1. Recognize the original card + circle + footage as a repeatable composition. FFmpeg replaces repeated editing; explicit no-audio output fixes a stray-track issue.
2. Wrong-page selection and a stale sitemap expose assumptions. Direct URL/title checks and source ownership become rules.
3. A wrong-tier notification exposes the difference between preparation and outward delivery. Announced tier wins; completeness and hours gate notifications.
4. Idle agent cost exposes unnecessary model work. A script checks for work before model dispatch.
5. Use recovered design time for motion studies. Storybook compares three treatments and saves timing/distance recipes with browser/export parity.
6. Choose Familiar; enlarge and vary background product cutouts, adjust footage crops, animate all layers in/out, then raise and enlarge the video.
7. Derive the black end card from existing leaf artwork and reversed branding. Remove the visible square; restore texture after encoded playback makes it too faint.
8. Verify sequence joins and individual pieces, share one review reel with separate files in Asana, receive CEO-positive feedback and plan next-drop use. Integration and measured steady-state overhead remain unverified.

## Numbers

| Measure | Before | After / evidence state |
| --- | --- | --- |
| Manual assembly | Reported 3–5 hours/week | First automation replaces routine assembly; retained human review; no new timing study |
| Original story | 4.73 seconds, 1080×1920 | Historical October 8 output; mostly static artwork with moving footage |
| New review | N/A | 3 product stories + 1 end card, 7 seconds each; 28 seconds total |
| New web derivative | Original full-resolution review retained | 720×1280 H.264 silent web copy; same sequence/pacing |
| Idle agent cost | Historical $12.10 day | Historical ~ $0.30/day estimate under revised dispatcher/schedule; not current price |
| Incremental motion overhead | Manual motion editing would repeat per batch | No additional manual editing pass intended after cutover; not yet timed on live batch |

## Stack

Figma and existing brand artwork establish compositions. Storybook/React/TypeScript/canvas expose motion studies, with saved JSON recipes and a shared frame renderer for study preview and export. Familiar uses its own code renderer. FFmpeg encodes video; ffprobe and decoded-frame checks inspect deliverables. The original routine coordinates source data and review through Slack and Asana. Astro/MDX and existing media components present the unpublished writing draft.

## Video beat list

- Cold open: final v7 leaf-textured end card and product sequence.
- Original static card/October 8 story; explain the seven manual steps.
- Production diagram: announcement owns wording, website supplies media.
- Wrong-page/tier boundary and quiet preparation versus gated send.
- Actual Storybook comparison and Study Lab controls at frame 60.
- Familiar before/after: product scale, crop, motion and layout changes.
- Black end-card revisions; actual encoded leaves and transitions.
- Review packet and paraphrased CEO feedback; no private Slack screenshots.
- Close: next-batch cutover, unchanged manual assembly goal, ongoing review.
