import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipeDatabase() {
    console.log("🔥Iniciando varredura e exclusão de usuários...");
    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        if (querySnapshot.empty) {
            console.log("✅ Nenhum usuário encontrado para deletar.");
            return;
        }

        for (const document of querySnapshot.docs) {
            console.log(`🗑️ Deletando documento: ${document.id}`);
            await deleteDoc(doc(db, "usuarios", document.id));
        }

        console.log("✅ Banco de dados RESETADO! O próximo login será o PRIMEIRO (Admin).");
    } catch (e) {
        console.error("❌ Erro ao deletar:", e);
    }
}

wipeDatabase();
