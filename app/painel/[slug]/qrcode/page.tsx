'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Smartphone,
  Share2,
  Printer
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTenant } from '../layout';

export default function QRCodePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { empresa } = useTenant();
  
  const [copiado, setCopiado] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gerar URL do app
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://lavaja.app';
    setAppUrl(`${baseUrl}/app/${slug}`);
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const downloadQR = () => {
    // Em producao, geraria imagem real do QR Code
    alert('Em breve: Download do QR Code em PNG');
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: empresa?.nome || 'Lava Car',
          text: `Acompanhe seu carro em tempo real no ${empresa?.nome || 'nosso lava'}!`,
          url: appUrl,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">QR Code e Link</h1>
        <p className="text-white/50">
          Compartilhe com seus clientes para acompanharem o status
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              QR Code do seu App
            </h2>
            
            {/* QR Code */}
            <div 
              ref={qrRef}
              className="inline-flex flex-col items-center p-6 bg-white rounded-2xl mb-6"
            >
              {/* Placeholder - Em producao usar biblioteca de QR Code */}
              <div className="w-48 h-48 bg-black flex items-center justify-center rounded-lg mb-3">
                <div className="grid grid-cols-7 gap-1 p-4">
                  {/* QR Code pattern simulado */}
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono">{slug}</p>
            </div>

            {/* Botoes */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Baixar PNG
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all text-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </motion.div>

        {/* Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Link do App
          </h2>

          {/* URL */}
          <div className="mb-6">
            <label className="block text-sm text-white/40 mb-2">
              URL exclusiva do seu lava
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <code className="text-white/70 text-sm break-all">{appUrl}</code>
              </div>
              <button
                onClick={copyLink}
                className="p-3 bg-[var(--empresa-primaria,#3B82F6)] rounded-xl text-white hover:opacity-90 transition-opacity flex-shrink-0"
              >
                {copiado ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Acoes */}
          <div className="space-y-3">
            <a
              href={appUrl}
              target="_blank"
              className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--empresa-primaria,#3B82F6)]/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-[var(--empresa-primaria,#3B82F6)]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Abrir App</p>
                  <p className="text-white/40 text-xs">Ver como o cliente ve</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60" />
            </a>

            <button
              onClick={shareLink}
              className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Compartilhar</p>
                  <p className="text-white/40 text-xs">Enviar via WhatsApp, etc</p>
                </div>
              </div>
              <Share2 className="w-4 h-4 text-white/30 group-hover:text-white/60" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Dicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[var(--empresa-primaria,#3B82F6)]" />
          Como usar
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--empresa-primaria,#3B82F6)]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-[var(--empresa-primaria,#3B82F6)] font-bold">1</span>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">Imprima o QR Code</h3>
            <p className="text-white/40 text-sm">
              Coloque no balcao ou na entrada do lava
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--empresa-primaria,#3B82F6)]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-[var(--empresa-primaria,#3B82F6)] font-bold">2</span>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">Cliente escaneia</h3>
            <p className="text-white/40 text-sm">
              Com a camera do celular
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--empresa-primaria,#3B82F6)]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-[var(--empresa-primaria,#3B82F6)] font-bold">3</span>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">Acompanha o carro</h3>
            <p className="text-white/40 text-sm">
              Ve o status em tempo real
            </p>
          </div>
        </div>
      </motion.div>

      {/* Seguranca */}
      <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
        <p className="text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>
            <strong>Link exclusivo:</strong> Seus clientes so conseguem ver os dados do seu lava. Nao tem como acessar outros estabelecimentos.
          </span>
        </p>
      </div>
    </div>
  );
}

