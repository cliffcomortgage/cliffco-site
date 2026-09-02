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
  // Vercel adapter only for production — GitHub Pages preview uses static output
  ...(isPages ? {} : { adapter: vercel() }),
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
    // --- Legacy WordPress URL map (from cliffco_sitemap_urls old.xlsx, validated against built routes) ---
    '/about-us/': '/about/',
    '/abroder/': '/loan-officers/adam-broder/',
    '/acarver/': '/loan-officers/andrea-carver/',
    '/accessibility-statement/': '/legal/accessibility/',
    '/affordability-calculator/': '/mortgage-guides/calculators/affordability/',
    '/all-open-positions/': '/careers/',
    '/astreet/': '/loan-officers/angelique-street/',
    '/azervas/': '/loan-officers/anastasios-zervas/',
    '/bkenney/': '/loan-officers/brandon-kenney/',
    '/blog/': '/mortgage-guides/blog/',
    '/bmcclarnon/': '/loan-officers/',
    '/ccpa/': '/legal/ccpa/',
    '/cnguyen/': '/loan-officers/christian-nguyen/',
    '/condos-co-ops-condotels/': '/loans/condos-co-ops-condotels/',
    '/contact-us/': '/contact/',
    '/conventional-loans/': '/loans/conventional/',
    '/csoto/': '/loan-officers/christian-soto/',
    '/debbecke/': '/loan-officers/daniel-ebbecke/',
    '/dfallarino/': '/loan-officers/david-fallarino/',
    '/dfeliciano/': '/loan-officers/daphne-feliciano/',
    '/dhemberger/': '/loan-officers/donna-hemberger/',
    '/dillouz/': '/loan-officers/david-illouz/',
    '/dmizrahi/': '/loan-officers/david-mizrahi/',
    '/down-payment-assistance-programs/': '/mortgage-guides/down-payment-assistance-programs/',
    '/dscr-loans-real-estate-investors-guide/': '/mortgage-guides/dscr-loan-guide/',
    '/dscr-loans-real-estate-investors/': '/dscr-loans-demystified/',
    '/mortgage-guides/blog/dscr-loans-real-estate-investors/': '/mortgage-guides/blog/how-dscr-loans-work/',
    '/mortgage-guides/dscr-loans-real-estate-investors-guide/': '/mortgage-guides/dscr-loan-guide/',
    '/ecordeira/': '/loan-officers/emily-cordeira/',
    '/eestinvil/': '/loan-officers/emmanuel-estinvil/',
    '/emorais/': '/loan-officers/edward-morais/',
    '/emueller/': '/loan-officers/eric-mueller/',
    '/falosa/': '/loan-officers/fabrizio-alosa/',
    '/faqs/': '/mortgage-rates/',
    '/fha-loans/': '/loans/fha/',
    '/find-a-branch/': '/locations/',
    '/find-a-loan-officer/': '/loan-officers/',
    '/first-time-homebuyers/': '/first-time-homebuyer/',
    '/fort-lauderdale-fl/': '/locations/florida/fort-lauderdale/',
    '/fveras/': '/loan-officers/',
    '/loan-officers/francisco-veras/': '/loan-officers/',
    '/gdiamantakis/': '/loan-officers/george-diamantakis/',
    '/gjohansen/': '/loan-officers/gary-johansen/',
    '/glai/': '/loan-officers/',
    '/home/': '/',
    '/investors/': '/real-estate-investor-mortgage/',
    '/jamaica-ny/': '/locations/new-york/',
    '/jamaya/': '/loan-officers/johana-amaya/',
    '/jborrero/': '/loan-officers/joshua-borrero/',
    '/jbrenner/': '/loan-officers/joshua-brenner/',
    '/jchen/': '/loan-officers/james-chen/',
    '/jcordeira/': '/loan-officers/joseph-cordeira/',
    '/jgiaquinto/': '/loan-officers/',
    '/loan-officers/julian-giaquinto/': '/loan-officers/',
    '/team-giaquinto/': '/loan-officers/',
    '/wantagh-ny/': '/locations/new-york/long-island/',
    '/scottsdale-az/': '/buckeye-az/',
    '/locations/new-york/queens/': '/locations/new-york/',
    '/locations/florida/orlando/': '/locations/florida/',
    '/jhu/': '/loan-officers/justin-hu/',
    '/jperrone/': '/loan-officers/james-perrone/',
    '/jzucker/': '/loan-officers/jeannette-zucker/',
    '/kadler/': '/loan-officers/kathie-adler/',
    '/karabian/': '/loan-officers/kyle-arabian/',
    '/kcruz/': '/loan-officers/',
    '/loan-officers/keyla-cruz/': '/loan-officers/',
    '/kdaniel/': '/loan-officers/kendra-daniel/',
    '/kscott/': '/loan-officers/kevan-scott/',
    '/larisa-zambelli/': '/loan-officers/larisa-zambelli/',
    '/lauren-zambelli/': '/loan-officers/lauren-zambelli/',
    '/lhartman/': '/loan-officers/lisa-hartman/',
    '/lhoren/': '/loan-officers/lee-horen/',
    '/lisa-zambelli/': '/loan-officers/lisa-zambelli/',
    '/llevy/': '/loan-officers/logan-levy/',
    '/margenzio/': '/loan-officers/mario-argenzio/',
    '/maziz/': '/loan-officers/michael-aziz/',
    '/mbisbee/': '/loan-officers/michael-bisbee/',
    '/mortgage-glossary/': '/mortgage-guides/glossary/',
    '/mpatterson/': '/loan-officers/mitchell-patterson/',
    '/myoussef/': '/loan-officers/moses-youssef/',
    '/ngeyer/': '/loan-officers/',
    '/loan-officers/nadia-geyer/': '/loan-officers/',
    '/non-qm-loans/': '/loans/non-qm-self-employed/',
    '/non-qm-loans-guide/': '/mortgage-guides/non-qm-loans-guide/',
    '/non-qm-mortgage-self-employed/': '/mortgage-guides/non-qm-mortgage-self-employed/',
    '/orlando-fl/': '/locations/florida/',
    '/pmontesano/': '/loan-officers/paul-montesano/',
    '/privacy-policy/': '/legal/privacy/',
    '/products/': '/loans/',
    '/purchase-clients/': '/purchasing-refinancing/',
    '/qduong/': '/loan-officers/queeny-duong/',
    '/rappo/': '/loan-officers/renald-appo/',
    '/refinancing/': '/loans/refinancing/',
    '/renovation-loan/': '/loans/renovation/',
    '/reverse-mortgage-guide/': '/mortgage-guides/reverse-mortgage-guide/',
    '/reverse-mortgages/': '/reverse-mortgage/',
    '/rgarcia/': '/loan-officers/raymond-garcia/',
    '/rriddle/': '/loan-officers/ryan-riddle/',
    '/rrojas/': '/loan-officers/rafael-rojas/',
    '/self-employed/': '/self-employed-mortgage/',
    '/seniors/': '/reverse-mortgage/',
    '/shasib/': '/loan-officers/',
    '/loan-officers/syed-hasib/': '/loan-officers/',
    '/skhan/': '/loan-officers/shahraj-khan/',
    '/slazo/': '/loan-officers/steve-lazo/',
    '/small-business/': '/self-employed-mortgage/',
    '/srivera/': '/loan-officers/steven-rivera/',
    '/twhalen/': '/loan-officers/thomas-whalen/',
    '/twilliamson/': '/loan-officers/tamara-williamson/',
    '/usda-loans/': '/loans/usda/',
    '/va-loans/': '/loans/va/',
    '/what-is-an-investment-mortgage/': '/mortgage-guides/what-is-an-investment-mortgage/',
    '/wromero/': '/loan-officers/',
    '/loan-officers/wenceslao-romero/': '/loan-officers/',
    '/team-veras/': '/locations/florida/',
    '/buydown-calculator/': '/mortgage-guides/calculators/buydown/',
    '/closing-costs/': '/mortgage-guides/calculators/closing-costs/',
    '/jmarrero/': '/loan-officers/',
    // Old audience landing pages with no direct equivalent - nearest match
    '/service-members/': '/loans/va/',
    '/rural-residents/': '/loans/usda/',
    '/freelance/': '/mortgages-for-freelancers-entrepreneurs-investors/',
    '/non-us-citizens/': '/loans/itin-mortgage/',
    '/tech/': '/complex-income-mortgage-solutions/',
    '/salon/': '/self-employed-mortgage/',
    '/trade-workers/': '/self-employed-mortgage/',
    '/real-estate-agents/': '/self-employed-mortgage/',
    '/healthcare-professionals/': '/purchasing-refinancing/',
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },

  integrations: [
    // nj-22k-grant is an ads-only landing page, deliberately excluded here
    // and noindexed - reached only via paid ads, never linked from the site.
    sitemap({ filter: (page) => !page.includes('/thank-you/') && !page.includes('/nj-22k-grant/') && !page.includes('/dashboard') }),
    // API routes must be serverless functions on Vercel (POST handlers) but
    // prerendered stubs on the static GitHub Pages preview. This is set here,
    // not via a `prerender` export in the route files, because Astro can only
    // statically analyze literal booleans — an env-var expression silently
    // falls back to prerender=true and the deployed endpoints 405 every POST.
    {
      name: 'api-prerender-per-target',
      hooks: {
        'astro:route:setup': ({ route }) => {
          const c = route.component.replace(/\\/g, '/');
          // API routes and the SSR dashboard: server-rendered on Vercel,
          // prerendered stub on the static GitHub Pages preview.
          if (c.includes('/pages/api/') || c.includes('/pages/dashboard')) {
            route.prerender = isPages;
          }
        },
      },
    },
    // IndexNow: notify Bing/Yandex (and, downstream, ChatGPT/Copilot search) of
    // the site's URLs after a production build. Opt-in via INDEXNOW_SUBMIT=true
    // so it stays dormant until the site is live on cliffcomortgage.com and the
    // key file is served there. Non-fatal.
    {
      name: 'indexnow-submit',
      hooks: {
        'astro:build:done': async ({ pages, logger }) => {
          if (isPages || process.env.INDEXNOW_SUBMIT !== 'true') return;
          const KEY = 'b8e4d1a9c7f2436e8a05d3c9f1e6072b';
          const base = 'https://cliffcomortgage.com';
          const urlList = pages.map((p) => `${base}/${p.pathname}`.replace(/(?<!:)\/{2,}/g, '/'));
          try {
            const res = await fetch('https://api.indexnow.org/indexnow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({ host: 'cliffcomortgage.com', key: KEY, keyLocation: `${base}/${KEY}.txt`, urlList }),
            });
            logger.info(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
          } catch (err) {
            logger.warn(`IndexNow submit failed (non-fatal): ${err}`);
          }
        },
      },
    },
  ],

  build: {
    inlineStylesheets: 'auto',
  },
});