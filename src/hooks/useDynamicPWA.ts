import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useDynamicPWA() {
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'configuracoes', 'conta_organizacao'), (docSnap) => {
      const data = docSnap.exists() ? docSnap.data() : null;
      
      const appName = data?.nomeFantasia || 'Estética Pro';
      const logoUrl = data?.logoUrl || '/icon-192x192.png';
      
      // Atualizar apple-touch-icon dinamicamente com logo da clínica
      const appleIconTag = document.getElementById('dynamic-apple-icon') as HTMLLinkElement;
      if (appleIconTag) {
        appleIconTag.href = logoUrl;
      }

      // Atualizar título da página
      document.title = appName;
    });

    return () => {
      unsub();
    };
  }, []);
}
