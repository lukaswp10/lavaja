'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Droplets, 
  Wind, 
  CheckCircle, 
  Car,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Loader2,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { useOrdemRealtime, usePosicaoFila } from '@/lib/useOrdemRealtime';
import { supabase } from '@/lib/supabase';

type OrdemStatus = 'aguardando' | 'lavando' | 'secando' | 'finalizado' | 'entregue' | 'cancelado';

const statusConfig: Record<OrdemStatus, { 
  label: string; 
  descricao: string;
  cor: string; 
  bg: string;
  icon: LucideIcon;
}> = {
  aguardando: { 
    label: 'Na Fila', 
    descricao: 'Seu carro esta aguardando atendimento',
    cor: '#F59E0B', 
    bg: 'rgba(245, 158, 11, 0.15)',
    icon: Clock 
  },
  lavando: { 
    label: 'Lavando', 
    descricao: 'Seu carro esta sendo lavado agora',
    cor: '#3B82F6', 
    bg: 'rgba(59, 130, 246, 0.15)',
    icon: Droplets 
  },
  secando: { 
    label: 'Secando', 
    descricao: 'Finalizando a secagem do seu carro',
    cor: '#8B5CF6', 
    bg: 'rgba(139, 92, 246, 0.15)',
    icon: Wind 
  },
  finalizado: { 
    label: 'Pronto!', 
    descricao: 'Seu carro esta pronto para retirada',
    cor: '#22C55E', 
    bg: 'rgba(34, 197, 94, 0.15)',
    icon: CheckCircle 
  },
  entregue: { 
    label: 'Entregue', 
    descricao: 'Obrigado pela preferencia!',
    cor: '#6B7280', 
    bg: 'rgba(107, 114, 128, 0.15)',
    icon: CheckCircle 
  },
  cancelado: { 
    label: 'Cancelado', 
    descricao: 'Esta ordem foi cancelada',
    cor: '#EF4444', 
    bg: 'rgba(239, 68, 68, 0.15)',
    icon: AlertCircle 
  },
};

export default function AcompanharPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const placa = (params.placa as string).toUpperCase();
  
  const [empresaId, setEmpresaId] = useState<string>('');
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

  // Buscar empresa_id pelo slug
  useEffect(() => {
    async function fetchEmpresa() {
      const { data } = await supabase
        .from('empresas')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setEmpresaId(data.id);
      }
      setLoadingEmpresa(false);
    }
    fetchEmpresa();
  }, [slug]);

  // Hook de realtime
  const { ordem, loading, erro, refetch } = useOrdemRealtime(empresaId, placa);
  const { posicao, totalFila } = usePosicaoFila(empresaId, ordem?.id || null);

  // Formatar placa para exibicao
  const placaFormatada = placa.length === 7 
    ? `${placa.slice(0, 3)}-${placa.slice(3)}`
    : placa;

  // Calcular tempo estimado restante
  const getTempoRestante = () => {
    if (!ordem) return null;
    
    if (ordem.status === 'aguardando') {
      // Tempo de cada carro na frente + tempo desta ordem
      const tempoFila = (posicao - 1) * 30; // ~30min por carro
      return ordem.tempo_estimado_minutos + tempoFila;
    }
    
    if (ordem.status === 'lavando' || ordem.status === 'secando') {
      // Usar hora de inicio para calcular tempo restante
      if (ordem.hora_inicio) {
        const inicio = new Date(ordem.hora_inicio).getTime();
        const agora = Date.now();
        const decorrido = Math.floor((agora - inicio) / 60000);
        const restante = Math.max(0, ordem.tempo_estimado_minutos - decorrido);
        return restante;
      }
      return ordem.tempo_estimado_minutos;
    }
    
    return 0;
  };

  const tempoRestante = getTempoRestante();

  // Loading
  if (loadingEmpresa || loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--empresa-primaria)]" />
        <p className="mt-4 text-gray-400">Buscando seu carro...</p>
      </div>
    );
  }

  // Erro ou nao encontrado
  if (erro || !ordem) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Car className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Carro nao encontrado
          </h1>
          <p className="text-gray-400 mb-2">
            Placa: <span className="font-mono text-white">{placaFormatada}</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {erro || 'Nenhum atendimento ativo com esta placa'}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={refetch}
              className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--empresa-primaria)' }}
            >
              <RefreshCw className="w-5 h-5" />
              Tentar novamente
            </button>
            <button
              onClick={() => router.push(`/app/${slug}`)}
              className="w-full py-3 rounded-xl font-medium text-gray-400 bg-white/5 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Digitar outra placa
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const config = statusConfig[ordem.status as OrdemStatus] || statusConfig.aguardando;
  const StatusIcon = config.icon;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Placa do carro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-4">
          <Car className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-white tracking-wider">{placaFormatada}</span>
        </div>
        {ordem.veiculo_modelo && (
          <p className="text-sm text-gray-500">{ordem.veiculo_modelo}</p>
        )}
      </motion.div>

      {/* Status Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-6 mb-6"
        style={{ backgroundColor: config.bg }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icone animado */}
          <motion.div
            animate={{ 
              scale: ordem.status === 'lavando' ? [1, 1.1, 1] : 1,
            }}
            transition={{ 
              repeat: ordem.status === 'lavando' ? Infinity : 0,
              duration: 2 
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${config.cor}20` }}
          >
            <StatusIcon className="w-10 h-10" style={{ color: config.cor }} />
          </motion.div>

          {/* Status */}
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: config.cor }}
          >
            {config.label}
          </h2>
          <p className="text-gray-400">{config.descricao}</p>

          {/* Indicador de tempo real */}
          {['aguardando', 'lavando', 'secando'].includes(ordem.status) && (
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Atualizando em tempo real
            </div>
          )}
        </div>
      </motion.div>

      {/* Informacoes adicionais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Posicao na fila */}
        {ordem.status === 'aguardando' && posicao > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/5"
          >
            <p className="text-sm text-gray-400 mb-1">Posicao na fila</p>
            <p className="text-2xl font-bold text-white">
              {posicao}<span className="text-sm text-gray-500">/{totalFila}</span>
            </p>
          </motion.div>
        )}

        {/* Tempo estimado */}
        {tempoRestante !== null && tempoRestante > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/5"
          >
            <p className="text-sm text-gray-400 mb-1">Tempo estimado</p>
            <p className="text-2xl font-bold text-white">
              ~{tempoRestante}<span className="text-sm text-gray-500"> min</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Servicos */}
      {ordem.status !== 'entregue' && ordem.status !== 'cancelado' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6"
        >
          <p className="text-sm text-gray-400 mb-3">Servicos</p>
          <div className="flex flex-wrap gap-2">
            {/* Placeholder - em producao viria de ordem_servico_itens */}
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white">
              Lavagem Completa
            </span>
          </div>
        </motion.div>
      )}

      {/* Valor */}
      {ordem.valor_total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Total</p>
            <p className="text-2xl font-bold text-white font-mono">
              R$ {ordem.valor_total.toFixed(2)}
            </p>
          </div>
          {ordem.desconto > 0 && (
            <p className="text-sm text-green-400 text-right mt-1">
              Desconto aplicado: R$ {ordem.desconto.toFixed(2)}
            </p>
          )}
        </motion.div>
      )}

      {/* Pronto para retirada */}
      <AnimatePresence>
        {ordem.status === 'finalizado' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center"
          >
            <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Seu carro esta pronto!
            </h3>
            <p className="text-gray-400 text-sm">
              Dirija-se ao balcao para retirar seu veiculo
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botao voltar */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => router.push(`/app/${slug}`)}
        className="w-full mt-6 py-3 rounded-xl font-medium text-gray-400 bg-white/5 flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Acompanhar outro carro
      </motion.button>
    </div>
  );
}

