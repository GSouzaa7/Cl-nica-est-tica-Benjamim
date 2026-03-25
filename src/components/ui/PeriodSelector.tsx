import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface PeriodSelectorProps {
  startDate: Date;
  endDate: Date;
  onSelect: (start: Date, end: Date, preset?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  activePreset?: string;
}

const presets = [
  { id: 'Hoje', label: 'Hoje' },
  { id: 'Esta semana', label: 'Esta semana' },
  { id: 'Este mês', label: 'Este mês' },
  { id: 'Últimos 7 dias', label: 'Últimos 7 dias' },
  { id: 'Últimos 30 dias', label: 'Últimos 30 dias' },
];

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const weekDaysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const PeriodSelector = ({ startDate, endDate, onSelect, isOpen, onClose, isDarkMode, activePreset }: PeriodSelectorProps) => {
  const [viewDate, setViewDate] = useState(new Date(startDate));
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
      setViewDate(new Date(startDate));
    }
  }, [isOpen, startDate, endDate]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const handlePresetClick = (presetId: string) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    switch (presetId) {
      case 'Hoje':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Esta semana':
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Este mês':
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'Últimos 7 dias':
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Últimos 30 dias':
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }
    onSelect(start, end, presetId);
    setTempStart(start);
    setTempEnd(end);
  };


  const isRangeStart = (date: Date) => {
    if (!tempStart) return false;
    return date.getFullYear() === tempStart.getFullYear() &&
           date.getMonth() === tempStart.getMonth() &&
           date.getDate() === tempStart.getDate();
  };

  const isRangeEnd = (date: Date) => {
    if (!tempEnd) return false;
    return date.getFullYear() === tempEnd.getFullYear() &&
           date.getMonth() === tempEnd.getMonth() &&
           date.getDate() === tempEnd.getDate();
  };

  const isInRange = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    const d = new Date(date).setHours(0,0,0,0);
    const s = new Date(tempStart).setHours(0,0,0,0);
    const e = new Date(tempEnd).setHours(0,0,0,0);
    return d >= s && d <= e;
  };

  const handleDateClick = (date: Date) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date);
      setTempEnd(null);
    } else {
      if (date < tempStart) {
        setTempEnd(tempStart);
        setTempStart(date);
        onSelect(date, tempStart);
      } else {
        setTempEnd(date);
        onSelect(tempStart, date);
      }
    }
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className={`absolute top-full mt-4 left-0 z-[100] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-neutral-200'}`}
      style={{ minWidth: '560px' }}
    >
      <div className="flex flex-col md:flex-row divide-x divide-white/5">
        {/* Presets Sidebar */}
        <div className={`w-full md:w-56 p-6 flex flex-col gap-4`}>

        {presets.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePresetClick(p.id)}
              className={`
                w-full px-4 py-2.5 text-left text-xs font-bold transition-all rounded-xl flex items-center gap-3 group
                ${isActive 
                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500' 
                  : (isDarkMode ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900')}
              `}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-orange-500' : (isDarkMode ? 'border-zinc-700 group-hover:border-orange-500/50' : 'border-neutral-300 group-hover:border-orange-500/50')}`}>
                <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-orange-500 scale-100' : 'bg-transparent scale-0'}`} />
              </div>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Calendar Section */}
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-neutral-500 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900'}`}>
            <ChevronLeft size={16} />
          </button>
          <span className={`text-sm font-bold font-bricolage tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-neutral-500 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900'}`}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDaysShort.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-neutral-500 uppercase py-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-8 h-8" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0); // Use mid-day to avoid TZ issues
            const start = isRangeStart(date);
            const end = isRangeEnd(date);
            const between = isInRange(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(date)}
                className={`w-10 h-10 rounded-xl relative flex items-center justify-center text-xs transition-all
                  ${start || end ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' : ''}
                  ${between ? (isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600') : ''}
                  ${!start && !end && !between ? (isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-neutral-600 hover:bg-neutral-50') : ''}
                `}
              >
                {day}
                {between && !start && !end && <div className="absolute inset-0 bg-orange-500/5 rounded-xl border border-orange-500/10" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};
