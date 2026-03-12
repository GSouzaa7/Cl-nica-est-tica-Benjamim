import React, { useEffect, useState, useRef, ReactNode, createContext } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface TimeoutConfig {
  inactivityTimeout: number; // in minutes (e.g. 15, 30, 60, 0 for never)
}

interface AutoLogoutContextType {
  timeoutConfig: TimeoutConfig;
}

export const AutoLogoutContext = createContext<AutoLogoutContextType | undefined>(undefined);

export const AutoLogoutProvider = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState<TimeoutConfig>({ inactivityTimeout: 30 }); // Default 30 min
  
  // Timer ref to clear and reset
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Global Timeout Settings from Firestore
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'profissional') {
      const unsub = onSnapshot(doc(db, 'configuracoes', 'seguranca'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.inactivityTimeout !== undefined) {
            setConfig({ inactivityTimeout: data.inactivityTimeout });
          }
        }
      });
      return () => unsub();
    }
  }, [user]);

  // Handle Activity and Auto Logout Timer
  useEffect(() => {
    // If not logged in or timeout is disabled (0), do nothing
    if (!user || config.inactivityTimeout === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const logoutUser = async () => {
      await logout();
      window.location.href = '/login'; // Force redirect to login
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Convert minutes to milliseconds
      const ms = config.inactivityTimeout * 60 * 1000;
      timerRef.current = setTimeout(logoutUser, ms);
    };

    // Events that count as 'activity'
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Initialize timer
    resetTimer();

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, config.inactivityTimeout, logout]);

  return (
    <AutoLogoutContext.Provider value={{ timeoutConfig: config }}>
      {children}
    </AutoLogoutContext.Provider>
  );
};
