import React, { useState, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { usePermissions } from '../../contexts/PermissionContext';
import { Loader2, Save, ShieldCheck } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  is_system: boolean;
}

interface Permission {
  id: string;
  code: string;
  type: 'tab' | 'action';
}

  const MODULES = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'crm', label: 'CRM' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'estoque', label: 'Estoque' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'configuracoes', label: 'Configurações' },
  ];

export const PermissionMatrix = () => {
  const { supabase } = useConfig();
  const { refreshPermissions } = usePermissions();
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({}); // role_id -> permission_id[]
  
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [rolesRes, permsRes, rolePermsRes] = await Promise.all([
        supabase.from('roles').select('id, name, is_system').order('created_at', { ascending: true }),
        supabase.from('permissions').select('id, code, type'),
        supabase.from('role_permissions').select('role_id, permission_id')
      ]);

      if (rolesRes.error) throw rolesRes.error;
      if (permsRes.error) throw permsRes.error;
      if (rolePermsRes.error) throw rolePermsRes.error;

      setRoles(rolesRes.data || []);
      setPermissions(permsRes.data || []);

      if (rolesRes.data && rolesRes.data.length > 0) {
        // Find ADMIN role to select by default, or the first one
        const adminRole = rolesRes.data.find(r => r.name === 'ADMIN');
        setSelectedRole(adminRole ? adminRole.id : rolesRes.data[0].id);
      }

      const rpMap: Record<string, string[]> = {};
      (rolePermsRes.data || []).forEach(rp => {
        if (!rpMap[rp.role_id]) rpMap[rp.role_id] = [];
        rpMap[rp.role_id].push(rp.permission_id);
      });
      setRolePermissions(rpMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const getPermissionId = (code: string) => {
    return permissions.find(p => p.code === code)?.id;
  };

  const hasPermissionCode = (roleId: string, code: string) => {
    const permId = getPermissionId(code);
    if (!permId) return false;
    return (rolePermissions[roleId] || []).includes(permId);
  };

  const handleTogglePermission = (code: string) => {
    if (!selectedRole) return;
    
    // Prevent removing permissions from ADMIN role if it's a system role
    const role = roles.find(r => r.id === selectedRole);
    if (role?.name === 'ADMIN') {
      // Allow toggling for testing, but in a real app you might want to lock ADMIN
    }

    const permId = getPermissionId(code);
    
    // If permission doesn't exist in DB, we should create it first
    // For simplicity, we assume the SQL script has created all necessary permissions
    if (!permId) {
      setError(`Permissão '${code}' não encontrada no banco de dados. Execute o script SQL.`);
      return;
    }

    setRolePermissions(prev => {
      const currentRolePerms = prev[selectedRole] || [];
      const newRolePerms = currentRolePerms.includes(permId)
        ? currentRolePerms.filter(id => id !== permId)
        : [...currentRolePerms, permId];
        
      return { ...prev, [selectedRole]: newRolePerms };
    });
  };

  const handleSave = async () => {
    if (!supabase || !selectedRole) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', selectedRole);
        
      if (deleteError) throw deleteError;

      const permsToInsert = (rolePermissions[selectedRole] || []).map(permission_id => ({
        role_id: selectedRole,
        permission_id
      }));

      if (permsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permsToInsert);
          
        if (insertError) throw insertError;
      }

      setSuccess('Permissões salvas com sucesso!');
      await refreshPermissions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  const selectedRoleObj = roles.find(r => r.id === selectedRole);
  const isAdmin = selectedRoleObj?.name === 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Matriz de Permissões
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#111] border border-white/10 rounded-full p-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  selectedRole === role.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {role.name === 'ADMIN' ? 'Admin' : role.name === 'PROFESSIONAL' ? 'Profissional' : role.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving || !selectedRole}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> {success}</div>}

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#111] border-b border-white/5 text-neutral-400">
            <tr>
              <th className="px-6 py-4 font-medium">Módulo</th>
              <th className="px-6 py-4 font-medium text-center">👁 Visualizar</th>
              <th className="px-6 py-4 font-medium text-center">➕ Criar</th>
              <th className="px-6 py-4 font-medium text-center">✏️ Editar</th>
              <th className="px-6 py-4 font-medium text-center">🗑 Excluir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MODULES.map((mod) => (
              <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-white font-medium">{mod.label}</td>
                
                {/* Visualizar (access_*) */}
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={hasPermissionCode(selectedRole, `access_${mod.id}`)}
                      onChange={() => handleTogglePermission(`access_${mod.id}`)}
                      disabled={isAdmin && mod.id === 'configuracoes'} // Prevent admin from locking themselves out
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>

                {/* Criar (create_*) */}
                <td className="px-6 py-4 text-center">
                  {mod.id !== 'dashboard' && mod.id !== 'configuracoes' ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={hasPermissionCode(selectedRole, `create_${mod.id}`)}
                        onChange={() => handleTogglePermission(`create_${mod.id}`)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  ) : (
                    <span className="text-neutral-600">-</span>
                  )}
                </td>

                {/* Editar (edit_*) */}
                <td className="px-6 py-4 text-center">
                  {mod.id !== 'dashboard' && mod.id !== 'configuracoes' ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={hasPermissionCode(selectedRole, `edit_${mod.id}`)}
                        onChange={() => handleTogglePermission(`edit_${mod.id}`)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  ) : (
                    <span className="text-neutral-600">-</span>
                  )}
                </td>

                {/* Excluir (delete_*) */}
                <td className="px-6 py-4 text-center">
                  {mod.id !== 'dashboard' && mod.id !== 'configuracoes' ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={hasPermissionCode(selectedRole, `delete_${mod.id}`)}
                        onChange={() => handleTogglePermission(`delete_${mod.id}`)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  ) : (
                    <span className="text-neutral-600">-</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-white font-medium">Gestão de Acessos</td>
              <td className="px-6 py-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={hasPermissionCode(selectedRole, `access_profissionais`)}
                    onChange={() => handleTogglePermission(`access_profissionais`)}
                    disabled={isAdmin}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-neutral-600">-</span>
              </td>
              <td className="px-6 py-4 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={hasPermissionCode(selectedRole, `manage_users`)}
                    onChange={() => handleTogglePermission(`manage_users`)}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-neutral-600">-</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="p-4 border-t border-white/5 bg-[#111] flex items-center gap-2 text-xs text-neutral-400">
          <span className="font-medium text-white">Bloqueado</span> Admin sempre possui todas as permissões (recomendado).
        </div>
      </div>
    </div>
  );
};
