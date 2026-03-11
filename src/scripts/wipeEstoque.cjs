require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipe() {
    console.log("Iniciando limpeza da coleção 'estoque' no Firestore...");
    const snap = await getDocs(collection(db, 'estoque'));
    console.log(`=> Encontrados ${snap.size} itens ficícios.`);
    for (const d of snap.docs) {
        await deleteDoc(d.ref);
    }
    console.log("=> Todos os registros de Estoque foram APAGADOS com sucesso.");
    process.exit(0);
}

wipe().catch((err) => {
    console.error("Erro no script:", err);
    process.exit(1);
});
