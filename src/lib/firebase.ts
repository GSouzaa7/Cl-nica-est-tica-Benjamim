/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy",
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
export const isFirebaseConfigured = requiredKeys.every(k => import.meta.env[`VITE_FIREBASE_${k.toUpperCase().replace(/[A-Z]/g, match => '_' + match)}`] || import.meta.env.VITE_FIREBASE_API_KEY);

const missing = requiredKeys.filter(k => firebaseConfig[k] === "dummy");
if (missing.length > 0) {
    console.warn(`[FIREBASE] Variáveis de ambiente ausentes. Usando dummy para evitar crash de módulo.`);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
