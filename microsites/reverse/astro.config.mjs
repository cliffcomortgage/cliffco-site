import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  site: 'https://cliffco-reverse-microsite.vercel.app',
  trailingSlash: 'always',
  redirects: {
    '/': '/long-island/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
