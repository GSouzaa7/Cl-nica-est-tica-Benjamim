const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Update DashboardView definition
appContent = appContent.replace(
  'const DashboardView = () => {',
  'const DashboardView = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {'
);

// Update DashboardView implementation
// Background dots
appContent = appContent.replace(
  '<div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: \'radial-gradient(circle at center, #ffffff 1px, transparent 1px)\', backgroundSize: \'48px 48px\' }} />',
  '<div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${isDarkMode ? \'#ffffff\' : \'#000000\'} 1px, transparent 1px)`, backgroundSize: \'48px 48px\' }} />'
);

// Header
appContent = appContent.replace(
  '<LayoutDashboard className="text-white" size={32} />',
  '<LayoutDashboard className={isDarkMode ? "text-white" : "text-zinc-900"} size={32} />'
);
appContent = appContent.replace(
  '<h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>',
  '<h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Dashboard</h1>'
);

// Stats Cards
const statsCardRegex = /bg-\[#0c0c0e\] border border-zinc-800\/80 rounded-2xl p-6 shadow-xl shadow-black\/50/g;
appContent = appContent.replace(
  statsCardRegex,
  '${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-2xl p-6 shadow-xl transition-colors duration-300'
);

// Text White in stats
const textWhiteRegex = /text-3xl font-bold text-white mb-2/g;
appContent = appContent.replace(
  textWhiteRegex,
  'text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-2'
);

// Alert Cards
appContent = appContent.replace(
  'bg-[#1c0d0d] border border-red-900/30 rounded-2xl p-5 flex items-center gap-4',
  '${isDarkMode ? "bg-[#1c0d0d] border-red-900/30" : "bg-red-50 border-red-100"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300'
);
appContent = appContent.replace(
  'bg-[#1c140d] border border-orange-900/30 rounded-2xl p-5 flex items-center gap-4',
  '${isDarkMode ? "bg-[#1c140d] border-orange-900/30" : "bg-orange-50 border-orange-100"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300'
);

// Chart Card
appContent = appContent.replace(
  'col-span-2 bg-[#0c0c0e] border border-zinc-800\/80 rounded-2xl p-6 shadow-xl shadow-black\/50',
  'col-span-2 ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-2xl p-6 shadow-xl transition-colors duration-300'
);
appContent = appContent.replace(
  '<h3 className="text-lg font-semibold text-white">Desempenho Semestral</h3>',
  '<h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Desempenho Semestral</h3>'
);

// Agenda Widget
appContent = appContent.replace(
  'col-span-1 bg-[#0c0c0e] border border-zinc-800\/80 rounded-2xl p-6 shadow-xl shadow-black\/50 flex flex-col',
  'col-span-1 ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-2xl p-6 shadow-xl flex flex-col transition-colors duration-300'
);
appContent = appContent.replace(
  '<h3 className="text-lg font-semibold text-white leading-tight">Próximos<br/>Agendamentos</h3>',
  '<h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} leading-tight`}>Próximos<br/>Agendamentos</h3>'
);

// Update SettingsView definition
appContent = appContent.replace(
  'handleSave\n}: any) => {',
  'handleSave,\n  isDarkMode = true\n}: any) => {'
);

// SettingsView Header
appContent = appContent.replace(
  '<h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Control Center</h1>',
  '<h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-2 tracking-tight`}>Control Center</h1>'
);

// SettingsView Content Titles
appContent = appContent.replace(
  '<h2 className="text-xl font-semibold text-white mb-1">Usuários & Permissões</h2>',
  '<h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Usuários & Permissões</h2>'
);
appContent = appContent.replace(
  '<h2 className="text-xl font-semibold text-white mb-1">IA & Automação</h2>',
  '<h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>IA & Automação</h2>'
);
appContent = appContent.replace(
  '<h2 className="text-xl font-semibold text-white mb-1">API & Integrações</h2>',
  '<h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>API & Integrações</h2>'
);
appContent = appContent.replace(
  '<h2 className="text-xl font-semibold text-white mb-1">Financeiro & Fiscal</h2>',
  '<h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Financeiro & Fiscal</h2>'
);

// Settings Cards
const settingsCardRegex = /bg-\[#0c0c0e\] border border-zinc-800\/80 rounded-xl p-6 mb-8 shadow-xl shadow-black\/50/g;
appContent = appContent.replace(
  settingsCardRegex,
  '${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-xl p-6 mb-8 shadow-xl transition-colors duration-300'
);

// Settings Card Titles
const cardTitleRegex = /<h3 className="text-white font-medium">/g;
appContent = appContent.replace(
  cardTitleRegex,
  '<h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>'
);

// Settings Inner Cards (like WhatsApp, Stripe)
const innerCardRegex = /border border-zinc-800\/80 bg-\[#121214\] rounded-xl p-5 flex flex-col justify-between/g;
appContent = appContent.replace(
  innerCardRegex,
  'border ${isDarkMode ? "border-zinc-800/80 bg-[#121214]" : "border-zinc-200 bg-zinc-50"} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300'
);

// Inner Card Titles
appContent = appContent.replace(
  '<h4 className="text-sm font-medium text-white">WhatsApp Business</h4>',
  '<h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>WhatsApp Business</h4>'
);
appContent = appContent.replace(
  '<h4 className="text-sm font-medium text-white">Stripe / Pagamentos</h4>',
  '<h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Stripe / Pagamentos</h4>'
);
appContent = appContent.replace(
  '<h4 className="text-sm font-medium text-white">Google Calendar</h4>',
  '<h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Google Calendar</h4>'
);
appContent = appContent.replace(
  '<h4 className="text-sm font-medium text-white">RD Station Marketing</h4>',
  '<h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>RD Station Marketing</h4>'
);

// Inputs and Selects in Settings
appContent = appContent.replace(
  /bg-\[#121214\] border border-zinc-800 rounded-xl px-4 py-2\.5 text-white/g,
  '${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5'
);

// Matrix Role Switcher
appContent = appContent.replace(
  'bg-[#121214] p-1 rounded-lg border border-zinc-800/80',
  '${isDarkMode ? "bg-[#121214] border-zinc-800/80" : "bg-zinc-100 border-zinc-200"} p-1 rounded-lg border transition-colors duration-300'
);

fs.writeFileSync('src/App.tsx', appContent);
