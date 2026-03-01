-- Execute este script no SQL Editor do seu Supabase

-- 1. Criar tabelas
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('tab', 'action')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role_id UUID REFERENCES roles(id),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Inserir roles padrão
INSERT INTO roles (name, is_system) VALUES 
('ADMIN', true),
('PROFESSIONAL', true)
ON CONFLICT (name) DO NOTHING;

-- 3. Inserir permissões base
INSERT INTO permissions (code, type) VALUES 
-- Abas (Visualizar)
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

-- Ações (Criar, Editar, Excluir)
('create_agenda', 'action'), ('edit_agenda', 'action'), ('delete_agenda', 'action'),
('create_crm', 'action'), ('edit_crm', 'action'), ('delete_crm', 'action'),
('create_clientes', 'action'), ('edit_clientes', 'action'), ('delete_clientes', 'action'),
('create_profissionais', 'action'), ('edit_profissionais', 'action'), ('delete_profissionais', 'action'),
('create_servicos', 'action'), ('edit_servicos', 'action'), ('delete_servicos', 'action'),
('create_estoque', 'action'), ('edit_estoque', 'action'), ('delete_estoque', 'action'),
('create_financeiro', 'action'), ('edit_financeiro', 'action'), ('delete_financeiro', 'action'),
('create_relatorios', 'action'), ('edit_relatorios', 'action'), ('delete_relatorios', 'action'),
('manage_users', 'action')
ON CONFLICT (code) DO NOTHING;

-- 4. Atribuir todas as permissões ao ADMIN
DO $$
DECLARE
  admin_role_id UUID;
  perm_record RECORD;
BEGIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN';
  
  FOR perm_record IN SELECT id FROM permissions LOOP
    INSERT INTO role_permissions (role_id, permission_id) 
    VALUES (admin_role_id, perm_record.id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- 5. Habilitar RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. Criar Políticas de Segurança (RLS)
-- Drop existing policies to avoid errors when re-running the script
DROP POLICY IF EXISTS "Permitir leitura de roles" ON roles;
DROP POLICY IF EXISTS "Permitir leitura de permissions" ON permissions;
DROP POLICY IF EXISTS "Permitir leitura de role_permissions" ON role_permissions;
DROP POLICY IF EXISTS "Permitir leitura de todos os usuários para usuários autenticados" ON users;
DROP POLICY IF EXISTS "Permitir que o próprio usuário insira seus dados" ON users;
DROP POLICY IF EXISTS "Permitir update de usuários para usuários autenticados" ON users;
DROP POLICY IF EXISTS "Permitir insert em roles" ON roles;
DROP POLICY IF EXISTS "Permitir update em roles" ON roles;
DROP POLICY IF EXISTS "Permitir delete em roles" ON roles;
DROP POLICY IF EXISTS "Permitir insert em permissions" ON permissions;
DROP POLICY IF EXISTS "Permitir update em permissions" ON permissions;
DROP POLICY IF EXISTS "Permitir delete em permissions" ON permissions;
DROP POLICY IF EXISTS "Permitir insert em role_permissions" ON role_permissions;
DROP POLICY IF EXISTS "Permitir delete em role_permissions" ON role_permissions;

-- Permitir leitura pública para roles e permissions (necessário para o frontend saber o que renderizar)
CREATE POLICY "Permitir leitura de roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de role_permissions" ON role_permissions FOR SELECT USING (true);

-- Users policies
CREATE POLICY "Permitir leitura de todos os usuários para usuários autenticados" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir que o próprio usuário insira seus dados" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Permitir update de usuários para usuários autenticados" ON users FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir modificação apenas para usuários autenticados (Em um cenário real, você verificaria se o usuário é ADMIN)
CREATE POLICY "Permitir insert em roles" ON roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir update em roles" ON roles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir delete em roles" ON roles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir insert em permissions" ON permissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir update em permissions" ON permissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir delete em permissions" ON permissions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir insert em role_permissions" ON role_permissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir delete em role_permissions" ON role_permissions FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Trigger para criar usuário automaticamente após o cadastro no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role_id UUID;
  is_first_user BOOLEAN;
  assigned_status TEXT;
BEGIN
  -- Verificar se é o primeiro usuário
  SELECT NOT EXISTS (SELECT 1 FROM public.users) INTO is_first_user;
  
  IF is_first_user THEN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'ADMIN';
    assigned_status := 'APPROVED';
  ELSE
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'PROFESSIONAL';
    assigned_status := 'PENDING';
  END IF;

  INSERT INTO public.users (id, name, email, role_id, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    default_role_id,
    assigned_status
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
