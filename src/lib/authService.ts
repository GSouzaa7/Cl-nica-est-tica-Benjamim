import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, limit, setDoc, doc, serverTimestamp, query } from "firebase/firestore";
import { auth, db } from "./firebase";

export const registrarNovoUsuario = async (email: string, senha: string, nome?: string) => {
    try {
        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            user = userCredential.user;
        } catch (createError: any) {
            // Se a conta já existe no Authentication, tentamos logar com ela
            if (createError.code === 'auth/email-already-in-use') {
                console.log("⚠️ A conta Auth já existe. Tentando autenticar p/ restaurar Firestore vinculada...");
                const userCredential = await signInWithEmailAndPassword(auth, email, senha);
                user = userCredential.user;
            } else {
                throw createError;
            }
        }

        // 2. Consulta a coleção "usuarios" para ver se está vazia
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, limit(1));
        const querySnapshot = await getDocs(q);

        // 3. Verifica se é o primeiro usuário
        if (querySnapshot.empty) {
            // SE VAZIA (Primeiro usuário do sistema):
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                email,
                nome: nome || email.split('@')[0],
                perfil: "admin",
                status: "APPROVED",
                criadoEm: serverTimestamp()
            });

            // Cria o documento regras_acesso na coleção configuracoes liberando todas as permissões para "profissional"
            await setDoc(doc(db, "configuracoes", "regras_acesso"), {
                profissional: {
                    dashboard: { view: true, create: true, edit: true, delete: true },
                    crm: { view: true, create: true, edit: true, delete: true },
                    clientes: { view: true, create: true, edit: true, delete: true },
                    receituario: { view: true, create: true, edit: true, delete: true },
                    agenda: { view: true, create: true, edit: true, delete: true },
                    financeiro: { view: true, create: true, edit: true, delete: true },
                    relatorios: { view: true, create: true, edit: true, delete: true },
                    estoque: { view: true, create: true, edit: true, delete: true },
                    profissionais: { view: true, create: true, edit: true, delete: true },
                    servicos: { view: true, create: true, edit: true, delete: true },
                },
                criadoEm: serverTimestamp()
            });
        } else {
            // Salva o documento na coleção usuarios com perfil "profissional" e status "PENDING"
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                email,
                nome: nome || email.split('@')[0],
                perfil: "profissional",
                status: "PENDING",
                criadoEm: serverTimestamp()
            });
        }

        return user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
};
