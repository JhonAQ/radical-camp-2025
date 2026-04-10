
const fs = require('fs');
const path = './app/chanchito/UserChanchito.tsx';
let code = fs.readFileSync(path, 'utf8');
const splitIdx = code.indexOf('export default function ChanchitoPage(');
if (splitIdx > -1) {
  code = code.substring(0, splitIdx);
  const newPart = fs.readFileSync('./scripts/new-part.txt', 'utf8');
  fs.writeFileSync(path, code + newPart, 'utf8');
  console.log('patched');
} else {
  console.log('not found');
}

