# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/resume website built with Astro 5. Uses a JSON Resume schema (`cv.json`) as the single source of truth for all resume data.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Type-check and build for production
pnpm preview    # Preview production build locally
```

## Architecture

**Data-Driven Resume**: All resume content lives in `cv.json` following the [JSON Resume schema](https://jsonresume.org/schema/). Components import data via the `@cv` alias (defined in tsconfig.json).

**Path Aliases**:
- `@cv` → `./cv.json` (resume data)
- `@/*` → `src/*` (source files)

**Key Directories**:
- `src/layouts/` - Page layouts (Layout.astro is the main wrapper)
- `src/components/sections/` - Resume sections (Hero, About, Skills, Experience, Education, Projects)
- `src/icons/` - SVG icon components for skills and social links
- `src/components/svelte/` - Svelte components for interactive features

**Integrations**: Astro + Svelte + MDX. Svelte components use Svelte 5 with runes syntax.

**Type Definitions**: `src/cv.d.ts` contains TypeScript interfaces for the CV JSON structure.

## Design System - Saul Bass Inspired

**Visual Style**: Bold, geometric, high-contrast design inspired by Saul Bass film posters. Uses strong typography, clean lines, and purposeful animations.

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
- Staggered delays using CSS custom properties: `animation-delay: calc(var(--i) * 0.03s)`
- Hover states: translateY(-2px) lift, background/color inversion, scale on icons

**Component Styles**:
- Buttons/Links: 2px solid border, transparent bg, invert on hover
- Skills badges: border style, uppercase, staggered load animation
- Cards: border frames with offset accent border (::before pseudo-element)
- Images: grayscale filter that removes on hover

**Layout**:
- Max-width: 1100px for content sections
- Responsive breakpoint: 700px
- Section padding: 2rem inline (1rem on mobile)
- Global styles in Layout.astro - check here first for alignment issues

**Interactive Elements**:
- Theme toggle persists to localStorage
- Keyboard shortcuts menu (Cmd/Ctrl + K)
- Hover animations on all interactive elements
