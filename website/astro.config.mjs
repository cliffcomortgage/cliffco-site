// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Deploy targets:
//  - DEPLOY_TARGET=pages → GitHub Pages preview at rafetangorra-tech.github.io/cliffco-site
//  - default            → production site at cliffcomortgage.com
const isPages = process.env.DEPLOY_TARGET === 'pages';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  site: isPages
    ? 'https://rafetangorra-tech.github.io'
    : 'https://cliffcomortgage.com',
  base: isPages ? '/cliffco-site' : '/',
  trailingSlash: 'always',
  redirects: {
    '/loans/fix-and-flip/': '/loans/business-bank-statement/',
    '/loan-officers/richard-alvarez/': '/loan-officers/',
    '/loan-officers/ralvarez/': '/loan-officers/',
    '/loan-officers/jose-cruz/': '/loan-officers/',
    '/loan-officers/jcruz/': '/loan-officers/',
    '/loan-officers/julia-jorge/': '/loan-officers/',
    '/loan-officers/jjorge/': '/loan-officers/',
    '/loan-officers/julia-jorge-delcarmen/': '/loan-officers/',
    '/loan-officers/adam-turkewitz/': '/loan-officers/',
    '/loan-officers/aturkewitz/': '/loan-officers/',
    '/loan-officers/samantha-roach/': '/loan-officers/',
    '/loan-officers/sroach/': '/loan-officers/',
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },

  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },
});