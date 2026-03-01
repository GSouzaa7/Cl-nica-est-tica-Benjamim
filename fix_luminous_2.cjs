const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Handle (isDarkMode ? 'dark' : 'light')
content = content.replace(/\(isDarkMode \? '([^']+)' : '([^']+)'\)/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:${c}`).join(' ');
  return `'${lightClass} ${darkClasses}'`;
});

// Handle isDarkMode ? "dark" : "light"
content = content.replace(/isDarkMode \? "([^"]+)" : "([^"]+)"/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:${c}`).join(' ');
  return `"${lightClass} ${darkClasses}"`;
});

// Fix NavItem that was missed
content = content.replace(/'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-\[#1c0d04\] dark:text-orange-500 dark:border-\[#431c09\]'/g,
  "'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-white/[0.04] dark:text-orange-400 dark:border-white/10'");

content = content.replace(/'text-slate-600 hover:bg-zinc-100 hover:text-slate-900 border border-transparent dark:text-slate-500 dark:hover:bg-zinc-800\/50 dark:hover:text-zinc-200 dark:border-transparent'/g,
  "'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent dark:text-neutral-400 dark:hover:bg-white/[0.04] dark:hover:text-white dark:border-transparent transition-all duration-300'");

// Fix SettingsNavItem
content = content.replace(/'bg-orange-50 border-orange-100 dark:bg-\[#1c0d04\] dark:border-\[#431c09\]'/g,
  "'bg-orange-50 border-orange-100 dark:bg-white/[0.04] dark:border-white/10'");

content = content.replace(/'border-transparent hover:bg-zinc-100 dark:border-transparent dark:hover:bg-zinc-800\/30'/g,
  "'border-transparent hover:bg-slate-100 dark:border-transparent dark:hover:bg-white/[0.04] transition-all duration-300'");

content = content.replace(/\(isDarkMode \? 'text-zinc-300' : 'text-slate-900'\)/g, "'text-slate-900 dark:text-neutral-300'");

// Fix any remaining text-zinc-300
content = content.replace(/text-zinc-300/g, 'text-neutral-300');
content = content.replace(/text-zinc-400/g, 'text-neutral-400');
content = content.replace(/text-zinc-500/g, 'text-neutral-500');
content = content.replace(/text-zinc-600/g, 'text-neutral-600');
content = content.replace(/text-zinc-900/g, 'text-slate-900');

// Fix any remaining bg-zinc-800
content = content.replace(/bg-zinc-800/g, 'bg-white/[0.04]');
content = content.replace(/bg-zinc-900/g, 'bg-white/[0.02]');
content = content.replace(/bg-zinc-100/g, 'bg-slate-100');
content = content.replace(/bg-zinc-50/g, 'bg-slate-50');

// Fix borders
content = content.replace(/border-zinc-800/g, 'border-white/10');
content = content.replace(/border-zinc-700/g, 'border-white/20');
content = content.replace(/border-zinc-200/g, 'border-slate-200');

// Fix specific dark mode backgrounds
content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-[#0A0A0A]');

// Fix hover states
content = content.replace(/hover:bg-white\/\[0\.04\]\/50/g, 'hover:bg-white/[0.04]');
content = content.replace(/hover:bg-white\/\[0\.02\]\/30/g, 'hover:bg-white/[0.04]');
content = content.replace(/hover:bg-white\/\[0\.02\]\/20/g, 'hover:bg-white/[0.04]');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
