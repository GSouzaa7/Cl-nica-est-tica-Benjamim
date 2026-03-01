const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/dark:text-slate-900 dark:text-white/g, 'dark:text-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
