import { initializeApp } from 'firebase/admin/app';
import { getFirestore } from 'firebase/admin/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Configurar o admin SDK com credenciais de serviço aqui requereria chave privada.
// Para evitar vazamento ou complicação de chave, vamos usar o script no frontend ou mock SDK.
