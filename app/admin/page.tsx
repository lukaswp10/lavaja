'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
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
        setErro(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      // Verificar se e super admin
      if (data.usuario.role !== 'super_admin') {
        setErro('Acesso negado. Apenas super admins podem acessar esta area.');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setErro('Erro de conexao. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#050508]">
      {/* Background mais escuro para admin */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--cor-primaria)] opacity-3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card de Login */}
        <div className="bg-[#0a0a0f] border border-[var(--cor-borda)] rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--cor-primaria)] to-purple-600 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Super Admin
            </h1>
            <p className="text-[var(--cor-texto-muted)] text-sm">
              Acesso restrito ao sistema
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lavaja.com.br"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[#050508] border border-[var(--cor-borda)] rounded-xl text-white placeholder:text-[var(--cor-texto-muted)] focus:border-[var(--cor-primaria)] focus:ring-2 focus:ring-[var(--cor-primaria)]/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-[#050508] border border-[var(--cor-borda)] rounded-xl text-white placeholder:text-[var(--cor-texto-muted)] focus:border-[var(--cor-primaria)] focus:ring-2 focus:ring-[var(--cor-primaria)]/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cor-texto-muted)] hover:text-white transition-colors"
                >
                  {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {erro}
              </motion.div>
            )}

            {/* Botao */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--cor-primaria)] to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acessar Sistema'
              )}
            </button>
          </form>
        </div>

        {/* Link voltar */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-[var(--cor-texto-muted)] hover:text-white transition-colors"
          >
            ? Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
