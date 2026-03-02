import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  User,
  Briefcase,
  Box,
  DollarSign,
  PieChart,
  Settings,
  LogOut,
  Building2,
  Shield,
  Bot,
  Webhook,
  Palette,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Asterisk,
  Clock,
  CheckCircle2,
  XCircle,
  List,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  MoreVertical,
  Mic,
  Square,
  Upload,
  MessageCircle,
  FileText,
  Filter,
  Download,
  Search,
  Sparkles,
  Activity,
  Loader2,
  Copy,
  Ticket,
  Crown,
  Target,
  Key,
  Link,
  ExternalLink,
  Zap,
  Receipt,
  Percent,
  FileSignature,
  Sun,
  Moon
} from 'lucide-react';

import { ReceituarioView } from './ReceituarioView';

const Toggle = ({ checked, onChange, disabled, isDarkMode = true }: { checked: boolean, onChange: (checked: boolean) => void, disabled: boolean, isDarkMode?: boolean }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none border ${checked
        ? (isDarkMode ? 'bg-[#3f1d0b] border-[#7c2d12]' : 'bg-orange-100 border-orange-200')
        : (isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-zinc-100 border-zinc-200')
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full transition-transform ${checked
          ? 'translate-x-5 bg-[#f97316]'
          : (isDarkMode ? 'translate-x-1 bg-[#52525b]' : 'translate-x-1 bg-zinc-400')
          }`}
      />
    </button>
  );
};

const NavItem = ({ icon, label, active, onClick, isDarkMode = true }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, isDarkMode?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium border ${active ? 'border-orange-900/30' : 'border-transparent'}`}
    style={{
      backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
      color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
    }}
    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-hover-text)'; } }}
    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)'; } }}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
  </button>
);

const SettingsNavItem = ({ icon, title, subtitle, active, onClick, isDarkMode = true }: { icon: React.ReactNode, title: string, subtitle: string, active?: boolean, onClick: () => void, isDarkMode?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-colors text-left border ${active ? 'border-orange-900/30' : 'border-transparent'}`}
    style={{
      backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
    }}
    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; } }}
    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; } }}
  >
    <div className={`mt-0.5 ${active ? 'text-orange-500' : ''}`} style={{ color: active ? undefined : 'var(--text-tertiary)' }}>
      {icon}
    </div>
    <div>
      <div className="font-medium mb-0.5" style={{ color: active ? 'var(--sidebar-active-text)' : 'var(--text-primary)' }}>{title}</div>
      <div className="text-xs" style={{ color: active ? 'rgba(249,115,22,0.7)' : 'var(--text-tertiary)' }}>{subtitle}</div>
    </div>
  </button>
);

type Permissions = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type ModulePermissions = {
  [key: string]: Permissions;
};

const LoginScreen = ({ onLogin, isDarkMode = true }: { onLogin: (email: string) => void, isDarkMode?: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className={`min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-orange-500/30 transition-colors duration-300 relative`}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="stars absolute inset-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
      </div>
      <div className={`w-full max-w-md bg-[#0a0a0a] border-white/10 electric-card relative z-10 border rounded-2xl p-8 shadow-2xl transition-colors duration-300`}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Asterisk className={`${isDarkMode ? "text-white" : "text-zinc-900"}`} size={24} />
          </div>
          <span className={`text-white font-semibold text-2xl tracking-tight`}>EstéticaPro</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors`}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors`}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-gradient-to-t from-yellow-200 via-orange-400 to-orange-500 text-[#2c1306] shadow-[0_0_40px_-5px_rgba(249,115,22,0.6)] hover:scale-105 hover:shadow-[0_0_60px_-5px_rgba(249,115,22,0.8)] border-none font-medium py-2.5 rounded-lg transition-colors mt-2`}
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-500">
          Dica: Use um email com a palavra <strong className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>admin</strong> para entrar como Admin. Qualquer outro email entrará como <strong className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Profissional</strong>.
        </div>
      </div>
    </div>
  );
};

const PendingScreen = ({ onLogout, isDarkMode = true }: { onLogout: () => void, isDarkMode?: boolean }) => (
  <div className={`min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-orange-500/30 transition-colors duration-300 relative`}>
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="stars absolute inset-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
    </div>
    <div className={`w-full relative z-10 max-w-md bg-[#0a0a0a] border-white/10 electric-card border rounded-2xl p-8 shadow-2xl text-center transition-colors duration-300`}>
      <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="text-orange-500" size={32} />
      </div>
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-2`}>Acesso Pendente</h2>
      <p className="text-zinc-400 mb-8">
        Sua solicitação de acesso foi enviada e está aguardando aprovação de um administrador.
      </p>
      <button
        onClick={onLogout}
        className={`w-full bg-zinc-800 hover:bg-zinc-700 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium py-2.5 rounded-lg transition-colors`}
      >
        Voltar para o Login
      </button>
    </div>
  </div>
);

const DeniedScreen = ({ onLogout, isDarkMode = true }: { onLogout: () => void, isDarkMode?: boolean }) => (
  <div className={`min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-orange-500/30 transition-colors duration-300 relative`}>
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="stars absolute inset-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
    </div>
    <div className={`w-full relative z-10 max-w-md bg-[#0a0a0a] border-red-900/50 electric-card border rounded-2xl p-8 shadow-2xl text-center transition-colors duration-300`}>
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="text-red-500" size={32} />
      </div>
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-2`}>Acesso Negado</h2>
      <p className="text-zinc-400 mb-8">
        Seu acesso a esta clínica foi negado ou revogado por um administrador.
      </p>
      <button
        onClick={onLogout}
        className={`w-full bg-zinc-800 hover:bg-zinc-700 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium py-2.5 rounded-lg transition-colors`}
      >
        Voltar para o Login
      </button>
    </div>
  </div>
);

type AccessStatus = 'pending' | 'approved' | 'denied';

const DashboardView = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {
  const [faqs, setFaqs] = useState([{ q: 'Dói fazer botox?', a: 'Utilizamos pomada anestésica de alta eficácia para garantir o máximo de conforto.' }]);

  const [finCategories, setFinCategories] = useState([
    { id: '1', name: 'Procedimentos Injetáveis', type: 'Receita' },
    { id: '2', name: 'Estética Facial', type: 'Receita' },
    { id: '3', name: 'Fornecedores (Botox/Preenchedores)', type: 'Despesa' },
    { id: '4', name: 'Aluguel & Condomínio', type: 'Despesa' }
  ]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center gap-3">
        <LayoutDashboard className="text-[var(--text-primary)]" size={32} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
      </header>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="flex flex-col gap-6 max-w-6xl">

          {/* Top Stats Row */}
          <div className="grid grid-cols-4 gap-6">
            {/* Faturamento */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-neutral-500 tracking-wider">FATURAMENTO<br />TOTAL</h3>
                <div className="w-8 h-8 rounded-full border border-emerald-900/50 flex items-center justify-center text-emerald-500">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">R$ 14.500,00</div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <TrendingUp size={14} />
                <span>+12.5% vs mês anterior</span>
              </div>
            </div>

            {/* Agendamentos */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-neutral-500 tracking-wider">AGENDAMENTOS</h3>
                <div className="w-8 h-8 rounded-full border border-orange-900/50 flex items-center justify-center text-orange-500">
                  <Calendar size={16} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">42</div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <TrendingUp size={14} />
                <span>+8.2% vs mês anterior</span>
              </div>
            </div>

            {/* Novos Leads */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-neutral-500 tracking-wider">NOVOS LEADS</h3>
                <div className="w-8 h-8 rounded-full border border-blue-900/50 flex items-center justify-center text-blue-500">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">18</div>
              <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                <TrendingDown size={14} />
                <span>-3.1% vs mês anterior</span>
              </div>
            </div>

            {/* Despesas */}
            <div className="bg-neutral-900 border-white/10 border rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-neutral-500 tracking-wider">DESPESAS DO MÊS</h3>
                <div className="w-8 h-8 rounded-full border border-purple-900/50 flex items-center justify-center text-purple-500">
                  <BarChart3 size={16} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">R$ 3.200,00</div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <TrendingUp size={14} />
                <span>+5.7% vs mês anterior</span>
              </div>
            </div>
          </div>

          {/* Alerts Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className={` ${isDarkMode ? "bg-[#1c0d0d] border-red-900/30" : "bg-red-50 border-red-100"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300 `}>
              <div className="w-10 h-10 rounded-lg border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-red-400 font-medium text-sm">Estoque Crítico</h4>
                <p className="text-zinc-500 text-xs">Nenhum item em estado crítico</p>
              </div>
            </div>
            <div className={` ${isDarkMode ? "bg-[#1c140d] border-orange-900/30" : "bg-orange-50 border-orange-100"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300 `}>
              <div className="w-10 h-10 rounded-lg border border-orange-900/50 flex items-center justify-center text-orange-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-orange-400 font-medium text-sm">Estoque Baixo</h4>
                <p className="text-zinc-500 text-xs">Nenhum item com estoque baixo</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="col-span-2 bg-neutral-900 border-white/10 border rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold text-white">Desempenho Semestral</h3>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-neutral-400 tracking-wider">ÚLTIMOS 6 MESES</span>
              </div>

              {/* Mock Chart Area */}
              <div className="h-64 flex items-end justify-between gap-4 px-4 pb-8 relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-full border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} h-0`} />
                  ))}
                </div>

                {/* Bars */}
                {[
                  { month: 'SET', val1: 40, val2: 20 },
                  { month: 'OUT', val1: 55, val2: 30 },
                  { month: 'NOV', val1: 45, val2: 25 },
                  { month: 'DEZ', val1: 90, val2: 60 },
                  { month: 'JAN', val1: 65, val2: 40 },
                  { month: 'FEV', val1: 50, val2: 35 },
                ].map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 z-10 w-full">
                    <div className="w-full max-w-[48px] h-full flex items-end relative group">
                      {/* Background Bar (Faturamento Bruto) */}
                      <div
                        className={`absolute bottom-0 w-full ${isDarkMode ? 'bg-zinc-800/50 group-hover:bg-zinc-700/50' : 'bg-zinc-100 group-hover:bg-zinc-200'} rounded-t-lg transition-all duration-300`}
                        style={{ height: `${data.val1}%` }}
                      />
                      {/* Foreground Bar (Margem Líquida) */}
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                        style={{ height: `${data.val2}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{data.month}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-100 border-zinc-200'} border`}></div>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Faturamento Bruto (R$)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Margem Líquida</span>
                </div>
              </div>
            </div>

            {/* Agenda Widget */}
            <div className={`col-span-1 ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200/50"} border rounded-2xl p-6 shadow-xl transition-colors duration-300 flex flex-col`}>
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} leading-tight`}>Próximos<br />Agendamentos</h3>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-900/30 text-red-400 border border-red-900/50 tracking-wider">HOJE</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-zinc-500 text-sm mb-4">Nenhum agendamento para hoje</p>
                <button className="text-orange-500 hover:text-orange-400 text-sm font-medium flex items-center gap-1 transition-colors">
                  Ver Agenda Completa <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CurrentTimeIndicator = () => {
  const [now, setNow] = useState(new Date());
  const [slotHeight, setSlotHeight] = useState(41); // fallback height

  useEffect(() => {
    // Get actual height of a row from DOM for precise calculation
    const slotEl = document.querySelector('.time-slot-row');
    if (slotEl) {
      setSlotHeight(slotEl.clientHeight);
    }

    // Set minimal timeout to sync with next clock minute
    const msToNextMinute = 60000 - (new Date().getSeconds() * 1000 + new Date().getMilliseconds());
    let interval: any;

    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesFromStart = (hours - 8) * 60 + minutes;

  // Assuming calendar hours: 08:00 to 20:00 (which is 12 hours * 60 mins = 720 mins)
  if (minutesFromStart < 0 || minutesFromStart > 720) return null;

  // Each slot represents 30 minutes
  const topPx = (minutesFromStart / 30) * slotHeight;

  return (
    <div
      className="absolute left-0 right-0 z-30 flex items-center pointer-events-none transition-all duration-1000"
      style={{ top: `${topPx}px`, transform: 'translateY(-50%)' }}
    >
      <div className="absolute left-[59px] w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
      <div className="ml-[64px] h-[2px] bg-red-500/80 flex-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
    </div>
  );
};

const SERVICE_INVENTORY_MAP: Record<string, string> = {
  'Botox': '1x Seringa 1ml, 2x Agulhas 30G, 4U Toxina Botulínica',
  'Harmonização Facial': '2x Preenchedor Hialurônico, Kit Cânulas, Anestésico',
  'Limpeza de Pele': 'Kit Higienização, Máscara Calmante, 2x Gaze Estéril',
  'default': 'Kit Descartável Padrão, Gel Condutor, Luvas Nitrílicas'
};

const AgendaView = ({ professionals, services = [], onCompleteService, isDarkMode = true }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [isProfDropdownOpen, setIsProfDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppDetails, setSelectedAppDetails] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Indexador para performance O(1) no render da grade
  const appointmentsMap = useMemo(() => {
    const map: Record<string, any> = {};
    appointments.forEach(app => {
      const prof = professionals.find((p: any) => p.id === app.professionalId);
      const key = `${app.professionalId}-${app.time}`;
      map[key] = { ...app, displayColor: prof?.color || 'orange' };
    });
    return map;
  }, [appointments, professionals]); // Reage a mudanças em ambos

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const handleTimeClick = (time: string) => {
    if (isDetailsModalOpen) return; // Impede abrir modal de novo agendamento se o de detalhes estiver aberto
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const getContrastYIQ = (hexcolor: string) => {
    const colors: Record<string, string> = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', purple: '#a855f7', orange: '#f97316' };
    const hex = hexcolor.startsWith('#') ? hexcolor : (colors[hexcolor] || '#f97316');
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'text-zinc-900' : 'text-white';
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className={`${isDarkMode ? "text-white" : "text-zinc-900"}`} size={32} />
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Agenda</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-4 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium`}>
            <button className="hover:text-orange-500 transition-colors"><ChevronLeft size={20} /></button>
            <span>domingo, 22 fev</span>
            <button className="hover:text-orange-500 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* Content Grid */}
      <div className="flex-1 flex px-12 gap-8 z-10 overflow-hidden pb-10">

        {/* Main Calendar Area */}
        <div className={`flex-1 flex flex-col bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-3xl overflow-hidden shadow-xl shadow-black/50`}>
          {/* Professionals Header */}
          <div className={`flex border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} pl-16`}>
            {professionals.map((prof: any) => (
              <div key={prof.id} className={`flex-1 p-4 flex items-center gap-3 border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} last:border-r-0`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold shadow-lg`} style={{ backgroundColor: prof.color }}>
                  {prof.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm leading-tight`}>{prof.name}</div>
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mt-0.5">0 AGEND.</div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <CurrentTimeIndicator />
            {timeSlots.map(time => (
              <div key={time} className={`time-slot-row flex border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} transition-colors`}>
                <div className={`w-16 p-3 text-xs font-medium text-zinc-500 border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} flex items-center justify-center`}>
                  {time}
                </div>
                {professionals.map((prof: any) => (
                  <div
                    key={`${prof.id}-${time}`}
                    className={`flex-1 p-2 border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} last:border-r-0 cursor-pointer transition-colors relative group ${isDarkMode ? "hover:bg-orange-500/10" : "hover:bg-orange-50"}`}
                    onClick={() => handleTimeClick(time)}
                  >
                    <div className={`absolute inset-2 rounded-lg border-2 border-dashed border-transparent transition-all duration-300 ${isDarkMode ? "group-hover:border-orange-500/30" : "group-hover:border-orange-400/60"}`} />
                    {(() => {
                      const app = appointmentsMap[`${prof.id}-${time}`];
                      if (!app) return null;
                      const textColor = getContrastYIQ(app.displayColor);
                      const bgColor = app.displayColor.startsWith('#') ? app.displayColor :
                        app.displayColor === 'red' ? '#ef4444' :
                          app.displayColor === 'blue' ? '#3b82f6' :
                            app.displayColor === 'green' ? '#22c55e' :
                              app.displayColor === 'purple' ? '#a855f7' : '#f97316';
                      return (
                        <div
                          className={`absolute inset-1 z-20 ${textColor} p-2 rounded-lg shadow-md animate-in zoom-in duration-200 flex flex-col overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/50 transition-all`}
                          style={{ backgroundColor: bgColor }}
                          onClick={(e) => { e.stopPropagation(); setSelectedAppDetails(app); setIsDetailsModalOpen(true); }}
                        >
                          <span className="text-[10px] font-bold uppercase truncate leading-tight pointer-events-none">{app.patient}</span>
                          <span className="text-[9px] opacity-90 truncate leading-tight pointer-events-none">{app.service}</span>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-md p-8 relative`}>
            <button
              onClick={() => { setIsModalOpen(false); setIsProfDropdownOpen(false); setIsServiceDropdownOpen(false); setSelectedProfessional(''); }}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Novo Agendamento</h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Paciente</label>
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Data</label>
                  <input
                    type="date"
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Horário</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min="08:00"
                    max="19:30"
                    step="1800"
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Profissional</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfDropdownOpen(!isProfDropdownOpen)}
                    className={`w-full flex items-center justify-between bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors relative z-10`}
                  >
                    <span className="truncate">{(professionals && selectedProfessional) ? professionals.find((p: any) => p.id === selectedProfessional)?.name : 'Selecione um profissional'}</span>
                    <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${isProfDropdownOpen ? 'rotate-180' : ''} text-zinc-500`} />
                  </button>
                  {isProfDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfDropdownOpen(false)} />
                      <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"}`}>
                        {(professionals || []).map((prof: any) => (
                          <button key={prof.id} type="button" onClick={() => { setSelectedProfessional(prof.id); setIsProfDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors relative z-50 ${selectedProfessional === prof.id ? 'bg-orange-500/10 text-orange-500 font-medium' : (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100')}`}>{prof.name}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Serviço</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className={`w-full flex items-center justify-between bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors relative z-10`}
                  >
                    <span className="truncate">{(services && selectedService) ? services.find((s: any) => s.id === selectedService)?.name : 'Selecione um serviço'}</span>
                    <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${isServiceDropdownOpen ? 'rotate-180' : ''} text-zinc-500`} />
                  </button>
                  {isServiceDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsServiceDropdownOpen(false)} />
                      <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl border shadow-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"}`}>
                        {(services || []).map((service: any) => (
                          <button key={service.id} type="button" onClick={() => { setSelectedService(service.id); setIsServiceDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors relative z-50 ${selectedService === service.id ? 'bg-orange-500/10 text-orange-500 font-medium' : (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100')}`}>{service.name}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!patientName || !selectedService || !selectedProfessional || !selectedTime) {
                    alert('Erro: Preencha todos os campos antes de confirmar.');
                    return;
                  }
                  const newApp = {
                    id: Date.now(),
                    patient: patientName,
                    service: services.find((s: any) => s.id === selectedService)?.name || 'Serviço',
                    time: selectedTime,
                    professionalId: selectedProfessional,
                  };
                  setAppointments(prev => [...prev, newApp]);
                  // Cleanup Total de Estados
                  setIsModalOpen(false);
                  setPatientName('');
                  setSelectedService('');
                  setSelectedProfessional('');
                  setIsProfDropdownOpen(false);
                  setIsServiceDropdownOpen(false);
                }}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] mt-2"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details / Life Cycle Modal */}
      {isDetailsModalOpen && selectedAppDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-sm p-8 relative`}>
            <button
              onClick={() => { setIsDetailsModalOpen(false); setSelectedAppDetails(null); }}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Detalhes do Atendimento</h2>
            <p className="text-zinc-500 text-sm mb-6">{selectedAppDetails.time} • Status: Confirmado</p>

            <div className={`p-4 rounded-xl border ${isDarkMode ? "border-zinc-800 bg-[#121214]" : "border-zinc-200 bg-zinc-50"} mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <User size={20} />
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{selectedAppDetails.patient}</div>
                  <div className="text-xs text-zinc-500">{selectedAppDetails.service}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setPatientName(selectedAppDetails.patient);
                  setSelectedService(services.find((s: any) => s.name === selectedAppDetails.service)?.id || '');
                  setSelectedProfessional(selectedAppDetails.professionalId);
                  setSelectedTime(selectedAppDetails.time);
                  setIsDetailsModalOpen(false);
                  setIsModalOpen(true);
                }}
                className={`w-full py-3 rounded-xl border ${isDarkMode ? "border-zinc-800 text-white hover:bg-zinc-800" : "border-zinc-200 text-zinc-900 hover:bg-zinc-100"} font-medium transition-colors`}
              >
                Remarcar Agendamento
              </button>

              <button
                onClick={() => {
                  const serviceName = selectedAppDetails.service;
                  const insumos = SERVICE_INVENTORY_MAP[serviceName] || SERVICE_INVENTORY_MAP['default'];
                  alert(`✅ ATENDIMENTO FINALIZADO\n\nPaciente: ${selectedAppDetails.patient}\nBaixa no Estoque: ${insumos}`);
                  setAppointments(prev => prev.filter(a => a.id !== selectedAppDetails.id));
                  setIsDetailsModalOpen(false);
                  setSelectedAppDetails(null);
                }}
                className="w-full py-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 font-medium transition-colors"
              >
                Concluído (Baixa no Estoque)
              </button>

              <button
                onClick={() => {
                  const cancelReason = prompt('Motivo do cancelamento (opcional):');
                  if (cancelReason !== null) {
                    setAppointments(prev => prev.filter(a => a.id !== selectedAppDetails.id));
                    setIsDetailsModalOpen(false);
                    setSelectedAppDetails(null);
                    alert(`Agendamento cancelado com sucesso.`);
                  }
                }}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors"
              >
                Cancelar Atendimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CrmView = ({ patients, setPatients, columns, setColumns, onGenerateReceituario, isDarkMode = true }: any) => {
  const [isNewColumnModalOpen, setIsNewColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newCardName, setNewCardName] = useState('');

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const activeCard = patients.find((p: any) => p.id === activeCardId) || null;

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordType, setRecordType] = useState('Evolução');
  const recognitionRef = useRef<any>(null);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');

  React.useEffect(() => {
    if (activeCard) {
      setEditName(activeCard.name || '');
      setEditPhone(activeCard.phone || '');
      setEditEmail(activeCard.email || '');
      setEditNotes(activeCard.notes || '');
    }
  }, [activeCard?.id]);

  const handleCreateColumn = () => {
    if (newColumnName.trim()) {
      setColumns([...columns, { id: Date.now().toString(), title: newColumnName, cardIds: [] }]);
      setNewColumnName('');
      setIsNewColumnModalOpen(false);
    }
  };

  const handleCreateCard = () => {
    if (newCardName.trim() && activeColumnId) {
      const newPatient = { id: Date.now().toString(), name: newCardName, phone: '', email: '', notes: '', history: [] };
      setPatients([newPatient, ...patients]);
      setColumns(columns.map((col: any) => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            cardIds: [...col.cardIds, newPatient.id]
          };
        }
        return col;
      }));
      setNewCardName('');
      setIsNewCardModalOpen(false);
    }
  };

  const handleRecordAudio = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let currentFinalTranscript = transcription;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        currentFinalTranscript += newFinalTranscript;
        setTranscription(currentFinalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Erro na gravação de áudio:", event.error);
        if (event.error === 'not-allowed') {
          alert("Permissão de microfone necessária para gravar.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        console.error("Erro ao iniciar gravação:", e);
        setIsRecording(false);
      }
    }
  };

  const handleSaveRecord = () => {
    if (!transcription.trim() || !activeCard) return;

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type: recordType,
      content: transcription.trim()
    };

    const updatedCard = {
      ...activeCard,
      name: editName,
      phone: editPhone,
      email: editEmail,
      notes: editNotes,
      history: [newRecord, ...(activeCard.history || [])]
    };

    setPatients(patients.map((p: any) => p.id === activeCard.id ? updatedCard : p));
    setTranscription('');
  };

  const handleSavePatient = () => {
    if (!activeCard) return;
    const updatedCard = {
      ...activeCard,
      name: editName,
      phone: editPhone,
      email: editEmail,
      notes: editNotes,
    };
    setPatients(patients.map((p: any) => p.id === activeCard.id ? updatedCard : p));
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-500" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Pipeline de Vendas</h1>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Gerencie o fluxo de pacientes da sua clínica</p>
        </div>

        <button
          onClick={() => setIsNewColumnModalOpen(true)}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        >
          <Plus size={18} />
          Nova Coluna
        </button>
      </header>

      {/* Content Grid - Kanban Board */}
      <div className="flex-1 flex px-12 gap-6 z-10 overflow-x-auto pb-10 custom-scrollbar items-start">
        {columns.map((column: any) => (
          <div key={column.id} className={`w-80 shrink-0 bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl flex flex-col max-h-full`}>
            {/* Column Header */}
            <div className={`p-4 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-sm uppercase tracking-wider`}>{column.title}</h3>
                <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">{column.cardIds.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveColumnId(column.id); setIsNewCardModalOpen(true); }}
                  className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors p-1`}
                >
                  <Plus size={16} />
                </button>
                <button className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors p-1`}>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Cards Area */}
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {column.cardIds.map((cardId: string) => {
                const card = patients.find((p: any) => p.id === cardId);
                if (!card) return null;
                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveCardId(card.id)}
                    className={`${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800/80 rounded-xl p-4 cursor-pointer hover:border-orange-500/50 transition-colors group`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                        {card.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>{card.name || 'Sem Nome'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* New Column Modal */}
      {isNewColumnModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button
              onClick={() => setIsNewColumnModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Nova Coluna</h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome da Etapa</label>
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Ex: Em Negociação"
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  autoFocus
                />
              </div>

              <button
                onClick={handleCreateColumn}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                Criar Coluna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Card Modal */}
      {isNewCardModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button
              onClick={() => setIsNewCardModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Novo Paciente/Lead</h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Paciente</label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  autoFocus
                />
              </div>

              <button
                onClick={handleCreateCard}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                Adicionar ao Funil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {activeCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button
              onClick={() => setActiveCardId(null)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors z-10`}
            >
              <X size={20} />
            </button>

            {/* Left Sidebar - Patient Data */}
            <div className={`w-80 bg-[#050505] border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} p-8 flex flex-col overflow-y-auto custom-scrollbar`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Dados Cadastrais</h3>

              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-4xl shadow-[0_0_30px_rgba(249,115,22,0.3)]`}>
                  {editName ? editName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">E-mail</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Observações Gerais</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Alergias, queixas principais..."
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-24`}
                  />
                </div>

                <button
                  onClick={handleSavePatient}
                  className={`w-full bg-[#0a0a0a] hover:bg-zinc-900 border border-zinc-800 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-3 rounded-xl transition-colors mt-4 text-sm`}
                >
                  Salvar Cadastro
                </button>
              </div>
            </div>

            {/* Right Area - Clinical History */}
            <div className="flex-1 p-8 flex flex-col bg-[#0a0a0a]">
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Histórico Clínico</h3>

              {/* New Record Box */}
              <div className={`bg-[#050505] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleRecordAudio}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isRecording
                      ? 'bg-red-600 text-white border border-red-500 animate-pulse'
                      : 'bg-[#1c0d04] text-orange-500 border border-[#431c09] hover:bg-orange-500/20'
                      }`}
                  >
                    {isRecording ? <Square size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                  </button>

                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className={`bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500`}
                  >
                    <option>Evolução</option>
                    <option>Anamnese</option>
                    <option>Procedimento</option>
                  </select>

                  <span className="text-zinc-500 text-sm ml-auto">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>

                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Descreva o atendimento, procedimento ou anamnese. O áudio transcrito aparecerá aqui..."
                  className={`w-full bg-transparent border-none ${isDarkMode ? "text-zinc-300" : "text-zinc-900"} focus:outline-none resize-none h-32 text-sm leading-relaxed`}
                />

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveRecord}
                    disabled={!transcription.trim()}
                    className={`font-semibold px-6 py-2 rounded-xl transition-all text-sm ${transcription.trim()
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                  >
                    Salvar Prontuário
                  </button>
                </div>
              </div>

              {/* History List */}
              {activeCard.history && activeCard.history.length > 0 ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {activeCard.history.map((record: any) => (
                    <div key={record.id} className={`${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800/80 rounded-2xl p-5`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-500 font-medium text-sm">{record.type}</span>
                        <span className="text-zinc-500 text-xs">{record.date}</span>
                      </div>
                      <p className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} text-sm leading-relaxed whitespace-pre-wrap`}>
                        {record.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-zinc-600 text-sm">Nenhum prontuário registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientesView = ({ patients, setPatients, onGenerateReceituario, isDarkMode = true }: any) => {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);

  const activePatient = patients.find((p: any) => p.id === activePatientId) || null;
  const isCreating = isNewPatientModalOpen && !activePatientId;
  const currentPatient = activePatient || (isCreating ? { id: 'new', name: '', phone: '', email: '', notes: '', history: [] } : null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordType, setRecordType] = useState('Evolução');
  const recognitionRef = useRef<any>(null);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');

  React.useEffect(() => {
    if (currentPatient) {
      setEditName(currentPatient.name || '');
      setEditPhone(currentPatient.phone || '');
      setEditEmail(currentPatient.email || '');
      setEditNotes(currentPatient.notes || '');
    }
  }, [currentPatient?.id]);

  const handleRecordAudio = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let currentFinalTranscript = transcription;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        currentFinalTranscript += newFinalTranscript;
        setTranscription(currentFinalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Erro na gravação de áudio:", event.error);
        if (event.error === 'not-allowed') {
          alert("Permissão de microfone necessária para gravar.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        console.error("Erro ao iniciar gravação:", e);
        setIsRecording(false);
      }
    }
  };

  const handleSaveRecord = () => {
    if (!transcription.trim() || !currentPatient) return;

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type: recordType,
      content: transcription.trim()
    };

    let updatedPatient;
    if (isCreating) {
      updatedPatient = {
        ...currentPatient,
        id: Date.now().toString(),
        name: editName || 'Paciente Sem Nome',
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
        history: [newRecord]
      };
      setPatients([updatedPatient, ...patients]);
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = {
        ...currentPatient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
        history: [newRecord, ...(currentPatient.history || [])]
      };
      setPatients(patients.map((p: any) => p.id === currentPatient.id ? updatedPatient : p));
    }

    setTranscription('');
  };

  const handleSavePatient = () => {
    if (!currentPatient) return;

    let updatedPatient;
    if (isCreating) {
      updatedPatient = {
        ...currentPatient,
        id: Date.now().toString(),
        name: editName || 'Paciente Sem Nome',
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
      };
      setPatients([updatedPatient, ...patients]);
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = {
        ...currentPatient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        notes: editNotes,
      };
      setPatients(patients.map((p: any) => p.id === currentPatient.id ? updatedPatient : p));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-500" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Base de Pacientes <span className="text-zinc-500 text-xl ml-2">{patients.length}</span></h1>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Prontuários criptografados • LGPD Compliant</p>
        </div>

        <div className="flex items-center gap-4">
          <button className={`w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:${isDarkMode ? "text-white" : "text-zinc-900"} hover:border-zinc-600 transition-colors`}>
            <Upload size={18} />
          </button>
          <button
            onClick={() => { setIsNewPatientModalOpen(true); setActivePatientId(null); }}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Plus size={18} />
            Novo Paciente
          </button>
        </div>
      </header>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(patient => (
            <div key={patient.id} className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 hover:border-orange-500/30 transition-colors group`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-xl shadow-[0_0_15px_rgba(249,115,22,0.2)]`}>
                    {patient.name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>{patient.name || 'Sem Nome'}</h3>
                    <p className="text-zinc-500 text-sm">{patient.phone || 'Telefone não cadastrado'}</p>
                  </div>
                </div>
                <button className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className={`${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} rounded-xl p-4 mb-6 border border-zinc-800/50`}>
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">Resumo / Histórico</span>
                <p className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} text-sm line-clamp-2`}>
                  {patient.history && patient.history.length > 0 ? patient.history[0].content : patient.notes || 'Nenhum registro.'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">{patient.history?.length || 0} registros</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-900/30 text-green-500 hover:bg-green-500/10 transition-colors text-xs font-medium">
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setActivePatientId(patient.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-900/30 text-orange-500 hover:bg-orange-500/10 transition-colors text-xs font-medium"
                  >
                    <FileText size={14} />
                    Prontuário
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {(isNewPatientModalOpen || activePatientId) && currentPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button
              onClick={() => { setIsNewPatientModalOpen(false); setActivePatientId(null); }}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors z-10`}
            >
              <X size={20} />
            </button>

            {/* Left Sidebar - Patient Data */}
            <div className={`w-80 bg-[#050505] border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} p-8 flex flex-col overflow-y-auto custom-scrollbar`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Dados Cadastrais</h3>

              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-4xl shadow-[0_0_30px_rgba(249,115,22,0.3)]`}>
                  {editName ? editName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">E-mail</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Observações Gerais</label>
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Alergias, queixas principais..."
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-24`}
                  />
                </div>

                <button
                  onClick={handleSavePatient}
                  className={`w-full bg-[#0a0a0a] hover:bg-zinc-900 border border-zinc-800 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-3 rounded-xl transition-colors mt-4 text-sm`}
                >
                  Salvar Cadastro
                </button>
              </div>
            </div>

            {/* Right Area - Clinical History */}
            <div className="flex-1 p-8 flex flex-col bg-[#0a0a0a]">
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Histórico Clínico</h3>

              {/* New Record Box */}
              <div className={`bg-[#050505] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleRecordAudio}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isRecording
                      ? 'bg-red-600 text-white border border-red-500 animate-pulse'
                      : 'bg-[#1c0d04] text-orange-500 border border-[#431c09] hover:bg-orange-500/20'
                      }`}
                  >
                    {isRecording ? <Square size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
                  </button>

                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className={`bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500`}
                  >
                    <option>Evolução</option>
                    <option>Anamnese</option>
                    <option>Procedimento</option>
                  </select>

                  <span className="text-zinc-500 text-sm ml-auto">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>

                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Descreva o atendimento, procedimento ou anamnese. O áudio transcrito aparecerá aqui..."
                  className={`w-full bg-transparent border-none ${isDarkMode ? "text-zinc-300" : "text-zinc-900"} focus:outline-none resize-none h-32 text-sm leading-relaxed`}
                />

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveRecord}
                    disabled={!transcription.trim()}
                    className={`font-semibold px-6 py-2 rounded-xl transition-all text-sm ${transcription.trim()
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                  >
                    Salvar Prontuário
                  </button>
                </div>
              </div>

              {/* History List */}
              {currentPatient.history && currentPatient.history.length > 0 ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {currentPatient.history.map((record: any) => (
                    <div key={record.id} className={`${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800/80 rounded-2xl p-5`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-500 font-medium text-sm">{record.type}</span>
                        <span className="text-zinc-500 text-xs">{record.date}</span>
                      </div>
                      <p className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} text-sm leading-relaxed whitespace-pre-wrap`}>
                        {record.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-zinc-600 text-sm">Nenhum prontuário registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ProfissionaisView = ({ professionals, setProfessionals, isDarkMode = true }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [color, setColor] = useState('#f97316');
  const [docType, setDocType] = useState('CRM');
  const [docNumber, setDocNumber] = useState('');
  const [docUF, setDocUF] = useState('');

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState('#f97316');

  const handleOpenModal = (prof?: any) => {
    if (prof) {
      setEditingId(prof.id);
      setName(prof.name);
      setSpecialty(prof.specialty || '');
      setColor(prof.color);
      setTempColor(prof.color);
      setDocType(prof.doc?.type || 'CRM');
      setDocNumber(prof.doc?.number || '');
      setDocUF(prof.doc?.uf || '');
    } else {
      setEditingId(null);
      setName('');
      setSpecialty('');
      setColor('#f97316');
      setTempColor('#f97316');
      setDocType('CRM');
      setDocNumber('');
      setDocUF('');
    }
    setIsModalOpen(true);
    setShowColorPicker(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingId) {
      setProfessionals(professionals.map((p: any) =>
        p.id === editingId ? { ...p, name, specialty, color, doc: { type: docType, number: docNumber, uf: docUF } } : p
      ));
    } else {
      setProfessionals([...professionals, {
        id: Date.now().toString(),
        name,
        specialty,
        color,
        active: true,
        doc: { type: docType, number: docNumber, uf: docUF }
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      setProfessionals(professionals.filter((p: any) => p.id !== id));
    }
  };

  const handleApplyColor = () => {
    setColor(tempColor);
    setShowColorPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="text-orange-500" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Profissionais & Equipe</h1>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Gerencie profissionais, cores da agenda e especialidades</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        >
          <Plus size={18} />
          Cadastrar Profissional
        </button>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((prof: any) => (
            <div
              key={prof.id}
              className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 relative group transition-all`}
              style={{ borderTopColor: prof.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-xl shadow-lg`}
                    style={{ backgroundColor: prof.color }}
                  >
                    {prof.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-base`}>{prof.name}</h3>
                    {prof.specialty && <p className="text-zinc-500 text-xs mt-0.5">{prof.specialty}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(prof)} className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors p-1`}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(prof.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">ATIVO</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prof.color }} />
                  <span className="text-zinc-500 text-xs font-mono">{prof.color}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button
            onClick={() => handleOpenModal()}
            className={`bg-transparent border-2 border-dashed border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} hover:border-zinc-600 hover:bg-zinc-900/20 transition-all min-h-[160px]`}
          >
            <Plus size={24} className="mb-2" />
            <span className="font-medium">Adicionar Novo</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-md p-8 relative`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Cadastrar Profissional</h2>

            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">NOME COMPLETO</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1">DOCUMENTO</label>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-orange-500">
                      {['CRM', 'CRO', 'COREN', 'CRBM', 'Outros'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1">NÚMERO</label>
                    <input value={docNumber} onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-orange-500" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1">UF</label>
                    <input value={docUF} maxLength={2} onChange={(e) => setDocUF(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} placeholder="SP" className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white text-center outline-none focus:border-orange-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Especialidade (Opcional)</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ex: Dermatologista"
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Cor de Identificação (Agenda)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-16 h-10 rounded-lg border border-zinc-700 shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-zinc-500 text-sm font-mono">{color}</span>
                </div>

                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-zinc-200 w-64">
                    <HexColorPicker color={tempColor} onChange={setTempColor} style={{ width: '100%' }} />
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={tempColor}
                        onChange={(e) => setTempColor(e.target.value)}
                        className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-orange-500 uppercase font-mono"
                      />
                    </div>
                    <button
                      onClick={handleApplyColor}
                      className={`w-full bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-2.5 rounded-xl transition-colors mt-4 text-sm`}
                    >
                      Aplicar Cor
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-3.5 rounded-xl transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ServicosView = ({ services, setServices, inventory, isDarkMode = true }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Dados do Serviço');
  const [filterCategory, setFilterCategory] = useState('Todos');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Outros');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const [commission, setCommission] = useState('');
  const [transactionFee, setTransactionFee] = useState('');
  const [description, setDescription] = useState('');
  const [serviceItems, setServiceItems] = useState<{ id: string, itemId: string, quantity: number }[]>([]);

  const [desiredMargin, setDesiredMargin] = useState('60');

  const categories = ['Todos', 'Injetáveis', 'Facial', 'Corporal', 'Laser', 'Outros'];

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setName(service.name);
      setCategory(service.category);
      setDuration(service.duration.toString());
      setPrice(service.price.toString());
      setTax(service.tax.toString());
      setCommission(service.commission?.toString() || '');
      setTransactionFee(service.transactionFee?.toString() || '');
      setDescription(service.description || '');
      setServiceItems(service.items || []);
    } else {
      setEditingId(null);
      setName('');
      setCategory('Outros');
      setDuration('');
      setPrice('');
      setTax('');
      setCommission('');
      setTransactionFee('');
      setDescription('');
      setServiceItems([]);
    }
    setActiveTab('Dados do Serviço');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newService = {
      id: editingId || Date.now().toString(),
      name,
      category,
      duration: parseInt(duration) || 0,
      price: parseFloat(price) || 0,
      tax: parseFloat(tax) || 0,
      commission: parseFloat(commission) || 0,
      transactionFee: parseFloat(transactionFee) || 0,
      description,
      items: serviceItems
    };

    if (editingId) {
      setServices(services.map((s: any) => s.id === editingId ? newService : s));
    } else {
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter((s: any) => s.id !== id));
    }
  };

  const handleAddItem = () => {
    setServiceItems([...serviceItems, { id: Date.now().toString(), itemId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    setServiceItems(serviceItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setServiceItems(serviceItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemCost = (itemId: string, quantity: number) => {
    const invItem = inventory.find((i: any) => i.id === itemId);
    if (!invItem) return 0;
    return invItem.price * quantity;
  };

  const totalCost = serviceItems.reduce((sum, item) => sum + calculateItemCost(item.itemId, item.quantity), 0);
  const currentPrice = parseFloat(price) || 0;
  const currentTax = parseFloat(tax) || 0;
  const currentCommission = parseFloat(commission) || 0;
  const currentTransactionFee = parseFloat(transactionFee) || 0;

  const taxAmount = currentPrice * (currentTax / 100);
  const commissionAmount = currentPrice * (currentCommission / 100);
  const transactionFeeAmount = currentPrice * (currentTransactionFee / 100);

  const grossProfit = currentPrice - totalCost;
  const netProfit = grossProfit - taxAmount - commissionAmount - transactionFeeAmount;
  const marginPercent = currentPrice > 0 ? (netProfit / currentPrice) * 100 : 0;

  const idealPrice = totalCost / Math.max(0.01, (1 - (parseFloat(desiredMargin) / 100) - (currentTax / 100) - (currentCommission / 100) - (currentTransactionFee / 100)));

  const filteredServices = filterCategory === 'Todos' ? services : services.filter((s: any) => s.category === filterCategory);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-orange-500" size={32} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Catálogo de Serviços</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Gerencie seus procedimentos e precificação</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl px-4 py-2 flex items-center gap-2 shadow-[var(--card-shadow)]">
              <span className="text-sm text-[var(--text-secondary)]">Ticket Médio:</span>
              <span className="text-[var(--text-primary)] font-medium">R$ 1011</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-emerald-500">
              <TrendingUp size={16} />
              <span className="font-medium">Margem: 86%</span>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Plus size={18} />
              Novo Serviço
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={`flex items-center gap-6 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-sm font-medium transition-colors relative ${filterCategory === cat ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {cat}
              {filterCategory === cat && (
                <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => {
            const sTotalCost = (service.items || []).reduce((sum: number, item: any) => sum + calculateItemCost(item.itemId, item.quantity), 0);
            const sTaxAmount = service.price * (service.tax / 100);
            const sNetProfit = service.price - sTotalCost - sTaxAmount;
            const sMargin = service.price > 0 ? (sNetProfit / service.price) * 100 : 0;

            return (
              <div key={service.id} className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 hover:border-orange-500/30 transition-colors group`}>
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-[10px] font-bold text-zinc-400 border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} px-2 py-1 rounded uppercase tracking-wider`}>
                    {service.category}
                  </span>
                  <div className="flex items-center gap-2 transition-opacity">
                    <button onClick={() => handleOpenModal(service)} className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors p-1`}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-xl mb-1`}>{service.name}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{service.description || 'Sem descrição.'}</p>
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Box size={14} />
                    <span>{formatCurrency(sTotalCost)}</span>
                  </div>
                </div>

                <div className={`flex items-end justify-between pt-4 border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"}`}>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">Valor</span>
                    <span className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-2xl`}>{formatCurrency(service.price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-500 font-bold text-lg block">{sMargin.toFixed(0)}%</span>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Lucro: {formatCurrency(sNetProfit)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-2xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors z-10`}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2 shrink-0">
              <Briefcase className="text-orange-500" size={24} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Cadastrar Serviço</h2>
            </div>
            <p className="text-zinc-400 text-sm mb-6 shrink-0">Configure os detalhes e precificação do procedimento</p>

            <div className={`flex items-center gap-2 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} p-1 rounded-xl mb-6 shrink-0`}>
              <button
                onClick={() => setActiveTab('Dados do Serviço')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'Dados do Serviço' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-400 hover:text-white'}`}
              >
                <FileText size={16} />
                Dados do Serviço
              </button>
              <button
                onClick={() => setActiveTab('Calculadora de Preço')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'Calculadora de Preço' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-400 hover:text-white'}`}
              >
                <DollarSign size={16} />
                Calculadora de Preço
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {activeTab === 'Dados do Serviço' ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Procedimento</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Harmonização Facial"
                      className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                      >
                        {categories.filter(c => c !== 'Todos').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Duração (Min)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Ex: 60"
                        className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                    </div>
                  </div>

                  <div className={`border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-xl p-4 bg-[#050505]`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Box className="text-orange-500" size={16} />
                        <h4 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>Insumos do Procedimento</h4>
                      </div>
                      <button onClick={handleAddItem} className="text-orange-500 hover:text-orange-400 text-xs font-medium flex items-center gap-1">
                        <Plus size={14} /> Adicionar
                      </button>
                    </div>

                    {serviceItems.length === 0 ? (
                      <div className={`text-center py-4 text-zinc-600 text-xs italic border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"}`}>
                        Nenhum insumo adicionado.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {serviceItems.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <select
                              value={item.itemId}
                              onChange={(e) => handleItemChange(item.id, 'itemId', e.target.value)}
                              className={`flex-1 bg-[#121214] border border-zinc-800 rounded-lg px-3 py-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500`}
                            >
                              <option value="">Buscar no estoque...</option>
                              {inventory.map((inv: any) => (
                                <option key={inv.id} value={inv.id}>{inv.name} - {formatCurrency(inv.price)}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className={`w-20 bg-[#121214] border border-zinc-800 rounded-lg px-3 py-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 text-center`}
                              min="0"
                              step="0.1"
                            />
                            <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`mt-4 pt-3 border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} flex justify-end items-center gap-2`}>
                      <span className="text-zinc-500 text-xs">Custo Total:</span>
                      <span className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>{formatCurrency(totalCost)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Valor de Cobrança (R$)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Imposto (%)</label>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="0"
                        className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Descrição</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detalhes adicionais do procedimento..."
                      className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors resize-none h-24`}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-medium flex items-center gap-2`}><Asterisk className="text-orange-500" size={16} /> Estratégia de Precificação</h3>
                      <p className="text-zinc-500 text-xs mt-1">Simule cenários e encontre o preço ideal</p>
                    </div>
                    <button className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} text-xs flex items-center gap-1 transition-colors`}>
                      <Clock size={12} /> Resetar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Receita Bruta (Preço de Venda)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Custo Insumos (Auto)</label>
                        <div className={`w-full ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400`}>
                          {formatCurrency(totalCost)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Imposto (%)</label>
                        <input
                          type="number"
                          value={tax}
                          onChange={(e) => setTax(e.target.value)}
                          placeholder="0"
                          className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Comissão (%)</label>
                        <input
                          type="number"
                          value={commission}
                          onChange={(e) => setCommission(e.target.value)}
                          placeholder="0"
                          className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Taxa de Transação (%)</label>
                        <input
                          type="number"
                          value={transactionFee}
                          onChange={(e) => setTransactionFee(e.target.value)}
                          placeholder="0"
                          className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`bg-[#050505] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-xl p-5`}>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider mb-4 uppercase block">Breakdown do Resultado</span>

                    <div className="flex flex-col gap-3 text-sm">
                      <div className={`flex justify-between ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>
                        <span>Receita Bruta</span>
                        <span>{formatCurrency(currentPrice)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Custo de Insumos</span>
                        <span>- {formatCurrency(totalCost)}</span>
                      </div>
                      <div className={`flex justify-between ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>
                        <span>Lucro Bruto</span>
                        <span>{formatCurrency(grossProfit)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Impostos</span>
                        <span>- {formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Comissões</span>
                        <span>- {formatCurrency(commissionAmount)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Taxas de Transação</span>
                        <span>- {formatCurrency(transactionFeeAmount)}</span>
                      </div>

                      <div className={`border-t ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} my-2 pt-4 flex items-end justify-between`}>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Lucro Líquido</span>
                        <div className="text-right">
                          <span className={`text-2xl font-bold block ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {formatCurrency(netProfit)}
                          </span>
                          <span className="text-zinc-500 text-[10px] flex items-center justify-end gap-1 mt-1">
                            <TrendingUp size={10} /> {marginPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-orange-900/30 bg-orange-500/5 rounded-xl p-5">
                    <h4 className="text-orange-500 font-medium text-sm flex items-center gap-2 mb-4">
                      <Asterisk size={16} /> Simulador Inteligente
                    </h4>

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Margem desejada:</span>
                      <div className={`flex items-center bg-[#050505] border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} rounded-lg overflow-hidden w-24`}>
                        <input
                          type="number"
                          value={desiredMargin}
                          onChange={(e) => setDesiredMargin(e.target.value)}
                          className={`w-full bg-transparent px-3 py-1.5 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none text-center`}
                        />
                        <span className="text-zinc-500 text-xs pr-3">%</span>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-xs flex items-center gap-2">
                      <span className="text-yellow-500">💡</span> Para atingir <strong className={`${isDarkMode ? "text-white" : "text-zinc-900"}`}>{desiredMargin}%</strong> de margem, seu preço ideal seria <strong className="text-orange-500">{formatCurrency(idealPrice || 0)}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-4 mt-6 pt-6 border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} shrink-0`}>
              {activeTab === 'Calculadora de Preço' ? (
                <>
                  <button
                    onClick={() => setActiveTab('Dados do Serviço')}
                    className={`flex-1 bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-3.5 rounded-xl transition-colors`}
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setPrice(idealPrice.toFixed(2))}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                  >
                    Usar este Valor
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar Serviço
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const EstoqueView = ({ inventory, setInventory, isDarkMode = true }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Insumos');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Insumos', 'Materiais', 'Equipamentos', 'Outros'];

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setCategory(item.category || 'Insumos');
      setPrice(item.price.toString());
      setSalePrice(item.salePrice ? item.salePrice.toString() : '');
      setStock(item.stock.toString());
      setMinStock(item.minStock.toString());
    } else {
      setEditingId(null);
      setName('');
      setCategory('Insumos');
      setPrice('');
      setSalePrice('');
      setStock('');
      setMinStock('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newItem = {
      id: editingId || Date.now().toString(),
      name,
      category,
      price: parseFloat(price) || 0,
      salePrice: parseFloat(salePrice) || 0,
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 0,
    };

    if (editingId) {
      setInventory(inventory.map((i: any) => i.id === editingId ? newItem : i));
    } else {
      setInventory([...inventory, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setInventory(inventory.filter((i: any) => i.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalValue = inventory.reduce((sum: number, item: any) => sum + (item.price * item.stock), 0);
  const lowStockItems = inventory.filter((item: any) => item.stock <= item.minStock);

  const filteredInventory = inventory.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-orange-500" size={32} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Estoque & Produtos</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Gerencie o inventário e tabela de preços</p>
          </div>

          <div className="flex items-center gap-4">
            <button className={`bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors`}>
              <Filter size={18} />
              Filtros
            </button>
            <button className={`bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors`}>
              <Download size={18} />
              Exportar
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Plus size={18} />
              Novo Produto
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Valor Total em Estoque</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <DollarSign size={16} />
              </div>
            </div>
            <div>
              <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{formatCurrency(totalValue)}</h3>
              <p className="text-zinc-500 text-xs">{inventory.length} itens cadastrados</p>
            </div>
          </div>

          <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Itens em Baixa</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div>
              <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{lowStockItems.length}</h3>
              <p className="text-zinc-500 text-xs">Necessitam reposição imediata</p>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className={`bg-transparent border-2 border-dashed border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} hover:border-zinc-600 hover:bg-zinc-900/20 transition-all`}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
              <Plus size={20} />
            </div>
            <span className={`font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Novo Produto</span>
            <span className="text-xs">Cadastrar novo item no estoque</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-12 pb-10 z-10 overflow-hidden flex flex-col">
        <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl flex-1 flex flex-col overflow-hidden`}>
          <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} flex items-center justify-between shrink-0`}>
            <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Inventário</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[#121214] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} text-[10px] font-bold text-zinc-500 uppercase tracking-wider`}>
                  <th className="p-4 pl-6">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Custo Unit.</th>
                  <th className="p-4">Preço Venda</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item: any) => {
                  const isLowStock = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className={`border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} hover:bg-zinc-900/30 transition-colors group`}>
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-zinc-900 border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-center text-zinc-400`}>
                            <Box size={14} />
                          </div>
                          <span className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 text-sm">{item.category}</td>
                      <td className={`p-4 ${isDarkMode ? "text-white" : "text-zinc-900"} font-mono text-sm`}>{formatCurrency(item.price)}</td>
                      <td className="p-4 text-zinc-500 font-mono text-sm">{item.salePrice ? formatCurrency(item.salePrice) : '-'}</td>
                      <td className={`p-4 ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-sm`}>{item.stock}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${isLowStock ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          {isLowStock ? 'EM BAIXA' : 'EM ESTOQUE'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(item)} className={`text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors p-1`}>
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-md p-8 relative`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Cadastrar Produto</h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Produto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ácido Hialurônico (1ml)"
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  <span className="text-[10px] text-zinc-600 mt-1 block">Opcional para revenda</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Estoque Atual</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Estoque Mínimo</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    placeholder="Alerta em..."
                    className={`w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold py-3.5 rounded-xl transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const FinanceiroView = ({ expenses, setExpenses, isDarkMode = true }: any) => {
  const [activeTab, setActiveTab] = useState('Fluxo de Caixa');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Outros');
  const [quantity, setQuantity] = useState('1');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [recurrence, setRecurrence] = useState('Não');
  const [periodo, setPeriodo] = useState('Diário');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('Todos');

  const categories = ['Insumos', 'Materiais', 'Equipamentos', 'Impostos', 'Salários', 'Aluguel', 'Marketing', 'Outros'];

  const handleOpenModal = () => {
    setDescription('');
    setCategory('Outros');
    setQuantity('1');
    setValue('');
    setDueDate('');
    setStatus('Pendente');
    setRecurrence('Não');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!description.trim() || !value || !dueDate) return;

    const newExpense = {
      id: Date.now().toString(),
      description,
      category,
      quantity: parseInt(quantity) || 1,
      value: parseFloat(value) || 0,
      dueDate,
      status,
      recurrence,
      type: 'Despesa'
    };

    setExpenses([...expenses, newExpense]);
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.value, 0);
  const pendingExpenses = expenses.filter((exp: any) => exp.status === 'Pendente');
  const totalPending = pendingExpenses.reduce((sum: number, exp: any) => sum + exp.value, 0);

  const filteredExpenses = expenses.filter((exp: any) => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) || exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = transactionFilter === 'Todos' ||
      (transactionFilter === 'Despesas' && exp.type === 'Despesa') ||
      (transactionFilter === 'Pendentes' && exp.status === 'Pendente') ||
      (transactionFilter === 'Receitas' && exp.type === 'Receita');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-orange-500" size={32} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Financeiro</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Controle inteligente de receitas, despesas e projeções</p>
          </div>

          <div className="flex items-center gap-4">
            <button className={`bg-transparent border ${isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-white" : "border-[var(--border-default)] hover:bg-zinc-100 text-zinc-900"} font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors`}>
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex items-center gap-6 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
          <button
            onClick={() => setActiveTab('Fluxo de Caixa')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'Fluxo de Caixa' ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <TrendingUp size={16} />
            Fluxo de Caixa
          </button>
          <button
            onClick={() => setActiveTab('Gestão de Despesas')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'Gestão de Despesas' ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Clock size={16} />
            Gestão de Despesas
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-12 pb-10 z-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">

        {activeTab === 'Fluxo de Caixa' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Receita Total</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-emerald-500 text-xs font-medium">+0.0% <span className="text-zinc-500 font-normal">mês anterior</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Despesas Totais</span>
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <TrendingDown size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{formatCurrency(totalExpenses)}</h3>
                  <p className="text-emerald-500 text-xs font-medium">+0.0% <span className="text-zinc-500 font-normal">mês anterior</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Saldo Líquido</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <DollarSign size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-emerald-500 mb-1">{formatCurrency(-totalExpenses)}</h3>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Margem</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <PieChart size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>0.0%</h3>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Receita x Despesa</h3>
                <div className="segmented-control">
                  {['Geral', 'Diário', 'Semanal', 'Mensal'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriodo(p)}
                      className={`segmented-control-item ${periodo === p ? 'active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 relative">
                {/* Mock Chart Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[50, 40, 30, 20, 10, 0].map(val => (
                    <div key={val} className="flex items-center gap-4">
                      <span className="text-[10px] text-zinc-600 w-8 text-right">R${val}K</span>
                      <div className={`flex-1 border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed`}></div>
                    </div>
                  ))}
                </div>
                {/* Mock Chart Bars */}
                <div className="absolute bottom-6 left-12 right-0 h-[2px] bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>

                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-zinc-600">
                  <span>01</span><span>03</span><span>05</span><span>07</span><span>09</span><span>11</span><span>13</span><span>15</span><span>17</span><span>19</span><span>21</span><span>23</span><span>25</span><span>28</span>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Previsão Financeira</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md uppercase tracking-wider">Saudável</span>
                </div>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Receita média (3m)</span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>R$ 0,00</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Despesa média (3m)</span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>R$ 0,00</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Despesas recorrentes</span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Projeção 30 dias</span>
                    <span className="text-sm font-bold text-emerald-500">R$ 0,00</span>
                  </div>
                </div>
              </div>

              <div className={`md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col shadow-[var(--card-shadow)]`}>
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold mb-6`}>Despesas por Categoria</h3>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-zinc-500 italic">Sem despesas no período</span>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className={`bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-[var(--card-shadow)]`}>
              <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} flex items-center justify-between`}>
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Transações</h3>
                <div className="flex items-center gap-4">
                  <div className="segmented-control">
                    {['Todos', 'Receitas', 'Despesas', 'Pendentes'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setTransactionFilter(filter)}
                        className={`segmented-control-item ${transactionFilter === filter ? 'active' : ''}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl pl-10 pr-4 py-2 text-sm ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} text-[10px] font-bold text-zinc-500 uppercase tracking-wider`}>
                      <th className="p-4 pl-6">Descrição</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? filteredExpenses.map((item: any) => (
                      <tr key={item.id} className={`border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} hover:bg-zinc-900/30 transition-colors`}>
                        <td className={`p-4 pl-6 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>{item.description}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.category}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.dueDate}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${item.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right text-red-500 font-mono text-sm">-{formatCurrency(item.value)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 text-sm italic">Nenhuma transação encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Gestão de Despesas' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Pendente</span>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Clock size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-yellow-500 mb-1">{formatCurrency(totalPending)}</h3>
                  <p className="text-zinc-500 text-xs">{pendingExpenses.length} contas a pagar</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Maior Categoria</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <PieChart size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>-</h3>
                  <p className="text-zinc-500 text-xs">R$ 0,00 (0%)</p>
                </div>
              </div>

              <button
                onClick={handleOpenModal}
                className={`bg-transparent border-2 border-dashed ${isDarkMode ? "border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/20 text-zinc-500" : "border-zinc-200 hover:border-orange-500/50 hover:bg-zinc-50 text-zinc-700 shadow-sm"} rounded-2xl p-6 flex flex-col items-center justify-center transition-all`}
              >
                <div className={`w-10 h-10 rounded-full ${isDarkMode ? "bg-zinc-900" : "bg-zinc-100"} flex items-center justify-center mb-3`}>
                  <Plus size={20} />
                </div>
                <span className={`font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Registrar Despesa</span>
                <span className="text-xs">Lançar novo custo ou gasto</span>
              </button>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold mb-6`}>Distribuição por Categoria</h3>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-zinc-500 italic">Sem despesas no período</span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-orange-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Análise de Lucro</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Receita Total</span>
                    <span className="text-sm font-bold text-emerald-500">R$ 0,00</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Custos Variáveis</span>
                    <span className="text-sm font-bold text-red-500">-R$ 0,00</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Custos Fixos</span>
                    <span className="text-sm font-bold text-red-500">-R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Lucro Bruto</span>
                    <span className="text-sm font-bold text-emerald-500">R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-base font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Lucro Líquido</span>
                    <span className="text-base font-bold text-emerald-500">R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-zinc-400">Margem Líquida</span>
                    <span className="text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-md tracking-wider flex items-center gap-1">
                      <TrendingDown size={12} />
                      0.0%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contas a Pagar Table */}
            <div className={`bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-[var(--card-shadow)]`}>
              <div className={`p-6 border-b border-[var(--border-default)] flex items-center justify-between`}>
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Contas a Pagar</h3>
                <div className="flex items-center gap-4">
                  <div className="segmented-control">
                    {['Todos', 'Pendente', 'Pago'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setTransactionFilter(filter)}
                        className={`segmented-control-item ${transactionFilter === filter ? 'active' : ''}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl pl-10 pr-4 py-2 text-sm ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} text-[10px] font-bold text-zinc-500 uppercase tracking-wider`}>
                      <th className="p-4 pl-6">Descrição</th>
                      <th className="p-4">Vencimento</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Valor</th>
                      <th className="p-4 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? filteredExpenses.map((item: any) => (
                      <tr key={item.id} className={`border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} hover:bg-zinc-900/30 transition-colors`}>
                        <td className={`p-4 pl-6 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>{item.description}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.dueDate}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.category}</td>
                        <td className="p-4 text-red-500 font-mono text-sm">{formatCurrency(item.value)}</td>
                        <td className="p-4 pr-6 text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${item.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 text-sm italic">Nenhuma despesa encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-md p-8 relative`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <FileText size={20} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Nova Despesa</h2>
                <p className="text-zinc-500 text-xs">Registre um novo gasto ou conta a pagar</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Compra de insumos"
                  className={`w-full ${isDarkMode ? "bg-[#050505] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full ${isDarkMode ? "bg-[#050505] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Quantidade</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className={`w-full ${isDarkMode ? "bg-[#050505] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Valor (R$)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    className={`w-full ${isDarkMode ? "bg-[#050505] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Vencimento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full ${isDarkMode ? "bg-[#050505] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStatus('Pendente')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${status === 'Pendente' ? 'premium-button-active' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200')}`}
                  >
                    <Clock size={14} />
                    Pendente
                  </button>
                  <button
                    onClick={() => setStatus('Pago')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${status === 'Pago' ? 'premium-button-active' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200')}`}
                  >
                    <CheckCircle2 size={14} />
                    Pago
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Recorrência</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Não', 'Mensal', 'Semanal'].map(rec => (
                    <button
                      key={rec}
                      onClick={() => setRecurrence(rec)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${recurrence === rec ? 'bg-zinc-800 text-white border border-zinc-700' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 shadow-sm')}`}
                    >
                      {rec !== 'Não' && <TrendingUp size={14} className="rotate-90" />}
                      {rec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 bg-transparent border ${isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-white" : "border-zinc-200 hover:bg-zinc-100 text-zinc-900 shadow-sm"} font-semibold py-3.5 rounded-xl transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar Despesa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const RelatoriosView = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {
  const [activeTab, setActiveTab] = useState('Financeiro Detalhado');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const handleGenerateReport = () => {
    setIsAiModalOpen(true);
    setIsGenerating(true);
    setReportContent('');

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportContent(`# Relatório de Inteligência Estratégica
Gerado em ${new Date().toLocaleDateString('pt-BR')}

## 1. Resumo Executivo
A clínica apresenta um cenário de estabilidade no curto prazo, porém com oportunidades claras de otimização na taxa de ocupação e retenção de clientes. O faturamento atual está dentro da média histórica, mas o ticket médio pode ser elevado através de cross-selling de serviços.

## 2. Análise Financeira
- **Faturamento**: Estável, sem grandes picos de sazonalidade neste mês.
- **Custos**: Os custos operacionais mantêm-se controlados, representando cerca de 40% da receita.
- **Recomendação**: Revisar a precificação dos procedimentos de maior saída (ex: Limpeza de Pele) para absorver o aumento recente no custo de insumos.

## 3. Desempenho Operacional
- **Ocupação**: A taxa média de ocupação da agenda está em 65%. Os horários da manhã (8h-11h) apresentam maior ociosidade.
- **Equipe**: Há uma disparidade de 30% na performance entre os profissionais mais requisitados e os demais.
- **Recomendação**: Criar pacotes promocionais específicos para os horários matutinos e promover treinamentos de vendas para a equipe técnica.

## 4. Comportamento do Cliente
- **Retenção**: A taxa de retorno de clientes novos está em 45%, abaixo da meta ideal de 60%.
- **Ticket Médio**: Clientes recorrentes gastam em média 50% a mais que clientes novos.
- **Recomendação**: Implementar um programa de fidelidade ou cashback para incentivar o retorno após o primeiro procedimento.

## 5. Plano de Ação (Próximos 30 dias)
1. Lançar campanha de "Morning Spa" com 15% OFF para agendamentos até as 11h.
2. Treinamento de equipe focado em oferta de pacotes de tratamento contínuo.
3. Revisão da tabela de preços dos top 5 procedimentos mais realizados.`);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    alert('Relatório copiado para a área de transferência!');
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="text-orange-500" size={32} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Central de Inteligência</h1>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Relatórios gerenciais e insights estratégicos</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerateReport}
              className={`font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] border ${isDarkMode ? "bg-gradient-to-r from-[#4a2511] to-[#2a1408] border-orange-500/30 hover:border-orange-500/60 text-orange-500" : "bg-gradient-to-r from-orange-400 to-orange-500 border-transparent hover:from-orange-500 hover:to-orange-600 text-white"}`}
            >
              <Sparkles size={18} />
              Criar Relatório IA
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex items-center gap-6 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
          <button
            onClick={() => setActiveTab('Financeiro Detalhado')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Financeiro Detalhado' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <DollarSign size={16} />
            Financeiro Detalhado
          </button>
          <button
            onClick={() => setActiveTab('Desempenho Operacional')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Desempenho Operacional' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <Activity size={16} />
            Desempenho Operacional
          </button>
          <button
            onClick={() => setActiveTab('Análise de Clientes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Análise de Clientes' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <Users size={16} />
            Análise de Clientes
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-12 pb-10 z-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">

        {activeTab === 'Financeiro Detalhado' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingUp size={12} /> 0.0%
                  </span>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Faturamento Total</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingUp size={12} /> 0.0%
                  </span>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Lucro Líquido <span className="font-normal normal-case">margem: 0.0%</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Ticket size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Ticket Médio <span className="font-normal normal-case">0 atendimentos</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className={`md:col-span-2 bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold mb-6`}>Evolução Receita vs Lucro</h3>
                <div className="flex-1 relative flex items-end pb-6">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-600">
                    <span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className={`border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed w-full h-0`}></div>)}
                  </div>
                  {/* Chart Line */}
                  <div className="absolute bottom-6 left-8 right-0 h-[2px] bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pt-2`}>
                    <span>set/25</span><span>out/25</span><span>nov/25</span><span>dez/25</span><span>jan/26</span><span>fev/26</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="text-yellow-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Top Procedimentos</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-zinc-500 italic">Sem dados</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Desempenho Operacional' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Clock size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>0h</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Horas Atendidas <span className="font-normal normal-case block mt-1">Últimos 6 meses</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Crown size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>-</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Top Performance</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Activity size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>0</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Procedimentos</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="text-yellow-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Ranking da Equipe</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-zinc-500 italic">Sem dados</span>
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-blue-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Taxa de Ocupação Semanal</h3>
                </div>
                <div className="flex-1 relative flex items-end pb-6 pl-8">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-600">
                    <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed w-full h-0`}></div>)}
                  </div>
                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pt-2`}>
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Análise de Clientes' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <User size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>5</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Novos Clientes <span className="font-normal normal-case block mt-1">Últimos 6 meses</span></p>
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Activity size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>0.0%</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Taxa de Retenção</p>
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <DollarSign size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">LTV <span className="font-normal normal-case block mt-1">Lifetime Value</span></p>
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Target size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>R$ 0,00</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">CAC <span className="font-normal normal-case block mt-1">Custo Aquisição</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className={`md:col-span-2 bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold mb-6`}>Evolução Novos vs Recorrentes</h3>
                <div className="flex-1 relative flex items-end pb-6">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-600">
                    <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map(i => <div key={i} className={`border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed w-full h-0`}></div>)}
                  </div>

                  {/* Chart Line - Mocked SVG */}
                  <div className="absolute inset-0 left-8 bottom-6 pointer-events-none">
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 0 100 L 20 100 L 40 100 L 60 100 L 80 90 L 100 20" fill="none" stroke="#10b981" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>

                  {/* Tooltip Mock */}
                  <div className={`absolute left-[30%] top-[40%] ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800 rounded-lg p-3 shadow-xl z-10`}>
                    <div className="text-[10px] text-zinc-500 mb-1">set/25</div>
                    <div className="text-xs font-bold text-blue-400">Novos: R$ 0,00</div>
                    <div className="text-xs font-bold text-emerald-400">Recorrentes: R$ 0,00</div>
                  </div>

                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pt-2`}>
                    <span>set/25</span><span>out/25</span><span>nov/25</span><span>dez/25</span><span>jan/26</span><span>fev/26</span>
                  </div>
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="text-yellow-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Clientes VIP</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-sm text-zinc-500 italic">Sem dados</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI Report Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors z-10`}
            >
              <X size={20} />
            </button>

            <div className={`p-8 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Estetix AI Analyst</h2>
                    <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">IA Insight</span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Relatório gerado automaticamente com base nos dados atuais</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative min-h-[300px]">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="text-orange-500 animate-spin mb-4" size={32} />
                  <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>A Inteligência Artificial está processando os dados da clínica...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-orange max-w-none">
                  <div className={`whitespace-pre-wrap ${isDarkMode ? "text-zinc-300" : "text-zinc-900"} text-sm leading-relaxed`}>
                    {reportContent}
                  </div>
                </div>
              )}
            </div>

            {!isGenerating && (
              <div className={`p-6 border-t ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} shrink-0 flex items-center justify-end gap-4`}>
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className={`bg-transparent ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold px-6 py-2.5 rounded-full transition-colors hover:bg-zinc-900`}
                >
                  Fechar
                </button>
                <button
                  onClick={handleCopy}
                  className={`bg-transparent border border-zinc-800 hover:bg-zinc-900 ${isDarkMode ? "text-white" : "text-zinc-900"} font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors`}
                >
                  <Copy size={18} />
                  Copiar
                </button>
                <button
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Download size={18} />
                  Exportar PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MatrixToggle = ({ checked, onChange, disabled }: { checked: boolean, onChange: () => void, disabled: boolean }) => (
  <button
    type="button"
    className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-orange-500 border-orange-500' : 'bg-zinc-300 border-zinc-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={() => !disabled && onChange()}
  >
    <span className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const SettingsView = ({
  role,
  currentPermissions,
  modules,
  handleToggle,
  activeSettingsMenu,
  setActiveSettingsMenu,
  activeTab,
  setActiveTab,
  pendingUsers,
  approvedUsers,
  deniedUsers,
  handleApprove,
  handleDeny,
  matrixRole,
  setMatrixRole,
  isSaving,
  handleSave,
  isDarkMode = true
}: any) => {
  const [faqs, setFaqs] = useState([{ q: 'Dói fazer botox?', a: 'Utilizamos pomada anestésica de alta eficácia para garantir o máximo de conforto.' }]);
  const [workingDays, setWorkingDays] = useState([true, true, true, true, true, true, false]);
  const [aiTone, setAiTone] = useState('Empático e Acolhedor');
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { name: 'PIX', tax: '0.00', days: '0', active: true },
    { name: 'Cartão de Débito', tax: '1.99', days: '1', active: true },
    { name: 'Crédito à Vista', tax: '3.49', days: '30', active: true },
    { name: 'Crédito Parcelado (12x)', tax: '12.99', days: '30', active: true },
    { name: 'Boleto Bancário', tax: '2.50', days: '3', active: false },
  ]);
  const [discountCardTax, setDiscountCardTax] = useState(true);
  const [discountProductCost, setDiscountProductCost] = useState(true);
  const [autoEmission, setAutoEmission] = useState(false);
  const [finCategories, setFinCategories] = useState([
    { id: '1', name: 'Procedimentos Injetáveis', type: 'Receita' },
    { id: '2', name: 'Estética Facial', type: 'Receita' },
    { id: '3', name: 'Fornecedores (Botox/Preenchedores)', type: 'Despesa' },
    { id: '4', name: 'Aluguel & Condomínio', type: 'Despesa' }
  ]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0">
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-2 tracking-tight`}>Control Center</h1>
        <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Configurações centralizadas do sistema.</p>
      </header>

      {/* Content Grid */}
      <div className="flex-1 flex px-12 gap-12 z-10 overflow-hidden pb-10">
        {/* Settings Nav */}
        <div className="w-72 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar pr-2">
          <SettingsNavItem icon={<Building2 size={20} />} title="Conta & Organização" subtitle="Dados e identidade da clínica" active={activeSettingsMenu === 'Conta & Organização'} onClick={() => setActiveSettingsMenu('Conta & Organização')} isDarkMode={isDarkMode} />
          <SettingsNavItem icon={<Users size={20} />} title="Usuários & Permissões" subtitle="RBAC, acessos e segurança" active={activeSettingsMenu === 'Usuários & Permissões'} onClick={() => setActiveSettingsMenu('Usuários & Permissões')} isDarkMode={isDarkMode} />
          <SettingsNavItem icon={<Bot size={20} />} title="IA & Automação" subtitle="Assistente, governança e logs" active={activeSettingsMenu === 'IA & Automação'} onClick={() => setActiveSettingsMenu('IA & Automação')} isDarkMode={isDarkMode} />
          <SettingsNavItem icon={<Webhook size={20} />} title="API & Integrações" subtitle="Chaves, webhooks e conexões" active={activeSettingsMenu === 'API & Integrações'} onClick={() => setActiveSettingsMenu('API & Integrações')} isDarkMode={isDarkMode} />
          <SettingsNavItem icon={<DollarSign size={20} />} title="Financeiro & Fiscal" subtitle="Categorias e configuração contábil" active={activeSettingsMenu === 'Financeiro & Fiscal'} onClick={() => setActiveSettingsMenu('Financeiro & Fiscal')} isDarkMode={isDarkMode} />
        </div>

        {/* Settings Content */}
        {activeSettingsMenu === 'Usuários & Permissões' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Usuários & Permissões</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Controle de acesso, segurança e auditoria.</p>
            </div>

            {/* Matrix Card */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="text-zinc-400" size={20} />
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Matriz de Permissões</h3>
                </div>

                {/* Role Switcher */}
                <div className="segmented-control">
                  <button
                    className={`segmented-control-item ${matrixRole === 'admin' ? 'active' : ''}`}
                    onClick={() => setMatrixRole('admin')}
                  >
                    Admin
                  </button>
                  <button
                    className={`segmented-control-item ${matrixRole === 'profissional' ? 'active' : ''}`}
                    onClick={() => setMatrixRole('profissional')}
                  >
                    Profissional
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="w-full">
                {/* Table Header */}
                <div className={`grid grid-cols-5 gap-4 pb-4 border-b ${isDarkMode ? "border-zinc-800" : "border-[var(--border-default)]"} text-xs font-medium text-zinc-500`}>
                  <div className="col-span-1">Módulo</div>
                  <div className="col-span-1 flex items-center justify-center gap-1.5"><Eye size={14} /> Visualizar</div>
                  <div className="col-span-1 flex items-center justify-center gap-1.5"><Plus size={14} /> Criar</div>
                  <div className="col-span-1 flex items-center justify-center gap-1.5"><Pencil size={14} /> Editar</div>
                  <div className="col-span-1 flex items-center justify-center gap-1.5"><Trash2 size={14} /> Excluir</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                  {modules.map((module: any) => (
                    <div key={module.id} className={`grid grid-cols-5 gap-4 py-4 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} items-center hover:${isDarkMode ? "bg-zinc-900/20" : "bg-zinc-50"} transition-colors rounded-lg -mx-2 px-2`}>
                      <div className={`col-span-1 text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>{module.name}</div>
                      <div className="col-span-1 flex justify-center">
                        <MatrixToggle
                          checked={currentPermissions[module.id].view}
                          onChange={() => handleToggle(module.id, 'view')}
                          disabled={matrixRole === 'admin'}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <MatrixToggle
                          checked={currentPermissions[module.id].create}
                          onChange={() => handleToggle(module.id, 'create')}
                          disabled={matrixRole === 'admin'}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <MatrixToggle
                          checked={currentPermissions[module.id].edit}
                          onChange={() => handleToggle(module.id, 'edit')}
                          disabled={matrixRole === 'admin'}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <MatrixToggle
                          checked={currentPermissions[module.id].delete}
                          onChange={() => handleToggle(module.id, 'delete')}
                          disabled={matrixRole === 'admin'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-semibold ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Bloqueado</span>
                  <span className="text-zinc-500">Admin sempre possui todas as permissões.</span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isSaving
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 cursor-default'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <CheckCircle2 size={16} />
                      Configuração Salva
                    </>
                  ) : (
                    'Salvar Configuração'
                  )}
                </button>
              </div>
            </div>

            {/* Gestão de Acessos Card */}
            <div className="mt-2 shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Gestão de Acessos</h3>
                  <p className="text-sm text-zinc-500">Clínica: são gonçalo</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User size={14} />
                  <span>{approvedUsers.length} ativos</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="segmented-control mb-6">
                <button
                  onClick={() => setActiveTab('Pendentes')}
                  className={`segmented-control-item ${activeTab === 'Pendentes' ? 'active' : ''}`}
                >
                  <Clock size={16} />
                  Pendentes
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-1 ${activeTab === 'Pendentes' ? 'bg-white text-orange-600' : (isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-500')
                    }`}>{pendingUsers.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('Ativos')}
                  className={`segmented-control-item ${activeTab === 'Ativos' ? 'active' : ''}`}
                >
                  <CheckCircle2 size={16} />
                  Ativos
                </button>
                <button
                  onClick={() => setActiveTab('Revogados')}
                  className={`segmented-control-item ${activeTab === 'Revogados' ? 'active' : ''}`}
                >
                  <XCircle size={16} />
                  Revogados
                </button>
                <button
                  onClick={() => setActiveTab('Auditoria')}
                  className={`segmented-control-item ${activeTab === 'Auditoria' ? 'active' : ''}`}
                >
                  <List size={16} />
                  Auditoria
                </button>
              </div>

              {/* Content Card */}
              <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80" : "bg-white border-zinc-200"}  border rounded-xl p-6 shadow-xl shadow-black/50 `}>
                {activeTab === 'Pendentes' && (
                  <div>
                    <div className="mb-6">
                      <h4 className={`text-base font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Solicitações Pendentes</h4>
                      <p className="text-sm text-zinc-500">Funcionários aguardando aprovação para acessar o painel.</p>
                    </div>

                    {pendingUsers.length === 0 ? (
                      <div className={`flex flex-col items-center justify-center py-10 text-center border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} rounded-xl ${isDarkMode ? "bg-zinc-900/10" : "bg-[var(--bg-surface)] shadow-sm"} border-dashed`}>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                          <Clock className="text-zinc-500" size={24} />
                        </div>
                        <h5 className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} font-medium mb-1`}>Nenhuma solicitação pendente</h5>
                        <p className="text-zinc-500 text-sm max-w-sm">
                          Quando novos funcionários solicitarem acesso, eles aparecerão aqui para sua aprovação.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {pendingUsers.map(([email]: any) => (
                          <div key={email} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} ${isDarkMode ? "bg-zinc-900/20" : "bg-[var(--bg-card)] shadow-sm"}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{email.split('@')[0]}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wider">PROFISSIONAL</span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{email} • Solicitado recentemente</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDeny(email)} className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 border border-red-900/30 transition-colors">
                                Negar
                              </button>
                              <button onClick={() => handleApprove(email)} className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-400/10 border border-emerald-900/30 transition-colors">
                                Aprovar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Ativos' && (
                  <div>
                    <div className="mb-6">
                      <h4 className={`text-base font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Usuários Ativos</h4>
                      <p className="text-sm text-zinc-500">Funcionários com acesso liberado ao sistema.</p>
                    </div>

                    {approvedUsers.length === 0 ? (
                      <div className={`flex flex-col items-center justify-center py-10 text-center border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} rounded-xl ${isDarkMode ? "bg-zinc-900/10" : "bg-[var(--bg-surface)] shadow-sm"} border-dashed`}>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                          <CheckCircle2 className="text-zinc-500" size={24} />
                        </div>
                        <h5 className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} font-medium mb-1`}>Nenhum usuário ativo</h5>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {approvedUsers.map(([email]: any) => (
                          <div key={email} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} ${isDarkMode ? "bg-zinc-900/20" : "bg-[var(--bg-card)] shadow-sm"}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{email.split('@')[0]}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wider">PROFISSIONAL</span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{email}</div>
                              </div>
                            </div>
                            <button onClick={() => handleDeny(email)} className={`px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:${isDarkMode ? "text-white" : "text-zinc-900"} ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"} border border-zinc-700 transition-colors`}>
                              Revogar Acesso
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Revogados' && (
                  <div>
                    <div className="mb-6">
                      <h4 className={`text-base font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Acessos Revogados</h4>
                      <p className="text-sm text-zinc-500">Funcionários que tiveram o acesso negado ou removido.</p>
                    </div>

                    {deniedUsers.length === 0 ? (
                      <div className={`flex flex-col items-center justify-center py-10 text-center border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} rounded-xl bg-zinc-900/10 border-dashed`}>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                          <XCircle className="text-zinc-500" size={24} />
                        </div>
                        <h5 className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} font-medium mb-1`}>Nenhum acesso revogado</h5>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {deniedUsers.map(([email]: any) => (
                          <div key={email} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} bg-zinc-900/20`}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{email.split('@')[0]}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wider">PROFISSIONAL</span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{email}</div>
                              </div>
                            </div>
                            <button onClick={() => handleApprove(email)} className={`px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:${isDarkMode ? "text-white" : "text-zinc-900"} hover:bg-zinc-800 border border-zinc-700 transition-colors`}>
                              Restaurar Acesso
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Auditoria' && (
                  <div>
                    <div className="mb-6">
                      <h4 className={`text-base font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Auditoria de Acessos</h4>
                      <p className="text-sm text-zinc-500">Histórico de aprovações e revogações.</p>
                    </div>
                    <div className={`flex flex-col items-center justify-center py-10 text-center border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} rounded-xl bg-zinc-900/10 border-dashed`}>
                      <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                        <List className="text-zinc-500" size={24} />
                      </div>
                      <h5 className={`${isDarkMode ? "text-zinc-300" : "text-zinc-900"} font-medium mb-1`}>Nenhum registro encontrado</h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'Conta & Organização' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Conta & Organização</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Dados e identidade da clínica</p>
            </div>

            {/* Perfil da Clínica */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Perfil da Clínica</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div onClick={() => alert('Abrindo galeria de mídia para seleção de imagem...')} className={`w-24 h-24 rounded-2xl bg-zinc-900 border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-center relative group cursor-pointer overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className={`${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`} />
                      <span className={`text-[10px] font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Alterar Logo</span>
                    </div>
                    <Building2 size={32} className="text-zinc-600 group-hover:opacity-0 transition-opacity" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Logo da Clínica</h4>
                    <p className="text-xs text-zinc-500 mb-3">Recomendado: 512x512px (PNG ou JPG)</p>
                    <label className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-[var(--border-default)] hover:bg-zinc-50 shadow-sm"} border text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors cursor-pointer inline-block text-center`}>
                      Fazer Upload
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) alert('Nova logo selecionada com sucesso!');
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome Fantasia</label>
                    <input type="text" defaultValue="EstéticaPro" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Razão Social</label>
                    <input type="text" defaultValue="EstéticaPro Clínica LTDA" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">CNPJ / CPF</label>
                    <input type="text" defaultValue="00.000.000/0001-00" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Inscrição Municipal</label>
                    <input type="text" placeholder="Opcional" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Inscrição Estadual</label>
                    <input type="text" placeholder="Opcional" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Perfil da clínica atualizado!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Perfil
                </button>
              </div>
            </div>

            {/* Contato e Localização */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Contato e Localização</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">E-mail Principal</label>
                    <input type="email" defaultValue="contato@esteticapro.com" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone / WhatsApp</label>
                    <input type="text" defaultValue="(11) 99999-9999" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">CEP</label>
                    <input type="text" defaultValue="00000-000" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Logradouro</label>
                    <input type="text" defaultValue="Av. Paulista" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Número</label>
                    <input type="text" defaultValue="1000" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Complemento</label>
                    <input type="text" placeholder="Sala 101" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Bairro</label>
                    <input type="text" defaultValue="Bela Vista" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Cidade</label>
                    <input type="text" defaultValue="São Paulo" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Estado</label>
                    <select className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Informações de contato e endereço salvas!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Contato
                </button>
              </div>
            </div>

            {/* Responsável Técnico */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <User className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Responsável Técnico / Legal</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Responsável</label>
                  <input type="text" defaultValue="Dra. Ana Costa" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Conselho de Classe</label>
                  <select className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}>
                    <option value="CRM">CRM</option>
                    <option value="CRO">CRO</option>
                    <option value="COREN">COREN</option>
                    <option value="CRF">CRF</option>
                    <option value="CREFITO">CREFITO</option>
                    <option value="Biomedicina">Biomedicina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Número de Registro</label>
                  <input type="text" defaultValue="123456-SP" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Dados do Responsável Técnico registrados!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Responsável
                </button>
              </div>
            </div>

            {/* Configurações Operacionais */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Configurações Operacionais</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-4 uppercase">Horário de Funcionamento</label>
                  <div className="flex flex-col gap-3">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, i) => (
                      <div key={day} className={`flex items-center gap-4 p-3 rounded-lg border border-[var(--border-default)] ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"}`}>
                        <div className="w-24">
                          <span className={`text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>{day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="time" defaultValue={i < 5 ? "08:00" : i === 5 ? "09:00" : ""} disabled={i === 6} className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} border rounded-md px-2 py-1 text-xs ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 disabled:opacity-50`} />
                          <span className="text-zinc-500 text-xs">até</span>
                          <input type="time" defaultValue={i < 5 ? "18:00" : i === 5 ? "13:00" : ""} disabled={i === 6} className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} border rounded-md px-2 py-1 text-xs ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 disabled:opacity-50`} />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">Pausa</span>
                          <input type="time" defaultValue={i < 5 ? "12:00" : ""} disabled={i >= 5} className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} border rounded-md px-2 py-1 text-xs ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 disabled:opacity-50`} />
                          <span className="text-zinc-500 text-xs">até</span>
                          <input type="time" defaultValue={i < 5 ? "13:00" : ""} disabled={i >= 5} className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} border rounded-md px-2 py-1 text-xs ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 disabled:opacity-50`} />
                        </div>
                        <div className="ml-auto">
                          <Toggle
                            checked={workingDays[i]}
                            onChange={() => {
                              const newDays = [...workingDays];
                              newDays[i] = !newDays[i];
                              setWorkingDays(newDays);
                            }}
                            disabled={false}
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Fuso Horário (Timezone)</label>
                  <select className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}>
                    <option value="America/Sao_Paulo">(GMT-03:00) Horário de Brasília (São Paulo)</option>
                    <option value="America/Manaus">(GMT-04:00) Manaus</option>
                    <option value="America/Rio_Branco">(GMT-05:00) Rio Branco</option>
                  </select>
                  <p className="text-xs text-zinc-500 mt-2">Importante para garantir que lembretes de agendamento sejam enviados na hora certa.</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Grade de horários e fuso horário configurados!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'IA & Automação' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>IA & Automação</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Treinamento, comportamento e base de conhecimento da IA.</p>
            </div>

            {/* Identidade e Comportamento */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Bot className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Identidade e Comportamento (Persona)</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Assistente</label>
                    <input type="text" defaultValue="Estetix AI" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tom de Voz</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                        className={`w-full flex items-center justify-between ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors relative z-10`}
                      >
                        {aiTone}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isToneDropdownOpen ? 'rotate-180' : ''} text-zinc-500`} />
                      </button>
                      {isToneDropdownOpen && (
                        <>
                          {/* Invisible Overlay para fechar ao clicar fora */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsToneDropdownOpen(false)}
                          />

                          {/* Dropdown Menu */}
                          <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"}`}>
                            {['Empático e Acolhedor', 'Profissional e Técnico', 'Descontraído e Jovem', 'Focado em Vendas'].map((tone) => (
                              <button
                                key={tone}
                                type="button"
                                onClick={() => {
                                  setAiTone(tone);
                                  setIsToneDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors relative z-50 ${aiTone === tone
                                  ? 'bg-orange-500/10 text-orange-500 font-medium'
                                  : (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100')
                                  }`}
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Instrução Base (System Prompt)</label>
                  <textarea rows={4} defaultValue="Você é a assistente virtual da clínica EstéticaPro. Seu objetivo é tirar dúvidas sobre procedimentos, ser educada e incentivar o agendamento de avaliações." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                  <p className="text-xs text-zinc-500 mt-2">Define o comportamento geral e o objetivo principal da IA.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Restrições (O que NÃO fazer)</label>
                  <textarea rows={3} defaultValue="- Nunca dê diagnósticos médicos.&#10;- Nunca prometa resultados 100% garantidos.&#10;- Não ofereça descontos além de 10%." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Configurações de Identidade e Persona salvas com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Persona
                </button>
              </div>
            </div>

            {/* Base de Conhecimento */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Base de Conhecimento</h3>
              </div>

              <div className="flex flex-col gap-8">
                {/* Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-3 uppercase">Upload de Documentos (Treinamento)</label>
                  <label className={`border-2 border-dashed border-zinc-800 hover:border-orange-500/50 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group`}>
                    <div className="w-12 h-12 rounded-full bg-zinc-900 group-hover:bg-orange-500/10 flex items-center justify-center mb-4 transition-colors">
                      <Upload className="text-zinc-500 group-hover:text-orange-500 transition-colors" size={24} />
                    </div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Arraste arquivos ou clique para fazer upload</h4>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Envie PDFs, tabelas de preços, manuais de procedimentos e protocolos. A IA lerá esses arquivos para responder aos clientes.
                    </p>
                    <input type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert(`${e.target.files.length} arquivo(s) selecionado(s) para treinamento da IA!`); }} />
                  </label>
                </div>

                {/* Diferenciais */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Diferenciais da Clínica</label>
                  <textarea rows={3} defaultValue="- Estacionamento gratuito no local com manobrista.&#10;- Utilizamos apenas produtos importados e aprovados pela ANVISA.&#10;- Oferecemos café expresso e capuccino para todos os clientes." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                </div>

                {/* FAQ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Perguntas Frequentes (FAQ)</label>
                    <button
                      onClick={() => setFaqs([...faqs, { q: '', a: '' }])}
                      className="text-xs text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"
                    >
                      <Plus size={14} /> Adicionar Pergunta
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className={`flex gap-3 items-start ${isDarkMode ? "bg-[#121214]" : "bg-[var(--bg-surface)]"} border ${isDarkMode ? "border-zinc-800" : "border-[var(--border-default)]"} p-4 rounded-xl shadow-sm`}>
                        <div className="flex-1 flex flex-col gap-3">
                          <input type="text" placeholder="Pergunta (Ex: Dói fazer botox?)" value={faq.q} onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index].q = e.target.value;
                            setFaqs(newFaqs);
                          }} className={`w-full bg-transparent border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pb-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                          <input type="text" placeholder="Resposta da IA" value={faq.a} onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index].a = e.target.value;
                            setFaqs(newFaqs);
                          }} className={`w-full bg-transparent text-zinc-400 text-sm focus:outline-none focus:${isDarkMode ? "text-zinc-300" : "text-zinc-900"} transition-colors`} />
                        </div>
                        <button onClick={() => {
                          const newFaqs = faqs.filter((_, i) => i !== index);
                          setFaqs(newFaqs);
                        }} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={() => alert('Documentos de treinamento e Diferenciais salvos na Base de Conhecimento!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Base de Conhecimento
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'API & Integrações' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>API & Integrações</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Conecte o EstéticaPro com outras ferramentas e automatize processos.</p>
            </div>

            {/* 1. Integrações Nativas */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Link className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Integrações Nativas (Conexões Rápidas)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div className={`border ${isDarkMode ? "border-zinc-800/80 bg-[#121214]" : "border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm"} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300 hover:border-orange-500/30 transition-colors`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>WhatsApp Business</h4>
                        <p className="text-[10px] text-zinc-500">Meta API Oficial</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">CONECTADO</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Envio automático de lembretes, confirmações de agendamento e atendimento via IA.</p>
                  <button onClick={() => alert('Abrindo painel de configuração do WhatsApp Business...')} className={`w-full py-2 rounded-lg border ${isDarkMode ? "border-zinc-700 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"} ${isDarkMode ? "text-zinc-300" : "text-zinc-900"} text-xs font-medium transition-colors`}>
                    Configurar
                  </button>
                </div>

                {/* Stripe */}
                <div className={`border ${isDarkMode ? "border-zinc-800/80 bg-[#121214]" : "border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm"} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300 hover:border-orange-500/30 transition-colors`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <DollarSign size={20} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Stripe / Pagamentos</h4>
                        <p className="text-[10px] text-zinc-500">Gateway de Pagamento</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-500 px-2 py-1 rounded">DESCONECTADO</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Processe pagamentos online, gere links de cobrança e gerencie assinaturas.</p>
                  <button onClick={() => alert('Iniciando autenticação com o Stripe...')} className={`w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs font-medium transition-colors`}>
                    Conectar
                  </button>
                </div>

                {/* Google Calendar */}
                <div className={`border ${isDarkMode ? "border-zinc-800/80 bg-[#121214]" : "border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm"} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300 hover:border-orange-500/30 transition-colors`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Google Calendar</h4>
                        <p className="text-[10px] text-zinc-500">Sincronização de Agenda</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-500 px-2 py-1 rounded">DESCONECTADO</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Sincronize a agenda do sistema com o calendário pessoal dos profissionais.</p>
                  <button onClick={() => alert('Solicitando permissões do Google Calendar...')} className={`w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs font-medium transition-colors`}>
                    Conectar
                  </button>
                </div>

                {/* RD Station */}
                <div className={`border ${isDarkMode ? "border-zinc-800/80 bg-[#121214]" : "border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm"} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300 hover:border-orange-500/30 transition-colors`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>RD Station Marketing</h4>
                        <p className="text-[10px] text-zinc-500">Automação de Marketing</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-500 px-2 py-1 rounded">DESCONECTADO</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Sincronize leads do CRM e envie campanhas de e-mail marketing direcionadas.</p>
                  <button onClick={() => alert('Iniciando integração com RD Station Marketing...')} className={`w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs font-medium transition-colors`}>
                    Conectar
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Chaves de API */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Key className="text-zinc-400" size={20} />
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Chaves de API (Para Desenvolvedores)</h3>
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Redirecionando para portal de documentação da API...'); }} className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1">
                  Ver Documentação <ExternalLink size={12} />
                </a>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-sm font-medium text-orange-500 mb-1">Aviso de Segurança</h4>
                    <p className="text-xs text-orange-500/80">Nunca compartilhe sua Secret Key. Ela dá acesso total aos dados da sua clínica e permite realizar alterações no sistema.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Chave de API Pública (Public Key)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type="text" readOnly value="pk_live_51O..." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-card)] border-[var(--border-default)]"} border rounded-xl pl-4 pr-10 py-2.5 text-zinc-400 text-sm font-mono focus:outline-none`} />
                      <button onClick={() => alert('Simulando: Visibilidade da chave alternada.')} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}>
                        <Eye size={16} />
                      </button>
                    </div>
                    <button onClick={() => alert('Chave de API copiada para a área de transferência!')} className={`px-4 py-2 rounded-xl ${isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white" : "bg-zinc-100 hover:bg-zinc-200 border-[var(--border-default)] text-zinc-900"} border transition-colors flex items-center justify-center`}>
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1.5">Usada para identificar sua conta em integrações de frontend (ex: widgets no site).</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Chave de API Secreta (Secret Key)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type="password" readOnly value="sk_live_51O..." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-card)] border-[var(--border-default)]"} border rounded-xl pl-4 pr-10 py-2.5 text-zinc-400 text-sm font-mono focus:outline-none`} />
                      <button onClick={() => alert('Simulando: Visibilidade da chave alternada.')} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors`}>
                        <Eye size={16} />
                      </button>
                    </div>
                    <button onClick={() => alert('Chave de API copiada para a área de transferência!')} className={`px-4 py-2 rounded-xl ${isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white" : "bg-zinc-100 hover:bg-zinc-200 border-[var(--border-default)] text-zinc-900"} border transition-colors flex items-center justify-center`}>
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button onClick={() => alert('Aviso: Uma nova Secret Key foi gerada. Atualize suas integrações.')} className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors">
                      Gerar Nova Chave Secreta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Webhooks */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Webhook className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Webhooks (Eventos em Tempo Real)</h3>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-sm text-zinc-400">Configure URLs para receber notificações automáticas (via POST) quando eventos específicos ocorrerem no sistema.</p>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">URL do Webhook (Endpoint)</label>
                  <input type="url" placeholder="https://sua-api.com/webhook" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-3 uppercase">Eventos a serem enviados</label>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl p-4`}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"} flex items-center justify-center group-hover:border-orange-500 transition-colors`}>
                        <CheckCircle2 size={12} className="text-orange-500 opacity-0" />
                      </div>
                      <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Novo Agendamento Criado</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"} flex items-center justify-center group-hover:border-orange-500 transition-colors`}>
                        <CheckCircle2 size={12} className="text-orange-500 opacity-0" />
                      </div>
                      <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Agendamento Cancelado</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"} flex items-center justify-center group-hover:border-orange-500 transition-colors`}>
                        <CheckCircle2 size={12} className="text-orange-500 opacity-0" />
                      </div>
                      <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Novo Cliente Cadastrado</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"} flex items-center justify-center group-hover:border-orange-500 transition-colors`}>
                        <CheckCircle2 size={12} className="text-orange-500 opacity-0" />
                      </div>
                      <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>Pagamento Confirmado</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button onClick={() => alert('Disparando payload de teste (POST 200 OK) para o endpoint...')} className={`px-4 py-2 rounded-lg ${isDarkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800" : "border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm"} border text-sm font-medium transition-colors flex items-center gap-2`}>
                  <Zap size={16} />
                  Testar Webhook
                </button>
                <button onClick={() => alert('Endpoint e configurações de Webhook salvos com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'Financeiro & Fiscal' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Financeiro & Fiscal</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Configure taxas, categorias, comissões e dados fiscais da clínica.</p>
            </div>

            {/* 1. Formas de Pagamento e Taxas */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Receipt className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Formas de Pagamento e Taxas (Maquininhas)</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className={`grid grid-cols-12 gap-4 pb-2 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} text-[10px] font-bold text-zinc-500 uppercase tracking-wider`}>
                  <div className="col-span-4">Método</div>
                  <div className="col-span-3 text-center">Taxa (%)</div>
                  <div className="col-span-3 text-center">Prazo (Dias)</div>
                  <div className="col-span-2 text-center">Ativo</div>
                </div>

                {paymentMethods.map((method, index) => (
                  <div key={method.name} className="grid grid-cols-12 gap-4 items-center py-2">
                    <div className={`col-span-4 text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"} font-medium`}>{method.name}</div>
                    <div className="col-span-3 flex justify-center">
                      <div className="relative w-24">
                        <input type="text" defaultValue={method.days} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-lg px-3 py-1.5 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs text-center focus:outline-none focus:border-orange-500 transition-colors`} />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 text-xs">D</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <Toggle
                        checked={method.active}
                        onChange={() => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].active = !newMethods[index].active;
                          setPaymentMethods(newMethods);
                        }}
                        disabled={false}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Taxas salvas com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Taxas
                </button>
              </div>
            </div>

            {/* 2. Categorias Financeiras */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <List className="text-zinc-400" size={20} />
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Categorias Financeiras (Plano de Contas)</h3>
                </div>
                <button
                  onClick={() => setFinCategories([...finCategories, { id: Date.now().toString(), name: '', type: 'Receita' }])}
                  className="text-xs text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"
                >
                  <Plus size={14} /> Nova Categoria
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {finCategories.map((cat, index) => (
                  <div key={cat.id} className={`flex gap-3 items-center ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800 p-3 rounded-xl`}>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Nome da Categoria"
                          value={cat.name}
                          onChange={(e) => {
                            const newCats = [...finCategories];
                            newCats[index].name = e.target.value;
                            setFinCategories(newCats);
                          }}
                          className={`w-full bg-transparent border-b border-zinc-800 pb-1 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                      <select
                        value={cat.type}
                        onChange={(e) => {
                          const newCats = [...finCategories];
                          newCats[index].type = e.target.value;
                          setFinCategories(newCats);
                        }}
                        className={`${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-900"} border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500`}
                      >
                        <option value="Receita">Receita</option>
                        <option value="Despesa">Despesa</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setFinCategories(finCategories.filter(c => c.id !== cat.id))}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Categorias salvas com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Categorias
                </button>
              </div>
            </div>

            {/* 3. Regras de Comissionamento */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Percent className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Regras de Comissionamento (Padrão da Clínica)</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className={`flex items-center justify-between p-4 rounded-xl border border-zinc-800/50 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"}`}>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Descontar Taxa de Cartão</h4>
                    <p className="text-xs text-zinc-500">Deduzir a taxa da maquininha antes de calcular a comissão do profissional.</p>
                  </div>
                  <Toggle checked={discountCardTax} onChange={() => setDiscountCardTax(!discountCardTax)} disabled={false} isDarkMode={isDarkMode} />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border border-zinc-800/50 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"}`}>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Descontar Custo de Produto</h4>
                    <p className="text-xs text-zinc-500">Deduzir o valor dos insumos utilizados antes de calcular a comissão.</p>
                  </div>
                  <Toggle checked={discountProductCost} onChange={() => setDiscountProductCost(!discountProductCost)} disabled={false} isDarkMode={isDarkMode} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tipo de Comissão Padrão</label>
                    <select className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}>
                      <option>Porcentagem (%)</option>
                      <option>Valor Fixo (R$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Valor/Porcentagem Padrão</label>
                    <input type="text" defaultValue="30" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Regras salvas com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Regras
                </button>
              </div>
            </div>

            {/* 4. Configuração Fiscal */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <FileSignature className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Configuração Fiscal (Emissão de NFS-e)</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Regime Tributário</label>
                    <select className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}>
                      <option>Simples Nacional</option>
                      <option>Lucro Presumido</option>
                      <option>Lucro Real</option>
                      <option>MEI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Alíquota de ISS (%)</label>
                    <input type="text" defaultValue="5.00" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Certificado Digital (A1)</label>
                  <div className={`border border-zinc-800 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} rounded-xl p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Upload size={20} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Clique para enviar o arquivo .pfx</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Máximo 5MB</p>
                      </div>
                    </div>
                    <label className={`px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors cursor-pointer`}>
                      Selecionar Arquivo
                      <input type="file" accept=".pfx,.p12" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert(`Arquivo "${e.target.files[0].name}" carregado com sucesso!`); }} />
                    </label>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border border-zinc-800/50 ${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"}`}>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Emissão Automática</h4>
                    <p className="text-xs text-zinc-500">Emitir nota fiscal de serviço automaticamente após confirmação de pagamento.</p>
                  </div>
                  <Toggle checked={autoEmission} onChange={() => setAutoEmission(!autoEmission)} disabled={false} isDarkMode={isDarkMode} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => alert('Dados Fiscais salvos com sucesso!')} className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm font-medium transition-colors`}>
                  Salvar Dados Fiscais
                </button>
              </div>
            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [userStatuses, setUserStatuses] = useState<Record<string, AccessStatus>>({
    'camila@estetica.com': 'pending'
  });
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeSettingsMenu, setActiveSettingsMenu] = useState('Conta & Organização');
  const [role, setRole] = useState<'admin' | 'profissional'>('admin');
  const [matrixRole, setMatrixRole] = useState<'admin' | 'profissional'>('admin');
  const [activeTab, setActiveTab] = useState('Pendentes');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPatientForReceituario, setSelectedPatientForReceituario] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Olá! Sou o Estetix AI. Como posso ajudar com a gestão da sua clínica hoje?' }
  ]);

  // Sync theme class on <html> element for CSS custom properties
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [patients, setPatients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState([
    { id: '1', name: 'Dr. Rafael Costa', specialty: '', color: '#ef4444', active: true },
    { id: '2', name: 'Dr. Teste Upload', specialty: 'Dermatologista', color: '#10b981', active: true },
    { id: '3', name: 'Dra. Ana Oliveira', specialty: '', color: '#8b5cf6', active: true },
    { id: '4', name: 'Dra. Camila Santos', specialty: '', color: '#0ea5e9', active: true },
  ]);
  const [columns, setColumns] = useState<{ id: string, title: string, cardIds: string[] }[]>([]);
  const [services, setServices] = useState([
    { id: '1', name: 'Botox', category: 'Injetáveis', duration: 30, price: 1200, tax: 0, description: 'Sem descrição.', items: [{ id: '1', itemId: 'inv1', quantity: 1 }] },
    { id: '2', name: 'Harmonização Facial', category: 'Outros', duration: 90, price: 2500, tax: 0, description: 'Conjunto de procedimentos para equilibrar e realçar os traços do rosto.', items: [] },
    { id: '3', name: 'Limpeza de Pele', category: 'Facial', duration: 60, price: 250, tax: 0, description: 'Limpeza profunda com extração e hidratação para uma pele renovada e radiante.', items: [] }
  ]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [inventory, setInventory] = useState([
    { id: 'inv1', name: 'Toxina Botulínica (100U)', category: 'Insumos', price: 850, salePrice: 0, stock: 15, minStock: 5 },
    { id: 'inv2', name: 'Ácido Hialurônico (1ml)', category: 'Insumos', price: 350, salePrice: 0, stock: 8, minStock: 10 },
    { id: 'inv3', name: 'Seringa Descartável', category: 'Materiais', price: 0.35, salePrice: 0, stock: 250, minStock: 50 },
    { id: 'inv4', name: 'Agulha 30G', category: 'Materiais', price: 0.15, salePrice: 0, stock: 400, minStock: 100 },
    { id: 'inv5', name: 'Fios de PDO (un)', category: 'Insumos', price: 80, salePrice: 200, stock: 30, minStock: 10 },
    { id: 'inv6', name: 'Gaze Estéril (pacote)', category: 'Materiais', price: 0.50, salePrice: 0, stock: 15, minStock: 20 }
  ]);

  const [profissionalPermissions, setProfissionalPermissions] = useState<ModulePermissions>({
    dashboard: { view: true, create: false, edit: false, delete: false },
    crm: { view: true, create: true, edit: false, delete: false },
    clientes: { view: true, create: true, edit: true, delete: false },
    receituario: { view: true, create: true, edit: true, delete: false },
    agenda: { view: true, create: true, edit: true, delete: true },
    financeiro: { view: false, create: false, edit: false, delete: false },
    relatorios: { view: true, create: false, edit: false, delete: false },
    estoque: { view: true, create: true, edit: false, delete: false },
  });

  const handleLogin = (email: string) => {
    const isAdm = email.toLowerCase().includes('admin');
    setRole(isAdm ? 'admin' : 'profissional');
    setCurrentUserEmail(email);

    if (!isAdm && !userStatuses[email]) {
      setUserStatuses(prev => ({ ...prev, [email]: 'pending' }));
    }

    // Set default active menu based on role
    setActiveMenu('Dashboard');

    setIsAuthenticated(true);
  };


  const handleCompleteService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service && service.items) {
      setInventory(prevInventory => {
        const newInventory = [...prevInventory];
        service.items.forEach((item: any) => {
          const invIndex = newInventory.findIndex(i => i.id === item.itemId);
          if (invIndex !== -1) {
            newInventory[invIndex] = {
              ...newInventory[invIndex],
              stock: Math.max(0, newInventory[invIndex].stock - item.quantity)
            };
          }
        });
        return newInventory;
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    setActiveMenu('Dashboard');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  if (role === 'profissional') {
    const status = userStatuses[currentUserEmail];
    if (status === 'pending') return <PendingScreen onLogout={handleLogout} isDarkMode={isDarkMode} />;
    if (status === 'denied') return <DeniedScreen onLogout={handleLogout} isDarkMode={isDarkMode} />;
  }

  const permissions: ModulePermissions = {
    dashboard: { view: true, create: true, edit: true, delete: true },
    crm: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
    receituario: { view: true, create: true, edit: true, delete: true },
    agenda: { view: true, create: true, edit: true, delete: true },
    financeiro: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    estoque: { view: true, create: true, edit: true, delete: true },
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'crm', name: 'CRM' },
    { id: 'clientes', name: 'Clientes' },
    { id: 'receituario', name: 'Receituário' },
    { id: 'agenda', name: 'Agenda' },
    { id: 'financeiro', name: 'Financeiro' },
    { id: 'relatorios', name: 'Relatórios' },
    { id: 'estoque', name: 'Estoque' },
  ];

  const handleToggle = (moduleId: string, action: keyof Permissions) => {
    if (matrixRole === 'admin') return;
    setProfissionalPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId][action]
      }
    }));
  };

  const handleGenerateReceituario = (patientId: string) => {
    setSelectedPatientForReceituario(patientId);
    setActiveMenu('Receituário');
  };

  const currentPermissions = matrixRole === 'admin' ? permissions : profissionalPermissions;
  const activeUserPermissions = role === 'admin' ? permissions : profissionalPermissions;

  const pendingUsers = Object.entries(userStatuses).filter(([_, status]) => status === 'pending');
  const approvedUsers = Object.entries(userStatuses).filter(([_, status]) => status === 'approved');
  const deniedUsers = Object.entries(userStatuses).filter(([_, status]) => status === 'denied');

  const handleApprove = (email: string) => {
    setUserStatuses(prev => ({ ...prev, [email]: 'approved' }));
  };

  const handleDeny = (email: string) => {
    setUserStatuses(prev => ({ ...prev, [email]: 'denied' }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden selection:bg-orange-500/30 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col z-20 transition-colors duration-300" style={{ borderRight: '1px solid var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)' }}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Asterisk style={{ color: 'var(--bg-base)' }} size={20} />
            </div>
            <span className="font-semibold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>EstéticaPro</span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          <div className="text-[10px] font-bold mb-2 px-2 tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>Menu</div>
          {activeUserPermissions.dashboard?.view && <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeMenu === 'Dashboard'} onClick={() => setActiveMenu('Dashboard')} isDarkMode={isDarkMode} />}
          {activeUserPermissions.agenda?.view && <NavItem icon={<Calendar size={18} />} label="Agenda" active={activeMenu === 'Agenda'} onClick={() => setActiveMenu('Agenda')} isDarkMode={isDarkMode} />}
          {activeUserPermissions.crm?.view && <NavItem icon={<BarChart3 size={18} />} label="CRM" active={activeMenu === 'CRM'} onClick={() => setActiveMenu('CRM')} isDarkMode={isDarkMode} />}
          {activeUserPermissions.clientes?.view && <NavItem icon={<Users size={18} />} label="Clientes" active={activeMenu === 'Clientes'} onClick={() => setActiveMenu('Clientes')} isDarkMode={isDarkMode} />}
          <NavItem icon={<FileSignature size={18} />} label="Receituário" active={activeMenu === 'Receituário'} onClick={() => setActiveMenu('Receituário')} isDarkMode={isDarkMode} />
          <NavItem icon={<User size={18} />} label="Profissionais" active={activeMenu === 'Profissionais'} onClick={() => setActiveMenu('Profissionais')} isDarkMode={isDarkMode} />
          <NavItem icon={<Briefcase size={18} />} label="Serviços" active={activeMenu === 'Serviços'} onClick={() => setActiveMenu('Serviços')} isDarkMode={isDarkMode} />
          {activeUserPermissions.estoque?.view && <NavItem icon={<Box size={18} />} label="Estoque" active={activeMenu === 'Estoque'} onClick={() => setActiveMenu('Estoque')} isDarkMode={isDarkMode} />}
          {activeUserPermissions.financeiro?.view && <NavItem icon={<DollarSign size={18} />} label="Financeiro" active={activeMenu === 'Financeiro'} onClick={() => setActiveMenu('Financeiro')} isDarkMode={isDarkMode} />}
          {activeUserPermissions.relatorios?.view && <NavItem icon={<PieChart size={18} />} label="Relatórios" active={activeMenu === 'Relatórios'} onClick={() => setActiveMenu('Relatórios')} isDarkMode={isDarkMode} />}
        </div>

        {/* Bottom Menu */}
        <div className="p-4 flex flex-col gap-1 shrink-0" style={{ borderTop: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all mb-1"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-hover-text)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
          {role === 'admin' && (
            <NavItem icon={<Settings size={18} />} label="Configurações" active={activeMenu === 'Configurações'} onClick={() => {
              setActiveMenu('Configurações');
              setActiveSettingsMenu('Conta & Organização');
            }} isDarkMode={isDarkMode} />
          )}
          <NavItem icon={<LogOut size={18} />} label="Sair" active={false} onClick={handleLogout} isDarkMode={isDarkMode} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeMenu === 'Configurações' ? (
          <SettingsView
            role={role}
            currentPermissions={currentPermissions}
            modules={modules}
            handleToggle={handleToggle}
            activeSettingsMenu={activeSettingsMenu}
            setActiveSettingsMenu={setActiveSettingsMenu}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingUsers={pendingUsers}
            approvedUsers={approvedUsers}
            deniedUsers={deniedUsers}
            handleApprove={handleApprove}
            handleDeny={handleDeny}
            matrixRole={matrixRole}
            setMatrixRole={setMatrixRole}
            isSaving={isSaving}
            handleSave={handleSave}
            isDarkMode={isDarkMode}
          />
        ) : activeMenu === 'Dashboard' ? (
          <DashboardView isDarkMode={isDarkMode} />
        ) : activeMenu === 'Agenda' ? (
          <AgendaView professionals={professionals} services={services} onCompleteService={handleCompleteService} isDarkMode={isDarkMode} />
        ) : activeMenu === 'CRM' ? (
          <CrmView patients={patients} setPatients={setPatients} columns={columns} setColumns={setColumns} onGenerateReceituario={handleGenerateReceituario} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Clientes' ? (
          <ClientesView patients={patients} setPatients={setPatients} onGenerateReceituario={handleGenerateReceituario} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Receituário' ? (
          <ReceituarioView patients={patients} professionals={professionals} selectedPatientId={selectedPatientForReceituario} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Profissionais' ? (
          <ProfissionaisView professionals={professionals} setProfessionals={setProfessionals} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Serviços' ? (
          <ServicosView services={services} setServices={setServices} inventory={inventory} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Estoque' ? (
          <EstoqueView inventory={inventory} setInventory={setInventory} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Financeiro' ? (
          <FinanceiroView expenses={expenses} setExpenses={setExpenses} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Relatórios' ? (
          <RelatoriosView isDarkMode={isDarkMode} />
        ) : (
          <div className="flex-1 flex flex-col relative overflow-hidden items-center justify-center">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} z-10`}>{activeMenu}</h2>
            <p className="text-zinc-600 mt-2 z-10">Módulo em desenvolvimento</p>
          </div>
        )}

        {/* Floating Action Button (Robot icon) */}
        {isAssistantOpen && (
          <div className={`absolute bottom-28 right-8 w-80 md:w-96 h-[500px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden z-50 transition-all ${isDarkMode ? "bg-[#0a0a0a] border-zinc-800" : "bg-white border-[var(--border-default)]"}`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 text-white ${isDarkMode ? "border-zinc-800" : "border-orange-600"}`}>
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold text-sm">Estetix AI</span>
              </div>
              <button onClick={() => setIsAssistantOpen(false)} className="hover:text-orange-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-tr-sm shadow-md' : (isDarkMode ? 'bg-[#121214] text-zinc-300 border border-zinc-800 rounded-tl-sm' : 'bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-tl-sm shadow-sm')}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input Area */}
            <div className={`p-3 border-t flex gap-2 ${isDarkMode ? "border-zinc-800 bg-[#050505]" : "border-[var(--border-default)] bg-zinc-50"}`}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    setChatHistory([...chatHistory, { role: 'user', text: chatMessage }, { role: 'assistant', text: 'Processando sua solicitação... (Integração com LLM em breve)' }]);
                    setChatMessage('');
                  }
                }}
                placeholder="Digite sua dúvida..."
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 border transition-colors ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"}`}
              />
              <button
                onClick={() => {
                  if (chatMessage.trim()) {
                    setChatHistory([...chatHistory, { role: 'user', text: chatMessage }, { role: 'assistant', text: 'Processando sua solicitação... (Integração com LLM em breve)' }]);
                    setChatMessage('');
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-xl transition-colors flex items-center justify-center shrink-0"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="absolute bottom-8 right-8 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors z-50 hover:scale-105 active:scale-95"
        >
          {isAssistantOpen ? <X className="text-white" size={24} /> : <Bot className={`${isDarkMode ? "text-white" : "text-zinc-900"}`} size={24} />}
          {!isAssistantOpen && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full"></span>}
        </button>
      </main>
    </div>
  );
}
