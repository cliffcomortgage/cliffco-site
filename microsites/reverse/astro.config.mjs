import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  site: 'https://cliffco-reverse-microsite.vercel.app',
  trailingSlash: 'always',
  redirects: {
    '/': '/long-island/',
    // Pages removed when Julian Giaquinto was offboarded (2026-07)
    '/meet-julian/': '/long-island/',
    '/client-reviews/': '/long-island/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
