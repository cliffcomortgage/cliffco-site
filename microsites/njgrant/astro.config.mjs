// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Domain not registered yet — placeholder until Rafe picks/registers one.
// Deploys to a Vercel preview URL in the meantime.
export default defineConfig({
  adapter: vercel(),
  site: 'https://njfirstgenhomebuyer.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
