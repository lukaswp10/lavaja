'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';

type ConfigsContextType = {
  configs: Record<string, string>;
  loading: boolean;
  refreshConfigs: () => Promise<void>;
};

const ConfigsContext = createContext<ConfigsContextType>({
  configs: {},
  loading: true,
  refreshConfigs: async () => {},
});

export function ConfigsProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadConfigs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('configuracoes_sistema')
      .select('chave, valor');
    
    if (data) {
      const map = data.reduce((acc, item) => {
        acc[item.chave] = item.valor || '';
        return acc;
      }, {} as Record<string, string>);
      setConfigs(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  return (
    <ConfigsContext.Provider value={{ configs, loading, refreshConfigs: loadConfigs }}>
      {children}
    </ConfigsContext.Provider>
  );
}

export const useConfigs = () => useContext(ConfigsContext);

// Hook para usar configuracoes de uma empresa especifica
export function useEmpresaConfigs(empresaId: string | null) {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaId) {
      setLoading(false);
      return;
    }

    async function load() {
      const { data } = await supabase
        .from('configuracoes_empresa')
        .select('chave, valor')
        .eq('empresa_id', empresaId);
      
      if (data) {
        const map = data.reduce((acc, item) => {
          acc[item.chave] = item.valor || '';
          return acc;
        }, {} as Record<string, string>);
        setConfigs(map);
      }
      setLoading(false);
    }
    load();
  }, [empresaId]);

  return { configs, loading };
}
