const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

const components = [
  'LoginScreen', 'PendingScreen', 'DeniedScreen'
];

components.forEach(comp => {
  const regex = new RegExp(`const ${comp} = \\({([^}]*)}\\s*:\\s*{([^}]*)}\\) => {`, 'g');
  appContent = appContent.replace(regex, (match, p1, p2) => {
    if (p1.includes('isDarkMode')) return match;
    return `const ${comp} = ({ ${p1}, isDarkMode = true }: { ${p2}, isDarkMode?: boolean }) => {`;
  });
  
  // Handle cases like ({ onLogout }: { onLogout: () => void }) => (
  const regexArrow = new RegExp(`const ${comp} = \\({([^}]*)}\\s*:\\s*{([^}]*)}\\) => \\(`, 'g');
  appContent = appContent.replace(regexArrow, (match, p1, p2) => {
    if (p1.includes('isDarkMode')) return match;
    return `const ${comp} = ({ ${p1}, isDarkMode = true }: { ${p2}, isDarkMode?: boolean }) => (`;
  });
});

fs.writeFileSync('src/App.tsx', appContent);
