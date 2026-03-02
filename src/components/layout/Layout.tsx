import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  Box,
  DollarSign,
  PieChart,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Bot,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { analyzeUI } from '../../lib/gemini';
import { saveAuditLog } from '../../lib/audit';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'font-semibold' : ''}`}
    style={{
      backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
      color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
    }}
    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-hover-text)'; } }}
    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)'; } }}
  >
    <div style={{ color: active ? 'var(--sidebar-active-text)' : 'inherit' }}>
      {icon}
    </div>
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
  </button>
);

export const Layout = ({ children, activeMenu, setActiveMenu }: any) => {
  const { config, supabase, clearConfig } = useConfig();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [appliedImprovements, setAppliedImprovements] = useState<string[]>([]);

  const handleAiReview = async () => {
    if (!config?.geminiApiKey) return;

    setIsAnalyzing(true);
    try {
      const layoutDesc = `Página atual: ${activeMenu}. O layout segue um design system laranja com fundo slate-50 e cards brancos.`;
      const result = await analyzeUI(config.geminiApiKey, layoutDesc);
      setAiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyImprovement = async (suggestion: string) => {
    if (!supabase) return;

    setAppliedImprovements(prev => [...prev, suggestion]);
    await saveAuditLog(supabase, {
      page_name: activeMenu,
      issue_found: "Sugestão da IA",
      improvement_applied: suggestion
    });
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-72 flex flex-col shrink-0 z-20 transition-colors duration-300" style={{ backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-t from-yellow-200 via-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <Sparkles className="text-[#2c1306]" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Estética<span className="text-orange-500">Pro</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold mb-4 px-4 tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>Menu Principal</div>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeMenu === 'Dashboard'} onClick={() => setActiveMenu('Dashboard')} />
          <SidebarItem icon={<Calendar size={20} />} label="Agenda" active={activeMenu === 'Agenda'} onClick={() => setActiveMenu('Agenda')} />
          <SidebarItem icon={<BarChart3 size={20} />} label="CRM" active={activeMenu === 'CRM'} onClick={() => setActiveMenu('CRM')} />
          <SidebarItem icon={<Users size={20} />} label="Clientes" active={activeMenu === 'Clientes'} onClick={() => setActiveMenu('Clientes')} />
          <SidebarItem icon={<Box size={20} />} label="Estoque" active={activeMenu === 'Estoque'} onClick={() => setActiveMenu('Estoque')} />
          <SidebarItem icon={<DollarSign size={20} />} label="Financeiro" active={activeMenu === 'Financeiro'} onClick={() => setActiveMenu('Financeiro')} />
          <SidebarItem icon={<PieChart size={20} />} label="Relatórios" active={activeMenu === 'Relatórios'} onClick={() => setActiveMenu('Relatórios')} />
        </nav>

        <div className="p-4 space-y-1" style={{ borderTop: '1px solid var(--border-default)' }}>
          <SidebarItem icon={<Settings size={20} />} label="Configurações" active={activeMenu === 'Configurações'} onClick={() => setActiveMenu('Configurações')} />
          <SidebarItem icon={<LogOut size={20} />} label="Sair" active={false} onClick={clearConfig} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="glow-blob absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
          <div className="glow-blob absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-950/20 blur-[100px] rounded-full"></div>
        </div>
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>

        {/* AI UI Review Toggle */}
        <button
          onClick={() => setIsAiPanelOpen(true)}
          className="absolute bottom-8 right-8 w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all z-40 hover:scale-110 active:scale-95 group"
        >
          <Bot size={28} />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI UI Review
          </div>
        </button>

        {/* AI UI Review Panel */}
        {isAiPanelOpen && (
          <div className="absolute inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Bot size={20} />
                </div>
                <h3 className="font-semibold text-slate-800">AI UI Review</h3>
              </div>
              <button onClick={() => setIsAiPanelOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {!aiResult && !isAnalyzing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-slate-300" size={32} />
                  </div>
                  <h4 className="text-slate-800 font-medium mb-2">Análise de Interface</h4>
                  <p className="text-slate-500 text-sm mb-6">Deixe a IA analisar o layout atual e sugerir melhorias de UX.</p>
                  <button
                    onClick={handleAiReview}
                    className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Iniciar Auditoria
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="text-orange-500 animate-spin" size={40} />
                  <p className="text-slate-500 text-sm animate-pulse">Analisando design system...</p>
                </div>
              )}

              {aiResult && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Score de UX</span>
                      <span className="text-2xl font-bold text-orange-600">{aiResult.overall_score}/10</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${aiResult.overall_score * 10}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Problemas Identificados</h4>
                    {aiResult.issues.map((issue: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {issue}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sugestões de Melhoria</h4>
                    {aiResult.suggestions.map((suggestion: string, i: number) => (
                      <div key={i} className="group relative bg-white border border-slate-200 p-4 rounded-xl hover:border-orange-300 transition-all">
                        <p className="text-sm text-slate-700 mb-3">{suggestion}</p>
                        <button
                          disabled={appliedImprovements.includes(suggestion)}
                          onClick={() => applyImprovement(suggestion)}
                          className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${appliedImprovements.includes(suggestion)
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100'
                            }`}
                        >
                          {appliedImprovements.includes(suggestion) ? (
                            <><CheckCircle2 size={14} /> Aplicado</>
                          ) : (
                            <><ChevronRight size={14} /> Aplicar Melhoria</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { setAiResult(null); setAppliedImprovements([]); }}
                    className="w-full py-3 text-slate-400 text-sm hover:text-slate-600 transition-colors"
                  >
                    Limpar Análise
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
