# Migration Plan

## Goal

Move from static Astro content collections to Payload only after the content-first portfolio direction is proven.

## Phase 0: Prepare

- Finish homepage repositioning.
- Confirm case study template.
- Publish or draft Figma/Payload placeholder.
- Inventory current projects, visuals, and blog posts.

## Phase 1: Model

- Define Payload collections and globals.
- Decide URL preservation strategy.
- Map current MDX fields to CMS fields.
- Define media migration requirements.

## Phase 2: Build

- Add Payload architecture.
- Add collections and globals.
- Add preview support.
- Create migration scripts only after field mapping is stable.

## Phase 3: Migrate

- Import current projects.
- Import visuals.
- Import writing.
- Import media references.
- Validate slugs and metadata.

## Phase 4: Verify

- Compare old and new routes.
- Check social previews.
- Check draft/preview workflow.
- Run accessibility and performance pass.
- Run production build.

## Non-Goals

- Do not redesign the entire visual system as part of the migration.
- Do not add complex permissions before there is a real workflow need.
- Do not block current content improvements on CMS decisions.
