import React from 'react';
import { User, Calendar, Clock, Phone, Info } from 'lucide-react';

interface WidgetProps {
  appointments?: any[];
  patients?: any[];
  professionals?: any[];
  services?: any[];
  isDarkMode?: boolean;
}

// 1. AGENDAMENTOS DAS PRÓXIMAS 24H
export const UpcomingAppointmentsWidget = ({ appointments = [], services = [], isDarkMode = true }: WidgetProps) => {
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = appointments
    .filter(app => {
      if (!app.date) return false;
      const appDate = new Date(`${app.date}T${app.time || '00:00'}`);
      return appDate >= now && appDate <= next24h;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateA - dateB;
    })
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Agendamentos das Próximas 24h</h3>
      <div className="flex flex-col gap-3">
        {upcoming.length > 0 ? upcoming.map((app) => (
          <div key={app.id} className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 flex flex-col gap-1 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-white">{app.service}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{app.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{app.patient}</span>
            </div>
          </div>
        )) : (
          <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-8 flex items-center justify-center text-neutral-600 text-xs italic">
            Nenhum agendamento para as próximas 24h
          </div>
        )}
      </div>
    </div>
  );
};

// 2. PRÓXIMOS ANIVERSARIANTES
export const UpcomingBirthdaysWidget = ({ patients = [], isDarkMode = true }: WidgetProps) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const getDayAndMonth = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length < 3) return null;
    return { day: parseInt(parts[2]), month: parseInt(parts[1]) - 1 };
  };

  const birthdays = patients
    .map(p => ({ ...p, bDate: getDayAndMonth(p.birthDate || p.nascimento || '') }))
    .filter(p => p.bDate !== null)
    .sort((a, b) => {
      if (a.bDate!.month !== b.bDate!.month) return a.bDate!.month - b.bDate!.month;
      return a.bDate!.day - b.bDate!.day;
    })
    // Filter for birthdays today or later in the year
    .filter(p => {
        if (p.bDate!.month > currentMonth) return true;
        if (p.bDate!.month === currentMonth && p.bDate!.day >= currentDay) return true;
        return false;
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Próximos Aniversariantes</h3>
      <div className="flex flex-col gap-2">
        {birthdays.length > 0 ? birthdays.map((p, i) => (
          <div key={i} className="bg-neutral-900/40 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-neutral-500">
                {String(p.bDate!.day).padStart(2, '0')}/{String(p.bDate!.month + 1).padStart(2, '0')}
              </span>
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors">{p.name || p.nome}</span>
            </div>
            <button className="text-neutral-600 hover:text-emerald-500 transition-colors">
              <Phone size={14} />
            </button>
          </div>
        )) : (
            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-8 flex items-center justify-center text-neutral-600 text-xs italic">
                Sem aniversários próximos
            </div>
        )}
      </div>
    </div>
  );
};

// 3. AGENDAMENTOS POR PROFISSIONAL
export const AppointmentsByProfessionalWidget = ({ appointments = [], professionals = [], isDarkMode = true }: WidgetProps) => {
  const stats = professionals.map(prof => {
    const count = appointments.filter(app => app.professionalId === prof.id).length;
    const initials = prof.name ? prof.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '??';
    return { ...prof, count, initials };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 flex-1 h-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-1.5">
          Agendamentos por Profissional <Info size={12} className="text-neutral-600" />
        </h3>
      </div>
      
      <div className="flex-1 flex items-end justify-center gap-6 px-4">
        {stats.slice(0, 3).map((prof, i) => {
          const profColor = prof.color || '#f97316';
          return (
            <div key={prof.id} className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-white">{prof.count}</span>
                  <div 
                  className={`w-12 rounded-full relative transition-all duration-700`}
                  style={{ 
                    height: `${(prof.count / maxCount) * 140}px`, 
                    minHeight: '10px',
                    backgroundColor: profColor,
                    boxShadow: `0 0 20px ${profColor}4D` // 4D = 30% alpha
                  }}
                  />
              </div>
              <div 
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors`}
                style={{
                  borderColor: profColor,
                  color: profColor,
                  backgroundColor: `${profColor}1A` // 1A = 10% alpha
                }}
              >
                {prof.initials}
              </div>
              <span className="text-[10px] text-neutral-400 font-medium">{prof.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. DIAS MAIS MOVIMENTADOS
export const BusyDaysWidget = ({ appointments = [], isDarkMode = true }: WidgetProps) => {
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const dayCounts = Array(7).fill(0);

  appointments.forEach(app => {
    if (!app.date) return;
    const date = new Date(app.date);
    dayCounts[date.getDay()]++;
  });

  const maxCount = Math.max(...dayCounts, 1);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 flex-1 h-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-1.5">
          Dias mais movimentados <Info size={12} className="text-neutral-600" />
        </h3>
      </div>
      
      <div className="flex-1 flex items-end justify-between px-2 pb-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-3 w-full">
            <span className="text-[10px] font-bold text-white mb-1">{dayCounts[i] > 0 ? dayCounts[i] : ''}</span>
            <div 
              className={`w-6 rounded-md transition-all duration-700 ${dayCounts[i] === maxCount ? 'bg-orange-600' : 'bg-neutral-800'}`}
              style={{ height: `${(dayCounts[i] / maxCount) * 160}px`, minHeight: '4px' }}
            />
            <span className="text-[10px] text-neutral-500 font-bold">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. HORÁRIOS MAIS MOVIMENTADOS (HEATMAP)
export const BusyHoursWidget = ({ appointments = [], isDarkMode = true }: WidgetProps) => {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 08h to 21h

  const matrix = Array(6).fill(0).map(() => Array(14).fill(0));

  appointments.forEach(app => {
    if (!app.date || !app.time) return;
    const date = new Date(app.date);
    const day = date.getDay(); // 0 is Sunday, 1 is Monday
    if (day === 0) return; // Skip Sunday for this widget
    const hour = parseInt(app.time.split(':')[0]);
    if (hour >= 8 && hour <= 21) {
      matrix[day - 1][hour - 8]++;
    }
  });

  const maxAcross = Math.max(...matrix.flat(), 1);

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.03)';
    const ratio = count / maxAcross;
    if (ratio >= 0.8) return 'rgba(249, 115, 22, 0.8)'; // PICO - Orange
    if (ratio >= 0.4) return 'rgba(249, 115, 22, 0.4)'; // NORMAL
    return 'rgba(249, 115, 22, 0.1)'; // OCIOSO
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 flex-[2] h-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-1.5">
          Horários mais movimentados <Info size={12} className="text-neutral-600" />
        </h3>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col gap-3">
          {/* Header Hours */}
          <div className="grid grid-cols-[40px_1fr] gap-1">
            <div /> {/* Spacer for day labels */}
            <div className="flex justify-between px-1">
              {hours.map(h => (
                <span key={h} className="text-[9px] text-neutral-600 font-medium font-mono w-6 text-center">{String(h).padStart(2, '0')}h</span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex flex-col gap-1 flex-1">
            {weekDays.map((label, dIdx) => (
              <div key={label} className="grid grid-cols-[40px_1fr] gap-1 items-stretch h-full">
                <span className="text-[10px] text-neutral-500 font-medium flex items-center">{label}</span>
                <div className="flex justify-between gap-1 flex-1">
                  {hours.map((_, hIdx) => {
                    const count = matrix[dIdx][hIdx];
                    const ratio = count / maxAcross;
                    return (
                      <div 
                        key={hIdx} 
                        className="flex-1 rounded-sm flex items-center justify-center transition-all hover:ring-1 hover:ring-white/20"
                        style={{ backgroundColor: getIntensityColor(count) }}
                      >
                        {ratio >= 0.7 && <span className="text-[8px] font-bold text-white/50">{Math.round(ratio * 100)}%</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/5" />
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">Ocioso</span>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500/40" />
            <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">Pico</span>
        </div>
      </div>
    </div>
  );
};
