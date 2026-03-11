import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, limit, setDoc, doc, getDoc, serverTimestamp, query } from "firebase/firestore";
import { auth, db } from "./firebase";

export const registrarNovoUsuario = async (email: string, senha: string, nome?: string) => {
    try {
        // 1. Cria a conta no Firebase Authentication
        //    Se o email já existir, lança o erro imediatamente — sem fallback de login.
        //    Isso evita que alguém que saiba o email + senha de uma conta existente
        //    acione o fluxo de atribuição de perfil novamente.
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // 2. Verifica se já existe um documento no Firestore para esse UID.
        //    (Camada de proteção extra: mesmo que o Auth falhe na barreira acima,
        //     jamais sobrescrevemos um perfil já existente.)
        const userDocRef = doc(db, "usuarios", user.uid);
        const existingDoc = await getDoc(userDocRef);

        if (existingDoc.exists()) {
            // Documento já existe — não mexemos no perfil de forma alguma.
            console.warn("⚠️ Documento Firestore já existe para esse UID. Nenhuma alteração de perfil feita.");
            return user;
        }

        // 3. Consulta a coleção "usuarios" para saber se é o primeiro usuário
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Primeiro usuário do sistema → recebe perfil "admin"
            await setDoc(userDocRef, {
                uid: user.uid,
                email,
                nome: nome || email.split('@')[0],
                perfil: "admin",
                status: "APPROVED",
                criadoEm: serverTimestamp()
            });

            // Cria as regras de acesso padrão para o perfil "profissional"
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
            // Demais usuários → recebe perfil "profissional" e aguarda aprovação
            await setDoc(userDocRef, {
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
