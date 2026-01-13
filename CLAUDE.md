# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Astro 5. Features a resume page driven by JSON Resume schema, plus content collections for projects, visuals, and blog posts. Deploys automatically on Netlify.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Type-check and build for production
pnpm preview    # Preview production build locally
```

## Site Structure

**Pages:**
- `/` - Homepage with hero, about, skills, experience, education
- `/resume` - Full resume page
- `/projects` - Project listing → `/projects/[slug]` for details
- `/visuals` - Visual work listing → `/visuals/[slug]` for details
- `/blog` - Blog listing → `/blog/[slug]` for posts
- `/color-scheme` - Color scheme generator tool
- `/watchlist` - Movie watchlist (WIP)

## Architecture

**Content Collections** (`src/content/`):
- `projects/` - Development projects (MDX with techStack, highlights, media galleries)
- `visuals/` - Creative work (MDX with category, tags, media galleries)
- `blog/` - Blog posts (MDX with publishDate, tags, draft support)

Collection schemas defined in `src/content.config.ts` using Zod validation.

**Data-Driven Resume**: Resume content lives in `cv.json` following the [JSON Resume schema](https://jsonresume.org/schema/). Components import via `@cv` alias.

**Path Aliases** (tsconfig.json):
- `@cv` → `./cv.json` (resume data)
- `@/*` → `src/*` (source files)

**Key Directories:**
- `src/layouts/` - Layout.astro (main wrapper)
- `src/components/sections/` - Resume sections (Hero, About, Skills, Experience, Education)
- `src/components/` - Reusable components (ProjectCard, VisualsCard, BlogCard, Section)
- `src/components/media/` - Media gallery components (MediaFull, MediaTwo, MediaThree)
- `src/components/svelte/` - Svelte interactive components
- `src/icons/` - SVG icon components
- `src/styles/` - Global CSS (colors.css)

**Integrations**: Astro + Svelte 5 (runes syntax) + MDX

## Content Collection Schemas

**Projects:**
```yaml
title, description, image?, url?, github?, techStack[], role, highlights[], featured?, order?, media[]?
```

**Visuals:**
```yaml
title, description, category (packaging|graphic|motion|video|photography), image?, tags[]?, featured?, order?, media[]?
```

**Blog:**
```yaml
title, description, publishDate, updatedDate?, image?, tags[]?, draft?
```

**Media Galleries** (used in projects/visuals):
```yaml
media:
  - layout: full | two | three
    items:
      - src: /path/to/image.jpg
        alt: Description
        caption: Optional caption
```

## Design System - Saul Bass Inspired

**Visual Style**: Bold, geometric, high-contrast design inspired by Saul Bass film posters. Strong typography, clean lines, purposeful animations.

**Color Palette** (`src/styles/colors.css`):
- `--color-night`: #0a0f1f (dark background)
- `--color-snow`: #f0f4f8 (light background)
- `--color-forest`: #228B22 (primary accent)
- `--color-sunset`: #FF6B35 (secondary accent)
- Theme-aware via `data-theme="dark"` or `data-theme="light"` on `<html>`

**Typography**:
- Section titles: uppercase, letter-spacing 0.05em, accent color
- Body text: clean, readable with good line-height
- Hero name: large clamp() sizing for responsiveness

**Animation Patterns**:
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for smooth, snappy feel
- Entry animations: slideUp, slideLeft, slideRight with opacity fade
- Staggered delays: `animation-delay: calc(var(--i) * 0.03s)`
- Hover states: translateY(-2px) lift, background/color inversion, scale on icons

**Component Styles**:
- Cards: 3px solid border, accent sweep on hover (::before pseudo-element)
- Buttons/Links: 2px solid border, transparent bg, invert on hover
- Badges: border style, uppercase, staggered load animation
- Images: grayscale(20%) filter that clears on hover

**Layout**:
- Max-width: 1100px for content sections
- Responsive breakpoint: 700px
- Section padding: 2rem inline (1rem on mobile)
- Global styles in Layout.astro

**Interactive Elements**:
- Theme toggle persists to localStorage
- Keyboard shortcuts menu (Cmd/Ctrl + K)
- Hover animations on all interactive elements

## Adding Content

**New Blog Post:**
1. Create `src/content/blog/your-post.mdx`
2. Add frontmatter: title, description, publishDate, tags, draft
3. Push to git → Netlify auto-deploys

**New Project:**
1. Create `src/content/projects/your-project.mdx`
2. Add frontmatter with techStack, role, highlights
3. Optional: add media galleries for images/videos

**New Visual:**
1. Create `src/content/visuals/your-visual.mdx`
2. Add frontmatter with category, tags
3. Add media galleries for portfolio pieces
