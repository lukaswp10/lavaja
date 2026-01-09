-- =============================================
-- LAVAJA - SCHEMA DO BANCO DE DADOS
-- Sistema Multi-tenant para Lava-Carros
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- =============================================
-- TABELAS PRINCIPAIS
-- =============================================

-- CONFIGURACOES DO SISTEMA (landing page, textos globais)
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave VARCHAR(255) UNIQUE NOT NULL,
  valor TEXT,
  tipo VARCHAR(50) DEFAULT 'texto' CHECK (tipo IN ('texto', 'numero', 'boolean', 'json', 'imagem'))
);

-- EMPRESAS (Tenants) - Cada lava-car e uma empresa
CREATE TABLE IF NOT EXISTS empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  logo_url TEXT,
  cor_primaria VARCHAR(7) DEFAULT '#0066FF',
  cor_secundaria VARCHAR(7) DEFAULT '#00D4AA',
  banner_url TEXT,
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  plano VARCHAR(20) DEFAULT 'basico' CHECK (plano IN ('basico', 'pro', 'enterprise')),
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USUARIOS - Multi-tenant (super_admin nao tem empresa_id)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'funcionario')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERVICOS - Oferecidos por cada lava-car
CREATE TABLE IF NOT EXISTS servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  duracao_minutos INTEGER DEFAULT 30,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLIENTES - Clientes de cada lava-car
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  cpf VARCHAR(14),
  total_visitas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VEICULOS - Veiculos dos clientes
CREATE TABLE IF NOT EXISTS veiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  placa VARCHAR(10) NOT NULL,
  modelo VARCHAR(100),
  cor VARCHAR(50),
  tipo VARCHAR(20) DEFAULT 'carro' CHECK (tipo IN ('carro', 'moto', 'caminhonete', 'suv')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDENS DE SERVICO - Core do sistema
CREATE TABLE IF NOT EXISTS ordens_servico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'lavando', 'secando', 'finalizado', 'entregue', 'cancelado')),
  posicao_fila INTEGER DEFAULT 0,
  hora_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hora_inicio TIMESTAMP WITH TIME ZONE,
  hora_fim TIMESTAMP WITH TIME ZONE,
  tempo_estimado_minutos INTEGER DEFAULT 30,
  valor_total DECIMAL(10,2) DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  forma_pagamento VARCHAR(20) CHECK (forma_pagamento IN ('dinheiro', 'pix', 'cartao', 'pendente')),
  observacoes TEXT,
  -- Dados inline para ordens sem cliente cadastrado
  cliente_nome VARCHAR(255),
  cliente_telefone VARCHAR(20),
  veiculo_placa VARCHAR(10),
  veiculo_modelo VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ITENS DA ORDEM - Servicos selecionados em cada ordem
CREATE TABLE IF NOT EXISTS ordem_servico_itens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ordem_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES servicos(id) ON DELETE SET NULL,
  servico_nome VARCHAR(255) NOT NULL,
  preco_aplicado DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONFIGURACOES POR EMPRESA
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  chave VARCHAR(255) NOT NULL,
  valor TEXT,
  tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'numero', 'boolean', 'json', 'imagem')),
  UNIQUE(empresa_id, chave)
);

-- PROMOCOES - Configuraveis por empresa
CREATE TABLE IF NOT EXISTS promocoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('porcentagem', 'valor_fixo')),
  valor DECIMAL(10,2) NOT NULL,
  dias_semana INTEGER[], -- 0=domingo, 6=sabado
  hora_inicio TIME,
  hora_fim TIME,
  data_inicio DATE,
  data_fim DATE,
  servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE, -- null = todos
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HORARIOS DE FUNCIONAMENTO
CREATE TABLE IF NOT EXISTS horarios_funcionamento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_abertura TIME,
  hora_fechamento TIME,
  fechado BOOLEAN DEFAULT false,
  capacidade_hora INTEGER DEFAULT 4, -- carros por hora
  UNIQUE(empresa_id, dia_semana)
);

-- =============================================
-- DADOS INICIAIS - CONFIGURACOES DO SISTEMA
-- =============================================

-- Configuracoes da Landing Page (editaveis pelo super admin)
INSERT INTO configuracoes_sistema (chave, valor, tipo) VALUES
-- Logo
('logo_texto', 'Lava', 'texto'),
('logo_destaque', 'Ja', 'texto'),
-- Navegacao
('nav_entrar', 'Entrar', 'texto'),
('nav_cta', 'Acessar Painel', 'texto'),
-- Hero
('hero_badge', 'Sistema completo para lava-carros', 'texto'),
('hero_titulo_1', 'Gerencie seu lava-car', 'texto'),
('hero_titulo_2', 'de qualquer lugar', 'texto'),
('hero_subtitulo', 'Fila em tempo real, promocoes automaticas, metricas detalhadas. Tudo o que voce precisa para profissionalizar seu negocio.', 'texto'),
('hero_cta_primario', 'Comecar Agora', 'texto'),
('hero_cta_secundario', 'Falar com Consultor', 'texto'),
-- Stats
('stat1_valor', '500+', 'texto'),
('stat1_label', 'Lava-cars', 'texto'),
('stat2_valor', '50k+', 'texto'),
('stat2_label', 'Carros/mes', 'texto'),
('stat3_valor', '99.9%', 'texto'),
('stat3_label', 'Uptime', 'texto'),
('stat4_valor', '4.9', 'texto'),
('stat4_label', 'Avaliacao', 'texto'),
-- Features
('features_titulo', 'Tudo que voce precisa', 'texto'),
('features_subtitulo', 'Ferramentas poderosas para simplificar a gestao do seu lava-car', 'texto'),
('feature1_titulo', 'Fila em Tempo Real', 'texto'),
('feature1_descricao', 'Seus clientes acompanham a fila pelo celular. Sem mais perguntas.', 'texto'),
('feature2_titulo', 'Promocoes Automaticas', 'texto'),
('feature2_descricao', 'Configure descontos por horario, dia da semana ou servico.', 'texto'),
('feature3_titulo', 'Metricas Detalhadas', 'texto'),
('feature3_descricao', 'Faturamento, tempo medio, servicos mais vendidos em um clique.', 'texto'),
('feature4_titulo', 'Seguro e Confiavel', 'texto'),
('feature4_descricao', 'Seus dados protegidos com a melhor tecnologia do mercado.', 'texto'),
-- Passos
('passos_titulo', 'Como Funciona', 'texto'),
('passos_subtitulo', 'Em 3 passos simples voce esta pronto', 'texto'),
('passo1_titulo', 'Crie sua conta', 'texto'),
('passo1_descricao', 'Cadastre seu lava-car em minutos. Sem burocracia, sem complicacao.', 'texto'),
('passo2_titulo', 'Configure seus servicos', 'texto'),
('passo2_descricao', 'Adicione servicos, precos e promocoes pelo painel intuitivo.', 'texto'),
('passo3_titulo', 'Comece a usar', 'texto'),
('passo3_descricao', 'Compartilhe o QR Code com seus clientes e veja a magica acontecer.', 'texto'),
-- CTA
('cta_titulo', 'Pronto para profissionalizar seu lava-car?', 'texto'),
('cta_subtitulo', 'Junte-se a centenas de lava-carros que ja usam LavaJa para crescer.', 'texto'),
('cta_botao', 'Comecar Gratuitamente', 'texto'),
-- Footer
('footer_termos', 'Termos de Uso', 'texto'),
('footer_privacidade', 'Privacidade', 'texto'),
('footer_contato', 'Contato', 'texto'),
('footer_copyright', '2025 LavaJa. Todos os direitos reservados.', 'texto'),
-- Login
('login_titulo', 'Bem-vindo de volta', 'texto'),
('login_subtitulo', 'Gerencie seu lava-car de qualquer lugar', 'texto'),
('login_email_label', 'Email', 'texto'),
('login_email_placeholder', 'seu@email.com', 'texto'),
('login_senha_label', 'Senha', 'texto'),
('login_senha_placeholder', 'Sua senha', 'texto'),
('login_botao', 'Entrar no Painel', 'texto'),
('login_entrando', 'Entrando...', 'texto'),
('login_esqueci_senha', 'Esqueci minha senha', 'texto'),
('login_ou', 'ou', 'texto'),
('login_sem_conta', 'Ainda nao tem conta?', 'texto'),
('login_fale_conosco', 'Fale conosco no WhatsApp', 'texto'),
('login_whatsapp_msg', 'Oi! Quero usar o LavaJa no meu lava-car', 'texto'),
('login_voltar', '? Voltar para o site', 'texto'),
-- Contato
('whatsapp', '5511999999999', 'texto')
ON CONFLICT (chave) DO NOTHING;

-- =============================================
-- DADOS INICIAIS - USUARIOS E EMPRESA DEMO
-- =============================================

-- Super Admin (senha: admin123)
-- IMPORTANTE: Troque a senha em producao!
INSERT INTO usuarios (email, senha_hash, nome, role, empresa_id) VALUES
('admin@lavaja.com.br', '$2a$10$rQnM1kJxP5VhZLzCvNxZXOqEqJHvYF5qzCvQhYq5xGqLvXzNpZJXK', 'Super Admin', 'super_admin', NULL)
ON CONFLICT (email) DO NOTHING;

-- Empresa de demonstracao
INSERT INTO empresas (slug, nome, telefone, cidade, estado) VALUES
('demo', 'Lava Car Demo', '11999999999', 'Sao Paulo', 'SP')
ON CONFLICT (slug) DO NOTHING;

-- Admin da empresa demo (senha: demo123)
INSERT INTO usuarios (email, senha_hash, nome, role, empresa_id) 
SELECT 'demo@lavaja.com.br', '$2a$10$rQnM1kJxP5VhZLzCvNxZXOqEqJHvYF5qzCvQhYq5xGqLvXzNpZJXK', 'Admin Demo', 'admin', id
FROM empresas WHERE slug = 'demo'
ON CONFLICT (email) DO NOTHING;

-- Servicos da empresa demo
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, ordem) 
SELECT id, 'Lavagem Simples', 'Lavagem externa completa', 30.00, 20, 1 FROM empresas WHERE slug = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, ordem) 
SELECT id, 'Lavagem Completa', 'Lavagem externa + interna', 50.00, 40, 2 FROM empresas WHERE slug = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, ordem) 
SELECT id, 'Polimento', 'Polimento e enceramento profissional', 120.00, 90, 3 FROM empresas WHERE slug = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, ordem) 
SELECT id, 'Higienizacao Interna', 'Limpeza profunda dos bancos e carpetes', 80.00, 60, 4 FROM empresas WHERE slug = 'demo'
ON CONFLICT DO NOTHING;

-- =============================================
-- POLITICAS DE SEGURANCA (RLS) - MULTI-TENANT
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordem_servico_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_funcionamento ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLITICAS PARA CONFIGURACOES DO SISTEMA
-- =============================================

CREATE POLICY "select_configs_sistema_publico" ON configuracoes_sistema
  FOR SELECT USING (true);

CREATE POLICY "all_configs_sistema_service" ON configuracoes_sistema
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA EMPRESAS
-- =============================================

CREATE POLICY "select_empresas_publico" ON empresas
  FOR SELECT USING (ativa = true);

CREATE POLICY "all_empresas_service" ON empresas
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA USUARIOS
-- =============================================

CREATE POLICY "all_usuarios_service" ON usuarios
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA SERVICOS
-- =============================================

CREATE POLICY "select_servicos_publico" ON servicos
  FOR SELECT USING (ativo = true);

CREATE POLICY "all_servicos_service" ON servicos
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA CLIENTES
-- =============================================

CREATE POLICY "all_clientes_service" ON clientes
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA VEICULOS
-- =============================================

CREATE POLICY "all_veiculos_service" ON veiculos
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA ORDENS DE SERVICO
-- =============================================

CREATE POLICY "select_ordens_fila_publico" ON ordens_servico
  FOR SELECT USING (status IN ('aguardando', 'lavando', 'secando'));

CREATE POLICY "all_ordens_service" ON ordens_servico
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "insert_ordens_anon" ON ordens_servico
  FOR INSERT WITH CHECK (true);

-- =============================================
-- POLITICAS PARA ITENS DA ORDEM
-- =============================================

CREATE POLICY "select_ordem_itens_publico" ON ordem_servico_itens
  FOR SELECT USING (true);

CREATE POLICY "all_ordem_itens_service" ON ordem_servico_itens
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "insert_ordem_itens_anon" ON ordem_servico_itens
  FOR INSERT WITH CHECK (true);

-- =============================================
-- POLITICAS PARA CONFIGURACOES DA EMPRESA
-- =============================================

CREATE POLICY "select_configs_empresa_publico" ON configuracoes_empresa
  FOR SELECT USING (true);

CREATE POLICY "all_configs_empresa_service" ON configuracoes_empresa
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA PROMOCOES
-- =============================================

CREATE POLICY "select_promocoes_publico" ON promocoes
  FOR SELECT USING (ativa = true);

CREATE POLICY "all_promocoes_service" ON promocoes
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITICAS PARA HORARIOS
-- =============================================

CREATE POLICY "select_horarios_publico" ON horarios_funcionamento
  FOR SELECT USING (true);

CREATE POLICY "all_horarios_service" ON horarios_funcionamento
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- INDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_servicos_empresa ON servicos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ordens_empresa ON ordens_servico(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ordens_status ON ordens_servico(status);
CREATE INDEX IF NOT EXISTS idx_ordens_fila ON ordens_servico(empresa_id, status, posicao_fila);
CREATE INDEX IF NOT EXISTS idx_promocoes_empresa ON promocoes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_configs_empresa ON configuracoes_empresa(empresa_id, chave);
CREATE INDEX IF NOT EXISTS idx_configs_sistema_chave ON configuracoes_sistema(chave);

-- =============================================
-- HABILITAR REALTIME PARA FILA
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE ordens_servico;

-- =============================================
-- PRONTO! Banco configurado para multi-tenant.
-- Usuarios criados:
-- - admin@lavaja.com.br (super_admin) - senha: admin123
-- - demo@lavaja.com.br (admin da empresa demo) - senha: admin123
-- =============================================
