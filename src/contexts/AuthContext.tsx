import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConfig } from './ConfigContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
    // 1. Escuta Ativa e Consulta ao Firestore
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Usando onSnapshot para reagir instantaneamente quando o registro (setDoc) finalizar
          const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
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
              setIsAuthLoading(false);
            } else {
              console.log("⚠️ Perfil deletado ou não existente no Firestore. Definindo status como REJECTED virtual.");
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.email?.split('@')[0] || 'Usuário',
                email: firebaseUser.email || '',
                role: 'profissional',
                status: 'REJECTED'
              });
              setIsAuthLoading(false);
            }
          }, (err) => {
            console.error("Erro no onSnapshot do usuário:", err);
            setUser(null);
            setIsAuthLoading(false);
          });

          // Precisamos retornar o unsubscribe para limpar quando o authState mudar
          return () => unsubscribeSnapshot();
        } else {
          setUser(null);
          setIsAuthLoading(false);
        }
      } catch (err) {
        console.error("Erro ao configurar listener do usuário", err);
        setUser(null);
        setIsAuthLoading(false);
      }
    });

    // Escuta global para a lista de usuários (para Admins verem no painel de Configurações)
    const unsubscribeUsers = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: data.uid,
          name: data.nome || data.email?.split('@')[0] || 'Usuário',
          email: data.email || '',
          role: data.perfil as Role,
          status: (data.status as AccessStatus) || 'APPROVED'
        });
      });
      setUsers(usersData);
    });

    return () => {
      unsubscribe();
      unsubscribeUsers();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    // O login real agora é feito nos componentes (ex: Login.tsx) usando signInWithEmailAndPassword,
    // mas mantemos compatibilidade de tipagem, ou apenas log para debug.
    console.warn('O login deve ser chamado diretamente das páginas com Firebase.');
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const register = async (name: string, email: string, password?: string, role?: Role) => {
    console.warn('O registro deve ser chamado do authService.ts mapeado nas páginas.');
    return { user: null };
  };

  const updateUserStatus = async (userId: string, newStatus: AccessStatus) => {
    try {
      await setDoc(doc(db, 'usuarios', userId), { status: newStatus }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar status do usuário", error);
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
