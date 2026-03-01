import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bot, 
  Link as LinkIcon, 
  Receipt, 
  Palette 
} from 'lucide-react';
import { PermissionMatrix } from '../../components/settings/PermissionMatrix';
import { AccessManagement } from './AccessManagement';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('permissions');

  const menuItems = [
    { id: 'organization', icon: Building2, label: 'Conta & Organização', desc: 'Dados e identidade da clínica' },
    { id: 'permissions', icon: Users, label: 'Usuários & Permissões', desc: 'RBAC, acessos e segurança' },
    { id: 'ai', icon: Bot, label: 'IA & Automação', desc: 'Assistente, governança e logs' },
    { id: 'api', icon: LinkIcon, label: 'API & Integrações', desc: 'Chaves, webhooks e conexões' },
    { id: 'finance', icon: Receipt, label: 'Financeiro & Fiscal', desc: 'Categorias e configuração contábil' },
    { id: 'customization', icon: Palette, label: 'Personalização', desc: 'Tema, alertas e notificações' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bricolage font-medium text-white mb-1">Control Center</h1>
        <p className="text-sm text-neutral-400">Configurações centralizadas do sistema.</p>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <div className={`text-sm font-medium ${activeTab === item.id ? 'text-indigo-400' : 'text-neutral-300'}`}>
                  {item.label}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-4 pb-20">
          {activeTab === 'permissions' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-medium text-white mb-1">Usuários & Permissões</h2>
                <p className="text-sm text-neutral-400">Controle de acesso, segurança e auditoria.</p>
              </div>
              
              <PermissionMatrix />
              
              <div className="pt-8 border-t border-white/10">
                <AccessManagement />
              </div>
            </div>
          )}
          
          {activeTab !== 'permissions' && (
            <div className="flex items-center justify-center h-64 border border-white/10 border-dashed rounded-2xl bg-[#0A0A0A]">
              <p className="text-neutral-500 text-sm">Módulo em desenvolvimento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
