# AGENTS.md

Agent-specific guidance for working on this Astro portfolio codebase.

## Portfolio Direction

This website is being repositioned around Cello as a Product Designer focused on design systems, technical prototyping, and design-dev collaboration.

The site should no longer read primarily as a broad designer/developer portfolio. It should read as a focused product design portfolio with technical depth.

## Core Positioning

Cello is a product designer who bridges design and engineering through thoughtful prototyping, systems thinking, and clear product storytelling.

Short version:

Product Designer focused on design systems, technical prototyping, and design-dev collaboration.

## What The Website Should Prove

The website should show that Cello can:

- Understand user needs
- Define product problems
- Design product experiences
- Build or prototype realistic solutions
- Think in systems
- Communicate with designers, developers, PMs, and stakeholders
- Use technical knowledge to make design work more buildable
- Tell clear stories through case studies, videos, and writing

## Primary Audience

The primary audience is hiring managers, recruiters, product design leads, design systems teams, design tools teams, developer tools teams, SaaS teams, and e-commerce product teams.

## Desired Roles

The website should support applications for:

- Product Designer
- UX/UI Product Designer
- Design Systems Designer
- Technical Product Designer
- Frontend-capable Product Designer
- Product Designer for design tools
- Product Designer for developer tools
- Product Designer for CMS/admin/e-commerce tools

## Tone

Use language that is:

- Clear
- Thoughtful
- Product-focused
- Technical but human
- Confident without sounding inflated
- Specific instead of buzzword-heavy

## Avoid

Avoid positioning Cello as:

- Just a frontend developer
- Just a visual designer
- Just a WordPress person
- A generic UX generalist
- A jack-of-all-trades without focus

## Prefer

Prefer positioning Cello as:

- A product designer with technical fluency
- A designer who understands implementation
- A systems thinker
- A strong communicator between design and development
- A designer who prototypes to reduce ambiguity

## Website Priorities

1. Homepage clarity
2. Case-study-first portfolio structure
3. Flagship Figma/Payload case study
4. Supporting case studies around systems, workflows, and automation
5. Lab/experiments section
6. Visual archive
7. Writing/content section
8. About/resume alignment

## Implementation Principles

- Use semantic HTML.
- Prioritize accessibility.
- Keep layouts responsive.
- Avoid unnecessary client-side JavaScript.
- Make future case studies easy to add.
- Keep content structured and reusable.
- Use strong metadata for SEO and sharing.
- Optimize images and embeds.
- Do not start the Payload migration until the current site positioning and case-study structure are clearer.

## Current Site Facts

This is a personal portfolio website built with Astro 5. It has a resume page driven by `cv.json`, plus content collections for projects, visuals, and blog posts.

Current routes include:

- `/` - Homepage with hero, proof points, and featured projects
- `/resume` - Resume page
- `/projects` - Project listing
- `/projects/[slug]` - Project detail pages
- `/visuals` and `/visuals/[slug]` - Visual archive routes, currently treated as WIP
- `/blog` and `/blog/[slug]` - Writing routes
- `/color-scheme` - Color scheme generator
- `/watchlist` - WIP movie watchlist

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm astro
pnpm sync-projects
```

Use `pnpm build` before shipping implementation changes.

## Content Collections

Collection schemas are defined in `src/content.config.ts`.

Projects use:

```yaml
title
description
image?
ogImage?
url?
github?
techStack[]
role
highlights[]
featured?
order?
media[]?
```

Visuals use:

```yaml
title
description
category
image?
tags[]?
featured?
order?
media[]?
```

Blog posts use:

```yaml
title
description
publishDate
updatedDate?
image?
tags[]?
draft?
```

## Common Tasks

### Adding Styles To A Page

Astro uses scoped `<style>` blocks. For global styles affecting child components, use `:global()`.

```css
.parent :global(.child-class) {
  /* styles applied to child component */
}
```

### Breakout Sections

To make content extend beyond the 1100px container:

```css
.breakout {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding-inline: max(2rem, calc((100vw - 1500px) / 2));
}
```

### Staggered Animations

Pass index to components and use a CSS custom property:

```astro
{items.map((item, i) => <Card index={i} />)}
```

```css
.card {
  animation-delay: calc(var(--i) * 0.1s);
}
```

### Theme-Aware Styles

Use CSS variables from `src/styles/colors.css`:

- `var(--color-background)`
- `var(--color-text)`
- `var(--color-accent)`

### Hiding WIP Content

Comment out imports and JSX, and leave a note:

```astro
// import Component from "./Component.astro"; // Hidden until content is ready
{/* Section hidden until content is ready */}
```

### Dynamic OG Images

Content pages can pass frontmatter to `Layout` for dynamic social previews:

```astro
<Layout
  title={`${title} - Marcelo Rondon`}
  description={description}
  image={image}
>
```

`image` should be the path from frontmatter, such as `/images/projects/my-project.png`. The layout falls back to `/images/thumbnail.png`.

## File Patterns

### New Component

1. Create in `src/components/`.
2. Use a TypeScript interface for props.
3. Add scoped styles at the bottom.
4. Import `@/styles/colors.css` if using theme variables.

### New Page

1. Create in `src/pages/`.
2. Import `Layout` from `@/layouts/Layout.astro`.
3. Pass a title prop to `Layout`.

### Content Collection Entry

1. Create an `.mdx` file in the appropriate `src/content/` subfolder.
2. Add required frontmatter fields per `src/content.config.ts`.
3. Use media gallery components for images and videos.

## Animation Conventions

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Entry animations: 0.5-0.8s duration
- Hover transitions: 0.3s duration
- Stagger delay: 0.03s-0.1s per item

## Responsive Breakpoints

- `700px` - Mobile breakpoint
- `900px` - Tablet breakpoint

## Testing Changes

1. Run `pnpm dev`.
2. Check mobile, tablet, and desktop viewport widths.
3. Test light and dark themes.
4. Verify animations play correctly on page load.
5. Run `pnpm build` before committing implementation changes.
