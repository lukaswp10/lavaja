# LavaJa - Sistema Multi-tenant para Lava-Carros

Sistema SaaS completo para gerenciamento de lava-carros, com painel admin para donos e app/PWA para clientes finais.

## Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticacao**: HMAC-SHA256 + Cookies HttpOnly
- **Estilizacao**: Tailwind CSS 4
- **Animacoes**: Framer Motion

## Arquitetura Multi-tenant

- Um unico repositorio, projeto Vercel e banco Supabase
- Isolamento por `empresa_id` em todas as tabelas
- Row Level Security (RLS) no Supabase
- Super admin gerencia todas as empresas

## Estrutura de URLs

| Rota | Descricao |
|------|-----------|
| `/` | Landing page do produto |
| `/painel` | Login do dono do lava |
| `/painel/[slug]/*` | Painel da empresa |
| `/admin` | Login super admin |
| `/admin/dashboard` | Gerenciar todas empresas |
| `/app/[slug]` | PWA do cliente final |

## Credenciais de Desenvolvimento

**Super Admin:**
- Email: `admin@lavaja.com.br`
- Senha: `admin123`

**Empresa Demo:**
- Email: `demo@lavaja.com.br`
- Senha: `admin123`

## Setup Local

```bash
# Clonar repositorio
git clone https://github.com/lukaswp10/lavaja.git
cd lavaja

# Instalar dependencias
npm install

# Criar arquivo .env.local com as variaveis
cp .env.example .env.local

# Executar schema SQL no Supabase
# (copie o conteudo de supabase-schema.sql e execute no SQL Editor do Supabase)

# Iniciar desenvolvimento
npm run dev
```

## Variaveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SESSION_SECRET=chave-secreta-para-tokens
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Funcionalidades

### Painel do Dono
- Dashboard com metricas do dia
- Gerenciamento de fila em tempo real
- CRUD de servicos
- CRUD de clientes
- Promocoes configuraveis
- Configuracoes da empresa (cores, logo, horarios)

### Super Admin
- Visualizar todas as empresas
- Criar novas empresas
- Acessar painel de qualquer empresa

### PWA do Cliente (em desenvolvimento)
- Ver fila atual
- Acompanhar status do carro
- Ver servicos e precos

## Configuracoes Dinamicas

Todos os textos da landing page e do sistema sao configuraveis via banco de dados:

- Textos do hero, features, passos
- Labels de botoes
- Mensagens de erro/sucesso
- Cores do sistema

**NADA e hardcodado. Tudo vem do banco.**

## Deploy

O projeto esta configurado para deploy na Vercel:

1. Conecte o repositorio do GitHub na Vercel
2. Configure as variaveis de ambiente
3. Deploy automatico a cada push na main

## Supabase

- **Project ID**: mnldvsaguagoolmmnvaw
- **URL**: https://mnldvsaguagoolmmnvaw.supabase.co

## Licenca

Projeto privado - Todos os direitos reservados.

