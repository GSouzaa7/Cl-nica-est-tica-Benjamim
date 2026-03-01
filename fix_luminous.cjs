const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add 'dark' class to the root div
content = content.replace(
  /<div className=\{`flex h-screen \$\{isDarkMode \? 'bg-\[#050505\] text-zinc-300' : 'bg-zinc-50 text-zinc-900'\} font-sans overflow-hidden selection:bg-orange-500\/30 transition-colors duration-300`\}>/,
  "<div className={`flex h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-hidden selection:bg-orange-500/30 transition-colors duration-300`}>"
);

// Add 'dark' class to LoginScreen root
content = content.replace(
  /<div className=\{`min-h-screen \$\{isDarkMode \? 'bg-\[#050505\]' : 'bg-zinc-50'\} flex flex-col justify-center items-center p-4 selection:bg-orange-500\/30 transition-colors duration-300`\}>/g,
  "<div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-orange-500/30 transition-colors duration-300`}>"
);

// We should replace all occurrences of `isDarkMode ? 'dark-class' : 'light-class'` with `light-class dark:dark-class`.
content = content.replace(/\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\}/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:${c}`).join(' ');
  return `${lightClass} ${darkClasses}`;
});

content = content.replace(/\$\{isDarkMode \? '([^']+)' : '([^']+)'\}/g, (match, darkClass, lightClass) => {
  if (darkClass === 'dark') return match;
  const darkClasses = darkClass.split(' ').map(c => `dark:${c}`).join(' ');
  return `${lightClass} ${darkClasses}`;
});

// Also handle hover:${isDarkMode ? "text-white" : "text-zinc-900"}
content = content.replace(/hover:\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\}/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:hover:${c}`).join(' ');
  const lightClasses = lightClass.split(' ').map(c => `hover:${c}`).join(' ');
  return `${lightClasses} ${darkClasses}`;
});

content = content.replace(/hover:\$\{isDarkMode \? '([^']+)' : '([^']+)'\}/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:hover:${c}`).join(' ');
  const lightClasses = lightClass.split(' ').map(c => `hover:${c}`).join(' ');
  return `${lightClasses} ${darkClasses}`;
});

// Also handle focus:${isDarkMode ? "text-white" : "text-zinc-900"}
content = content.replace(/focus:\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\}/g, (match, darkClass, lightClass) => {
  const darkClasses = darkClass.split(' ').map(c => `dark:focus:${c}`).join(' ');
  const lightClasses = lightClass.split(' ').map(c => `focus:${c}`).join(' ');
  return `${lightClasses} ${darkClasses}`;
});

// Let's do some global replacements for colors.
content = content.replace(/bg-zinc-50/g, 'bg-slate-50');
content = content.replace(/text-zinc-900/g, 'text-slate-900');
content = content.replace(/text-zinc-500/g, 'text-slate-600');
content = content.replace(/text-zinc-400/g, 'text-slate-500');
content = content.replace(/border-zinc-200/g, 'border-slate-200');
content = content.replace(/border-zinc-300/g, 'border-slate-300');

// Dark mode replacements
content = content.replace(/dark:bg-\[#0c0c0e\]/g, 'dark:bg-[#0A0A0A]');
content = content.replace(/dark:bg-\[#121214\]/g, 'dark:bg-white/[0.02]');
content = content.replace(/dark:border-zinc-800\/80/g, 'dark:border-white/10');
content = content.replace(/dark:border-zinc-800\/50/g, 'dark:border-white/5');
content = content.replace(/dark:border-zinc-800/g, 'dark:border-white/10');
content = content.replace(/dark:border-zinc-700/g, 'dark:border-white/20');
content = content.replace(/dark:text-zinc-300/g, 'dark:text-neutral-300');
content = content.replace(/dark:text-zinc-400/g, 'dark:text-neutral-400');
content = content.replace(/dark:text-zinc-500/g, 'dark:text-neutral-500');

// Cards
content = content.replace(/bg-white border-slate-200 shadow-zinc-200\/50 border rounded-2xl p-6 shadow-xl dark:bg-\[#0A0A0A\] dark:border-white\/10 dark:shadow-black\/50/g, 
  'bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-xl p-6 dark:bg-[#0A0A0A] dark:ring-1 dark:ring-white/10 dark:hover:bg-white/[0.04] dark:border-transparent dark:shadow-none transition-all duration-300');

content = content.replace(/bg-white border-slate-200 border rounded-2xl p-8 shadow-2xl dark:bg-\[#0a0a0a\] dark:border-white\/10/g,
  'bg-white border border-slate-200 shadow-sm rounded-xl p-8 dark:bg-[#0A0A0A] dark:ring-1 dark:ring-white/10 dark:border-transparent transition-all duration-300');

// Primary Buttons
content = content.replace(/bg-orange-500 hover:bg-orange-600 text-slate-900 font-medium py-2\.5 rounded-lg transition-colors dark:text-white/g,
  'bg-gradient-to-r from-orange-400 to-orange-500 hover:brightness-110 text-white font-medium py-2.5 rounded-lg transition-all duration-300 dark:bg-gradient-to-t dark:from-yellow-200 dark:via-orange-400 dark:to-orange-500 dark:text-[#2c1306] dark:shadow-[0_0_15px_rgba(249,115,22,0.4)] dark:hover:scale-[1.02]');

content = content.replace(/bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2\.5 rounded-full flex items-center gap-2 transition-all shadow-\[0_0_15px_rgba\(249,115,22,0\.3\)\]/g,
  'bg-gradient-to-r from-orange-400 to-orange-500 hover:brightness-110 text-white font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 dark:bg-gradient-to-t dark:from-yellow-200 dark:via-orange-400 dark:to-orange-500 dark:text-[#2c1306] dark:shadow-[0_0_15px_rgba(249,115,22,0.4)] dark:hover:scale-[1.02]');

content = content.replace(/bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3\.5 rounded-xl transition-all shadow-\[0_0_20px_rgba\(249,115,22,0\.2\)\]/g,
  'bg-gradient-to-r from-orange-400 to-orange-500 hover:brightness-110 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 dark:bg-gradient-to-t dark:from-yellow-200 dark:via-orange-400 dark:to-orange-500 dark:text-[#2c1306] dark:shadow-[0_0_15px_rgba(249,115,22,0.4)] dark:hover:scale-[1.02]');

content = content.replace(/bg-orange-500 hover:bg-orange-600 text-slate-900 text-sm font-medium transition-colors dark:text-white/g,
  'bg-gradient-to-r from-orange-400 to-orange-500 hover:brightness-110 text-white text-sm font-medium transition-all duration-300 dark:bg-gradient-to-t dark:from-yellow-200 dark:via-orange-400 dark:to-orange-500 dark:text-[#2c1306] dark:shadow-[0_0_15px_rgba(249,115,22,0.4)] dark:hover:scale-[1.02]');

// Secondary Buttons
content = content.replace(/bg-zinc-800 hover:bg-zinc-700 text-slate-900 font-medium py-2\.5 rounded-lg transition-colors dark:text-white/g,
  'bg-slate-900 hover:opacity-90 text-white font-medium py-2.5 rounded-lg transition-all duration-300 dark:bg-white dark:text-black dark:hover:bg-neutral-200');

// Inputs
content = content.replace(/bg-white border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors dark:bg-white\/\[0\.02\] dark:border-white\/10 dark:text-white/g,
  'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-300 dark:bg-white/[0.02] dark:border-white/10 dark:text-white dark:focus:border-white/20 dark:focus:ring-0 dark:placeholder-neutral-600');

content = content.replace(/bg-white border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors dark:bg-\[#050505\] dark:border-white\/10 dark:text-white/g,
  'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-300 dark:bg-[#050505] dark:border-white/10 dark:text-white dark:focus:border-white/20 dark:focus:ring-0 dark:placeholder-neutral-600');

content = content.replace(/bg-white border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors dark:bg-\[#0A0A0A\] dark:border-white\/10 dark:text-white/g,
  'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-300 dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white dark:focus:border-white/20 dark:focus:ring-0 dark:placeholder-neutral-600');

content = content.replace(/focus:border-orange-500/g, 'focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 dark:focus:border-white/20 dark:focus:ring-0');

content = content.replace(/dark:bg-\[#0a0a0a\]/g, 'dark:bg-[#0A0A0A]');

// Fix NavItem
content = content.replace(/bg-orange-50 text-orange-600 border border-orange-100 dark:bg-\[#1c0d04\] dark:text-orange-500 dark:border-\[#431c09\]/g,
  'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-white/[0.04] dark:text-orange-400 dark:border-white/10');

content = content.replace(/text-slate-600 hover:bg-zinc-100 hover:text-slate-900 border border-transparent dark:text-neutral-400 dark:hover:bg-zinc-800\/50 dark:hover:text-neutral-300 dark:border-transparent/g,
  'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent dark:text-neutral-400 dark:hover:bg-white/[0.04] dark:hover:text-white dark:border-transparent transition-all duration-300');

// Fix SettingsNavItem
content = content.replace(/bg-orange-50 border-orange-100 dark:bg-\[#1c0d04\] dark:border-\[#431c09\]/g,
  'bg-orange-50 border-orange-100 dark:bg-white/[0.04] dark:border-white/10');

content = content.replace(/border-transparent hover:bg-zinc-100 dark:border-transparent dark:hover:bg-zinc-800\/30/g,
  'border-transparent hover:bg-slate-100 dark:border-transparent dark:hover:bg-white/[0.04] transition-all duration-300');

// Fix toggle
content = content.replace(/bg-\[#18181b\] border-\[#27272a\]/g, 'bg-slate-200 border-slate-300 dark:bg-white/[0.04] dark:border-white/10');
content = content.replace(/bg-\[#3f1d0b\] border-\[#7c2d12\]/g, 'bg-orange-500 border-orange-600 dark:bg-orange-500/20 dark:border-orange-500/30');
content = content.replace(/translate-x-1 bg-\[#52525b\]/g, 'translate-x-1 bg-white dark:bg-neutral-400');
content = content.replace(/translate-x-5 bg-\[#f97316\]/g, 'translate-x-5 bg-white dark:bg-orange-400');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
