import React, { useState, useRef } from 'react';
import {
  X, Calendar, Clock, User, Briefcase, CheckCircle2,
  Edit2, Copy, Trash2, Mic, Square, Eye, FileText,
  Package, DollarSign, MessageSquare, ChevronRight
} from 'lucide-react';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  appointment: any;
  professionals: any[];
  services: any[];
  patients: any[];
  isDarkMode: boolean;
  onClose: () => void;
  onEdit: (app: any) => void;
  onDuplicate: (app: any) => void;
  onDelete: (appId: any) => void;
  onComplete: (app: any, transcription: string) => void;
  onNavigateToPatient?: (patientId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  confirmed: { label: 'Confirmado', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <CheckCircle2 size={12} className="text-emerald-500" /> },
  scheduled: { label: 'Agendado', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: <Clock size={12} className="text-orange-400" /> },
  completed: { label: 'Concluído', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: <CheckCircle2 size={12} className="text-emerald-400" /> },
  cancelled: { label: 'Cancelado', color: 'text-red-500', bg: 'bg-red-500/10', icon: <X size={12} className="text-red-500" /> },
  waiting: { label: 'Aguardando', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <Square size={12} className="text-yellow-400 fill-current opacity-20" /> },
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${weekNames[d.getDay()]}, ${d.getDate()} de ${monthNames[d.getMonth()]} de ${d.getFullYear()}`;
};

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  appointment,
  professionals,
  services,
  patients,
  isDarkMode,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onComplete,
  onNavigateToPatient,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const recognitionRef = useRef<any>(null);
  const isRecordingIntent = useRef(false);
  const transcriptionRef = useRef(transcription);
  const baseTranscriptionRef = useRef('');

  React.useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  React.useEffect(() => {
    if (!isOpen) {
      setTranscription('');
      setIsRecording(false);
      isRecordingIntent.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  const professional = professionals.find(p => p.id === appointment.professionalId);
  const patient = patients?.find(p => (appointment.patientId && p.id === appointment.patientId) || p.name === appointment.patient);
  const appointmentServices = (appointment.serviceIds || [])
    .map((sid: string) => services.find(s => s.id === sid))
    .filter(Boolean);
  const totalValue = appointmentServices.reduce((sum: number, s: any) => sum + Number(s?.price || s?.valor || 0), 0);
  const statusKey = appointment.status || 'scheduled';
  const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.scheduled;

  const allMaterials: string[] = [];
  appointmentServices.forEach((s: any) => {
    if (s?.items) s.items.forEach((item: any) => allMaterials.push(item.name || item.itemId));
  });

  const handleRecordAudio = () => {
    if (isRecording) {
      isRecordingIntent.current = false;
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert('Navegador não suporta transcrição.');
    baseTranscriptionRef.current = transcriptionRef.current;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.onresult = (event: any) => {
      let complete = ''; let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) complete += event.results[i][0].transcript + ' ';
        else interim += event.results[i][0].transcript;
      }
      const base = baseTranscriptionRef.current ? baseTranscriptionRef.current.trim() + ' ' : '';
      const full = (base + complete + interim).trim();
      setTranscription(full);
      transcriptionRef.current = full;
    };
    recognition.onerror = () => { setIsRecording(false); isRecordingIntent.current = false; };
    recognition.onend = () => {
      if (isRecordingIntent.current) {
        setTimeout(() => { if (isRecordingIntent.current) recognition.start(); }, 200);
      } else { setIsRecording(false); }
    };
    isRecordingIntent.current = true;
    setIsRecording(true);
    recognition.start();
  };

  const base = isDarkMode ? 'bg-[#000000] border-white/[0.05] text-white' : 'bg-white border-neutral-200 text-neutral-900';
  const sub = isDarkMode ? 'text-neutral-500' : 'text-neutral-500';
  const row = isDarkMode ? 'border-white/[0.05]' : 'border-neutral-100';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className={`${base} border rounded-[32px] w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 duration-300`}>

        {/* Header - Minimalist Refinement */}
        <div className={`flex items-center justify-between px-8 py-7 shrink-0 border-b ${row}`}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
               <div className="w-2 h-2 rounded-full bg-orange-500" />
               <h2 className="text-xl font-bold tracking-tight">Detalhes do Agendamento</h2>
            </div>
            <div className={`flex items-center gap-3 text-xs font-medium ${sub} opacity-70`}>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-orange-500 opacity-60" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-orange-500 opacity-60" />
                <span>{appointment.time} — {appointment.endTime || '—'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-neutral-600 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body — Compact & Focused */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col divide-y divide-white/[0.03]">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.03]">
            
            {/* Column 1: Identification */}
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className={`text-[10px] uppercase font-bold tracking-widest ${sub} opacity-30`}>Identificação</div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-500 font-bold text-lg shrink-0 border border-orange-500/10">
                    {appointment.patient?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold truncate leading-tight tracking-tight">{appointment.patient}</div>
                    {patient?.phone && <div className={`text-[11px] font-medium mt-1 ${sub}`}>{patient.phone}</div>}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 relative" ref={statusDropdownRef}>
                <div className={`text-[10px] uppercase font-bold tracking-widest ${sub} opacity-30`}>Status</div>
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.color} border-current/10 hover:border-current/30 transition-all`}
                >
                  {statusCfg.icon}
                  {statusCfg.label}
                  <ChevronRight size={10} className={`ml-1 transition-transform ${isStatusDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 z-[100] w-48 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-neutral-200'}`}>
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => {
                            if (key === 'completed') {
                              onComplete(appointment, transcription);
                            } else {
                              // Handle other status changes via a new prop? 
                              // For now, let's focus on "Concluído" as requested.
                            }
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${statusKey === key 
                            ? 'bg-orange-500/10 text-orange-500' 
                            : isDarkMode ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Responsible */}
            <div className={`p-8 flex flex-col gap-6 ${isDarkMode ? 'bg-white/[0.005]' : ''}`}>
              <div className="flex flex-col gap-3">
                <div className={`text-[10px] uppercase font-bold tracking-widest ${sub} opacity-30`}>Responsável</div>
                {professional ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 border border-white/5"
                      style={{ backgroundColor: professional.color || '#f97316' }}
                    >
                      {professional.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold truncate tracking-tight">{professional.name}</div>
                      <div className={`text-[10px] font-medium mt-1 ${sub} uppercase tracking-wider`}>{professional.specialty}</div>
                    </div>
                  </div>
                ) : (
                   <span className="text-xs font-semibold py-3 opacity-30 uppercase tracking-widest">Sem profissional</span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <div className={`text-[10px] uppercase font-bold tracking-widest ${sub} opacity-30`}>Serviços</div>
                <div className="flex flex-wrap gap-2">
                  {appointmentServices.map((s: any) => (
                    <div key={s.id} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-neutral-50 border-neutral-200'}`}>
                      <CheckCircle2 size={11} className="text-orange-500 opacity-60" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Logistics */}
            <div className="p-8 flex flex-col gap-8">
               <div className="flex flex-col gap-2.5">
                  <div className={`text-[10px] uppercase font-bold tracking-widest ${sub} opacity-30`}>Logística</div>
                  {allMaterials.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {allMaterials.map((m, idx) => (
                        <span key={idx} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-white/5 text-neutral-500' : 'bg-neutral-100 text-neutral-600'}`}>
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium opacity-20 italic">Sem materiais</span>
                  )}
               </div>

               <div className="mt-auto">
                 <div className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${sub} opacity-30`}>Total Atendimento</div>
                 <div className="text-3xl font-bold text-orange-500 tracking-tighter">
                    <span className="text-sm mr-1 opacity-40 font-semibold tracking-normal">R$</span>
                    {totalValue.toFixed(2).replace('.', ',')}
                 </div>
               </div>
            </div>
          </div>

          {/* Notes Area — Refined Typing Section */}
          <div className="p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/5">
                    <MessageSquare size={16} className="text-orange-500 opacity-60" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold tracking-tight">Anotações Clinicals</h3>
                    <p className={`text-[10px] font-medium ${sub} opacity-40`}>Registros detalhados e prescrições</p>
                </div>
              </div>
              <button
                onClick={handleRecordAudio}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : isDarkMode 
                      ? 'bg-white/5 text-neutral-300 hover:bg-white/10' 
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {isRecording ? <Square size={11} className="fill-white" /> : <Mic size={11} strokeWidth={2.5} />}
                {isRecording ? 'Capturando...' : 'Gravar Áudio'}
              </button>
            </div>
            
            <div className={`relative rounded-[24px] border transition-all ${isDarkMode ? 'bg-white/[0.01] border-white/[0.05] focus-within:border-orange-500/20' : 'bg-neutral-50 border-neutral-100 focus-within:border-orange-500/20'}`}>
              <textarea
                value={transcription}
                onChange={e => setTranscription(e.target.value)}
                placeholder="Inicie o registro ou dite suas observações..."
                className={`w-full p-8 bg-transparent text-base font-medium resize-none focus:outline-none min-h-[160px] leading-relaxed tracking-tight ${isDarkMode ? 'text-neutral-400 placeholder:text-neutral-800' : 'text-neutral-600'}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className={`group flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03]' : 'bg-neutral-50 border-neutral-100 hover:bg-neutral-100'}`}>
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-orange-500 opacity-40" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Insumos</span>
                  </div>
                  <ChevronRight size={14} className={`${sub} opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all`} />
                </button>
                <button className={`group flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03]' : 'bg-neutral-50 border-neutral-100 hover:bg-neutral-100'}`}>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-orange-500 opacity-40" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Pré-atendimento</span>
                  </div>
                  <ChevronRight size={14} className={`${sub} opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all`} />
                </button>
            </div>
          </div>
        </div>

        {/* Footer — Sleek & Integrated Actions */}
        <div className={`shrink-0 px-8 py-8 border-t ${row} ${isDarkMode ? 'bg-[#050505]' : 'bg-neutral-50/30'}`}>
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            
            <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-2xl border border-white/5 w-full lg:w-auto">
              <button
                onClick={() => { onClose(); onEdit(appointment); }}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${isDarkMode ? 'text-neutral-500 hover:bg-white/5 hover:text-white' : 'text-neutral-500 hover:bg-black/5'}`}
              >
                Editar
              </button>
              <div className="w-px h-4 bg-white/5" />
              <button
                onClick={() => { onClose(); onDuplicate(appointment); }}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${isDarkMode ? 'text-neutral-500 hover:bg-white/5 hover:text-white' : 'text-neutral-500 hover:bg-black/5'}`}
              >
                Duplicar
              </button>
              <div className="w-px h-4 bg-white/5" />
              <button
                onClick={() => { onDelete(appointment.id); onClose(); }}
                className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-red-500/50 hover:bg-red-500/5 hover:text-red-500"
              >
                Excluir
              </button>
            </div>

            <div className="flex gap-4 w-full lg:flex-1 lg:justify-end">
              <button
                onClick={() => onComplete(appointment, transcription)}
                className="flex-[2] lg:flex-none lg:min-w-[240px] py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 size={18} />
                Finalizar Atendimento
              </button>
              <button
                className={`flex-1 lg:flex-none lg:px-8 py-5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/15 text-neutral-300' : 'bg-white border-neutral-200'}`}
              >
                Comanda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
