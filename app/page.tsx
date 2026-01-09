'use client';

import { motion } from 'framer-motion';
import { Car, Clock, BarChart3, Tag, ChevronRight, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useConfigs } from '@/lib/ConfigsContext';

export default function LandingPage() {
  const { configs, loading } = useConfigs();

  // Valores padrao caso nao estejam configurados no banco
  const c = (key: string, fallback: string) => configs[key] || fallback;

  return (
    <div className="min-h-screen bg-[var(--cor-fundo)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              {c('logo_texto', 'Lava')}<span className="text-[var(--cor-primaria)]">{c('logo_destaque', 'Ja')}</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/painel" 
              className="text-[var(--cor-texto-secundario)] hover:text-white transition-colors"
            >
              {c('nav_entrar', 'Entrar')}
            </Link>
            <Link 
              href="/painel" 
              className="btn-primary flex items-center gap-2"
            >
              {c('nav_cta', 'Acessar Painel')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--cor-primaria)] opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--cor-secundaria)] opacity-10 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(var(--cor-borda) 1px, transparent 1px),
                linear-gradient(90deg, var(--cor-borda) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--cor-card)] border border-[var(--cor-borda)] mb-8">
              <Sparkles className="w-4 h-4 text-[var(--cor-secundaria)]" />
              <span className="text-sm text-[var(--cor-texto-secundario)]">
                {c('hero_badge', 'Sistema completo para lava-carros')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {c('hero_titulo_1', 'Gerencie seu lava-car')}
              <br />
              <span className="bg-gradient-to-r from-[var(--cor-primaria)] to-[var(--cor-secundaria)] bg-clip-text text-transparent">
                {c('hero_titulo_2', 'de qualquer lugar')}
              </span>
            </h1>

            <p className="text-xl text-[var(--cor-texto-muted)] max-w-2xl mx-auto mb-10">
              {c('hero_subtitulo', 'Fila em tempo real, promocoes automaticas, metricas detalhadas. Tudo o que voce precisa para profissionalizar seu negocio.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/painel" 
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                {c('hero_cta_primario', 'Comecar Agora')}
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a 
                href={`https://wa.me/${c('whatsapp', '5511999999999')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4"
              >
                {c('hero_cta_secundario', 'Falar com Consultor')}
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { valor: c('stat1_valor', '500+'), label: c('stat1_label', 'Lava-cars') },
                { valor: c('stat2_valor', '50k+'), label: c('stat2_label', 'Carros/mes') },
                { valor: c('stat3_valor', '99.9%'), label: c('stat3_label', 'Uptime') },
                { valor: c('stat4_valor', '4.9'), label: c('stat4_label', 'Avaliacao') },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-[var(--cor-card)] border border-[var(--cor-borda)]"
                >
                  <div className="text-3xl font-bold text-white font-mono">{stat.valor}</div>
                  <div className="text-sm text-[var(--cor-texto-muted)]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {c('features_titulo', 'Tudo que voce precisa')}
            </h2>
            <p className="text-[var(--cor-texto-muted)] text-lg max-w-2xl mx-auto">
              {c('features_subtitulo', 'Ferramentas poderosas para simplificar a gestao do seu lava-car')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                titulo: c('feature1_titulo', 'Fila em Tempo Real'),
                descricao: c('feature1_descricao', 'Seus clientes acompanham a fila pelo celular. Sem mais perguntas.'),
                cor: 'var(--cor-primaria)'
              },
              {
                icon: Tag,
                titulo: c('feature2_titulo', 'Promocoes Automaticas'),
                descricao: c('feature2_descricao', 'Configure descontos por horario, dia da semana ou servico.'),
                cor: 'var(--cor-secundaria)'
              },
              {
                icon: BarChart3,
                titulo: c('feature3_titulo', 'Metricas Detalhadas'),
                descricao: c('feature3_descricao', 'Faturamento, tempo medio, servicos mais vendidos em um clique.'),
                cor: '#F59E0B'
              },
              {
                icon: Shield,
                titulo: c('feature4_titulo', 'Seguro e Confiavel'),
                descricao: c('feature4_descricao', 'Seus dados protegidos com a melhor tecnologia do mercado.'),
                cor: '#22C55E'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--cor-card)] border border-[var(--cor-borda)] hover:border-[var(--cor-borda-hover)] transition-all group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.cor}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.cor }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.titulo}</h3>
                <p className="text-[var(--cor-texto-muted)] text-sm">{feature.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-[var(--cor-fundo-elevado)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {c('passos_titulo', 'Como Funciona')}
            </h2>
            <p className="text-[var(--cor-texto-muted)] text-lg">
              {c('passos_subtitulo', 'Em 3 passos simples voce esta pronto')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                passo: '01',
                titulo: c('passo1_titulo', 'Crie sua conta'),
                descricao: c('passo1_descricao', 'Cadastre seu lava-car em minutos. Sem burocracia, sem complicacao.')
              },
              {
                passo: '02',
                titulo: c('passo2_titulo', 'Configure seus servicos'),
                descricao: c('passo2_descricao', 'Adicione servicos, precos e promocoes pelo painel intuitivo.')
              },
              {
                passo: '03',
                titulo: c('passo3_titulo', 'Comece a usar'),
                descricao: c('passo3_descricao', 'Compartilhe o QR Code com seus clientes e veja a magica acontecer.')
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                {/* Linha conectora */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-[var(--cor-borda)] to-transparent" />
                )}
                
                <div className="relative z-10">
                  <div className="text-6xl font-bold text-[var(--cor-primaria)] opacity-20 mb-4 font-mono">
                    {item.passo}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.titulo}</h3>
                  <p className="text-[var(--cor-texto-muted)]">{item.descricao}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] opacity-90" />
            
            {/* Pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10 text-center">
              <Zap className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {c('cta_titulo', 'Pronto para profissionalizar seu lava-car?')}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                {c('cta_subtitulo', 'Junte-se a centenas de lava-carros que ja usam LavaJa para crescer.')}
              </p>
              <Link 
                href="/painel" 
                className="inline-flex items-center gap-2 bg-white text-[var(--cor-primaria)] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                {c('cta_botao', 'Comecar Gratuitamente')}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--cor-borda)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cor-primaria)] to-[var(--cor-secundaria)] flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                {c('logo_texto', 'Lava')}<span className="text-[var(--cor-primaria)]">{c('logo_destaque', 'Ja')}</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-[var(--cor-texto-muted)] text-sm">
              <a href="#" className="hover:text-white transition-colors">{c('footer_termos', 'Termos de Uso')}</a>
              <a href="#" className="hover:text-white transition-colors">{c('footer_privacidade', 'Privacidade')}</a>
              <a href="#" className="hover:text-white transition-colors">{c('footer_contato', 'Contato')}</a>
              <Link href="/admin" className="hover:text-white transition-colors opacity-50">Admin</Link>
            </div>

            <div className="text-[var(--cor-texto-muted)] text-sm">
              {c('footer_copyright', '2025 LavaJa. Todos os direitos reservados.')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
