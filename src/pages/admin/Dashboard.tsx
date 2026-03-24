import React, { useState } from 'react';
import { DollarSign, Calendar, Users, BarChart3, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CashFlowChart } from '../../components/dashboard/CashFlowChart';
import { DashboardBalance } from '../../components/dashboard/DashboardBalance';


export const AdminDashboard = () => {
  const [activePeriod, setActivePeriod] = useState('MENSAL');
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
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors font-jakarta">
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

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors font-jakarta">
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

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors font-jakarta">
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

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors font-jakarta">
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
        <div className="bg-[#0A0A0A] border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 font-jakarta">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-400">Estoque Crítico</h4>
            <p className="text-xs text-neutral-500">Nenhum item em estado crítico</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 font-jakarta">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CashFlowChart activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        </div>

        <div className="lg:col-span-1">
          <DashboardBalance activePeriod={activePeriod} />
        </div>
      </div>
    </div>
  );
};
