# agents.md

Agent-specific guidance for working on this Astro portfolio codebase.

## Quick Reference

**Dev server**: `pnpm dev` (usually port 4321)
**Build**: `pnpm build`
**Preview**: `pnpm preview`

## Common Tasks

### Adding Styles to a Page

Astro uses scoped `<style>` blocks. For global styles affecting child components, use `:global()`:

```css
.parent :global(.child-class) {
  /* styles applied to child component */
}
```

### Breakout/Full-Width Sections

To make content extend beyond the 1100px container:

```css
.breakout {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding-inline: max(2rem, calc((100vw - 1500px) / 2));
}
```

### Staggered Animations

Pass index to components and use CSS custom property:

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
- `var(--color-background)` - adapts to light/dark
- `var(--color-text)` - adapts to light/dark
- `var(--color-accent)` - primary accent color

### Hiding WIP Content

Comment out imports and JSX, add note:
```astro
// import Component from "./Component.astro"; // Hidden until content is ready
{/* Section hidden until content is ready */}
```

### Dynamic OG/Social Preview Images

Content pages can pass frontmatter to Layout for dynamic social previews:

```astro
<Layout
  title={`${title} - Marcelo Rondon`}
  description={description}
  image={image}
>
```

- `image` should be the path from frontmatter (e.g., `/images/projects/my-project.png`)
- Falls back to `/images/thumbnail.png` if not provided
- Layout constructs full URL using `basics.url` from cv.json

## File Patterns

### New Component
1. Create in `src/components/`
2. Use TypeScript interface for Props
3. Add scoped styles at bottom
4. Import `@/styles/colors.css` if using theme variables

### New Page
1. Create in `src/pages/`
2. Import Layout from `@/layouts/Layout.astro`
3. Pass title prop to Layout

### Content Collection Entry
1. Create `.mdx` file in appropriate `src/content/` subfolder
2. Add required frontmatter fields per schema in `src/content.config.ts`
3. Use media gallery components for images

## Animation Conventions

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Entry animations: 0.5-0.8s duration
- Hover transitions: 0.3s duration
- Stagger delay: 0.03s-0.1s per item

## Responsive Breakpoints

- `700px` - Mobile breakpoint (single column, simplified layout)
- `900px` - Tablet breakpoint (intermediate adjustments)

## Testing Changes

1. Run dev server: `pnpm dev`
2. Check multiple viewport widths (mobile, tablet, desktop)
3. Test both light and dark themes
4. Verify animations play correctly on page load
5. Run build before committing: `pnpm build`
