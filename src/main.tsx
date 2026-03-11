import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfigProvider } from './contexts/ConfigContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AutoLogoutProvider } from './contexts/AutoLogoutProvider';
import { PermissionProvider } from './contexts/PermissionContext';
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AutoLogoutProvider>
        <ConfigProvider>
          <ThemeProvider>
            <PermissionProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </PermissionProvider>
          </ThemeProvider>
        </ConfigProvider>
      </AutoLogoutProvider>
    </AuthProvider>
  </StrictMode>,
);
