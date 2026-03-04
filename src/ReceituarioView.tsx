import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  User,
  Calendar,
  Clipboard,
  Clock,
  History,
  Plus,
  Search,
  ChevronRight,
  Stethoscope,
  PenTool,
  Save,
  Trash2,
  FileDown,
  ChevronDown
} from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  doc: {
    type: string;
    uf: string;
    number: string;
  };
  rqe?: {
    numero: string;
    uf: string;
  };
  phone?: string;
  email?: string;
}

interface Patient {
  id: string;
  name: string;
  cpf?: string;
  phone?: string;
  history?: any[];
  notes?: string;
}

interface ReceituarioViewProps {
  professionals: Professional[];
  patients?: Patient[];
  selectedPatientId?: string;
  isDarkMode?: boolean;
}

const compareDates = (d1: string, d2: string) => {
  if (!d1 || !d2) return false;
  const format = (d: string) => new Date(d).toISOString().split('T')[0].replace(/-/g, '');
  try {
    const normalizeBR = (s: string) => s.includes('/') ? s.split('/').reverse().join('') : s.replace(/-/g, '');
    return normalizeBR(d1) === normalizeBR(d2);
  } catch { return false; }
};

const WordEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      className="w-full min-h-[500px] outline-none text-neutral-800 text-base leading-relaxed"
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
    />
  );
};

export const ReceituarioView = ({ professionals, patients = [], selectedPatientId, isDarkMode = true }: ReceituarioViewProps) => {
  const [tipoReceituario, setTipoReceituario] = useState<"simples" | "controle_especial">("simples");
  const [patientId, setPatientId] = useState(selectedPatientId || '');
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id || '');
  const [prescricao, setPrescricao] = useState('<p style="font-size: 1.125rem; font-weight: 500; margin-bottom: 1.5rem;">Uso Oral</p><p><strong>1. Medicamento Exemplo 500mg</strong> ........... 1 caixa</p><p style="margin-left: 2rem; color: #4b5563; font-size: 0.875rem; margin-bottom: 1.5rem;">Tomar 01 comprimido de 12 em 12 horas por 05 dias.</p><p><strong>2. Outro Medicamento Exemplo</strong> ........... 2 frascos</p><p style="margin-left: 2rem; color: #4b5563; font-size: 0.875rem;">Aplicar nas áreas afetadas 02 vezes ao dia.</p>');

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
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const cpfRaw = (p.cpf || '');
    const cpfMatch = cpfRaw ? (cpfRaw.includes(term) || cpfRaw.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) : false;
    const phoneRaw = (p.phone || '');
    const phoneMatch = phoneRaw ? (phoneRaw.includes(term) || phoneRaw.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) : false;
    return nameMatch || cpfMatch || phoneMatch;
  });

  const selectedPatientData = patients?.find((p: any) => String(p.id) === String(patientId)) || (patientId ? { name: patientSearch || "Paciente Exemplo Select" } : null);
  const selectedProfessional = professionals.find(p => String(p.id) === String(professionalId)) || professionals[0];

  const generateTemplate = () => {
    const profName = selectedProfessional?.name || 'Dr. Rafael Costa';
    const profSpec = selectedProfessional?.specialty || 'DERMATOLOGISTA';
    const patName = selectedPatientData?.name || 'Nome do Paciente';
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const header = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <tr>
          <td style="vertical-align: top; text-align: left;">
            <h2 style="font-family: 'Times New Roman', serif; font-style: italic; font-size: 26px; color: #262626; margin: 0 0 4px 0;">${profName}</h2>
            <div style="font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">
              <div style="margin-bottom: 2px;">${profSpec}</div>
              <div style="margin-bottom: 2px;">${selectedProfessional?.doc?.type || 'CRM'} ${selectedProfessional?.doc?.uf || 'SP'} ${selectedProfessional?.doc?.number || '11111'}</div>
              ${selectedProfessional?.rqe?.numero ? `<div style="margin-bottom: 2px;">RQE ${selectedProfessional.rqe.numero}</div>` : '<div>RQE 222222</div>'}
              <div style="margin-top: 4px; font-weight: 500; color: #a3a3a3; text-transform: lowercase;">
                ${selectedProfessional?.phone || '11999999999'} • ${selectedProfessional?.email || 'rafael@ig.com'}
              </div>
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 130px;">
            <div style="width: 120px; height: 60px; border: 1px dashed #d4d4d4; background: #fafafa; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #a3a3a3; font-weight: bold; text-transform: uppercase;">
              LOGOTIPO
            </div>
          </td>
        </tr>
      </table>
    `;

    const footer = `
      <div style="margin-top: auto; padding-top: 32px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-family: Arial, sans-serif; font-size: 9px; color: #a3a3a3; line-height: 1.5;">
          <div>📞 ${selectedProfessional?.phone || '(11) 99999-9999'} • ✉️ ${selectedProfessional?.email || 'contato@clinica.com'}</div>
          <div>📍 Rua Brasil, 123 - Centro - Cidade/BR</div>
        </div>
        <div style="text-align: right;">
          <div style="border: 1px solid #a3a3a3; border-radius: 2px; width: 300px; height: 150px; margin-bottom: 16px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="display: flex; border-bottom: 1px solid #a3a3a3;">
              <div style="width: 30%; border-right: 1px solid #a3a3a3; padding: 6px; font-size: 10px; font-weight: bold; color: #404040;">DATA:</div>
              <div style="flex: 1; padding: 6px; font-size: 10px; font-weight: bold; color: #404040; background: #f9f9f9;">CARIMBO/ASSINATURA</div>
            </div>
          </div>
          <div style="display: flex; align-items: flex-end; font-family: Arial, sans-serif;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; margin-right: 4px;">Assinatura</span>
            <div style="width: 200px; border-bottom: 1px solid #000;"></div>
          </div>
        </div>
      </div>
    `;

    const patientLine = `
      <div style="margin-bottom: 24px; font-family: Arial, sans-serif; font-size: 14px; display: flex; align-items: flex-end;">
        <span style="font-weight: bold; margin-right: 8px;">Paciente:</span>
        <div style="flex: 1; border-bottom: 1px solid #a3a3a3; padding-bottom: 4px;">${patName}</div>
      </div>
    `;

    return `
      <div style="font-family: Arial, sans-serif; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 40px; background: #fff; box-sizing: border-box; display: flex; flex-direction: column;">
        ${header}
        ${patientLine}
        <div style="flex: 1; min-height: 400px; line-height: 1.6; font-size: 16px; color: #262626;">
          ${prescricao}
        </div>
        ${footer}
      </div>
    `;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const template = generateTemplate();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receituário - ${selectedPatientData?.name || 'Paciente'}</title>
            <style>
              body { margin: 0; padding: 0; }
              @page { size: A4; margin: 0; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${template}
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa]">
      <div className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-sm border border-white/10">
            <FileText className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none mb-1">Central de Receituários</h1>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.1em]">Gestão de Prescrições • Aura Medical</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-xl shadow-lg active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir A4
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* BARRA LATERAL RESTAURADA DO COMMIT "edição word 1.1" */}
        <div className={`w-80 shrink-0 ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-zinc-200'} border-r flex flex-col overflow-y-auto`}>
          <div className="p-6 space-y-8">
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

                    const exactEntry = client?.history?.find((h: any) => compareDates(h.date, historyLookupDate));
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
              <select value={tipoReceituario} onChange={(e) => setTipoReceituario(e.target.value as any)} className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}>
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
                      const p = patients?.find((pt: any) => String(pt.id) === String(patientId));
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
        </div>

        <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl border border-white z-50 flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-neutral-200 pr-6 uppercase tracking-[0.2em] font-black text-[10px] text-neutral-800">
              Formatação
            </div>
            <div className="flex items-center gap-4 text-neutral-400">
              <span className="cursor-pointer hover:text-neutral-900 transition-colors font-bold">B</span>
              <span className="cursor-pointer hover:text-neutral-900 transition-colors italic">I</span>
              <span className="cursor-pointer hover:text-neutral-900 transition-colors underline underline-offset-4">U</span>
              <div className="w-px h-4 bg-neutral-200 mx-1"></div>
              <span className="cursor-pointer hover:text-neutral-900 transition-colors flex items-center gap-1 text-[10px] font-black tracking-tighter">
                F <History className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            {tipoReceituario === "simples" && (
              <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto p-12 flex flex-col relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <div className="flex justify-between items-start w-full mb-8">
                  <div className="flex flex-col">
                    <h2 className="text-[26px] font-serif text-neutral-800 outline-none italic leading-tight mb-1">{selectedProfessional?.name || 'Dr. Rafael Costa'}</h2>
                    <div className="flex flex-col text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      <span className="mb-0.5">{selectedProfessional?.specialty || 'DERMATOLOGISTA'}</span>
                      <span className="mb-0.5">
                        {selectedProfessional?.doc?.type || 'CRM'} {selectedProfessional?.doc?.uf || 'SP'} {selectedProfessional?.doc?.number || '11111'}
                      </span>
                      <span className="mb-0.5">
                        {selectedProfessional?.rqe?.numero ? `RQE ${selectedProfessional.rqe.numero}` : 'RQE 222222'}
                      </span>
                      <div className="flex gap-2 mt-1 lowercase font-medium text-neutral-400">
                        <span>{selectedProfessional?.phone || '11999999999'}</span>
                        <span>•</span>
                        <span>{selectedProfessional?.email || 'rafael@ig.com'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-32 h-16 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[10px] rounded uppercase tracking-tighter bg-neutral-50/50 font-bold">LOGOTIPO</div>
                  </div>
                </div>

                <div className="w-full mb-6 text-sm flex items-end">
                  <span className="font-bold mr-2 whitespace-nowrap">Paciente:</span>
                  <div className="flex-1 border-b border-neutral-400 outline-none pb-1" contentEditable suppressContentEditableWarning>
                    {selectedPatientData?.name || 'Nome do Paciente'}
                  </div>
                </div>

                <div className="flex-1 w-full relative z-10 text-base">
                  <WordEditor value={prescricao} onChange={setPrescricao} />
                </div>

                <div className="mt-auto pt-8 flex justify-between items-end w-full text-[11px] text-neutral-800">
                  <div className="flex flex-col gap-1 outline-none text-neutral-400 text-[9px]" contentEditable suppressContentEditableWarning>
                    <div className="flex items-center gap-2">
                      <span>📞 {selectedProfessional?.phone || '(11) 99999-9999'}</span>
                      <span>•</span>
                      <span>✉️ {selectedProfessional?.email || 'contato@clinica.com'}</span>
                    </div>
                    <span>📍 Rua Brasil, 123 - Centro - Cidade/BR</span>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="border border-neutral-400 rounded-sm w-[8cm] h-[4cm] overflow-hidden flex flex-col">
                      <div className="flex border-b border-neutral-400 shrink-0">
                        <div className="w-[30%] px-2 py-1.5 border-r border-neutral-400 text-[10px] font-bold text-neutral-700 outline-none flex flex-col justify-center" contentEditable suppressContentEditableWarning>
                          <span>DATA:</span>
                        </div>
                        <div className="flex-1 px-2 py-1.5 text-[10px] font-bold text-neutral-700 leading-tight outline-none flex items-center bg-gray-50/50" contentEditable suppressContentEditableWarning>
                          CARIMBO/ASSINATURA
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-neutral-300 text-[9px]"></div>
                    </div>
                    <div className="flex items-end mb-1">
                      <span className="font-bold uppercase text-[10px] mr-1">Assinatura</span>
                      <div className="w-48 border-b border-neutral-800"></div>
                    </div>
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

      <div className="hidden print:block print-area w-[210mm] min-h-[297mm] bg-[#ffffff] text-zinc-900 p-[20mm]">
        <div dangerouslySetInnerHTML={{ __html: prescricao }} />
      </div>
    </div>
  );
};


