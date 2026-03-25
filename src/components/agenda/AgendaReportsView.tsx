import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  Calendar
} from 'lucide-react';
import { PeriodSelector } from '../ui/PeriodSelector';
import { PremiumSelect } from '../ui/PremiumSelect';

interface AgendaReportsViewProps {
  appointments: any[];
  professionals: any[];
  isDarkMode: boolean;
  patients: any[];
}

export const AgendaReportsView = ({ appointments, professionals, isDarkMode }: AgendaReportsViewProps) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Period State (same as AgendaOverview)
  const today = new Date();
  const defStart = new Date(today);
  defStart.setDate(today.getDate() - today.getDay());
  defStart.setHours(0, 0, 0, 0);
  const defEnd = new Date(defStart);
  defEnd.setDate(defStart.getDate() + 6);
  defEnd.setHours(23, 59, 59, 999);

  const [startDate, setStartDate] = useState(defStart);
  const [endDate, setEndDate] = useState(defEnd);
  const [activePreset, setActivePreset] = useState('Esta semana');

  const formatDateShort = (d: Date) => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const periodLabel = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      const inPeriod = apptDate >= startDate && apptDate <= endDate;

      if (!inPeriod) return false;

      if (activeStatusFilter === 'Todos') return true;
      if (activeStatusFilter === 'Agendado' && !appt.completed && !appt.cancelled) return true;
      if (activeStatusFilter === 'Concluído' && appt.completed) return true;
      if (activeStatusFilter === 'Cancelado' && appt.cancelled) return true;
      // Note: Confirmado and Não compareceu aren't explicitly tracked in the basic schema yet, 
      // but we add them as placeholders if needed.
      return false;
    });
  }, [appointments, startDate, endDate, activeStatusFilter]);

  const stats = {
    Agendado: appointments.filter(a => !a.completed && !a.cancelled).length,
    Confirmado: 0,
    'Não compareceu': 0,
    Concluído: appointments.filter(a => a.completed).length,
    Cancelado: appointments.filter(a => a.cancelled).length,
    Todos: appointments.length
  };

  const statusColors: any = {
    Agendado: 'orange',
    Confirmado: 'blue',
    'Não compareceu': 'zinc',
    Concluído: 'emerald',
    Cancelado: 'red',
    Todos: 'orange'
  };

  const statusIcons: any = {
    Concluído: <CheckCircle2 size={14} className="text-emerald-500" />,
    Agendado: <Clock size={14} className="text-orange-500" />,
    Cancelado: <XCircle size={14} className="text-red-500" />,
    'Não compareceu': <AlertCircle size={14} className="text-zinc-500" />,
    Confirmado: <CheckCircle2 size={14} className="text-blue-500" />
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentItems = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length && currentItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(item => item.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isBatchDisabled = selectedIds.length === 0;

  return (
    <div className="flex-1 flex flex-col gap-6 px-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-8 rounded-[32px] border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5 shadow-2xl shadow-black/40' : 'bg-white border-neutral-200 shadow-xl'}`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Relatório de agendamentos</h2>
            <span className="text-sm text-neutral-500 font-medium">{filteredAppointments.length} registros</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={isBatchDisabled}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isBatchDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} ${isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              Ações em lote <ChevronDown size={16} />
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
              Exportar <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-6 mb-8 mt-2 relative">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 group"
            >
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Período</span>
            </button>

            <div className={`px-6 py-3 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className={`text-[12px] font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>
                {periodLabel}
              </span>
            </div>

            <PeriodSelector
              startDate={startDate}
              endDate={endDate}
              onSelect={(start, end, preset) => {
                setStartDate(start);
                setEndDate(end);
                setActivePreset(preset || 'Personalizado');
              }}
              isOpen={isSelectorOpen}
              onClose={() => setIsSelectorOpen(false)}
              isDarkMode={isDarkMode}
              activePreset={activePreset}
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center border-b border-white/5 mb-8">
          {Object.entries(stats).map(([label, count]) => {
            const isActive = activeStatusFilter === label;
            return (
              <button
                key={label}
                onClick={() => setActiveStatusFilter(label)}
                className={`flex flex-col gap-2 px-6 pb-4 relative transition-all ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${statusColors[label]}-500`} />
                  <span className={`text-[11px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</span>
                </div>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{count}</span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_-2px_10px_rgba(249,115,22,0.4)]" />}
              </button>
            );
          })}
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <th className="p-4 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded-sm accent-orange-500 cursor-pointer" 
                    checked={currentItems.length > 0 && selectedIds.length === currentItems.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Procedimentos</th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Paciente <ChevronDown size={10} className="inline ml-1" /></th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Profissional <ChevronDown size={10} className="inline ml-1" /></th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Duração <ChevronDown size={10} className="inline ml-1" /></th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Agendado para <ChevronDown size={10} className="inline ml-1" /></th>
                <th className={`px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Status <ChevronDown size={10} className="inline ml-1" /></th>
                <th className="p-4 text-right"><Settings size={14} className="text-neutral-500" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((appt: any) => {
                const prof = professionals.find(p => p.id === appt.professionalId);
                const status = appt.completed ? 'Concluído' : appt.cancelled ? 'Cancelado' : 'Agendado';
                const isSelected = selectedIds.includes(appt.id);
                return (
                  <tr 
                    key={appt.id} 
                    onClick={() => toggleSelectOne(appt.id)}
                    className={`group hover:bg-orange-500/5 transition-colors cursor-pointer ${isSelected ? (isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50') : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded-sm accent-orange-500 cursor-pointer" 
                        checked={isSelected}
                        onChange={() => toggleSelectOne(appt.id)}
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {appt.service || '—'}
                        </span>
                        {appt.plan && <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{appt.plan}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                          {appt.patient?.substring(0, 2).toUpperCase() || 'P'}
                        </div>
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{appt.patient}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-800 text-[10px] font-bold text-white">
                          {prof?.name?.substring(0, 2).toUpperCase() || 'PR'}
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{prof?.name || 'Profissional'}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-5 text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>30 min</td>
                    <td className={`px-4 py-5 text-sm font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>{appt.date.split('-').reverse().join('/')} {appt.time}</td>
                    <td className="px-4 py-5">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-neutral-50 border-neutral-100'}`}>
                        {statusIcons[status]}
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-400' : 'text-neutral-500'}`}>{status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button className="text-neutral-500 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className={`mt-8 pt-8 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
          <div className="flex items-center gap-3">
            <PremiumSelect
              value={String(itemsPerPage)}
              onChange={(val) => setItemsPerPage(Number(val))}
              isDarkMode={isDarkMode}
              className="w-40"
              options={[
                { value: '10', label: '10 por página' },
                { value: '20', label: '20 por página' },
                { value: '50', label: '50 por página' },
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#050505] border-white/10 text-zinc-600 hover:text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-400'}`}>
              <ChevronsLeft size={16} />
            </button>
            <button className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#050505] border-white/10 text-zinc-600 hover:text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-400'}`}>
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : (isDarkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-neutral-100 text-neutral-600')}`}
              >
                {page}
              </button>
            ))}
            <button className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#050505] border-white/10 text-zinc-400 hover:text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}>
              <ChevronRight size={16} />
            </button>
            <button className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#050505] border-white/10 text-zinc-400 hover:text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}>
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
