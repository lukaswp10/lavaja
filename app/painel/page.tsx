'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConfigs } from '@/lib/ConfigsContext';

export default function PainelLoginPage() {
  const router = useRouter();
  const { configs } = useConfigs();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const c = (key: string, fallback: string) => configs[key] || fallback;

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

      // Redirecionar para o painel da empresa
      if (data.usuario.empresa_slug) {
        router.push(`/painel/${data.usuario.empresa_slug}`);
      } else if (data.usuario.role === 'super_admin') {
        router.push('/admin/dashboard');
      }
    } catch {
      setErro('Erro de conexao. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--cor-primaria)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--cor-secundaria)] opacity-5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--cor-borda) 1px, transparent 1px),
              linear-gradient(90deg, var(--cor-borda) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card de Login */}
        <div className="bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              {c('login_titulo', 'Bem-vindo de volta')}
            </h1>
            <p className="text-[var(--cor-texto-muted)]">
              {c('login_subtitulo', 'Gerencie seu lava-car de qualquer lugar')}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">
                {c('login_email_label', 'Email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c('login_email_placeholder', 'seu@email.com')}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl text-white placeholder:text-[var(--cor-texto-muted)] focus:border-[var(--cor-primaria)] focus:ring-2 focus:ring-[var(--cor-primaria)]/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">
                {c('login_senha_label', 'Senha')}
              </label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder={c('login_senha_placeholder', 'Sua senha')}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl text-white placeholder:text-[var(--cor-texto-muted)] focus:border-[var(--cor-primaria)] focus:ring-2 focus:ring-[var(--cor-primaria)]/20 transition-all disabled:opacity-50"
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
              className="w-full py-3.5 bg-gradient-to-r from-[var(--cor-primaria)] to-[var(--cor-primaria-hover)] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {c('login_entrando', 'Entrando...')}
                </>
              ) : (
                c('login_botao', 'Entrar no Painel')
              )}
            </button>
          </form>

          {/* Link esqueci senha */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[var(--cor-texto-muted)] hover:text-[var(--cor-primaria)] transition-colors">
              {c('login_esqueci_senha', 'Esqueci minha senha')}
            </a>
          </div>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--cor-borda)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--cor-card)] text-[var(--cor-texto-muted)]">
                {c('login_ou', 'ou')}
              </span>
            </div>
          </div>

          {/* CTA para novos */}
          <div className="text-center">
            <p className="text-[var(--cor-texto-muted)] text-sm mb-3">
              {c('login_sem_conta', 'Ainda nao tem conta?')}
            </p>
            <a 
              href={`https://wa.me/${c('whatsapp', '5511999999999')}?text=${encodeURIComponent(c('login_whatsapp_msg', 'Oi! Quero usar o LavaJa no meu lava-car'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--cor-primaria)] hover:text-[var(--cor-secundaria)] transition-colors font-medium"
            >
              {c('login_fale_conosco', 'Fale conosco no WhatsApp')}
            </a>
          </div>
        </div>

        {/* Link voltar */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-[var(--cor-texto-muted)] hover:text-white transition-colors"
          >
            {c('login_voltar', '? Voltar para o site')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
