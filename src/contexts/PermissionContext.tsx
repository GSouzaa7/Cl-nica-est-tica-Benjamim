import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (code: string) => boolean;
  refreshPermissions: () => void;
  isLoading: boolean;
}

const ALL_MODULES = [
  'dashboard', 'agenda', 'crm', 'clientes', 'profissionais',
  'servicos', 'estoque', 'financeiro', 'relatorios'
];

const ADMIN_PERMISSIONS = [
  ...ALL_MODULES.map(m => `access_${m}`),
  'access_configuracoes',
  'manage_roles',
  'manage_permissions'
];

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      return;
    }

    if (user.role === 'admin') {
      setPermissions(ADMIN_PERMISSIONS);
      return;
    }

    // Profissional: buscar permissões reais do Firestore
    setIsLoading(true);
    const unsub = onSnapshot(
      doc(db, 'configuracoes', 'regras_acesso'),
      (snap) => {
        if (snap.exists()) {
          const rules = snap.data()?.profissional;
          if (rules) {
            const derived: string[] = [];
            for (const module of ALL_MODULES) {
              if (rules[module]?.view) {
                derived.push(`access_${module}`);
              }
            }
            setPermissions(derived);
          } else {
            setPermissions([]);
          }
        } else {
          setPermissions([]);
        }
        setIsLoading(false);
      },
      () => {
        setPermissions([]);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const hasPermission = (code: string) => permissions.includes(code);

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, refreshPermissions: () => {}, isLoading }}>
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

  if (isLoading) return null;

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
