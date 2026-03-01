const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix text-white in titles and headers
appContent = appContent.replace(
  /className="text-lg font-semibold text-white"/g,
  'className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}'
);

appContent = appContent.replace(
  /className="text-sm font-medium text-white"/g,
  'className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}'
);

// Fix bg-[#0c0c0e] that might have been missed
appContent = appContent.replace(
  /bg-\[#0c0c0e\] border border-zinc-800\/80 rounded-xl p-6/g,
  '${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80" : "bg-white border-zinc-200"} border rounded-xl p-6'
);

// Fix text-zinc-300 that should be text-zinc-900 in light mode
appContent = appContent.replace(
  /className="font-semibold text-zinc-300"/g,
  'className={`font-semibold ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}'
);

// Fix text-zinc-400 in subtitles
appContent = appContent.replace(
  /className="text-zinc-400 text-sm"/g,
  'className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}'
);

fs.writeFileSync('src/App.tsx', appContent);
