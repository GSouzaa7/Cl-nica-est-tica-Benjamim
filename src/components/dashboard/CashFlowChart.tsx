import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Info, LineChart as LineChartIcon, BarChart3 } from 'lucide-react';

const COLOR_ENTRADA = '#22c55e';
const COLOR_ENTRADA_PREV = '#bbf7d0';
const COLOR_SAIDA = '#ef4444';
const COLOR_SAIDA_PREV = '#fecaca';
const COLOR_SALDO = '#3b82f6';
const COLOR_SALDO_PREV = '#93c5fd';

const periods = ['DIÁRIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'];

import { FinanceRecord, AppointmentRecord, ServiceRecord } from '../../types/finance';

interface CashFlowChartProps {
  activePeriod: string;
  setActivePeriod: (period: string) => void;
  expenses?: FinanceRecord[];
  appointments?: AppointmentRecord[];
  services?: ServiceRecord[];
}

function getAppointmentValue(app: any, services: any[]): number {
  if (!app.serviceIds || !Array.isArray(app.serviceIds)) return 0;
  return app.serviceIds.reduce((sum: number, sid: string) => {
    const svc = services.find((s: any) => s.id === sid);
    return sum + Number(svc?.price || svc?.valor || svc?.value || 0);
  }, 0);
}

function buildChartData(
  expenses: any[],
  appointments: any[],
  services: any[],
  activePeriod: string
): any[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const bucketExpense = (dateStr: string): string | null => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m) return null;

    switch (activePeriod) {
      case 'DIÁRIA': {
        const currMonth = now.getMonth();
        const currYear = now.getFullYear();
        if (y === currYear && m - 1 === currMonth) return String(d).padStart(2, '0');
        return null;
      }
      case 'SEMANAL': {
        const currMonth = now.getMonth();
        const currYear = now.getFullYear();
        if (y === currYear && m - 1 === currMonth) {
          const week = Math.ceil(d / 7);
          return `Sem ${String(week).padStart(2, '0')}`;
        }
        return null;
      }
      case 'MENSAL': {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const monthsBack = (now.getFullYear() - y) * 12 + (now.getMonth() - (m - 1));
        if (monthsBack >= 0 && monthsBack < 6) return `${meses[m - 1]} ${y}`;
        return null;
      }
      case 'TRIMESTRAL': {
        const currYear = now.getFullYear();
        if (y === currYear) {
          const q = Math.ceil(m / 3);
          return `${q}º Tri`;
        }
        return null;
      }
      case 'SEMESTRAL': {
        const currYear = now.getFullYear();
        if (y === currYear) {
          const s = m <= 6 ? 1 : 2;
          return `${s}º Sem`;
        }
        return null;
      }
      case 'ANUAL': {
        const currYear = now.getFullYear();
        if (y >= currYear - 3 && y <= currYear) return String(y);
        return null;
      }
      default:
        return null;
    }
  };

  const generateLabels = (): string[] => {
    switch (activePeriod) {
      case 'DIÁRIA': {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));
      }
      case 'SEMANAL': {
        return ['Sem 01', 'Sem 02', 'Sem 03', 'Sem 04', 'Sem 05'];
      }
      case 'MENSAL': {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const labels: string[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(`${meses[d.getMonth()]} ${d.getFullYear()}`);
        }
        return labels;
      }
      case 'TRIMESTRAL':
        return ['1º Tri', '2º Tri', '3º Tri', '4º Tri'];
      case 'SEMESTRAL':
        return ['1º Sem', '2º Sem'];
      case 'ANUAL': {
        const currYear = now.getFullYear();
        return [String(currYear - 3), String(currYear - 2), String(currYear - 1), String(currYear)];
      }
      default:
        return [];
    }
  };

  const labels = generateLabels();
  const data: Record<string, { entradas: number; entradasPrevistas: number; saidas: number; saidasPrevistas: number }> = {};
  labels.forEach(l => { data[l] = { entradas: 0, entradasPrevistas: 0, saidas: 0, saidasPrevistas: 0 }; });

  // Process expenses from Firestore
  expenses.forEach(exp => {
    const dateField = exp.dueDate || exp.date || '';
    const bucket = bucketExpense(dateField);
    if (!bucket || !data[bucket]) return;

    const val = Number(exp.value || exp.valor || 0);
    const isReceita = exp.type === 'Receita';
    const isPago = exp.status === 'Pago';

    if (isReceita && isPago) {
      data[bucket].entradas += val;
    } else if (isReceita && !isPago) {
      data[bucket].entradasPrevistas += val;
    } else if (!isReceita && isPago) {
      data[bucket].saidas -= val;
    } else {
      data[bucket].saidasPrevistas -= val;
    }
  });

  // Process future appointments as entradas previstas
  appointments.forEach(app => {
    const appDate = app.date || '';
    if (!appDate || appDate <= todayStr) return; // Only future
    const bucket = bucketExpense(appDate);
    if (!bucket || !data[bucket]) return;

    const appValue = getAppointmentValue(app, services);
    if (appValue > 0) {
      data[bucket].entradasPrevistas += appValue;
    }
  });

  // Build final chart data with cumulative saldo
  let saldoAcum = 0;
  let saldoPrevAcum = 0;

  return labels.map(label => {
    const d = data[label];
    saldoAcum += d.entradas + d.saidas;
    saldoPrevAcum += (d.entradas + d.entradasPrevistas) + (d.saidas + d.saidasPrevistas);

    return {
      name: label,
      entradas: d.entradas,
      entradasPrevistas: d.entradasPrevistas,
      saidas: d.saidas,
      saidasPrevistas: d.saidasPrevistas,
      saldo: saldoAcum,
      saldoPrevisto: saldoPrevAcum,
    };
  });
}

export const CashFlowChart = ({ activePeriod, setActivePeriod, expenses = [], appointments = [], services = [] }: CashFlowChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

  const currentData = useMemo(
    () => buildChartData(expenses, appointments, services, activePeriod),
    [expenses, appointments, services, activePeriod]
  );

  const barThickness = activePeriod === 'DIÁRIA' ? 20 : activePeriod === 'MENSAL' ? 40 : (activePeriod === 'TRIMESTRAL' || activePeriod === 'SEMESTRAL') ? 60 : activePeriod === 'ANUAL' ? 50 : 30;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-light text-white font-bricolage tracking-tight whitespace-nowrap underline-offset-8">Fluxo de Caixa</h2>
          <Info className="w-4 h-4 text-neutral-500 cursor-help" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-white/5">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                  activePeriod === period
                    ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setChartType('line')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                chartType === 'line' 
                  ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                  : 'bg-neutral-900 border border-white/5 text-neutral-500 hover:border-white/20'
              }`}
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                chartType === 'bar' 
                  ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                  : 'bg-neutral-900 border border-white/5 text-neutral-500 hover:border-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={currentData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} stackOffset="sign">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#ffffff20"
              tick={{ fill: '#ffffff40', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              dy={activePeriod === 'TRIMESTRAL' ? 5 : 15}
              angle={activePeriod === 'TRIMESTRAL' ? -45 : 0}
              textAnchor={activePeriod === 'TRIMESTRAL' ? 'end' : 'middle'}
              interval={0}
              minTickGap={0}
            />
            <YAxis
              stroke="#ffffff20"
              tick={{ fill: '#ffffff40', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$ ${value >= 1000 || value <= -1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A0A0A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              itemStyle={{ padding: '2px 0' }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
            />
            
            {chartType === 'line' ? (
              <>
                <Line type="monotone" dataKey="entradas" stroke={COLOR_ENTRADA} strokeWidth={2} dot={{ r: 3, fill: COLOR_ENTRADA, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="entradasPrevistas" stroke={COLOR_ENTRADA_PREV} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#0A0A0A', stroke: COLOR_ENTRADA_PREV, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="saidas" stroke={COLOR_SAIDA} strokeWidth={2} dot={{ r: 3, fill: COLOR_SAIDA, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="saidasPrevistas" stroke={COLOR_SAIDA_PREV} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#0A0A0A', stroke: COLOR_SAIDA_PREV, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </>
            ) : (
              <>
                <Bar dataKey="entradas" stackId="a" fill={COLOR_ENTRADA} radius={[0, 0, 0, 0]} barSize={barThickness} />
                <Bar dataKey="entradasPrevistas" stackId="a" fill={COLOR_ENTRADA_PREV} radius={[2, 2, 0, 0]} barSize={barThickness} />
                <Bar dataKey="saidas" stackId="a" fill={COLOR_SAIDA} radius={[0, 0, 0, 0]} barSize={barThickness} />
                <Bar dataKey="saidasPrevistas" stackId="a" fill={COLOR_SAIDA_PREV} radius={[0, 0, 2, 2]} barSize={barThickness} />
              </>
            )}

            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke={COLOR_SALDO} 
              strokeWidth={3} 
              filter="url(#glow)"
              dot={{ r: 4, fill: COLOR_SALDO, strokeWidth: 2, stroke: '#0A0A0A' }} 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="saldoPrevisto" 
              stroke={COLOR_SALDO_PREV} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={{ r: 3, fill: '#0A0A0A', stroke: COLOR_SALDO_PREV, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-2">
        <LegendItem variant="rect" color={COLOR_ENTRADA} label="ENTRADAS" />
        <LegendItem variant="rect" color={COLOR_ENTRADA_PREV} label="ENTRADAS PREVISTAS" />
        <LegendItem variant="rect" color={COLOR_SAIDA} label="SAÍDAS" />
        <LegendItem variant="rect" color={COLOR_SAIDA_PREV} label="SAÍDAS PREVISTAS" />
        <LegendItem variant="line" color={COLOR_SALDO} label="SALDO" />
        <LegendItem variant="line" color={COLOR_SALDO_PREV} label="SALDO PREVISTO" dashed />
      </div>
    </div>
  );
};

const LegendItem = ({ 
  color, 
  label, 
  variant,
  dashed = false 
}: { 
  color: string; 
  label: string; 
  variant: 'rect' | 'line';
  dashed?: boolean;
}) => (
  <div className="flex items-center gap-2">
    {variant === 'rect' ? (
      <div 
        className="w-1.5 h-4 rounded-sm" 
        style={{ backgroundColor: color }} 
      />
    ) : (
      <div 
        className="w-4 h-[2px]" 
        style={{ 
          backgroundColor: dashed ? 'transparent' : color,
          borderBottom: dashed ? `2px dashed ${color}` : 'none'
        }} 
      />
    )}
    <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase">{label}</span>
  </div>
);
