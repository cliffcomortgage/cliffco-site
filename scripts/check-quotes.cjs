const fs = require('fs');
const content = fs.readFileSync('c:/Users/spichoto/cliffco-site/website/src/pages/locations/new-york/long-island/index.astro', 'utf8');
const lines = content.split('\n');
[17, 19, 20, 60, 168].forEach(n => {
  const line = lines[n-1] || '';
  let curlyPositions = [];
  for (let i = 0; i < line.length; i++) {
    const c = line.charCodeAt(i);
    if (c === 0x201C || c === 0x201D || c === 0x22) {
      curlyPositions.push({pos: i, char: 'U+' + c.toString(16).toUpperCase()});
    }
  }
  // Show first 120 chars of line
  console.log('Line ' + n + ':', line.substring(0, 120));
  // Show any suspicious quote chars
  curlyPositions.slice(0, 10).forEach(p => {
    if (p.char !== 'U+22' || (line[p.pos-1] === '"' || line[p.pos+1] === '"')) {
      console.log('  Char at pos', p.pos, ':', p.char);
    }
  });
});
