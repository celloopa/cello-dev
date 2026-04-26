# Static Site Update Spec

## Objective

Implement the content-first repositioning in the current Astro site without starting the Payload migration.

## Current Architecture

- Projects are MDX files in `src/content/projects`.
- Visuals are MDX files in `src/content/visuals`.
- Blog posts are MDX files in `src/content/blog`.
- Resume data lives in `cv.json`.
- Homepage featured work is driven by featured project frontmatter.

## Implementation Priorities

1. Update homepage hero copy.
2. Rename visible "Projects" language to "Case Studies" where it improves positioning.
3. Add a Figma/Payload placeholder MDX project when content is ready.
4. Add lightweight route aliases only if they do not disrupt existing URLs.
5. Update metadata and project descriptions.

## Constraints

- Keep existing routes working.
- Avoid broad component rewrites.
- Preserve the current visual system unless a change directly improves clarity.
- Do not introduce a new CMS or backend.
- Run `pnpm build` before shipping.
