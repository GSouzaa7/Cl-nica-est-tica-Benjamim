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
  const { supabase } = useConfig();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPermissions = async () => {
    if (!user || !supabase) {
      setPermissions([]);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Get the role ID for the user's role
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', user.role)
        .single();

      if (roleError || !roleData) {
        console.error('Error fetching role:', roleError);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      // 2. Get permissions for this role
      const { data: rolePermissions, error: permError } = await supabase
        .from('role_permissions')
        .select(`
          permissions (
            code
          )
        `)
        .eq('role_id', roleData.id);

      if (permError) {
        console.error('Error fetching permissions:', permError);
        setPermissions([]);
      } else if (rolePermissions) {
        // Extract codes
        const codes = rolePermissions
          .map((rp: any) => rp.permissions?.code)
          .filter(Boolean);
        setPermissions(codes);
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
  }, [user, supabase]);

  const hasPermission = (code: string) => {
    // If it's the hardcoded ADMIN from the mock auth, we could bypass, 
    // but the requirement says "Nada deve ser hardcoded por nome de role."
    // So we strictly check the permissions array.
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
