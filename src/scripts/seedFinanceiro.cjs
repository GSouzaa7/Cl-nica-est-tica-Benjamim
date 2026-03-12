require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function seed() {
    console.log("Iniciando injeção de dados de demonstração no financeiro...");
    
    // Distribuindo 15.000 em 11 dias
    const values = [1000, 1200, 1500, 900, 1800, 2000, 800, 1500, 1300, 1600, 1400]; // sum = 15000
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    for (let i = 0; i < values.length; i++) {
        const day = String(i + 1).padStart(2, '0');
        const dueDate = `${year}-${month}-${day}`;
        const id = `seed_receita_${day}`;
        
        const expense = {
            id,
            description: `Atendimentos do dia ${day}`,
            category: 'Consultas',
            quantity: 1,
            value: values[i],
            dueDate,
            status: 'Pago',
            recurrence: 'Não',
            type: 'Receita'
        };

        await setDoc(doc(db, 'financeiro', id), expense);
        console.log(`Inserido dia ${day}: R$ ${values[i]}`);
    }

    console.log("=> Inserção concluída com sucesso. 15.000 de faturamento até hoje.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Erro no script:", err);
    process.exit(1);
});
