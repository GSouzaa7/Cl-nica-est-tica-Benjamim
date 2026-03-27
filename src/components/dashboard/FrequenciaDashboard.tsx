import React, { useMemo } from 'react';
import { TrendingUp, Clock3, AlertTriangle, CheckCircle2, Crown, MessageCircle, Activity } from 'lucide-react';

interface FrequenciaDashboardProps {
  patients: any[];
  appointments: any[];
  isDarkMode?: boolean;
}

export const FrequenciaDashboard: React.FC<FrequenciaDashboardProps> = ({ patients, appointments, isDarkMode = true }) => {
  const now = new Date();
  
  const parseDateStr = (dateStr: any) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    if (typeof dateStr !== 'string') return null;
    
    if (dateStr.includes('T')) return new Date(dateStr);
    
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[2].length === 2 ? 2000 + parseInt(parts[2]) : parseInt(parts[2]);
        return new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const patientsWithMetrics = useMemo(() => {
    return patients.map(p => {
      // Prioritize appointments for clinical frequency
      const patientAppointments = (appointments || [])
        .filter((app: any) => app.patientId === p.id && app.status === 'Concluído')
        .map((app: any) => parseDateStr(app.date))
        .filter((d: Date | null) => d !== null) as Date[];

      // Fallback to history if no appointments found (optional but good for backwards compatibility)
      const historyDates = patientAppointments.length === 0 
        ? (p.history || [])
            .map((h: any) => h.date ? parseDateStr(h.date) : null)
            .filter((d: Date | null) => d !== null) as Date[]
        : [];

      const allDates = [...patientAppointments, ...historyDates].sort((a: any, b: any) => a.getTime() - b.getTime());

      let returnAvg = 0;
      let lastVisit = allDates.length > 0 ? allDates[allDates.length - 1] : null;
      let daysSinceLast = lastVisit ? Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      let totalVisits = allDates.length;
      
      if (allDates.length > 1) {
        let totalDays = 0;
        for (let i = 1; i < allDates.length; i++) {
          totalDays += Math.floor((allDates[i].getTime() - allDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
        }
        returnAvg = Math.floor(totalDays / (allDates.length - 1));
      }

      return { ...p, returnAvg, lastVisit, daysSinceLast, totalVisits };
    }).filter(p => p.totalVisits > 0);
  }, [patients, appointments]);

  const overallReturnAvg = useMemo(() => {
    const valid = patientsWithMetrics.filter(p => p.returnAvg > 0);
    if (!valid.length) return 0; 
    return Math.floor(valid.reduce((sum, p) => sum + p.returnAvg, 0) / valid.length);
  }, [patientsWithMetrics]);

  const atRiskCount = patientsWithMetrics.filter(p => p.daysSinceLast >= 15 && p.daysSinceLast <= 60).length;
  
  const retentionRate = patientsWithMetrics.length > 0 
    ? Math.floor((patientsWithMetrics.filter(p => p.totalVisits > 1).length / patientsWithMetrics.length) * 100) || 0
    : 0;

  const evasaoList = [...patientsWithMetrics].filter(p => p.daysSinceLast >= 15 && p.daysSinceLast <= 60).sort((a,b) => b.daysSinceLast - a.daysSinceLast);
  const perdidosList = [...patientsWithMetrics].filter(p => p.daysSinceLast > 90).sort((a,b) => b.daysSinceLast - a.daysSinceLast);
  const vipsList = [...patientsWithMetrics].sort((a,b) => b.totalVisits - a.totalVisits).slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto px-12 pb-12 pt-4 custom-scrollbar">
      <div className="mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
        <div>
           <div className="flex items-center gap-3">
             <TrendingUp className="text-orange-500" size={28} />
             <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wider`}>Frequência de Clientes</h2>
           </div>
           <p className="text-zinc-500 text-sm mt-2">Aqui estão sugestões e métricas para aumentar seu faturamento com retenção inteligente do paciente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'} flex items-start border-t-2 border-t-orange-500/50`}>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mt-1 shrink-0">
               <Clock3 size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Média de Retorno</h3>
              <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{overallReturnAvg} <span className="text-sm font-medium text-zinc-500">dias</span></div>
              <p className="text-xs text-zinc-600 mt-2">Tempo médio que seus clientes levam para voltar (via histórico).</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'} flex items-start border-t-2 border-t-emerald-500/50`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mt-1 shrink-0">
               <CheckCircle2 size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Taxa de Retenção</h3>
              <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{retentionRate}<span className="text-xl">%</span></div>
              <p className="text-xs text-zinc-600 mt-2">Clientes que retornaram para uma segunda sessão.</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'} flex items-start border-t-2 border-t-yellow-500/50`}>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mt-1 shrink-0">
               <AlertTriangle size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Clientes em Risco</h3>
              <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{atRiskCount} <span className="text-sm font-medium text-zinc-500">clientes</span></div>
              <p className="text-xs text-zinc-600 mt-2">Passaram de 15 a 60 dias sem agendar.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'} flex flex-col`}>
             <div className="flex items-center gap-2 mb-2">
               <AlertTriangle className="text-yellow-500" size={18} />
               <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Sinal Amarelo (Evasão Iminente)</h3>
             </div>
             <p className="text-xs text-zinc-500 mb-6">Sugestão: Listar aqui clientes inativos entre 15 e 60 dias. Um simples "Fala sumido!" no WhatsApp pode recuperar a venda.</p>
             <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
               {evasaoList.slice(0, 10).map(p => (
                 <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-[#121214] border-zinc-800/50 hover:border-yellow-500/30' : 'bg-zinc-50 border-zinc-200 hover:border-yellow-500/30'} transition-colors`}>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-sm">
                       {p.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h4>
                       <span className="text-[10px] font-bold text-yellow-500">Atrasado há {p.daysSinceLast} dias</span>
                     </div>
                   </div>
                   <button className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors" title="Chamar no WhatsApp">
                     <MessageCircle size={14} />
                   </button>
                 </div>
               ))}
               {evasaoList.length === 0 && <div className="text-center text-sm text-zinc-500 py-8">Nenhum cliente nesta lista.</div>}
             </div>
          </div>

          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'} flex flex-col`}>
             <div className="flex items-center gap-2 mb-2">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLineJoin="round" className="text-red-500"><path d="m11 21-8-3V7l8 3 8-3v9"/><path d="M11 10v11"/><path d="m11 10 8-3-8-3-8 3 8 3Z"/><path d="M22 22 18 18"/></svg>
               <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Recuperação (90+ dias)</h3>
             </div>
             <p className="text-xs text-zinc-500 mb-6">Sugestão: Listar clientes "perdidos" inativos há mais de 3 meses. Ação ideal: Mandar alerta imperdível ou desconto de recuperação.</p>
             <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
               {perdidosList.slice(0, 10).map(p => (
                 <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-[#121214] border-zinc-800/50 hover:border-red-500/30' : 'bg-zinc-50 border-zinc-200 hover:border-red-500/30'} transition-colors`}>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                       {p.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h4>
                       <span className="text-[10px] font-bold text-red-500">Visto há {Math.floor(p.daysSinceLast / 30)} meses</span>
                     </div>
                   </div>
                   <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-wider">
                     Enviar Promoção
                   </button>
                 </div>
               ))}
               {perdidosList.length === 0 && <div className="text-center text-sm text-zinc-500 py-8">Nenhum cliente nesta lista.</div>}
             </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="text-emerald-500" size={18} />
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Top VIPs (Fiéis)</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-6">Sugestão: Clientes com maior número de registros no prontuário. Mime essas pessoas!</p>
          <div className="flex flex-nowrap overflow-x-auto custom-scrollbar gap-4 pb-4">
            {vipsList.map((p, index) => (
              <div key={p.id} className={`min-w-[280px] p-5 rounded-2xl border ${isDarkMode ? 'bg-[#121214] border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'} relative overflow-hidden group`}>
                <div className={`absolute -right-4 -bottom-6 text-9xl font-black ${isDarkMode ? 'text-white/5' : 'text-black/5'} z-0 select-none group-hover:scale-110 transition-transform`}>
                  {index + 1}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                        <Activity size={10} />
                        {p.totalVisits} APONTAMENTOS
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Última Visita</span>
                    <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.daysSinceLast} dias</span>
                  </div>
                </div>
              </div>
            ))}
            {vipsList.length === 0 && <div className="text-sm text-zinc-500 py-4 w-full">Nenhum cliente VIP.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
