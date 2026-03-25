import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Search, ChevronDown, Trash2, User, Clock, Settings, AlertCircle, Calendar as CalendarIcon, Check, CheckCircle2, RotateCcw, Pause, Play, UserX, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { MiniCalendar } from '../ui/MiniCalendar';
import { PremiumSelect } from '../ui/PremiumSelect';

// Helper functions for time manipulation
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + (minutes || 0);
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const addMinutesToTime = (time: string, mins: number): string => {
  return minutesToTime(timeToMinutes(time) + mins);
};

const generateTimeOptions = (step: number = 15) => {
  const options = [];
  for (let i = 0; i < 24 * 60; i += step) {
    options.push(minutesToTime(i));
  }
  return options;
};

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  isDarkMode: boolean;
  label: string;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, isDarkMode, label, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      {label && <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">{label}</span>}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-4 pr-11 py-3.5 rounded-xl border text-sm transition-all flex items-center justify-between
            ${disabled ? (isDarkMode ? 'opacity-30' : 'opacity-40 bg-neutral-100') : ''}
            ${isDarkMode
              ? 'bg-black border-white/5 text-white focus:border-orange-500/50'
              : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
            outline-none
          `}
        >
          {value}
          <Clock size={16} className="text-neutral-500" />
        </button>

        {isOpen && (
          <div className={`
            absolute top-full left-0 right-0 mt-2 z-[70] rounded-xl border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200
            ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-neutral-200'}
          `}>
            <div className="p-2 flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
              {timeOptions.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    onChange(time);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2.5 text-left text-xs font-semibold rounded-lg transition-all flex items-center justify-between
                    ${value === time
                      ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                      : isDarkMode ? 'text-white hover:bg-white/5' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}
                  `}
                >
                  {time}
                  {value === time && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string, label: string }[];
  isDarkMode: boolean;
  label?: string;
  className?: string;
}

// Removed CustomSelect in favor of global PremiumSelect

const STATUS_OPTIONS = [
  { value: 'Agendado', label: 'Agendado', color: '#f97316', icon: Clock },
  { value: 'Confirmado', label: 'Confirmado', color: '#3b82f6', icon: CheckCircle2 },
  { value: 'Remarcado', label: 'Remarcado', color: '#f59e0b', icon: RotateCcw },
  { value: 'Cancelado', label: 'Cancelado', color: '#ef4444', icon: AlertCircle },
  { value: 'Não compareceu', label: 'Não compareceu', color: '#737373', icon: UserX },
  { value: 'Aguardando', label: 'Aguardando', color: '#0ea5e9', icon: Pause },
  { value: 'Em atendimento', label: 'Em atendimento', color: '#eab308', icon: Play },
  { value: 'Concluído', label: 'Concluído', color: '#22c55e', icon: CheckCircle2 },
];

const StatusSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
  isDarkMode: boolean;
  label?: string;
}> = ({ value, onChange, isDarkMode, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = STATUS_OPTIONS.find(opt => opt.value === value) || STATUS_OPTIONS[0];
  const Icon = selectedOption.icon;

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      {label && <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-5 pr-10 py-3.5 rounded-2xl border text-sm transition-all flex items-center justify-between group
            ${isDarkMode
              ? 'bg-[#0A0A0B] border-white/5 text-white hover:border-orange-500/30'
              : 'bg-neutral-50 border-neutral-200 text-neutral-900 hover:border-orange-400'}
            outline-none
          `}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
               <Icon size={16} className="text-neutral-500" />
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0B]" style={{ backgroundColor: selectedOption.color }} />
            </div>
            <span className="truncate font-medium">{selectedOption.label}</span>
          </div>
          <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 group-hover:text-orange-500 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`
            absolute top-full left-0 right-0 mt-2 z-[150] rounded-2xl border overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200
            ${isDarkMode ? 'bg-[#0A0A0B] border-white/10 shadow-black/80' : 'bg-white border-neutral-200'}
          `}>
            <div className="p-1.5 flex flex-col gap-1 max-h-72 overflow-y-auto custom-scrollbar">
              {STATUS_OPTIONS.map(opt => {
                const OptIcon = opt.icon;
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 text-left text-xs font-semibold rounded-xl transition-all flex items-center justify-between group
                      ${isSelected
                        ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                        : isDarkMode ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <OptIcon size={16} className={isSelected ? 'text-orange-500' : 'text-neutral-500 group-hover:text-neutral-400'} />
                        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${isSelected ? 'border-orange-950' : 'border-[#0A0A0B]'}`} style={{ backgroundColor: opt.color }} />
                      </div>
                      {opt.label}
                    </div>
                    {isSelected && <Check size={14} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  professionals: any[];
  services: any[];
  patients: any[];
  isDarkMode: boolean;
  initialDate?: Date;
  initialTime?: string;
  initialPatientName?: string;
  initialProfessionalId?: string;
  initialServiceIds?: string[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  professionals,
  services,
  patients,
  isDarkMode,
  initialDate,
  initialTime,
  initialPatientName = '',
  initialProfessionalId = '',
  initialServiceIds = []
}) => {
  const [type, setType] = useState<'Agendamento' | 'Bloqueio' | 'Lembrete' | 'Evento'>('Agendamento');
  const [patientId, setPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState(initialPatientName);
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [professionalId, setProfessionalId] = useState(initialProfessionalId);
  const [status, setStatus] = useState('Agendado');
  const [color, setColor] = useState('Padrão');
  const [observations, setObservations] = useState('');
  const [selectedServices, setSelectedServices] = useState<{ id: string, quantity: number }[]>(
    initialServiceIds.length > 0
      ? initialServiceIds.map(id => ({ id, quantity: 1 }))
      : []
  );
  const [date, setDate] = useState(initialDate || new Date());
  const [startTime, setStartTime] = useState(initialTime || '07:30');
  const [endTime, setEndTime] = useState('08:10');

  const [isDataExpanded, setIsDataExpanded] = useState(true);

  // States for Bloqueio & Lembrete
  const [blockTitle, setBlockTitle] = useState('Bloqueio de horário');
  const [blockProfessionalIds, setBlockProfessionalIds] = useState<string[]>([]);
  const [showBlockProfDropdown, setShowBlockProfDropdown] = useState(false);
  const [isAllClinic, setIsAllClinic] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('Lembrete');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventProfessionalIds, setEventProfessionalIds] = useState<string[]>([]);
  const [showEventProfDropdown, setShowEventProfDropdown] = useState(false);
  const [eventServiceIds, setEventServiceIds] = useState<string[]>([]);
  const [showEventServDropdown, setShowEventServDropdown] = useState(false);
  const [allowOtherAgendamentos, setAllowOtherAgendamentos] = useState(false);

  const [endDate, setEndDate] = useState<Date>(date);
  const [isFullDay, setIsFullDay] = useState(false);
  const [recurrence, setRecurrence] = useState('Não se repete');
  const [isDataCalendarOpen, setIsDataCalendarOpen] = useState(false);
  const [isEventStartCalendarOpen, setIsEventStartCalendarOpen] = useState(false);
  const [isEventEndCalendarOpen, setIsEventEndCalendarOpen] = useState(false);

  // Custom Recurrence States
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState('dia');
  const [endsAt, setEndsAt] = useState('Após');
  const [occurrencesCount, setOccurrencesCount] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date>(new Date());
  const [isRecurrenceEndDateCalendarOpen, setIsRecurrenceEndDateCalendarOpen] = useState(false);

  useEffect(() => {
    if (recurrence === 'Diário') { setRepeatEvery(1); setRepeatUnit('dia'); }
    else if (recurrence === 'Semanal') { setRepeatEvery(1); setRepeatUnit('semana'); }
    else if (recurrence === 'A cada duas semanas') { setRepeatEvery(2); setRepeatUnit('semana'); }
    else if (recurrence === 'Mensal') { setRepeatEvery(1); setRepeatUnit('mês'); }
    else if (recurrence === 'A cada bimestre') { setRepeatEvery(2); setRepeatUnit('mês'); }
    else if (recurrence === 'A cada trimestre') { setRepeatEvery(3); setRepeatUnit('mês'); }
    else if (recurrence === 'A cada quadrimestre') { setRepeatEvery(4); setRepeatUnit('mês'); }
    else if (recurrence === 'A cada semestre') { setRepeatEvery(6); setRepeatUnit('mês'); }
    else if (recurrence === 'Anual') { setRepeatEvery(1); setRepeatUnit('ano'); }
  }, [recurrence]);

  useEffect(() => {
    if (isOpen) {
      if (initialDate) setDate(initialDate);
      if (initialTime) setStartTime(initialTime);
      setPatientSearch(initialPatientName);
      setProfessionalId(initialProfessionalId);
      setSelectedServices(
        initialServiceIds.length > 0
          ? initialServiceIds.map(id => ({ id, quantity: 1 }))
          : []
      );
    }
  }, [isOpen, initialDate, initialTime, initialPatientName, initialProfessionalId, initialServiceIds]);

  // Logic to calculate total duration and update endTime
  useEffect(() => {
    if (type === 'Agendamento' && !isFullDay) {
      const totalMinutes = selectedServices.reduce((sum, item) => {
        const service = services.find(s => s.id === item.id);
        const duration = service?.duration || 0;
        return sum + (duration * item.quantity);
      }, 0);

      if (totalMinutes > 0) {
        setEndTime(addMinutesToTime(startTime, totalMinutes));
      }
    }
  }, [selectedServices, startTime, type, services, isFullDay]);

  const filteredPatients = useMemo(() => {
    if (!patientSearch) return [];
    return patients.filter(p => p.name?.toLowerCase().includes(patientSearch.toLowerCase()));
  }, [patients, patientSearch]);

  const handleAddService = () => {
    setSelectedServices([...selectedServices, { id: '', quantity: 1 }]);
  };

  const handleRemoveService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, id: string) => {
    const newServices = [...selectedServices];
    newServices[index].id = id;
    setSelectedServices(newServices);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const newServices = [...selectedServices];
    newServices[index].quantity = Math.max(1, qty);
    setSelectedServices(newServices);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar
        rounded-2xl border transition-all duration-300 shadow-2xl
        ${isDarkMode ? 'bg-[#0A0A0B] border-white/5 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase">Novo Agendamento</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/5 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Section: Tipo */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Tipo*</span>
            <div className={`p-1 flex rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-neutral-100'}`}>
              {(['Agendamento', 'Bloqueio de horário', 'Lembrete', 'Evento'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t === 'Bloqueio de horário' ? 'Bloqueio' : t as any)}
                  className={`
                    flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold transition-all
                    ${(type === 'Bloqueio' && t === 'Bloqueio de horário') || type === t
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : `text-neutral-500 hover:${isDarkMode ? 'text-white' : 'text-neutral-700'}`}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Dados Básicos */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-light font-bricolage tracking-tight">Dados básicos</h3>

            {type === 'Agendamento' ? (
              <>
                {/* Paciente */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Paciente</span>
                    <button className="text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 uppercase tracking-wider">
                      <Plus size={12} /> Adicionar
                    </button>
                  </div>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Pesquise/Selecione"
                      value={patientSearch}
                      onChange={(e) => { setPatientSearch(e.target.value); setShowPatientResults(true); }}
                      onFocus={() => setShowPatientResults(true)}
                      className={`
                        w-full pl-11 pr-10 py-3.5 rounded-xl border text-sm transition-all
                        ${isDarkMode
                          ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                        outline-none
                      `}
                    />
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500" />

                    {/* Autocomplete Results */}
                    {showPatientResults && filteredPatients.length > 0 && (
                      <div className={`
                        absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200
                        ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-700/50 shadow-black' : 'bg-white border-neutral-200'}
                      `}>
                        <div className="flex flex-col max-h-64 overflow-y-auto custom-scrollbar">
                          {filteredPatients.map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setPatientId(p.id);
                                setPatientSearch(p.name);
                                setShowPatientResults(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm transition-colors ${isDarkMode ? 'text-white hover:bg-gradient-to-r hover:from-orange-600/30 hover:to-transparent hover:text-orange-500 hover:font-medium' : 'hover:bg-neutral-50 text-neutral-700'}`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profissional */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Profissional</span>
                    <PremiumSelect
                      value={professionalId}
                      onChange={setProfessionalId}
                      isDarkMode={isDarkMode}
                      placeholder="Selecione..."
                      options={professionals.map(p => ({
                        value: p.id,
                        label: p.name,
                        icon: User
                      }))}
                    />
                  </div>

                  <StatusSelect
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    isDarkMode={isDarkMode}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Cor</span>
                    <PremiumSelect
                      value={color}
                      onChange={setColor}
                      isDarkMode={isDarkMode}
                      options={[
                        { value: 'Padrão', label: 'Padrão' },
                        { value: 'Destaque', label: 'Destaque' }
                      ]}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Observações</span>
                  <textarea
                    placeholder="Digite"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-sm transition-all min-h-[100px] resize-none
                      ${isDarkMode
                        ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                      outline-none
                    `}
                  />
                </div>
              </>
            ) : type === 'Bloqueio' ? (
              <>
                {/* Title for Bloqueio */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Título*</span>
                  <input
                    type="text"
                    value={blockTitle}
                    onChange={(e) => setBlockTitle(e.target.value)}
                    placeholder="Ex: Almoço / Reunião"
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-sm transition-all
                      ${isDarkMode
                        ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                      outline-none
                    `}
                  />
                </div>

                {/* Profissionais for Bloqueio */}
                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Profissionais</span>
                    <div className="flex items-center gap-2">
                      <label
                        className={`inline-flex items-center cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isAllClinic}
                          onChange={(e) => {
                            setIsAllClinic(e.target.checked);
                            if (e.target.checked) setBlockProfessionalIds([]);
                          }}
                        />
                        <div className={`
                          relative w-8 h-4 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500
                          ${isDarkMode ? 'bg-white/10 border-white/5' : ''}
                        `}></div>
                        <span className="ml-2 text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Clínica toda</span>
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      onClick={() => !isAllClinic && setShowBlockProfDropdown(!showBlockProfDropdown)}
                      className={`
                        w-full px-4 py-2.5 rounded-xl border flex items-center justify-between transition-all min-h-[52px] cursor-pointer
                        ${isDarkMode
                          ? 'bg-white/[0.03] border-white/10 text-white focus-within:border-orange-500/50'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus-within:border-orange-400 focus-within:bg-white'}
                        ${isAllClinic ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex flex-wrap gap-2">
                        {isAllClinic ? (
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-500 text-[10px] font-bold rounded-lg border border-orange-500/30 uppercase tracking-tighter">
                            Todos os profissionais
                          </span>
                        ) : blockProfessionalIds.length > 0 ? (
                          blockProfessionalIds.map(id => {
                            const prof = professionals.find(p => p.id === id);
                            return (
                              <span key={id} className="px-3 py-1 bg-orange-500/20 text-orange-500 text-[10px] font-bold rounded-lg border border-orange-500/30 flex items-center gap-1.5 uppercase tracking-tighter group transition-colors hover:bg-orange-500/30">
                                {prof?.name || 'Profissional'}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBlockProfessionalIds(blockProfessionalIds.filter(pid => pid !== id));
                                  }}
                                  className="text-orange-500/60 hover:text-orange-500 transition-colors"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-neutral-500 text-sm">Selecione profissionais...</span>
                        )}
                      </div>
                      <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${showBlockProfDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown for Block Professionals */}
                    {showBlockProfDropdown && !isAllClinic && (
                      <div className={`
                        absolute top-full left-0 right-0 mt-1 z-[60] rounded-xl border overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200
                        ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-700/50 shadow-black' : 'bg-white border-neutral-200'}
                      `}>
                        <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {professionals.length > 0 ? professionals.map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                if (!blockProfessionalIds.includes(p.id)) {
                                  setBlockProfessionalIds([...blockProfessionalIds, p.id]);
                                } else {
                                  setBlockProfessionalIds(blockProfessionalIds.filter(pid => pid !== p.id));
                                }
                              }}
                              className={`
                                w-full px-4 py-2.5 text-left text-xs font-semibold rounded-lg transition-all flex items-center justify-between
                                ${blockProfessionalIds.includes(p.id)
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}
                              `}
                            >
                              {p.name}
                              {blockProfessionalIds.includes(p.id) && <Plus size={12} className="rotate-45" />}
                            </button>
                          )) : (
                            <div className="px-4 py-3 text-xs text-neutral-500 italic">Nenhum profissional cadastrado</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Observações</span>
                  <textarea
                    placeholder="Digite"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-sm transition-all min-h-[100px] resize-none
                      ${isDarkMode
                        ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                      outline-none
                    `}
                  />
                </div>
              </>
            ) : type === 'Lembrete' ? (
              <>
                {/* Lembrete View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Título */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Título*</span>
                    <input
                      type="text"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className={`
                        w-full px-4 py-3.5 rounded-xl border text-sm transition-all
                        ${isDarkMode
                          ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                        outline-none
                      `}
                    />
                  </div>

                  {/* Participantes */}
                  <div className="flex flex-col gap-2 relative">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Participantes</span>
                    <div className="relative">
                      <div
                        onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
                        className={`
                          w-full px-4 py-2 rounded-xl border flex items-center justify-between transition-all min-h-[52px] cursor-pointer
                          ${isDarkMode
                            ? 'bg-white/[0.03] border-white/10 text-white'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900'}
                        `}
                      >
                        <div className="flex flex-wrap gap-2">
                          {participantIds.length > 0 ? participantIds.map(id => {
                            const prof = professionals.find(p => p.id === id);
                            return (
                              <span key={id} className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded-lg border border-orange-500/20 flex items-center gap-1.5 uppercase tracking-tighter shadow-sm">
                                {prof?.name || 'Profissional'}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setParticipantIds(participantIds.filter(pid => pid !== id));
                                  }}
                                  className="text-orange-500/60 hover:text-orange-500"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              </span>
                            );
                          }) : (
                            <span className="text-neutral-500 text-sm">Selecione...</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setParticipantIds([]); setShowParticipantDropdown(false); }}
                            className="p-1 hover:bg-neutral-500/10 rounded-md transition-colors"
                          >
                            <X size={14} className="text-neutral-500" />
                          </button>
                          <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${showParticipantDropdown ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {showParticipantDropdown && (
                        <div className={`
                          absolute top-full left-0 right-0 mt-2 z-[60] rounded-xl border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200
                          ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-neutral-200'}
                        `}>
                          <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {professionals.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  if (!participantIds.includes(p.id)) {
                                    setParticipantIds([...participantIds, p.id]);
                                  } else {
                                    setParticipantIds(participantIds.filter(pid => pid !== p.id));
                                  }
                                }}
                                className={`
                                  w-full px-4 py-2.5 text-left text-xs font-semibold rounded-lg transition-all flex items-center justify-between
                                  ${participantIds.includes(p.id)
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}
                                `}
                              >
                                {p.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Observações</span>
                  <textarea
                    placeholder="Digite"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className={`
                      w-full px-4 py-3.5 rounded-xl border text-sm transition-all min-h-[100px] resize-none
                      ${isDarkMode
                        ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                      outline-none
                    `}
                  />
                </div>
              </>
            ) : type === 'Evento' ? (
              <>
                {/* Evento View */}
                <div className="flex flex-col gap-6">
                  {/* Título do evento */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Título do evento*</span>
                    <input
                      type="text"
                      placeholder="Digite"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className={`
                        w-full px-4 py-3.5 rounded-xl border text-sm transition-all
                        ${isDarkMode
                          ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                        outline-none
                      `}
                    />
                  </div>

                  {/* Start/End Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Data Início */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">DATA DE INÍCIO*</span>
                      <MiniCalendar
                        selectedDate={date}
                        onSelect={(d) => { setDate(d); setIsEventStartCalendarOpen(false); }}
                        isOpen={isEventStartCalendarOpen}
                        onToggle={() => { setIsEventStartCalendarOpen(!isEventStartCalendarOpen); setIsEventEndCalendarOpen(false); }}
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {/* Hora Início */}
                    <TimePicker
                      label="HORA DE INÍCIO*"
                      value={startTime}
                      onChange={setStartTime}
                      isDarkMode={isDarkMode}
                    />

                    {/* Data Fim */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">DATA DE FIM*</span>
                      <MiniCalendar
                        selectedDate={endDate}
                        onSelect={(d) => { setEndDate(d); setIsEventEndCalendarOpen(false); }}
                        isOpen={isEventEndCalendarOpen}
                        onToggle={() => { setIsEventEndCalendarOpen(!isEventEndCalendarOpen); setIsEventStartCalendarOpen(false); }}
                        isDarkMode={isDarkMode}
                        align="right"
                      />
                    </div>

                    {/* Hora Fim */}
                    <TimePicker
                      label="HORA DE FIM*"
                      value={endTime}
                      onChange={setEndTime}
                      isDarkMode={isDarkMode}
                    />
                  </div>

                  {/* Profissionais */}
                  <div className="flex flex-col gap-2 relative">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Profissionais</span>
                    <div className="relative">
                      <div
                        onClick={() => setShowEventProfDropdown(!showEventProfDropdown)}
                        className={`
                          w-full px-4 py-2 rounded-xl border flex items-center justify-between transition-all min-h-[52px] cursor-pointer
                          ${isDarkMode ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}
                        `}
                      >
                        <div className="flex flex-wrap gap-2">
                          {eventProfessionalIds.length > 0 ? eventProfessionalIds.map(id => {
                            const prof = professionals.find(p => p.id === id);
                            return (
                              <span key={id} className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded-lg border border-orange-500/20 flex items-center gap-1.5 uppercase tracking-tighter">
                                {prof?.name || 'Profissional'}
                                <button onClick={(e) => { e.stopPropagation(); setEventProfessionalIds(eventProfessionalIds.filter(pid => pid !== id)); }}><X size={10} /></button>
                              </span>
                            );
                          }) : (
                            <span className="text-neutral-500 text-sm">Selecione profissionais...</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEventProfessionalIds([]); setShowEventProfDropdown(false); }}
                            className="p-1 hover:bg-neutral-500/10 rounded-md transition-colors"
                          >
                            <X size={14} className="text-neutral-500" />
                          </button>
                          <ChevronDown size={14} className="text-neutral-500" />
                        </div>
                      </div>
                      {showEventProfDropdown && (
                        <div className={`absolute top-full left-0 right-0 mt-2 z-[60] rounded-xl border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-neutral-200'}`}>
                          <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {professionals.map(p => (
                              <button key={p.id} onClick={() => !eventProfessionalIds.includes(p.id) ? setEventProfessionalIds([...eventProfessionalIds, p.id]) : setEventProfessionalIds(eventProfessionalIds.filter(pid => pid !== p.id))} className={`w-full px-4 py-2 text-left text-xs font-semibold rounded-lg transition-all ${eventProfessionalIds.includes(p.id) ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium' : isDarkMode ? 'text-white hover:bg-white/5' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}`}>{p.name}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Procedimentos */}
                  <div className="flex flex-col gap-2 relative">
                    <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">Procedimentos</span>
                    <div className="relative">
                      <div
                        onClick={() => setShowEventServDropdown(!showEventServDropdown)}
                        className={`
                          w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer
                          ${isDarkMode ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}
                        `}
                      >
                        <span className="text-neutral-500 text-sm">
                          {eventServiceIds.length > 0
                            ? `${eventServiceIds.length} selecionado(s)`
                            : 'Pesquise/Selecione'}
                        </span>
                        <ChevronDown size={14} className="text-neutral-500" />
                      </div>
                      {showEventServDropdown && (
                        <div className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-neutral-200'}`}>
                          <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {(services.length > 0 ? services : [
                              { id: '1', name: 'Botox' },
                              { id: '2', name: 'Limpeza de Pele' },
                              { id: '3', name: 'Preenchimento' }
                            ]).map(s => (
                              <button
                                key={s.id}
                                onClick={() => !eventServiceIds.includes(s.id) ? setEventServiceIds([...eventServiceIds, s.id]) : setEventServiceIds(eventServiceIds.filter(sid => sid !== s.id))}
                                className={`w-full px-4 py-2.5 text-left text-xs font-semibold rounded-lg transition-all ${eventServiceIds.includes(s.id) ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium' : isDarkMode ? 'text-white hover:bg-white/5' : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'}`}
                              >
                                {s.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Switch: Outros procedimentos */}
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={allowOtherAgendamentos}
                        onChange={(e) => setAllowOtherAgendamentos(e.target.checked)}
                      />
                      <div className={`
                        relative w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500
                        ${isDarkMode ? 'bg-white/10 border-white/5' : ''}
                      `}></div>
                      <span className="ml-3 text-xs font-semibold text-neutral-500">Permitir agendamentos de outros procedimentos nesta data</span>
                    </label>
                  </div>


                </div>
              </>
            ) : null}

            {/* Section: Procedimentos/Produtos (Only for Agendamento) */}
            {type === 'Agendamento' && (
              <>
                <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-light font-bricolage tracking-tight">Procedimentos/Produtos</h3>

                  <div className="flex flex-col gap-4">
                    {selectedServices.map((svc, idx) => (
                      <div key={idx} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex-1 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Nome</span>
                          <div className="relative">
                          <PremiumSelect
                            value={svc.id}
                            onChange={(val) => handleServiceChange(idx, val)}
                            isDarkMode={isDarkMode}
                            placeholder="Selecione um procedimento..."
                            options={services.map(s => ({
                              value: s.id,
                              label: `${s.name} - R$ ${s.price || 0}`
                            }))}
                          />
                          </div>
                        </div>

                        <div className="w-24 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase text-center">Qtd.</span>
                          <input
                            type="number"
                            value={svc.quantity}
                            onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value))}
                            className={`
                            w-full px-4 py-3.5 rounded-xl border text-center text-sm transition-all
                            ${isDarkMode
                                ? 'bg-white/[0.03] border-white/10 text-white focus:border-orange-500/50'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-orange-400 focus:bg-white'}
                            outline-none
                          `}
                          />
                        </div>

                        <button
                          onClick={() => handleRemoveService(idx)}
                          className="p-3.5 rounded-xl text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-all mb-0.5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddService}
                      className={`
                      flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed transition-all
                      ${isDarkMode
                          ? 'border-white/5 text-neutral-400 hover:border-orange-500/30 hover:text-orange-500'
                          : 'border-neutral-200 text-neutral-400 hover:border-orange-400/50 hover:text-orange-600'}
                      text-[10px] font-bold uppercase tracking-wider
                    `}
                    >
                      <Plus size={16} /> Adicionar Procedimentos/Produtos
                    </button>
                  </div>
                </div>
                <div className={`h-px w-full ${isDarkMode ? 'bg-white/5' : 'bg-neutral-100'}`} />
              </>
            )}

            {/* Section: Data (Hidden for Evento as it has its own matrix) */}
            {type !== 'Evento' && (
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => setIsDataExpanded(!isDataExpanded)}
                  className="flex items-center justify-between w-full group"
                >
                  <h3 className="text-xl font-light font-bricolage tracking-tight">Data</h3>
                  <ChevronDown size={18} className={`text-neutral-500 transition-transform duration-300 ${isDataExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isDataExpanded && (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Dia */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">DIA*</span>
                        <MiniCalendar
                          selectedDate={date}
                          onSelect={(d) => { setDate(d); setIsDataCalendarOpen(false); }}
                          isOpen={isDataCalendarOpen}
                          onToggle={() => setIsDataCalendarOpen(!isDataCalendarOpen)}
                          isDarkMode={isDarkMode}
                        />
                      </div>

                      {/* Início (Hidden for Lembrete) */}
                      {type !== 'Lembrete' && (
                        <TimePicker
                          label="Início*"
                          value={startTime}
                          onChange={setStartTime}
                          isDarkMode={isDarkMode}
                        />
                      )}

                      {/* Fim / Hora */}
                      <TimePicker
                        label={type === 'Lembrete' ? 'HORA*' : 'FIM*'}
                        value={isFullDay ? '23:59' : endTime}
                        onChange={setEndTime}
                        isDarkMode={isDarkMode}
                        disabled={isFullDay}
                      />

                       {/* Dia Todo Switch (Moved to its own column) */}
                      {(type === 'Bloqueio' || type === 'Lembrete') && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase opacity-0">PLACEHOLDER</span> {/* Invisible label to maintain alignment */}
                          <div className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                            ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-neutral-50 border-neutral-200'}
                          `}>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isFullDay}
                                onChange={() => setIsFullDay(!isFullDay)}
                              />
                              <div className={`
                                relative w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500
                                ${isDarkMode ? 'bg-white/10 border-white/5' : ''}
                              `}></div>
                            </label>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Dia todo</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Plano & Recorrência & Advanced Options */}
                    <div className="flex flex-wrap items-start gap-x-6 gap-y-4">


                      {(type === 'Agendamento' || type === 'Bloqueio' || type === 'Lembrete') && (
                        <div className="flex-1 min-w-[160px] flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase flex items-center gap-1">Recorrência*</span>
                          <PremiumSelect
                            value={recurrence}
                            onChange={setRecurrence}
                            isDarkMode={isDarkMode}
                            options={[
                              { value: 'Não se repete', label: 'Não se repete' },
                              { value: 'Diário', label: 'A cada dia' },
                              { value: 'Semanal', label: 'A cada semana' },
                              { value: 'A cada duas semanas', label: 'A cada duas semanas' },
                              { value: 'Mensal', label: 'A cada mês' },
                              { value: 'A cada bimestre', label: 'A cada bimestre' },
                              { value: 'A cada trimestre', label: 'A cada trimestre' },
                              { value: 'A cada quadrimestre', label: 'A cada quadrimestre' },
                              { value: 'A cada semestre', label: 'A cada semestre' },
                              { value: 'Anual', label: 'A cada ano' },
                              { value: 'Personalizada', label: 'Personalizada' }
                            ]}
                          />
                        </div>
                      )}

                      {/* Advanced Recurrence Options (integrated into the same flex row) */}
                      {recurrence !== 'Não se repete' && (
                        <>
                          {/* Termina */}
                          <div className="flex-1 min-w-[160px] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Termina*</span>
                            <PremiumSelect
                              value={endsAt}
                              onChange={setEndsAt}
                              isDarkMode={isDarkMode}
                              options={[
                                { value: 'Nunca', label: 'Nunca' },
                                { value: 'Após', label: 'Após' },
                                { value: 'Em', label: 'Na data' }
                              ]}
                            />
                          </div>

                          {/* Quantidade / Na data */}
                          {endsAt === 'Após' && (
                            <div className="flex-1 min-w-[180px] flex flex-col gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Quantidade*</span>
                              <div className={`
                                relative flex items-center px-4 py-3.5 rounded-xl border transition-all
                                ${isDarkMode ? 'bg-black border-white/5' : 'bg-neutral-50 border-neutral-200'}
                                focus-within:border-orange-500/50
                              `}>
                                <input
                                  type="number"
                                  min="1"
                                  value={occurrencesCount}
                                  onChange={(e) => setOccurrencesCount(parseInt(e.target.value) || 1)}
                                  className={`
                                    w-12 bg-transparent text-sm outline-none
                                    ${isDarkMode ? 'text-white' : 'text-neutral-900'}
                                  `}
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} pointer-events-none ml-1 truncate`}>
                                  {occurrencesCount === 1 ? 'ocorrência' : 'ocorrências'}
                                </span>
                              </div>
                            </div>
                          )}

                          {endsAt === 'Em' && (
                            <div className="flex-1 min-w-[180px] flex flex-col gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Fim da Recorrência*</span>
                              <div className="w-full">
                                <MiniCalendar
                                  selectedDate={recurrenceEndDate}
                                  onSelect={(d) => { setRecurrenceEndDate(d); setIsRecurrenceEndDateCalendarOpen(false); }}
                                  isOpen={isRecurrenceEndDateCalendarOpen}
                                  onToggle={() => setIsRecurrenceEndDateCalendarOpen(!isRecurrenceEndDateCalendarOpen)}
                                  isDarkMode={isDarkMode}
                                  align="right"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Personalizada specific "Repetir a cada" field */}
                    {recurrence === 'Personalizada' && (
                      <div className={`
                        mt-4 p-5 rounded-xl border animate-in slide-in-from-top-2 duration-300
                        ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}
                      `}>
                        <div className="flex flex-col gap-2 max-w-[200px]">
                          <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">Repetir a cada*</span>
                          <div className={`
                            relative flex items-center px-4 py-3 rounded-xl border transition-all
                            ${isDarkMode ? 'bg-black border-white/5' : 'bg-white border-white/10'}
                            focus-within:border-orange-500/50
                          `}>
                            <input
                              type="number"
                              min="1"
                              value={repeatEvery}
                              onChange={(e) => setRepeatEvery(parseInt(e.target.value) || 1)}
                              className={`
                                w-12 bg-transparent text-sm outline-none
                                ${isDarkMode ? 'text-white' : 'text-neutral-900'}
                              `}
                            />
                            <div className="relative flex-1">
                              <PremiumSelect
                                value={repeatUnit}
                                onChange={setRepeatUnit}
                                isDarkMode={isDarkMode}
                                className="w-32"
                                options={[
                                  { value: 'dia', label: 'dia' },
                                  { value: 'semana', label: 'semana' },
                                  { value: 'mês', label: 'mês' },
                                  { value: 'ano', label: 'ano' }
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* Warning Alert (Only for Agendamento) */}
            {type === 'Agendamento' && (
              <div className={`
                mt-2 p-5 rounded-xl border-l-[3px] border-orange-500 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500
                ${isDarkMode ? 'bg-orange-500/5 border-orange-50/10' : 'bg-[#fff9f4] border-orange-200'}
              `}>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  As notificações de <span className="font-bold text-orange-400">Lembrete de agendamento (E-mail/WhatsApp Business)</span> não serão enviadas pois o tempo de antecedência configurado é maior que o tempo disponível até o agendamento.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className={`p-8 border-t flex justify-end gap-4 ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-neutral-100 bg-neutral-50/50'}`}>
          <button
            onClick={onClose}
            className={`
              px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all
              ${isDarkMode
                ? 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'}
            `}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (type === 'Agendamento' && (!patientSearch || !professionalId || !startTime)) {
                alert('Erro: Preencha Paciente, Profissional e Horário antes de confirmar.');
                return;
              }
              if (type === 'Bloqueio' && !blockTitle) {
                alert('Erro: Digite um título para o bloqueio.');
                return;
              }
              if (type === 'Lembrete' && !reminderTitle) {
                alert('Erro: Digite um título para o lembrete.');
                return;
              }
              if (type === 'Evento' && !eventTitle) {
                alert('Erro: Digite um título para o evento.');
                return;
              }

              onConfirm({
                type,
                patientId,
                patientName: type === 'Bloqueio' ? blockTitle : (type === 'Lembrete' ? reminderTitle : (type === 'Evento' ? eventTitle : patientSearch)),
                professionalId: type === 'Bloqueio' && isAllClinic ? 'all' : (type === 'Lembrete' ? participantIds[0] : (type === 'Evento' ? eventProfessionalIds[0] : professionalId)),
                participantIds: type === 'Lembrete' ? participantIds : [],
                blockProfessionalIds: type === 'Bloqueio' ? blockProfessionalIds : [],
                eventProfessionalIds: type === 'Evento' ? eventProfessionalIds : [],
                eventServiceIds: type === 'Evento' ? eventServiceIds : [],
                allowOtherAgendamentos: type === 'Evento' ? allowOtherAgendamentos : false,
                status,
                color,
                observations,
                services: type === 'Agendamento' ? selectedServices : [],
                date,
                startTime,
                endTime: (type === 'Lembrete' || isFullDay) ? '23:59' : (type === 'Evento' ? endTime : endTime),
                endDate: type === 'Evento' ? endDate : date,

                isAllClinic,
                isFullDay,
                recurrence,
                customRecurrence: recurrence !== 'Não se repete' ? {
                  repeatEvery,
                  repeatUnit,
                  endsAt,
                  occurrencesCount,
                  endDate: recurrenceEndDate
                } : null
              });
            }}
            className="px-10 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            {type === 'Agendamento' ? 'Agendar' : 'Salvar Bloqueio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
