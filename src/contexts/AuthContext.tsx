import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConfig } from './ConfigContext';

export type Role = 'ADMIN' | 'PROFESSIONAL';
export type AccessStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccessStatus;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password?: string, role?: Role) => Promise<any>;
  updateUserStatus: (userId: string, status: AccessStatus) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { supabase } = useConfig();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          status,
          roles (
            name
          )
        `);
      
      if (error) throw error;
      
      if (data) {
        const mappedUsers: User[] = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          status: u.status as AccessStatus,
          role: (u.roles?.name || 'PROFESSIONAL') as Role
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchCurrentUser = async (userId: string) => {
    if (!supabase) return;
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao buscar usuário')), 10000)
      );
      
      const { data, error } = await Promise.race([
        supabase
          .from('users')
          .select(`
            id,
            name,
            email,
            status,
            roles (
              name
            )
          `)
          .eq('id', userId)
          .single(),
        timeoutPromise
      ]) as any;
        
      if (error) {
        if (error.code === 'PGRST116') {
          // User not found in public.users (likely created before trigger)
          // Let's try to create them now
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            const isFirstUser = users.length === 0;
            const assignedRoleName = isFirstUser ? 'ADMIN' : 'PROFESSIONAL';
            const assignedStatus = isFirstUser ? 'APPROVED' : 'PENDING';
            
            const { data: roleData } = await supabase
              .from('roles')
              .select('id')
              .eq('name', assignedRoleName)
              .single();
              
            if (roleData) {
              await supabase.from('users').insert([{
                id: userId,
                name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'User',
                email: authUser.user.email,
                role_id: roleData.id,
                status: assignedStatus
              }]);
              
              // Retry fetching
              const { data: retryData, error: retryError } = await supabase
                .from('users')
                .select(`id, name, email, status, roles (name)`)
                .eq('id', userId)
                .single();
                
              if (!retryError && retryData) {
                setUser({
                  id: retryData.id,
                  name: retryData.name,
                  email: retryData.email,
                  status: retryData.status as AccessStatus,
                  role: (retryData.roles?.name || 'PROFESSIONAL') as Role
                });
                return;
              }
            }
          }
        }
        throw error;
      }
      
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          status: data.status as AccessStatus,
          role: (data.roles?.name || 'PROFESSIONAL') as Role
        });
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchCurrentUser(session.user.id);
        await fetchUsers();
      } else {
        setUser(null);
        setUsers([]);
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchCurrentUser(session.user.id);
        await fetchUsers();
      } else {
        setUser(null);
        setUsers([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password?: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    if (!password) throw new Error('Password required');
    
    console.log('Iniciando login para:', email);
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tempo limite de conexão excedido. Verifique sua internet ou o status do Supabase.')), 15000)
    );
    
    try {
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        timeoutPromise
      ]) as any;
      
      console.log('Resposta do login:', { data, error });
      
      if (error) throw error;
      
      // Force a fetch of the current user to ensure state is updated before returning
      if (data?.user) {
        await fetchCurrentUser(data.user.id);
      }
    } catch (err) {
      console.error('Erro no login:', err);
      throw err;
    }
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const register = async (name: string, email: string, password?: string, role: Role = 'PROFESSIONAL') => {
    if (!supabase) throw new Error('Supabase not configured');
    if (!password) throw new Error('Password required');

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');
    
    return authData;
  };

  const updateUserStatus = async (userId: string, status: AccessStatus) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
      if (user && user.id === userId) {
        setUser({ ...user, status });
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Erro ao atualizar status do usuário');
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, updateUserStatus, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
