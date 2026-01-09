'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, DollarSign, TrendingUp, Plus, Settings, Eye, LogOut, Car } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Empresa { id: string; slug: string; nome: string; plano: string; ativa: boolean; totalOrdens: number; faturamento: number; }

export default function AdminDashboardPage() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEmpresas: 0, totalUsuarios: 0, faturamentoTotal: 0, ordensHoje: 0 });

  useEffect(() => {
    setTimeout(() => {
      setEmpresas([
        { id: '1', slug: 'demo', nome: 'Lava Car Demo', plano: 'basico', ativa: true, totalOrdens: 150, faturamento: 4500 },
      ]);
      setStats({ totalEmpresas: 1, totalUsuarios: 2, faturamentoTotal: 4500, ordensHoje: 12 });
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin'); };

  const cards = [
    { titulo: 'Empresas', valor: stats.totalEmpresas, icon: Building2, cor: 'var(--cor-primaria)' },
    { titulo: 'Usuarios', valor: stats.totalUsuarios, icon: Users, cor: 'var(--cor-secundaria)' },
    { titulo: 'Faturamento Total', valor: `R$ ${stats.faturamentoTotal}`, icon: DollarSign, cor: '#22C55E' },
    { titulo: 'Ordens Hoje', valor: stats.ordensHoje, icon: TrendingUp, cor: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Header */}
      <header className="border-b border-[var(--cor-borda)] bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cor-primaria)] to-purple-600 flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-xl font-bold text-white">LavaJa Admin</h1><p className="text-xs text-[var(--cor-texto-muted)]">Super Admin</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-[var(--cor-texto-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg"><LogOut className="w-4 h-4" /><span>Sair</span></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div key={card.titulo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-[#0a0a0f] border border-[var(--cor-borda)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.cor}15` }}><card.icon className="w-6 h-6" style={{ color: card.cor }} /></div>
                <div><p className="text-[var(--cor-texto-muted)] text-sm">{card.titulo}</p>{loading ? <div className="h-7 w-16 bg-[var(--cor-borda)] rounded animate-pulse mt-1" /> : <p className="text-2xl font-bold text-white font-mono">{card.valor}</p>}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empresas */}
        <div className="bg-[#0a0a0f] border border-[var(--cor-borda)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Empresas Cadastradas</h2>
            <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Nova Empresa</button>
          </div>

          {loading ? (
            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-[var(--cor-borda)] rounded-xl animate-pulse" />)}</div>
          ) : empresas.length === 0 ? (
            <div className="text-center py-12"><Building2 className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" /><p className="text-[var(--cor-texto-muted)]">Nenhuma empresa cadastrada</p></div>
          ) : (
            <div className="space-y-3">
              {empresas.map((empresa) => (
                <motion.div key={empresa.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-4 rounded-xl bg-[#050508] border border-[var(--cor-borda)]">
                  <div className="w-12 h-12 rounded-xl bg-[var(--cor-primaria)]/10 flex items-center justify-center"><Building2 className="w-6 h-6 text-[var(--cor-primaria)]" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-white font-semibold">{empresa.nome}</span><span className={`px-2 py-0.5 rounded-full text-xs ${empresa.ativa ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{empresa.ativa ? 'Ativa' : 'Inativa'}</span><span className="px-2 py-0.5 rounded-full text-xs bg-[var(--cor-primaria)]/10 text-[var(--cor-primaria)]">{empresa.plano}</span></div>
                    <p className="text-[var(--cor-texto-muted)] text-sm">/{empresa.slug} - {empresa.totalOrdens} ordens - R$ {empresa.faturamento}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/painel/${empresa.slug}`} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white hover:bg-[var(--cor-fundo)]"><Eye className="w-4 h-4" /></Link>
                    <button className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white hover:bg-[var(--cor-fundo)]"><Settings className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

