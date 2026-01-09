import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';
import { checkRateLimit, resetRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Extrair IP para rate limiting
  const clientIP = getClientIP(request);
  
  // Verificar rate limit
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfter} segundos.`,
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Remaining': '0'
        }
      }
    );
  }

  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha sao obrigatorios' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalido' },
        { status: 400 }
      );
    }

    // Buscar usuario no banco com dados da empresa
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select(`
        *,
        empresas:empresa_id (
          id,
          slug,
          nome,
          ativa
        )
      `)
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !usuario) {
      // Nao revelar se o email existe ou nao
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { 
          status: 401,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) }
        }
      );
    }

    // Verificar se usuario esta ativo
    if (!usuario.ativo) {
      return NextResponse.json(
        { error: 'Usuario inativo. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Se tem empresa, verificar se esta ativa
    if (usuario.empresas && !usuario.empresas.ativa) {
      return NextResponse.json(
        { error: 'Sua empresa esta inativa. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { 
          status: 401,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) }
        }
      );
    }

    // Login bem sucedido - resetar rate limit
    resetRateLimit(clientIP);

    // Criar token assinado
    const sessionToken = createSessionToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      empresa_id: usuario.empresa_id,
      empresa_slug: usuario.empresas?.slug || null,
    });

    // Salvar cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    });

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
        empresa_id: usuario.empresa_id,
        empresa_slug: usuario.empresas?.slug || null,
        empresa_nome: usuario.empresas?.nome || null,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
