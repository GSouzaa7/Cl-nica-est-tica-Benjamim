const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Function to fix className attributes
function fixClassNames(content) {
  // Replace className="... text-white ..." with className={`... ${isDarkMode ? "text-white" : "text-zinc-900"} ...`}
  // But only if it's not already conditional
  
  // First, let's handle simple text-white
  content = content.replace(/className="([^"]*)text-white([^"]*)"/g, (match, p1, p2) => {
    if (p1.includes('${') || p2.includes('${')) return match;
    return `className={\`\${isDarkMode ? "text-white" : "text-zinc-900"} ${p1}${p2}\`}`;
  });

  // Handle bg-[#0c0c0e]
  content = content.replace(/className="([^"]*)bg-\[#0c0c0e\]([^"]*)"/g, (match, p1, p2) => {
    if (p1.includes('${') || p2.includes('${')) return match;
    return `className={\`\${isDarkMode ? "bg-[#0c0c0e]" : "bg-white"} ${p1}${p2}\`}`;
  });

  return content;
}

appContent = fixClassNames(appContent);

fs.writeFileSync('src/App.tsx', appContent);
