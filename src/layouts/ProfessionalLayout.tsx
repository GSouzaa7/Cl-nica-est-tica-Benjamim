import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';

export const ProfessionalLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed z-0 pointer-events-none top-0 right-0 bottom-0 left-0">
        <div className="glow-blob absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
        <div className="glow-blob absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-950/20 blur-[100px] rounded-full"></div>
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bricolage tracking-tight text-white">Portal do Profissional</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <UserCircle className="w-5 h-5" />
            {user?.name}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </nav>

      <main className="flex-1 relative z-10 p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
