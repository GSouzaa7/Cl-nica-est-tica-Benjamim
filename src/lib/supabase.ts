import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = localStorage.getItem('SUPABASE_URL');
  const supabaseKey = localStorage.getItem('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not found in LocalStorage');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
};

export const resetSupabase = () => {
  supabaseInstance = null;
};

export const hasSupabaseConfig = () => {
  return !!localStorage.getItem('SUPABASE_URL') && !!localStorage.getItem('SUPABASE_ANON_KEY');
};
