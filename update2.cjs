const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

const importMarker = 'import { GoogleGenAI } from "@google/genai";';
const newImports = `import { HexColorPicker } from "react-colorful";`;

let updatedContent = appContent;

if (!updatedContent.includes('react-colorful')) {
  updatedContent = updatedContent.replace(
    "import React, { useState, useRef } from 'react';",
    "import React, { useState, useRef } from 'react';\nimport { HexColorPicker } from 'react-colorful';"
  );
}

const agendaStart = 'const AgendaView = () => {';
const agendaEnd = 'const CrmView = ({ patients, setPatients, columns, setColumns }: any) => {';

const agendaStartIndex = updatedContent.indexOf(agendaStart);
const agendaEndIndex = updatedContent.indexOf(agendaEnd);

if (agendaStartIndex === -1 || agendaEndIndex === -1) {
  console.error("AgendaView markers not found");
  process.exit(1);
}

const newAgendaView = `const AgendaView = ({ professionals }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-white" size={32} />
          <h1 className="text-3xl font-bold text-white tracking-tight">Agenda</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-white font-medium">
            <button className="hover:text-orange-500 transition-colors"><ChevronLeft size={20} /></button>
            <span>domingo, 22 fev</span>
            <button className="hover:text-orange-500 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* Content Grid */}
      <div className="flex-1 flex px-12 gap-8 z-10 overflow-hidden pb-10">
        
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl shadow-black/50">
          {/* Professionals Header */}
          <div className="flex border-b border-zinc-800/80 pl-16">
            {professionals.map((prof: any) => (
              <div key={prof.id} className="flex-1 p-4 flex items-center gap-3 border-r border-zinc-800/80 last:border-r-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: prof.color }}>
                  {prof.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-medium text-sm leading-tight">{prof.name}</div>
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mt-0.5">0 AGEND.</div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timeSlots.map(time => (
              <div key={time} className="flex border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors group">
                <div className="w-16 p-3 text-xs font-medium text-zinc-500 border-r border-zinc-800/80 flex items-center justify-center">
                  {time}
                </div>
                {professionals.map((prof: any) => (
                  <div 
                    key={\`\${prof.id}-\${time}\`} 
                    className="flex-1 p-2 border-r border-zinc-800/80 last:border-r-0 cursor-pointer hover:bg-zinc-800/30 transition-colors relative"
                    onClick={() => handleTimeClick(time)}
                  >
                    <div className="absolute inset-2 rounded-lg border-2 border-dashed border-transparent group-hover:border-zinc-700/50 transition-colors" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-8">Novo Agendamento</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Paciente</label>
                <input 
                  type="text"
                  placeholder="Buscar paciente..."
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Data</label>
                  <input 
                    type="date"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Horário</label>
                  <input 
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Profissional</label>
                <select className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                  {professionals.map((prof: any) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] mt-2"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

updatedContent = updatedContent.substring(0, agendaStartIndex) + newAgendaView + '\n' + updatedContent.substring(agendaEndIndex);

const profissionaisViewCode = `
const ProfissionaisView = ({ professionals, setProfessionals }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [color, setColor] = useState('#f97316');
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState('#f97316');

  const handleOpenModal = (prof?: any) => {
    if (prof) {
      setEditingId(prof.id);
      setName(prof.name);
      setSpecialty(prof.specialty || '');
      setColor(prof.color);
      setTempColor(prof.color);
    } else {
      setEditingId(null);
      setName('');
      setSpecialty('');
      setColor('#f97316');
      setTempColor('#f97316');
    }
    setIsModalOpen(true);
    setShowColorPicker(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    if (editingId) {
      setProfessionals(professionals.map((p: any) => 
        p.id === editingId ? { ...p, name, specialty, color } : p
      ));
    } else {
      setProfessionals([...professionals, {
        id: Date.now().toString(),
        name,
        specialty,
        color,
        active: true
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      setProfessionals(professionals.filter((p: any) => p.id !== id));
    }
  };

  const handleApplyColor = () => {
    setColor(tempColor);
    setShowColorPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="text-orange-500" size={32} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Profissionais & Equipe</h1>
          </div>
          <p className="text-zinc-400 text-sm">Gerencie profissionais, cores da agenda e especialidades</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        >
          <Plus size={18} />
          Cadastrar Profissional
        </button>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((prof: any) => (
            <div 
              key={prof.id} 
              className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 relative group transition-all"
              style={{ borderTopColor: prof.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: prof.color }}
                  >
                    {prof.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{prof.name}</h3>
                    {prof.specialty && <p className="text-zinc-500 text-xs mt-0.5">{prof.specialty}</p>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(prof)} className="text-zinc-500 hover:text-white transition-colors p-1">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(prof.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">ATIVO</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prof.color }} />
                  <span className="text-zinc-500 text-xs font-mono">{prof.color}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button 
            onClick={() => handleOpenModal()}
            className="bg-transparent border-2 border-dashed border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-900/20 transition-all min-h-[160px]"
          >
            <Plus size={24} className="mb-2" />
            <span className="font-medium">Adicionar Novo</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-8">Cadastrar Profissional</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Profissional</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dr. Rafael Costa"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Especialidade (Opcional)</label>
                <input 
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ex: Dermatologista"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Cor de Identificação (Agenda)</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-16 h-10 rounded-lg border border-zinc-700 shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-zinc-500 text-sm font-mono">{color}</span>
                </div>

                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-zinc-200 w-64">
                    <HexColorPicker color={tempColor} onChange={setTempColor} style={{ width: '100%' }} />
                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text" 
                        value={tempColor} 
                        onChange={(e) => setTempColor(e.target.value)}
                        className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-orange-500 uppercase font-mono"
                      />
                    </div>
                    <button 
                      onClick={handleApplyColor}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors mt-4 text-sm"
                    >
                      Aplicar Cor
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-transparent border border-zinc-800 hover:bg-zinc-900 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

const settingsStart = 'const SettingsView = ({';
const settingsStartIndex = updatedContent.indexOf(settingsStart);

updatedContent = updatedContent.substring(0, settingsStartIndex) + profissionaisViewCode + '\n' + updatedContent.substring(settingsStartIndex);

// Update App component to include professionals state and render ProfissionaisView
const appComponentStart = 'export default function App() {';
const appComponentStartIndex = updatedContent.indexOf(appComponentStart);

let appComponentContent = updatedContent.substring(appComponentStartIndex);

appComponentContent = appComponentContent.replace(
  "const [patients, setPatients] = useState<any[]>([]);",
  "const [patients, setPatients] = useState<any[]>([]);\n  const [professionals, setProfessionals] = useState([\n    { id: '1', name: 'Dr. Rafael Costa', specialty: '', color: '#ef4444', active: true },\n    { id: '2', name: 'Dr. Teste Upload', specialty: 'Dermatologista', color: '#10b981', active: true },\n    { id: '3', name: 'Dra. Ana Oliveira', specialty: '', color: '#8b5cf6', active: true },\n    { id: '4', name: 'Dra. Camila Santos', specialty: '', color: '#0ea5e9', active: true },\n  ]);"
);

appComponentContent = appComponentContent.replace(
  "<AgendaView />",
  "<AgendaView professionals={professionals} />"
);

appComponentContent = appComponentContent.replace(
  "activeMenu === 'Clientes' ? (\n        <ClientesView patients={patients} setPatients={setPatients} />\n      ) : (",
  "activeMenu === 'Clientes' ? (\n        <ClientesView patients={patients} setPatients={setPatients} />\n      ) : activeMenu === 'Profissionais' ? (\n        <ProfissionaisView professionals={professionals} setProfessionals={setProfessionals} />\n      ) : ("
);

updatedContent = updatedContent.substring(0, appComponentStartIndex) + appComponentContent;

fs.writeFileSync('src/App.tsx', updatedContent);
