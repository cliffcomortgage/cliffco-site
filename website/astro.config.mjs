// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// Deploy targets:
//  - DEPLOY_TARGET=pages → GitHub Pages preview at rafetangorra-tech.github.io/cliffco-site
//  - default            → production site at cliffcomortgage.com
const isPages = process.env.DEPLOY_TARGET === 'pages';

// https://astro.build/config
export default defineConfig({
  site: isPages
    ? 'https://rafetangorra-tech.github.io'
    : 'https://cliffcomortgage.com',
  base: isPages ? '/cliffco-site' : '/',
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },
});