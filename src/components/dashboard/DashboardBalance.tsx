import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, Eye, EyeOff, LayoutPanelLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinanceRecord, AppointmentRecord, ServiceRecord } from '../../types/finance';

interface DashboardBalanceProps {
  activePeriod: string;
  analysisPeriod: number;
  setAnalysisPeriod: (val: number | ((prev: number) => number)) => void;
  expenses?: FinanceRecord[];
  appointments?: AppointmentRecord[];
  services?: ServiceRecord[];
  isDarkMode?: boolean;
  showValues: boolean;
  setShowValues: (val: boolean) => void;
}

function getAppointmentValue(app: AppointmentRecord, services: ServiceRecord[]): number {
  if (!app.serviceIds || !Array.isArray(app.serviceIds)) return 0;
  return app.serviceIds.reduce((sum: number, sid: string) => {
    const svc = services.find((s) => s.id === sid);
    return sum + Number(svc?.price || svc?.valor || svc?.value || 0);
  }, 0);
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const DashboardBalance: React.FC<DashboardBalanceProps> = ({ 
  activePeriod, 
  analysisPeriod,
  setAnalysisPeriod,
  expenses = [], 
  appointments = [], 
  services = [],
  isDarkMode = true,
  showValues,
  setShowValues
}) => {
  const now = new Date();
  const currYear = now.getFullYear();

  // Generate rolling timeline: 12 months past + Current + 12 months future (Total 25)
  const monthsHistory = useMemo(() => {
    const history = [];
    const totalRange = 12; // 12 past and 12 future
    for (let i = -totalRange; i <= totalRange; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      history.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      });
    }
    return history;
  }, []);

  const currentMonthIndex = 12; // Middle of the 25 month range

  // Generate rolling years history: 5 years past + Current + 5 years future
  const yearsHistory = useMemo(() => {
    const years = [];
    for (let i = -5; i <= 5; i++) {
      years.push(String(currYear + i));
    }
    return years;
  }, [currYear]);

  const periodRanges = useMemo(() => {
    return {
      'DIÁRIA': monthsHistory.map(m => {
        const first = new Date(m.year, m.month, 1);
        const last = new Date(m.year, m.month + 1, 0);
        return `${String(first.getDate()).padStart(2, '0')}/${String(first.getMonth() + 1).padStart(2, '0')}/${m.year} - ${String(last.getDate()).padStart(2, '0')}/${String(last.getMonth() + 1).padStart(2, '0')}/${m.year}`;
      }),
      'SEMANAL': monthsHistory.map(m => {
        const first = new Date(m.year, m.month, 1);
        const last = new Date(m.year, m.month + 1, 0);
        return `${String(first.getDate()).padStart(2, '0')}/${String(first.getMonth() + 1).padStart(2, '0')}/${m.year} - ${String(last.getDate()).padStart(2, '0')}/${String(last.getMonth() + 1).padStart(2, '0')}/${m.year}`;
      }),
      'MENSAL': monthsHistory.map((m) => {
        const end = new Date(m.year, m.month, 1);
        const start = new Date(m.year, m.month - 5, 1);
        return `${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()} - ${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`;
      }),
      'TRIMESTRAL': yearsHistory,
      'SEMESTRAL': yearsHistory,
      'ANUAL': yearsHistory,
    };
  }, [monthsHistory, yearsHistory]);

  const currentPeriods = periodRanges[activePeriod as keyof typeof periodRanges] || [String(currYear)];
  
  const handlePrev = () => setAnalysisPeriod((prev: number) => Math.max(prev - 1, 0));
  const handleNext = () => setAnalysisPeriod((prev: number) => Math.min(prev + 1, currentPeriods.length - 1));

  const financials = useMemo(() => {
    const todayStr = now.toISOString().split('T')[0];
    
    const isInPeriod = (dateStr: string): boolean => {
      if (!dateStr) return false;
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m) return false;

      // Extract year and month from the selected timeline meta
      const selectedMeta = monthsHistory[analysisPeriod] || monthsHistory[currentMonthIndex];
      const selectedYear = Number(currentPeriods[analysisPeriod]);

      switch (activePeriod) {
        case 'DIÁRIA': {
          // Chart shows all days of the selected month
          return y === selectedMeta.year && m === selectedMeta.month + 1;
        }
        case 'SEMANAL': {
          // Same as diaria for the sidebar summary
          return y === selectedMeta.year && m === selectedMeta.month + 1;
        }
        case 'MENSAL': {
          // Chart shows 6 months window ending at selectedMeta
          const dateDate = new Date(y, m - 1, 1);
          const endDate = new Date(selectedMeta.year, selectedMeta.month, 1);
          const startDate = new Date(selectedMeta.year, selectedMeta.month - 5, 1);
          return dateDate >= startDate && dateDate <= endDate;
        }
        case 'TRIMESTRAL':
        case 'SEMESTRAL': {
          // Chart shows current year quarters/semesters
          return y === selectedYear;
        }
        case 'ANUAL': {
          // Chart shows 4 years window ending at selectedYear
          return y >= selectedYear - 3 && y <= selectedYear;
        }
        default:
          return false;
      }
    };

    let entradas = 0;
    let entradasPrevistas = 0;
    let saidas = 0;
    let saidasPrevistas = 0;

    expenses.forEach((exp) => {
      const dateField = exp.dueDate || exp.date || '';
      if (!isInPeriod(dateField)) return;

      const val = Number(exp.value || exp.valor || 0);
      const isReceita = exp.type === 'Receita';
      const isPago = exp.status === 'Pago';

      if (isReceita && isPago) entradas += val;
      else if (isReceita && !isPago) entradasPrevistas += val;
      else if (!isReceita && isPago) saidas += val;
      else saidasPrevistas += val;
    });

    appointments.forEach((app) => {
      const appDate = app.date || '';
      if (!appDate || appDate <= todayStr) return;
      if (!isInPeriod(appDate)) return;
      const appValue = getAppointmentValue(app, services);
      if (appValue > 0) entradasPrevistas += appValue;
    });

    return {
      balanco: entradas - saidas,
      previsao: (entradas + entradasPrevistas) - (saidas + saidasPrevistas),
      totalEntradas: entradas,
      totalEntradasPrev: entradas + entradasPrevistas,
      totalSaidas: saidas,
      totalSaidasPrev: saidas + saidasPrevistas
    };
  }, [expenses, appointments, services, activePeriod, analysisPeriod, currentPeriods, monthsHistory]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Período de Análise Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Período de Análise</h3>
        <div className={`flex items-center justify-between border p-1.5 rounded-xl ${isDarkMode ? 'bg-black border-white/5' : 'bg-neutral-100 border-neutral-200'}`}>
          <button onClick={handlePrev} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            <ChevronLeft size={14} className="text-neutral-500" />
          </button>
          <span className={`text-[11px] font-bold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{currentPeriods[analysisPeriod]}</span>
          <button onClick={handleNext} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            <ChevronRight size={14} className="text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Balanço Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Balanço</h3>
          <Info size={12} className="text-neutral-600" />
        </div>

        <div className={`border rounded-2xl p-5 flex flex-col gap-6 relative overflow-hidden group shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-neutral-900/40 border-white/5' : 'bg-white border-neutral-200'}`}>
          {/* Main Balance Display */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className={`text-3xl font-light font-bricolage tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {showValues ? formatCurrency(financials.balanco) : 'R$ ••••••••'}
              </span>
              <button
                onClick={() => setShowValues(!showValues)}
                className={`transition-colors ${isDarkMode ? 'text-neutral-600 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                {showValues ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-neutral-500">
              de <span className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'} font-bold`}>{showValues ? formatCurrency(financials.previsao) : 'R$ •••'}</span> previstos
            </p>
          </div>

          {/* Detailed Stats Grid */}
          <div className={`grid grid-cols-2 gap-3 pt-5 border-t ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
            {/* Entradas */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-0.5">Entradas:</span>
              <span className={`text-sm font-bold leading-none ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {showValues ? formatCurrency(financials.totalEntradas) : 'R$ •••'}
              </span>
              <div className={`w-4 h-4 rounded flex items-center justify-center my-0.5 ${isDarkMode ? 'bg-zinc-800/40' : 'bg-emerald-50'}`}>
                <ArrowUpRight size={10} className="text-emerald-500" />
              </div>
              <span className="text-[9px] text-neutral-500 leading-tight">
                de {showValues ? formatCurrency(financials.totalEntradasPrev) : 'R$ •••'}<br />previsto
              </span>
            </div>

            {/* Saídas */}
            <div className="flex flex-col gap-1 items-end text-right">
              <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mb-0.5">Saídas:</span>
              <span className="text-sm font-bold text-red-500 leading-none">
                {showValues ? `-${formatCurrency(financials.totalSaidas)}` : '-R$ •••'}
              </span>
              <div className={`w-4 h-4 rounded flex items-center justify-center my-0.5 ${isDarkMode ? 'bg-zinc-800/40' : 'bg-red-50'}`}>
                <ArrowDownRight size={10} className="text-red-500" />
              </div>
              <span className="text-[9px] text-neutral-500 leading-tight">
                de {showValues ? `-${formatCurrency(financials.totalSaidasPrev)}` : '-R$ •••'}<br />previsto
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

