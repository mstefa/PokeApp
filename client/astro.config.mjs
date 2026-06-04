import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // Enables Server-Side Rendering (SSR)
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
});
