import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useConfig } from './ConfigContext';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (code: string) => boolean;
  refreshPermissions: () => Promise<void>;
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPermissions = async () => {
    if (!user) {
      setPermissions([]);
      return;
    }

    setIsLoading(true);
    try {
      if (user.role === 'admin') {
        setPermissions([
          'access_dashboard',
          'access_agenda',
          'access_crm',
          'access_clientes',
          'access_profissionais',
          'access_servicos',
          'access_estoque',
          'access_financeiro',
          'access_relatorios',
          'access_configuracoes',
          'manage_roles',
          'manage_permissions'
        ]);
      } else {
        setPermissions([
          'access_dashboard',
          'access_agenda',
          'access_crm',
          'access_clientes'
        ]);
      }
    } catch (error) {
      console.error('Unexpected error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user]);

  const hasPermission = (code: string) => {
    return permissions.includes(code);
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, refreshPermissions: fetchPermissions, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionGuard = ({ permission, children, fallback = null }: { permission: string, children: ReactNode, fallback?: ReactNode }) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) return null; // Or a spinner

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
