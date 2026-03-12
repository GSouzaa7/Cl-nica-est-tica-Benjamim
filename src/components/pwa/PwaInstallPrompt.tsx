import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o Chrome 67 e anteriores de mostrar o prompt automaticamente
      e.preventDefault();
      // Guarda o evento para ser disparado depois
      setDeferredPrompt(e);
      // Atualiza a UI para notificar que a instalação do PWA está disponível
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Se já foi instalado
    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Mostra o prompt nativo
    deferredPrompt.prompt();
    
    // Aguarda a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    
    // Limpa o prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[#0A0A0A] border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)] rounded-2xl p-4 flex items-center justify-between gap-4 animate-[fade-in_500ms_ease-out]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
            <Download size={20} className="text-orange-500" />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">Instalar App</p>
            <p className="text-xs text-zinc-400 truncate">Acesso rápido e offline</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleInstallClick}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Instalar
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-zinc-800"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
