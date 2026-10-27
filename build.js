// Builds the single self-contained game file: mythbound.html
// Usage: node build.js
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'src');
const parts = fs.readdirSync(src).filter(f => /^\d\d_.*\.js$/.test(f)).sort();
const js = parts.map(f => `// ---- ${f} ----\n` + fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
const shell = fs.readFileSync(path.join(src, 'shell.html'), 'utf8');
const out = shell.replace('/*__GAME_JS__*/', () => js);
fs.writeFileSync(path.join(__dirname, 'mythbound.html'), out);
console.log(`Built mythbound.html (${(out.length / 1024).toFixed(1)} KB) from ${parts.length} source files.`);
