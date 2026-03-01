import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Sparkles, Key, Database, Link as LinkIcon } from 'lucide-react';

interface Config {
  supabaseUrl: string;
  supabaseAnonKey: string;
  geminiApiKey: string;
}

interface ConfigContextType {
  config: Config | null;
  supabase: SupabaseClient | null;
  saveConfig: (config: Config) => void;
  clearConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  useEffect(() => {
    const storedConfig = localStorage.getItem('app_config');
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        if (parsed.supabaseUrl && parsed.supabaseAnonKey && parsed.geminiApiKey) {
          setConfig(parsed);
          setSupabase(createClient(parsed.supabaseUrl, parsed.supabaseAnonKey));
        } else {
          setIsModalOpen(true);
        }
      } catch (e) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const saveConfig = (newConfig: Config) => {
    localStorage.setItem('app_config', JSON.stringify(newConfig));
    setConfig(newConfig);
    setSupabase(createClient(newConfig.supabaseUrl, newConfig.supabaseAnonKey));
    setIsModalOpen(false);
  };

  const clearConfig = () => {
    localStorage.removeItem('app_config');
    setConfig(null);
    setSupabase(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig({
      supabaseUrl: url,
      supabaseAnonKey: anonKey,
      geminiApiKey: geminiKey
    });
  };

  return (
    <ConfigContext.Provider value={{ config, supabase, saveConfig, clearConfig }}>
      {children}
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-slate-200 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold tracking-tight text-center mb-2 text-slate-800">Configuração Inicial</h2>
            <p className="text-slate-500 text-center mb-8 text-sm">Insira as credenciais para conectar ao banco de dados e IA.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-slate-400" /> Supabase URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="https://xyzcompany.supabase.co"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-400" /> Supabase Anon Key
                </label>
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" /> Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="AIzaSy..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-orange-500 text-white rounded-xl py-3.5 font-semibold hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
              >
                Salvar e Iniciar Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
