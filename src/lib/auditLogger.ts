import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface AuditLogData {
  userId: string;
  userEmail: string;
  userName: string;
  action: string;
  module: string;
  details: string;
}

export const logAuditEvent = async (data: AuditLogData) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      ...data,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Falha ao registrar log de auditoria:', error);
    // Don't throw the error to prevent breaking the main user flow. 
    // Audit logging should ideally be fire-and-forget on the client side.
  }
};
