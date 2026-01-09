import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // =============================================
  // PROTEGER ROTAS DO SUPER ADMIN
  // =============================================
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('session');
        return response;
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      // Verificar expiracao
      if (sessionData.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('session');
        return response;
      }

      // Verificar se e super_admin
      if (sessionData.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/painel', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  // =============================================
  // PROTEGER ROTAS DO PAINEL (DONO DO LAVA)
  // =============================================
  if (pathname.match(/^\/painel\/[^/]+/) && !pathname.startsWith('/painel/login')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/painel', request.url));
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        const response = NextResponse.redirect(new URL('/painel', request.url));
        response.cookies.delete('session');
        return response;
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      // Verificar expiracao
      if (sessionData.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/painel', request.url));
        response.cookies.delete('session');
        return response;
      }

      // Extrair slug da URL
      const urlSlug = pathname.split('/')[2];

      // Super admin pode acessar qualquer empresa
      if (sessionData.role === 'super_admin') {
        return NextResponse.next();
      }

      // Verificar se usuario pertence a esta empresa
      if (sessionData.empresa_slug !== urlSlug) {
        // Redirecionar para a empresa correta do usuario
        if (sessionData.empresa_slug) {
          return NextResponse.redirect(new URL(`/painel/${sessionData.empresa_slug}`, request.url));
        }
        return NextResponse.redirect(new URL('/painel', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/painel', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  // =============================================
  // PROTEGER APIs DO ADMIN
  // =============================================
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      if (sessionData.exp < Date.now()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }

      if (sessionData.role !== 'super_admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  }

  // =============================================
  // PROTEGER APIs DO PAINEL
  // =============================================
  if (pathname.startsWith('/api/painel')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      if (sessionData.exp < Date.now()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/painel/:path*',
    '/api/admin/:path*',
    '/api/painel/:path*',
  ],
};
