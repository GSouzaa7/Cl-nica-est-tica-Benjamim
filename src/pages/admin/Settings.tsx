import React, { useState, useEffect } from 'react';
import { getSupabase } from '../../lib/supabase';
import { Shield, Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { usePermissions } from '../../contexts/PermissionContext';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('autorizacoes');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
          <Shield className="w-5 h-5 text-orange-400" />
        </div>
        <h1 className="text-3xl font-bricolage font-light text-white">Configurações</h1>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button 
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'geral' ? 'border-orange-500 text-orange-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('geral')}
        >
          Geral
        </button>
        <button 
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'autorizacoes' ? 'border-orange-500 text-orange-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('autorizacoes')}
        >
          Autorizações (RBAC)
        </button>
      </div>

      {activeTab === 'autorizacoes' && <AuthorizationSettings />}
      {activeTab === 'geral' && <div className="text-neutral-400">Configurações gerais do sistema...</div>}
    </div>
  );
};

const AuthorizationSettings = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');
  
  const { hasPermission, refreshPermissions } = usePermissions();

  const fetchData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const [rolesRes, permsRes, rolePermsRes] = await Promise.all([
        supabase.from('roles').select('*').order('created_at'),
        supabase.from('permissions').select('*').order('code'),
        supabase.from('role_permissions').select('*')
      ]);

      if (rolesRes.data) setRoles(rolesRes.data);
      if (permsRes.data) setPermissions(permsRes.data);
      if (rolePermsRes.data) setRolePermissions(rolePermsRes.data);
      
      if (rolesRes.data && rolesRes.data.length > 0 && !selectedRole) {
        setSelectedRole(rolesRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching RBAC data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from('roles').insert([{ name: newRoleName }]).select();
      if (error) throw error;
      if (data) {
        setRoles([...roles, data[0]]);
        setNewRoleName('');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Erro ao criar role');
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('roles').delete().eq('id', id);
      if (error) throw error;
      setRoles(roles.filter(r => r.id !== id));
      if (selectedRole === id) setSelectedRole(roles[0]?.id || null);
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Erro ao excluir role');
    }
  };

  const handleTogglePermission = async (permissionId: string) => {
    if (!selectedRole) return;
    
    const isGranted = rolePermissions.some(rp => rp.role_id === selectedRole && rp.permission_id === permissionId);
    
    try {
      const supabase = getSupabase();
      if (isGranted) {
        // Remove
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .match({ role_id: selectedRole, permission_id: permissionId });
        if (error) throw error;
        setRolePermissions(rolePermissions.filter(rp => !(rp.role_id === selectedRole && rp.permission_id === permissionId)));
      } else {
        // Add
        const { data, error } = await supabase
          .from('role_permissions')
          .insert([{ role_id: selectedRole, permission_id: permissionId }])
          .select();
        if (error) throw error;
        if (data) {
          setRolePermissions([...rolePermissions, data[0]]);
        }
      }
      // Refresh context permissions in case the user is editing their own role
      await refreshPermissions();
    } catch (error) {
      console.error('Error toggling permission:', error);
      alert('Erro ao atualizar permissão');
    }
  };

  if (!hasPermission('manage_roles') && !hasPermission('manage_permissions')) {
    return <div className="text-red-400 p-4 bg-red-500/10 rounded-xl border border-red-500/20">Você não tem permissão para gerenciar autorizações.</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;
  }

  const tabPermissions = permissions.filter(p => p.type === 'tab');
  const actionPermissions = permissions.filter(p => p.type === 'action');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Roles Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Cargos (Roles)</h3>
          
          <form onSubmit={handleCreateRole} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder="Novo cargo..." 
              className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
            <button type="submit" className="bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 p-2 rounded-lg transition-colors border border-orange-500/20">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2">
            {roles.map(role => (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${selectedRole === role.id ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-[#050505] border-white/5 text-neutral-300 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.name}</span>
                  {role.is_system && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-neutral-400">Sistema</span>}
                </div>
                {!role.is_system && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                    className="text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions Panel */}
      <div className="lg:col-span-8">
        {selectedRole ? (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-lg font-medium text-white">Permissões do Cargo</h3>
                <p className="text-sm text-neutral-400">Configure o que os usuários com este cargo podem acessar e fazer.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Tab Permissions */}
              <div>
                <h4 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Acesso às Abas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tabPermissions.map(perm => {
                    const isGranted = rolePermissions.some(rp => rp.role_id === selectedRole && rp.permission_id === perm.id);
                    return (
                      <label key={perm.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#050505] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isGranted ? 'bg-orange-500 border-orange-500' : 'border-white/20 bg-transparent'}`}>
                          {isGranted && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isGranted}
                          onChange={() => handleTogglePermission(perm.id)}
                        />
                        <span className="text-sm text-neutral-300">{perm.code}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Permissions */}
              <div>
                <h4 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Permissões de Ação
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actionPermissions.map(perm => {
                    const isGranted = rolePermissions.some(rp => rp.role_id === selectedRole && rp.permission_id === perm.id);
                    return (
                      <label key={perm.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#050505] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isGranted ? 'bg-orange-500 border-orange-500' : 'border-white/20 bg-transparent'}`}>
                          {isGranted && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isGranted}
                          onChange={() => handleTogglePermission(perm.id)}
                        />
                        <span className="text-sm text-neutral-300">{perm.code}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full">
            <Shield className="w-12 h-12 text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Selecione um Cargo</h3>
            <p className="text-neutral-400 text-sm max-w-sm">Selecione um cargo na lista ao lado para configurar suas permissões de acesso e ações.</p>
          </div>
        )}
      </div>
    </div>
  );
};
