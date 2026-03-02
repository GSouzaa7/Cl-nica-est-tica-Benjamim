import { SupabaseClient } from './supabase';

export interface AuditLog {
  page_name: string;
  issue_found: string;
  improvement_applied: string;
}

export const saveAuditLog = async (supabase: SupabaseClient, log: AuditLog) => {
  try {
    const { error } = await supabase
      .from('ui_audit_logs')
      .insert([log]);

    if (error) {
      // If table doesn't exist, we just log it for now as per requirements
      if (error.code === '42P01') {
        console.warn('Tabela ui_audit_logs não existe. Crie-a no Supabase.');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Erro ao salvar log de auditoria:', error);
  }
};
