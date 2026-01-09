'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Car, ArrowRight, Loader2 } from 'lucide-react';

export default function PWAHomePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Formatar placa automaticamente (ABC-1234 ou ABC1D23)
  const formatarPlaca = (value: string) => {
    // Remove tudo exceto letras e numeros
    const limpo = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Formato antigo: ABC-1234
    if (limpo.length <= 7) {
      if (limpo.length > 3) {
        return limpo.slice(0, 3) + '-' + limpo.slice(3, 7);
      }
      return limpo;
    }
    return limpo.slice(0, 7);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaca(formatarPlaca(e.target.value));
    setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar placa
    const placaLimpa = placa.replace('-', '');
    if (placaLimpa.length < 7) {
      setErro('Digite uma placa valida');
      return;
    }

    setLoading(true);
    
    // Navegar para a pagina de acompanhamento
    router.push(`/app/${slug}/${placa.replace('-', '')}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {/* Icone */}
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--empresa-primaria, #0066FF)', opacity: 0.1 }}
        >
          <Car className="w-10 h-10" style={{ color: 'var(--empresa-primaria, #0066FF)' }} />
        </div>

        {/* Titulo */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Acompanhe seu carro
        </h1>
        <p className="text-gray-400">
          Digite a placa do seu veiculo para ver o status em tempo real
        </p>
      </motion.div>

      {/* Formulario */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Campo de placa */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Placa do veiculo
          </label>
          <div className="relative">
            <input
              type="text"
              value={placa}
              onChange={handleChange}
              placeholder="ABC-1234"
              maxLength={8}
              disabled={loading}
              className="w-full px-4 py-4 bg-[#12121A] border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder:text-gray-600 focus:border-[var(--empresa-primaria)] focus:ring-2 focus:ring-[var(--empresa-primaria)]/20 transition-all disabled:opacity-50 uppercase"
              style={{ letterSpacing: '0.3em' }}
            />
          </div>
          {erro && (
            <p className="mt-2 text-sm text-red-400 text-center">{erro}</p>
          )}
        </div>

        {/* Botao */}
        <button
          type="submit"
          disabled={loading || placa.length < 7}
          className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--empresa-primaria, #0066FF)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Acompanhar
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.form>

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 p-4 bg-white/5 rounded-xl"
      >
        <p className="text-sm text-gray-400 text-center">
          <span className="text-[var(--empresa-primaria)] font-medium">Dica:</span>{' '}
          A placa esta no recibo que voce recebeu na entrada
        </p>
      </motion.div>
    </div>
  );
}

