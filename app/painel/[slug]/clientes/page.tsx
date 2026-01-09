'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, User, Phone, Mail, Car, Calendar, ChevronRight } from 'lucide-react';

interface Cliente { id: string; nome: string; telefone: string; email: string; totalVisitas: number; ultimaVisita: string; veiculos: { placa: string; modelo: string }[]; }

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setClientes([
        { id: '1', nome: 'Joao Silva', telefone: '11999999999', email: 'joao@email.com', totalVisitas: 15, ultimaVisita: '2025-01-08', veiculos: [{ placa: 'ABC-1234', modelo: 'Honda Civic' }, { placa: 'XYZ-5678', modelo: 'VW Gol' }] },
        { id: '2', nome: 'Maria Santos', telefone: '11988888888', email: 'maria@email.com', totalVisitas: 8, ultimaVisita: '2025-01-07', veiculos: [{ placa: 'DEF-9012', modelo: 'Toyota Corolla' }] },
        { id: '3', nome: 'Pedro Costa', telefone: '11977777777', email: 'pedro@email.com', totalVisitas: 3, ultimaVisita: '2025-01-05', veiculos: [{ placa: 'GHI-3456', modelo: 'Fiat Argo' }] },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const clientesFiltrados = clientes.filter(c => busca === '' || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca) || c.email.toLowerCase().includes(busca.toLowerCase()) || c.veiculos.some(v => v.placa.toLowerCase().includes(busca.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Clientes</h1><p className="text-[var(--cor-texto-muted)]">{clientes.length} clientes cadastrados</p></div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Novo Cliente</button>
      </div>

      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cor-texto-muted)]" /><input type="text" placeholder="Buscar por nome, telefone, email ou placa..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-xl" /></div>

      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[var(--cor-card)] rounded-xl animate-pulse" />) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-[var(--cor-card)] rounded-2xl border border-[var(--cor-borda)]"><User className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" /><p className="text-[var(--cor-texto-muted)]">{busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</p></div>
        ) : clientesFiltrados.map((cliente) => (
          <motion.div key={cliente.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-[var(--cor-card)] border border-[var(--cor-borda)] hover:border-[var(--cor-borda-hover)] cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--cor-primaria)]/10 flex items-center justify-center flex-shrink-0"><span className="text-[var(--cor-primaria)] font-semibold text-lg">{cliente.nome.charAt(0)}</span></div>
              <div className="flex-1 min-w-0"><p className="text-white font-semibold">{cliente.nome}</p><div className="flex items-center gap-4 mt-1 text-sm text-[var(--cor-texto-muted)]"><span className="flex items-center gap-1"><Phone className="w-3 h-3" />{cliente.telefone}</span><span className="flex items-center gap-1"><Mail className="w-3 h-3" />{cliente.email}</span></div></div>
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0"><Car className="w-4 h-4 text-[var(--cor-texto-muted)]" /><span className="text-[var(--cor-texto-secundario)]">{cliente.veiculos.map(v => v.placa).join(', ')}</span></div>
              <div className="text-right flex-shrink-0"><p className="text-white font-semibold">{cliente.totalVisitas} visitas</p><p className="text-sm text-[var(--cor-texto-muted)] flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />{new Date(cliente.ultimaVisita).toLocaleDateString('pt-BR')}</p></div>
              <ChevronRight className="w-5 h-5 text-[var(--cor-texto-muted)] group-hover:text-white flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
