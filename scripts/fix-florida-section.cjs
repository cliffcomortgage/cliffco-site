const fs = require('fs');
const file = 'c:/Users/spichoto/cliffco-site/website/src/pages/locations/florida/index.astro';
let c = fs.readFileSync(file, 'utf8');
// Remove the two blank lines + orphaned </section> between lines 46 and 51
c = c.replace('\n\n\n  </section>\n\n  <section', '\n\n  <section');
fs.writeFileSync(file, c, 'utf8');
console.log('done');
