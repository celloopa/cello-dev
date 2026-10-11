import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte'
import resumeSync from './src/integrations/resumeSync';

export default defineConfig({
        integrations: [mdx(), svelte({ preprocess: [] }), resumeSync()]
});
