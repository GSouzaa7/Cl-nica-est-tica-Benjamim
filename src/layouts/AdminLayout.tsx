import React from 'react';
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
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bricolage text-primary-400 tracking-tight">Estética Avançada</h1>
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
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`
                }
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
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="stars absolute inset-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/5 blur-[120px] rounded-full"></div>
        </div>
        <div className="relative z-10 p-8 h-full">
          <Outlet />
        </div>
        
        {/* Virtual Assistant Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform z-50">
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></span>
        </button>
      </main>
    </div>
  );
};
