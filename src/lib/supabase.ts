export type SupabaseClient = any;

let supabaseInstance: any = null;

const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [] }),
        single: () => Promise.resolve({ data: null })
      }),
      insert: () => ({ select: () => Promise.resolve({ data: [] }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null }), match: () => Promise.resolve({ data: null }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null }) })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  };
};

export const getSupabase = (): any => {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createMockClient();
  return supabaseInstance;
};

export const resetSupabase = () => {
  supabaseInstance = null;
};

export const hasSupabaseConfig = () => {
  return true;
};
