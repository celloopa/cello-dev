# Payload Collections

## Goal

Translate the CMS content model into implementation-ready Payload collection groups.

## P0 Collections

- Case Studies
- Lab Projects
- Writing
- Visual Archive Items
- Media
- Tags
- Tools

## P1 Collections

- Videos
- Projects
- Pages
- Quotes or Testimonials, optional

## Shared Field Patterns

Most publishable collections should include:

- `title`
- `slug`
- `summary` or `excerpt`
- `status`
- `featured`
- `coverImage` or `heroImage`
- `tags`
- `seoTitle`
- `seoDescription`
- `ogImage`
- `publishedAt`
- `_status`

## Relationship Rules

- Case studies can relate to lab projects, writing, videos, tools, tags, and repositories.
- Lab projects can relate to case studies, videos, writing, tools, and tags.
- Writing can relate to case studies, lab projects, tools, and tags.
- Visual archive items should stay connected to craft categories without becoming the main product portfolio.

## Implementation Note

Start with the minimum collections needed to migrate current content. Add advanced relationships only after the editorial workflow is proven.
