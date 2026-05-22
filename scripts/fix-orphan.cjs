const fs = require('fs');
const file = 'c:/Users/spichoto/cliffco-site/website/src/pages/locations/florida/index.astro';
const lines = fs.readFileSync(file, 'utf8').split('\n');
// Find and remove the orphan </section> line (line 49, index 48)
const filtered = lines.filter((line, i) => {
  // Remove a line that is ONLY "  </section>" if the previous non-empty line was also "  </section>"
  if (line.trim() === '</section>') {
    // look backwards for previous non-empty line
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() !== '') {
        if (lines[j].trim() === '</section>') {
          return false; // this is a duplicate, remove it
        }
        break;
      }
    }
  }
  return true;
});
fs.writeFileSync(file, filtered.join('\n'), 'utf8');
console.log('Lines before:', lines.length, 'after:', filtered.length);
// Show context
filtered.slice(43, 53).forEach((l, i) => console.log(i+44, JSON.stringify(l)));
