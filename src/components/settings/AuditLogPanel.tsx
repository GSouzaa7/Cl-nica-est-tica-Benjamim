import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Activity, Calendar, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: any;
}

const formatTimestamp = (ts: any): string => {
  if (!ts) return 'Agora';
  try {
    const d = ts.toDate();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return 'Agora';
  }
};

const formatDateBR = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface MiniCalendarProps {
  selectedDate: Date;
  onSelect: (d: Date) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
  isDarkMode: boolean;
  label: string;
  align?: 'left' | 'right';
}

const MiniCalendar = ({ selectedDate, onSelect, isOpen, onToggle, onClear, isDarkMode, label, align = 'left' }: MiniCalendarProps) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDay(viewDate.getFullYear(), viewDate.getMonth());

  const prevMonthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const isToday = (day: number) => {
    const t = new Date();
    return day === t.getDate() && viewDate.getMonth() === t.getMonth() && viewDate.getFullYear() === t.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${isDarkMode ? 'border-zinc-800 bg-[#121214] text-zinc-300 hover:border-zinc-700' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
      >
        <Calendar size={13} className="text-zinc-500" />
        <span>{formatDateBR(selectedDate)}</span>
        <ChevronDown size={12} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 z-50 rounded-xl border shadow-2xl p-4 w-[280px] ${align === 'right' ? 'right-0' : 'left-0'} ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-zinc-200'}`}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {monthNames[viewDate.getMonth()]} de {viewDate.getFullYear()} ▾
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className={`p-1 rounded-md ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className={`p-1 rounded-md ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 mb-1">
            {weekDaysShort.map((d, i) => (
              <div key={i} className={`text-center text-[10px] font-bold uppercase py-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
              const displayDay = !isCurrentMonth
                ? (dayNum < 1 ? prevMonthDays + dayNum : dayNum - daysInMonth)
                : dayNum;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (isCurrentMonth) {
                      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
                      onSelect(newDate);
                    }
                  }}
                  disabled={!isCurrentMonth}
                  className={`w-full aspect-square flex items-center justify-center text-xs rounded-md transition-colors
                    ${!isCurrentMonth ? (isDarkMode ? 'text-zinc-700' : 'text-zinc-300') : ''}
                    ${isCurrentMonth && isSelected(dayNum) ? 'bg-orange-500 text-white font-bold' : ''}
                    ${isCurrentMonth && isToday(dayNum) && !isSelected(dayNum) ? (isDarkMode ? 'border border-zinc-600 text-white' : 'border border-zinc-400 text-zinc-900') : ''}
                    ${isCurrentMonth && !isSelected(dayNum) && !isToday(dayNum) ? (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100') : ''}
                  `}
                >
                  {displayDay}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: isDarkMode ? '#27272a' : '#e4e4e7' }}>
            <button onClick={onClear} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Limpar</button>
            <button onClick={() => { onSelect(new Date()); setViewDate(new Date()); }} className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors">Hoje</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuditLogPanel = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  
  const [startDate, setStartDate] = useState<Date>(lastWeek);
  const [endDate, setEndDate] = useState<Date>(today);
  const [isStartCalOpen, setIsStartCalOpen] = useState(false);
  const [isEndCalOpen, setIsEndCalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'audit_logs'),
        where('timestamp', '>=', Timestamp.fromDate(start)),
        where('timestamp', '<=', Timestamp.fromDate(end)),
        orderBy('timestamp', 'desc'),
        limit(200)
      );

      const snap = await getDocs(q);
      const fetchedLogs: AuditLog[] = [];
      snap.forEach(doc => {
        fetchedLogs.push({ id: doc.id, ...doc.data() } as AuditLog);
      });
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate]);

  return (
    <div className={`mt-8 border rounded-xl p-6 transition-colors duration-300 shrink-0 ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"}`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Activity className="text-orange-500" size={20} />
          <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Trilha de Auditoria do Sistema</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <MiniCalendar
            selectedDate={startDate}
            onSelect={(d) => { setStartDate(d); setIsStartCalOpen(false); }}
            isOpen={isStartCalOpen}
            onToggle={() => { setIsStartCalOpen(!isStartCalOpen); setIsEndCalOpen(false); }}
            onClear={() => { setStartDate(new Date(new Date().setDate(new Date().getDate() - 30))); setIsStartCalOpen(false); }}
            isDarkMode={isDarkMode}
            label="De"
          />
          <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>até</span>
          <MiniCalendar
            selectedDate={endDate}
            onSelect={(d) => { setEndDate(d); setIsEndCalOpen(false); }}
            isOpen={isEndCalOpen}
            onToggle={() => { setIsEndCalOpen(!isEndCalOpen); setIsStartCalOpen(false); }}
            onClear={() => { setEndDate(new Date()); setIsEndCalOpen(false); }}
            isDarkMode={isDarkMode}
            label="Até"
            align="right"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-400">Todo e qualquer salvamento, edição ou exclusão crítica realizada pelos usuários é registrada de forma imutável.</p>
        
        <div className={`relative overflow-x-auto rounded-xl border ${isDarkMode ? 'border-zinc-800/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white/50'}`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase border-b ${isDarkMode ? 'bg-zinc-900/50 text-zinc-400 border-zinc-800/50' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
              <tr>
                <th className="px-4 py-3 font-medium">Data/Hora</th>
                <th className="px-4 py-3 font-medium">Usuário</th>
                <th className="px-4 py-3 font-medium">Módulo</th>
                <th className="px-4 py-3 font-medium">Ação</th>
                <th className="px-4 py-3 font-medium">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Carregando trilha de auditoria...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Nenhuma atividade registrada neste período.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className={`border-b last:border-0 ${isDarkMode ? 'border-zinc-800/50 hover:bg-zinc-800/20' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {log.userName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border
                        ${log.action.includes('CRIOU') || log.action.includes('SALVOU') || log.action.includes('APROVOU') ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200') : ''}
                        ${log.action.includes('EXCLUIU') || log.action.includes('REJEITOU') ? (isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200') : ''}
                        ${!log.action.includes('CRIOU') && !log.action.includes('EXCLUIU') && !log.action.includes('SALVOU') && !log.action.includes('APROVOU') && !log.action.includes('REJEITOU') ? (isDarkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200') : ''}
                      `}>
                        {log.action}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
