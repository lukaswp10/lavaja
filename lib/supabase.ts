import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// TIPOS DO BANCO DE DADOS - MULTI-TENANT
// =============================================

// Tabela principal: Empresas (tenants)
export interface Empresa {
  id: string;
  slug: string;
  nome: string;
  logo_url?: string;
  cor_primaria: string;
  cor_secundaria: string;
  banner_url?: string;
  telefone?: string;
  endereco?: string;
  plano: 'basico' | 'pro' | 'enterprise';
  ativa: boolean;
  created_at: string;
}

// Usuarios do sistema (dono, funcionarios)
export interface Usuario {
  id: string;
  empresa_id: string | null; // null = super_admin
  email: string;
  nome: string;
  role: 'super_admin' | 'admin' | 'funcionario';
  ativo: boolean;
  created_at: string;
}

// Servicos oferecidos por cada lava-car
export interface Servico {
  id: string;
  empresa_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao_minutos: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

// Clientes de cada lava-car
export interface Cliente {
  id: string;
  empresa_id: string;
  nome: string;
  telefone?: string;
  email?: string;
  cpf?: string;
  total_visitas: number;
  created_at: string;
}

// Veiculos dos clientes
export interface Veiculo {
  id: string;
  cliente_id: string;
  placa: string;
  modelo?: string;
  cor?: string;
  tipo: 'carro' | 'moto' | 'caminhonete' | 'suv';
  created_at: string;
}

// Status possiveis da ordem
export type OrdemStatus = 
  | 'aguardando'    // Na fila
  | 'lavando'       // Em execucao
  | 'secando'       // Secagem
  | 'finalizado'    // Pronto para retirar
  | 'entregue'      // Cliente retirou
  | 'cancelado';    // Cancelada

// Ordens de servico - core do sistema
export interface OrdemServico {
  id: string;
  empresa_id: string;
  cliente_id?: string;
  veiculo_id?: string;
  status: OrdemStatus;
  posicao_fila: number;
  hora_entrada: string;
  hora_inicio?: string;
  hora_fim?: string;
  tempo_estimado_minutos: number;
  valor_total: number;
  desconto: number;
  forma_pagamento?: 'dinheiro' | 'pix' | 'cartao' | 'pendente';
  observacoes?: string;
  created_at: string;
  // Dados inline para ordens sem cliente cadastrado
  cliente_nome?: string;
  cliente_telefone?: string;
  veiculo_placa?: string;
  veiculo_modelo?: string;
}

// Itens da ordem (servicos selecionados)
export interface OrdemServicoItem {
  id: string;
  ordem_id: string;
  servico_id: string;
  servico_nome: string;
  preco_aplicado: number;
  desconto: number;
}

// Configuracoes globais do sistema (landing, textos padrao)
export interface ConfiguracaoSistema {
  id: string;
  chave: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'boolean' | 'json' | 'imagem';
}

// Configuracoes por empresa
export interface ConfiguracaoEmpresa {
  id: string;
  empresa_id: string;
  chave: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'boolean' | 'json' | 'imagem';
}

// Promocoes configuraveis
export interface Promocao {
  id: string;
  empresa_id: string;
  nome: string;
  tipo: 'porcentagem' | 'valor_fixo';
  valor: number;
  dias_semana?: number[]; // 0=domingo, 6=sabado
  hora_inicio?: string;
  hora_fim?: string;
  data_inicio?: string;
  data_fim?: string;
  servico_id?: string; // null = todos os servicos
  ativa: boolean;
  created_at: string;
}

// =============================================
// FUNCOES DE BUSCA - PUBLICAS (anon key)
// =============================================

// Buscar configuracoes do sistema (landing page)
export async function getConfigsSistema(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('configuracoes_sistema')
    .select('chave, valor');
  
  if (error || !data) return {};
  
  return data.reduce((acc, item) => {
    acc[item.chave] = item.valor || '';
    return acc;
  }, {} as Record<string, string>);
}

// Buscar empresa pelo slug (para PWA do cliente)
export async function getEmpresaBySlug(slug: string): Promise<Empresa | null> {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('slug', slug)
    .eq('ativa', true)
    .single();
  
  if (error) return null;
  return data;
}

// Buscar configuracoes de uma empresa
export async function getConfigsEmpresa(empresaId: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('configuracoes_empresa')
    .select('chave, valor')
    .eq('empresa_id', empresaId);
  
  if (error || !data) return {};
  
  return data.reduce((acc, item) => {
    acc[item.chave] = item.valor || '';
    return acc;
  }, {} as Record<string, string>);
}

// Buscar servicos de uma empresa
export async function getServicosEmpresa(empresaId: string): Promise<Servico[]> {
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  
  if (error) return [];
  return data || [];
}

// Buscar promocoes ativas de uma empresa
export async function getPromocoesAtivas(empresaId: string): Promise<Promocao[]> {
  const { data, error } = await supabase
    .from('promocoes')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ativa', true);
  
  if (error) return [];
  return data || [];
}

// Buscar fila atual de uma empresa (para PWA cliente)
export async function getFilaEmpresa(empresaId: string): Promise<OrdemServico[]> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*')
    .eq('empresa_id', empresaId)
    .in('status', ['aguardando', 'lavando', 'secando'])
    .order('posicao_fila', { ascending: true });
  
  if (error) return [];
  return data || [];
}

// Buscar ordem especifica (para cliente acompanhar)
export async function getOrdemById(ordemId: string): Promise<OrdemServico | null> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*')
    .eq('id', ordemId)
    .single();
  
  if (error) return null;
  return data;
}
