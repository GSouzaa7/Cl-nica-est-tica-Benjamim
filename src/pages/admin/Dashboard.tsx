import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, Calendar, Users, BarChart3, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: 'set', value: 0 },
  { name: 'out', value: 0 },
  { name: 'nov', value: 0 },
  { name: 'dez', value: 0 },
  { name: 'jan', value: 0 },
  { name: 'fev', value: 0 },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
          <BarChart3 className="w-5 h-5 text-orange-400" />
        </div>
        <h1 className="text-3xl font-bricolage font-light text-white">Dashboard</h1>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Faturamento Total</h3>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="text-4xl font-bricolage text-white mb-2">R$ 0,00</p>
          <div className="flex items-center text-xs text-neutral-500">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+0% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Agendamentos</h3>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <p className="text-4xl font-bricolage text-white mb-2">0</p>
          <div className="flex items-center text-xs text-neutral-500">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+0% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Novos Leads</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-4xl font-bricolage text-white mb-2">0</p>
          <div className="flex items-center text-xs text-neutral-500">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            <span>0% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Despesas do Mês</h3>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-4xl font-bricolage text-white mb-2">R$ 0,00</p>
          <div className="flex items-center text-xs text-neutral-500">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+0% vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0A] border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-400">Estoque Crítico</h4>
            <p className="text-xs text-neutral-500">Nenhum item em estado crítico</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-400">Estoque Baixo</h4>
            <p className="text-xs text-neutral-500">Nenhum item com estoque baixo</p>
          </div>
        </div>
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Desempenho Semestral</h3>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Últimos 6 meses</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff40', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff40', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `R$${value}k`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#0A0A0A', stroke: '#f97316', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#f97316', stroke: '#0A0A0A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Próximos Agendamentos</h3>
            <span className="text-[10px] uppercase text-red-400 border border-red-500/20 px-2 py-1 rounded bg-red-500/10 font-medium tracking-wider">
              Hoje
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-sm text-neutral-500">Nenhum agendamento para hoje</p>
            <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
              Ver Agenda Completa <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
