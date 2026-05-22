const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/spichoto/cliffco-site/website/src';

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(srcDir);
let totalFixed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  // Replace left U+201C and right U+201D double curly quotes with straight ASCII double quote
  const after = before.replace(/[“”]/g, '"');
  if (before !== after) {
    fs.writeFileSync(file, after, 'utf8');
    // Show which lines changed
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');
    for (let i = 0; i < beforeLines.length; i++) {
      if (beforeLines[i] !== afterLines[i]) {
        console.log(file.replace('c:/Users/spichoto/cliffco-site/website/src/', '') + ':' + (i+1) + ': ' + afterLines[i].trim().substring(0, 100));
      }
    }
    totalFixed++;
  }
}

console.log('\nFixed curly quotes in', totalFixed, 'files.');
