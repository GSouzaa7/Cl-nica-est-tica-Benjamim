const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix active tabs in ServicosView, FinanceiroView, SettingsView
content = content.replace(
  /'bg-\[#1c0d04\] text-orange-500 border border-\[#431c09\]'/g,
  "'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'"
);

// Fix inactive tabs text colors
content = content.replace(
  /'text-slate-500 hover:text-white'/g,
  "'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'"
);

content = content.replace(
  /'text-slate-600 hover:text-neutral-300 border border-transparent'/g,
  "'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white border border-transparent'"
);

content = content.replace(
  /'text-slate-500 hover:text-zinc-200 border border-transparent'/g,
  "'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white border border-transparent'"
);

content = content.replace(
  /'text-slate-500 hover:text-zinc-200'/g,
  "'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'"
);

// Fix specific buttons
content = content.replace(
  /bg-\[#2a1408\] text-orange-500/g,
  "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
);

// Fix NavItem active state that was already replaced but might have hardcoded dark colors
content = content.replace(
  /dark:bg-\[#1c0d04\] dark:text-orange-500 dark:border dark:border-\[#431c09\]/g,
  "dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
);

// Fix bg-[#1c0d04] text-orange-500 border border-[#431c09] hover:bg-orange-500/20
content = content.replace(
  /'bg-\[#1c0d04\] text-orange-500 border border-\[#431c09\] hover:bg-orange-500\/20'/g,
  "'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 dark:hover:bg-orange-500/20'"
);

// Fix status badges
content = content.replace(
  /'bg-\[#2a1a08\] text-yellow-500 border border-yellow-500\/30'/g,
  "'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-500 dark:border-yellow-500/20'"
);

content = content.replace(
  /'bg-\[#0a2a18\] text-emerald-500 border border-emerald-500\/30'/g,
  "'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20'"
);

content = content.replace(
  /'bg-\[#050505\] text-slate-600 border border-white\/10 hover:border-white\/20'/g,
  "'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 dark:bg-white/[0.02] dark:text-neutral-400 dark:border-white/10 dark:hover:border-white/20'"
);

content = content.replace(
  /'bg-white\/\[0.04\] text-white border border-white\/20'/g,
  "'bg-slate-100 text-slate-900 border border-slate-300 dark:bg-white/[0.06] dark:text-white dark:border-white/20'"
);

// Fix red/orange alert boxes
content = content.replace(
  /bg-red-50 border-red-100 dark:bg-\[#1c0d0d\] dark:border-red-900\/30/g,
  "bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
);

content = content.replace(
  /bg-orange-50 border-orange-100 dark:bg-\[#1c140d\] dark:border-orange-900\/30/g,
  "bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20"
);

// Fix inputs with bg-[#121214] and bg-[#050505]
content = content.replace(
  /bg-\[#121214\]/g,
  "bg-white dark:bg-white/[0.02]"
);

content = content.replace(
  /bg-\[#050505\]/g,
  "bg-slate-50 dark:bg-[#050505]"
);

// Fix inputs with bg-[#0A0A0A]
content = content.replace(
  /bg-\[#0A0A0A\]/g,
  "bg-white dark:bg-[#0A0A0A]"
);

// Fix border-white/10 to have light mode equivalent
content = content.replace(
  /border border-white\/10/g,
  "border border-slate-200 dark:border-white/10"
);

// Fix text-white to have light mode equivalent
content = content.replace(
  /text-white/g,
  "text-slate-900 dark:text-white"
);

// Fix text-slate-900 dark:text-slate-900 dark:text-white
content = content.replace(
  /text-slate-900 dark:text-slate-900 dark:text-white/g,
  "text-slate-900 dark:text-white"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
