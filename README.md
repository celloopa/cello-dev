# cello.dev

Personal portfolio website built with Astro 5.

## Features

- **Resume** - Data-driven from JSON Resume schema (`cv.json`)
- **Projects** - Development work with case studies and media galleries
- **Visuals** - Creative portfolio (design, photography, motion)
- **Blog** - MDX-powered posts with draft support
- **Dark/Light Theme** - Persists to localStorage
- **Keyboard Shortcuts** - Quick navigation (Cmd/Ctrl + K)

## Tech Stack

- [Astro 5](https://astro.build/) - Static site generator
- [Svelte 5](https://svelte.dev/) - Interactive components
- [MDX](https://mdxjs.com/) - Rich content with components
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Design

Saul Bass-inspired visual style with bold typography, geometric shapes, and high-contrast colors. Smooth animations using `cubic-bezier(0.16, 1, 0.3, 1)` easing.

## Development

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Type-check and build for production
pnpm preview    # Preview production build
```

## Content

Content lives in `src/content/` as MDX files:

```
src/content/
├── blog/        # Blog posts
├── projects/    # Development projects
└── visuals/     # Creative work
```

Resume data is in `cv.json` following the [JSON Resume schema](https://jsonresume.org/schema/).

## Credits

- JSON Resume schema from [jsonresume.org](https://jsonresume.org/schema/)
- Initial concept inspired by [Bartosz Jarocki](https://github.com/BartoszJarocki/cv) & [Midudev](https://github.com/midudev)

## License

MIT
