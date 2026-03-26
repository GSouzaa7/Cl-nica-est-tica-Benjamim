
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, query, where, doc } from "firebase/firestore";

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

async function delete100Entries() {
    const colRef = collection(db, 'financeiro');
    const q = query(colRef, where('value', '==', 100));
    const snapshot = await getDocs(q);
    
    console.log(`Found ${snapshot.size} entries with value 100.`);
    for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'financeiro', d.id));
        console.log(`Deleted entry: ${d.id}`);
    }

    // Also check for 'vlr' field if applicable
    const q2 = query(colRef, where('vlr', '==', 100));
    const snapshot2 = await getDocs(q2);
    for (const d of snapshot2.docs) {
        await deleteDoc(doc(db, 'financeiro', d.id));
        console.log(`Deleted entry (vlr): ${d.id}`);
    }
}

delete100Entries();
