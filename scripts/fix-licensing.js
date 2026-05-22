const fs = require('fs');
const filepath = 'c:/Users/spichoto/cliffco-site/website/src/pages/licensing.astro';
let content = fs.readFileSync(filepath, 'utf8');

const before = content;
// Replace left double curly quote U+201C with straight ASCII double quote
content = content.replace(/“/g, '"');
// Replace right double curly quote U+201D with straight ASCII double quote
content = content.replace(/”/g, '"');

fs.writeFileSync(filepath, content, 'utf8');

const lines = content.split('\n');
console.log('Changed:', before !== content);
console.log('Line 49:', JSON.stringify(lines[48]));
console.log('Line 60:', JSON.stringify(lines[59]));
console.log('Line 67:', JSON.stringify(lines[66]));
