/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
const missing = requiredKeys.filter(k => !firebaseConfig[k]);

let app;
try {
    if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
    }
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
    console.error("[FIREBASE] Falha na inicialização:", error);
    // Em caso de erro crítico, criamos um mock mínimo para evitar crash no import
    app = { options: firebaseConfig } as any;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
