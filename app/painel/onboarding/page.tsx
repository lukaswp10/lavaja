'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Palette, 
  Plus, 
  Trash2, 
  Check, 
  QrCode, 
  Copy,
  Loader2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Servico {
  id: string;
  nome: string;
  preco: string;
  duracao: string;
}

// Servicos sugeridos
const servicosSugeridos: Servico[] = [
  { id: '1', nome: 'Lavagem Simples', preco: '30', duracao: '20' },
  { id: '2', nome: 'Lavagem Completa', preco: '50', duracao: '40' },
  { id: '3', nome: 'Polimento', preco: '120', duracao: '90' },
  { id: '4', nome: 'Higienizacao', preco: '80', duracao: '60' },
];

// Cores sugeridas
const coresSugeridas = [
  { primaria: '#3B82F6', secundaria: '#06B6D4' }, // Azul + Cyan
  { primaria: '#8B5CF6', secundaria: '#EC4899' }, // Roxo + Rosa
  { primaria: '#10B981', secundaria: '#34D399' }, // Verde
  { primaria: '#F59E0B', secundaria: '#FBBF24' }, // Amarelo
  { primaria: '#EF4444', secundaria: '#F97316' }, // Vermelho
  { primaria: '#0EA5E9', secundaria: '#22D3EE' }, // Sky
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  
  // Dados do formulario
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [corPrimaria, setCorPrimaria] = useState('#3B82F6');
  const [corSecundaria, setCorSecundaria] = useState('#06B6D4');
  const [servicos, setServicos] = useState<Servico[]>(servicosSugeridos);

  // Gerar slug automatico
  useEffect(() => {
    const slugGerado = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30);
    setSlug(slugGerado);
  }, [nome]);

  // Handle upload logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar servico
  const addServico = () => {
    setServicos([...servicos, { id: Date.now().toString(), nome: '', preco: '', duracao: '' }]);
  };

  // Remover servico
  const removeServico = (id: string) => {
    if (servicos.length > 1) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  // Atualizar servico
  const updateServico = (id: string, field: keyof Servico, value: string) => {
    setServicos(servicos.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Finalizar onboarding
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Aqui salvaria no Supabase
      // Por enquanto, simular delay e redirecionar
      await new Promise(r => setTimeout(r, 1500));
      
      // Redirecionar para o painel
      router.push(`/painel/${slug || 'demo'}`);
    } catch {
      setLoading(false);
    }
  };

  // Copiar link
  const copyLink = () => {
    navigator.clipboard.writeText(`https://lavaja.app/app/${slug}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // CSS variables dinamicas
  const cssVars = {
    '--onb-primaria': corPrimaria,
    '--onb-secundaria': corSecundaria,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#07070A] flex flex-col" style={cssVars}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--onb-primaria)] to-[var(--onb-secundaria)]"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--onb-primaria)] to-[var(--onb-secundaria)] flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/40 text-sm">Configurando seu lava...</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <span>Passo</span>
          <span className="text-white font-medium">{step}</span>
          <span>de</span>
          <span>3</span>
        </div>
      </header>

      {/* Conteudo */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* PASSO 1: Identidade */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Identidade do seu lava
                  </h1>
                  <p className="text-white/50">
                    Como seus clientes vao reconhecer voce
                  </p>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Nome do Lava-Car
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Lava Rapido do Joao"
                    className="w-full px-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-lg placeholder:text-white/20 focus:border-[var(--onb-primaria)]/50 focus:outline-none transition-all"
                  />
                  {slug && (
                    <p className="mt-2 text-sm text-white/30">
                      Seu link: lavaja.app/app/<span className="text-[var(--onb-primaria)]">{slug}</span>
                    </p>
                  )}
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Logo (opcional)
                  </label>
                  <div className="flex items-start gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${logoPreview ? 'border-[var(--onb-primaria)]/50 bg-[var(--onb-primaria)]/5' : 'border-white/10 hover:border-white/20'}`}>
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-20 w-auto object-contain" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-white/30 mb-2" />
                            <span className="text-sm text-white/30">Clique para enviar</span>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    
                    {/* Preview sem logo */}
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[var(--onb-primaria)] to-[var(--onb-secundaria)] flex items-center justify-center">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain" />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {nome ? nome.charAt(0).toUpperCase() : 'L'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-3">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Cores do seu app
                  </label>
                  
                  {/* Presets */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coresSugeridas.map((cor, i) => (
                      <button
                        key={i}
                        onClick={() => { setCorPrimaria(cor.primaria); setCorSecundaria(cor.secundaria); }}
                        className={`w-12 h-12 rounded-xl transition-all ${corPrimaria === cor.primaria ? 'ring-2 ring-white ring-offset-2 ring-offset-[#07070A]' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${cor.primaria}, ${cor.secundaria})` }}
                      />
                    ))}
                  </div>

                  {/* Custom */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-white/40 mb-1">Primaria</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white font-mono text-sm uppercase"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-white/40 mb-1">Secundaria</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={corSecundaria}
                          onChange={(e) => setCorSecundaria(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={corSecundaria}
                          onChange={(e) => setCorSecundaria(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white font-mono text-sm uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASSO 2: Servicos */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Servicos oferecidos
                  </h1>
                  <p className="text-white/50">
                    O que seu lava oferece para os clientes
                  </p>
                </div>

                {/* Lista de servicos */}
                <div className="space-y-3">
                  {servicos.map((servico, index) => (
                    <motion.div
                      key={servico.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--onb-primaria)]/10 flex items-center justify-center text-[var(--onb-primaria)] font-medium text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={servico.nome}
                        onChange={(e) => updateServico(servico.id, 'nome', e.target.value)}
                        placeholder="Nome do servico"
                        className="flex-1 px-3 py-2 bg-transparent border border-white/[0.06] rounded-lg text-white placeholder:text-white/20 focus:border-[var(--onb-primaria)]/50 focus:outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-white/30 text-sm">R$</span>
                        <input
                          type="number"
                          value={servico.preco}
                          onChange={(e) => updateServico(servico.id, 'preco', e.target.value)}
                          placeholder="0"
                          className="w-20 px-3 py-2 bg-transparent border border-white/[0.06] rounded-lg text-white text-right font-mono placeholder:text-white/20 focus:border-[var(--onb-primaria)]/50 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={servico.duracao}
                          onChange={(e) => updateServico(servico.id, 'duracao', e.target.value)}
                          placeholder="0"
                          className="w-16 px-3 py-2 bg-transparent border border-white/[0.06] rounded-lg text-white text-right font-mono placeholder:text-white/20 focus:border-[var(--onb-primaria)]/50 focus:outline-none"
                        />
                        <span className="text-white/30 text-sm">min</span>
                      </div>
                      <button
                        onClick={() => removeServico(servico.id)}
                        disabled={servicos.length <= 1}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Adicionar */}
                <button
                  onClick={addServico}
                  className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/40 hover:text-white/60 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar servico
                </button>
              </motion.div>
            )}

            {/* PASSO 3: Pronto */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--onb-primaria)] to-[var(--onb-secundaria)] flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Tudo pronto!
                  </h1>
                  <p className="text-white/50">
                    Seu lava-car esta configurado e pronto para usar
                  </p>
                </div>

                {/* Preview do app */}
                <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {nome ? nome.charAt(0).toUpperCase() : 'L'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{nome || 'Seu Lava-Car'}</h3>
                      <p className="text-white/40 text-sm">{servicos.length} servicos configurados</p>
                    </div>
                  </div>

                  {/* QR Code placeholder */}
                  <div className="flex items-center gap-6 p-4 bg-white/[0.03] rounded-xl">
                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-sm mb-2">Link do app para seus clientes:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white/[0.05] rounded-lg text-sm text-white/70 truncate">
                          lavaja.app/app/{slug || 'seu-lava'}
                        </code>
                        <button
                          onClick={copyLink}
                          className="p-2 bg-[var(--onb-primaria)] rounded-lg text-white hover:opacity-90 transition-opacity"
                        >
                          {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview link */}
                <a
                  href={`/app/${slug || 'demo'}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver como o cliente vai ver
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer com botoes */}
      <footer className="p-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Voltar */}
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {/* Proximo / Finalizar */}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !nome}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--onb-primaria)] to-[var(--onb-secundaria)] text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--onb-primaria)] to-[var(--onb-secundaria)] text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Ir para o Painel
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

