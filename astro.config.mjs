// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://uu-memo.github.io',
  server: {
    host: true, // Listen on all addresses, including LAN and public addresses
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});