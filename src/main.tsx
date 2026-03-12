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
import { PwaInstallPrompt } from './components/pwa/PwaInstallPrompt';
import { IosInstallPrompt } from './components/pwa/IosInstallPrompt';
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegistered(r) {
      console.log('SW Registered:', r?.scope);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AutoLogoutProvider>
        <ConfigProvider>
          <ThemeProvider>
            <PermissionProvider>
              <ToastProvider>
                <App />
                <PwaInstallPrompt />
                <IosInstallPrompt />
              </ToastProvider>
            </PermissionProvider>
          </ThemeProvider>
        </ConfigProvider>
      </AutoLogoutProvider>
    </AuthProvider>
  </StrictMode>,
);
