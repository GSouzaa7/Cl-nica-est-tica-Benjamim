import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Users, ShieldAlert } from 'lucide-react';

export const AccessManagement = () => {
  const { users, updateUserStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'AUDIT'>('PENDING');

  const professionals = users.filter((u) => u.role === 'PROFESSIONAL');
  
  const pendingCount = professionals.filter(p => p.status === 'PENDING').length;
  const activeCount = professionals.filter(p => p.status === 'APPROVED').length;
  const revokedCount = professionals.filter(p => p.status === 'REJECTED').length;

  const filteredProfessionals = professionals.filter(p => {
    if (activeTab === 'AUDIT') return false;
    return p.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-medium text-white mb-1">Gestão de Acessos</h2>
          <p className="text-sm text-neutral-400">Clínica: são gonçalo</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400 bg-[#111] px-4 py-2 rounded-full border border-white/5">
          <Users className="w-4 h-4" />
          <span>{activeCount} ativos</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'PENDING' 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendentes
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'APPROVED' 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          Ativos
        </button>
        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'REJECTED' 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Revogados
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === 'AUDIT' 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Auditoria
        </button>
      </div>

      {activeTab !== 'AUDIT' ? (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-medium text-white mb-1">
              {activeTab === 'PENDING' ? 'Solicitações Pendentes' : activeTab === 'APPROVED' ? 'Usuários Ativos' : 'Acessos Revogados'}
            </h3>
            <p className="text-sm text-neutral-400">
              {activeTab === 'PENDING' ? 'Funcionários aguardando aprovação para acessar o painel.' : activeTab === 'APPROVED' ? 'Funcionários com acesso liberado ao sistema.' : 'Funcionários que tiveram seu acesso bloqueado.'}
            </p>
          </div>
          
          {filteredProfessionals.length > 0 ? (
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-[#111] border-b border-white/5 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium text-neutral-300">Profissional</th>
                  <th className="px-6 py-4 font-medium text-neutral-300">Email</th>
                  <th className="px-6 py-4 font-medium text-neutral-300">Status</th>
                  <th className="px-6 py-4 font-medium text-neutral-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{prof.name}</td>
                    <td className="px-6 py-4">{prof.email}</td>
                    <td className="px-6 py-4">
                      {prof.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Pendente
                        </span>
                      )}
                      {prof.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 ring-1 ring-green-500/20 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Ativo
                        </span>
                      )}
                      {prof.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 ring-1 ring-red-500/20 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Revogado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {prof.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateUserStatus(prof.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-medium transition-colors"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => updateUserStatus(prof.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-medium transition-colors"
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {prof.status === 'APPROVED' && (
                        <button
                          onClick={() => updateUserStatus(prof.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors"
                        >
                          Revogar
                        </button>
                      )}
                      {prof.status === 'REJECTED' && (
                        <button
                          onClick={() => updateUserStatus(prof.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-medium transition-colors"
                        >
                          Aprovar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              Nenhum profissional encontrado nesta categoria.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-500">
          Módulo de auditoria em desenvolvimento.
        </div>
      )}
    </div>
  );
};
