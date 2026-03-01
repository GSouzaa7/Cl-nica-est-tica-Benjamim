const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

const startMarker = 'const CrmView = () => {';
const endMarker = 'const SettingsView = ({';

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found');
  process.exit(1);
}

const newCrmView = `const CrmView = ({ patients, setPatients, columns, setColumns }: any) => {
  const [isNewColumnModalOpen, setIsNewColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newCardName, setNewCardName] = useState('');

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const activeCard = patients.find((p: any) => p.id === activeCardId) || null;

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordType, setRecordType] = useState('Evolução');
  const recognitionRef = useRef<any>(null);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');

  React.useEffect(() => {
    if (activeCard) {
      setEditName(activeCard.name || '');
      setEditPhone(activeCard.phone || '');
      setEditEmail(activeCard.email || '');
      setEditNotes(activeCard.notes || '');
    }
  }, [activeCard?.id]);

  const handleCreateColumn = () => {
    if (newColumnName.trim()) {
      setColumns([...columns, { id: Date.now().toString(), title: newColumnName, cardIds: [] }]);
      setNewColumnName('');
      setIsNewColumnModalOpen(false);
    }
  };

  const handleCreateCard = () => {
    if (newCardName.trim() && activeColumnId) {
      const newPatient = { id: Date.now().toString(), name: newCardName, phone: '', email: '', notes: '', history: [] };
      setPatients([newPatient, ...patients]);
      setColumns(columns.map((col: any) => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            cardIds: [...col.cardIds, newPatient.id]
          };
        }
        return col;
      }));
      setNewCardName('');
      setIsNewCardModalOpen(false);
    }
  };

  const handleRecordAudio = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let currentFinalTranscript = transcription;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        currentFinalTranscript += newFinalTranscript;
        setTranscription(currentFinalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Erro na gravação de áudio:", event.error);
        if (event.error === 'not-allowed') {
          alert("Permissão de microfone necessária para gravar.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        console.error("Erro ao iniciar gravação:", e);
        setIsRecording(false);
      }
    }
  };

  const handleSaveRecord = () => {
    if (!transcription.trim() || !activeCard) return;

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type: recordType,
      content: transcription.trim()
    };

    const updatedCard = {
      ...activeCard,
      name: editName,
      phone: editPhone,
      email: editEmail,
      notes: editNotes,
      history: [newRecord, ...(activeCard.history || [])]
    };

    setPatients(patients.map((p: any) => p.id === activeCard.id ? updatedCard : p));
    setTranscription('');
  };

  const handleSavePatient = () => {
    if (!activeCard) return;
    const updatedCard = {
      ...activeCard,
      name: editName,
      phone: editPhone,
      email: editEmail,
      notes: editNotes,
    };
    setPatients(patients.map((p: any) => p.id === activeCard.id ? updatedCard : p));
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-500" size={32} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Pipeline de Vendas</h1>
          </div>
          <p className="text-zinc-400 text-sm">Gerencie o fluxo de pacientes da sua clínica</p>
        </div>
        
        <button 
          onClick={() => setIsNewColumnModalOpen(true)}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        >
          <Plus size={18} />
          Nova Coluna
        </button>
      </header>

      {/* Content Grid - Kanban Board */}
      <div className="flex-1 flex px-12 gap-6 z-10 overflow-x-auto pb-10 custom-scrollbar items-start">
        {columns.map((column: any) => (
          <div key={column.id} className="w-80 shrink-0 bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl flex flex-col max-h-full">
            {/* Column Header */}
            <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">{column.title}</h3>
                <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">{column.cardIds.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => { setActiveColumnId(column.id); setIsNewCardModalOpen(true); }}
                  className="text-zinc-500 hover:text-white transition-colors p-1"
                >
                  <Plus size={16} />
                </button>
                <button className="text-zinc-500 hover:text-white transition-colors p-1">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Cards Area */}
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {column.cardIds.map((cardId: string) => {
                const card = patients.find((p: any) => p.id === cardId);
                if (!card) return null;
                return (
                  <div 
                    key={card.id}
                    onClick={() => setActiveCardId(card.id)}
                    className="bg-[#121214] border border-zinc-800/80 rounded-xl p-4 cursor-pointer hover:border-orange-500/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                        {card.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-white font-medium text-sm">{card.name || 'Sem Nome'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* New Column Modal */}
      {isNewColumnModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => setIsNewColumnModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-8">Nova Coluna</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome da Etapa</label>
                <input 
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Ex: Em Negociação"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  autoFocus
                />
              </div>

              <button 
                onClick={handleCreateColumn}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                Criar Coluna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Card Modal */}
      {isNewCardModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => setIsNewCardModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-8">Novo Paciente/Lead</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Paciente</label>
                <input 
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  autoFocus
                />
              </div>

              <button 
                onClick={handleCreateCard}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                Adicionar ao Funil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {activeCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => setActiveCardId(null)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Left Sidebar - Patient Data */}
            <div className="w-80 bg-[#050505] border-r border-zinc-800/80 p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold text-white mb-8">Dados Cadastrais</h3>
              
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-4xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                  {editName ? editName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone</label>
                  <input 
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">E-mail</label>
                  <input 
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Observações Gerais</label>
                  <textarea 
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Alergias, queixas principais..."
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-24"
                  />
                </div>
                
                <button 
                  onClick={handleSavePatient}
                  className="w-full bg-[#0a0a0a] hover:bg-zinc-900 border border-zinc-800 text-white font-semibold py-3 rounded-xl transition-colors mt-4 text-sm"
                >
                  Salvar Cadastro
                </button>
              </div>
            </div>

            {/* Right Area - Clinical History */}
            <div className="flex-1 p-8 flex flex-col bg-[#0a0a0a]">
              <h3 className="text-lg font-bold text-white mb-8">Histórico Clínico</h3>

              {/* New Record Box */}
              <div className="bg-[#050505] border border-zinc-800/80 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={handleRecordAudio}
                    className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all \${
                      isRecording 
                        ? 'bg-red-600 text-white border border-red-500 animate-pulse' 
                        : 'bg-[#1c0d04] text-orange-500 border border-[#431c09] hover:bg-orange-500/20'
                    }\`}
                  >
                    {isRecording ? <Square size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                  </button>
                  
                  <select 
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option>Evolução</option>
                    <option>Anamnese</option>
                    <option>Procedimento</option>
                  </select>
                  
                  <span className="text-zinc-500 text-sm ml-auto">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>

                <textarea 
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Descreva o atendimento, procedimento ou anamnese. O áudio transcrito aparecerá aqui..."
                  className="w-full bg-transparent border-none text-zinc-300 focus:outline-none resize-none h-32 text-sm leading-relaxed"
                />

                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleSaveRecord}
                    disabled={!transcription.trim()}
                    className={\`font-semibold px-6 py-2 rounded-xl transition-all text-sm \${
                      transcription.trim() 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }\`}
                  >
                    Salvar Prontuário
                  </button>
                </div>
              </div>

              {/* History List */}
              {activeCard.history && activeCard.history.length > 0 ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {activeCard.history.map((record: any) => (
                    <div key={record.id} className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-500 font-medium text-sm">{record.type}</span>
                        <span className="text-zinc-500 text-xs">{record.date}</span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {record.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-zinc-600 text-sm">Nenhum prontuário registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientesView = ({ patients, setPatients }: any) => {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  
  const activePatient = patients.find((p: any) => p.id === activePatientId) || null;
  const isCreating = isNewPatientModalOpen && !activePatientId;
  const currentPatient = activePatient || (isCreating ? { id: 'new', name: '', phone: '', email: '', notes: '', history: [] } : null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordType, setRecordType] = useState('Evolução');
  const recognitionRef = useRef<any>(null);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');

  React.useEffect(() => {
    if (currentPatient) {
      setEditName(currentPatient.name || '');
      setEditPhone(currentPatient.phone || '');
      setEditEmail(currentPatient.email || '');
      setEditNotes(currentPatient.notes || '');
    }
  }, [currentPatient?.id]);

  const handleRecordAudio = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let currentFinalTranscript = transcription;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        currentFinalTranscript += newFinalTranscript;
        setTranscription(currentFinalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Erro na gravação de áudio:", event.error);
        if (event.error === 'not-allowed') {
          alert("Permissão de microfone necessária para gravar.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        console.error("Erro ao iniciar gravação:", e);
        setIsRecording(false);
      }
    }
  };

  const handleSaveRecord = () => {
    if (!transcription.trim() || !currentPatient) return;

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type: recordType,
      content: transcription.trim()
    };

    let updatedPatient;
    if (isCreating) {
      updatedPatient = {
        ...currentPatient,
        id: Date.now().toString(),
        name: editName || 'Paciente Sem Nome',
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
        history: [newRecord]
      };
      setPatients([updatedPatient, ...patients]);
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = {
        ...currentPatient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
        history: [newRecord, ...(currentPatient.history || [])]
      };
      setPatients(patients.map((p: any) => p.id === currentPatient.id ? updatedPatient : p));
    }

    setTranscription('');
  };

  const handleSavePatient = () => {
    if (!currentPatient) return;
    
    let updatedPatient;
    if (isCreating) {
      updatedPatient = {
        ...currentPatient,
        id: Date.now().toString(),
        name: editName || 'Paciente Sem Nome',
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
      };
      setPatients([updatedPatient, ...patients]);
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = {
        ...currentPatient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
      };
      setPatients(patients.map((p: any) => p.id === currentPatient.id ? updatedPatient : p));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-500" size={32} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Base de Pacientes <span className="text-zinc-500 text-xl ml-2">{patients.length}</span></h1>
          </div>
          <p className="text-zinc-400 text-sm">Prontuários criptografados • LGPD Compliant</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
            <Upload size={18} />
          </button>
          <button 
            onClick={() => { setIsNewPatientModalOpen(true); setActivePatientId(null); }}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Plus size={18} />
            Novo Paciente
          </button>
        </div>
      </header>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(patient => (
            <div key={patient.id} className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    {patient.name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{patient.name || 'Sem Nome'}</h3>
                    <p className="text-zinc-500 text-sm">{patient.phone || 'Telefone não cadastrado'}</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="bg-[#121214] rounded-xl p-4 mb-6 border border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">Resumo / Histórico</span>
                <p className="text-zinc-300 text-sm line-clamp-2">
                  {patient.history && patient.history.length > 0 ? patient.history[0].content : patient.notes || 'Nenhum registro.'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">{patient.history?.length || 0} registros</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-900/30 text-green-500 hover:bg-green-500/10 transition-colors text-xs font-medium">
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => setActivePatientId(patient.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-900/30 text-orange-500 hover:bg-orange-500/10 transition-colors text-xs font-medium"
                  >
                    <FileText size={14} />
                    Prontuário
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {(isNewPatientModalOpen || activePatientId) && currentPatient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button 
              onClick={() => { setIsNewPatientModalOpen(false); setActivePatientId(null); }}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Left Sidebar - Patient Data */}
            <div className="w-80 bg-[#050505] border-r border-zinc-800/80 p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold text-white mb-8">Dados Cadastrais</h3>
              
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-4xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                  {editName ? editName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone</label>
                  <input 
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">E-mail</label>
                  <input 
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Observações Gerais</label>
                  <textarea 
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Alergias, queixas principais..."
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-24"
                  />
                </div>
                
                <button 
                  onClick={handleSavePatient}
                  className="w-full bg-[#0a0a0a] hover:bg-zinc-900 border border-zinc-800 text-white font-semibold py-3 rounded-xl transition-colors mt-4 text-sm"
                >
                  Salvar Cadastro
                </button>
              </div>
            </div>

            {/* Right Area - Clinical History */}
            <div className="flex-1 p-8 flex flex-col bg-[#0a0a0a]">
              <h3 className="text-lg font-bold text-white mb-8">Histórico Clínico</h3>

              {/* New Record Box */}
              <div className="bg-[#050505] border border-zinc-800/80 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={handleRecordAudio}
                    className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all \${
                      isRecording 
                        ? 'bg-red-600 text-white border border-red-500 animate-pulse' 
                        : 'bg-[#1c0d04] text-orange-500 border border-[#431c09] hover:bg-orange-500/20'
                    }\`}
                  >
                    {isRecording ? <Square size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                  </button>
                  
                  <select 
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option>Evolução</option>
                    <option>Anamnese</option>
                    <option>Procedimento</option>
                  </select>
                  
                  <span className="text-zinc-500 text-sm ml-auto">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>

                <textarea 
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Descreva o atendimento, procedimento ou anamnese. O áudio transcrito aparecerá aqui..."
                  className="w-full bg-transparent border-none text-zinc-300 focus:outline-none resize-none h-32 text-sm leading-relaxed"
                />

                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleSaveRecord}
                    disabled={!transcription.trim()}
                    className={\`font-semibold px-6 py-2 rounded-xl transition-all text-sm \${
                      transcription.trim() 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }\`}
                  >
                    Salvar Prontuário
                  </button>
                </div>
              </div>

              {/* History List */}
              {currentPatient.history && currentPatient.history.length > 0 ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {currentPatient.history.map((record: any) => (
                    <div key={record.id} className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-500 font-medium text-sm">{record.type}</span>
                        <span className="text-zinc-500 text-xs">{record.date}</span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {record.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-zinc-600 text-sm">Nenhum prontuário registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`
const newAppContent = appContent.substring(0, startIndex) + newCrmView + '\n' + appContent.substring(endIndex);

fs.writeFileSync('src/App.tsx', newAppContent);
