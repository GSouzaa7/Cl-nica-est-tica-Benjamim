import React, { useState, useEffect } from 'react';
import { Share, X } from 'lucide-react';

export function IosInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIos = /ipad|iphone|ipod/i.test(window.navigator.userAgent) && !(window as any).MSStream;
    // Detect Safari
    const isSafari = isIos && /safari/i.test(window.navigator.userAgent) && !/crios/i.test(window.navigator.userAgent) && !/fxios/i.test(window.navigator.userAgent);
    // Detect PWA standalone mode
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;

    // Check if dismissed previously to avoid annoyance (opt: sessionStorage/localStorage)
    const hasDismissed = sessionStorage.getItem('ios_pwa_dismissed');

    if (isIos && isSafari && !isStandalone && !hasDismissed) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-[slide-in_300ms_ease-out] pb-8 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 shadow-2xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-start gap-4 max-w-md mx-auto relative">
        <div className="bg-zinc-800 p-2 rounded-xl shrink-0">
          <Share size={24} className="text-blue-500" />
        </div>
        <div className="flex-1 pt-1 pr-6">
          <p className="text-white text-sm font-medium leading-tight mb-1">
            Instalar Aplicativo
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Para instalar no iPhone, toque no ícone de <span className="text-white font-semibold">Compartilhar</span> na barra inferior do Safari e depois em <span className="text-white font-semibold flex-inline items-center justify-center">Adicionar à Tela de Início <span className="inline-block p-0.5 bg-zinc-800 rounded mx-0.5"><i className="text-[10px]">+</i></span></span>.
          </p>
        </div>
        <button 
          onClick={() => {
            setShowPrompt(false);
            sessionStorage.setItem('ios_pwa_dismissed', 'true');
          }}
          className="absolute top-0 right-0 p-2 -mr-2 -mt-2 text-zinc-500 hover:text-zinc-300 transition-colors bg-transparent border-none"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
