'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Droplets } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Credenciais invalidas');
        setLoading(false);
        return;
      }

      // Redirecionar baseado no tipo de usuario
      if (data.usuario.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (data.usuario.empresa_slug) {
        // Verificar se precisa de onboarding
        router.push(`/painel/${data.usuario.empresa_slug}`);
      } else {
        // Usuario sem empresa - redirecionar para onboarding
        router.push('/painel/onboarding');
      }
    } catch {
      setErro('Erro de conexao');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07070A]">
      {/* Background minimalista */}
      <div className="absolute inset-0">
        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#07070A] to-[#0A0A0F]" />
        
        {/* Glow sutil no centro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[120px]" />
        
        {/* Linhas sutis */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        {/* Logo minimalista */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4">
            <Droplets className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={loading}
              autoComplete="email"
              className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all disabled:opacity-50 text-[15px]"
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <input
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              required
              disabled={loading}
              autoComplete="current-password"
              className="w-full px-4 py-3.5 pr-12 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all disabled:opacity-50 text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Erro */}
          {erro && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{erro}</span>
            </motion.div>
          )}

          {/* Botao */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        {/* Link discreto */}
        <p className="mt-8 text-center text-white/20 text-xs">
          Esqueceu a senha?{' '}
          <a href="#" className="text-white/40 hover:text-white/60 transition-colors">
            Recuperar
          </a>
        </p>
      </motion.div>
    </div>
  );
}
