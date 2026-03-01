const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Function to fix className attributes that have ${isDarkMode ...} but are not wrapped in {` `}
function fixClassNames(content) {
  // Replace className="... ${isDarkMode ? '...' : '...'} ..." with className={`... ${isDarkMode ? '...' : '...'} ...`}
  // We need to handle both single and double quotes inside the ternary
  
  // Pattern 1: className="... ${isDarkMode ? "..." : "..."} ..."
  content = content.replace(/className="([^"]*)\$\{isDarkMode \? "([^"]*)" : "([^"]*)"\}([^"]*)"/g, 'className={`$1${isDarkMode ? "$2" : "$3"}$4`}');
  
  // Pattern 2: className="... ${isDarkMode ? '...' : '...'} ..."
  content = content.replace(/className="([^"]*)\$\{isDarkMode \? '([^']*)' : '([^']*)'\}([^"]*)"/g, "className={`$1${isDarkMode ? '$2' : '$3'}$4`}");

  return content;
}

appContent = fixClassNames(appContent);

// Also fix the background dots which I manually replaced in the previous script
appContent = appContent.replace(
  'style={{ backgroundImage: `radial-gradient(circle at center, ${isDarkMode ? \'#ffffff\' : \'#000000\'} 1px, transparent 1px)`, backgroundSize: \'48px 48px\' }}',
  'style={{ backgroundImage: `radial-gradient(circle at center, ${isDarkMode ? "#ffffff" : "#000000"} 1px, transparent 1px)`, backgroundSize: "48px 48px" }}'
);

fs.writeFileSync('src/App.tsx', appContent);
