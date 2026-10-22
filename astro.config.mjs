import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte'
import resumeSync from './src/integrations/resumeSync';

export default defineConfig({
	// Astro 7 defaults to 'jsx', which drops spaces between inline elements
	// (e.g. the resume contact line). Keep the Astro 5 whitespace behavior.
	compressHTML: true,
        integrations: [mdx(), svelte({ preprocess: [] }), resumeSync()],
        vite: {
                build: {
                        // The scene renderer chunk is three.js (~520 kB min, ~133 kB gz). It's a dynamic
                        // import that loads after paint, only when the 3D gate allows it, so the default
                        // 500 kB warning doesn't apply to it. Anything bigger still warns.
                        chunkSizeWarningLimit: 600,
                },
        },
});
