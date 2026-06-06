import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server', // Enables Server-Side Rendering (SSR)
  adapter: cloudflare(),
  integrations: [react()],
});
