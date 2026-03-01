const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// The script accidentally added EstoqueView twice and messed up the inventory state.
// Let's restore from the previous step and do it correctly.

const appContentBackup = fs.readFileSync('src/App.tsx', 'utf-8');

// We need to remove the duplicate EstoqueView and fix the inventory state.
// Let's just find the first EstoqueView and the second EstoqueView.

const firstEstoqueViewIndex = appContent.indexOf('const EstoqueView = ({ inventory, setInventory }: any) => {');
const secondEstoqueViewIndex = appContent.indexOf('const EstoqueView = ({ inventory, setInventory }: any) => {', firstEstoqueViewIndex + 1);

let fixedContent = appContent;

if (secondEstoqueViewIndex !== -1) {
  // Remove the second EstoqueView completely.
  // We need to find where it ends. It ends right before `export default function App()`
  const appComponentStart = 'export default function App() {';
  const appComponentStartIndex = appContent.indexOf(appComponentStart, secondEstoqueViewIndex);
  
  if (appComponentStartIndex !== -1) {
    fixedContent = appContent.substring(0, secondEstoqueViewIndex) + appContent.substring(appComponentStartIndex);
  }
}

// Now let's fix the inventory state in App component
const appComponentStart = 'export default function App() {';
const appComponentStartIndex = fixedContent.indexOf(appComponentStart);

let appComponentContent = fixedContent.substring(appComponentStartIndex);

// Let's find the messed up inventory state and replace it
const setInventoryRegex = /const \[inventory, setInventory\] = useState\(\[[\s\S]*?\]\);/g;
const matches = appComponentContent.match(setInventoryRegex);

if (matches && matches.length > 0) {
  // Replace all occurrences of inventory state with the correct one
  const correctInventory = `const [inventory, setInventory] = useState([
    { id: 'inv1', name: 'Toxina Botulínica (100U)', category: 'Insumos', price: 850, sellPrice: null, stock: 15, minStock: 5 },
    { id: 'inv2', name: 'Ácido Hialurônico (1ml)', category: 'Insumos', price: 350, sellPrice: null, stock: 8, minStock: 10 },
    { id: 'inv3', name: 'Seringa Descartável', category: 'Materiais', price: 0.35, sellPrice: null, stock: 250, minStock: 100 },
    { id: 'inv4', name: 'Agulha 30G', category: 'Materiais', price: 0.15, sellPrice: null, stock: 400, minStock: 100 },
    { id: 'inv5', name: 'Fios de PDO (un)', category: 'Insumos', price: 80, sellPrice: 200, stock: 30, minStock: 20 },
    { id: 'inv6', name: 'Gaze Estéril (pacote)', category: 'Materiais', price: 0.5, sellPrice: null, stock: 15, minStock: 20 }
  ]);`;
  
  appComponentContent = appComponentContent.replace(matches[0], correctInventory);
  
  // Remove any leftover syntax errors
  appComponentContent = appComponentContent.replace(/\{\s*id:\s*'inv1',\s*name:\s*'Toxina Botulínica \(100U\)',\s*price:\s*850\s*\},[\s\S]*?\]\);/g, '');
}

fixedContent = fixedContent.substring(0, appComponentStartIndex) + appComponentContent;

fs.writeFileSync('src/App.tsx', fixedContent);
