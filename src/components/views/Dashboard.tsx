import React from 'react';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, Badge } from '../ui/BaseComponents';

const data = [
  { month: 'SET', faturamento: 4000, margem: 2000 },
  { month: 'OUT', faturamento: 5500, margem: 3000 },
  { month: 'NOV', faturamento: 4500, margem: 2500 },
  { month: 'DEZ', faturamento: 9000, margem: 6000 },
  { month: 'JAN', faturamento: 6500, margem: 4000 },
  { month: 'FEV', faturamento: 5000, margem: 3500 },
];

const StatCard = ({ title, value, trend, trendValue, icon: Icon, iconColor }: any) => (
  <Card className="relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{title}</h3>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor} bg-opacity-10 transition-transform group-hover:scale-110`}>
        <Icon size={20} className={iconColor.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-800 mb-2">{value}</div>
    <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
      {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{trendValue} vs mês anterior</span>
    </div>
  </Card>
);

export const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Bem-vindo de volta! Aqui está o resumo da sua clínica hoje.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Total" 
          value="R$ 14.500,00" 
          trend="up" 
          trendValue="+12.5%" 
          icon={DollarSign} 
          iconColor="bg-emerald-500" 
        />
        <StatCard 
          title="Agendamentos" 
          value="42" 
          trend="up" 
          trendValue="+8.2%" 
          icon={Calendar} 
          iconColor="bg-orange-500" 
        />
        <StatCard 
          title="Novos Leads" 
          value="18" 
          trend="down" 
          trendValue="-3.1%" 
          icon={Users} 
          iconColor="bg-blue-500" 
        />
        <StatCard 
          title="Despesas do Mês" 
          value="R$ 3.200,00" 
          trend="up" 
          trendValue="+5.7%" 
          icon={BarChart3} 
          iconColor="bg-purple-500" 
        />
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-red-800 font-bold text-sm">Estoque Crítico</h4>
            <p className="text-red-600/70 text-xs">2 itens precisam de reposição imediata</p>
          </div>
          <button className="ml-auto text-red-500 hover:text-red-700 transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-orange-800 font-bold text-sm">Estoque Baixo</h4>
            <p className="text-orange-600/70 text-xs">5 itens atingiram o estoque mínimo</p>
          </div>
          <button className="ml-auto text-orange-500 hover:text-orange-700 transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Charts & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Desempenho Semestral" subtitle="Comparativo de faturamento e margem">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#1e293b' }}
                />
                <Bar dataKey="faturamento" radius={[6, 6, 0, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#f97316' : '#fed7aa'} />
                  ))}
                </Bar>
                <Bar dataKey="margem" fill="#fb923c" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-200"></div>
              <span className="text-xs font-medium text-slate-500">Faturamento Bruto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs font-medium text-slate-500">Margem Líquida</span>
            </div>
          </div>
        </Card>

        <Card title="Próximos Agendamentos" subtitle="Hoje, 25 de Fevereiro">
          <div className="space-y-4 mt-4">
            {[
              { time: '09:00', patient: 'Maria Silva', procedure: 'Botox', status: 'Confirmado' },
              { time: '10:30', patient: 'João Pereira', procedure: 'Limpeza de Pele', status: 'Aguardando' },
              { time: '14:00', patient: 'Ana Costa', procedure: 'Preenchimento', status: 'Confirmado' },
            ].map((appointment, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-14 text-center">
                  {appointment.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{appointment.patient}</div>
                  <div className="text-xs text-slate-500 truncate">{appointment.procedure}</div>
                </div>
                <Badge variant={appointment.status === 'Confirmado' ? 'emerald' : 'orange'}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
            <button className="w-full mt-4 py-3 text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center justify-center gap-2 transition-colors border border-orange-100 rounded-xl hover:bg-orange-50">
              Ver Agenda Completa <ArrowRight size={16} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
