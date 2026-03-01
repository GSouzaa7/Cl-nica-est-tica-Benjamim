import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, Clock } from 'lucide-react';

export const PendingAccess = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
      <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-orange-500/20">
        <Clock className="w-12 h-12 text-orange-400" />
      </div>
      <h1 className="text-4xl font-bricolage font-light text-white mb-4">ACESSO PENDENTE</h1>
      <p className="text-neutral-400 max-w-md text-lg">
        Olá, {user?.name}. Sua solicitação de acesso foi recebida e está aguardando aprovação do administrador.
      </p>
      <p className="text-neutral-500 mt-4 text-sm">
        Você receberá uma notificação quando seu acesso for liberado.
      </p>
    </div>
  );
};

export const RevokedAccess = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/20">
        <ShieldAlert className="w-12 h-12 text-red-400" />
      </div>
      <h1 className="text-4xl font-bricolage font-light text-white mb-4">ACESSO REVOGADO</h1>
      <p className="text-neutral-400 max-w-md text-lg">
        Olá, {user?.name}. Seu acesso ao portal de profissionais foi negado ou revogado pelo administrador.
      </p>
      <p className="text-neutral-500 mt-4 text-sm">
        Entre em contato com a administração para mais informações.
      </p>
    </div>
  );
};

export const ProfessionalDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bricolage font-light text-white mb-6">Bem-vindo, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg text-white mb-2">Seus Agendamentos</h3>
          <p className="text-3xl font-bricolage text-orange-400">0</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg text-white mb-2">Pacientes Atendidos</h3>
          <p className="text-3xl font-bricolage text-orange-400">0</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg text-white mb-2">Avaliações</h3>
          <p className="text-3xl font-bricolage text-orange-400">0.0</p>
        </div>
      </div>
    </div>
  );
};
