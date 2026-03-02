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
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock existing users
    setUsers([
      { id: '1', name: 'Admin User', email: 'admin@estetica.com', role: 'ADMIN', status: 'APPROVED' },
      { id: '2', name: 'Pro User', email: 'pro@estetica.com', role: 'PROFESSIONAL', status: 'APPROVED' }
    ]);

    // Check if previously logged in (mock)
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    // Fake login
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const isOwner = email.toLowerCase().includes('admin');
    const mockUser: User = {
      id: isOwner ? '1' : '2',
      name: isOwner ? 'Admin User' : 'Profissional',
      email: email,
      role: isOwner ? 'ADMIN' : 'PROFESSIONAL',
      status: 'APPROVED'
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  const register = async (name: string, email: string, password?: string, role: Role = 'PROFESSIONAL') => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      status: 'PENDING'
    };
    setUsers([...users, newUser]);
    return { user: newUser };
  };

  const updateUserStatus = async (userId: string, status: AccessStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
    if (user && user.id === userId) {
      setUser({ ...user, status });
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
