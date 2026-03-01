const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix the broken className attributes
// Pattern: className="${isDarkMode ? "..." : "..."} ..."
appContent = appContent.replace(
  /className="\$\{isDarkMode \? "([^"]*)" : "([^"]*)"\}([^"]*)"/g,
  'className={` ${isDarkMode ? "$1" : "$2"} $3 `}'
);

// Pattern: className="${isDarkMode ? "..." : "..."}"
appContent = appContent.replace(
  /className="\$\{isDarkMode \? "([^"]*)" : "([^"]*)"\}"/g,
  'className={` ${isDarkMode ? "$1" : "$2"} `}'
);

fs.writeFileSync('src/App.tsx', appContent);
