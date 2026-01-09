'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Droplets,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  carrosHoje: number;
  faturamentoHoje: number;
  tempoMedio: number;
  filaAtual: number;
  lavando: number;
  finalizados: number;
  cancelados: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    carrosHoje: 0,
    faturamentoHoje: 0,
    tempoMedio: 0,
    filaAtual: 0,
    lavando: 0,
    finalizados: 0,
    cancelados: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados para demo - em producao viria da API
    setTimeout(() => {
      setStats({
        carrosHoje: 12,
        faturamentoHoje: 580,
        tempoMedio: 35,
        filaAtual: 3,
        lavando: 2,
        finalizados: 8,
        cancelados: 1,
      });
      setLoading(false);
    }, 500);
  }, []);

  const cards = [
    {
      titulo: 'Carros Hoje',
      valor: stats.carrosHoje,
      sufixo: '',
      icon: Car,
      cor: 'var(--cor-primaria)',
      bg: 'var(--cor-primaria)',
    },
    {
      titulo: 'Faturamento',
      valor: stats.faturamentoHoje,
      prefixo: 'R$ ',
      icon: DollarSign,
      cor: 'var(--cor-secundaria)',
      bg: 'var(--cor-secundaria)',
    },
    {
      titulo: 'Tempo Medio',
      valor: stats.tempoMedio,
      sufixo: ' min',
      icon: Clock,
      cor: '#F59E0B',
      bg: '#F59E0B',
    },
    {
      titulo: 'Na Fila',
      valor: stats.filaAtual,
      sufixo: '',
      icon: TrendingUp,
      cor: '#8B5CF6',
      bg: '#8B5CF6',
    },
  ];

  const statusCards = [
    { titulo: 'Lavando', valor: stats.lavando, icon: Droplets, cor: 'var(--cor-primaria)' },
    { titulo: 'Finalizados', valor: stats.finalizados, icon: CheckCircle, cor: 'var(--cor-sucesso)' },
    { titulo: 'Cancelados', valor: stats.cancelados, icon: XCircle, cor: 'var(--cor-erro)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[var(--cor-texto-muted)]">
          Visao geral do seu lava-car hoje
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.titulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[var(--cor-card)] border border-[var(--cor-borda)] hover:border-[var(--cor-borda-hover)] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.bg}15` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.cor }} />
              </div>
            </div>
            <div>
              <p className="text-[var(--cor-texto-muted)] text-sm mb-1">{card.titulo}</p>
              {loading ? (
                <div className="h-8 w-20 bg-[var(--cor-borda)] rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white font-mono">
                  {card.prefixo}{card.valor}{card.sufixo}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {statusCards.map((card, i) => (
          <motion.div
            key={card.titulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            className="p-5 rounded-xl bg-[var(--cor-card)] border border-[var(--cor-borda)] flex items-center gap-4"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${card.cor}15` }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.cor }} />
            </div>
            <div>
              <p className="text-[var(--cor-texto-muted)] text-sm">{card.titulo}</p>
              {loading ? (
                <div className="h-6 w-12 bg-[var(--cor-borda)] rounded animate-pulse mt-1" />
              ) : (
                <p className="text-xl font-bold text-white font-mono">{card.valor}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fila Atual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="p-6 rounded-2xl bg-[var(--cor-card)] border border-[var(--cor-borda)]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Fila Atual</h2>
          <a 
            href="#" 
            className="text-sm text-[var(--cor-primaria)] hover:underline"
          >
            Ver todos
          </a>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[var(--cor-borda)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : stats.filaAtual === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" />
            <p className="text-[var(--cor-texto-muted)]">
              Nenhum carro na fila no momento
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Exemplo de itens na fila */}
            {[
              { placa: 'ABC-1234', modelo: 'Honda Civic', servico: 'Lavagem Completa', status: 'lavando', tempo: '15 min' },
              { placa: 'XYZ-5678', modelo: 'Toyota Corolla', servico: 'Lavagem Simples', status: 'aguardando', tempo: '30 min' },
              { placa: 'DEF-9012', modelo: 'VW Golf', servico: 'Polimento', status: 'aguardando', tempo: '45 min' },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--cor-fundo)] border border-[var(--cor-borda)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--cor-primaria)]/10 flex items-center justify-center text-[var(--cor-primaria)] font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.placa}</p>
                    <p className="text-sm text-[var(--cor-texto-muted)]">{item.modelo} - {item.servico}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'lavando' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {item.status === 'lavando' ? <Droplets className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status === 'lavando' ? 'Lavando' : 'Aguardando'}
                  </span>
                  <p className="text-sm text-[var(--cor-texto-muted)] mt-1">~{item.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
