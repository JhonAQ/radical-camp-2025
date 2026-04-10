
const fs = require('fs');
const files = ['./app/chanchito/page.tsx', './app/chanchito/UserChanchito.tsx', './lib/chanchito.ts'];
for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/@'?\s*$/g, '');
  c = c.replace(/^@\s*/g, '');
  fs.writeFileSync(file, c, 'utf8');
}
console.log('cleaned');

