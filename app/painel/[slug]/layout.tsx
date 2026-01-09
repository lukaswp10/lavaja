'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Droplets, 
  LayoutDashboard, 
  Wrench, 
  Users, 
  ListOrdered, 
  Tag, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  QrCode
} from 'lucide-react';

// Contexto do Tenant
interface TenantContextType {
  empresa: {
    id: string;
    slug: string;
    nome: string;
    cor_primaria: string;
    cor_secundaria: string;
    logo_url: string | null;
  } | null;
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  empresa: null,
  usuario: null,
  loading: true,
});

export const useTenant = () => useContext(TenantContext);

export default function PainelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState<TenantContextType['usuario']>(null);
  const [empresa, setEmpresa] = useState<TenantContextType['empresa']>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUsuario(data.usuario);
          
          // Simular dados da empresa (em producao viria do banco)
          setEmpresa({
            id: data.usuario.empresa_id || 'demo-id',
            slug: data.usuario.empresa_slug || slug,
            nome: data.usuario.empresa_nome || 'Lava Car',
            cor_primaria: '#3B82F6',
            cor_secundaria: '#06B6D4',
            logo_url: null,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar usuario:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadUser();
  }, [slug]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/painel');
  };

  const menuItems = [
    { href: `/painel/${slug}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/painel/${slug}/fila`, label: 'Fila', icon: ListOrdered },
    { href: `/painel/${slug}/servicos`, label: 'Servicos', icon: Wrench },
    { href: `/painel/${slug}/clientes`, label: 'Clientes', icon: Users },
    { href: `/painel/${slug}/promocoes`, label: 'Promocoes', icon: Tag },
    { href: `/painel/${slug}/qrcode`, label: 'QR Code / Link', icon: QrCode },
    { href: `/painel/${slug}/configuracoes`, label: 'Configuracoes', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === `/painel/${slug}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // CSS Variables dinamicas
  const cssVars = empresa ? {
    '--empresa-primaria': empresa.cor_primaria,
    '--empresa-secundaria': empresa.cor_secundaria,
  } as React.CSSProperties : {};

  return (
    <TenantContext.Provider value={{ empresa, usuario, loading }}>
      <div className="min-h-screen bg-[#07070A]" style={cssVars}>
        {/* Sidebar Desktop */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0A0A0F] border-r border-white/5 hidden lg:flex flex-col z-40">
          {/* Logo */}
          <div className="p-5 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3">
              {empresa?.logo_url ? (
                <img src={empresa.logo_url} alt={empresa.nome} className="h-10 w-auto" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, var(--empresa-primaria, #3B82F6), var(--empresa-secundaria, #06B6D4))` }}
                >
                  <Droplets className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-lg font-semibold text-white truncate">
                {empresa?.nome || slug}
              </span>
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive(item.href)
                    ? 'bg-[var(--empresa-primaria,#3B82F6)] text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            ))}
          </nav>

          {/* Usuario */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, var(--empresa-primaria, #3B82F6), var(--empresa-secundaria, #06B6D4))` }}
              >
                <span className="text-white font-medium text-sm">
                  {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{usuario?.nome || 'Usuario'}</p>
                <p className="text-xs text-white/40 truncate">{usuario?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F] border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-white/60 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-white">{empresa?.nome || slug}</span>
            <div className="w-10" />
          </div>
        </header>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0A0A0F] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, var(--empresa-primaria, #3B82F6), var(--empresa-secundaria, #06B6D4))` }}
                  >
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-white">{empresa?.nome || slug}</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'bg-[var(--empresa-primaria,#3B82F6)] text-white'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </TenantContext.Provider>
  );
}
