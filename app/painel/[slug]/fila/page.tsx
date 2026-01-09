'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  Droplets, 
  Wind, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

type OrdemStatus = 'aguardando' | 'lavando' | 'secando' | 'finalizado' | 'entregue' | 'cancelado';

interface Ordem {
  id: string;
  posicao: number;
  placa: string;
  modelo: string;
  cliente: string;
  servicos: string[];
  status: OrdemStatus;
  horaEntrada: string;
  tempoEstimado: number;
  valor: number;
}

const statusConfig: Record<OrdemStatus, { label: string; cor: string; bg: string; icon: React.ComponentType<{className?: string}> }> = {
  aguardando: { label: 'Aguardando', cor: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: Clock },
  lavando: { label: 'Lavando', cor: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: Droplets },
  secando: { label: 'Secando', cor: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', icon: Wind },
  finalizado: { label: 'Finalizado', cor: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
  entregue: { label: 'Entregue', cor: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: CheckCircle },
  cancelado: { label: 'Cancelado', cor: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: XCircle },
};

export default function FilaPage() {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<OrdemStatus | 'todos'>('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setOrdens([
        { id: '1', posicao: 1, placa: 'ABC-1234', modelo: 'Honda Civic Preto', cliente: 'Joao Silva', servicos: ['Lavagem Completa', 'Cera'], status: 'lavando', horaEntrada: '09:30', tempoEstimado: 40, valor: 70 },
        { id: '2', posicao: 2, placa: 'XYZ-5678', modelo: 'Toyota Corolla Branco', cliente: 'Maria Santos', servicos: ['Lavagem Simples'], status: 'aguardando', horaEntrada: '09:45', tempoEstimado: 25, valor: 30 },
        { id: '3', posicao: 3, placa: 'DEF-9012', modelo: 'VW Golf Prata', cliente: 'Pedro Costa', servicos: ['Polimento', 'Higienizacao'], status: 'aguardando', horaEntrada: '10:00', tempoEstimado: 90, valor: 200 },
        { id: '4', posicao: 0, placa: 'GHI-3456', modelo: 'Fiat Argo Vermelho', cliente: 'Ana Oliveira', servicos: ['Lavagem Completa'], status: 'secando', horaEntrada: '09:00', tempoEstimado: 40, valor: 50 },
        { id: '5', posicao: 0, placa: 'JKL-7890', modelo: 'Chevrolet Onix Azul', cliente: 'Carlos Lima', servicos: ['Lavagem Simples'], status: 'finalizado', horaEntrada: '08:30', tempoEstimado: 25, valor: 30 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const ordensFiltradas = ordens.filter(ordem => {
    const matchStatus = filtroStatus === 'todos' || ordem.status === filtroStatus;
    const matchBusca = busca === '' || 
      ordem.placa.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.modelo.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const mudarStatus = (ordemId: string, novoStatus: OrdemStatus) => {
    setOrdens(prev => prev.map(o => 
      o.id === ordemId ? { ...o, status: novoStatus } : o
    ));
  };

  const proximoStatus = (status: OrdemStatus): OrdemStatus | null => {
    const fluxo: Record<OrdemStatus, OrdemStatus | null> = {
      aguardando: 'lavando', lavando: 'secando', secando: 'finalizado',
      finalizado: 'entregue', entregue: null, cancelado: null,
    };
    return fluxo[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fila de Servicos</h1>
          <p className="text-[var(--cor-texto-muted)]">Gerencie os carros em atendimento</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nova Ordem
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cor-texto-muted)]" />
          <input type="text" placeholder="Buscar por placa, cliente ou modelo..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-xl" />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cor-texto-muted)]" />
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as OrdemStatus | 'todos')} className="pl-12 pr-8 py-3 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-xl appearance-none cursor-pointer min-w-[180px]">
            <option value="todos">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="lavando">Lavando</option>
            <option value="secando">Secando</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['aguardando', 'lavando', 'secando', 'finalizado'] as OrdemStatus[]).map((status) => {
          const config = statusConfig[status];
          const count = ordens.filter(o => o.status === status).length;
          return (
            <button key={status} onClick={() => setFiltroStatus(filtroStatus === status ? 'todos' : status)} className={`p-4 rounded-xl border transition-all ${filtroStatus === status ? 'border-[var(--cor-primaria)] bg-[var(--cor-primaria)]/10' : 'border-[var(--cor-borda)] bg-[var(--cor-card)]'}`}>
              <div className="flex items-center gap-2">
                <config.icon className="w-4 h-4" style={{ color: config.cor }} />
                <span className="text-sm text-[var(--cor-texto-muted)]">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1 font-mono">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[var(--cor-card)] rounded-xl animate-pulse" />)
        ) : ordensFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-[var(--cor-card)] rounded-2xl border border-[var(--cor-borda)]">
            <Clock className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" />
            <p className="text-[var(--cor-texto-muted)]">{busca || filtroStatus !== 'todos' ? 'Nenhuma ordem encontrada' : 'Nenhum carro na fila'}</p>
          </div>
        ) : (
          <AnimatePresence>
            {ordensFiltradas.map((ordem) => {
              const config = statusConfig[ordem.status];
              const proximo = proximoStatus(ordem.status);
              return (
                <motion.div key={ordem.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="p-4 rounded-xl bg-[var(--cor-card)] border border-[var(--cor-borda)]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {ordem.status === 'aguardando' ? (
                      <div className="w-12 h-12 rounded-xl bg-[var(--cor-primaria)]/10 flex items-center justify-center text-[var(--cor-primaria)] font-bold text-xl flex-shrink-0">{ordem.posicao}</div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: config.bg }}>
                        <config.icon className="w-6 h-6" style={{ color: config.cor }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">{ordem.placa}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: config.bg, color: config.cor }}>{config.label}</span>
                      </div>
                      <p className="text-[var(--cor-texto-muted)] text-sm">{ordem.modelo}</p>
                      <p className="text-[var(--cor-texto-muted)] text-sm">{ordem.cliente} - {ordem.servicos.join(', ')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-semibold font-mono">R$ {ordem.valor}</p>
                      <p className="text-[var(--cor-texto-muted)] text-sm">Entrada: {ordem.horaEntrada} - ~{ordem.tempoEstimado}min</p>
                    </div>
                    {proximo && (
                      <button onClick={() => mudarStatus(ordem.id, proximo)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--cor-primaria)] text-white text-sm font-medium hover:bg-[var(--cor-primaria-hover)] transition-colors flex-shrink-0">
                        {statusConfig[proximo].label} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
