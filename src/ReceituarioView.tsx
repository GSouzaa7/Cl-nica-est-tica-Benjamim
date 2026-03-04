import React, { useState, useRef, useEffect } from 'react';
import { FileSignature, Printer, Save, Search, ChevronDown } from 'lucide-react';
import { WordEditor } from './components/Receituario/WordEditor';

const compareDates = (d1: string, d2: string) => {
  if (!d1 || !d2) return false;
  const format = (d: string) => new Date(d).toISOString().split('T')[0].replace(/-/g, '');
  try {
    const normalizeBR = (s: string) => s.includes('/') ? s.split('/').reverse().join('') : s.replace(/-/g, '');
    return normalizeBR(d1) === normalizeBR(d2);
  } catch { return false; }
};

export const ReceituarioView = ({ patients, professionals, selectedPatientId, isDarkMode = true }: any) => {
  const [tipoReceituario, setTipoReceituario] = useState('simples');
  const [patientId, setPatientId] = useState(selectedPatientId || '');
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id || '');
  const [prescricao, setPrescricao] = useState("");
  const [historyLookupDate, setHistoryLookupDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientSearch, setPatientSearch] = useState('');
  const [comboboxSearch, setComboboxSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const filteredPatientsForDropdown = patients?.filter((p: any) => {
    const term = comboboxSearch.toLowerCase().trim();
    if (!term) return true;
    // Match by name (text)
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    // Match by CPF (both formatted and digits-only)
    const cpfRaw = (p.cpf || '');
    const cpfMatch = cpfRaw ? (cpfRaw.includes(term) || cpfRaw.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) : false;
    // Match by phone (both formatted and digits-only)
    const phoneRaw = (p.phone || '');
    const phoneMatch = phoneRaw ? (phoneRaw.includes(term) || phoneRaw.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) : false;
    return nameMatch || cpfMatch || phoneMatch;
  });

  const selectedPatientData = patients?.find((p: any) => p.id === patientId);
  const selectedProfessional = professionals?.find((p: any) => p.id === professionalId);

  const generateTemplate = () => {
    const profName = selectedProfessional?.name || 'Nome do Profissional';
    const profSpec = selectedProfessional?.specialty || 'Especialidade';
    const patName = selectedPatientData?.name || '________________________________________________';
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const header = `<h2 style="text-align:center; font-size:1.5rem; font-weight:700; text-transform:uppercase; margin:0 0 4px 0;">${profName}</h2>` +
      `<p style="text-align:center; font-size:0.875rem; margin:4px 0;">${profSpec} - CRM/CRO: 123456-UF</p>` +
      `<p style="text-align:center; font-size:0.75rem; margin:4px 0;">Av. Exemplo, 1000 - Bairro, Cidade - UF | (00) 0000-0000</p>` +
      `<p style="border-bottom:2px solid #000; padding-bottom:16px; margin-bottom:32px;"><br></p>`;

    const footer = `<p style="text-align:center; margin-top:64px;">_________________________________</p>` +
      `<p style="text-align:center; font-size:0.875rem; font-weight:700;">${profName}</p>` +
      `<p style="text-align:center; font-size:0.75rem;">Data: ${dataAtual}</p>`;

    if (tipoReceituario === 'simples') {
      return `<p><br></p><p><br></p><p><br></p><p><br></p>` +
        `<p><br></p><p><br></p><p><br></p><p><br></p>` +
        `<p><br></p><p><br></p>`;
    }

    if (tipoReceituario === 'controle_especial') {
      return `<h2 style="text-align:center; font-size:1.25rem; font-weight:700; text-transform:uppercase;">RECEITUÁRIO DE CONTROLE ESPECIAL</h2>` +
        `<p style="text-align:center; font-size:0.875rem;">1ª Via - Retenção da Farmácia | 2ª Via - Paciente</p>` +
        `<p><br></p>` +
        `<p style="font-size:0.875rem; font-weight:700;">IDENTIFICAÇÃO DO EMITENTE</p>` +
        `<p style="font-size:0.875rem;">${profName} - CRM/CRO: 123456-UF</p>` +
        `<p style="font-size:0.875rem;">Av. Exemplo, 1000 - Bairro, Cidade - UF</p>` +
        `<p><br></p>` +
        `<p style="font-size:0.875rem;"><strong>Paciente:</strong> ${patName}</p>` +
        `<p style="font-size:0.875rem;"><strong>Endereço:</strong> ________________________________________________</p>` +
        `<p><br></p>` +
        `<p style="font-weight:700;">PRESCRIÇÃO:</p>` +
        `<p><br></p><p><br></p><p><br></p><p><br></p>` +
        `<p><br></p><p><br></p>` +
        footer;
    }

    // antibiotico
    return `<h2 style="text-align:center; font-size:1.25rem; font-weight:700; text-transform:uppercase;">RECEITUÁRIO DE ANTIMICROBIANOS</h2>` +
      `<p style="text-align:center; font-size:0.875rem;">1ª Via - Retenção da Farmácia | 2ª Via - Paciente</p>` +
      `<p><br></p>` +
      `<p style="font-size:0.875rem; font-weight:700;">IDENTIFICAÇÃO DO EMITENTE</p>` +
      `<p style="font-size:0.875rem;">${profName} - CRM/CRO: 123456-UF</p>` +
      `<p style="font-size:0.875rem;">Av. Exemplo, 1000 - Bairro, Cidade - UF</p>` +
      `<p><br></p>` +
      `<p style="font-size:0.875rem;"><strong>Paciente:</strong> ${patName}</p>` +
      `<p style="font-size:0.875rem;"><strong>Idade/Sexo:</strong> ________________________________________________</p>` +
      `<p><br></p>` +
      `<p style="font-weight:700;">PRESCRIÇÃO:</p>` +
      `<p><br></p><p><br></p><p><br></p><p><br></p>` +
      `<p><br></p><p><br></p>` +
      footer;
  };

  // Auto-generate template on first load or when tipo changes
  useEffect(() => {
    setPrescricao(generateTemplate());
  }, [tipoReceituario]);

  const handleRegenerate = () => {
    setPrescricao(generateTemplate());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert('Receituário salvo no histórico do paciente!');
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header - Hidden in print */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <FileSignature className="text-[var(--text-primary)]" size={32} />
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Receituário</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-zinc-800 hover:text-white text-[var(--text-primary)] font-semibold transition-all shadow-[var(--card-shadow)]">
            <Save size={18} />
            Salvar no Prontuário
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Printer size={18} />
            Imprimir
          </button>
        </div>
      </header>

      {/* Content Grid - Hidden in print */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar print:hidden">
        <div className="flex gap-8 max-w-7xl mx-auto">

          {/* Controls */}
          <div className={`w-80 shrink-0 ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-xl flex flex-col gap-6 print:hidden`}>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <label className="block text-[10px] font-bold text-orange-600 mb-2 uppercase tracking-widest">
                  Data da Sessão Anterior
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={historyLookupDate}
                  onChange={(e) => setHistoryLookupDate(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className={`mt-4 p-5 rounded-2xl border ${patientId ? "border-orange-500/20 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/30"} h-[220px] flex flex-col print:hidden`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${patientId ? "bg-orange-500 animate-pulse" : "bg-zinc-600"}`} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resumo da Evolução</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {(() => {
                    const client = patients?.find((c: any) => String(c.id) === String(patientId) || c.name.toLowerCase() === patientSearch.toLowerCase());

                    if (!client) {
                      return <p className="text-xs text-zinc-600 italic text-center mt-8">Selecione um paciente para carregar o histórico clínico.</p>;
                    }

                    // Busca exata pela data selecionada
                    const exactEntry = client?.history?.find((h: any) => compareDates(h.date, historyLookupDate));

                    // Fallback: Se não houver na data, pega o registro mais recente (último)
                    const latestEntry = client?.history?.[client.history.length - 1];

                    const contentToShow = exactEntry?.content || latestEntry?.content || client?.notes;

                    if (!contentToShow) {
                      return <p className="text-xs text-zinc-500 italic mt-8 text-center">Nenhum registro clínico encontrado para o paciente.</p>;
                    }

                    return (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{contentToShow}</p>
                        <button
                          onClick={() => setPrescricao(prev => prev + "\n\nNotas da sessão anterior: " + contentToShow)}
                          className="text-[9px] font-bold text-orange-500 uppercase hover:underline block mt-2"
                        >
                          + Importar para a receita
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tipo de Receituário</label>
              <select value={tipoReceituario} onChange={(e) => setTipoReceituario(e.target.value)} className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}>
                <option value="simples">Receituário Simples</option>
                <option value="controle_especial">Receituário de Controle Especial</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Profissional Emitente</label>
              <select value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}>
                {professionals.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Paciente</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left shadow-sm`}
              >
                <span className="truncate pr-4">
                  {patientId
                    ? (() => {
                      const p = patients.find((pt: any) => String(pt.id) === String(patientId));
                      if (!p) return 'Selecione um paciente';
                      const cpfFormatted = p.cpf ? p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
                      return `${p.name}${cpfFormatted ? ` - CPF: ${cpfFormatted}` : ''}`;
                    })()
                    : 'Selecione um paciente'}
                </span>
                <ChevronDown size={18} className={`shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className={`absolute z-50 mt-2 w-full rounded-xl border ${isDarkMode ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200'} shadow-2xl overflow-hidden`}>
                  <div className={`p-3 border-b ${isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200/80'} relative`}>
                    <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Buscar Nome, CPF ou Tel..."
                      value={comboboxSearch}
                      onChange={(e) => setComboboxSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all ${isDarkMode
                        ? 'bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                    {comboboxSearch.length === 0 ? (
                      <p className={`text-center py-6 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        Digite nome, CPF ou Telefone para buscar.
                      </p>
                    ) : filteredPatientsForDropdown?.length === 0 ? (
                      <p className={`text-center py-6 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        Nenhum paciente encontrado com "{comboboxSearch}".
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPatientId('');
                            setPatientSearch('');
                            setIsDropdownOpen(false);
                            setComboboxSearch('');
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${!patientId
                            ? (isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600')
                            : (isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900')
                            }`}
                        >
                          Selecione um paciente
                        </button>

                        {filteredPatientsForDropdown?.map((p: any) => {
                          const isSelected = String(p.id) === String(patientId);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setPatientId(p.id);
                                setPatientSearch(p.name);
                                setIsDropdownOpen(false);
                                setComboboxSearch('');
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex flex-col justify-between items-start gap-1 ${isSelected
                                ? (isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600')
                                : (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white' : 'text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900')
                                }`}
                            >
                              <span className="font-semibold">{p.name}</span>
                              <div className="flex items-center gap-2 text-[10px] opacity-70 w-full justify-between font-mono">
                                <span>{p.cpf ? `CPF: ${p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}` : 'CPF: Não cadastrado'}</span>
                                <span>{p.phone || 'Tel: Não cadastrado'}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-zinc-200 rounded-2xl overflow-hidden shadow-inner flex flex-col relative">

            {/* WORD TOOLBAR FIXA NO TOPO */}
            <div className="w-full bg-white border-b border-zinc-300 shadow-sm p-3 z-10 print:hidden sticky top-0 flex justify-center">
              <div id="word-toolbar" className="ql-toolbar ql-snow flex items-center flex-wrap gap-2 border-none !bg-transparent p-0 m-0">
                <span className="ql-formats !mr-4 border border-zinc-200 rounded-md bg-zinc-50">
                  <select className="ql-header !text-sm" defaultValue="">
                    <option value="1">Título 1</option>
                    <option value="2">Título 2</option>
                    <option value="3">Título 3</option>
                    <option value="">Normal</option>
                  </select>
                </span>
                <span className="ql-formats !mr-4 border border-zinc-200 rounded-md bg-zinc-50 p-1">
                  <button className="ql-bold"></button>
                  <button className="ql-italic"></button>
                  <button className="ql-underline"></button>
                </span>
                <span className="ql-formats !mr-4 border border-zinc-200 rounded-md bg-zinc-50 p-1">
                  <button className="ql-list" value="ordered"></button>
                  <button className="ql-list" value="bullet"></button>
                </span>
                <span className="ql-formats border border-zinc-200 rounded-md bg-zinc-50 p-1">
                  <button className="ql-clean"></button>
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              {tipoReceituario === "simples" && (
                <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto p-12 flex flex-col relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000' }}>

                  {/* ═══ CABEÇALHO ═══ */}
                  <div className="flex justify-between items-start w-full mb-8">
                    {/* Esquerda: Logo + Identificação */}
                    <div className="flex flex-col w-1/2">
                      <div className="w-32 h-16 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs mb-4 rounded">LOGOTIPO</div>
                      <h2 className="text-2xl font-serif text-neutral-800 outline-none italic">{selectedProfessional?.name || 'Selecione um profissional'}</h2>
                      <p className="text-sm text-pink-600 font-medium outline-none">{selectedProfessional?.specialty || 'Especialidade'}</p>
                    </div>

                    {/* Direita: Caixa de Validação ITI / Via Digital */}
                    <div className="flex flex-col items-end">
                      <div className="border border-neutral-400 rounded-sm w-56">
                        {/* Topo da caixa: DATA + VIA DIGITAL */}
                        <div className="flex border-b border-neutral-400">
                          <div className="px-3 py-1.5 border-r border-neutral-400 text-[11px] font-bold text-neutral-700 whitespace-nowrap outline-none" contentEditable suppressContentEditableWarning>DATA:</div>
                          <div className="px-3 py-1.5 text-[9px] text-neutral-500 leading-tight">
                            <span className="font-bold block text-[10px] text-neutral-700">VIA DIGITAL</span>
                            Validar em: https://validar.iti.gov.br/
                          </div>
                        </div>
                        {/* Corpo: espaço QR Code */}
                        <div className="h-24 flex items-center justify-center text-neutral-300 text-xs">
                        </div>
                        {/* Rodapé da caixa */}
                        <div className="border-t border-neutral-400 text-center py-1.5">
                          <span className="text-[10px] font-bold text-neutral-600 tracking-wide uppercase">Assinatura Digital</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ═══ LINHA DO PACIENTE ═══ */}
                  <div className="w-full mb-6 text-sm flex items-end">
                    <span className="font-bold mr-2 whitespace-nowrap">Paciente:</span>
                    <div className="flex-1 border-b border-neutral-400 outline-none pb-1" contentEditable suppressContentEditableWarning>
                      {selectedPatientData?.name || 'Nome do Paciente'}
                    </div>
                  </div>

                  {/* ═══ MIOLO: EDITOR DE TEXTO ═══ */}
                  <div className="flex-1 w-full relative z-10">
                    <WordEditor value={prescricao} onChange={setPrescricao} />
                  </div>

                  {/* ═══ RODAPÉ (Ancorado no fundo) ═══ */}
                  <div className="mt-auto pt-8 flex justify-between items-end w-full text-[11px] text-neutral-800">
                    {/* Esquerda: Contatos */}
                    <div className="flex flex-col gap-1 outline-none" contentEditable suppressContentEditableWarning>
                      <span>📞 (00) 3300-0000</span>
                      <span>📱 (00) 99900-0000</span>
                      <span>✉️ atendimento@clinica.com</span>
                      <span>📍 Rua Brasil, 123 - Centro - Cidade/BR</span>
                    </div>
                    {/* Direita: Assinatura Manual */}
                    <div className="flex items-end mb-1">
                      <span className="font-bold uppercase text-[10px] mr-1">Assinatura</span>
                      <div className="w-48 border-b border-neutral-800"></div>
                    </div>
                  </div>

                </div>
              )}
              {tipoReceituario === "controle_especial" && (
                <div className="bg-[#ffffff] w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] text-zinc-900 font-sans relative">
                  <WordEditor value={prescricao} onChange={setPrescricao} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Hidden Print Container */}
      <div className="hidden print:block print-area w-[210mm] min-h-[297mm] bg-[#ffffff] text-zinc-900 p-[20mm]">
        <div dangerouslySetInnerHTML={{ __html: prescricao }} />
      </div>
    </div>
  );
};

export default ReceituarioView;

