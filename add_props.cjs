const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

const components = [
  'AgendaView', 'CrmView', 'ClientesView', 'ProfissionaisView', 
  'ServicosView', 'EstoqueView', 'FinanceiroView', 'RelatoriosView'
];

components.forEach(comp => {
  // Find the component definition and add isDarkMode to props
  // Pattern: const Component = ({ ... }: any) => {
  const regex = new RegExp(`const ${comp} = \\({([^}]*)}\\s*:\\s*any\\) => {`, 'g');
  appContent = appContent.replace(regex, (match, p1) => {
    if (p1.includes('isDarkMode')) return match;
    return `const ${comp} = ({ ${p1}, isDarkMode = true }: any) => {`;
  });
  
  // Also handle cases without any props
  const regexNoProps = new RegExp(`const ${comp} = \\(\\) => {`, 'g');
  appContent = appContent.replace(regexNoProps, `const ${comp} = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {`);
});

fs.writeFileSync('src/App.tsx', appContent);
