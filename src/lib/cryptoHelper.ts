import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_MASTER_KEY || 'default_local_master_key_123!@#';

export const encryptField = (text: string): string => {
  if (!text) return text;
  if (text.startsWith('U2FsdGVkX1')) return text; // Já encriptado
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (e) {
    console.error("Erro ao encriptar campo:", e);
    return text;
  }
};

export const decryptField = (cipherText: string): string => {
  if (!cipherText) return cipherText;
  if (!cipherText.startsWith('U2FsdGVkX1')) return cipherText; // Dado legado / limpo
  
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || cipherText; // Fallback se a chave estiver errada
  } catch (e) {
    console.error("Erro ao decriptar campo:", e);
    return cipherText;
  }
};
