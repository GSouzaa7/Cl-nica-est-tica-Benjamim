import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { HexColorPicker } from 'react-colorful';
import { LayoutDashboard, Calendar, BarChart3, Users, User, Briefcase, Box, DollarSign, PieChart, Settings, LogOut, Building2, Shield, Bot, Webhook, Palette, Eye, Plus, Pencil, Trash2, Asterisk, Clock, CheckCircle2, XCircle, List, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, X, ChevronDown, MoreVertical, Mic, Square, Upload, MessageCircle, FileText, Filter, Download, Search, Sparkles, Activity, Loader2, Copy, Ticket, Crown, Target, Key, Link, ExternalLink, Zap, Receipt, Percent, FileSignature, CheckCircle, Sun, Moon, Menu, Gift } from 'lucide-react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { registrarNovoUsuario, resetarSenha, verificarEmailExiste } from './lib/authService';
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot, writeBatch, deleteDoc, query, orderBy, arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { ReceituarioView } from './ReceituarioView';
import { SaveButton } from './components/SaveButton';
import { logAuditEvent } from './lib/auditLogger';
import { AuditLogPanel } from './components/settings/AuditLogPanel';
import { encryptField, decryptField } from './lib/cryptoHelper';
import { useDynamicPWA } from './hooks/useDynamicPWA';
// @ts-ignore
import videoBg from '../Flow_delpmaspu_.mp4';
import { CashFlowChart } from './components/dashboard/CashFlowChart';
import { DashboardBalance } from './components/dashboard/DashboardBalance';
import {
  UpcomingAppointmentsWidget,
  UpcomingBirthdaysWidget,
  AppointmentsByProfessionalWidget,
  BusyDaysWidget,
  BusyHoursWidget
} from './components/dashboard/DashboardWidgets';
import AppointmentModal from './components/calendar/AppointmentModal';
import { AppointmentDetailsModal } from './components/calendar/AppointmentDetailsModal';
import { PeriodSelector } from './components/ui/PeriodSelector';
import { LucideIcon, FileStack } from 'lucide-react';
import { AgendaReportsView } from './components/agenda/AgendaReportsView';
import { FrequenciaDashboard } from './components/dashboard/FrequenciaDashboard';

const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '';
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age >= 0 ? age.toString() : '';
};

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

const MiniSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  isDarkMode = true,
  placeholder = "Selecionar..."
}: { 
  label?: string, 
  value: string, 
  onChange: (val: string) => void, 
  options: string[], 
  isDarkMode?: boolean,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border ${isOpen ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-zinc-800'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all group`}
      >
        <span className={`text-sm font-medium ${value ? 'text-orange-500' : 'text-zinc-500'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`${isOpen ? 'rotate-180 text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'} transition-all`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 left-0 w-full z-[110] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? "bg-[#0a0a0a] border-zinc-800/50 text-white" : "bg-white border-zinc-200 text-zinc-900"}`}>
          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === option 
                    ? 'bg-gradient-to-r from-orange-600/20 to-transparent text-orange-500 font-bold' 
                    : (isDarkMode ? 'hover:bg-white/5 text-zinc-300' : 'hover:bg-zinc-50 text-zinc-700')
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MiniDatePicker = ({ value, onChange, isDarkMode = true, label }: { value: string, onChange: (val: string) => void, isDarkMode?: boolean, label?: string }) => {

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value or default to today
  const initialDate = (() => {
    if (!value) return new Date();
    if (value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`);
    }
    return new Date(value + 'T12:00:00');
  })();
  const [viewDate, setViewDate] = useState(initialDate);
  const [showYearSelector, setShowYearSelector] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearSelector(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    return Array.from({ length: 111 }, (_, i) => startYear + i).reverse();
  }, []);

  const formattedValue = useMemo(() => {
    if (!value) return '';
    if (value.includes('/')) return value;
    const [y, m, d] = value.split('-');
    if (!y || !m || !d) return value;
    return `${d}/${m}/${y}`;
  }, [value]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border ${isOpen ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-zinc-800'} rounded-xl px-4 py-2.5 flex items-center justify-between transition-all group`}
      >
        <span className={`text-sm ${value ? (isDarkMode ? 'text-white' : 'text-zinc-900') : 'text-zinc-500'}`}>
          {formattedValue || 'dd/mm/aaaa'}
        </span>
        <Calendar size={16} className={`${isOpen ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'} transition-colors`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 left-0 w-72 z-[100] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"}`}>
          {/* Header */}
          <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200"}`}>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className={`p-1 rounded opacity-70 hover:opacity-100 transition-colors ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowYearSelector(!showYearSelector)}
              className={`font-semibold text-sm px-2 py-1 rounded transition-colors ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"} flex items-center gap-1`}
            >
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              <ChevronDown size={14} className={`transition-transform ${showYearSelector ? 'rotate-180 text-orange-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className={`p-1 rounded opacity-70 hover:opacity-100 transition-colors ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="p-4 relative min-h-[240px]">
            {showYearSelector ? (
              <div className="absolute inset-0 bg-[#121214] z-10 overflow-y-auto custom-scrollbar p-2 grid grid-cols-3 gap-1">
                {years.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setViewDate(new Date(year, viewDate.getMonth(), 1));
                      setShowYearSelector(false);
                    }}
                    className={`py-2 rounded-lg text-sm transition-all ${viewDate.getFullYear() === year
                      ? "bg-orange-500 text-white font-bold"
                      : (isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100")}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {weekDaysShort.map((day, i) => (
                    <div key={i} className={`text-[10px] font-bold tracking-wider ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-8 h-8" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const isSelected = value === `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                          ${isSelected
                            ? "bg-orange-500 text-white font-bold shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                            : isToday
                              ? (isDarkMode ? "bg-zinc-800 text-orange-400 font-semibold" : "bg-orange-50 text-orange-600 font-semibold")
                              : (isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-700 hover:bg-zinc-100")
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className={`p-2 border-t ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200"} flex justify-between`}>
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="text-[10px] font-bold text-zinc-500 hover:text-red-500 uppercase tracking-widest px-2 py-1"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                onChange(`${yyyy}-${mm}-${dd}`);
                setIsOpen(false);
              }}
              className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest px-2 py-1"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, isDarkMode = true, collapsed = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, isDarkMode?: boolean, collapsed?: boolean }) => (
  <button
    title={collapsed ? label : undefined}
    onClick={onClick}
    className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors text-sm font-medium border ${active ? 'border-orange-900/30' : 'border-transparent'} relative`}
    style={{
      backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
      color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
    }}
    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-hover-text)'; } }}
    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)'; } }}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
    {active && collapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />}
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
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPage, setIsForgotPage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        if (email && name && password) {
          await registrarNovoUsuario(email, password, name);
          setShowSuccessModal(true);
        } else {
          addToast("Preencha todos os campos para registrar.", "warning");
        }
      } else {
        if (email && password) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          addToast("Preencha email e senha para entrar.", "warning");
        }
      }
    } catch (err: any) {
      let msgs = err.message || 'Erro de autenticação';
      if (msgs.includes('auth/invalid-credential') || msgs.includes('auth/wrong-password') || msgs.includes('auth/user-not-found')) msgs = 'Email ou senha incorretos.';
      if (msgs.includes('auth/email-already-in-use')) msgs = 'Este email já está cadastrado no sistema.';
      if (msgs.includes('auth/weak-password')) msgs = 'A senha deve ter pelo menos 6 caracteres.';
      addToast(msgs, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast("Por favor, insira seu e-mail para recuperar a senha.", "info");
      return;
    }
    setLoading(true);
    try {
      // 1. Verifica se o email existe no banco
      const existe = await verificarEmailExiste(email);

      if (!existe) {
        addToast("E-mail não encontrado no sistema.", "error");
        setIsForgotPage(false); // Retorna ao login
        return;
      }

      // 2. Se existe, envia o e-mail
      await resetarSenha(email);
      setResetSuccess(true);
      addToast("E-mail de recuperação enviado com sucesso!", "success");
      setTimeout(() => setResetSuccess(false), 5000);
    } catch (err: any) {
      addToast("Erro ao enviar e-mail de recuperação. Verifique o endereço digitado.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dark !bg-[#050505] !text-white grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full relative z-10 overflow-hidden">
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-entry">
            <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[32px] max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_40px_rgba(249,115,22,0.2)]">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-light font-bricolage text-white mb-3">Solicitação Enviada!</h3>
              <p className="text-neutral-400 mb-8 font-sans text-sm leading-relaxed">
                Conta requerida com sucesso! Aguarde a aprovação do administrador para ingressar no painel.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setIsRegistering(false);
                }}
                className="w-full bg-white text-black font-semibold rounded-xl py-3.5 hover:bg-neutral-200 transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          </div>
        )}
        {/* Cinematic Video Background (Unmounted automatically when not rendered) */}
        <video src={videoBg} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none" />

        {/* Luminous Layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="stars absolute inset-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-orange-900/10 blur-[120px] rounded-full"></div>
        </div>

        {/* LADO ESQUERDO (lg:col-span-7) */}
        <div className="lg:col-span-7 font-bricolage text-5xl lg:text-7xl font-light tracking-tight !text-white leading-[1.05] p-10 lg:p-24 flex items-center animate-entry uppercase relative z-20">
          <h1>
            A EXCELÊNCIA QUE SUA CLÍNICA MERECE E A GESTÃO QUE VOCÊ PRECISA.
          </h1>
        </div>

        {/* LADO DIREITO (lg:col-span-5) - LOGIN */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 lg:p-12 relative z-20">

          {/* Contêiner de Segurança Anti-Vazamento */}
          <div className="w-full max-w-md mx-auto relative bg-neutral-900/50 rounded-[32px] p-[2px] overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.2)] group">

            {/* Luminous Animated Border agora isolado pelo novo overflow-hidden */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent opacity-80 z-0 pointer-events-none transition-all duration-700 group-hover:via-orange-400 group-hover:opacity-100"></div>

            {/* Inner Glass Box */}
            <div className="relative z-10 !bg-[#0A0A0A]/90 backdrop-blur-3xl rounded-[30px] p-8 lg:p-10 w-full flex flex-col items-center">

              <div className="flex flex-col items-center text-center mb-8">
                <div className={`w-12 h-12 !bg-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.4)]`}>
                  <Asterisk className="!text-white" size={28} />
                </div>
                <h1 className="!text-white font-bricolage text-4xl font-light tracking-tight mb-2">
                  {isForgotPage ? 'Recuperar' : 'Estética'}<span className="font-semibold !text-orange-500">{isForgotPage ? 'Senha' : 'Pro'}</span>
                </h1>
                {isForgotPage && (
                  <p className="text-neutral-400 font-sans text-sm mt-2">Insira seu e-mail para receber as instruções.</p>
                )}
              </div>

              <form onSubmit={isForgotPage ? handleResetPassword : handleSubmit} className="flex flex-col gap-5 w-full font-sans">
                {isRegistering && !isForgotPage && (
                  <div className="w-full animate-entry">
                    <label className="block text-xs font-semibold !text-neutral-400 mb-2 uppercase tracking-wider">Nome Completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full !bg-black/40 border !border-white/10 rounded-xl px-5 py-3.5 !text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors font-sans text-sm"
                      placeholder="Seu Nome"
                      required
                    />
                  </div>
                )}
                <div className="w-full">
                  <label className="block text-xs font-semibold !text-neutral-400 mb-2 uppercase tracking-wider">
                    {isForgotPage ? 'Seu E-mail de Recuperação' : (isRegistering ? 'E-mail' : 'E-mail Corporativo')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full !bg-black/40 border !border-white/10 rounded-xl px-5 py-3.5 !text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors font-sans text-sm"
                    placeholder={isForgotPage || isRegistering ? "seu@email.com" : "clinica@esteticapro.com"}
                    required
                  />
                </div>
                {!isForgotPage && (
                  <div className="w-full">
                    <label className="block text-xs font-semibold !text-neutral-400 mb-2 uppercase tracking-wider">{isRegistering ? 'Senha' : 'Senha de Acesso'}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full !bg-black/40 border !border-white/10 rounded-xl px-5 py-3.5 !text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors font-sans text-sm"
                      placeholder="••••••••"
                      required
                    />
                    {!isRegistering && (
                      <div className="flex flex-col items-end mt-2 animate-entry">
                        {resetSuccess && (
                          <span className="text-[10px] text-emerald-500 font-medium mb-1">E-mail enviado!</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsForgotPage(true)}
                          disabled={loading}
                          className="text-xs font-medium !text-orange-500 hover:!text-orange-400 transition-colors disabled:opacity-50"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-orange-400 to-orange-600 text-[#2c1306] shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] hover:scale-[1.02] border-none font-bold py-3.5 rounded-xl transition-all duration-300 mt-2 font-sans disabled:opacity-50`}
                >
                  {loading ? 'Processando...' : (isForgotPage ? 'Enviar E-mail' : (isRegistering ? 'Criar Conta' : 'Entrar no Sistema'))}
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/5 bg-gradient-to-r from-transparent to-white/10"></div>
                  <span className="text-xs !text-neutral-500">ou</span>
                  <div className="flex-1 h-px bg-white/5 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isForgotPage) {
                      setIsForgotPage(false);
                    } else {
                      setIsRegistering(!isRegistering);
                    }
                  }}
                  className="text-sm font-medium !text-neutral-400 hover:!text-white transition-colors"
                >
                  {isForgotPage ? (
                    'Voltar para o Login'
                  ) : isRegistering ? (
                    <>Já tem uma conta? <span className="font-bold underline decoration-orange-500/50 underline-offset-4">Fazer login</span></>
                  ) : (
                    <span className="font-bold underline decoration-orange-500/50 underline-offset-4">Criar uma conta</span>
                  )}
                </button>
              </form>


            </div>
          </div>
        </div>
      </div>
    </>
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
  <div className={`min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-orange-500/30 transition-colors duration-300 relative overflow-hidden text-white`}>
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="stars absolute inset-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[120px] rounded-full"></div>
    </div>

    <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 electric-card rounded-[32px] p-10 shadow-[0_0_40px_rgba(239,68,68,0.15)] text-center transition-colors duration-300">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="text-red-500" size={32} />
      </div>
      <h2 className="text-3xl font-light font-bricolage text-white mb-2">Acesso Negado</h2>
      <p className="text-neutral-400 mb-8 font-sans text-sm leading-relaxed">
        Seu acesso a esta clínica foi revogado ou recusado pelo administrador. Se achar que houve um erro, contate a gerência ou crie uma nova solicitação com seu e-mail.
      </p>
      <button
        onClick={onLogout}
        className="w-full bg-white text-black font-semibold rounded-xl py-3.5 hover:bg-neutral-200 transition-colors"
      >
        Voltar para o Login
      </button>
    </div>
  </div>
);

type AccessStatus = 'pending' | 'approved' | 'denied';

const DashboardView = ({
  inventory,
  setActiveMenu,
  appointments = [],
  services = [],
  expenses = [],
  patients = [],
  professionals = [],
  isDarkMode = true
}: {
  inventory: any[],
  setActiveMenu: (tab: string) => void,
  appointments?: any[],
  services?: any[],
  expenses?: any[],
  patients?: any[],
  professionals?: any[],
  isDarkMode?: boolean
}) => {
  const [faqs, setFaqs] = useState([{ q: 'Dói fazer botox?', a: 'Utilizamos pomada anestésica de alta eficácia para garantir o máximo de conforto.' }]);
  const [activePeriod, setActivePeriod] = useState('MENSAL');
  const [analysisPeriod, setAnalysisPeriod] = useState(12); // Default to current month index
  const [showValues, setShowValues] = useState<boolean>(true);

  // Reset analysis period when activePeriod changes
  useEffect(() => {
    if (activePeriod === 'DIÁRIA' || activePeriod === 'SEMANAL' || activePeriod === 'MENSAL') {
      setAnalysisPeriod(12);
    } else {
      setAnalysisPeriod(5); // Middle of 11 year range (index 5)
    }
  }, [activePeriod]);

  // Agrupamento para Laranjas e Críticos
  const lowStockItems = inventory.filter((item: any) => item.stock <= item.minStock && item.stock > 0);
  const criticalStockItems = inventory.filter((item: any) => item.stock === 0);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header (desktop only, mobile uses global header) */}
      <header className="hidden lg:flex pt-12 px-12 pb-8 z-10 shrink-0 items-center gap-3">
        <LayoutDashboard className="text-[var(--text-primary)]" size={32} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
      </header>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-12 py-4 lg:pb-10 z-10 custom-scrollbar">
        <div className="flex flex-col gap-4 md:gap-6 w-full">

          {/* Top Stats Row */}
          {(() => {
            const now = new Date();
            const currMonth = now.getMonth();
            const currYear = now.getFullYear();

            const totalFaturamento = (expenses || [])
              .filter(e => e.type === 'Receita' && e.status === 'Pago' && new Date(e.date).getMonth() === currMonth && new Date(e.date).getFullYear() === currYear)
              .reduce((sum, e) => sum + Number(e.value || e.valor || 0), 0);

            const totalDespesas = (expenses || [])
              .filter(e => e.type === 'Despesa' && new Date(e.date).getMonth() === currMonth && new Date(e.date).getFullYear() === currYear)
              .reduce((sum, e) => sum + Number(e.value || e.valor || 0), 0);

            const currentAppointments = (appointments || []).length; // Since appointments are local state and usually "current"

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Faturamento */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-neutral-500 tracking-wider">FATURAMENTO<br />DO MÊS</h3>
                    <div className="w-8 h-8 rounded-full border border-emerald-900/50 flex items-center justify-center text-emerald-500">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>
                    {showValues ? `R$ ${totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ •••••••'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <TrendingUp size={14} />
                    <span>Calculado em tempo real</span>
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
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>{currentAppointments}</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                    <TrendingUp size={14} />
                    <span>Agendamentos ativos</span>
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
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>0</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                    <TrendingDown size={14} />
                    <span>Módulo CRM em breve</span>
                  </div>
                </div>

                {/* Despesas */}
                <div className={`${isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-red-50 border-red-200'} border rounded-2xl p-6 shadow-xl transition-colors duration-300`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-neutral-500 tracking-wider">DESPESAS DO MÊS</h3>
                    <div className="w-8 h-8 rounded-full border border-purple-900/50 flex items-center justify-center text-purple-500">
                      <BarChart3 size={16} />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-red-700'} mb-2`}>
                    {showValues ? `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ •••••••'}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                    <TrendingUp size={14} />
                    <span>Calculado em tempo real</span>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div
              onClick={() => setActiveMenu('Estoque')}
              className={` ${isDarkMode ? "bg-[#1c0d0d] border-red-900/30 hover:border-red-500/50 cursor-pointer" : "bg-red-50 border-red-100 hover:border-red-300 cursor-pointer"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300 `}
            >
              <div className="w-10 h-10 rounded-lg border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-red-400 font-medium text-sm">Estoque Crítico</h4>
                <p className={`text-xs ${criticalStockItems.length > 0 ? "text-red-300 font-semibold" : "text-zinc-500"}`}>
                  {criticalStockItems.length > 0 ? `${criticalStockItems.length} item(s) zerado(s)` : "Nenhum item em estado crítico"}
                </p>
              </div>
            </div>
            <div
              onClick={() => setActiveMenu('Estoque')}
              className={` ${isDarkMode ? "bg-[#1c140d] border-orange-900/30 hover:border-orange-500/50 cursor-pointer" : "bg-orange-50 border-orange-100 hover:border-orange-300 cursor-pointer"} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300 `}
            >
              <div className="w-10 h-10 rounded-lg border border-orange-900/50 flex items-center justify-center text-orange-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-orange-400 font-medium text-sm">Estoque Baixo</h4>
                <p className={`text-xs ${lowStockItems.length > 0 ? "text-orange-300 font-semibold" : "text-zinc-500"}`}>
                  {lowStockItems.length > 0 ? `${lowStockItems.length} item(s) com estoque baixo` : "Nenhum item com estoque baixo"}
                </p>
              </div>
            </div>
          </div>

          {/* Unified Cash Flow Card (The "Balloon") */}
          <div className={`border rounded-3xl p-8 mb-4 transition-all duration-500 shadow-sm ${isDarkMode ? 'bg-[#0A0A0A] border-white/10 hover:border-white/20' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Content (Chart) */}
              <div className="lg:col-span-2">
                <CashFlowChart
                  activePeriod={activePeriod}
                  setActivePeriod={setActivePeriod}
                  analysisPeriod={analysisPeriod}
                  expenses={expenses}
                  appointments={appointments}
                  services={services}
                  isDarkMode={isDarkMode}
                  showValues={showValues}
                />
              </div>

              {/* Sidebar (Balance) */}
              <div className={`lg:col-span-1 border-l pl-6 h-full transition-colors ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <DashboardBalance
                  activePeriod={activePeriod}
                  analysisPeriod={analysisPeriod}
                  setAnalysisPeriod={setAnalysisPeriod}
                  expenses={expenses}
                  appointments={appointments}
                  services={services}
                  isDarkMode={isDarkMode}
                  showValues={showValues}
                  setShowValues={setShowValues}
                />
              </div>
            </div>
          </div>

          {/* Row 1: Separate Balloons for Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`border rounded-2xl p-6 transition-all shadow-sm ${isDarkMode ? 'bg-[#0A0A0A] border-white/10 hover:border-white/20' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}>
              <UpcomingAppointmentsWidget
                appointments={appointments}
                services={services}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className={`border rounded-2xl p-6 transition-all shadow-sm ${isDarkMode ? 'bg-[#0A0A0A] border-white/10 hover:border-white/20' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}>
              <UpcomingBirthdaysWidget
                patients={patients}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Row 2: Charts Trio (Heatmap etc.) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4"> </div>

          {/* Row 2: Charts Trio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-6">
            <div className="lg:col-span-1">
              <AppointmentsByProfessionalWidget appointments={appointments} professionals={professionals} isDarkMode={isDarkMode} />
            </div>
            <div className="lg:col-span-1">
              <BusyDaysWidget appointments={appointments} isDarkMode={isDarkMode} />
            </div>
            <div className="lg:col-span-2">
              <BusyHoursWidget appointments={appointments} isDarkMode={isDarkMode} />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const CurrentTimeIndicator = ({ selectedDate }: { selectedDate: Date }) => {
  const [now, setNow] = useState(new Date());
  const [topPx, setTopPx] = useState<number | null>(null);

  // Atualiza relógio a cada minuto
  useEffect(() => {
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

  // Calcula posição com base nos slots DOM reais
  useEffect(() => {
    const calculate = () => {
      const slots = document.querySelectorAll('.time-slot-row');
      if (slots.length === 0) return;

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const minutesFromStart = (hours - 8) * 60 + minutes;
      if (minutesFromStart < 0 || minutesFromStart > 720) {
        setTopPx(null);
        return;
      }

      // Índice do slot atual e fração dentro dele
      const slotIndex = Math.floor(minutesFromStart / 30);
      const fraction = (minutesFromStart % 30) / 30;

      if (slotIndex >= slots.length) {
        setTopPx(null);
        return;
      }

      const currentSlot = slots[slotIndex] as HTMLElement;
      const position = currentSlot.offsetTop + (fraction * currentSlot.offsetHeight);
      setTopPx(position);
    };

    // Aguardar layout flex completar
    requestAnimationFrame(() => {
      requestAnimationFrame(calculate);
    });

    // Re-calcular ao redimensionar
    window.addEventListener('resize', calculate);
    const observer = new ResizeObserver(calculate);
    const firstSlot = document.querySelector('.time-slot-row');
    if (firstSlot) observer.observe(firstSlot);

    return () => {
      window.removeEventListener('resize', calculate);
      observer.disconnect();
    };
  }, [now]);

  // Visibilidade: só renderizar se selectedDate === hoje
  const today = new Date();
  const isToday = selectedDate.getDate() === today.getDate()
    && selectedDate.getMonth() === today.getMonth()
    && selectedDate.getFullYear() === today.getFullYear();

  if (!isToday || topPx === null) return null;

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

const AgendaOverview = ({ appointments = [], professionals = [], services = [], isDarkMode = true, patients = [] }: any) => {
  const today = new Date();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('Esta semana');

  // Inicializa com a semana atual
  const defStart = new Date(today);
  defStart.setDate(today.getDate() - today.getDay());
  defStart.setHours(0, 0, 0, 0);
  const defEnd = new Date(defStart);
  defEnd.setDate(defStart.getDate() + 6);
  defEnd.setHours(23, 59, 59, 999);

  const [startDate, setStartDate] = useState(defStart);
  const [endDate, setEndDate] = useState(defEnd);

  const formatDateShort = (d: Date) => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const periodLabel = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;

  // 2. Filtro de Agendamentos por Período Selecionado
  const periodAppts = appointments.filter((app: any) => {
    if (!app.date) return false;
    const appDate = new Date(app.date);
    return appDate >= startDate && appDate <= endDate;
  });

  const totalAppts = periodAppts.length;

  // 3. Cálculo de Ociosidade
  // 08:00 - 19:30 em intervalos de 30m = 24 slots por prof por dia
  // Calcula o número de dias no período
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const slotsPerDay = 24;
  const totalPotentialSlots = professionals.length * slotsPerDay * diffDays;
  const bookedSlots = periodAppts.length;
  const idlenessPercValue = totalPotentialSlots > 0
    ? ((totalPotentialSlots - bookedSlots) / totalPotentialSlots * 100)
    : 100;

  const statusStats = {
    Agendado: periodAppts.filter((a: any) => !a.completed && !a.cancelled).length || 0,
    Confirmado: 0,
    'Não compareceu': 0,
    Concluído: periodAppts.filter((a: any) => a.completed).length || 0,
    Cancelado: periodAppts.filter((a: any) => a.cancelled).length || 0,
  };

  const statusPerc = (count: number) => totalAppts > 0 ? (count / totalAppts * 100).toFixed(1) + '%' : '0%';

  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const dayCounts = Array(7).fill(0);
  periodAppts.forEach((app: any) => {
    if (!app.date) return;
    const date = new Date(app.date);
    dayCounts[date.getDay()]++;
  });
  const maxCount = Math.max(...dayCounts, 1);

  // 4. Clientes Frequentes
  const clientCounts: Record<string, number> = {};
  periodAppts.forEach((app: any) => {
    if (app.patientName) clientCounts[app.patientName] = (clientCounts[app.patientName] || 0) + 1;
  });
  const topClients = Object.entries(clientCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3);

  // 5. Serviços Frequentes
  const serviceCounts: Record<string, number> = {};
  periodAppts.forEach((app: any) => {
    if (app.service) serviceCounts[app.service] = (serviceCounts[app.service] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3);

  // 6. Ociosidade por Profissional
  const profAppts: Record<string, number> = {};
  periodAppts.forEach((app: any) => {
    if (app.professionalId) profAppts[app.professionalId] = (profAppts[app.professionalId] || 0) + 1;
  });
  const profIdleness = professionals.map((p: any) => {
    const booked = profAppts[p.id] || 0;
    const totalSlots = slotsPerDay * diffDays;
    const idle = totalSlots > 0 ? ((totalSlots - booked) / totalSlots * 100).toFixed(1) + '%' : '100%';
    return { name: p.name, value: idle };
  }).sort((a: any, b: any) => parseFloat(b.value) - parseFloat(a.value)).slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-12 pb-10 custom-scrollbar flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header with Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className={`text-2xl font-light font-bricolage tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Visão Geral</h2>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-widest">Agenda & Performance</p>
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 group"
          >
            <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Período</span>
          </button>

          <div className={`px-6 py-3 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
            <span className={`text-[12px] font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>
              {periodLabel}
            </span>
          </div>

          <PeriodSelector
            startDate={startDate}
            endDate={endDate}
            onSelect={(start, end, preset) => {
              setStartDate(start);
              setEndDate(end);
              setActivePreset(preset || 'Personalizado');
            }}
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            isDarkMode={isDarkMode}
            activePreset={activePreset}
          />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: `Agendamentos (${activePreset})`, value: totalAppts, trend: null },
          { title: 'Ociosidade Média', value: idlenessPercValue.toFixed(2) + '%', trend: null },
          { title: 'Pacientes na lista de espera', value: '0', trend: null },
        ].map((kpi, idx) => (
          <div key={idx} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5 shadow-xl' : 'bg-white border-neutral-200 shadow-sm'} flex flex-col gap-4 relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">{kpi.title}</h3>
              {kpi.trend && kpi.trend.startsWith('-') ? <TrendingDown size={14} className="text-red-500 opacity-50" /> : kpi.trend ? <TrendingUp size={14} className="text-emerald-500 opacity-50" /> : null}
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-light font-bricolage tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Agendamentos por período */}
        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-neutral-200'} shadow-xl flex flex-col gap-8`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Volume de Agendamentos</h3>
            <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full uppercase tracking-widest">{activePreset}</span>
          </div>

          <div className="h-64 flex items-end justify-between px-2 pb-2 gap-4">
            {weekDaysShort.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                <div
                  className={`w-full max-w-[40px] rounded-lg transition-all duration-700 relative ${dayCounts[i] > 0 ? 'bg-orange-500/40' : (isDarkMode ? 'bg-white/5' : 'bg-neutral-100')}`}
                  style={{ height: `${(dayCounts[i] / maxCount) * 100}%`, minHeight: '8px' }}
                >
                  {dayCounts[i] === maxCount && dayCounts[i] > 0 && <div className="absolute -top-1 left-0 right-0 h-1 bg-orange-500 rounded-full blur-[2px]" />}
                </div>
                <span className={`text-[10px] font-bold transition-colors ${isDarkMode ? 'text-neutral-500 group-hover:text-white' : 'text-neutral-600 group-hover:text-neutral-900'}`}>{day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-1 bg-orange-500/60 rounded-full" />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Procedimentos</span>
            </div>
          </div>
        </div>

        {/* Agendamentos por status */}
        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-neutral-200'} shadow-xl flex flex-col gap-8`}>
          <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Distribuição por status</h3>
          <div className="flex flex-col gap-6">
            {[
              { label: 'Agendado', color: 'orange', icon: Calendar, count: statusStats.Agendado },
              { label: 'Confirmado', color: 'emerald', icon: CheckCircle2, count: statusStats.Confirmado },
              { label: 'Não compareceu', color: 'red', icon: XCircle, count: statusStats['Não compareceu'] },
              { label: 'Concluído', color: 'emerald', icon: Target, count: statusStats.Concluído },
              { label: 'Cancelado', color: 'neutral', icon: Trash2, count: statusStats.Cancelado },
            ].map((st) => (
              <div key={st.label} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${st.color === 'orange' ? 'bg-orange-500/10 text-orange-500' : st.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : st.color === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                    <st.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold leading-none ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{st.label}</span>
                    <span className="text-[12px] text-neutral-500 font-medium mt-1.5">{st.count}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-neutral-500">{statusPerc(st.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Clientes frequentes */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5' : 'bg-white border-neutral-200'} flex flex-col gap-6 group hover:border-orange-500/20 transition-colors`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-orange-500/60" />
              <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Clientes mais frequentes</h3>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {topClients.length > 0 ? topClients.map(([name, count], i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-neutral-900'} truncate mr-2`}>{name}</span>
                <span className="text-[10px] font-bold text-orange-500">{count}x</span>
              </div>
            )) : (
              <div className="py-4 flex flex-col items-center gap-2 opacity-30">
                <AlertTriangle size={20} />
                <span className="text-[8px] uppercase font-bold tracking-widest">Sem dados</span>
              </div>
            )}
          </div>
        </div>

        {/* Ociosidade por profissional */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5' : 'bg-white border-neutral-200'} flex flex-col gap-6 group hover:border-orange-500/20 transition-colors`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-orange-500/60" />
              <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Ociosidade por Profissional</h3>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {profIdleness.length > 0 ? profIdleness.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-neutral-900'} truncate mr-2`}>{p.name}</span>
                <span className={`text-[10px] font-bold ${parseFloat(p.value) > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{p.value}</span>
              </div>
            )) : (
              <div className="py-4 flex flex-col items-center gap-2 opacity-30">
                <AlertTriangle size={20} />
                <span className="text-[8px] uppercase font-bold tracking-widest">Sem dados</span>
              </div>
            )}
          </div>
        </div>

        {/* Serviços mais frequentes */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5' : 'bg-white border-neutral-200'} flex flex-col gap-6 group hover:border-orange-500/20 transition-colors`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Box size={14} className="text-orange-500/60" />
              <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Serviços mais frequentes</h3>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {topServices.length > 0 ? topServices.map(([name, count], i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-neutral-900'} truncate mr-2`}>{name}</span>
                <span className="text-[10px] font-bold text-orange-500">{count}x</span>
              </div>
            )) : (
              <div className="py-4 flex flex-col items-center gap-2 opacity-30">
                <AlertTriangle size={20} />
                <span className="text-[8px] uppercase font-bold tracking-widest">Sem dados</span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Espera */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a]/50 border-white/5' : 'bg-white border-neutral-200'} flex flex-col gap-6 group hover:border-orange-500/20 transition-colors`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <List size={14} className="text-orange-500/60" />
              <h3 className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Lista de Espera</h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-4 gap-2 opacity-30">
            <AlertTriangle size={20} />
            <span className="text-[8px] uppercase font-bold tracking-widest">Nenhum paciente na lista</span>
          </div>
        </div>
      </div>

      {/* Activity Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2.5fr] gap-6 pb-6">
        <BusyDaysWidget appointments={appointments} isDarkMode={isDarkMode} />
        <BusyHoursWidget appointments={appointments} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

const AgendaView = ({ professionals, services = [], appointments = [], setAppointments, setPatients, onCompleteService, isDarkMode = true, patients = [], onNavigateToPatient }: any) => {
  const { addToast } = useToast();
  const [activeAgendaSubTab, setActiveAgendaSubTab] = useState('CALENDÁRIO');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerMonth, setDatePickerMonth] = useState(new Date().getMonth());
  const [datePickerYear, setDatePickerYear] = useState(new Date().getFullYear());
  const [selectedService, setSelectedService] = useState('');
  const [additionalServices, setAdditionalServices] = useState<string[]>([]); // multiple services
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [isProfDropdownOpen, setIsProfDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [additionalServiceDropdownIndex, setAdditionalServiceDropdownIndex] = useState<number | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  // appointments state moved to App.tsx
  const [selectedAppDetails, setSelectedAppDetails] = useState<any | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Audio Recording States & Refs
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const recognitionRef = useRef<any>(null);
  const isRecordingIntent = useRef(false);
  const transcriptionRef = useRef(transcription);
  const baseTranscriptionRef = useRef('');

  useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  const handleRecordAudio = () => {
    if (isRecording) {
      isRecordingIntent.current = false;
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta transcrição nativa.");

    baseTranscriptionRef.current = transcriptionRef.current;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      let completeSessionText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          completeSessionText += event.results[i][0].transcript + " ";
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      const base = baseTranscriptionRef.current ? baseTranscriptionRef.current.trim() + " " : "";
      const fullText = (base + completeSessionText + interimText).trim();

      setTranscription(fullText);
      transcriptionRef.current = fullText;
    };

    recognition.onerror = (event: any) => {
      const isEdge = /Edg/.test(navigator.userAgent);
      if (event.error === 'not-allowed') {
        alert("🚨 BLOQUEIO DE MICROFONE! Verifique as permissões.");
      } else if (event.error === 'network') {
        alert("🚨 Erro de Rede: A transcrição nativa precisa de internet.");
      }
      setIsRecording(false);
      isRecordingIntent.current = false;
    };

    recognition.onend = () => {
      if (isRecordingIntent.current) {
        try {
          setTimeout(() => {
            if (isRecordingIntent.current) recognition.start();
          }, 200);
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    isRecordingIntent.current = true;
    setIsRecording(true);
    recognition.start();
  };

  // Estados e Logica do Mini Calendário Nativo (Blindado)
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  // Helpers Matematicos Date
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentMonthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const handlePrevDay = () => {
    const newDate = new Date(selectedCalendarDate);
    newDate.setDate(selectedCalendarDate.getDate() - 1);
    setSelectedCalendarDate(newDate);
    setViewDate(new Date(newDate));
  };
  const handleNextDay = () => {
    const newDate = new Date(selectedCalendarDate);
    newDate.setDate(selectedCalendarDate.getDate() + 1);
    setSelectedCalendarDate(newDate);
    setViewDate(new Date(newDate));
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Formatar a data atual selecionada (ex: domingo, 22 fev)
  const formatHeaderDate = (d: Date) => {
    const weekNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const monthShorts = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${weekNames[d.getDay()]}, ${d.getDate()} ${monthShorts[d.getMonth()]}`;
  };

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
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
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
      <header className="pt-12 px-12 pb-8 z-50 relative shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className={`${isDarkMode ? "text-white" : "text-zinc-900"}`} size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Agenda</h1>
          </div>

          <div className="flex items-center gap-6">
            {activeAgendaSubTab === 'CALENDÁRIO' && (
              <>
                <div className={`flex items-center gap-4 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium relative`}>
                  <button onClick={handlePrevDay} className="hover:text-orange-500 hover:scale-110 transition-all"><ChevronLeft size={20} /></button>
                  <div className="relative" ref={calendarRef}>
                    <button
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isCalendarOpen ? (isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600') : (isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100')}`}
                    >
                      <span>{formatHeaderDate(selectedCalendarDate)}</span>
                      <ChevronDown size={14} className={`shrink-0 transition-transform ${isCalendarOpen ? 'rotate-180 text-orange-500' : 'text-zinc-500'}`} />
                    </button>

                    {/* Calendário Luminous Popover */}
                    {isCalendarOpen && (
                      <div className={`absolute top-full mt-3 right-0 md:left-1/2 md:-translate-x-1/2 w-72 z-[9999] rounded-2xl border shadow-2xl overflow-hidden ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"}`}>
                        <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200"}`}>
                          <button onClick={handlePrevMonth} className={`p-1 rounded opacity-70 hover:opacity-100 transition-colors ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}><ChevronLeft size={18} /></button>
                          <div className="font-semibold text-sm">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                          </div>
                          <button onClick={handleNextMonth} className={`p-1 rounded opacity-70 hover:opacity-100 transition-colors ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}><ChevronRight size={18} /></button>
                        </div>

                        <div className="p-4">
                          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                            {weekDaysShort.map((day, i) => (
                              <div key={i} className={`text-[10px] font-bold tracking-wider ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>{day}</div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDay }).map((_, i) => (
                              <div key={`empty-${i}`} className="w-8 h-8" />
                            ))}

                            {Array.from({ length: currentMonthDays }).map((_, i) => {
                              const day = i + 1;
                              const isCurrentDay = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();
                              const isSelected = day === selectedCalendarDate.getDate() && viewDate.getMonth() === selectedCalendarDate.getMonth() && viewDate.getFullYear() === selectedCalendarDate.getFullYear();

                              return (
                                <button
                                  key={day}
                                  onClick={() => {
                                    setSelectedCalendarDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                                    setIsCalendarOpen(false);
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                                    ${isSelected
                                      ? "bg-orange-500 text-white font-bold shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                                      : isCurrentDay
                                        ? (isDarkMode ? "bg-zinc-800 text-orange-400 font-semibold" : "bg-orange-50 text-orange-600 font-semibold")
                                        : (isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-700 hover:bg-zinc-100")
                                    }
                                  `}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={handleNextDay} className="hover:text-orange-500 hover:scale-110 transition-all"><ChevronRight size={20} /></button>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Plus size={18} />
                  Novo Agendamento
                </button>
              </>
            )}

            {activeAgendaSubTab === 'VISÃO GERAL' && (
              <div className="flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
                <div className={`p-2.5 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-zinc-50 border-zinc-200'} text-neutral-500 hover:text-orange-500 transition-colors cursor-pointer group`}>
                  <Search size={18} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sub-tabs Link Bar */}
        <div className={`flex items-center gap-6 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
          {[
            { id: 'VISÃO GERAL', label: 'Visão Geral', icon: BarChart3 },
            { id: 'CALENDÁRIO', label: 'Calendário', icon: Calendar },
            { id: 'RELATÓRIOS', label: 'Relatórios', icon: FileStack }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAgendaSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeAgendaSubTab === tab.id ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content Grid */}
      {activeAgendaSubTab === 'CALENDÁRIO' ? (
        <div className="flex-1 flex px-4 lg:px-12 gap-8 z-10 overflow-hidden pb-10 animate-in slide-in-from-bottom-4 duration-500">
          {/* Main Calendar Area */}
          <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#0a0a0a]/50' : 'bg-white'} border ${isDarkMode ? "border-white/5" : "border-zinc-200/80"} rounded-[32px] overflow-hidden shadow-2xl shadow-black/40`}>
            {/* Professionals Header */}
            <div className={`flex border-b ${isDarkMode ? "border-white/5" : "border-zinc-200/80"} pl-16`}>
              {professionals.map((prof: any) => (
                <div key={prof.id} className={`flex-1 p-5 flex items-center gap-4 border-r ${isDarkMode ? "border-white/5" : "border-zinc-200/80"} last:border-r-0`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold shadow-lg transform transition-transform hover:scale-110`} style={{ backgroundColor: prof.color }}>
                    {prof.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-sm tracking-tight`}>{prof.name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mt-1">0 AGEND.</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative pt-8 pb-12">
              <CurrentTimeIndicator selectedDate={selectedCalendarDate} />
              {timeSlots.map(time => (
                <div key={time} className={`time-slot-row flex h-[60px] border-t ${isDarkMode ? "border-white/[0.04]" : "border-zinc-200/60"} transition-colors relative`}>
                  <div className={`w-16 relative flex items-start justify-center`}>
                    <span className="absolute -top-2.5 text-[10px] font-medium text-zinc-400 tabular-nums">
                      {time}
                    </span>
                  </div>
                  {professionals.map((prof: any) => (
                    <div
                      key={`${prof.id}-${time}`}
                      className={`flex-1 border-r ${isDarkMode ? "border-white/[0.04]" : "border-zinc-200/60"} last:border-r-0 cursor-pointer transition-colors relative group`}
                      onClick={() => handleTimeClick(time)}
                    >
                      {(() => {
                        const app = appointmentsMap[`${prof.id}-${time}`];
                        if (!app) return null;

                        const parse = (t: string) => {
                          if (!t) return 0;
                          const [h, m] = t.split(':').map(Number);
                          return h * 60 + m;
                        };

                        const startMin = parse(app.time);
                        const endMin = parse(app.endTime || app.time);
                        const duration = Math.max(30, endMin - startMin);
                        const slots = duration / 30;

                        const textColor = getContrastYIQ(app.displayColor);
                        const bgColor = app.displayColor.startsWith('#') ? app.displayColor :
                          app.displayColor === 'red' ? '#ef4444' :
                            app.displayColor === 'blue' ? '#3b82f6' :
                              app.displayColor === 'green' ? '#22c55e' :
                                app.displayColor === 'purple' ? '#a855f7' : '#f97316';
                        return (
                          <div
                            className={`absolute top-0 left-2 right-2 z-40 ${textColor} p-2 rounded-xl shadow-2xl animate-in zoom-in duration-300 flex flex-col justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/40 transition-all active:scale-[0.98] border border-white/10`}
                            style={{ 
                              backgroundColor: bgColor,
                              height: `calc(${slots * 100}% + ${Math.max(0, Math.ceil(slots) - 1)}px - 4px)`
                            }}
                            onClick={(e) => { e.stopPropagation(); setSelectedAppDetails(app); setIsDetailsModalOpen(true); }}
                          >
                            <div className="flex flex-col gap-0.5 pointer-events-none">
                              <span className="text-[12px] font-bold uppercase truncate tracking-tight leading-zero">{app.patient}</span>
                              <span className="text-[11px] opacity-80 truncate leading-none">{app.service}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-90">{app.status || 'Agendado'}</span>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
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
      ) : activeAgendaSubTab === 'VISÃO GERAL' ? (
        <AgendaOverview appointments={appointments} professionals={professionals} services={services} isDarkMode={isDarkMode} patients={patients} />
      ) : (
        <AgendaReportsView appointments={appointments} professionals={professionals} isDarkMode={isDarkMode} patients={patients} />
      )}

      {/* New Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsProfDropdownOpen(false);
          setIsServiceDropdownOpen(false);
          setSelectedProfessional('');
          setAdditionalServices([]);
          setPatientSearchQuery('');
          setIsPatientDropdownOpen(false);
          setPatientName('');
          setSelectedAppId(null);
        }}
        onConfirm={async (data) => {
          if (!data.patientName || !data.professionalId || !data.startTime) {
            alert('Erro: Preencha Paciente, Profissional e Horário de Início antes de confirmar.');
            return;
          }
          const allServiceNames = data.services
            .map((s: any) => services.find((serv: any) => serv.id === s.id)?.name)
            .filter(Boolean);
          const allServiceIds = data.services.map((s: any) => s.id).filter(Boolean);

          // Auto-create patient in Clientes if they don't exist yet
          let patientIdForApp = data.patientId || null;
          const existingPatient = patients?.find((p: any) =>
            (data.patientId && p.id === data.patientId) ||
            p.name?.toLowerCase().trim() === data.patientName?.toLowerCase().trim()
          );
          if (!existingPatient) {
            const newPatientId = data.patientId || `pat_${Date.now()}`;
            const newPatient = {
              id: newPatientId,
              name: data.patientName,
              phone: data.patientPhone || '',
              email: data.patientEmail || '',
              notes: '',
              history: [],
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(db, 'clientes', newPatientId), newPatient);
              // setPatients is handled by onSnapshot in App.js now
              patientIdForApp = newPatientId;
            } catch (e) { console.error('Erro ao criar paciente:', e); }
          } else {
            patientIdForApp = existingPatient.id;
          }

          const appId = data.id || Date.now();
          const newApp = {
            id: appId,
            patient: data.patientName,
            patientId: patientIdForApp,
            service: allServiceNames.join(', ') || 'Sem serviço',
            serviceIds: allServiceIds,
            time: data.startTime,
            endTime: data.endTime,
            plan: data.plan || '',
            status: data.status || 'Agendado',
            color: data.color || 'Padrão',
            observations: data.observations || '',
            professionalId: data.professionalId,
            date: data.date ? (typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
          };

          try {
            await setDoc(doc(db, 'agendamentos', String(appId)), newApp);
            
            // If status changed to "Concluído", trigger inventory reduction and finance
            if (data.status === 'Concluído') {
              // Trigger same logic as onComplete but adapted for this context
              const appServices = data.services
                .map((s: any) => services.find((serv: any) => serv.id === s.id))
                .filter(Boolean);

              for (const sid of allServiceIds) {
                const s = services?.find((serv: any) => serv.id === sid);
                if (s && s.items) {
                  for (const item of s.items) {
                    const invDocRef = doc(db, 'estoque', item.itemId);
                    const invSnap = await getDoc(invDocRef);
                    if (invSnap.exists()) {
                      const currentStock = invSnap.data().stock || 0;
                      await updateDoc(invDocRef, {
                        stock: Math.max(0, currentStock - (item.quantity || 1))
                      });
                    }
                  }
                }
              }
              
              // Financial entry if not already present (simplified check)
              let totalValue = 0;
              for (const sid of allServiceIds) {
                const s = services?.find((serv: any) => serv.id === sid);
                if (s) totalValue += Number(s.price || s.valor || s.value || 0);
              }
              if (totalValue > 0) {
                const financeId = `fin_${appId}`;
                await setDoc(doc(db, 'financeiro', financeId), {
                  id: financeId,
                  description: `Atendimento: ${newApp.service} - ${newApp.patient}`,
                  category: 'Serviços Prestados',
                  quantity: 1, value: totalValue,
                  dueDate: new Date().toISOString().split('T')[0],
                  status: 'Pago', recurrence: 'Não', type: 'Receita', date: new Date().toISOString()
                });
              }
            }

            setAppointments(prev => {
              const filtered = prev.filter(a => String(a.id) !== String(appId));
              return [...filtered, newApp];
            });
            setIsModalOpen(false);
          } catch (e) {
            console.error('Erro ao salvar agendamento:', e);
            alert('Erro ao salvar agendamento no servidor.');
          }

          // Cleanup
          setPatientName('');
          setPatientSearchQuery('');
          setIsPatientDropdownOpen(false);
          setSelectedService('');
          setAdditionalServices([]);
          setSelectedProfessional('');
          setIsProfDropdownOpen(false);
          setIsServiceDropdownOpen(false);
          setSelectedAppId(null);
        }}
        professionals={professionals}
        services={services}
        patients={patients}
        isDarkMode={isDarkMode}
        initialDate={selectedDate || undefined}
        initialTime={selectedTime || undefined}
        initialPatientName={patientName}
        initialProfessionalId={selectedProfessional}
        initialServiceIds={selectedService ? [selectedService, ...additionalServices].filter(Boolean) : additionalServices}
        initialId={selectedAppId || undefined}
      />

      {/* Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen && !!selectedAppDetails}
        appointment={selectedAppDetails}
        professionals={professionals}
        services={services}
        patients={patients}
        isDarkMode={isDarkMode}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppDetails(null);
          setTranscription('');
          setIsRecording(false);
          if (recognitionRef.current) recognitionRef.current.stop();
        }}
        onEdit={(app) => {
          setPatientName(app.patient);
          setSelectedService(services.find((s: any) => s.name === app.service)?.id || '');
          setSelectedProfessional(app.professionalId);
          setSelectedTime(app.time);
          setSelectedAppId(app.id);
          setIsModalOpen(true);
        }}
        onDuplicate={(app) => {
          setPatientName(app.patient);
          setSelectedService(services.find((s: any) => s.name === app.service)?.id || '');
          setSelectedProfessional(app.professionalId);
          setSelectedTime(app.time);
          setSelectedAppId(null); // Ensure new ID
          setIsModalOpen(true);
        }}
        onDelete={async (appId) => {
          try {
            await deleteDoc(doc(db, 'agendamentos', String(appId)));
            setAppointments((prev: any[]) => prev.filter(a => String(a.id) !== String(appId)));
            addToast('Agendamento excluído.', 'success');
          } catch (e) {
            console.error('Erro ao excluir agendamento:', e);
            addToast('Erro ao excluir.', 'error');
          }
        }}
        onComplete={async (app, transcriptionText) => {
          const targetPatientName = app.patient;
          if (targetPatientName) {
            const newRecord = {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString('pt-BR'),
              type: 'Anotação Relevante',
              content: encryptField(transcriptionText.trim())
            };
            const matchedPatient = patients?.find((p: any) => p.name === targetPatientName);
            if (matchedPatient?.id && transcriptionText.trim()) {
              try {
                const updatedHistory = [newRecord, ...(matchedPatient.history || [])];
                await setDoc(doc(db, 'clientes', matchedPatient.id), { ...matchedPatient, history: updatedHistory }, { merge: true });
              } catch (e) { console.error(e); }
            }
          }
          if (app.serviceIds && app.serviceIds.length > 0) {
            let totalValue = 0;
            for (const sid of app.serviceIds) {
              const s = services?.find((serv: any) => serv.id === sid);
              if (s) {
                totalValue += Number(s.price || s.valor || s.value || 0);
                
                // Redução de estoque para cada item do serviço
                if (s.items && s.items.length > 0) {
                  for (const item of s.items) {
                    try {
                      const invDocRef = doc(db, 'estoque', item.itemId);
                      const invSnap = await getDoc(invDocRef);
                      if (invSnap.exists()) {
                        const currentStock = invSnap.data().stock || 0;
                        await updateDoc(invDocRef, {
                          stock: Math.max(0, currentStock - (item.quantity || 1))
                        });
                      }
                    } catch (err) { console.error('Erro ao baixar estoque:', err); }
                  }
                }
              }
            }
            if (totalValue > 0) {
              const financeId = `fin_${app.id}`;
              try {
                await setDoc(doc(db, 'financeiro', financeId), {
                  id: financeId,
                  description: `Atendimento: ${app.service} - ${app.patient}`,
                  category: 'Serviços Prestados',
                  quantity: 1, value: totalValue,
                  dueDate: new Date().toISOString().split('T')[0],
                  status: 'Pago', recurrence: 'Não', type: 'Receita', date: new Date().toISOString()
                });
              } catch (e) { console.error(e); }
            }
          }
          
          // Marcar como Concluído no Firestore antes de remover/atualizar
          try {
            await updateDoc(doc(db, 'agendamentos', String(app.id)), { 
              status: 'Concluído',
              completed: true 
            });
          } catch (e) { console.error(e); }
          addToast('Atendimento finalizado!', 'success');
          setAppointments((prev: any[]) => prev.filter(a => a.id !== app.id));
          setIsDetailsModalOpen(false);
          setSelectedAppDetails(null);
          setIsRecording(false);
          if (recognitionRef.current) recognitionRef.current.stop();
        }}
        onNavigateToPatient={onNavigateToPatient}
      />
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
  const [isRecordTypeDropdownOpen, setIsRecordTypeDropdownOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isRecordingIntent = useRef(false);
  const transcriptionRef = useRef(transcription);
  const baseTranscriptionRef = useRef(''); // Texto que já estava lá antes de começar a gravar

  React.useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCPF, setEditCPF] = useState('');
  const [editTipo, setEditTipo] = useState('Particular');
  const [editTags, setEditTags] = useState('');
  const [editAtivo, setEditAtivo] = useState(true);
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editIdade, setEditIdade] = useState('');
  const [editSexo, setEditSexo] = useState('');
  const [editEstadoCivil, setEditEstadoCivil] = useState('');
  const [editProfissao, setEditProfissao] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editRG, setEditRG] = useState('');
  const [editCNPJ, setEditCNPJ] = useState('');
  const [editCor, setEditCor] = useState('');
  const [editOrigem, setEditOrigem] = useState('');
  const [editConvenio, setEditConvenio] = useState('');
  const [editGestante, setEditGestante] = useState('Não');
  const [editTabagista, setEditTabagista] = useState('Não');
  const [editDiabetes, setEditDiabetes] = useState('Não');
  const [editHipertensao, setEditHipertensao] = useState('Não');
  const [editMarcapasso, setEditMarcapasso] = useState('Não');
  const [editHormonal, setEditHormonal] = useState('Não');
  const [editHepatica, setEditHepatica] = useState('Não');
  const [editFiltroSolar, setEditFiltroSolar] = useState('Não');
  const [editMedicamentos, setEditMedicamentos] = useState('Não');

  React.useEffect(() => {
    if (activeCard) {
      setEditName(activeCard.name || '');
      setEditPhone(activeCard.phone || '');
      setEditEmail(activeCard.email || '');
      setEditNotes(activeCard.notes || '');
      setEditCPF(activeCard.cpf || '');
      setEditTipo(activeCard.tipo || 'Particular');
      setEditTags(activeCard.tags || '');
      setEditAtivo(activeCard.ativo !== undefined ? activeCard.ativo : true);
      setEditBirthDate(activeCard.birthDate || '');
      setEditIdade(activeCard.idade || '');
      setEditSexo(activeCard.sexo || '');
      setEditEstadoCivil(activeCard.estadoCivil || '');
      setEditProfissao(activeCard.profissao || '');
      setEditEndereco(activeCard.endereco || '');
      setEditRG(activeCard.rg || '');
      setEditCNPJ(activeCard.cnpj || '');
      setEditCor(activeCard.cor || '');
      setEditOrigem(activeCard.origem || '');
      setEditConvenio(activeCard.convenio || '');
      setEditGestante(activeCard.gestante || 'Não');
      setEditTabagista(activeCard.tabagista || 'Não');
      setEditDiabetes(activeCard.diabetes || 'Não');
      setEditHipertensao(activeCard.hipertensao || 'Não');
      setEditMarcapasso(activeCard.marcapasso || 'Não');
      setEditHormonal(activeCard.hormonal || 'Não');
      setEditHepatica(activeCard.hepatica || 'Não');
      setEditFiltroSolar(activeCard.filtroSolar || 'Não');
      setEditMedicamentos(activeCard.medicamentos || 'Não');
    }
  }, [activeCard?.id]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCreateColumn = async () => {
    if (newColumnName.trim()) {
      const colId = Date.now().toString();
      const newCol = { id: colId, title: newColumnName, cardIds: [], order: columns.length };
      try {
        await setDoc(doc(db, 'crm_columns', colId), newCol);
        setNewColumnName('');
        setIsNewColumnModalOpen(false);
      } catch (e) {
        console.error("Erro ao criar coluna:", e);
      }
    }
  };

  const handleCreateCard = async () => {
    if (newCardName.trim() && activeColumnId) {
      const newPatientId = Date.now().toString();
      const newPatient = {
        id: newPatientId,
        name: newCardName,
        phone: '',
        email: '',
        cpf: '',
        notes: '',
        tipo: 'Particular',
        tags: '',
        ativo: true,
        birthDate: '',
        idade: '',
        sexo: '',
        estadoCivil: '',
        profissao: '',
        endereco: '',
        rg: '',
        cnpj: '',
        cor: '',
        origem: '',
        convenio: '',
        gestante: 'Não',
        tabagista: 'Não',
        diabetes: 'Não',
        hipertensao: 'Não',
        marcapasso: 'Não',
        hormonal: 'Não',
        hepatica: 'Não',
        filtroSolar: 'Não',
        medicamentos: 'Não',
        history: []
      };

      try {
        await setDoc(doc(db, 'clientes', newPatientId), newPatient);

        // update the column
        const column = columns.find((c: any) => c.id === activeColumnId);
        if (column) {
          const updatedCol = { ...column, cardIds: [...column.cardIds, newPatientId] };
          await setDoc(doc(db, 'crm_columns', activeColumnId), updatedCol);
        }

        setNewCardName('');
        setIsNewCardModalOpen(false);
      } catch (e) {
        console.error("Erro ao criar lead:", e);
      }
    }
  };

  const handleRecordAudio = () => {
    if (isRecording) {
      isRecordingIntent.current = false;
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    // Prioriza webkitSpeechRecognition para Edge/Chrome para garantir maior estabilidade
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta transcrição nativa.");

    baseTranscriptionRef.current = transcriptionRef.current; // Salva o ponto de partida

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true; // Feedback em tempo real
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      let completeSessionText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          completeSessionText += event.results[i][0].transcript + " ";
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      const base = baseTranscriptionRef.current ? baseTranscriptionRef.current.trim() + " " : "";
      const fullText = (base + completeSessionText + interimText).trim();

      setTranscription(fullText);
      transcriptionRef.current = fullText;
    };

    recognition.onerror = (event: any) => {
      const isEdge = /Edg/.test(navigator.userAgent);
      if (event.error === 'not-allowed') {
        alert("🚨 BLOQUEIO DE MICROFONE! Verifique as permissões no ícone de cadeado na barra de endereços.");
      } else if (event.error === 'network') {
        if (isEdge) {
          alert("🚨 MODO EDGE: O Edge detectou um erro de rede. Certifique-se de que o 'Reconhecimento de Fala Online' está ativado nas configurações do Windows (Privacidade > Fala) e que o Edge está atualizado (Ajuda > Sobre).");
        } else {
          alert("🚨 Erro de Rede: A transcrição nativa precisa de internet.");
        }
      }
      setIsRecording(false);
      isRecordingIntent.current = false;
    };

    recognition.onend = () => {
      if (isRecordingIntent.current) {
        try {
          // Maior delay para garantir liberação de hardware no Edge
          setTimeout(() => {
            if (isRecordingIntent.current) recognition.start();
          }, 200);
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    isRecordingIntent.current = true;
    setIsRecording(true);
    recognition.start();
  };
  const handleSaveRecord = async () => {
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
      notes: encryptField(editNotes),
      cpf: editCPF.replace(/\D/g, ''),
      tipo: editTipo,
      tags: editTags,
      ativo: editAtivo,
      birthDate: editBirthDate,
      idade: editIdade,
      sexo: editSexo,
      estadoCivil: editEstadoCivil,
      profissao: editProfissao,
      endereco: editEndereco,
      rg: editRG,
      cnpj: editCNPJ.replace(/\D/g, ''),
      cor: editCor,
      origem: editOrigem,
      convenio: editConvenio,
      gestante: editGestante,
      tabagista: editTabagista,
      diabetes: editDiabetes,
      hipertensao: editHipertensao,
      marcapasso: editMarcapasso,
      hormonal: editHormonal,
      hepatica: editHepatica,
      filtroSolar: editFiltroSolar,
      medicamentos: editMedicamentos,
      history: [newRecord, ...(activeCard.history || [])]
    };

    try {
      await setDoc(doc(db, 'clientes', activeCard.id), updatedCard);
      setTranscription('');
    } catch (error) {
      console.error("Erro ao salvar prontuário do lead:", error);
    }
  };

  const handleSavePatient = async () => {
    if (!activeCard) return;
    const updatedCard = {
      ...activeCard,
      name: editName,
      phone: editPhone,
      email: editEmail,
      notes: encryptField(editNotes),
      cpf: editCPF.replace(/\D/g, ''),
      tipo: editTipo,
      tags: editTags,
      ativo: editAtivo,
      birthDate: editBirthDate,
      idade: editIdade,
      sexo: editSexo,
      estadoCivil: editEstadoCivil,
      profissao: editProfissao,
      endereco: editEndereco,
      rg: editRG,
      cnpj: editCNPJ.replace(/\D/g, ''),
      cor: editCor,
      origem: editOrigem,
      convenio: editConvenio,
      gestante: editGestante,
      tabagista: editTabagista,
      diabetes: editDiabetes,
      hipertensao: editHipertensao,
      marcapasso: editMarcapasso,
      hormonal: editHormonal,
      hepatica: editHepatica,
      filtroSolar: editFiltroSolar,
      medicamentos: editMedicamentos,
    };
    try {
      await setDoc(doc(db, 'clientes', activeCard.id), updatedCard);
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;

    try {
      const batch = writeBatch(db);

      columns.forEach((col: any) => {
        const docRef = doc(db, 'crm_columns', col.id);

        // 1. We keep ONLY the IDs that still exist in the 'patients' array (Auto-heal Ghosts)
        let validCardIds = col.cardIds.filter((id: string) => patients.some((p: any) => p.id === id));

        // 2. We remove the dragged card from this column (if it was here)
        validCardIds = validCardIds.filter((id: string) => id !== cardId);

        // 3. If this is the target column, we add the dragged card to the end
        if (col.id === targetColumnId) {
          validCardIds.push(cardId);
        }

        // 4. Send the completely clean and accurate array to Firestore
        batch.update(docRef, { cardIds: validCardIds });
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao mover lead:", error);
    }
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
                <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {column.cardIds.filter((id: string) => patients.some((p: any) => p.id === id)).length}
                </span>
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
            <div
              className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[150px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {column.cardIds.map((cardId: string) => {
                const card = patients.find((p: any) => p.id === cardId);
                if (!card) return null;
                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveCardId(card.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className={`${isDarkMode ? "bg-[#121214]" : "bg-zinc-50"} border border-zinc-800/80 rounded-xl p-4 cursor-pointer hover:border-orange-500/50 transition-colors group relative active:opacity-50`}
                  >
                    <div className="flex items-center gap-3 mb-3 pointer-events-none">
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

              <div className="space-y-6">
                {/* Status e Tags */}
                <div className="flex items-center justify-between bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${editAtivo ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`} />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{editAtivo ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <Toggle checked={editAtivo} onChange={setEditAtivo} disabled={false} isDarkMode={isDarkMode} />
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {/* Identificação Principal */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Identificação</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Nome</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">CPF</label>
                          <input
                            type="text"
                            value={editCPF}
                            onChange={(e) => setEditCPF(formatCPF(e.target.value))}
                            placeholder="000.000.000-00"
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">RG</label>
                          <input
                            type="text"
                            value={editRG}
                            onChange={(e) => setEditRG(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">CNPJ</label>
                        <input
                          type="text"
                          value={editCNPJ}
                          onChange={(e) => setEditCNPJ(formatCNPJ(e.target.value))}
                          placeholder="00.000.000/0000-00"
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Perfil e Classificação */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Perfil & Classificação</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <MiniSelect
                            label="Tipo"
                            value={editTipo}
                            onChange={(val) => setEditTipo(val)}
                            options={['Particular', 'Convênio', 'Cortesia']}
                            isDarkMode={isDarkMode}
                          />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Convênio</label>
                          <input
                            type="text"
                            value={editConvenio}
                            onChange={(e) => setEditConvenio(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Tags (separadas por vírgula)</label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="VIP, Botox, Lipo..."
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Origem</label>
                          <input
                            type="text"
                            value={editOrigem}
                            onChange={(e) => setEditOrigem(e.target.value)}
                            placeholder="Instagram, Indicação..."
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Cor/Etnia</label>
                          <input
                            type="text"
                            value={editCor}
                            onChange={(e) => setEditCor(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contato e Endereço */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Contato & Localização</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Telefone</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">E-mail</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="paciente@email.com"
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Endereço Completo</label>
                        <textarea
                          value={editEndereco}
                          onChange={(e) => setEditEndereco(e.target.value)}
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-20`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Dados Pessoais</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <MiniDatePicker
                          label="Nascimento"
                          value={editBirthDate}
                          onChange={(val) => {
                            setEditBirthDate(val);
                            setEditIdade(calculateAge(val));
                          }}
                          isDarkMode={isDarkMode}
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Idade</label>
                          <input
                            type="number"
                            value={editIdade}
                            onChange={(e) => setEditIdade(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <MiniSelect
                          label="Sexo"
                          value={editSexo}
                          onChange={(val) => setEditSexo(val)}
                          options={['Feminino', 'Masculino', 'Outro']}
                          isDarkMode={isDarkMode}
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Estado Civil</label>
                          <input
                            type="text"
                            value={editEstadoCivil}
                            onChange={(e) => setEditEstadoCivil(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Profissão</label>
                        <input
                          type="text"
                          value={editProfissao}
                          onChange={(e) => setEditProfissao(e.target.value)}
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Anamnese */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Anamnese</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Gestante?', value: editGestante, setter: setEditGestante },
                        { label: 'Tabagista?', value: editTabagista, setter: setEditTabagista },
                        { label: 'Possui diabetes?', value: editDiabetes, setter: setEditDiabetes },
                        { label: 'Possui hipertensão?', value: editHipertensao, setter: setEditHipertensao },
                        { label: 'Utiliza marcapasso?', value: editMarcapasso, setter: setEditMarcapasso },
                        { label: 'Possui alterações hormonais ou na tireóide?', value: editHormonal, setter: setEditHormonal },
                        { label: 'Possui doença hepática?', value: editHepatica, setter: setEditHepatica },
                        { label: 'Utiliza filtro solar diariamente?', value: editFiltroSolar, setter: setEditFiltroSolar },
                        { label: 'Utiliza medicamentos contínuos?', value: editMedicamentos, setter: setEditMedicamentos },
                      ].map((q, idx) => (
                        <div key={idx}>
                          <MiniSelect label={q.label} value={q.value} onChange={(val) => q.setter(val)} options={["Sim", "Não"]} isDarkMode={isDarkMode} />
                        </div>
                      ))}
                    </div>
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

                </div>

                <button
                  onClick={handleSavePatient}
                  className={`w-full bg-gradient-to-r from-orange-400 to-orange-600 text-black font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(249,115,22,0.2)] mt-6 text-sm uppercase tracking-widest`}
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

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRecordTypeDropdownOpen(!isRecordTypeDropdownOpen)}
                      className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                    >
                      <span>{recordType}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isRecordTypeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isRecordTypeDropdownOpen && (
                      <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {['Evolução', 'Anamnese', 'Procedimento'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setRecordType(opt); setIsRecordTypeDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${recordType === opt
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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

const ClientesView = ({ patients, setPatients, appointments, columns, onGenerateReceituario, initialActivePatientId = null, isDarkMode = true }: any) => {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string | null>(initialActivePatientId);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClientesSubTab, setActiveClientesSubTab] = useState<'TODOS' | 'ANIVERSARIANTES' | 'FREQUENCIA'>('TODOS');
  const [birthdayMonth, setBirthdayMonth] = useState<number>(new Date().getMonth());
  const [birthdayYear, setBirthdayYear] = useState<number>(new Date().getFullYear());

  const activePatient = patients.find((p: any) => p.id === activePatientId) || null;
  const isCreating = isNewPatientModalOpen && !activePatientId;
  const currentPatient = activePatient || (isCreating ? { id: 'new', name: '', phone: '', email: '', notes: '', history: [] } : null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordType, setRecordType] = useState('Evolução');
  const [isRecordTypeDropdownOpen, setIsRecordTypeDropdownOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isRecordingIntent = useRef(false);
  const transcriptionRef = useRef(transcription);
  const baseTranscriptionRef = useRef(''); // Texto que já estava lá antes de começar a gravar

  React.useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [clientCPF, setClientCPF] = useState('');
  const [editTipo, setEditTipo] = useState('Particular');
  const [editTags, setEditTags] = useState('');
  const [editAtivo, setEditAtivo] = useState(true);
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editIdade, setEditIdade] = useState('');
  const [editSexo, setEditSexo] = useState('');
  const [editEstadoCivil, setEditEstadoCivil] = useState('');
  const [editProfissao, setEditProfissao] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editRG, setEditRG] = useState('');
  const [editCNPJ, setEditCNPJ] = useState('');
  const [editCor, setEditCor] = useState('');
  const [editOrigem, setEditOrigem] = useState('');
  const [editConvenio, setEditConvenio] = useState('');
  const [editGestante, setEditGestante] = useState('Não');
  const [editTabagista, setEditTabagista] = useState('Não');
  const [editDiabetes, setEditDiabetes] = useState('Não');
  const [editHipertensao, setEditHipertensao] = useState('Não');
  const [editMarcapasso, setEditMarcapasso] = useState('Não');
  const [editHormonal, setEditHormonal] = useState('Não');
  const [editHepatica, setEditHepatica] = useState('Não');
  const [editFiltroSolar, setEditFiltroSolar] = useState('Não');
  const [editMedicamentos, setEditMedicamentos] = useState('Não');

  const [isSaved, setIsSaved] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const batch = writeBatch(db);

        // 1. Deleta o paciente
        batch.delete(doc(db, 'clientes', itemToDelete));

        // 2. Remove o ID do paciente de todas as colunas do CRM
        if (columns && Array.isArray(columns)) {
          columns.forEach((col: any) => {
            if (col.cardIds && col.cardIds.includes(itemToDelete)) {
              batch.update(doc(db, 'crm_columns', col.id), {
                cardIds: arrayRemove(itemToDelete)
              });
            }
          });
        }

        await batch.commit();

        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar paciente:", error);
        alert("Erro ao excluir paciente. Tente novamente.");
      }
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const mapHeaderToField = (header: string): string | null => {
    const h = header.toLowerCase().trim();
    if (h.includes('nome') || h.includes('name') || h === 'paciente' || h === 'cliente') return 'name';
    if (h.includes('telefone') || h.includes('tel') || h.includes('celular') || h.includes('phone')) return 'phone';
    if (h.includes('email') || h.includes('e-mail')) return 'email';
    if (h.includes('cpf')) return 'cpf';
    if (h.includes('cnpj')) return 'cnpj';
    if (h.includes('rg')) return 'rg';
    if (h.includes('nascimento') || h.includes('birth')) return 'birthDate';
    if (h === 'idade' || h === 'age') return 'idade';
    if (h === 'tipo' || h === 'type') return 'tipo';
    if (h === 'tags' || h === 'etiquetas') return 'tags';
    if (h === 'ativo' || h === 'status' || h === 'active') return 'ativo';
    if (h.includes('sexo') || h.includes('gender')) return 'sexo';
    if (h.includes('civil')) return 'estadoCivil';
    if (h.includes('profissão') || h.includes('profissao') || h.includes('job') || h.includes('occupation')) return 'profissao';
    if (h.includes('endereço') || h.includes('endereco') || h.includes('address')) return 'endereco';
    if (h === 'cor' || h === 'etnia' || h === 'race') return 'cor';
    if (h === 'origem' || h === 'source') return 'origem';
    if (h === 'convênio' || h === 'convenio' || h.includes('insurance')) return 'convenio';
    if (h.includes('obs') || h.includes('nota') || h.includes('notes')) return 'notes';
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (data.length < 2) {
          alert("O arquivo parece estar vazio.");
          setIsImporting(false);
          return;
        }

        const headers = data[0];
        const rows = data.slice(1);
        const mappedData: any[] = [];

        rows.forEach(row => {
          const patient: any = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            history: [],
            ativo: true
          };

          headers.forEach((header, index) => {
            if (!header) return;
            const field = mapHeaderToField(header.toString());
            if (field) {
              let val = row[index];
              if (val !== undefined && val !== null) {
                // Normalização
                if (field === 'cpf' || field === 'cnpj') {
                  patient[field] = val.toString().replace(/\D/g, '');
                } else if (field === 'birthDate' && val instanceof Date) {
                  patient[field] = val.toISOString().split('T')[0];
                } else if (field === 'notes') {
                  patient[field] = encryptField(val.toString());
                } else if (field === 'ativo') {
                  const s = val.toString().toLowerCase();
                  patient[field] = s === 'true' || s === 'sim' || s === '1' || s === 'ativo';
                } else {
                  patient[field] = val.toString();
                }

                // Cálculo automático de idade se nasciemento for fornecido mas idade não
                if (field === 'birthDate' && !patient.idade) {
                  patient.idade = calculateAge(patient[field]);
                }
              }
            }
          });

          if (patient.name) {
            mappedData.push(patient);
          }
        });

        if (mappedData.length === 0) {
          alert("Nenhum dado válido encontrado para importação (o campo 'Nome' é obrigatório).");
          setIsImporting(false);
          return;
        }

        // Importação em lotes de 500 (limite Firestore)
        const batchSize = 500;
        const totalItems = mappedData.length;

        for (let i = 0; i < totalItems; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = mappedData.slice(i, i + batchSize);

          chunk.forEach(patient => {
            const docRef = doc(db, 'clientes', patient.id);
            batch.set(docRef, patient);
          });

          await batch.commit();
          const progress = Math.min(100, Math.round(((i + chunk.length) / totalItems) * 100));
          setImportProgress(progress);
        }

        logAuditEvent({
          userId: auth.currentUser?.uid || 'unknown',
          userEmail: auth.currentUser?.email || 'unknown',
          userName: auth.currentUser?.displayName || 'Usuário',
          action: 'IMPORTOU_CLIENTES',
          module: 'Clientes',
          details: `Importou ${mappedData.length} pacientes via arquivo.`
        });

        alert(`Sucesso! ${mappedData.length} pacientes importados.`);
      } catch (error) {
        console.error("Erro na importação:", error);
        alert("Erro ao processar o arquivo. Verifique o formato.");
      } finally {
        setIsImporting(false);
        setImportProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  React.useEffect(() => {
    if (currentPatient) {
      setEditName(currentPatient.name || '');
      setEditPhone(currentPatient.phone || '');
      setEditEmail(currentPatient.email || '');
      setEditNotes(currentPatient.notes || '');
      setClientCPF(currentPatient.cpf ? formatCPF(currentPatient.cpf) : '');
      setEditTipo(currentPatient.tipo || 'Particular');
      setEditTags(currentPatient.tags || '');
      setEditAtivo(currentPatient.ativo !== undefined ? currentPatient.ativo : true);
      setEditBirthDate(currentPatient.birthDate || '');
      setEditIdade(currentPatient.idade || '');
      setEditSexo(currentPatient.sexo || '');
      setEditEstadoCivil(currentPatient.estadoCivil || '');
      setEditProfissao(currentPatient.profissao || '');
      setEditEndereco(currentPatient.endereco || '');
      setEditRG(currentPatient.rg || '');
      setEditCNPJ(currentPatient.cnpj || '');
      setEditCor(currentPatient.cor || '');
      setEditOrigem(currentPatient.origem || '');
      setEditConvenio(currentPatient.convenio || '');
      setEditGestante(currentPatient.gestante || 'Não');
      setEditTabagista(currentPatient.tabagista || 'Não');
      setEditDiabetes(currentPatient.diabetes || 'Não');
      setEditHipertensao(currentPatient.hipertensao || 'Não');
      setEditMarcapasso(currentPatient.marcapasso || 'Não');
      setEditHormonal(currentPatient.hormonal || 'Não');
      setEditHepatica(currentPatient.hepatica || 'Não');
      setEditFiltroSolar(currentPatient.filtroSolar || 'Não');
      setEditMedicamentos(currentPatient.medicamentos || 'Não');
    }
  }, [currentPatient?.id]);

  const handleRecordAudio = () => {
    if (isRecording) {
      isRecordingIntent.current = false;
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    // Prioriza webkitSpeechRecognition para Edge/Chrome para garantir maior estabilidade
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta transcrição nativa.");

    baseTranscriptionRef.current = transcriptionRef.current; // Salva o ponto de partida

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true; // Feedback em tempo real
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      let completeSessionText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          completeSessionText += event.results[i][0].transcript + " ";
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      const base = baseTranscriptionRef.current ? baseTranscriptionRef.current.trim() + " " : "";
      const fullText = (base + completeSessionText + interimText).trim();

      setTranscription(fullText);
      transcriptionRef.current = fullText;
    };

    recognition.onerror = (event: any) => {
      const isEdge = /Edg/.test(navigator.userAgent);
      if (event.error === 'not-allowed') {
        alert("🚨 BLOQUEIO DE MICROFONE! Verifique as permissões no ícone de cadeado na barra de endereços.");
      } else if (event.error === 'network') {
        if (isEdge) {
          alert("🚨 MODO EDGE: O Edge detectou um erro de rede. Certifique-se de que o 'Reconhecimento de Fala Online' está ativado nas configurações do Windows (Privacidade > Fala) e que o Edge está atualizado (Ajuda > Sobre).");
        } else {
          alert("🚨 Erro de Rede: A transcrição nativa precisa de internet.");
        }
      }
      setIsRecording(false);
      isRecordingIntent.current = false;
    };

    recognition.onend = () => {
      if (isRecordingIntent.current) {
        try {
          // Maior delay para garantir liberação de hardware no Edge
          setTimeout(() => {
            if (isRecordingIntent.current) recognition.start();
          }, 200);
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    isRecordingIntent.current = true;
    setIsRecording(true);
    recognition.start();
  };

  const handleSaveRecord = async () => {
    if (!transcription.trim() || !currentPatient || isSavingPatient) return;
    setIsSavingPatient(true);

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      type: recordType,
      content: encryptField(transcription.trim())
    };

    let updatedPatient;
    if (isCreating) {
      updatedPatient = {
        ...currentPatient,
        id: Date.now().toString(),
        name: editName || 'Paciente Sem Nome',
        phone: editPhone,
        email: editEmail,
        notes: encryptField(editNotes),
        cpf: clientCPF.replace(/\D/g, ''),
        tipo: editTipo,
        tags: editTags,
        ativo: editAtivo,
        birthDate: editBirthDate,
        idade: editIdade,
        sexo: editSexo,
        estadoCivil: editEstadoCivil,
        profissao: editProfissao,
        endereco: editEndereco,
        rg: editRG,
        cnpj: editCNPJ.replace(/\D/g, ''),
        cor: editCor,
        origem: editOrigem,
        convenio: editConvenio,
        gestante: editGestante,
        tabagista: editTabagista,
        diabetes: editDiabetes,
        hipertensao: editHipertensao,
        marcapasso: editMarcapasso,
        hormonal: editHormonal,
        hepatica: editHepatica,
        filtroSolar: editFiltroSolar,
        medicamentos: editMedicamentos,
        history: [newRecord]
      };
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = {
        ...currentPatient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        notes: encryptField(editNotes),
        tipo: editTipo,
        tags: editTags,
        ativo: editAtivo,
        birthDate: editBirthDate,
        idade: editIdade,
        sexo: editSexo,
        estadoCivil: editEstadoCivil,
        profissao: editProfissao,
        endereco: editEndereco,
        rg: editRG,
        cnpj: editCNPJ.replace(/\D/g, ''),
        cor: editCor,
        origem: editOrigem,
        convenio: editConvenio,
        gestante: editGestante,
        tabagista: editTabagista,
        diabetes: editDiabetes,
        hipertensao: editHipertensao,
        marcapasso: editMarcapasso,
        hormonal: editHormonal,
        hepatica: editHepatica,
        filtroSolar: editFiltroSolar,
        medicamentos: editMedicamentos,

        history: [newRecord, ...(currentPatient.history || [])]
      };
    }

    try {
      const docRef = doc(db, 'clientes', updatedPatient.id);
      await setDoc(docRef, updatedPatient);
      logAuditEvent({
        userId: auth.currentUser?.uid || 'unknown',
        userEmail: auth.currentUser?.email || 'unknown',
        userName: auth.currentUser?.displayName || 'Usuário',
        action: 'SALVOU_REGISTRO_MEDICO',
        module: 'Clientes',
        details: `Salvou registro médico (${recordType}) para paciente ${editName}.`
      });
    } catch (error) {
      console.error("Erro ao salvar histórico do paciente:", error);
      alert("Erro ao salvar histórico. Tente novamente.");
    } finally {
      setIsSavingPatient(false);
    }

    setTranscription('');
  };

  const handleSavePatient = async () => {
    if (!currentPatient || isSavingPatient) return;
    setIsSavingPatient(true);

    const commonFields = {
      name: editName || 'Paciente Sem Nome',
      phone: editPhone,
      email: editEmail,
      notes: encryptField(editNotes),
      cpf: clientCPF.replace(/\D/g, ''),
      tipo: editTipo,
      tags: editTags,
      ativo: editAtivo,
      birthDate: editBirthDate,
      idade: editIdade,
      sexo: editSexo,
      estadoCivil: editEstadoCivil,
      profissao: editProfissao,
      endereco: editEndereco,
      rg: editRG,
      cnpj: editCNPJ.replace(/\D/g, ''),
      cor: editCor,
      origem: editOrigem,
      convenio: editConvenio,
      gestante: editGestante,
      tabagista: editTabagista,
      diabetes: editDiabetes,
      hipertensao: editHipertensao,
      marcapasso: editMarcapasso,
      hormonal: editHormonal,
      hepatica: editHepatica,
      filtroSolar: editFiltroSolar,
      medicamentos: editMedicamentos,
    };

    let updatedPatient;
    if (isCreating) {
      updatedPatient = { ...currentPatient, ...commonFields, id: Date.now().toString() };
      setIsNewPatientModalOpen(false);
      setActivePatientId(updatedPatient.id);
    } else {
      updatedPatient = { ...currentPatient, ...commonFields };
    }

    try {
      const docRef = doc(db, 'clientes', updatedPatient.id);
      await setDoc(docRef, updatedPatient);
      logAuditEvent({
        userId: auth.currentUser?.uid || 'unknown',
        userEmail: auth.currentUser?.email || 'unknown',
        userName: auth.currentUser?.displayName || 'Usuário',
        action: isCreating ? 'CRIOU_PACIENTE' : 'EDITOU_PACIENTE',
        module: 'Clientes',
        details: `${isCreating ? 'Cadastrou' : 'Editou'} paciente: ${editName}.`
      });
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      alert("Erro ao salvar paciente. Tente novamente.");
    } finally {
      setIsSavingPatient(false);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const filteredPatients = patients.filter((p: any) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const termDigits = term.replace(/\D/g, '');
    const cpfRaw = (p.cpf || '').replace(/\D/g, '');
    const cpfMatch = termDigits.length > 0 && cpfRaw.length > 0 && cpfRaw.includes(termDigits);
    const phoneRaw = (p.phone || '').replace(/\D/g, '');
    const phoneMatch = termDigits.length > 0 && phoneRaw.length > 0 && phoneRaw.includes(termDigits);
    return nameMatch || cpfMatch || phoneMatch;
  }).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  const displayedPatients = useMemo(() => {
    let list = [...filteredPatients];
    if (activeClientesSubTab === 'ANIVERSARIANTES') {
      const currentMonth = birthdayMonth;
      list = list.filter((p: any) => {
        const bdate = p.birthDate || p.editBirthDate;
        if (!bdate || typeof bdate !== 'string') return false;
        let month = -1;
        if (bdate.includes('-')) {
          month = parseInt(bdate.split('-')[1], 10) - 1;
        } else if (bdate.includes('/')) {
          month = parseInt(bdate.split('/')[1], 10) - 1;
        }
        return month === currentMonth;
      });
      // Sort by day of month
      list.sort((a: any, b: any) => {
        const getDay = (dateStr: any) => {
          if (!dateStr || typeof dateStr !== 'string') return 0;
          if (dateStr.includes('-')) return parseInt(dateStr.split('-')[2], 10);
          if (dateStr.includes('/')) return parseInt(dateStr.split('/')[0], 10);
          return 0;
        };
        const dayA = getDay(a.birthDate || a.editBirthDate);
        const dayB = getDay(b.birthDate || b.editBirthDate);
        return dayA - dayB;
      });
    } else if (activeClientesSubTab === 'FREQUENCIA') {
      list.sort((a: any, b: any) => {
        const countA = a.history?.length || 0;
        const countB = b.history?.length || 0;
        return countB - countA;
      });
    }
    return list;
  }, [filteredPatients, activeClientesSubTab, birthdayMonth]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background */}


      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-orange-500" size={32} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} tracking-tight`}>Base de Pacientes <span className="text-zinc-500 text-xl ml-2">{patients.length}</span></h1>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Prontuários criptografados • LGPD Compliant</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input
                type="text"
                placeholder="Buscar por Nome, CPF ou Tel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-64 md:w-80 pl-11 pr-4 py-2.5 text-sm rounded-full border focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all ${isDarkMode
                  ? 'bg-[#121214] border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                  }`}
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className={`bg-[#121214] border border-zinc-800 text-zinc-300 font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all hover:bg-zinc-800/80 disabled:opacity-50`}
            >
              {isImporting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-orange-500" />
                  <span>Importando {importProgress}%</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="text-orange-500" />
                  <span>Importar</span>
                </>
              )}
            </button>

            <button
              onClick={() => { setIsNewPatientModalOpen(true); setActivePatientId(null); }}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Plus size={18} />
              Novo Paciente
            </button>
          </div>
        </div>
        {/* Sub-tabs Link Bar */}
        <div className={`flex items-center gap-6 border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
          {[
            { id: 'TODOS', label: 'Todos os Clientes', icon: Users },
            { id: 'ANIVERSARIANTES', label: 'Aniversariantes', icon: Gift },
            { id: 'FREQUENCIA', label: 'Frequência', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveClientesSubTab(tab.id as 'TODOS' | 'ANIVERSARIANTES' | 'FREQUENCIA')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeClientesSubTab === tab.id ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Patient List OR Dashboard */}
      {activeClientesSubTab === 'FREQUENCIA' ? (
        <FrequenciaDashboard patients={patients} appointments={appointments} isDarkMode={isDarkMode} />
      ) : (
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">

        {/* Month Navigator for Aniversariantes */}
        {activeClientesSubTab === 'ANIVERSARIANTES' && (() => {
          const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
          const prevMonth = () => {
            if (birthdayMonth === 0) { setBirthdayMonth(11); setBirthdayYear(y => y - 1); }
            else setBirthdayMonth(m => m - 1);
          };
          const nextMonth = () => {
            if (birthdayMonth === 11) { setBirthdayMonth(0); setBirthdayYear(y => y + 1); }
            else setBirthdayMonth(m => m + 1);
          };
          return (
            <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800/80' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center gap-2">
                <Gift className="text-orange-500" size={16} />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Período de Aniversário</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-orange-500/20 text-zinc-400 hover:text-orange-500 flex items-center justify-center transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <span className={`text-sm font-bold min-w-[160px] text-center ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {monthNames[birthdayMonth]} {birthdayYear}
                </span>
                <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-orange-500/20 text-zinc-400 hover:text-orange-500 flex items-center justify-center transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold text-orange-500`}>{displayedPatients.length}</span>
                <span className="text-xs text-zinc-500">aniversariantes</span>
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPatients.map((patient: any) => (
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
                <button
                  onClick={(e) => handleDeleteRequest(patient.id, e)}
                  title="Excluir Paciente"
                  className={`text-zinc-500 hover:text-red-500 transition-colors cursor-pointer relative z-10`}
                >
                  <Trash2 size={18} />
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
      )}

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
            <div className={`w-96 bg-[#050505] border-r ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} p-8 flex flex-col overflow-y-auto custom-scrollbar`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8`}>Dados Cadastrais</h3>

              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center ${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-4xl shadow-[0_0_30px_rgba(249,115,22,0.3)]`}>
                  {editName ? editName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${editAtivo ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`} />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{editAtivo ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <Toggle checked={editAtivo} onChange={setEditAtivo} disabled={false} isDarkMode={isDarkMode} />
                </div>

                <div className="space-y-5">
                  {/* Identificação */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Identificação</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Nome</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">CPF</label>
                          <input
                            placeholder="000.000.000-00"
                            value={clientCPF}
                            onChange={(e) => setClientCPF(formatCPF(e.target.value))}
                            className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">RG</label>
                          <input
                            type="text"
                            value={editRG}
                            onChange={(e) => setEditRG(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">CNPJ</label>
                        <input
                          placeholder="00.000.000/0000-00"
                          value={editCNPJ}
                          onChange={(e) => setEditCNPJ(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Perfil & Origem */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Perfil & Origem</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <MiniSelect
                            label="Tipo"
                            value={editTipo}
                            onChange={(val) => setEditTipo(val)}
                            options={['Particular', 'Convênio', 'Cortesia']}
                            isDarkMode={isDarkMode}
                          />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Convênio</label>
                          <input
                            type="text"
                            value={editConvenio}
                            onChange={(e) => setEditConvenio(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Tags</label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="VIP, Botox, Lipo..."
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Origem</label>
                          <input
                            type="text"
                            value={editOrigem}
                            onChange={(e) => setEditOrigem(e.target.value)}
                            placeholder="Instagram, Indicação..."
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Cor/Etnia</label>
                          <input
                            type="text"
                            value={editCor}
                            onChange={(e) => setEditCor(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Contato</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Telefone</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">E-mail</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          placeholder="paciente@email.com"
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Dados Pessoais</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <MiniDatePicker
                          label="Nascimento"
                          value={editBirthDate}
                          onChange={(val) => {
                            setEditBirthDate(val);
                            setEditIdade(calculateAge(val));
                          }}
                          isDarkMode={isDarkMode}
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Idade</label>
                          <input
                            type="number"
                            value={editIdade}
                            onChange={(e) => setEditIdade(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <MiniSelect
                          label="Sexo"
                          value={editSexo}
                          onChange={(val) => setEditSexo(val)}
                          options={['Feminino', 'Masculino', 'Outro']}
                          isDarkMode={isDarkMode}
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Estado Civil</label>
                          <input
                            type="text"
                            value={editEstadoCivil}
                            onChange={(e) => setEditEstadoCivil(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Profissão</label>
                        <input
                          type="text"
                          value={editProfissao}
                          onChange={(e) => setEditProfissao(e.target.value)}
                          className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Localização</h4>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase">Endereço Completo</label>
                      <textarea
                        value={editEndereco}
                        onChange={(e) => setEditEndereco(e.target.value)}
                        className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 ${isDarkMode ? "text-white" : "text-zinc-900"} focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none h-20`}
                      />
                    </div>
                  </div>

                  {/* Anamnese */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-orange-500/70 tracking-[0.2em] uppercase">Anamnese</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Gestante?', value: editGestante, setter: setEditGestante },
                        { label: 'Tabagista?', value: editTabagista, setter: setEditTabagista },
                        { label: 'Possui diabetes?', value: editDiabetes, setter: setEditDiabetes },
                        { label: 'Possui hipertensão?', value: editHipertensao, setter: setEditHipertensao },
                        { label: 'Utiliza marcapasso?', value: editMarcapasso, setter: setEditMarcapasso },
                        { label: 'Possui alterações hormonais ou na tireóide?', value: editHormonal, setter: setEditHormonal },
                        { label: 'Possui doença hepática?', value: editHepatica, setter: setEditHepatica },
                        { label: 'Utiliza filtro solar diariamente?', value: editFiltroSolar, setter: setEditFiltroSolar },
                        { label: 'Utiliza medicamentos contínuos?', value: editMedicamentos, setter: setEditMedicamentos },
                      ].map((q, idx) => (
                        <div key={idx}>
                          <MiniSelect label={q.label} value={q.value} onChange={(val) => q.setter(val)} options={["Sim", "Não"]} isDarkMode={isDarkMode} />
                        </div>
                      ))}
                    </div>
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

                </div>

                <button
                  onClick={handleSavePatient}
                  disabled={isSaved || isSavingPatient}
                  className={`w-full ${isSaved
                    ? "bg-green-500/20 text-green-500 border-green-500/30 font-bold"
                    : `bg-gradient-to-r from-orange-400 to-orange-600 text-black font-bold shadow-[0_0_20px_rgba(249,115,22,0.2)]`
                    } border-none py-4 rounded-2xl transition-all duration-300 mt-4 text-sm uppercase tracking-widest ${isSavingPatient ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSavingPatient ? "Salvando..." : (isSaved ? "Salvo com sucesso ✓" : "Salvar Cadastro")}
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

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRecordTypeDropdownOpen(!isRecordTypeDropdownOpen)}
                      className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                    >
                      <span>{recordType}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isRecordTypeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isRecordTypeDropdownOpen && (
                      <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {['Evolução', 'Anamnese', 'Procedimento'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setRecordType(opt); setIsRecordTypeDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${recordType === opt
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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
                    disabled={!transcription.trim() || isSavingPatient}
                    className={`font-semibold px-6 py-2 rounded-xl transition-all text-sm ${transcription.trim() && !isSavingPatient
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                  >
                    {isSavingPatient ? "Salvando..." : "Salvar Prontuário"}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-[#18181b] border-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "bg-white border-zinc-200 shadow-2xl"} rounded-3xl w-full max-w-sm border overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-100"}`}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Excluir Paciente</h3>
              <p className={`text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Tem certeza que deseja excluir? Esta ação é permanente e removerá todo o histórico clínico.
              </p>
            </div>
            <div className={`p-4 gap-3 flex flex-col md:flex-row justify-end ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}>
              <button
                onClick={cancelDelete}
                className={`w-full md:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Excluir
              </button>
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
  const [isSavingProf, setIsSavingProf] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [color, setColor] = useState('#f97316');
  const [docType, setDocType] = useState('CRM');
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [docNumber, setDocNumber] = useState('');
  const [docUF, setDocUF] = useState('');
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [rqeNumero, setRqeNumero] = useState("");
  const [rqeUf, setRqeUf] = useState("");

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
      setTelefone(prof.phone || "");
      setEmail(prof.email || "");
      setRqeNumero(prof.rqe?.numero || "");
      setRqeUf(prof.rqe?.uf || "");
    } else {
      setEditingId(null);
      setName('');
      setSpecialty('');
      setColor('#f97316');
      setTempColor('#f97316');
      setDocType('CRM');
      setDocNumber('');
      setDocUF('');
      setTelefone("");
      setEmail("");
      setRqeNumero("");
      setRqeUf("");
    }
    setIsModalOpen(true);
    setShowColorPicker(false);
  };

  const handleSave = async () => {
    if (!name.trim() || isSavingProf) return;
    setIsSavingProf(true);

    try {
      const idToSave = editingId || Date.now().toString();
      const profData = {
        id: idToSave,
        name,
        specialty,
        color,
        phone: telefone,
        email,
        rqe: { numero: rqeNumero, uf: rqeUf },
        active: true,
        doc: { type: docType, number: docNumber, uf: docUF }
      };

      await setDoc(doc(db, 'profissionais', idToSave), profData);
      logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: editingId ? 'EDITOU_PROFISSIONAL' : 'CRIOU_PROFISSIONAL', module: 'Profissionais', details: `${editingId ? 'Editou' : 'Cadastrou'} profissional: ${name}.` });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      alert("Houve um erro ao salvar o profissional.");
    } finally {
      setIsSavingProf(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, 'profissionais', itemToDelete));
      } catch (error) {
        console.error("Erro ao excluir profissional:", error);
        alert("Houve um erro ao excluir o profissional.");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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
                  <button onClick={() => handleDeleteRequest(prof.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
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
          <div className={`${isDarkMode ? "bg-[#0a0a0a] border-orange-900/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "bg-white border-[var(--border-default)] shadow-2xl"} border rounded-3xl w-full max-w-md p-8 relative max-h-[90vh] flex flex-col`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 text-zinc-500 hover:${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors z-10`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-8 shrink-0`}>Cadastrar Profissional</h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">NOME COMPLETO</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5 relative">
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1">DOCUMENTO</label>
                    {(() => {
                      const docOptions = ['CRM', 'CRO', 'COREN', 'CRBM', 'Outros'];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#050505] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                          >
                            <span>{docType}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isDocDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isDocDropdownOpen && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {docOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => { setDocType(opt); setIsDocDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${docType === opt
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
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

              {/* BLOCO DE RQE */}
              <div className="mt-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Número do RQE (Opcional)</label>
                    <input
                      type="text"
                      value={rqeNumero}
                      onChange={(e) => setRqeNumero(e.target.value)}
                      placeholder="00000"
                      className="bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-orange-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">UF do RQE</label>
                    <input
                      type="text"
                      value={rqeUf}
                      onChange={(e) => setRqeUf(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      placeholder="SP"
                      maxLength={2}
                      className="bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-orange-500 outline-none text-sm transition-all uppercase text-center"
                    />
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

              {/* BLOCO DE CONTATO (RECEITUÁRIO) */}
              <div className="mt-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Telefone / Celular</label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-orange-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">E-mail Profissional</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dr@clinica.com"
                      className="bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:border-orange-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
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
                  <div className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-zinc-200 w-64">
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
                  disabled={isSavingProf}
                  className={`flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] ${isSavingProf ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSavingProf ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-[#18181b] border-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "bg-white border-zinc-200 shadow-2xl"} rounded-3xl w-full max-w-sm border overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-100"}`}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Excluir Profissional</h3>
              <p className={`text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Tem certeza que deseja excluir? Esta ação é permanente.
              </p>
            </div>
            <div className={`p-4 gap-3 flex flex-col md:flex-row justify-end ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}>
              <button
                onClick={cancelDelete}
                className={`w-full md:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Excluir
              </button>
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Dados do Serviço');
  const [filterCategory, setFilterCategory] = useState('Todos');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Outros');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const [commission, setCommission] = useState('');
  const [transactionFee, setTransactionFee] = useState('');
  const [description, setDescription] = useState('');
  const [serviceItems, setServiceItems] = useState<{ id: string, itemId: string, quantity: number }[]>([]);
  const [openInsumoId, setOpenInsumoId] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      const idToSave = editingId || Date.now().toString();
      const newService = {
        id: idToSave,
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

      await setDoc(doc(db, 'servicos', idToSave), newService);
      logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: editingId ? 'EDITOU_SERVICO' : 'CRIOU_SERVICO', module: 'Serviços', details: `${editingId ? 'Editou' : 'Cadastrou'} serviço: ${name}.` });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Houve um erro ao salvar o serviço.");
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, 'servicos', itemToDelete));
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        alert("Houve um erro ao excluir o serviço.");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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
                    <button onClick={() => handleDeleteRequest(service.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
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
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                      {(() => {
                        const catOptions = categories.filter(c => c !== 'Todos');
                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                              className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#050505] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm`}
                            >
                              <span>{category}</span>
                              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCatDropdownOpen && (
                              <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                                {catOptions.map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => { setCategory(cat); setIsCatDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${category === cat
                                      ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                      : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                      }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
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
                            <div className="relative flex-1">
                              <button
                                type="button"
                                onClick={() => setOpenInsumoId(openInsumoId === item.id ? null : item.id)}
                                className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                              >
                                <span className={item.itemId ? '' : 'text-zinc-500'}>
                                  {item.itemId
                                    ? (() => { const inv = inventory.find((i: any) => i.id === item.itemId); return inv ? `${inv.name} - ${formatCurrency(inv.price)}` : 'Buscar no estoque...'; })()
                                    : 'Buscar no estoque...'}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openInsumoId === item.id ? 'rotate-180' : ''}`} />
                              </button>
                              {openInsumoId === item.id && (
                                <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                                  <div className={`px-4 py-2 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>Buscar no estoque...</div>
                                  {inventory.map((inv: any) => (
                                    <button
                                      key={inv.id}
                                      type="button"
                                      onClick={() => { handleItemChange(item.id, 'itemId', inv.id); setOpenInsumoId(null); }}
                                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${item.itemId === inv.id
                                        ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                        : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                        }`}
                                    >
                                      {inv.name} - {formatCurrency(inv.price)}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-[#18181b] border-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "bg-white border-zinc-200 shadow-2xl"} rounded-3xl w-full max-w-sm border overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-100"}`}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Excluir Serviço</h3>
              <p className={`text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Tem certeza que deseja excluir? Esta ação removerá o serviço do catálogo e não pode ser desfeita.
              </p>
            </div>
            <div className={`p-4 gap-3 flex flex-col md:flex-row justify-end ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}>
              <button
                onClick={cancelDelete}
                className={`w-full md:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Excluir
              </button>
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Insumos');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
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

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      const idToSave = editingId || Date.now().toString();
      const newItem = {
        id: idToSave,
        name,
        category,
        price: parseFloat(price) || 0,
        salePrice: parseFloat(salePrice) || 0,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
      };

      await setDoc(doc(db, 'estoque', idToSave), newItem);
      logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: editingId ? 'EDITOU_PRODUTO' : 'CRIOU_PRODUTO', module: 'Estoque', details: `${editingId ? 'Editou' : 'Cadastrou'} produto: ${name}.` });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto no estoque:", error);
      alert("Houve um erro ao salvar o item.");
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, 'estoque', itemToDelete));
      } catch (error) {
        console.error("Erro ao excluir produto do estoque:", error);
        alert("Houve um erro ao excluir o item.");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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
                          <button onClick={() => handleDeleteRequest(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
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

              <div className="relative">
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                {(() => {
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                        className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#050505] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm`}
                      >
                        <span>{category}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCatDropdownOpen && (
                        <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => { setCategory(cat); setIsCatDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${category === cat
                                ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-[#18181b] border-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "bg-white border-zinc-200 shadow-2xl"} rounded-3xl w-full max-w-sm border overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-100"}`}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Excluir Produto</h3>
              <p className={`text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Tem certeza que deseja excluir? Esta ação é permanente e removerá o item do controle.
              </p>
            </div>
            <div className={`p-4 gap-3 flex flex-col md:flex-row justify-end ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}>
              <button
                onClick={cancelDelete}
                className={`w-full md:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const CustomDatePicker = ({
  selectedDate,
  onChange,
  isDarkMode
}: {
  selectedDate: string,
  onChange: (date: string) => void,
  isDarkMode: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleSelectDate = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'dd/mm/aaaa';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#050505] border-zinc-800 text-white' : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm whitespace-nowrap overflow-hidden text-ellipsis`}
      >
        <span className={!selectedDate ? (isDarkMode ? 'text-zinc-600' : 'text-zinc-400') : 'truncate'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <Calendar size={16} className="text-zinc-500 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className={`absolute z-50 top-full left-0 mt-2 p-4 rounded-2xl border shadow-2xl w-72 ${isDarkMode ? 'bg-[#0f0f11] border-zinc-800' : 'bg-white border-[var(--border-default)]'}`}>
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
              <ChevronLeft size={16} />
            </button>
            <span className={`text-sm font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button type="button" onClick={handleNextMonth} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDaysShort.map((day, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-zinc-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate &&
                new Date(selectedDate + 'T12:00:00').getDate() === day &&
                new Date(selectedDate + 'T12:00:00').getMonth() === viewDate.getMonth() &&
                new Date(selectedDate + 'T12:00:00').getFullYear() === viewDate.getFullYear();

              const isToday = day === new Date().getDate() &&
                viewDate.getMonth() === new Date().getMonth() &&
                viewDate.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${isSelected ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : ''}
                    ${!isSelected && isToday ? (isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900') : ''}
                    ${!isSelected && !isToday ? (isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100') : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FinanceiroView = ({ expenses, setExpenses, isDarkMode = true }: any) => {
  const [activeTab, setActiveTab] = useState('Fluxo de Caixa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Outros');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [recurrence, setRecurrence] = useState('Não');

  const currentYearStr = new Date().getFullYear().toString();
  const [viewPeriod, setViewPeriod] = useState('Mensal');
  const [viewYear, setViewYear] = useState(currentYearStr);
  const [isViewYearDropdownOpen, setIsViewYearDropdownOpen] = useState(false);
  const [viewRange, setViewRange] = useState(new Date().getMonth()); // For mensals (0-11), Trimestrais (0-3), Semestrais (0-1)
  const [isViewRangeDropdownOpen, setIsViewRangeDropdownOpen] = useState(false);

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

  const handleSave = async () => {
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

    try {
      await setDoc(doc(db, 'financeiro', newExpense.id), newExpense);
      logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: 'CRIOU_DESPESA', module: 'Financeiro', details: `Criou despesa: ${description} - R$ ${value}.` });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    }
  };

  const handleDeleteExpense = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, 'financeiro', itemToDelete));
        logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: 'EXCLUIU_DESPESA', module: 'Financeiro', details: `Excluiu transação financeira ID: ${itemToDelete}.` });
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'Pendente' ? 'Pago' : 'Pendente';
    try {
      await setDoc(doc(db, 'financeiro', item.id), { ...item, status: newStatus });
      logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Usuário', action: 'ALTEROU_STATUS_FINANCEIRO', module: 'Financeiro', details: `Alterou status de "${item.description}" para ${newStatus}.` });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const dataAtual = new Date();
  const mesAtualHoje = dataAtual.getMonth();
  const anoAtualHoje = dataAtual.getFullYear();
  const diaAtualHoje = dataAtual.getDate();
  const numViewYear = parseInt(viewYear);

  let periodStartMonth = 0;
  let periodEndMonth = 11;
  let isDailyView = false;

  // Logic to determine range of months or days
  if (viewPeriod === 'Mensal') {
    periodStartMonth = viewRange;
    periodEndMonth = viewRange;
    isDailyView = true;
  } else if (viewPeriod === 'Trimestral') {
    periodStartMonth = viewRange * 3;
    periodEndMonth = periodStartMonth + 2;
  } else if (viewPeriod === 'Semestral') {
    periodStartMonth = viewRange * 6;
    periodEndMonth = periodStartMonth + 5;
  }

  // Calculate generic historical Revenue/Expense for average (Always look to the past 12 months)
  let past12MAcumReceita = 0;
  expenses.forEach((exp: any) => {
    if (exp.type === 'Receita') past12MAcumReceita += exp.value;
  });
  // Simplified average for projection
  const avgReceitaMensal = past12MAcumReceita > 0 ? (past12MAcumReceita / 12) : 0;
  const avgReceitaDiaria = past12MAcumReceita > 0 ? (past12MAcumReceita / 365) : 0;

  // Aggregate Data for the View
  let totalReceitaView = 0;
  let totalDespesaView = 0;
  let totalPendenteView = 0;
  let pendentesLengthView = 0;
  const chartData = [];
  let projecaoFimView = 0;

  if (isDailyView) {
    // === MENSAL LOGIC (Eixo X = Dias) ===
    const diasNoMes = new Date(numViewYear, periodStartMonth + 1, 0).getDate();
    const isCurrentMonth = numViewYear === anoAtualHoje && periodStartMonth === mesAtualHoje;
    const isPastMonth = numViewYear < anoAtualHoje || (numViewYear === anoAtualHoje && periodStartMonth < mesAtualHoje);

    const transacoesPorDia: Record<number, { receita: number, despesa: number }> = {};
    for (let i = 1; i <= diasNoMes; i++) transacoesPorDia[i] = { receita: 0, despesa: 0 };

    expenses.forEach((exp: any) => {
      const [yearStr, monthStr, dayStr] = (exp.dueDate || '').split('-');
      if (yearStr && parseInt(yearStr) === numViewYear) {
        if (parseInt(monthStr) - 1 === periodStartMonth) {
          const day = parseInt(dayStr);
          const isReceita = exp.type === 'Receita';
          const isDespesa = exp.type === 'Despesa' || !isReceita;

          if (isReceita) {
            totalReceitaView += exp.value;
            transacoesPorDia[day].receita += exp.value;
          } else {
            totalDespesaView += exp.value;
            transacoesPorDia[day].despesa += exp.value;
          }

          if (exp.status === 'Pendente' && isDespesa) {
            totalPendenteView += exp.value;
            pendentesLengthView++;
          }
        }
      }
    });

    const currDay = isCurrentMonth ? diaAtualHoje : (isPastMonth ? diasNoMes : 0);
    const taxaDiariaReal = isCurrentMonth && diaAtualHoje > 0 ? (totalReceitaView / diaAtualHoje) : avgReceitaDiaria;
    projecaoFimView = totalReceitaView + (isPastMonth ? 0 : (taxaDiariaReal * (diasNoMes - currDay)));

    let acumuladoReceita = 0;

    for (let i = 1; i <= diasNoMes; i++) {
      acumuladoReceita += transacoesPorDia[i].receita;
      if (isPastMonth) {
        chartData.push({ axis: String(i).padStart(2, '0'), Realizado: acumuladoReceita, Projetado: acumuladoReceita });
      } else if (isCurrentMonth) {
        if (i <= currDay) {
          chartData.push({ axis: String(i).padStart(2, '0'), Realizado: acumuladoReceita, Projetado: acumuladoReceita });
        } else {
          const prevProj = chartData[i - 2].Projetado;
          chartData.push({ axis: String(i).padStart(2, '0'), Projetado: prevProj + taxaDiariaReal });
        }
      } else {
        // Future month completely
        const projectedValue = (i * avgReceitaDiaria);
        chartData.push({ axis: String(i).padStart(2, '0'), Projetado: projectedValue });
      }
    }

  } else {
    // === MACRO LOGIC (Trimestral, Semestral, Anual - Eixo X = Meses) ===
    const namesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const transacoesPorMes: Record<number, { receita: number, despesa: number }> = {};
    for (let m = periodStartMonth; m <= periodEndMonth; m++) transacoesPorMes[m] = { receita: 0, despesa: 0 };

    expenses.forEach((exp: any) => {
      const [yearStr, monthStr] = (exp.dueDate || '').split('-');
      if (yearStr && parseInt(yearStr) === numViewYear) {
        const month = parseInt(monthStr) - 1;
        if (month >= periodStartMonth && month <= periodEndMonth) {
          const isReceita = exp.type === 'Receita';
          const isDespesa = exp.type === 'Despesa' || !isReceita;

          if (isReceita) {
            totalReceitaView += exp.value;
            transacoesPorMes[month].receita += exp.value;
          } else {
            totalDespesaView += exp.value;
            transacoesPorMes[month].despesa += exp.value;
          }

          if (exp.status === 'Pendente' && isDespesa) {
            totalPendenteView += exp.value;
            pendentesLengthView++;
          }
        }
      }
    });

    let acumuladoReceita = 0;
    let projGeralAnterior = 0;

    for (let m = periodStartMonth; m <= periodEndMonth; m++) {
      const isPastMonth = numViewYear < anoAtualHoje || (numViewYear === anoAtualHoje && m < mesAtualHoje);
      const isCurrentMonth = numViewYear === anoAtualHoje && m === mesAtualHoje;

      acumuladoReceita += transacoesPorMes[m].receita;

      if (isPastMonth) {
        chartData.push({ axis: namesMeses[m], Realizado: acumuladoReceita, Projetado: acumuladoReceita });
        projGeralAnterior = acumuladoReceita;
      } else if (isCurrentMonth) {
        // Current month blends realized till today + projected till end of month
        const diasNoMes = new Date(numViewYear, m + 1, 0).getDate();
        const taxaDiariaReal = diaAtualHoje > 0 ? (transacoesPorMes[m].receita / diaAtualHoje) : avgReceitaDiaria;
        const projMesCorrente = acumuladoReceita + (taxaDiariaReal * (diasNoMes - diaAtualHoje));

        chartData.push({ axis: namesMeses[m], Realizado: acumuladoReceita, Projetado: projMesCorrente });
        projGeralAnterior = projMesCorrente;
      } else {
        // Future month
        projGeralAnterior += avgReceitaMensal;
        chartData.push({ axis: namesMeses[m], Projetado: projGeralAnterior });
      }
    }
    projecaoFimView = projGeralAnterior;
  }

  const saldoLiquido = totalReceitaView - totalDespesaView;
  const margem = totalReceitaView > 0 ? ((saldoLiquido / totalReceitaView) * 100).toFixed(1) : '0.0';



  const filteredExpenses = expenses.filter((exp: any) => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) || exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = transactionFilter === 'Todos' ||
      (transactionFilter === 'Despesas' && exp.type === 'Despesa') ||
      (transactionFilter === 'Pendentes' && exp.status === 'Pendente') ||
      (transactionFilter === 'Receitas' && exp.type === 'Receita');
    return matchesSearch && matchesFilter;
  });

  const handleExportExcel = () => {
    if (filteredExpenses.length === 0) {
      alert('Nenhum dado para exportar com os filtros atuais.');
      return;
    }

    const dataToExport = filteredExpenses.map((exp: any) => ({
      ID: exp.id,
      Descrição: exp.description || '',
      Categoria: exp.category || '',
      Tipo: exp.type || '',
      Quantidade: exp.quantity || 1,
      Valor: exp.value || 0,
      Vencimento: exp.dueDate || '',
      Status: exp.status || '',
      Recorrência: exp.recurrence || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumo Financeiro');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'relatorio_financeiro.xlsx');
  };
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
            <button
              onClick={handleExportExcel}
              className={`bg-transparent border ${isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-white" : "border-[var(--border-default)] hover:bg-zinc-100 text-zinc-900"} font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors`}
            >
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
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Receita no {viewPeriod}</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{formatCurrency(totalReceitaView)}</h3>
                  <p className="text-zinc-500 text-xs font-medium">Acumulado no período</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Despesas no {viewPeriod}</span>
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <TrendingDown size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{formatCurrency(totalDespesaView)}</h3>
                  <p className="text-zinc-500 text-xs font-medium">Total de saídas</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Saldo Líquido</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${saldoLiquido >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    <DollarSign size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold mb-1 ${saldoLiquido >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(saldoLiquido)}</h3>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Margem Atual</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <PieChart size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{margem}%</h3>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shrink-0 shadow-[var(--card-shadow)]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Acumulado: Histórico e Projeção</h3>
                  {/* YEAR SELECTOR */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsViewYearDropdownOpen(!isViewYearDropdownOpen);
                        setIsViewRangeDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                        ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                    >
                      <span>{viewYear}</span>
                    </button>
                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewYearDropdownOpen ? 'rotate-180' : ''}`} />

                    {isViewYearDropdownOpen && (
                      <div className={`absolute z-50 top-full mt-1 w-full min-w-[100px] rounded-xl border shadow-2xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {Array.from({ length: 21 }, (_, i) => (parseInt(currentYearStr) - 10 + i).toString()).map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => { setViewYear(yr); setIsViewYearDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewYear === yr
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RANGE SELECTOR */}
                  {viewPeriod !== 'Anual' && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewRangeDropdownOpen(!isViewRangeDropdownOpen);
                          setIsViewYearDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                          ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                      >
                        <span>
                          {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][viewRange]}
                          {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'][viewRange]}
                          {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'][viewRange]}
                        </span>
                      </button>
                      <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewRangeDropdownOpen ? 'rotate-180' : ''}`} />

                      {isViewRangeDropdownOpen && (
                        <div className={`absolute z-50 top-full mt-1 min-w-[150px] rounded-xl border shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                          {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                              {m}
                            </button>
                          ))}
                          {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'].map((m, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                              {m}
                            </button>
                          ))}
                          {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'].map((m, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="segmented-control">
                  {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setViewPeriod(p);
                        // Reset range to sensible defaults when switching periods
                        if (p === 'Mensal') setViewRange(new Date().getMonth());
                        else if (p === 'Trimestral') setViewRange(Math.floor(new Date().getMonth() / 3));
                        else if (p === 'Semestral') setViewRange(Math.floor(new Date().getMonth() / 6));
                      }}
                      className={`segmented-control-item ${viewPeriod === p ? 'active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProjetado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#e4e4e7'} vertical={false} />
                    <XAxis
                      dataKey="axis"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      tickFormatter={(value) => `R$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: isDarkMode ? '#18181b' : '#ffffff', borderColor: isDarkMode ? '#27272a' : '#e4e4e7', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                      labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px' }}
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => isDailyView ? `Dia ${label}` : label}
                    />
                    <Area
                      type="monotone"
                      dataKey="Projetado"
                      stroke="#8b5cf6"
                      strokeDasharray="5 5"
                      fillOpacity={1}
                      fill="url(#colorProjetado)"
                      name="Projeção"
                    />
                    <Area
                      type="monotone"
                      dataKey="Realizado"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRealizado)"
                      name="Faturado Real"
                    />
                    {isDailyView && numViewYear === anoAtualHoje && periodStartMonth === mesAtualHoje && (
                      <ReferenceLine x={diaAtualHoje.toString().padStart(2, '0')} stroke={isDarkMode ? '#52525b' : '#a1a1aa'} strokeDasharray="3 3" label={{ position: 'top', value: 'Hoje', fill: '#71717a', fontSize: 10 }} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Desempenho no Período</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${projecaoFimView > totalDespesaView ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                    {projecaoFimView > totalDespesaView ? 'Positivo' : 'Atenção'}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Total Faturado</span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{formatCurrency(totalReceitaView)}</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Média (12m)</span>
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{isDailyView ? `${formatCurrency(avgReceitaDiaria)}/dia` : `${formatCurrency(avgReceitaMensal)}/mês`}</span>
                  </div>
                  <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} pb-4`}>
                    <span className="text-sm text-zinc-400">Despesas aplicadas</span>
                    <span className={`text-sm font-bold text-red-500`}>{formatCurrency(totalDespesaView)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Projeção Fechamento</span>
                    <span className="text-[16px] font-black text-emerald-500">{formatCurrency(projecaoFimView)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Pendente</span>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Clock size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-yellow-500 mb-1">{formatCurrency(totalPendenteView)}</h3>
                  <p className="text-zinc-500 text-xs">{pendentesLengthView} despesa(s) p/ este período</p>
                </div>
              </div>

              <div className={`lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col shadow-[var(--card-shadow)]`}>
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
                      <th className="p-4 text-right">Valor</th>
                      <th className="p-4 pr-6 text-right w-24">Ações</th>
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
                        <td className="p-4 text-right text-red-500 font-mono text-sm">-{formatCurrency(item.value)}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleToggleStatus(item)} className="p-1.5 rounded-lg bg-zinc-500/10 text-zinc-500 hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors" title="Alternar Status"><CheckCircle2 size={16} /></button>
                            <button onClick={() => handleDeleteExpense(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Excluir"><Trash2 size={16} /></button>
                          </div>
                        </td>
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
                  <h3 className="text-3xl font-bold text-yellow-500 mb-1">{formatCurrency(totalPendenteView)}</h3>
                  <p className="text-zinc-500 text-xs">{pendentesLengthView} despesa(s) a pagar neste período</p>
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
                      <th className="p-4 text-right">Status</th>
                      <th className="p-4 pr-6 text-right w-24">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? filteredExpenses.map((item: any) => (
                      <tr key={item.id} className={`border-b ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} hover:bg-zinc-900/30 transition-colors`}>
                        <td className={`p-4 pl-6 ${isDarkMode ? "text-white" : "text-zinc-900"} font-medium text-sm`}>{item.description}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.dueDate}</td>
                        <td className="p-4 text-zinc-400 text-sm">{item.category}</td>
                        <td className="p-4 text-red-500 font-mono text-sm">{formatCurrency(item.value)}</td>
                        <td className="p-4 text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${item.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleToggleStatus(item)} className="p-1.5 rounded-lg bg-zinc-500/10 text-zinc-500 hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors" title="Alternar Status"><CheckCircle2 size={16} /></button>
                            <button onClick={() => handleDeleteExpense(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Excluir"><Trash2 size={16} /></button>
                          </div>
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
                <div className="relative">
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                  {(() => {
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                          className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#050505] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-left text-sm`}
                        >
                          <span>{category}</span>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCatDropdownOpen && (
                          <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => { setCategory(cat); setIsCatDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${category === cat
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
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
                  <CustomDatePicker
                    selectedDate={dueDate}
                    onChange={(date: string) => setDueDate(date)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('Pendente')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${status === 'Pendente' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/50' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200')}`}
                  >
                    <Clock size={14} />
                    Pendente
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Pago')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${status === 'Pago' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/50' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200')}`}
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
                      type="button"
                      onClick={() => setRecurrence(rec)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${recurrence === rec ? 'bg-orange-500/10 text-orange-500 border border-orange-500/50' : (isDarkMode ? 'bg-[#050505] text-zinc-500 border border-zinc-800 hover:border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 shadow-sm')}`}
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

      {/* Delete Confirmation Modal */}
      {
        isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className={`${isDarkMode ? "bg-[#18181b] border-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "bg-white border-zinc-200 shadow-2xl"} rounded-3xl w-full max-w-sm border overflow-hidden animate-in zoom-in-95 duration-200`}>
              <div className={`p-6 border-b ${isDarkMode ? "border-zinc-800/80" : "border-zinc-100"}`}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 mx-auto border border-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold text-center mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Excluir Lançamento</h3>
                <p className={`text-center text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Deseja realmente excluir este lançamento? Esta ação é permanente e removerá o item do controle financeiro.
                </p>
              </div>
              <div className={`p-4 gap-3 flex flex-col md:flex-row justify-end ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-zinc-50'}`}>
                <button
                  onClick={cancelDelete}
                  className={`w-full md:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};


const RelatoriosView = ({ isDarkMode = true, expenses = [], appointments = [], patients = [], services = [], professionals = [] }: { isDarkMode?: boolean; expenses?: any[]; appointments?: any[]; patients?: any[]; services?: any[]; professionals?: any[] }) => {
  const [activeTab, setActiveTab] = useState('Financeiro Detalhado');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState('');

  // States for filters (mirrored from Financial tab)
  const currentYearStr = new Date().getFullYear().toString();
  const [viewYear, setViewYear] = useState(currentYearStr);
  const [viewPeriod, setViewPeriod] = useState('Mensal'); // 'Mensal', 'Trimestral', 'Semestral', 'Anual'
  const [viewRange, setViewRange] = useState(new Date().getMonth()); // 0-11 for months, 0-3 for trimesters, 0-1 for semesters
  const [isViewYearDropdownOpen, setIsViewYearDropdownOpen] = useState(false);
  const [isViewRangeDropdownOpen, setIsViewRangeDropdownOpen] = useState(false);

  // States for Clientes VIP filter
  const [vipViewYear, setVipViewYear] = useState(currentYearStr);
  const [vipViewPeriod, setVipViewPeriod] = useState('Semestral');
  const [vipViewRange, setVipViewRange] = useState(Math.floor(new Date().getMonth() / 6));
  const [isVipViewYearDropdownOpen, setIsVipViewYearDropdownOpen] = useState(false);
  const [isVipViewRangeDropdownOpen, setIsVipViewRangeDropdownOpen] = useState(false);

  // Helper to get start and end months based on period filters
  let periodStartMonth = 0;
  let periodEndMonth = 11;
  if (viewPeriod === 'Mensal') {
    periodStartMonth = viewRange;
    periodEndMonth = viewRange;
  } else if (viewPeriod === 'Trimestral') {
    periodStartMonth = viewRange * 3;
    periodEndMonth = periodStartMonth + 2;
  } else if (viewPeriod === 'Semestral') {
    periodStartMonth = viewRange * 6;
    periodEndMonth = periodStartMonth + 5;
  }

  // Generate an array of objects to map X-axis based on period
  // We'll use this generic axis array to map both financial and patient data.
  const isDailyView = viewPeriod === 'Mensal';
  const numViewYear = parseInt(viewYear);
  const namesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  let axisLabels: string[] = [];
  if (isDailyView) {
    const diasNoMes = new Date(numViewYear, periodStartMonth + 1, 0).getDate();
    for (let i = 1; i <= diasNoMes; i++) {
      axisLabels.push(String(i).padStart(2, '0'));
    }
  } else {
    for (let m = periodStartMonth; m <= periodEndMonth; m++) {
      axisLabels.push(namesMeses[m]);
    }
  }

  const numDataPoints = axisLabels.length;

  // ─── FINANCEIRO KPIs ───────────────────────────────────────────────
  const receitas = expenses.filter(e => e.type === 'Receita');
  const despesas = expenses.filter(e => e.type !== 'Receita');
  const totalReceitas = receitas.reduce((acc, e) => acc + Number(e.value || 0), 0);
  const totalDespesas = despesas.reduce((acc, e) => acc + Number(e.value || 0), 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? ((lucroLiquido / totalReceitas) * 100).toFixed(1) : '0.0';
  const ticketMedio = receitas.length > 0 ? (totalReceitas / receitas.length).toFixed(2) : '0.00';

  // ─── EVOLUÇÃO RECEITA VS LUCRO (Filtered) ──────────────────────────────────
  const receitaPerMonth = Array(numDataPoints).fill(0);
  const lucroPerMonth = Array(numDataPoints).fill(0);

  expenses.forEach(exp => {
    try {
      const [yearStr, monthStr, dayStr] = (exp.dueDate || '').split('-');
      if (yearStr && parseInt(yearStr) === numViewYear) {
        const month = parseInt(monthStr) - 1;
        if (month >= periodStartMonth && month <= periodEndMonth) {
          let idx = -1;
          if (isDailyView) {
            idx = parseInt(dayStr) - 1;
          } else {
            idx = month - periodStartMonth;
          }
          if (idx >= 0 && idx < numDataPoints) {
            const val = Number(exp.value || 0);
            if (exp.type === 'Receita') {
              receitaPerMonth[idx] += val;
              lucroPerMonth[idx] += val;
            } else {
              lucroPerMonth[idx] -= val;
            }
          }
        }
      }
    } catch { }
  });

  const maxReceitaAxis = Math.max(...receitaPerMonth, 1000);

  // Top Procedimentos
  const serviceCounts: Record<string, number> = {};
  appointments.forEach(a => {
    const name = a.service || 'Sem serviço';
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });
  const topProcedures = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // ─── DESEMPENHO OPERACIONAL KPIs ───────────────────────────────────
  const totalProcedimentos = appointments.length;
  const profCounts: Record<string, number> = {};
  appointments.forEach(a => { if (a.professionalId) profCounts[a.professionalId] = (profCounts[a.professionalId] || 0) + 1; });
  const topProfEntry = Object.entries(profCounts).sort((a, b) => b[1] - a[1])[0];
  const topProf = topProfEntry ? professionals.find(p => p.id === topProfEntry[0]) : null;
  const topProfName = topProf ? topProf.name : (topProfEntry ? 'Desconhecido' : '-');

  const apptsByDay: number[] = Array(7).fill(0); // Dom, Seg.. Sab
  appointments.forEach(a => {
    if (a.time) {
      try {
        const d = new Date(a.time);
        if (!isNaN(d.getTime())) apptsByDay[d.getDay()]++;
      } catch { }
    }
  });
  const maxApptDay = Math.max(...apptsByDay, 4);

  // ─── ANÁLISE DE CLIENTES KPIs ──────────────────────────────────────
  const totalClientes = patients.length;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const novosClientes = patients.filter((p: any) => {
    if (!p.id) return false;
    const ts = Number(p.id);
    return ts > sixMonthsAgo.getTime();
  }).length;
  const patientAppCount: Record<string, number> = {};
  appointments.forEach(a => { if (a.patient) patientAppCount[a.patient] = (patientAppCount[a.patient] || 0) + 1; });
  const recorrentes = Object.values(patientAppCount).filter(c => c > 1).length;
  const totalComAgenda = Object.keys(patientAppCount).length;
  const taxaRetencao = totalComAgenda > 0 ? ((recorrentes / totalComAgenda) * 100).toFixed(1) : '0.0';
  const ltv = totalClientes > 0 ? (totalReceitas / totalClientes).toFixed(2) : '0.00';

  let vipStartMonth = 0;
  let vipEndMonth = 11;
  if (vipViewPeriod === 'Mensal') {
    vipStartMonth = vipViewRange;
    vipEndMonth = vipViewRange;
  } else if (vipViewPeriod === 'Trimestral') {
    vipStartMonth = vipViewRange * 3;
    vipEndMonth = vipStartMonth + 2;
  } else if (vipViewPeriod === 'Semestral') {
    vipStartMonth = vipViewRange * 6;
    vipEndMonth = vipStartMonth + 5;
  }

  const numVipYear = parseInt(vipViewYear);
  const vipPatientAppCount: Record<string, number> = {};

  appointments.forEach(a => {
    if (!a.patient) return;
    try {
      let dStr = a.time;
      if (!dStr && a.id && !isNaN(Number(a.id))) dStr = Number(a.id);
      if (!dStr) return;
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return;

      if (vipViewPeriod === 'Anual') {
        if (d.getFullYear() === numVipYear) {
          vipPatientAppCount[a.patient] = (vipPatientAppCount[a.patient] || 0) + 1;
        }
      } else {
        if (d.getFullYear() === numVipYear) {
          const month = d.getMonth();
          if (month >= vipStartMonth && month <= vipEndMonth) {
            vipPatientAppCount[a.patient] = (vipPatientAppCount[a.patient] || 0) + 1;
          }
        }
      }
    } catch { }
  });
  const vipList = Object.entries(vipPatientAppCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const novosPerMonth = Array(numDataPoints).fill(0);
  const recorrentesPerMonth = Array(numDataPoints).fill(0);

  patients.forEach(p => {
    try {
      const d = (p.id && !isNaN(Number(p.id))) ? new Date(Number(p.id)) : new Date();
      if (isNaN(d.getTime())) return;
      if (d.getFullYear() === numViewYear) {
        const month = d.getMonth();
        if (month >= periodStartMonth && month <= periodEndMonth) {
          let idx = -1;
          if (isDailyView) {
            idx = d.getDate() - 1;
          } else {
            idx = month - periodStartMonth;
          }
          if (idx >= 0 && idx < numDataPoints) {
            novosPerMonth[idx]++;
          }
        }
      }
    } catch { }
  });

  appointments.forEach(a => {
    try {
      let dStr = a.time;
      if (!dStr && a.id && !isNaN(Number(a.id))) dStr = Number(a.id);
      if (!dStr) return;
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return;

      if (d.getFullYear() === numViewYear) {
        const month = d.getMonth();
        if (month >= periodStartMonth && month <= periodEndMonth) {
          let idx = -1;
          if (isDailyView) {
            idx = d.getDate() - 1;
          } else {
            idx = month - periodStartMonth;
          }
          if (idx >= 0 && idx < numDataPoints) {
            recorrentesPerMonth[idx]++;
          }
        }
      }
    } catch { }
  });
  const maxClientesAxis = Math.max(...novosPerMonth, ...recorrentesPerMonth, 8);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${lucroLiquido >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {lucroLiquido >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {margemLucro}%
                  </span>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{fmt(totalReceitas)}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Faturamento Total</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${lucroLiquido >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {lucroLiquido >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {margemLucro}%
                  </span>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{fmt(lucroLiquido)}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Lucro Líquido <span className="font-normal normal-case">margem: {margemLucro}%</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Ticket size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{fmt(Number(ticketMedio))}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Ticket Médio <span className="font-normal normal-case">{receitas.length} atendimentos</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className={`md:col-span-2 bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Evolução Receita vs Lucro</h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsViewYearDropdownOpen(!isViewYearDropdownOpen);
                            setIsViewRangeDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                            ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                            : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                        >
                          <span>{viewYear}</span>
                        </button>
                        <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewYearDropdownOpen ? 'rotate-180' : ''}`} />

                        {isViewYearDropdownOpen && (
                          <div className={`absolute z-50 top-full mt-1 w-full min-w-[100px] rounded-xl border shadow-2xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {Array.from({ length: 21 }, (_, i) => (parseInt(currentYearStr) - 10 + i).toString()).map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => { setViewYear(yr); setIsViewYearDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewYear === yr
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {viewPeriod !== 'Anual' && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsViewRangeDropdownOpen(!isViewRangeDropdownOpen);
                              setIsViewYearDropdownOpen(false);
                            }}
                            className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                              ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                              : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                          >
                            <span>
                              {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][viewRange]}
                              {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'][viewRange]}
                              {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'][viewRange]}
                            </span>
                          </button>
                          <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewRangeDropdownOpen ? 'rotate-180' : ''}`} />

                          {isViewRangeDropdownOpen && (
                            <div className={`absolute z-[60] top-full mt-1 min-w-[150px] rounded-xl border shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                                <button
                                  key={`range-cf-${i}`}
                                  type="button"
                                  onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                              {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'].map((m, i) => (
                                <button
                                  key={`range-cft-${i}`}
                                  type="button"
                                  onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                              {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'].map((m, i) => (
                                <button
                                  key={`range-cfs-${i}`}
                                  type="button"
                                  onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="segmented-control mt-0 w-full sm:w-auto overflow-x-auto justify-start sm:justify-end">
                      {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            setViewPeriod(p);
                            if (p === 'Mensal') setViewRange(new Date().getMonth());
                            else if (p === 'Trimestral') setViewRange(Math.floor(new Date().getMonth() / 3));
                            else if (p === 'Semestral') setViewRange(Math.floor(new Date().getMonth() / 6));
                          }}
                          className={`segmented-control-item hidden lg:block ${viewPeriod === p ? 'active' : ''}`}
                        >
                          {p}
                        </button>
                      ))}
                      {/* Mobile fallback for segmented control */}
                      <select
                        value={viewPeriod}
                        onChange={(e) => {
                          const p = e.target.value;
                          setViewPeriod(p);
                          if (p === 'Mensal') setViewRange(new Date().getMonth());
                          else if (p === 'Trimestral') setViewRange(Math.floor(new Date().getMonth() / 3));
                          else if (p === 'Semestral') setViewRange(Math.floor(new Date().getMonth() / 6));
                        }}
                        className="lg:hidden appearance-none outline-none bg-transparent border-0 text-zinc-300 text-sm focus:ring-0 cursor-pointer w-full text-right"
                      >
                        {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative flex items-end pb-6">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-600">
                    <span>{Math.round(maxReceitaAxis / 1000)}k</span><span>{Math.round(maxReceitaAxis * 0.8 / 1000)}k</span><span>{Math.round(maxReceitaAxis * 0.6 / 1000)}k</span><span>{Math.round(maxReceitaAxis * 0.4 / 1000)}k</span><span>{Math.round(maxReceitaAxis * 0.2 / 1000)}k</span><span>0k</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className={`border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed w-full h-0`}></div>)}
                  </div>
                  {/* Data Line SVG */}
                  {receitaPerMonth.some(v => v > 0) ? (
                    <div className="absolute inset-0 left-8 bottom-6 w-[calc(100%-2rem)] h-[calc(100%-1.5rem)] pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <polyline
                          points={lucroPerMonth.map((val, idx) => `${(idx / (numDataPoints - 1 || 1)) * 100},${100 - Math.max(0, val / (maxReceitaAxis || 1)) * 100}`).join(' ')}
                          fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 2"
                        />
                        <polyline
                          points={receitaPerMonth.map((val, idx) => `${(idx / (numDataPoints - 1 || 1)) * 100},${100 - (val / (maxReceitaAxis || 1)) * 100}`).join(' ')}
                          fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"
                          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        />
                      </svg>

                      {/* Dots */}
                      {numDataPoints <= 31 && lucroPerMonth.map((val, idx) => (
                        <div key={`dot-l-${idx}`} className={`absolute w-1.5 h-1.5 rounded-full bg-[#3b82f6] outline outline-1 outline-[#0a0a0a] transform -translate-x-1/2 -translate-y-1/2 ${numDataPoints > 15 ? 'opacity-0 hover:opacity-100' : ''}`} style={{ left: `${(idx / (numDataPoints - 1 || 1)) * 100}%`, top: `${100 - Math.max(0, val / (maxReceitaAxis || 1)) * 100}%` }}></div>
                      ))}
                      {numDataPoints <= 31 && receitaPerMonth.map((val, idx) => (
                        <div key={`dot-r-${idx}`} className={`absolute w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-[#0a0a0a] transform -translate-x-1/2 -translate-y-1/2 z-10 ${numDataPoints > 15 ? 'opacity-0 hover:opacity-100' : ''}`} style={{ left: `${(idx / (numDataPoints - 1 || 1)) * 100}%`, top: `${100 - (val / (maxReceitaAxis || 1)) * 100}%` }}></div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 left-8 bottom-6 flex items-center justify-center pointer-events-none">
                      <span className="text-sm text-zinc-500 italic">Sem dados suficientes</span>
                    </div>
                  )}
                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pt-2`}>
                    {axisLabels.map((lbl, idx) => (
                      <span key={idx} className={`${numDataPoints > 15 && idx % 2 !== 0 ? 'hidden' : ''}`}>{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>



              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col shadow-[var(--card-shadow)] lg:col-span-1 justify-between">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="text-yellow-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Top Procedimentos</h3>
                </div>
                <div className="flex-1 flex flex-col gap-2 justify-center mt-2">
                  {topProcedures.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center"><span className="text-sm text-zinc-500 italic">Sem dados</span></div>
                  ) : (
                    topProcedures.map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between pb-2 border-b border-zinc-500/10 last:border-0 text-sm">
                        <span className={isDarkMode ? "text-zinc-300 truncate" : "text-zinc-700 truncate"}>{name}</span>
                        <span className="font-bold text-orange-500">{count}</span>
                      </div>
                    ))
                  )}
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
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{totalProcedimentos}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Atendimentos <span className="font-normal normal-case block mt-1">Acumulado</span></p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Crown size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1 truncate`}>{topProfName}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Top Profissional</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Activity size={16} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{totalProcedimentos}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Procedimentos</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Crown className="text-yellow-500" size={20} />
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Ranking da Equipe</h3>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 mt-2 overflow-y-auto custom-scrollbar">
                  {Object.keys(profCounts).length === 0 ? (
                    <div className="flex-1 flex items-center justify-center"><span className="text-sm text-zinc-500 italic">Sem dados</span></div>
                  ) : (
                    Object.entries(profCounts).sort((a, b) => b[1] - a[1]).map(([pid, count], i) => {
                      const p = professionals.find(p => p.id === pid);
                      return (
                        <div key={pid} className="flex items-center justify-between py-2 border-b border-zinc-500/10 last:border-0">
                          <span className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} flex items-center gap-2`}>
                            {i === 0 && <Crown size={14} className="text-yellow-500" />} {p?.name || 'Vazio'}
                          </span>
                          <span className="font-bold text-orange-500">{count} atend.</span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className={`bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-blue-500" size={20} />
                  <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold`}>Taxa de Ocupação Semanal</h3>
                </div>
                <div className="flex-1 relative flex pb-6 pl-8">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-around text-[10px] text-zinc-600">
                    <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                  </div>
                  {/* Bars Container */}
                  <div className={`flex-1 border-l border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} flex flex-col justify-around py-2 relative`}>
                    {[0, 1, 2, 3, 4].map(v => (
                      <div key={v} className="absolute top-0 bottom-0 border-l border-dashed border-zinc-500/20" style={{ left: `${(v / 4) * 100}%` }} />
                    ))}
                    {apptsByDay.map((count, dayIdx) => (
                      <div key={dayIdx} className="h-4 bg-orange-500/20 rounded-r-sm w-full relative z-10 flex items-center">
                        <div className="h-full bg-orange-500 rounded-r-sm transition-all" style={{ width: `${Math.max(2, (count / maxApptDay) * 100)}%` }} />
                        {count > 0 && <span className="ml-2 text-[10px] text-orange-500 font-bold">{count}</span>}
                      </div>
                    ))}
                  </div>
                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 pt-2`}>
                    {[0, 1, 2, 3, 4].map(v => <span key={v}>{Math.max(v, Math.round(maxApptDay * (v / 4)))}</span>)}
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
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{novosClientes}</h3>
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
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{taxaRetencao}%</h3>
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
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{fmt(Number(ltv))}</h3>
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
                  <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>{totalClientes}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Clientes</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 shrink-0">
              <div className={`w-full bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                    <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Evolução Novos vs Recorrentes</h3>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewYearDropdownOpen(!isViewYearDropdownOpen);
                          setIsViewRangeDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                          ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                      >
                        <span>{viewYear}</span>
                      </button>
                      <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewYearDropdownOpen ? 'rotate-180' : ''}`} />

                      {isViewYearDropdownOpen && (
                        <div className={`absolute z-50 top-full mt-1 w-full min-w-[100px] rounded-xl border shadow-2xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                          {Array.from({ length: 21 }, (_, i) => (parseInt(currentYearStr) - 10 + i).toString()).map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => { setViewYear(yr); setIsViewYearDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewYear === yr
                                ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                              {yr}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {viewPeriod !== 'Anual' && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsViewRangeDropdownOpen(!isViewRangeDropdownOpen);
                            setIsViewYearDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                            ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                            : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                        >
                          <span>
                            {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][viewRange]}
                            {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'][viewRange]}
                            {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'][viewRange]}
                          </span>
                        </button>
                        <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isViewRangeDropdownOpen ? 'rotate-180' : ''}`} />

                        {isViewRangeDropdownOpen && (
                          <div className={`absolute z-[60] top-full mt-1 min-w-[150px] rounded-xl border shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {viewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                              <button
                                key={`range-cf-${i}`}
                                type="button"
                                onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {m}
                              </button>
                            ))}
                            {viewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'].map((m, i) => (
                              <button
                                key={`range-cft-${i}`}
                                type="button"
                                onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {m}
                              </button>
                            ))}
                            {viewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'].map((m, i) => (
                              <button
                                key={`range-cfs-${i}`}
                                type="button"
                                onClick={() => { setViewRange(i); setIsViewRangeDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${viewRange === i
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="segmented-control">
                    {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setViewPeriod(p);
                          if (p === 'Mensal') setViewRange(new Date().getMonth());
                          else if (p === 'Trimestral') setViewRange(Math.floor(new Date().getMonth() / 3));
                          else if (p === 'Semestral') setViewRange(Math.floor(new Date().getMonth() / 6));
                        }}
                        className={`segmented-control-item hidden lg:block ${viewPeriod === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                    {/* Mobile fallback for segmented control */}
                    <select
                      value={viewPeriod}
                      onChange={(e) => {
                        const p = e.target.value;
                        setViewPeriod(p);
                        if (p === 'Mensal') setViewRange(new Date().getMonth());
                        else if (p === 'Trimestral') setViewRange(Math.floor(new Date().getMonth() / 3));
                        else if (p === 'Semestral') setViewRange(Math.floor(new Date().getMonth() / 6));
                      }}
                      className="lg:hidden appearance-none outline-none bg-transparent border-0 text-zinc-300 text-sm focus:ring-0 cursor-pointer"
                    >
                      {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1 relative flex items-end pb-6">
                  {/* Y Axis */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-600">
                    <span>{maxClientesAxis}</span><span>{Math.round(maxClientesAxis * 0.75)}</span><span>{Math.round(maxClientesAxis * 0.5)}</span><span>{Math.round(maxClientesAxis * 0.25)}</span><span>0</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map(i => <div key={i} className={`border-t ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} border-dashed w-full h-0`}></div>)}
                  </div>

                  {novosPerMonth.some(v => v > 0) || recorrentesPerMonth.some(v => v > 0) ? (
                    <div className="absolute inset-0 left-8 bottom-6 w-[calc(100%-2rem)] h-[calc(100%-1.5rem)] pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Area Gradient Definitions */}
                        <defs>
                          <linearGradient id="gradient-novos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="gradient-recorrentes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Linha Recorrentes (Laranja) */}
                        <polyline
                          points={recorrentesPerMonth.map((val, idx) => `${(idx / (numDataPoints - 1 || 1)) * 100},${100 - (val / (maxClientesAxis || 1)) * 100}`).join(' ')}
                          fill="none" stroke="#ea580c" strokeWidth="2" vectorEffect="non-scaling-stroke"
                          className="drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]"
                        />
                        {/* Linha Novos (Azul) */}
                        <polyline
                          points={novosPerMonth.map((val, idx) => `${(idx / (numDataPoints - 1 || 1)) * 100},${100 - (val / (maxClientesAxis || 1)) * 100}`).join(' ')}
                          fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke"
                          className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                      </svg>

                      {/* Dots (Absolute positioning to keep them perfectly round regardless of aspect ratio) */}
                      {numDataPoints <= 31 && recorrentesPerMonth.map((val, idx) => (
                        <div key={`dot-r-${idx}`} className={`absolute w-2 h-2 rounded-full bg-[#ea580c] shadow-[0_0_8px_rgba(234,88,12,0.8)] outline outline-2 outline-[#0a0a0a] transform -translate-x-1/2 -translate-y-1/2 transition-all ${numDataPoints > 15 ? 'opacity-0 hover:opacity-100' : ''}`} style={{ left: `${(idx / (numDataPoints - 1 || 1)) * 100}%`, top: `${100 - (val / (maxClientesAxis || 1)) * 100}%` }}></div>
                      ))}
                      {numDataPoints <= 31 && novosPerMonth.map((val, idx) => (
                        <div key={`dot-n-${idx}`} className={`absolute w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-[#0a0a0a] transform -translate-x-1/2 -translate-y-1/2 transition-all z-10 ${numDataPoints > 15 ? 'opacity-0 hover:opacity-100' : ''}`} style={{ left: `${(idx / (numDataPoints - 1 || 1)) * 100}%`, top: `${100 - (val / (maxClientesAxis || 1)) * 100}%` }}></div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 left-8 bottom-6 flex items-center justify-center pointer-events-none">
                      <span className="text-sm text-zinc-500 italic">Sem dados suficientes</span>
                    </div>
                  )}

                  {/* X Axis */}
                  <div className={`absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-zinc-600 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pt-2`}>
                    {axisLabels.map((lbl, idx) => (
                      <span key={idx} className={`${numDataPoints > 15 && idx % 2 !== 0 ? 'hidden' : ''}`}>{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`w-full bg-[#0a0a0a] border ${isDarkMode ? "border-zinc-800/80" : "border-zinc-200/80"} rounded-2xl p-6 flex flex-col h-96`}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Crown className="text-yellow-500" size={20} />
                      <h3 className={`${isDarkMode ? "text-white" : "text-zinc-900"} font-bold text-lg`}>Clientes VIP</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsVipViewYearDropdownOpen(!isVipViewYearDropdownOpen);
                            setIsVipViewRangeDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                            ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                            : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                        >
                          <span>{vipViewYear}</span>
                        </button>
                        <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isVipViewYearDropdownOpen ? 'rotate-180' : ''}`} />

                        {isVipViewYearDropdownOpen && (
                          <div className={`absolute z-50 top-full mt-1 w-full min-w-[100px] rounded-xl border shadow-2xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {Array.from({ length: 21 }, (_, i) => (parseInt(currentYearStr) - 10 + i).toString()).map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => { setVipViewYear(yr); setIsVipViewYearDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${vipViewYear === yr
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {vipViewPeriod !== 'Anual' && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsVipViewRangeDropdownOpen(!isVipViewRangeDropdownOpen);
                              setIsVipViewYearDropdownOpen(false);
                            }}
                            className={`flex items-center gap-2 pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${isDarkMode
                              ? "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                              : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                          >
                            <span>
                              {vipViewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][vipViewRange]}
                              {vipViewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'][vipViewRange]}
                              {vipViewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'][vipViewRange]}
                            </span>
                          </button>
                          <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-transform ${isVipViewRangeDropdownOpen ? 'rotate-180' : ''}`} />

                          {isVipViewRangeDropdownOpen && (
                            <div className={`absolute z-[60] top-full mt-1 min-w-[150px] rounded-xl border shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {vipViewPeriod === 'Mensal' && ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                                <button
                                  key={`range-cf-${i}`}
                                  type="button"
                                  onClick={() => { setVipViewRange(i); setIsVipViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${vipViewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                              {vipViewPeriod === 'Trimestral' && ['1º Trimestre (Jan-Mar)', '2º Trimestre (Abr-Jun)', '3º Trimestre (Jul-Set)', '4º Trimestre (Out-Dez)'].map((m, i) => (
                                <button
                                  key={`range-cft-${i}`}
                                  type="button"
                                  onClick={() => { setVipViewRange(i); setIsVipViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${vipViewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                              {vipViewPeriod === 'Semestral' && ['1º Semestre (Jan-Jun)', '2º Semestre (Jul-Dez)'].map((m, i) => (
                                <button
                                  key={`range-cfs-${i}`}
                                  type="button"
                                  onClick={() => { setVipViewRange(i); setIsVipViewRangeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${vipViewRange === i
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="segmented-control mt-0 w-full sm:w-auto overflow-x-auto justify-start sm:justify-end">
                    {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setVipViewPeriod(p);
                          if (p === 'Mensal') setVipViewRange(new Date().getMonth());
                          else if (p === 'Trimestral') setVipViewRange(Math.floor(new Date().getMonth() / 3));
                          else if (p === 'Semestral') setVipViewRange(Math.floor(new Date().getMonth() / 6));
                        }}
                        className={`segmented-control-item hidden lg:block ${vipViewPeriod === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                    {/* Mobile fallback for segmented control */}
                    <select
                      value={vipViewPeriod}
                      onChange={(e) => {
                        const p = e.target.value;
                        setVipViewPeriod(p);
                        if (p === 'Mensal') setVipViewRange(new Date().getMonth());
                        else if (p === 'Trimestral') setVipViewRange(Math.floor(new Date().getMonth() / 3));
                        else if (p === 'Semestral') setVipViewRange(Math.floor(new Date().getMonth() / 6));
                      }}
                      className="lg:hidden appearance-none outline-none bg-transparent border-0 text-zinc-300 text-sm focus:ring-0 cursor-pointer w-full text-right"
                    >
                      {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {vipList.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center"><span className="text-sm text-zinc-500 italic">Sem dados</span></div>
                ) : (
                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto custom-scrollbar">
                    {vipList.map(([name, count], idx) => (
                      <div key={name} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-600 w-4">{idx + 1}.</span>
                          {idx === 0 && <Crown size={12} className="text-yellow-500" />}
                          <span className="text-xs text-zinc-300 truncate max-w-[120px]">{name}</span>
                        </div>
                        <span className="text-xs font-bold text-orange-400">{count}x</span>
                      </div>
                    ))}
                  </div>
                )}
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
  isDarkMode = true,
  clinicConfig,
  setClinicConfig,
  aiConfig,
  setAiConfig,
  timeoutConfig,
  setTimeoutConfig
}: any) => {
  const { nomeAssistente, tomDeVoz, systemPrompt, restricoes, diferenciais, faqs } = aiConfig || { nomeAssistente: '', tomDeVoz: 'Empático e Acolhedor', systemPrompt: '', restricoes: '', diferenciais: '', faqs: [] };
  const [keyInput, setKeyInput] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [workingDays, setWorkingDays] = useState([true, true, true, true, true, true, false]);
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [conselhoClasse, setConselhoClasse] = useState('CRM');
  const [isConselhoDropdownOpen, setIsConselhoDropdownOpen] = useState(false);
  const [fusoHorario, setFusoHorario] = useState('America/Sao_Paulo');
  const [isFusoDropdownOpen, setIsFusoDropdownOpen] = useState(false);
  const [isEstadoDropdownOpen, setIsEstadoDropdownOpen] = useState(false);
  const [openFinCatId, setOpenFinCatId] = useState<string | null>(null);
  const [tipoComissao, setTipoComissao] = useState('Porcentagem (%)');
  const [isComissaoDropdownOpen, setIsComissaoDropdownOpen] = useState(false);
  const [regimeTributario, setRegimeTributario] = useState('Simples Nacional');
  const [isRegimeDropdownOpen, setIsRegimeDropdownOpen] = useState(false);
  const [isTimeoutDropdownOpen, setIsTimeoutDropdownOpen] = useState(false);
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
  const [valorComissao, setValorComissao] = useState('30');
  const [aliquotaIss, setAliquotaIss] = useState('5.00');

  // ── Financeiro & Fiscal ────────────────────────────────────
  useEffect(() => {
    const docRef = doc(db, 'configuracoes', 'financeiro_fiscal');
    const unsub = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      if (d.paymentMethods) setPaymentMethods(d.paymentMethods);
      if (d.finCategories) setFinCategories(d.finCategories);
      if (d.discountCardTax !== undefined) setDiscountCardTax(d.discountCardTax);
      if (d.discountProductCost !== undefined) setDiscountProductCost(d.discountProductCost);
      if (d.tipoComissao) setTipoComissao(d.tipoComissao);
      if (d.valorComissao) setValorComissao(d.valorComissao);
      if (d.regimeTributario) setRegimeTributario(d.regimeTributario);
      if (d.aliquotaIss) setAliquotaIss(d.aliquotaIss);
      if (d.autoEmission !== undefined) setAutoEmission(d.autoEmission);
    });
    return () => unsub();
  }, []);

  const handleSavePayments = async () => {
    await setDoc(doc(db, 'configuracoes', 'financeiro_fiscal'), { paymentMethods }, { merge: true });
  };

  const handleSaveCategories = async () => {
    await setDoc(doc(db, 'configuracoes', 'financeiro_fiscal'), { finCategories }, { merge: true });
  };

  const handleSaveCommission = async () => {
    await setDoc(doc(db, 'configuracoes', 'financeiro_fiscal'), {
      discountCardTax, discountProductCost, tipoComissao, valorComissao
    }, { merge: true });
  };

  const handleSaveFiscal = async () => {
    await setDoc(doc(db, 'configuracoes', 'financeiro_fiscal'), {
      regimeTributario, aliquotaIss, autoEmission
    }, { merge: true });
  };
  // ──────────────────────────────────────────────────────────

  // ── Integrações & API ──────────────────────────────────────
  const [integrationConfig, setIntegrationConfig] = useState<any>({
    webhookUrl: '',
    webhookEvents: {
      novoAgendamento: false,
      agendamentoCancelado: false,
      novoCliente: false,
      pagamentoConfirmado: false,
    },
    connectedServices: {
      whatsapp: false,
      stripe: false,
      googleCalendar: false,
      rdStation: false,
    }
  });

  useEffect(() => {
    const docRef = doc(db, 'configuracoes', 'api_integracoes');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setIntegrationConfig((prev: any) => ({ ...prev, ...snap.data() }));
      }
    });
    return () => unsub();
  }, []);

  const handleSaveIntegration = async () => {
    await setDoc(doc(db, 'configuracoes', 'api_integracoes'), integrationConfig, { merge: true });
  };

  const toggleWebhookEvent = (key: string) => {
    setIntegrationConfig((prev: any) => ({
      ...prev,
      webhookEvents: { ...prev.webhookEvents, [key]: !prev.webhookEvents[key] }
    }));
  };

  const toggleConnectedService = (key: string) => {
    setIntegrationConfig((prev: any) => ({
      ...prev,
      connectedServices: { ...prev.connectedServices, [key]: !prev.connectedServices[key] }
    }));
  };
  // ───────────────────────────────────────────────────────────


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
          {role === 'admin' && (
            <SettingsNavItem icon={<Shield size={20} />} title="Segurança & Acessos" subtitle="Timeout e políticas de sessão" active={activeSettingsMenu === 'Segurança & Acessos'} onClick={() => setActiveSettingsMenu('Segurança & Acessos')} isDarkMode={isDarkMode} />
          )}
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
                <SaveButton
                  defaultText="Salvar Configuração"
                  savedText="Configuração Salva"
                  onClick={handleSave}
                  isDarkMode={isDarkMode}
                />
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
                        {pendingUsers.map(([email, status, id, name]: any) => (
                          <div key={id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} ${isDarkMode ? "bg-zinc-900/20" : "bg-[var(--bg-card)] shadow-sm"}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                                {(name || email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{name || email.split('@')[0]}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wider">PROFISSIONAL</span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{email} • Solicitado recentemente</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDeny(id)} className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 border border-red-900/30 transition-colors">
                                Negar
                              </button>
                              <button onClick={() => handleApprove(id)} className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-400/10 border border-emerald-900/30 transition-colors">
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
                        {approvedUsers.map(([email, status, id, name]: any) => (
                          <div key={id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "border-zinc-800/50" : "border-zinc-200/50"} ${isDarkMode ? "bg-zinc-900/20" : "bg-[var(--bg-card)] shadow-sm"}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                                {(name || email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{name || email.split('@')[0]}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wider">PROFISSIONAL</span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">{email}</div>
                              </div>
                            </div>
                            <button onClick={() => handleDeny(id)} className={`px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:${isDarkMode ? "text-white" : "text-zinc-900"} ${isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"} border border-zinc-700 transition-colors`}>
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
                  <div onClick={() => document.getElementById('logo-upload')?.click()} className={`w-24 h-24 rounded-2xl bg-zinc-900 border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-center relative group cursor-pointer overflow-hidden`}>
                    {clinicConfig.logoUrl ? (
                      <img src={clinicConfig.logoUrl} alt="Logo da Clínica" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={32} className="text-zinc-600 group-hover:opacity-0 transition-opacity" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className={`${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`} />
                      <span className={`text-[10px] font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Alterar Logo</span>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Logo da Clínica</h4>
                    <p className="text-xs text-zinc-500 mb-3">Recomendado: 512x512px (PNG ou JPG)</p>
                    <label className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-[var(--border-default)] hover:bg-zinc-50 shadow-sm"} border text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"} transition-colors cursor-pointer inline-block text-center`}>
                      Fazer Upload
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setClinicConfig({ ...clinicConfig, logoUrl: reader.result as string });
                              alert('Nova logo selecionada com sucesso!');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome Fantasia</label>
                    <input type="text" value={clinicConfig.nomeFantasia} onChange={e => setClinicConfig({ ...clinicConfig, nomeFantasia: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Razão Social</label>
                    <input type="text" value={clinicConfig.razaoSocial} onChange={e => setClinicConfig({ ...clinicConfig, razaoSocial: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">CNPJ / CPF</label>
                    <input type="text" value={clinicConfig.cnpj} onChange={e => setClinicConfig({ ...clinicConfig, cnpj: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Inscrição Municipal</label>
                    <input type="text" value={clinicConfig.inscricaoMunicipal} onChange={e => setClinicConfig({ ...clinicConfig, inscricaoMunicipal: e.target.value })} placeholder="Opcional" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Inscrição Estadual</label>
                    <input type="text" value={clinicConfig.inscricaoEstadual} onChange={e => setClinicConfig({ ...clinicConfig, inscricaoEstadual: e.target.value })} placeholder="Opcional" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await setDoc(doc(db, 'configuracoes', 'conta_organizacao'), clinicConfig);
                  }}
                  defaultText="Salvar Perfil"
                  savedText="Perfil Salvo"
                  isDarkMode={isDarkMode}
                />
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
                    <input type="email" value={clinicConfig.email} onChange={e => setClinicConfig({ ...clinicConfig, email: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Telefone / WhatsApp</label>
                    <input type="text" value={clinicConfig.telefone} onChange={e => setClinicConfig({ ...clinicConfig, telefone: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">CEP</label>
                    <input type="text" value={clinicConfig.cep} onChange={e => setClinicConfig({ ...clinicConfig, cep: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Logradouro</label>
                    <input type="text" value={clinicConfig.logradouro} onChange={e => setClinicConfig({ ...clinicConfig, logradouro: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Número</label>
                    <input type="text" value={clinicConfig.numero} onChange={e => setClinicConfig({ ...clinicConfig, numero: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Complemento</label>
                    <input type="text" value={clinicConfig.complemento} onChange={e => setClinicConfig({ ...clinicConfig, complemento: e.target.value })} placeholder="Sala 101" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Bairro</label>
                    <input type="text" value={clinicConfig.bairro} onChange={e => setClinicConfig({ ...clinicConfig, bairro: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Cidade</label>
                    <input type="text" value={clinicConfig.cidade} onChange={e => setClinicConfig({ ...clinicConfig, cidade: e.target.value })} className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div className="col-span-1 relative">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Estado</label>
                    {(() => {
                      const estadoOptions = ['SP', 'RJ', 'MG'];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsEstadoDropdownOpen(!isEstadoDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                          >
                            <span>{clinicConfig.estado}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isEstadoDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isEstadoDropdownOpen && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {estadoOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => { setClinicConfig({ ...clinicConfig, estado: opt }); setIsEstadoDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${clinicConfig.estado === opt
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await setDoc(doc(db, 'configuracoes', 'conta_organizacao'), clinicConfig);
                  }}
                  defaultText="Salvar Contato"
                  savedText="Contato Salvo"
                  isDarkMode={isDarkMode}
                />
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
                  <input type="text" value={clinicConfig.nomeResponsavel} onChange={e => setClinicConfig({ ...clinicConfig, nomeResponsavel: e.target.value })} placeholder="Ex: Dra. Ana Costa" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Conselho de Classe</label>
                  {(() => {
                    const conselhoOptions = ['CRM', 'CRO', 'COREN', 'CRF', 'CREFITO', 'Biomedicina'];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsConselhoDropdownOpen(!isConselhoDropdownOpen)}
                          className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                        >
                          <span>{clinicConfig.conselhoClasse}</span>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isConselhoDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isConselhoDropdownOpen && (
                          <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {conselhoOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => { setClinicConfig({ ...clinicConfig, conselhoClasse: opt }); setIsConselhoDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${clinicConfig.conselhoClasse === opt
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Número de Registro</label>
                  <input type="text" value={clinicConfig.registroConselho} onChange={e => setClinicConfig({ ...clinicConfig, registroConselho: e.target.value })} placeholder="Ex: 123456-SP" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await setDoc(doc(db, 'configuracoes', 'conta_organizacao'), clinicConfig);
                  }}
                  defaultText="Salvar Responsável"
                  savedText="Responsável Salvo"
                  isDarkMode={isDarkMode}
                />
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

                <div className="relative">
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Fuso Horário (Timezone)</label>
                  {(() => {
                    const fusoOptions = [
                      { value: 'America/Sao_Paulo', label: '(GMT-03:00) Horário de Brasília (São Paulo)' },
                      { value: 'America/Manaus', label: '(GMT-04:00) Manaus' },
                      { value: 'America/Rio_Branco', label: '(GMT-05:00) Rio Branco' },
                    ];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsFusoDropdownOpen(!isFusoDropdownOpen)}
                          className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                        >
                          <span>{fusoOptions.find(o => o.value === fusoHorario)?.label || fusoHorario}</span>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isFusoDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isFusoDropdownOpen && (
                          <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {fusoOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setFusoHorario(opt.value); setIsFusoDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${fusoHorario === opt.value
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <p className="text-xs text-zinc-500 mt-2">Importante para garantir que lembretes de agendamento sejam enviados na hora certa.</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await new Promise(r => setTimeout(r, 500)); // Simulating API call
                  }}
                  defaultText="Salvar Configurações"
                  savedText="Configurações Salvas"
                  isDarkMode={isDarkMode}
                />
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

            {/* Provedor de IA & API Key */}
            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Key className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Provedor de IA & Chave de API</h3>
              </div>

              <div className="flex flex-col gap-6">
                {/* Provider Dropdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Provedor</label>
                    <button
                      type="button"
                      onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                      className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                    >
                      <span>{aiConfig?.apiProvider || 'Selecione o provedor'}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProviderDropdownOpen && (
                      <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                        {['OpenAI', 'Anthropic (Claude)', 'Google (Gemini)'].map((prov) => (
                          <button
                            key={prov}
                            type="button"
                            onClick={() => { setAiConfig({ ...aiConfig, apiProvider: prov, aiModel: '' }); setIsProviderDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${aiConfig?.apiProvider === prov
                              ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                              : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                              }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Model Dropdown */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Modelo</label>
                    {(() => {
                      const modelMap: Record<string, string[]> = {
                        'OpenAI': ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
                        'Anthropic (Claude)': ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
                        'Google (Gemini)': ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
                      };
                      const models = modelMap[aiConfig?.apiProvider || ''] || [];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => models.length > 0 && setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left ${models.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span>{aiConfig?.aiModel || (models.length === 0 ? 'Selecione o provedor primeiro' : 'Selecione o modelo')}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isModelDropdownOpen && models.length > 0 && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {models.map((model) => (
                                <button
                                  key={model}
                                  type="button"
                                  onClick={() => { setAiConfig({ ...aiConfig, aiModel: model }); setIsModelDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${aiConfig?.aiModel === model
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {model}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* API Key - Write Only */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Chave de API</label>
                  {aiConfig?.apiKeyMasked ? (
                    <div className={`flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200'} border rounded-xl px-4 py-3`}>
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`text-sm font-mono ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Chave vinculada: {aiConfig.apiKeyMasked}</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = { ...aiConfig, apiKey: '', apiKeyMasked: '' };
                          setAiConfig(updated);
                          const { apiKey: _removed, ...safeData } = updated;
                          try { await setDoc(doc(db, 'configuracoes', 'ia_automacao'), safeData); } catch (e) { console.error(e); }
                        }}
                        className="text-xs text-red-500 hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> Revogar e Substituir
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="sk-proj-..."
                        className={`flex-1 ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!keyInput.trim() || !aiConfig?.apiProvider) { alert('Selecione um provedor e cole a chave.'); return; }
                          const masked = keyInput.slice(0, 3) + '...' + keyInput.slice(-4);
                          const updated = { ...aiConfig, apiKey: keyInput, apiKeyMasked: masked };
                          setAiConfig(updated);
                          setKeyInput('');
                          const { apiKey: _removed, ...safeData } = updated;
                          try { await setDoc(doc(db, 'configuracoes', 'ia_automacao'), safeData); alert('Chave vinculada com sucesso!'); } catch (e) { console.error(e); alert('Erro ao salvar.'); }
                        }}
                        className={`px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black text-sm font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-2`}
                      >
                        <Key size={14} /> Vincular
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 mt-2">A chave é mantida apenas na sessão atual por segurança. Após recarregar a página, será necessário reinserí-la.</p>
                </div>
              </div>
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
                    <input type="text" value={nomeAssistente} onChange={e => setAiConfig({ ...aiConfig, nomeAssistente: e.target.value })} placeholder="Ex: Estetix AI" className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tom de Voz</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                        className={`w-full flex items-center justify-between ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors relative z-10`}
                      >
                        {tomDeVoz}
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
                          <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? "border-zinc-700/50 bg-[#0a0a0a]" : "border-zinc-200 bg-white"}`}>
                            {['Empático e Acolhedor', 'Profissional e Técnico', 'Descontraído e Jovem', 'Focado em Vendas'].map((tone) => (
                              <button
                                key={tone}
                                type="button"
                                onClick={() => {
                                  setAiConfig({ ...aiConfig, tomDeVoz: tone });
                                  setIsToneDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors relative z-50 ${tomDeVoz === tone
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : (isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100')
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
                  <textarea rows={4} value={systemPrompt} onChange={e => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })} placeholder="Defina o comportamento geral e o objetivo principal da IA." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                  <p className="text-xs text-zinc-500 mt-2">Define o comportamento geral e o objetivo principal da IA.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Restrições (O que NÃO fazer)</label>
                  <textarea rows={3} value={restricoes} onChange={e => setAiConfig({ ...aiConfig, restricoes: e.target.value })} placeholder="- Nunca dê diagnósticos médicos.&#10;- Nunca prometa resultados 100% garantidos." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await setDoc(doc(db, 'configuracoes', 'ia_automacao'), aiConfig);
                  }}
                  defaultText="Salvar Persona"
                  savedText="Persona Salva"
                  isDarkMode={isDarkMode}
                />
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
                  <textarea rows={3} value={diferenciais} onChange={e => setAiConfig({ ...aiConfig, diferenciais: e.target.value })} placeholder="- Estacionamento gratuito.&#10;- Produtos importados." className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl px-4 py-3 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none`}></textarea>
                </div>

                {/* FAQ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Perguntas Frequentes (FAQ)</label>
                    <button
                      onClick={() => setAiConfig({ ...aiConfig, faqs: [...faqs, { q: '', a: '' }] })}
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
                            setAiConfig({ ...aiConfig, faqs: newFaqs });
                          }} className={`w-full bg-transparent border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"} pb-2 ${isDarkMode ? "text-white" : "text-zinc-900"} text-sm focus:outline-none focus:border-orange-500 transition-colors`} />
                          <input type="text" placeholder="Resposta da IA" value={faq.a} onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index].a = e.target.value;
                            setAiConfig({ ...aiConfig, faqs: newFaqs });
                          }} className={`w-full bg-transparent text-zinc-400 text-sm focus:outline-none focus:${isDarkMode ? "text-zinc-300" : "text-zinc-900"} transition-colors`} />
                        </div>
                        <button onClick={() => {
                          const newFaqs = faqs.filter((_: any, i: number) => i !== index);
                          setAiConfig({ ...aiConfig, faqs: newFaqs });
                        }} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    await setDoc(doc(db, 'configuracoes', 'ia_automacao'), aiConfig);
                  }}
                  defaultText="Salvar Base de Conhecimento"
                  savedText="Base Salva"
                  isDarkMode={isDarkMode}
                />
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${integrationConfig.connectedServices?.whatsapp
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-zinc-800 text-zinc-500'
                      }`}>{integrationConfig.connectedServices?.whatsapp ? 'CONECTADO' : 'DESCONECTADO'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Envio automático de lembretes, confirmações de agendamento e atendimento via IA.</p>
                  <button
                    onClick={() => toggleConnectedService('whatsapp')}
                    className={`w-full py-2 rounded-lg ${integrationConfig.connectedServices?.whatsapp
                      ? `border ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'} ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      } text-xs font-medium transition-colors`}
                  >
                    {integrationConfig.connectedServices?.whatsapp ? 'Gerenciar' : 'Conectar'}
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${integrationConfig.connectedServices?.stripe
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-zinc-800 text-zinc-500'
                      }`}>{integrationConfig.connectedServices?.stripe ? 'CONECTADO' : 'DESCONECTADO'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Processe pagamentos online, gere links de cobrança e gerencie assinaturas.</p>
                  <button
                    onClick={() => toggleConnectedService('stripe')}
                    className={`w-full py-2 rounded-lg ${integrationConfig.connectedServices?.stripe
                      ? `border ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'} ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      } text-xs font-medium transition-colors`}
                  >
                    {integrationConfig.connectedServices?.stripe ? 'Gerenciar' : 'Conectar'}
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${integrationConfig.connectedServices?.googleCalendar
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-zinc-800 text-zinc-500'
                      }`}>{integrationConfig.connectedServices?.googleCalendar ? 'CONECTADO' : 'DESCONECTADO'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Sincronize a agenda do sistema com o calendário pessoal dos profissionais.</p>
                  <button
                    onClick={() => toggleConnectedService('googleCalendar')}
                    className={`w-full py-2 rounded-lg ${integrationConfig.connectedServices?.googleCalendar
                      ? `border ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'} ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      } text-xs font-medium transition-colors`}
                  >
                    {integrationConfig.connectedServices?.googleCalendar ? 'Gerenciar' : 'Conectar'}
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${integrationConfig.connectedServices?.rdStation
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-zinc-800 text-zinc-500'
                      }`}>{integrationConfig.connectedServices?.rdStation ? 'CONECTADO' : 'DESCONECTADO'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">Sincronize leads do CRM e envie campanhas de e-mail marketing direcionadas.</p>
                  <button
                    onClick={() => toggleConnectedService('rdStation')}
                    className={`w-full py-2 rounded-lg ${integrationConfig.connectedServices?.rdStation
                      ? `border ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'} ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      } text-xs font-medium transition-colors`}
                  >
                    {integrationConfig.connectedServices?.rdStation ? 'Gerenciar' : 'Conectar'}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={handleSaveIntegration}
                  defaultText="Salvar Integrações"
                  savedText="Integrações Salvas"
                  isDarkMode={isDarkMode}
                />
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
                  <input
                    type="url"
                    placeholder="https://sua-api.com/webhook"
                    value={integrationConfig.webhookUrl || ''}
                    onChange={(e) => setIntegrationConfig((p: any) => ({ ...p, webhookUrl: e.target.value }))}
                    className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-3 uppercase">Eventos a serem enviados</label>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-xl p-4`}>
                    {[
                      { key: 'novoAgendamento', label: 'Novo Agendamento Criado' },
                      { key: 'agendamentoCancelado', label: 'Agendamento Cancelado' },
                      { key: 'novoCliente', label: 'Novo Cliente Cadastrado' },
                      { key: 'pagamentoConfirmado', label: 'Pagamento Confirmado' },
                    ].map(({ key, label }) => {
                      const isChecked = integrationConfig.webhookEvents?.[key] ?? false;
                      return (
                        <label key={key} onClick={() => toggleWebhookEvent(key)} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-orange-500 border-orange-500' : isDarkMode ? 'border-zinc-700 bg-zinc-900 group-hover:border-orange-500' : 'border-zinc-300 bg-white group-hover:border-orange-500'}`}>
                            {isChecked && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-900"}`}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button onClick={() => alert('Disparando payload de teste (POST 200 OK) para o endpoint...')} className={`px-4 py-2 rounded-lg ${isDarkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800" : "border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm"} border text-sm font-medium transition-colors flex items-center gap-2`}>
                  <Zap size={16} />
                  Testar Webhook
                </button>
                <SaveButton
                  onClick={handleSaveIntegration}
                  defaultText="Salvar Webhook"
                  savedText="Webhook Salvo"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'Financeiro & Fiscal' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-900'} mb-1`}>
                Financeiro & Fiscal
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Configure taxas, categorias, comissões e dados fiscais da clínica.</p>
            </div>

            {/* 1. Formas de Pagamento e Taxas */}
            <div className={`
              ${isDarkMode ? 'bg-[#0c0c0e] border-zinc-800/80 shadow-black/50' : 'bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]'}
              border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0
            `}>
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
                        <input
                          type="text"
                          value={method.tax}
                          onChange={(e) => {
                            const newMethods = [...paymentMethods];
                            newMethods[index] = { ...newMethods[index], tax: e.target.value };
                            setPaymentMethods(newMethods);
                          }}
                          className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-lg px-3 py-1.5 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs text-center focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">%</span>
                      </div>
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <div className="relative w-24">
                        <input
                          type="text"
                          value={method.days}
                          onChange={(e) => {
                            const newMethods = [...paymentMethods];
                            newMethods[index] = { ...newMethods[index], days: e.target.value };
                            setPaymentMethods(newMethods);
                          }}
                          className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800" : "bg-[var(--bg-surface)] border-[var(--border-default)]"} border rounded-lg px-3 py-1.5 ${isDarkMode ? "text-white" : "text-zinc-900"} text-xs text-center focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">D</span>
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
                <SaveButton
                  onClick={handleSavePayments}
                  defaultText="Salvar Taxas"
                  savedText="Taxas Salvas"
                  isDarkMode={isDarkMode}
                />
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
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenFinCatId(openFinCatId === cat.id ? null : cat.id)}
                          className={`flex items-center justify-between gap-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500 min-w-[100px]`}
                        >
                          <span>{cat.type}</span>
                          <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${openFinCatId === cat.id ? 'rotate-180' : ''}`} />
                        </button>
                        {openFinCatId === cat.id && (
                          <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                            {['Receita', 'Despesa'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const newCats = [...finCategories];
                                  newCats[index].type = opt;
                                  setFinCategories(newCats);
                                  setOpenFinCatId(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors ${cat.type === opt
                                  ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                  : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                  }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                <SaveButton
                  onClick={handleSaveCategories}
                  defaultText="Salvar Categorias"
                  savedText="Categorias Salvas"
                  isDarkMode={isDarkMode}
                />
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
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tipo de Comissão Padrão</label>
                    {(() => {
                      const comissaoOptions = ['Porcentagem (%)', 'Valor Fixo (R$)'];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsComissaoDropdownOpen(!isComissaoDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                          >
                            <span>{tipoComissao}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isComissaoDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isComissaoDropdownOpen && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {comissaoOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => { setTipoComissao(opt); setIsComissaoDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${tipoComissao === opt
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Valor/Porcentagem Padrão</label>
                    <input
                      type="text"
                      value={valorComissao}
                      onChange={(e) => setValorComissao(e.target.value)}
                      className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <SaveButton
                  onClick={handleSaveCommission}
                  defaultText="Salvar Regras"
                  savedText="Regras Salvas"
                  isDarkMode={isDarkMode}
                />
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
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Regime Tributário</label>
                    {(() => {
                      const regimeOptions = ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI'];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsRegimeDropdownOpen(!isRegimeDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                          >
                            <span>{regimeTributario}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isRegimeDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isRegimeDropdownOpen && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {regimeOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => { setRegimeTributario(opt); setIsRegimeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${regimeTributario === opt
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Alíquota de ISS (%)</label>
                    <input
                      type="text"
                      value={aliquotaIss}
                      onChange={(e) => setAliquotaIss(e.target.value)}
                      className={`w-full ${isDarkMode ? "bg-[#121214] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors`}
                    />
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
                <SaveButton
                  onClick={handleSaveFiscal}
                  defaultText="Salvar Dados Fiscais"
                  savedText="Dados Salvos"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        )}

        {activeSettingsMenu === 'Segurança & Acessos' && role === 'admin' && (
          <div className="flex-1 flex flex-col max-w-4xl overflow-y-auto pr-4 custom-scrollbar">
            <div className="mb-8 shrink-0">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"} mb-1`}>Segurança & Acessos</h2>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Controle de tempo de sessão e políticas de segurança globais.</p>
            </div>

            <div className={` ${isDarkMode ? "bg-[#0c0c0e] border-zinc-800/80 shadow-black/50" : "bg-[var(--bg-card)] border-[var(--border-default)] shadow-[var(--card-shadow)]"} border rounded-xl p-6 mb-8 transition-colors duration-300 shrink-0 `}>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-zinc-400" size={20} />
                <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Inatividade e Logout Automático</h3>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm text-zinc-400">Proteja a clínica de acessos indevidos definindo um tempo máximo de inatividade. O sistema deslogará todos os usuários (incluindo admins) automaticamente ao bater esse limite.</p>

                <div className="w-64 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tempo Limite Global</label>
                  <div className="relative">
                    {(() => {
                      const timeoutOptions = [
                        { value: 15, label: '15 minutos (Recomendado)' },
                        { value: 30, label: '30 minutos' },
                        { value: 60, label: '1 hora' },
                        { value: 120, label: '2 horas' },
                        { value: 0, label: 'Desativado (Nunca deslogar)' }
                      ];
                      const selectedOpt = timeoutOptions.find(opt => opt.value === timeoutConfig.inactivityTimeout);
                      const displayLabel = selectedOpt ? selectedOpt.label : 'Selecione';

                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsTimeoutDropdownOpen(!isTimeoutDropdownOpen)}
                            className={`w-full flex items-center justify-between ${isDarkMode ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left`}
                          >
                            <span>{displayLabel}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isTimeoutDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isTimeoutDropdownOpen && (
                            <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'border-zinc-700/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'}`}>
                              {timeoutOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => { setTimeoutConfig({ inactivityTimeout: opt.value }); setIsTimeoutDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${timeoutConfig.inactivityTimeout === opt.value
                                    ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                                    : isDarkMode ? 'text-white hover:bg-white/5' : 'text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <SaveButton
                  onClick={async () => {
                    try {
                      await setDoc(doc(db, 'configuracoes', 'seguranca'), timeoutConfig);
                      await logAuditEvent({
                        userId: auth.currentUser?.uid || 'unknown',
                        userEmail: auth.currentUser?.email || 'unknown',
                        userName: auth.currentUser?.displayName || 'Admin',
                        action: 'ALTEROU_CONFIGURACAO',
                        module: 'Segurança',
                        details: `Alterou o timeout de sessão para ${timeoutConfig.inactivityTimeout} minutos.`
                      });
                    } catch (e) {
                      console.error('Erro ao salvar segurança:', e);
                      throw e; // throw unhandled so SaveButton fails, though handle is mostly UI here
                    }
                  }}
                  defaultText="Salvar Configurações"
                  savedText="Configurações Salvas"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            <AuditLogPanel isDarkMode={isDarkMode} />
          </div>
        )}

      </div>
    </div>
  );
};

export default function App() {
  useDynamicPWA();
  const { user, users, updateUserStatus, isAuthLoading } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  const isAuthenticated = !!user;
  const currentUserEmail = user?.email || '';
  const role = user?.role || 'profissional';

  const [userStatuses, setUserStatuses] = useState<Record<string, any>>({});
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeSettingsMenu, setActiveSettingsMenu] = useState('Conta & Organização');
  const [matrixRole, setMatrixRole] = useState<'admin' | 'profissional'>('admin');
  const [activeTab, setActiveTab] = useState('Pendentes');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPatientForReceituario, setSelectedPatientForReceituario] = useState<string | null>(null);
  const [selectedPatientForClientes, setSelectedPatientForClientes] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeClientesSubTab, setActiveClientesSubTab] = useState<'TODOS' | 'ANIVERSARIANTES' | 'FREQUENCIA'>('TODOS');
  const [birthdayMonth, setBirthdayMonth] = useState<number>(new Date().getMonth());
  const [birthdayYear, setBirthdayYear] = useState<number>(new Date().getFullYear());
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Olá! Sou o Estetix AI. Como posso ajudar com a gestão da sua clínica hoje?' }
  ]);
  const [clinicConfig, setClinicConfig] = useState({
    logoUrl: null as string | null,
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    nomeResponsavel: '',
    conselhoClasse: 'CRM',
    registroConselho: ''
  });

  // Sync clinicConfig from Firestore
  useEffect(() => {
    if (isAuthenticated) {
      const docRef = doc(db, 'configuracoes', 'conta_organizacao');
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setClinicConfig(prev => ({ ...prev, ...data }));
        }
      });
      return () => unsub();
    }
  }, [isAuthenticated]);

  const [aiConfig, setAiConfig] = useState({
    nomeAssistente: '',
    tomDeVoz: 'Empático e Acolhedor',
    systemPrompt: '',
    restricoes: '',
    diferenciais: '',
    faqs: [] as { q: string; a: string }[],
    apiProvider: '',
    apiKeyMasked: '',
    apiKey: '',
    aiModel: ''
  });

  // Sync aiConfig from Firestore
  useEffect(() => {
    if (isAuthenticated) {
      const docRef = doc(db, 'configuracoes', 'ia_automacao');
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAiConfig(prev => ({ ...prev, ...data }));
        }
      });
      return () => unsub();
    }
  }, [isAuthenticated]);

  const [timeoutConfig, setTimeoutConfig] = useState({ inactivityTimeout: 30 });

  // Sync timeoutConfig from Firestore
  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      const docRef = doc(db, 'configuracoes', 'seguranca');
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.inactivityTimeout !== undefined) {
            setTimeoutConfig({ inactivityTimeout: data.inactivityTimeout });
          }
        }
      });
      return () => unsub();
    }
  }, [isAuthenticated, role]);

  // Sync theme class on <html> element for CSS custom properties
  React.useEffect(() => {
    // Force dark mode on login screen regardless of saved preference
    const effectiveDarkMode = isAuthenticated ? isDarkMode : true;
    
    if (effectiveDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    if (isAuthenticated) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isAuthenticated]);
  // isAuthLoading removed from here to follow hook order
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'clientes');
        onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map(d => {
            const raw = d.data();
            return {
              ...raw,
              id: d.id,
              notes: decryptField(raw.notes || ''),
              history: (raw.history || []).map((h: any) => ({
                ...h,
                content: decryptField(h.content || '')
              }))
            };
          });
          setPatients(data);
        }, () => { setPatients([]); });
      } catch { }
    }
  }, [isAuthenticated]);
  const [professionals, setProfessionals] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'profissionais');
        onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map(d => d.data());
          setProfessionals(data);
        }, () => { setProfessionals([]); });
      } catch { }
    }
  }, [isAuthenticated]);
  const [columns, setColumns] = useState<{ id: string, title: string, cardIds: string[] }[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const initCrmDb = async () => {
        try {
          const colRef = collection(db, 'crm_columns');
          const snap = await getDocs(colRef);

          if (snap.empty) {

            const batch = writeBatch(db);
            const defaultCols = [
              { id: 'col-1', title: 'Novos Leads', cardIds: [], order: 0 },
              { id: 'col-2', title: 'Em Atendimento', cardIds: [], order: 1 },
              { id: 'col-3', title: 'Agendados', cardIds: [], order: 2 },
              { id: 'col-4', title: 'Concluídos', cardIds: [], order: 3 },
              { id: 'col-5', title: 'Perdidos', cardIds: [], order: 4 },
            ];

            defaultCols.forEach(col => {
              const docRef = doc(db, 'crm_columns', col.id);
              batch.set(docRef, col);
            });
            await batch.commit();
          }

          const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(d => d.data() as any);


            // Ordene em memória para evitar problemas com documentos sem o campo 'order'
            data.sort((a, b) => (a.order || 0) - (b.order || 0));

            setColumns(data);
          }, () => { });

          return () => unsubscribe();
        } catch { }
      };
      initCrmDb();
    }
  }, [isAuthenticated]);
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'servicos');
        onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map(d => d.data());
          setServices(data);
        }, () => { setServices([]); });
      } catch { }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'agendamentos');
        onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map(d => d.data());
          setAppointments(data);
        }, () => { setAppointments([]); });
      } catch { }
    }
  }, [isAuthenticated]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'financeiro');
        const q = query(colRef);
        onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(d => d.data());
          setExpenses(data);
        }, () => { setExpenses([]); });
      } catch { }
    }
  }, [isAuthenticated]);

  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const colRef = collection(db, 'estoque');
        onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map(d => d.data());
          setInventory(data);
        }, () => { setInventory([]); });
      } catch { }
    }
  }, [isAuthenticated]);

  const [profissionalPermissions, setProfissionalPermissions] = useState<ModulePermissions>({
    dashboard: { view: true, create: false, edit: false, delete: false },
    crm: { view: true, create: true, edit: false, delete: false },
    clientes: { view: true, create: true, edit: true, delete: false },
    receituario: { view: true, create: true, edit: true, delete: false },
    agenda: { view: true, create: true, edit: true, delete: true },
    financeiro: { view: false, create: false, edit: false, delete: false },
    relatorios: { view: true, create: false, edit: false, delete: false },
    estoque: { view: true, create: true, edit: false, delete: false },
    profissionais: { view: false, create: false, edit: false, delete: false },
    servicos: { view: false, create: false, edit: false, delete: false },
  });

  // Fetch das permissões salvas no Firestore
  useEffect(() => {
    const fetchPermissions = async () => {
      if (isAuthenticated) {
        try {
          const docRef = doc(db, 'configuracoes', 'regras_acesso');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().profissional) {
            setProfissionalPermissions(docSnap.data().profissional as ModulePermissions);
          }
        } catch { }
      }
    };
    fetchPermissions();
  }, [isAuthenticated]);

  const handleLogin = (email: string) => {
    // Removida velha regra "admin" com mocks e estados hardcoded da UI antiga
    // Autenticação agora é orientada de forma reativa pelo estado unificado do Firebase em AuthContext.tsx
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveMenu('Dashboard');
    } catch { }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  if (role === 'profissional') {
    const status = user?.status;
    if (status === 'PENDING') return <PendingScreen onLogout={handleLogout} isDarkMode={isDarkMode} />;
    if (status === 'REJECTED' || status === 'denied') return <DeniedScreen onLogout={handleLogout} isDarkMode={isDarkMode} />;
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
    profissionais: { view: true, create: true, edit: true, delete: true },
    servicos: { view: true, create: true, edit: true, delete: true },
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
    { id: 'profissionais', name: 'Profissionais' },
    { id: 'servicos', name: 'Serviços' },
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

  const pendingUsers = users.filter((u) => u.status === 'PENDING').map(u => [u.email, u.status, u.id, u.name]);
  const approvedUsers = users.filter((u) => u.status === 'APPROVED' && u.role !== 'admin').map(u => [u.email, u.status, u.id, u.name]);
  const deniedUsers = users.filter((u) => u.status === 'REJECTED').map(u => [u.email, u.status, u.id, u.name]);

  const handleApprove = (userId: string) => {
    updateUserStatus(userId, 'APPROVED');
    const approvedUser = users.find(u => u.id === userId);
    logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Admin', action: 'APROVOU_USUARIO', module: 'Usuários', details: `Aprovou o usuário: ${approvedUser?.name || userId}.` });
    // Adicionar profissional aprovado à lista de profissionais automaticamente
    if (approvedUser) {
      const alreadyAdded = professionals.some(p => p.id === userId);
      if (!alreadyAdded) {
        const colors = ['#ef4444', '#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setProfessionals(prev => [...prev, {
          id: userId,
          name: approvedUser.name,
          specialty: '',
          color: randomColor,
          active: true
        }]);
      }
    }
  };

  const handleDeny = (userId: string) => {
    updateUserStatus(userId, 'REJECTED');
    const deniedUser = users.find(u => u.id === userId);
    logAuditEvent({ userId: auth.currentUser?.uid || '', userEmail: auth.currentUser?.email || '', userName: auth.currentUser?.displayName || 'Admin', action: 'REJEITOU_USUARIO', module: 'Usuários', details: `Rejeitou o usuário: ${deniedUser?.name || userId}.` });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'configuracoes', 'regras_acesso');
      await setDoc(docRef, { profissional: profissionalPermissions }, { merge: true });
      // Simula feedback para UX
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar regras de acesso:", error);
      setIsSaving(false);
      alert("Houve um erro ao salvar suas permissões. Tente novamente.");
    }
  };

  return (
    <div className="flex h-[100dvh] font-sans overflow-hidden selection:bg-orange-500/30 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative flex flex-col z-50 h-[100dvh] transition-all duration-300 ease-in-out z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ borderRight: '1px solid var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)' }}>
        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-7 w-7 h-7 items-center justify-center rounded-full border transition-all z-50 shadow-sm hover:border-orange-500/50 hover:text-orange-500 group"
          style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)', color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Logo */}
        <div className={`h-20 flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'} shrink-0`} style={{ borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex shrink-0 items-center justify-center">
              <Asterisk style={{ color: 'var(--bg-base)' }} size={20} />
            </div>
            {!isSidebarCollapsed && <span className="font-semibold text-xl tracking-tight transition-opacity duration-300" style={{ color: 'var(--text-primary)' }}>EstéticaPro</span>}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          <div className={`text-[10px] font-bold mb-2 px-2 tracking-widest uppercase transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 h-0 hidden' : 'opacity-100'}`} style={{ color: 'var(--text-tertiary)' }}>Menu</div>
          {activeUserPermissions.dashboard?.view && <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeMenu === 'Dashboard'} onClick={() => setActiveMenu('Dashboard')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.agenda?.view && <NavItem icon={<Calendar size={18} />} label="Agenda" active={activeMenu === 'Agenda'} onClick={() => setActiveMenu('Agenda')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.crm?.view && <NavItem icon={<BarChart3 size={18} />} label="CRM" active={activeMenu === 'CRM'} onClick={() => setActiveMenu('CRM')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.clientes?.view && <NavItem icon={<Users size={18} />} label="Clientes" active={activeMenu === 'Clientes'} onClick={() => setActiveMenu('Clientes')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.receituario?.view && <NavItem icon={<FileSignature size={18} />} label="Receituário" active={activeMenu === 'Receituário'} onClick={() => setActiveMenu('Receituário')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.profissionais?.view && <NavItem icon={<User size={18} />} label="Profissionais" active={activeMenu === 'Profissionais'} onClick={() => setActiveMenu('Profissionais')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.servicos?.view && <NavItem icon={<Briefcase size={18} />} label="Serviços" active={activeMenu === 'Serviços'} onClick={() => setActiveMenu('Serviços')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.estoque?.view && <NavItem icon={<Box size={18} />} label="Estoque" active={activeMenu === 'Estoque'} onClick={() => setActiveMenu('Estoque')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.financeiro?.view && <NavItem icon={<DollarSign size={18} />} label="Financeiro" active={activeMenu === 'Financeiro'} onClick={() => setActiveMenu('Financeiro')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
          {activeUserPermissions.relatorios?.view && <NavItem icon={<PieChart size={18} />} label="Relatórios" active={activeMenu === 'Relatórios'} onClick={() => setActiveMenu('Relatórios')} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />}
        </div>

        {/* Bottom Menu */}
        <div className="p-4 flex flex-col gap-1 shrink-0" style={{ borderTop: '1px solid var(--border-default)' }}>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isSidebarCollapsed ? (isDarkMode ? 'Modo Claro' : 'Modo Escuro') : undefined}
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-all mb-1`}
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-hover-text)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sidebar-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!isSidebarCollapsed && <span className="text-sm font-medium">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>

          {role === 'admin' && (
            <NavItem icon={<Settings size={18} />} label="Configurações" active={activeMenu === 'Configurações'} onClick={() => {
              setActiveMenu('Configurações');
              setActiveSettingsMenu('Conta & Organização');
            }} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />
          )}
          <NavItem icon={<LogOut size={18} />} label="Sair" active={false} onClick={handleLogout} isDarkMode={isDarkMode} collapsed={isSidebarCollapsed} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Global Header */}
        <div className="lg:hidden shrink-0 h-16 px-4 flex items-center justify-between border-b z-30" style={{ borderBottomColor: 'var(--border-default)', backgroundColor: 'var(--bg-base)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover-bg)]"
            >
              <Menu size={24} />
            </button>
            <div className="font-semibold text-lg text-[var(--text-primary)]">{activeMenu}</div>
          </div>
          <div className="w-8 h-8 bg-orange-500/10 rounded-full flex justify-center items-center text-orange-500">
            <User size={16} />
          </div>
        </div>

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
            clinicConfig={clinicConfig}
            setClinicConfig={setClinicConfig}
            aiConfig={aiConfig}
            setAiConfig={setAiConfig}
            timeoutConfig={timeoutConfig}
            setTimeoutConfig={setTimeoutConfig}
          />
        ) : activeMenu === 'Dashboard' ? (
          <DashboardView inventory={inventory} setActiveMenu={setActiveMenu} appointments={appointments} services={services} expenses={expenses} patients={patients} professionals={professionals} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Agenda' ? (
          <AgendaView 
            professionals={professionals} 
            services={services} 
            appointments={appointments} 
            setAppointments={setAppointments} 
            setPatients={setPatients}
            onCompleteService={handleCompleteService} 
            isDarkMode={isDarkMode} 
            patients={patients} 
            onNavigateToPatient={(patientOrId: string) => {
              const foundById = patients?.find((p: any) => p.id === patientOrId);
              const foundByName = !foundById ? patients?.find((p: any) => 
                p.name?.toLowerCase().trim() === patientOrId?.toLowerCase().trim()
              ) : null;
              const target = foundById || foundByName;
              setSelectedPatientForClientes(target?.id || null);
              setActiveMenu('Clientes');
            }} 
          />
        ) : activeMenu === 'CRM' ? (
          <CrmView patients={patients} setPatients={setPatients} columns={columns} setColumns={setColumns} onGenerateReceituario={handleGenerateReceituario} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Clientes' ? (
          <ClientesView patients={patients} setPatients={setPatients} appointments={appointments} columns={columns} onGenerateReceituario={handleGenerateReceituario} initialActivePatientId={selectedPatientForClientes} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Receituário' ? (
          <ReceituarioView patients={patients} professionals={professionals} selectedPatientId={selectedPatientForReceituario} isDarkMode={isDarkMode} clinicConfig={clinicConfig} />
        ) : activeMenu === 'Profissionais' ? (
          <ProfissionaisView professionals={professionals} setProfessionals={setProfessionals} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Serviços' ? (
          <ServicosView services={services} setServices={setServices} inventory={inventory} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Estoque' ? (
          <EstoqueView inventory={inventory} setInventory={setInventory} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Financeiro' ? (
          <FinanceiroView expenses={expenses} setExpenses={setExpenses} isDarkMode={isDarkMode} />
        ) : activeMenu === 'Relatórios' ? (
          <RelatoriosView isDarkMode={isDarkMode} expenses={expenses} appointments={appointments} patients={patients} services={services} professionals={professionals} />
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
