import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_MASTER_KEY;

if (!SECRET_KEY) {
  console.error('[SECURITY] VITE_MASTER_KEY não está definida. A criptografia de campos sensíveis não funcionará.');
}

export const encryptField = (text: string): string => {
  if (!text || typeof text !== 'string') return text ?? '';
  if (!SECRET_KEY) return text;
  if (text.startsWith('U2FsdGVkX1')) return text;
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch {
    return text;
  }
};

export const decryptField = (cipherText: string): string => {
  if (!cipherText || typeof cipherText !== 'string') return cipherText ?? '';
  if (!cipherText.startsWith('U2FsdGVkX1')) return cipherText;
  if (!SECRET_KEY) return '[Chave de descriptografia ausente]';

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) return '[Erro de descriptografia — chave incorreta]';
    return originalText;
  } catch {
    return '[Erro de descriptografia]';
  }
};
