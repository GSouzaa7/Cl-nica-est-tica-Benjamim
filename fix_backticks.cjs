const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix the missing backticks in className
appContent = appContent.replace(
  /className="\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\} ([^"]+)"/g,
  'className={` ${isDarkMode ? "$1" : "$2"} $3 `}'
);

// Fix cases where it might be just the ternary
appContent = appContent.replace(
  /className="\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\}"/g,
  'className={` ${isDarkMode ? "$1" : "$2"} `}'
);

// Fix specific cases from my script
appContent = appContent.replace(
  /className={` \$\{isDarkMode \? "bg-\[#0c0c0e\] border-zinc-800\/80 shadow-black\/50" : "bg-white border-zinc-200 shadow-zinc-200\/50"\} border rounded-2xl p-6 shadow-xl transition-colors duration-300 `}/g,
  'className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-2xl p-6 shadow-xl transition-colors duration-300 `}'
);

fs.writeFileSync('src/App.tsx', appContent);
