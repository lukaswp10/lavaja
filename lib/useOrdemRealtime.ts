'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { OrdemServico } from './supabase';

interface UseOrdemRealtimeReturn {
  ordem: OrdemServico | null;
  loading: boolean;
  erro: string | null;
  refetch: () => Promise<void>;
}

export function useOrdemRealtime(
  empresaId: string,
  placa: string
): UseOrdemRealtimeReturn {
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar ordem inicial
  const fetchOrdem = useCallback(async () => {
    if (!empresaId || !placa) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      // Buscar ordem ativa (nao entregue/cancelada) com esta placa
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('veiculo_placa', placa.toUpperCase())
        .in('status', ['aguardando', 'lavando', 'secando', 'finalizado'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Nenhum registro encontrado
          setOrdem(null);
          setErro('Nenhum carro encontrado com esta placa');
        } else {
          setErro('Erro ao buscar dados');
        }
      } else {
        setOrdem(data);
      }
    } catch {
      setErro('Erro de conexao');
    } finally {
      setLoading(false);
    }
  }, [empresaId, placa]);

  // Buscar dados iniciais
  useEffect(() => {
    fetchOrdem();
  }, [fetchOrdem]);

  // Configurar Realtime subscription
  useEffect(() => {
    if (!empresaId || !placa) return;

    // Subscribe para mudancas na tabela ordens_servico
    const channel = supabase
      .channel(`ordem-${empresaId}-${placa}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'ordens_servico',
          filter: `empresa_id=eq.${empresaId}`,
        },
        (payload) => {
          // Verificar se e a ordem que estamos acompanhando
          const newRecord = payload.new as OrdemServico;
          const oldRecord = payload.old as OrdemServico;

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (newRecord.veiculo_placa?.toUpperCase() === placa.toUpperCase()) {
              // Apenas atualiza se nao for status terminal
              if (['aguardando', 'lavando', 'secando', 'finalizado'].includes(newRecord.status)) {
                setOrdem(newRecord);
                setErro(null);
              } else if (newRecord.status === 'entregue' || newRecord.status === 'cancelado') {
                setOrdem(newRecord);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            if (oldRecord?.veiculo_placa?.toUpperCase() === placa.toUpperCase()) {
              setOrdem(null);
              setErro('Ordem foi removida');
            }
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [empresaId, placa]);

  return {
    ordem,
    loading,
    erro,
    refetch: fetchOrdem,
  };
}

// Hook auxiliar para buscar posicao na fila
export function usePosicaoFila(empresaId: string, ordemId: string | null) {
  const [posicao, setPosicao] = useState<number>(0);
  const [totalFila, setTotalFila] = useState<number>(0);

  useEffect(() => {
    if (!empresaId || !ordemId) return;

    async function fetchPosicao() {
      // Buscar todas as ordens em espera/lavando antes desta
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('id, posicao_fila, status')
        .eq('empresa_id', empresaId)
        .in('status', ['aguardando', 'lavando'])
        .order('posicao_fila', { ascending: true });

      if (!error && data) {
        setTotalFila(data.length);
        const idx = data.findIndex(o => o.id === ordemId);
        setPosicao(idx >= 0 ? idx + 1 : 0);
      }
    }

    fetchPosicao();

    // Subscribe para atualizacoes
    const channel = supabase
      .channel(`fila-${empresaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ordens_servico',
          filter: `empresa_id=eq.${empresaId}`,
        },
        () => {
          // Rebuscar posicao quando houver mudanca
          fetchPosicao();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [empresaId, ordemId]);

  return { posicao, totalFila };
}

