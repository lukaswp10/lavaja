import { cookies } from 'next/headers';
import crypto from 'crypto';

// SEGURANCA: Nao usar fallback - SESSION_SECRET deve ser configurado
const SECRET_KEY = process.env.SESSION_SECRET;

// Verificar se SECRET_KEY esta configurado na inicializacao
if (!SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.error('ERRO CRITICO: SESSION_SECRET nao esta configurado!');
  console.error('Configure a variavel de ambiente SESSION_SECRET para habilitar autenticacao.');
}

// Fallback apenas para desenvolvimento local
function getSecretKey(): string {
  if (SECRET_KEY) return SECRET_KEY;
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET nao configurado em producao!');
  }
  
  // Apenas para desenvolvimento - mostra aviso
  console.warn('DEV: Usando chave de sessao temporaria. Configure SESSION_SECRET.');
  return 'dev-only-secret-key-not-for-production';
}

// MULTI-TENANT: Adicionado empresa_id e empresa_slug ao usuario
export interface SessionUser {
  id: string;
  email: string;
  nome: string;
  role: 'super_admin' | 'admin' | 'funcionario';
  empresa_id: string | null;  // null para super_admin
  empresa_slug: string | null;  // null para super_admin
}

function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(data);
  return hmac.digest('hex');
}

function verifyToken(data: string, signature: string): boolean {
  const expectedSignature = signToken(data);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    empresa_id: user.empresa_id,
    empresa_slug: user.empresa_slug,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
    iat: Date.now(), // Issued at
  });

  const encodedPayload = Buffer.from(payload).toString('base64');
  const signature = signToken(encodedPayload);

  return encodedPayload + '.' + signature;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const encodedPayload = parts[0];
    const signature = parts[1];

    if (!verifyToken(encodedPayload, signature)) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64').toString('utf-8')
    );

    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      nome: payload.nome,
      role: payload.role,
      empresa_id: payload.empresa_id,
      empresa_slug: payload.empresa_slug,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  return session;
}

// Helper para verificar se usuario e super admin
export async function requireSuperAdmin(): Promise<SessionUser> {
  const session = await requireAuth();

  if (session.role !== 'super_admin') {
    throw new Error('Super admin access required');
  }

  return session;
}

// Helper para verificar se usuario tem acesso a empresa especifica
export async function requireEmpresaAccess(empresaSlug: string): Promise<SessionUser> {
  const session = await requireAuth();

  // Super admin tem acesso a tudo
  if (session.role === 'super_admin') {
    return session;
  }

  // Verificar se usuario pertence a empresa
  if (session.empresa_slug !== empresaSlug) {
    throw new Error('Access denied to this empresa');
  }

  return session;
}
