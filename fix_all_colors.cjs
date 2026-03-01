const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix text-white to be conditional
appContent = appContent.replace(
  /className="([^"]*)text-white([^"]*)"/g,
  'className={`$1${isDarkMode ? "text-white" : "text-zinc-900"}$2`}'
);

// Fix text-zinc-300 to be conditional
appContent = appContent.replace(
  /className="([^"]*)text-zinc-300([^"]*)"/g,
  'className={`$1${isDarkMode ? "text-zinc-300" : "text-zinc-900"}$2`}'
);

// Fix bg-[#0c0c0e] to be conditional
appContent = appContent.replace(
  /className="([^"]*)bg-\[#0c0c0e\]([^"]*)"/g,
  'className={`$1${isDarkMode ? "bg-[#0c0c0e]" : "bg-white"}$2`}'
);

// Fix bg-[#121214] to be conditional
appContent = appContent.replace(
  /className="([^"]*)bg-\[#121214\]([^"]*)"/g,
  'className={`$1${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"}$2`}'
);

// Fix border-zinc-800 to be conditional
appContent = appContent.replace(
  /className="([^"]*)border-zinc-800([^"]*)"/g,
  'className={`$1${isDarkMode ? "border-zinc-800" : "border-zinc-200"}$2`}'
);

fs.writeFileSync('src/App.tsx', appContent);
