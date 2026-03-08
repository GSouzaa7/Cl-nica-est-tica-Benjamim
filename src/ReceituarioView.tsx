import React, { useState, useRef, useEffect } from 'react';
import { WordEditor } from './components/Receituario/WordEditor';
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
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  Calendar as CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered
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
  clinicConfig?: any;
}

const compareDates = (d1: string, d2: string) => {
  if (!d1 || !d2) return false;
  const format = (d: string) => new Date(d).toISOString().split('T')[0].replace(/-/g, '');
  try {
    const normalizeBR = (s: string) => s.includes('/') ? s.split('/').reverse().join('') : s.replace(/-/g, '');
    return normalizeBR(d1) === normalizeBR(d2);
  } catch { return false; }
};

const NativeRichTextEditor = ({ value, onChange, className }: { value: string; onChange: (val: string) => void; className?: string }) => {
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
    <>
      <style>{`
        .custom-editor-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor-content li {
          margin-bottom: 0.25rem !important;
        }
      `}</style>
      <div
        ref={editorRef}
        className={className || "w-full min-h-[400px] outline-none text-neutral-800 text-base leading-relaxed custom-editor-content"}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </>
  );
};

export const ReceituarioView = ({
  professionals,
  patients = [],
  selectedPatientId,
  isDarkMode = true,
  clinicConfig = {
    nomeFantasia: "EstéticaPro",
    telefone: "(11) 99999-9999",
    email: "contato@esteticapro.com",
    logradouro: "Av. Paulista",
    numero: "1000",
    complemento: "Sala 101",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "00000-000"
  }
}: ReceituarioViewProps) => {
  const [tipoReceituario, setTipoReceituario] = useState<"simples" | "controle_especial" | "antimicrobianos" | "requisicao_exames">("simples");
  const [patientId, setPatientId] = useState(selectedPatientId || '');
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id || '');
  const [prescricao, setPrescricao] = useState('');

  const [historyLookupDate, setHistoryLookupDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientSearch, setPatientSearch] = useState('');
  const [comboboxSearch, setComboboxSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isTipoDropdownOpen, setIsTipoDropdownOpen] = useState(false);
  const tipoDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTipo = (event: MouseEvent) => {
      if (tipoDropdownRef.current && !tipoDropdownRef.current.contains(event.target as Node)) {
        setIsTipoDropdownOpen(false);
      }
    };
    if (isTipoDropdownOpen) document.addEventListener('mousedown', handleClickOutsideTipo);
    return () => document.removeEventListener('mousedown', handleClickOutsideTipo);
  }, [isTipoDropdownOpen]);

  const [isProfDropdownOpen, setIsProfDropdownOpen] = useState(false);
  const profDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideProf = (event: MouseEvent) => {
      if (profDropdownRef.current && !profDropdownRef.current.contains(event.target as Node)) {
        setIsProfDropdownOpen(false);
      }
    };
    if (isProfDropdownOpen) document.addEventListener('mousedown', handleClickOutsideProf);
    return () => document.removeEventListener('mousedown', handleClickOutsideProf);
  }, [isProfDropdownOpen]);

  // Estados e Logica do Mini Calendário Popover
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideCalendar = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) document.addEventListener('mousedown', handleClickOutsideCalendar);
    return () => document.removeEventListener('mousedown', handleClickOutsideCalendar);
  }, [isCalendarOpen]);

  // Helpers Matematicos Date
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentMonthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Formatar a data atual selecionada para o display do botão
  const formatHeaderDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedCalendarDate(newDate);
    // Format to YYYY-MM-DD for historyLookupDate
    const formattedDate = newDate.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD
    setHistoryLookupDate(formattedDate);
    setIsCalendarOpen(false);
  };

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
            ${clinicConfig?.logoUrl
        ? `<img src="${clinicConfig.logoUrl}" style="max-height: 80px; max-width: 160px; object-fit: contain;" alt="Logotipo da Clínica" />`
        : `<div style="width: 120px; height: 60px; border: 1px dashed #d4d4d4; background: #fafafa; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #a3a3a3; font-weight: bold; text-transform: uppercase;">
              LOGOTIPO
            </div>`
      }
          </td>
        </tr>
      </table>
    `;

    const footer = `
      <div style="margin-top: auto; padding-top: 32px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-family: Arial, sans-serif; font-size: 10px; color: #a3a3a3; line-height: 1.6;">
          <div style="color: #737373; font-weight: 600; margin-bottom: 2px;">${clinicConfig.nomeFantasia}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px; vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style="color: #737373; font-weight: 500;">${clinicConfig.telefone}</span>
            <span style="color: #d4d4d4; margin: 0 4px;">•</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px; vertical-align: middle;"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            <span style="color: #737373; font-weight: 500;">${clinicConfig.email}</span>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px; margin-top: 2px; vertical-align: middle; flex-shrink: 0;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div style="color: #737373; font-weight: 500; display: flex; flex-direction: column;">
              <span>${clinicConfig.logradouro}, ${clinicConfig.numero}${clinicConfig.complemento ? ` - ${clinicConfig.complemento}` : ''} - ${clinicConfig.bairro}</span>
              <span>${clinicConfig.cidade}/${clinicConfig.estado} - CEP: ${clinicConfig.cep}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="border: 1px solid #a3a3a3; border-radius: 2px; width: 300px; height: 150px; margin-bottom: 16px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="display: flex; border-bottom: 1px solid #a3a3a3;">
              <div style="width: 30%; border-right: 1px solid #a3a3a3; padding: 6px; font-size: 10px; font-weight: bold; color: #404040;">DATA:</div>
              <div style="flex: 1; padding: 6px; font-size: 10px; font-weight: bold; color: #404040; background: #f9f9f9;">CARIMBO/ASSINATURA</div>
            </div>
          </div>
          <div style="display: flex; align-items: flex-end; font-family: Arial, sans-serif; width: 300px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; margin-right: 8px; line-height: 1;">ASSINATURA</span>
            <div style="flex: 1; border-bottom: 1px solid #000; height: 1px; margin-bottom: 2px;"></div>
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
      <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-zinc-100 border-zinc-200'}`}>
            <FileText className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-zinc-700'}`} />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Central de Receituários</h1>
            <p className={`text-[10px] uppercase font-bold tracking-[0.1em] ${isDarkMode ? 'text-white/40' : 'text-zinc-400'}`}>Gestão de Prescrições</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border rounded-lg ${isDarkMode ? 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border-white/10' : 'text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border-zinc-200'}`}
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all rounded-xl shadow-lg active:scale-95 border ${isDarkMode ? 'text-white bg-white/10 hover:bg-white/20 border-white/20' : 'text-white bg-orange-500 hover:bg-orange-600 border-orange-500'}`}
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

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <label className="block text-[10px] font-bold text-orange-600 mb-2 uppercase tracking-widest">
                  Data da Sessão
                </label>
                <div className="relative" ref={calendarRef}>
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all flex items-center justify-between"
                  >
                    <span className="font-medium tracking-wide">{formatHeaderDate(selectedCalendarDate)}</span>
                    <CalendarIcon size={16} className={`transition-transform duration-300 ${isCalendarOpen ? 'text-orange-500 scale-110' : 'text-zinc-500'}`} />
                  </button>

                  {/* Calendário Luminous Popover */}
                  {isCalendarOpen && (
                    <div className="absolute top-full mt-3 left-0 w-[280px] z-[9999] rounded-2xl border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden bg-[#121214] border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/30">
                        <button onClick={handlePrevMonth} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"><ChevronLeft size={16} strokeWidth={2.5} /></button>
                        <div className="font-bold text-sm text-white tracking-wide uppercase text-[11px]">
                          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button onClick={handleNextMonth} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"><ChevronRight size={16} strokeWidth={2.5} /></button>
                      </div>

                      <div className="p-4 bg-[#0a0a0a]">
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center border-b border-zinc-800/50 pb-2">
                          {weekDaysShort.map((day, i) => (
                            <div key={i} className="text-[10px] font-bold tracking-wider text-zinc-500">{day}</div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 pt-1">
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8" />
                          ))}

                          {Array.from({ length: currentMonthDays }).map((_, i) => {
                            const day = i + 1;
                            const isCurrentDay = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();
                            const isSelected = day === selectedCalendarDate.getDate() && viewDate.getMonth() === selectedCalendarDate.getMonth() && viewDate.getFullYear() === selectedCalendarDate.getFullYear();

                            return (
                              <button
                                key={day}
                                onClick={() => handleDateSelect(day)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium transition-all duration-200 relative group
                                  ${isSelected
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105"
                                    : isCurrentDay
                                      ? "bg-zinc-800 text-orange-400 border border-orange-500/20"
                                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                  }
                                `}
                              >
                                {day}
                                {!isSelected && !isCurrentDay && <span className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/5 transition-colors"></span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`mt-4 p-5 rounded-2xl border h-[220px] flex flex-col print:hidden ${patientId ? "border-orange-500/20 bg-orange-500/5" : isDarkMode ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"}`}>
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

            <div className="relative" ref={tipoDropdownRef}>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tipo de Receituário</label>
              {(() => {
                const tipoOptions = [
                  { value: 'simples', label: 'Receituário Simples' },
                  { value: 'controle_especial', label: 'Receituário de Controle Especial' },
                  { value: 'antimicrobianos', label: 'Receituário de Antimicrobianos' },
                  { value: 'requisicao_exames', label: 'Requisição de Exames' },
                ];
                const selectedLabel = tipoOptions.find(o => o.value === tipoReceituario)?.label || '';
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsTipoDropdownOpen(!isTipoDropdownOpen)}
                      className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm`}
                    >
                      <span>{selectedLabel}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isTipoDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTipoDropdownOpen && (
                      <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {tipoOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setTipoReceituario(opt.value as any); setIsTipoDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${tipoReceituario === opt.value
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="relative" ref={profDropdownRef}>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Profissional Emitente</label>
              {(() => {
                const selectedProfLabel = selectedProfessional?.name || 'Selecione';
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsProfDropdownOpen(!isProfDropdownOpen)}
                      className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm`}
                    >
                      <span>{selectedProfLabel}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isProfDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfDropdownOpen && (
                      <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {professionals.map((p: any) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setProfessionalId(String(p.id)); setIsProfDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${String(professionalId) === String(p.id)
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-neutral-200'}`}>
          {/* WORD STYLE TOOLBAR - FIXA NO TOPO DO PAINEL DIREITO */}
          <div id="custom-toolbar" className={`flex items-center justify-center gap-2 p-3 border-b w-full sticky top-0 z-50 print:hidden ${isDarkMode ? 'bg-[#050505] border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false, undefined); }} className={`${isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100'} hover:text-orange-500 transition-colors p-1.5 rounded`} title="Negrito">
              <Bold className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false, undefined); }} className={`${isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100'} hover:text-orange-500 transition-colors p-1.5 rounded`} title="Itálico">
              <Italic className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false, undefined); }} className={`${isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100'} hover:text-orange-500 transition-colors p-1.5 rounded`} title="Sublinhado">
              <Underline className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <span className={`w-px h-5 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-zinc-300'}`}></span>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertOrderedList', false, undefined); }} className={`${isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100'} hover:text-orange-500 transition-colors p-1.5 rounded`} title="Lista Numerada">
              <ListOrdered className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList', false, undefined); }} className={`${isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100'} hover:text-orange-500 transition-colors p-1.5 rounded`} title="Lista em Tópicos">
              <List className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>

          <div className={`flex-1 w-full overflow-y-auto py-10 flex justify-center ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-neutral-200'}`}>
            {tipoReceituario === "simples" && (
              <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto p-12 flex flex-col relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                {/* --- MARCA D'ÁGUA --- */}
                {clinicConfig?.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
                    <img src={clinicConfig.logoUrl} alt="Watermark" className="w-[12cm] h-[12cm] object-contain grayscale" />
                  </div>
                )}

                <div className="flex justify-between items-start w-full mb-8 relative z-10">
                  <div className="flex flex-col">
                    <h2 className="text-[26px] font-serif text-black outline-none italic leading-tight mb-1">{selectedProfessional?.name || 'Dr. Rafael Costa'}</h2>
                    <div className="flex flex-col text-[10px] text-black font-bold uppercase tracking-wider">
                      <span className="mb-0.5">{selectedProfessional?.specialty || 'DERMATOLOGISTA'}</span>
                      <span className="mb-0.5">
                        {selectedProfessional?.doc?.type || 'CRM'} {selectedProfessional?.doc?.uf || 'SP'} {selectedProfessional?.doc?.number || '11111'}
                      </span>
                      <span className="mb-0.5">
                        {selectedProfessional?.rqe?.numero ? `RQE ${selectedProfessional.rqe.numero}` : 'RQE 222222'}
                      </span>
                      <div className="flex gap-2 mt-1 lowercase font-medium text-black">
                        <span>{selectedProfessional?.phone || '11999999999'}</span>
                        <span>•</span>
                        <span>{selectedProfessional?.email || 'rafael@ig.com'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {clinicConfig?.logoUrl ? (
                      <img src={clinicConfig.logoUrl} alt="Logo da Clínica" className="max-h-20 max-w-[160px] object-contain" />
                    ) : (
                      <div className="w-32 h-16 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[10px] rounded uppercase tracking-tighter bg-neutral-50/50 font-bold">LOGOTIPO</div>
                    )}
                  </div>
                </div>

                <div className="w-full mb-6 text-sm flex items-end">
                  <span className="font-bold mr-2 whitespace-nowrap">Paciente:</span>
                  <div className="flex-1 border-b border-neutral-400 outline-none pb-1" contentEditable suppressContentEditableWarning>
                    {selectedPatientData?.name || 'Nome do Paciente'}
                  </div>
                </div>

                <div className="flex-1 w-full relative z-10 text-base">
                  <NativeRichTextEditor value={prescricao} onChange={setPrescricao} />
                </div>

                <div className="mt-auto pt-8 flex justify-between items-end w-full text-[11px] text-black">
                  <div className="flex flex-col gap-1.5 outline-none text-black text-[10px] font-medium mb-1" contentEditable suppressContentEditableWarning>
                    <div className="font-bold text-black">{clinicConfig.nomeFantasia}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Phone size={11} className="text-black shrink-0 stroke-[2.5]" />
                        <span className="truncate">{clinicConfig.telefone}</span>
                      </div>
                      <span className="text-black">•</span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail size={11} className="text-black shrink-0 stroke-[2.5]" />
                        <span className="truncate">{clinicConfig.email}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 min-w-0">
                      <MapPin size={11} className="text-black shrink-0 stroke-[2.5] mt-0.5" />
                      <div className="flex flex-col">
                        <span className="truncate">
                          {clinicConfig.logradouro}, {clinicConfig.numero}{clinicConfig.complemento ? ` - ${clinicConfig.complemento}` : ''} - {clinicConfig.bairro}
                        </span>
                        <span className="truncate">
                          {clinicConfig.cidade}/{clinicConfig.estado} - CEP: {clinicConfig.cep}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4 shrink-0 ml-4">
                    <div className="border border-neutral-400 rounded-sm w-[8cm] h-[4cm] overflow-hidden flex flex-col">
                      <div className="flex border-b border-neutral-400 shrink-0">
                        <div className="w-[30%] px-2 py-1.5 border-r border-neutral-400 text-[10px] font-bold text-black outline-none flex flex-col justify-center" contentEditable suppressContentEditableWarning>
                          <span>DATA:</span>
                        </div>
                        <div className="flex-1 px-2 py-1.5 text-[10px] font-bold text-black leading-tight outline-none flex items-center bg-gray-50/50" contentEditable suppressContentEditableWarning>
                          CARIMBO/ASSINATURA
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-black text-[9px]"></div>
                    </div>
                    <div className="flex items-end mb-1 w-[8cm]">
                      <span className="font-bold uppercase text-[10px] mr-2 leading-none">ASSINATURA</span>
                      <div className="flex-1 border-b border-neutral-800 mb-[1px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tipoReceituario === "controle_especial" && (
              <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto flex flex-col relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {/* --- MARCA D'ÁGUA --- */}
                {clinicConfig?.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
                    <img src={clinicConfig.logoUrl} alt="Watermark" className="w-[14cm] h-[14cm] object-contain grayscale" />
                  </div>
                )}

                {/* === BORDA EXTERNA === */}
                <div className="p-12 flex flex-col flex-1">

                  {/* === TÍTULO === */}
                  <div className="flex items-center justify-center gap-20 mb-5">
                    <h1 className="text-[22px] font-extrabold tracking-wide" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      RECEITUÁRIO DE CONTROLE ESPECIAL
                    </h1>
                    {clinicConfig?.logoUrl && (
                      <img src={clinicConfig.logoUrl} alt="Logo" className="max-h-24 max-w-[160px] object-contain" />
                    )}
                  </div>

                  {/* === TOPO: EMITENTE + VIAS/ASSINATURA === */}
                  <div className="flex gap-4 mb-6">
                    {/* QUADRO ESQUERDO: IDENTIFICAÇÃO DO EMITENTE */}
                    <div className="w-[55%] border-[1.5px] border-black flex flex-col">
                      <div className="bg-gray-100 border-b-[1.5px] border-black text-center py-1.5 text-[13px] font-bold tracking-wide">
                        IDENTIFICAÇÃO DO EMITENTE
                      </div>
                      <div className="p-3 text-[11px] leading-[2] space-y-0" contentEditable suppressContentEditableWarning>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">Nome Completo</span>
                          <span className="flex-1 border-b border-black">{selectedProfessional?.name || 'Dr. Rafael Costa'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold mr-1">CRM</span>
                          <span className="flex-1 border-b border-black">{selectedProfessional?.doc?.number || '11111'}</span>
                          <span className="font-semibold mr-1">UF</span>
                          <span className="w-10 border-b border-black text-center">{selectedProfessional?.doc?.uf || 'SP'}</span>
                          <span className="font-semibold mr-1">RQE</span>
                          <span className="text-center w-16 border-b border-black">{selectedProfessional?.rqe?.numero || '&nbsp;'}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1 whitespace-nowrap">Endereço Completo e Telefone</span>
                          <span className="flex-1 border-b border-black">{clinicConfig?.logradouro || ''}, {clinicConfig?.numero || ''} - {clinicConfig?.telefone || ''}</span>
                        </div>
                        <div className="border-b border-black w-full">&nbsp;</div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold mr-1">Cidade:</span>
                          <span className="flex-1 border-b border-black">{clinicConfig?.cidade || 'São Paulo'}</span>
                          <span className="font-semibold mr-1">UF:</span>
                          <span className="w-16 border-b border-black text-center">{clinicConfig?.estado || 'SP'}</span>
                        </div>
                      </div>
                    </div>

                    {/* QUADRO DIREITO: VIAS + ASSINATURA */}
                    <div className="w-[45%] flex flex-col justify-between py-2">
                      <div className="text-[13px] font-bold leading-relaxed">
                        <div>1a. VIA FARMÁCIA</div>
                        <div>2a. VIA PACIENTE</div>
                      </div>
                      <div className="mt-auto pt-4">
                        <div className="border-b border-black w-[85%] mx-auto mb-1"></div>
                        <div className="text-[9px] font-bold text-center tracking-wide">
                          ASSINATURA DO MÉDICO, DATA E CARIMBO
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === CORPO: PACIENTE / ENDEREÇO / PRESCRIÇÃO === */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-baseline mb-4 text-[12px]" contentEditable suppressContentEditableWarning>
                      <span className="font-bold mr-1">Paciente:</span>
                      <span className="flex-1 border-b border-black pb-0.5">{selectedPatientData?.name || ''}</span>
                    </div>
                    <div className="flex items-baseline mb-4 text-[12px]" contentEditable suppressContentEditableWarning>
                      <span className="font-bold mr-1">Endereço:</span>
                      <span className="flex-1 border-b border-black pb-0.5">&nbsp;</span>
                    </div>

                    {/* PRESCRIÇÃO LIVRE */}
                    <div className="flex items-baseline mb-2 text-[12px]">
                      <span className="font-bold mr-1">Prescrição:</span>
                    </div>
                    <div className="flex-1 relative">
                      <div className="relative z-10 w-full h-full">
                        <NativeRichTextEditor
                          value={prescricao}
                          onChange={setPrescricao}
                          className="w-full h-full min-h-[400px] outline-none text-[#000000] text-[15px] p-2 leading-[1.6] custom-editor-content bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* === RODAPÉ: COMPRADOR + FORNECEDOR === */}
                  <div className="flex gap-0 mt-6">
                    {/* QUADRO ESQUERDO: IDENTIFICAÇÃO DO COMPRADOR */}
                    <div className="w-1/2 border-[1.5px] border-black flex flex-col">
                      <div className="bg-gray-100 border-b-[1.5px] border-black text-center py-1.5 text-[12px] font-bold tracking-wide">
                        IDENTIFICAÇÃO DO COMPRADOR
                      </div>
                      <div className="p-3 text-[10px] leading-[2.2] space-y-0" contentEditable suppressContentEditableWarning>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">Nome</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="border-b border-black w-full">&nbsp;</div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold mr-1">Ident.:</span>
                          <span className="w-24 border-b border-black">&nbsp;</span>
                          <span className="font-semibold mr-1">Órgão Emissor:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">End.:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold mr-1">Cidade:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                          <span className="font-semibold mr-1">UF:</span>
                          <span className="w-10 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">Telefone:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                    </div>

                    {/* QUADRO DIREITO: IDENTIFICAÇÃO DO FORNECEDOR */}
                    <div className="w-1/2 border-[1.5px] border-black border-l-0 flex flex-col">
                      <div className="bg-gray-100 border-b-[1.5px] border-black text-center py-1.5 text-[12px] font-bold tracking-wide">
                        IDENTIFICAÇÃO DO FORNECEDOR
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-end text-[10px]">
                        <div className="mt-auto">
                          <div className="flex items-end gap-4">
                            <div className="flex-1">
                              <div className="border-b border-black w-full mb-1"></div>
                              <div className="text-[9px] font-bold text-center tracking-wider">
                                ASSINATURA DO FARMACÊUTICO
                              </div>
                            </div>
                            <div className="shrink-0">
                              <div className="text-[9px] font-bold">
                                DATA ___/___/___
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
            {tipoReceituario === "antimicrobianos" && (
              <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto flex flex-col relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                <div className="p-8 flex flex-col flex-1">

                  {/* === TÍTULO === */}
                  <h1 className="text-center text-[24px] font-extrabold tracking-wider mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    RECEITUÁRIO DE ANTIMICROBIANOS
                  </h1>

                  {/* === IDENTIFICAÇÃO DO PACIENTE + VIA DIGITAL === */}
                  <div className="flex gap-0 mb-5">
                    <div className="flex-1 border-[1.5px] border-black">
                      <div className="bg-gray-100 border-b-[1.5px] border-black px-3 py-1 text-[11px] font-bold tracking-wide">
                        IDENTIFICAÇÃO DO PACIENTE
                      </div>
                      <div className="p-3 text-[10px] leading-[2]" contentEditable suppressContentEditableWarning>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">NOME COMPLETO:</span>
                          <span className="flex-1 border-b border-black">{selectedPatientData?.name || ''}</span>
                        </div>
                        <div className="flex items-baseline gap-6">
                          <div className="flex items-baseline">
                            <span className="font-semibold mr-1">IDADE:</span>
                            <span className="w-20 border-b border-black">&nbsp;</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="font-semibold mr-1">SEXO:</span>
                            <span className="w-28 border-b border-black">&nbsp;</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[140px] border-[1.5px] border-black border-l-0 flex flex-col items-center justify-center p-2 text-center">
                    </div>
                  </div>

                  {/* === 3 BLOCOS DE MEDICAMENTO === */}
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="border-[1.5px] border-black mb-4 p-3 text-[10px] leading-[1.9]" contentEditable suppressContentEditableWarning>
                      <div className="flex items-baseline mb-0.5">
                        <span className="font-bold mr-1 whitespace-nowrap">NOME DO MEDICAMENTO OU DA SUBSTÂNCIA PRESCRITA (DCB):</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                      <div className="flex items-baseline mb-0.5">
                        <span className="font-bold mr-1">DOSE OU CONCENTRAÇÃO:</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                      <div className="flex items-baseline gap-4 mb-0.5">
                        <div className="flex items-baseline flex-1">
                          <span className="font-bold mr-1 whitespace-nowrap">FORMA FARMACÊUTICA:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline flex-1">
                          <span className="font-bold mr-1 whitespace-nowrap">VIA DE ADMINISTRAÇÃO:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                      <div className="flex items-baseline mb-0.5">
                        <span className="font-bold mr-1">POSOLOGIA:</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                      <div className="flex items-baseline gap-4 mb-0.5">
                        <div className="flex items-baseline">
                          <span className="font-bold mr-1">QUANTIDADE:</span>
                          <span className="w-28 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline flex-1">
                          <span className="font-bold mr-1 whitespace-nowrap">DURAÇÃO DO TRATAMENTO:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="font-bold mr-1">OBS:</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                    </div>
                  ))}

                  {/* === IDENTIFICAÇÃO DO EMITENTE === */}
                  <div className="flex gap-0 mb-4 mt-auto">
                    <div className="flex-1 border-[1.5px] border-black">
                      <div className="bg-gray-100 border-b-[1.5px] border-black text-center py-1 text-[11px] font-bold tracking-wide">
                        IDENTIFICAÇÃO DO EMITENTE
                      </div>
                      <div className="flex">
                        <div className="flex-1 p-3 text-[10px] leading-[2]" contentEditable suppressContentEditableWarning>
                          <div className="flex items-baseline">
                            <span className="font-semibold mr-1">NOME MÉDICO(A):</span>
                            <span className="flex-1 border-b border-black">{selectedProfessional?.name || ''}</span>
                          </div>
                          <div className="flex items-baseline gap-4">
                            <div className="flex items-baseline">
                              <span className="font-semibold mr-1">CRM:</span>
                              <span className="w-28 border-b border-black">{selectedProfessional?.doc?.number || ''}</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="font-semibold mr-1">UF:</span>
                              <span className="w-10 border-b border-black text-center">{selectedProfessional?.doc?.uf || ''}</span>
                            </div>
                          </div>
                          <div className="flex items-baseline">
                            <span className="font-semibold mr-1">ENDEREÇO:</span>
                            <span className="flex-1 border-b border-black">{clinicConfig?.logradouro || ''}, {clinicConfig?.numero || ''}</span>
                          </div>
                          <div className="flex items-baseline gap-4">
                            <div className="flex items-baseline flex-1">
                              <span className="font-semibold mr-1">CIDADE:</span>
                              <span className="flex-1 border-b border-black">{clinicConfig?.cidade || ''}</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="font-semibold mr-1">UF:</span>
                              <span className="w-10 border-b border-black text-center">{clinicConfig?.estado || ''}</span>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-4">
                            <div className="flex items-baseline">
                              <span className="font-semibold mr-1">TELEFONE:</span>
                              <span className="w-32 border-b border-black">{clinicConfig?.telefone || ''}</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="font-semibold mr-1">DATA EMISSÃO:</span>
                              <span className="w-28 border-b border-black">&nbsp;</span>
                            </div>
                          </div>
                        </div>
                        {/* Logo / dados do local */}
                        <div className="w-[180px] border-l-[1.5px] border-black flex flex-col items-center justify-center p-3 text-center">
                          {clinicConfig?.logoUrl ? (
                            <img src={clinicConfig.logoUrl} alt="Logo da Clínica" className="max-h-20 max-w-[160px] object-contain" />
                          ) : (
                            <div className="w-32 h-16 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[10px] rounded uppercase tracking-tighter bg-neutral-50/50 font-bold">LOGOTIPO</div>
                          )}
                        </div>
                      </div>
                      <div className="border-t-[1.5px] border-black flex">
                        <div className="flex-1 px-3 py-1 text-[9px] font-bold text-right">ASSINATURA MÉDICO(A)</div>
                      </div>
                    </div>
                  </div>

                  {/* === IDENTIFICAÇÃO DO FORNECEDOR === */}
                  <div className="border-[1.5px] border-black mb-3">
                    <div className="bg-gray-100 border-b-[1.5px] border-black text-center py-1 text-[11px] font-bold tracking-wide">
                      IDENTIFICAÇÃO DO FORNECEDOR
                    </div>
                    <div className="p-3 text-[10px] leading-[2]" contentEditable suppressContentEditableWarning>
                      <div className="flex items-baseline gap-4">
                        <div className="flex items-baseline flex-1">
                          <span className="font-semibold mr-1">NOME FARMACÊUTICO(A):</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">CRF:</span>
                          <span className="w-16 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">UF:</span>
                          <span className="w-10 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <div className="flex items-baseline flex-1">
                          <span className="font-semibold mr-1">NOME FARMÁCIA:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">CNPJ:</span>
                          <span className="w-36 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="font-semibold mr-1">ENDEREÇO:</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <div className="flex items-baseline flex-1">
                          <span className="font-semibold mr-1">CIDADE:</span>
                          <span className="flex-1 border-b border-black">&nbsp;</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-semibold mr-1">UF:</span>
                          <span className="w-10 border-b border-black">&nbsp;</span>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="font-semibold mr-1">TELEFONE:</span>
                        <span className="flex-1 border-b border-black">&nbsp;</span>
                      </div>
                    </div>
                    <div className="border-t-[1.5px] border-black flex justify-end px-3 py-1">
                      <div className="text-[9px] font-bold">ASSINATURA FARMACÊUTICO(A)</div>
                    </div>
                  </div>

                  {/* === RODAPÉ VERSÃO === */}
                  <div className="text-center text-[8px] text-gray-500 font-medium tracking-wider mt-1">
                    VERSÃO 2.0 | ABRIL DE 2020
                  </div>

                </div>
              </div>
            )}
            {tipoReceituario === "requisicao_exames" && (
              <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-[#ffffff] text-[#000000] shadow-2xl mx-auto flex flex-col items-center py-16 px-8 relative font-sans" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {/* --- MARCA D'ÁGUA --- */}
                {clinicConfig?.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
                    <img src={clinicConfig.logoUrl} alt="Watermark" className="w-[12cm] h-[12cm] object-contain grayscale" />
                  </div>
                )}

                {/* Única Via Centralizada */}
                <div className="w-full max-w-[15cm] flex flex-col flex-1">
                  {/* Ícone + Título */}
                  <div className="flex flex-col items-center mb-8">
                    {clinicConfig?.logoUrl ? (
                      <img src={clinicConfig.logoUrl} alt="Logo da Clínica" className="max-h-16 max-w-[160px] object-contain mb-2" />
                    ) : (
                      <div className="w-32 h-12 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[10px] rounded uppercase tracking-tighter bg-neutral-50/50 font-bold mb-2">LOGOTIPO</div>
                    )}
                    <h2 className="text-[14px] font-bold tracking-wide text-center">REQUISIÇÃO DE EXAMES</h2>
                  </div>
                  {/* Paciente */}
                  <div className="mb-1 text-[11px] italic" contentEditable suppressContentEditableWarning>
                    <div className="flex items-baseline mb-1">
                      <span className="font-semibold mr-1">Paciente:</span>
                      <span className="flex-1 border-b border-black">{selectedPatientData?.name || ''}</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <div className="flex items-baseline">
                        <span className="font-semibold mr-1">Idade:</span>
                        <span className="w-24 border-b border-black">&nbsp;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold mr-1">Sexo:</span>
                        <span className="w-4 h-4 border border-black inline-block"></span><span className="text-[10px] ml-0.5">F</span>
                        <span className="w-4 h-4 border border-black inline-block ml-2"></span><span className="text-[10px] ml-0.5">M</span>
                      </div>
                    </div>
                  </div>
                  {/* Exame Solicitado */}
                  <div className="mt-6 mb-2 text-[11px] italic font-semibold">Exame Solicitado:</div>
                  <div className="flex-1 border border-black rounded-sm min-h-[220px] p-2 text-[11px]" contentEditable suppressContentEditableWarning>&nbsp;</div>
                  {/* Assinatura */}
                  <div className="mt-auto pt-6 flex flex-col items-center w-full">
                    <div className="border border-neutral-400 rounded-sm w-full h-[4cm] overflow-hidden flex flex-col">
                      <div className="flex border-b border-neutral-400 shrink-0">
                        <div className="w-[30%] px-2 py-1.5 border-r border-neutral-400 text-[10px] font-bold text-black outline-none flex flex-col justify-center" contentEditable suppressContentEditableWarning>
                          <span>DATA:</span>
                        </div>
                        <div className="flex-1 px-2 py-1.5 text-[10px] font-bold text-black leading-tight outline-none flex items-center bg-gray-50/50" contentEditable suppressContentEditableWarning>
                          CARIMBO/ASSINATURA
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-black text-[9px]"></div>
                    </div>
                    <div className="flex items-end mt-4 w-full">
                      <span className="font-bold uppercase text-[10px] mr-2 leading-none">ASSINATURA</span>
                      <div className="flex-1 border-b border-neutral-800 mb-[1px]"></div>
                    </div>
                  </div>
                </div>
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


