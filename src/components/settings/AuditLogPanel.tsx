import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Activity, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MiniCalendar } from '../ui/MiniCalendar';

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
