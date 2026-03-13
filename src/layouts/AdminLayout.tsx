import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Briefcase,
  Package,
  DollarSign,
  BarChart2,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', permission: 'access_dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda', permission: 'access_agenda' },
    { icon: Users, label: 'CRM', path: '/admin/crm', permission: 'access_crm' },
    { icon: UserCircle, label: 'Clientes', path: '/admin/clientes', permission: 'access_clientes' },
    { icon: Briefcase, label: 'Profissionais', path: '/admin/profissionais', permission: 'access_profissionais' },
    { icon: Package, label: 'Serviços', path: '/admin/servicos', permission: 'access_servicos' },
    { icon: Package, label: 'Estoque', path: '/admin/estoque', permission: 'access_estoque' },
    { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro', permission: 'access_financeiro' },
    { icon: BarChart2, label: 'Relatórios', path: '/admin/relatorios', permission: 'access_relatorios' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Overlay mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative flex flex-col z-50 h-[100dvh] w-64 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-r border-white/5 bg-[#050505] flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h1 className="text-xl font-bricolage text-primary-400 tracking-tight">Estética Avançada</h1>
            <button
              className="lg:hidden text-neutral-500 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              ✕
            </button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Menu
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              hasPermission(item.permission) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-1">
            {hasPermission('access_configuracoes') && (
              <NavLink
                to="/admin/configuracoes"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5" />
                Configurações
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-xl text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0">
        {/* Header mobile */}
        <div className="lg:hidden relative z-20 h-14 px-4 flex items-center justify-between border-b border-white/5 bg-[#050505]/95 backdrop-blur">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="sr-only">Abrir menu</span>
            {/* simples ícone de menu usando pseudo-elemento */}
            <div className="w-5 h-[2px] bg-current rounded-sm mb-1" />
            <div className="w-4 h-[2px] bg-current rounded-sm mb-1" />
            <div className="w-3 h-[2px] bg-current rounded-sm" />
          </button>
          <span className="text-sm font-medium">Administração</span>
          <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-semibold">
            AD
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="glow-blob absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
            <div className="glow-blob absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-950/20 blur-[100px] rounded-full"></div>
          </div>
          <div className="relative z-10 p-6 md:p-8 h-full">
            <Outlet />
          </div>

          {/* Virtual Assistant Button */}
          <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform z-50">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></span>
          </button>
        </div>
      </main>
    </div>
  );
};
