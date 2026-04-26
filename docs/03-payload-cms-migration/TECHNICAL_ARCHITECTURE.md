# Technical Architecture

## Goal

Define the future technical direction for a Payload-powered portfolio without committing prematurely.

## Current Baseline

- Astro 5 site
- MDX content collections
- Static project, visual, and blog routes
- Resume content in `cv.json`
- Netlify deployment

## Future Architecture Questions

The migration should decide:

- Whether Payload lives in the same repo or a separate repo.
- Whether the frontend stays Astro or moves to a framework that better fits Payload preview workflows.
- How media is stored and transformed.
- How drafts and previews are authenticated.
- How route compatibility is preserved.

## Recommended Default

Keep the public site stable while testing Payload in a separate branch or prototype. Migrate only when the editorial workflow is clearly better than MDX.

## Architecture Principles

- Preserve SEO and existing URLs.
- Keep publishing workflow simple.
- Avoid runtime complexity on pages that can stay static.
- Use structured content for case studies, writing, lab entries, visual archive items, and videos.
- Keep future expansion possible without modeling every imagined feature on day one.
