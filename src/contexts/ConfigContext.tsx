import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseClient, getSupabase } from '../lib/supabase';
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
          setSupabase(getSupabase());
        }
      } catch (e) {
      }
    }
  }, []);

  const saveConfig = (newConfig: Config) => {
    localStorage.setItem('app_config', JSON.stringify(newConfig));
    setConfig(newConfig);
    setSupabase(getSupabase());
    setIsModalOpen(false);
  };

  const clearConfig = () => {
    localStorage.removeItem('app_config');
    setConfig(null);
    setSupabase(null);
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
