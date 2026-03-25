import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelect: (d: Date) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  isDarkMode: boolean;
  align?: 'left' | 'right';
  label?: string;
  className?: string;
}

const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const formatDateBR = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const MiniCalendar = ({ 
  selectedDate, 
  onSelect, 
  isOpen, 
  onToggle, 
  onClear, 
  isDarkMode, 
  label,
  align = 'left',
  className = ""
}: MiniCalendarProps) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViewDate(new Date(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onToggle]);

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
    <div className={`relative flex flex-col gap-2 ${className}`} ref={ref}>
      {label && (
        <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1">
          {label}
        </span>
      )}
      <div 
        onClick={onToggle}
        className={`
          flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all cursor-pointer
          ${isDarkMode ? 'bg-black border-white/5 hover:bg-[#161618] text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900 hover:bg-white'}
        `}
      >
        <span className="text-sm font-semibold tracking-tight">
          {formatDateBR(selectedDate)}
        </span>
        <CalendarIcon size={16} className={`transition-colors ${isOpen ? 'text-orange-500' : 'text-neutral-500'}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full mt-2 z-[100] rounded-xl border shadow-2xl p-4 w-[280px] animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0' : 'left-0'} ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-bold font-bricolage capitalize ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCurrentMonth) {
                      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
                      onSelect(newDate);
                    }
                  }}
                  className={`w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-all
                    ${!isCurrentMonth ? (isDarkMode ? 'text-zinc-800' : 'text-zinc-200 cursor-default') : ''}
                    ${isCurrentMonth && isSelected(dayNum) ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20' : ''}
                    ${isCurrentMonth && isToday(dayNum) && !isSelected(dayNum) ? (isDarkMode ? 'border border-zinc-700 text-white' : 'border border-zinc-300 text-zinc-900') : ''}
                    ${isCurrentMonth && !isSelected(dayNum) && !isToday(dayNum) ? (isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900') : ''}
                  `}
                >
                  {displayDay}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}>
            <button onClick={(e) => { e.stopPropagation(); onClear?.(); }} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors">Limpar</button>
            <button onClick={(e) => { e.stopPropagation(); onSelect(new Date()); setViewDate(new Date()); }} className="text-[10px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors">Hoje</button>
          </div>
        </div>
      )}
    </div>
  );
};
