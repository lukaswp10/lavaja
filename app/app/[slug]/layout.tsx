import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Buscar empresa pelo slug
async function getEmpresa(slug: string) {
  const { data, error } = await supabase
    .from('empresas')
    .select('id, slug, nome, logo_url, cor_primaria, cor_secundaria, telefone, endereco')
    .eq('slug', slug)
    .eq('ativa', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Metadata dinamica baseada na empresa
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const empresa = await getEmpresa(slug);
  
  if (!empresa) {
    return { title: 'Empresa nao encontrada | LavaJa' };
  }

  return {
    title: `${empresa.nome} | Acompanhe seu carro`,
    description: `Acompanhe o status do seu carro em tempo real no ${empresa.nome}`,
    themeColor: empresa.cor_primaria || '#0066FF',
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: empresa.nome,
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
  };
}

export default async function PWALayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const empresa = await getEmpresa(slug);

  if (!empresa) {
    notFound();
  }

  // CSS variables dinamicas baseadas nas cores da empresa
  const cssVariables = {
    '--empresa-primaria': empresa.cor_primaria || '#0066FF',
    '--empresa-secundaria': empresa.cor_secundaria || '#00D4AA',
    '--empresa-primaria-hover': adjustColor(empresa.cor_primaria || '#0066FF', -20),
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-[#0A0A0F]"
      style={cssVariables}
      data-empresa-id={empresa.id}
      data-empresa-slug={empresa.slug}
    >
      {/* Header simples com nome do lava */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center gap-3">
          {empresa.logo_url ? (
            <img 
              src={empresa.logo_url} 
              alt={empresa.nome} 
              className="h-8 w-auto"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: 'var(--empresa-primaria)' }}
            >
              {empresa.nome.charAt(0)}
            </div>
          )}
          <span className="text-white font-semibold">{empresa.nome}</span>
        </div>
      </header>

      {/* Conteudo principal */}
      <main className="pt-16 pb-8 min-h-screen">
        {children}
      </main>

      {/* Footer simples */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0F]/90 backdrop-blur-lg border-t border-white/5 py-2">
        <p className="text-center text-xs text-gray-500">
          Powered by <span className="text-[var(--empresa-primaria)]">LavaJa</span>
        </p>
      </footer>
    </div>
  );
}

// Funcao helper para ajustar cor (escurecer/clarear)
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

