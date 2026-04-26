# Navigation Update

## Goal

Make the site navigation read like a product design portfolio while preserving existing routes.

## Preferred Navigation

- Case Studies
- Lab
- Writing
- Visual Archive
- About
- Resume

## Current Route Mapping

- Case Studies can initially map to `/projects`.
- Writing can map to `/blog`.
- Visual Archive can map to `/visuals` when content is ready.
- Resume can keep `/resume`.
- Lab may need a new static route later.

## First Implementation Pass

Use the least disruptive route changes:

- Keep `/projects` active.
- Update labels before changing route slugs.
- Consider adding `/case-studies` as a redirect or listing route later.

## Acceptance Criteria

- The primary navigation makes the product-design portfolio structure obvious.
- Existing project URLs continue to work.
- Hidden WIP sections remain hidden until content is ready.
