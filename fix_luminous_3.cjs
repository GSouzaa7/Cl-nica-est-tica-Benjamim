const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// NavItem
content = content.replace(
  /\? \(isDarkMode \? 'bg-\[#1c0d04\] text-orange-500 border border-\[#431c09\]' : 'bg-orange-50 text-orange-600 border border-orange-100'\)/g,
  "? 'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-white/[0.04] dark:text-orange-400 dark:border-white/10'"
);

content = content.replace(
  /: \(isDarkMode \? 'text-slate-500 hover:bg-zinc-800\/50 hover:text-zinc-200 border border-transparent' : 'text-slate-600 hover:bg-zinc-100 hover:text-slate-900 border border-transparent'\)/g,
  ": 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent dark:text-neutral-400 dark:hover:bg-white/[0.04] dark:hover:text-white dark:border-transparent transition-all duration-300'"
);

// SettingsNavItem
content = content.replace(
  /\? \(isDarkMode \? 'bg-\[#1c0d04\] border-\[#431c09\]' : 'bg-orange-50 border-orange-100'\)/g,
  "? 'bg-orange-50 border-orange-100 dark:bg-white/[0.04] dark:border-white/10'"
);

content = content.replace(
  /: \(isDarkMode \? 'border-transparent hover:bg-zinc-800\/30' : 'border-transparent hover:bg-zinc-100'\)/g,
  ": 'border-transparent hover:bg-slate-100 dark:border-transparent dark:hover:bg-white/[0.04] transition-all duration-300'"
);

content = content.replace(
  /\(isDarkMode \? 'text-zinc-300' : 'text-slate-900'\)/g,
  "'text-slate-900 dark:text-neutral-300'"
);

// LayoutDashboard
content = content.replace(
  /className=\{isDarkMode \? "text-white" : "text-slate-900"\}/g,
  'className="text-slate-900 dark:text-white"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
