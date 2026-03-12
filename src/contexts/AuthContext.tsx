import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConfig } from './ConfigContext';
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, collection, limit, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type Role = 'admin' | 'profissional';
export type AccessStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface User {
  id: string; // uid
  name: string; // no firebase auth name by default unless set, keep email or email prefix
  email: string;
  role: Role; // from firestore 'perfil'
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
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Definir persistência para fechar junto com a aba
    setPersistence(auth, browserSessionPersistence).catch(() => {});

    let cleanupInner: (() => void) | undefined;

    // 1. Escuta Ativa e Consulta ao Firestore
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Limpar listeners do ciclo anterior
      if (cleanupInner) {
        cleanupInner();
        cleanupInner = undefined;
      }

      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
          let unsubscribeUsers: (() => void) | undefined;
          
          const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUser({
                id: firebaseUser.uid,
                name: data.name || firebaseUser.email?.split('@')[0] || 'Usuário',
                email: firebaseUser.email || '',
                role: data.perfil as Role,
                status: (data.status as AccessStatus) || 'APPROVED'
              });
              
              if (data.perfil === 'admin') {
                if (!unsubscribeUsers) {
                  unsubscribeUsers = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
                    const usersData: User[] = [];
                    snapshot.forEach((uDoc) => {
                      const uData = uDoc.data();
                      usersData.push({
                        id: uData.uid,
                        name: uData.nome || uData.email?.split('@')[0] || 'Usuário',
                        email: uData.email || '',
                        role: uData.perfil as Role,
                        status: (uData.status as AccessStatus) || 'APPROVED'
                      });
                    });
                    setUsers(usersData);
                  });
                }
              } else {
                 if (unsubscribeUsers) {
                   unsubscribeUsers();
                   unsubscribeUsers = undefined;
                 }
                 setUsers([]);
              }
              
              setIsAuthLoading(false);
            } else {
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.email?.split('@')[0] || 'Usuário',
                email: firebaseUser.email || '',
                role: 'profissional',
                status: 'REJECTED'
              });
              if (unsubscribeUsers) {
                unsubscribeUsers();
                unsubscribeUsers = undefined;
              }
              setUsers([]);
              setIsAuthLoading(false);
            }
          }, () => {
            setUser(null);
            if (unsubscribeUsers) unsubscribeUsers();
            setUsers([]);
            setIsAuthLoading(false);
          });

          cleanupInner = () => {
            unsubscribeSnapshot();
            if (unsubscribeUsers) unsubscribeUsers();
          };
        } else {
          setUser(null);
          setUsers([]);
          setIsAuthLoading(false);
        }
      } catch {
        setUser(null);
        setIsAuthLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (cleanupInner) cleanupInner();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    // O login real agora é feito nos componentes (ex: Login.tsx) usando signInWithEmailAndPassword,
    // mas mantemos compatibilidade de tipagem, ou apenas log para debug.

  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const register = async (name: string, email: string, password?: string, role?: Role) => {

    return { user: null };
  };

  const updateUserStatus = async (userId: string, newStatus: AccessStatus) => {
    if (user?.role !== 'admin') return;
    try {
      await setDoc(doc(db, 'usuarios', userId), { status: newStatus }, { merge: true });
    } catch {
      // Firestore rules enforce admin-only, silently fail on frontend
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, updateUserStatus, isLoading, isAuthLoading }}>
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
