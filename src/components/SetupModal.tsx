import React, { useState } from 'react';
import { resetSupabase, hasSupabaseConfig } from '../lib/supabase';
import { Database, Copy, Check, AlertTriangle } from 'lucide-react';

const SQL_SETUP = `
-- Execute este script no SQL Editor do Supabase

-- 0. APAGAR TODOS OS USUÁRIOS ANTIGOS (Reset total do sistema)
DELETE FROM auth.users;

-- 1. Limpar estruturas antigas (caso existam) para evitar erros
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 2. Criar Tabelas
CREATE TABLE roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tab', 'action')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Inserir permissões básicas
INSERT INTO permissions (code, type) VALUES 
('access_dashboard', 'tab'),
('access_agenda', 'tab'),
('access_crm', 'tab'),
('access_clientes', 'tab'),
('access_profissionais', 'tab'),
('access_servicos', 'tab'),
('access_estoque', 'tab'),
('access_financeiro', 'tab'),
('access_relatorios', 'tab'),
('access_configuracoes', 'tab'),
('manage_roles', 'action'),
('manage_permissions', 'action');

-- 4. Criar Role Admin
INSERT INTO roles (name, is_system) VALUES ('Super Admin', true);

-- 5. Atribuir todas as permissões ao Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Super Admin';

-- 6. Habilitar RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Políticas simplificadas para o MVP (Em produção, restrinja mais)
CREATE POLICY "Enable read access for all authenticated users" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON roles FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON permissions FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON role_permissions FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for users" ON users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable insert for users" ON users FOR INSERT TO authenticated WITH CHECK (true);

-- 8. Trigger para criar usuário e dar Admin para o primeiro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role_id UUID;
  v_user_count INT;
BEGIN
  SELECT count(*) INTO v_user_count FROM public.users;
  
  IF v_user_count = 0 THEN
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'Super Admin' LIMIT 1;
  END IF;

  INSERT INTO public.users (id, email, name, role_id)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', v_role_id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

export const SetupModal = ({ onComplete }: { onComplete: () => void }) => {
  const [url, setUrl] = useState(localStorage.getItem('SUPABASE_URL') || '');
  const [key, setKey] = useState(localStorage.getItem('SUPABASE_ANON_KEY') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [isOpen, setIsOpen] = useState(!hasSupabaseConfig());
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', key);
    if (geminiKey) localStorage.setItem('GEMINI_API_KEY', geminiKey);
    
    resetSupabase();
    setIsOpen(false);
    onComplete();
    window.location.reload();
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-orange-500/30 p-8 rounded-3xl w-full max-w-2xl shadow-[0_0_40px_rgba(249,115,22,0.1)] my-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Database className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bricolage text-white">Configuração do Supabase</h2>
            <p className="text-neutral-400 text-sm">Necessário para o sistema de RBAC dinâmico</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-400 mb-1">Aviso Importante: Confirmação de Email</h3>
            <p className="text-xs text-neutral-300">
              Para testar o cadastro sem precisar confirmar o email, vá no painel do Supabase em <strong>Authentication &gt; Providers &gt; Email</strong> e desative a opção <strong>Confirm email</strong>.
            </p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-orange-400">1. Execute este SQL no Supabase</h3>
            <button type="button" onClick={copySql} className="flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-neutral-300 transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copiado!' : 'Copiar SQL'}
            </button>
          </div>
          <div className="h-32 overflow-y-auto bg-[#050505] p-3 rounded-lg border border-white/5 text-xs font-mono text-neutral-400 no-scrollbar">
            <pre>{SQL_SETUP}</pre>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-sm font-medium text-orange-400 mb-2">2. Insira suas credenciais</h3>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Supabase Project URL</label>
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Supabase Anon Key</label>
            <input required type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Gemini API Key (Opcional)</label>
            <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl py-3 font-medium hover:brightness-110 transition-all mt-6 shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
            Salvar e Iniciar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};
