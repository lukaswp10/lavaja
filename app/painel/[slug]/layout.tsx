'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Car, 
  LayoutDashboard, 
  Wrench, 
  Users, 
  ListOrdered, 
  Tag, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

// Contexto do Tenant
interface TenantContextType {
  empresa: {
    id: string;
    slug: string;
    nome: string;
  } | null;
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
  } | null;
}

const TenantContext = createContext<TenantContextType>({
  empresa: null,
  usuario: null,
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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    // Buscar dados do usuario logado
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUsuario(data.usuario);
          setEmpresa({
            id: data.usuario.empresa_id,
            slug: data.usuario.empresa_slug,
            nome: data.usuario.empresa_nome || slug,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar usuario:', err);
      }
    }
    loadUser();
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
    { href: `/painel/${slug}/configuracoes`, label: 'Configuracoes', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === `/painel/${slug}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <TenantContext.Provider value={{ empresa, usuario }}>
      <div className="min-h-screen bg-[var(--cor-fundo)]">
        {/* Sidebar Desktop */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--cor-card)] border-r border-[var(--cor-borda)] hidden lg:flex flex-col z-40">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--cor-borda)]">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Lava<span className="text-[var(--cor-primaria)]">Ja</span>
              </span>
            </Link>
          </div>

          {/* Empresa */}
          <div className="px-4 py-4 border-b border-[var(--cor-borda)]">
            <div className="px-3 py-2 bg-[var(--cor-fundo)] rounded-lg">
              <p className="text-xs text-[var(--cor-texto-muted)] uppercase tracking-wider">Empresa</p>
              <p className="text-white font-medium truncate">{empresa?.nome || slug}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.href)
                    ? 'bg-[var(--cor-primaria)] text-white'
                    : 'text-[var(--cor-texto-secundario)] hover:bg-[var(--cor-fundo)] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            ))}
          </nav>

          {/* Usuario */}
          <div className="p-4 border-t border-[var(--cor-borda)]">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-[var(--cor-primaria)]/20 flex items-center justify-center">
                <span className="text-[var(--cor-primaria)] font-semibold">
                  {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{usuario?.nome || 'Usuario'}</p>
                <p className="text-xs text-[var(--cor-texto-muted)] truncate">{usuario?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-2 px-4 py-2 text-[var(--cor-texto-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--cor-card)] border-b border-[var(--cor-borda)]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[var(--cor-texto-secundario)] hover:text-white"
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
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--cor-card)] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--cor-borda)]">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">
                    Lava<span className="text-[var(--cor-primaria)]">Ja</span>
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-[var(--cor-texto-muted)] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'bg-[var(--cor-primaria)] text-white'
                        : 'text-[var(--cor-texto-secundario)] hover:bg-[var(--cor-fundo)] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Usuario */}
              <div className="p-4 border-t border-[var(--cor-borda)]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[var(--cor-texto-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
