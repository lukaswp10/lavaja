'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Clock, Image, Save, Loader2, Upload, QrCode, Copy, Check } from 'lucide-react';

interface Configuracoes { nome: string; telefone: string; endereco: string; corPrimaria: string; corSecundaria: string; logoUrl: string; bannerUrl: string; }
interface Horario { dia: number; nome: string; abertura: string; fechamento: string; fechado: boolean; capacidade: number; }
const diasSemana = [{ dia: 0, nome: 'Domingo' }, { dia: 1, nome: 'Segunda' }, { dia: 2, nome: 'Terca' }, { dia: 3, nome: 'Quarta' }, { dia: 4, nome: 'Quinta' }, { dia: 5, nome: 'Sexta' }, { dia: 6, nome: 'Sabado' }];

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'visual' | 'horarios'>('geral');
  const [config, setConfig] = useState<Configuracoes>({ nome: '', telefone: '', endereco: '', corPrimaria: '#0066FF', corSecundaria: '#00D4AA', logoUrl: '', bannerUrl: '' });
  const [horarios, setHorarios] = useState<Horario[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setConfig({ nome: 'Lava Car Demo', telefone: '11999999999', endereco: 'Rua das Flores, 123 - Sao Paulo, SP', corPrimaria: '#0066FF', corSecundaria: '#00D4AA', logoUrl: '', bannerUrl: '' });
      setHorarios([
        { dia: 0, nome: 'Domingo', abertura: '', fechamento: '', fechado: true, capacidade: 4 },
        { dia: 1, nome: 'Segunda', abertura: '08:00', fechamento: '18:00', fechado: false, capacidade: 4 },
        { dia: 2, nome: 'Terca', abertura: '08:00', fechamento: '18:00', fechado: false, capacidade: 4 },
        { dia: 3, nome: 'Quarta', abertura: '08:00', fechamento: '18:00', fechado: false, capacidade: 4 },
        { dia: 4, nome: 'Quinta', abertura: '08:00', fechamento: '18:00', fechado: false, capacidade: 4 },
        { dia: 5, nome: 'Sexta', abertura: '08:00', fechamento: '18:00', fechado: false, capacidade: 4 },
        { dia: 6, nome: 'Sabado', abertura: '08:00', fechamento: '14:00', fechado: false, capacidade: 4 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const salvar = async () => { setSalvando(true); await new Promise(r => setTimeout(r, 1000)); setSalvando(false); alert('Configuracoes salvas!'); };
  const copiarLink = () => { navigator.clipboard.writeText('https://lavaja.com.br/app/demo'); setCopiado(true); setTimeout(() => setCopiado(false), 2000); };
  const tabs = [{ id: 'geral', label: 'Geral', icon: QrCode }, { id: 'visual', label: 'Visual', icon: Palette }, { id: 'horarios', label: 'Horarios', icon: Clock }] as const;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[var(--cor-primaria)]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Configuracoes</h1><p className="text-[var(--cor-texto-muted)]">Personalize seu lava-car</p></div>
        <button onClick={salvar} disabled={salvando} className="btn-primary flex items-center gap-2">{salvando ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar Alteracoes</>}</button>
      </div>

      <div className="flex gap-2 border-b border-[var(--cor-borda)] pb-1">
        {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-[var(--cor-card)] text-white border-b-2 border-[var(--cor-primaria)]' : 'text-[var(--cor-texto-muted)] hover:text-white'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-2xl p-6">
        {activeTab === 'geral' && (
          <div className="space-y-6">
            <div className="p-4 bg-[var(--cor-fundo)] rounded-xl border border-[var(--cor-borda)]">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center"><QrCode className="w-16 h-16 text-black" /></div>
                <div className="flex-1"><h3 className="text-white font-semibold mb-1">Link do seu App</h3><p className="text-[var(--cor-texto-muted)] text-sm mb-3">Compartilhe este link ou QR Code com seus clientes</p><div className="flex items-center gap-2"><code className="flex-1 px-3 py-2 bg-[var(--cor-card)] rounded-lg text-sm text-[var(--cor-texto-secundario)] truncate">https://lavaja.com.br/app/demo</code><button onClick={copiarLink} className="p-2 rounded-lg bg-[var(--cor-primaria)] text-white hover:bg-[var(--cor-primaria-hover)]">{copiado ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button></div></div>
              </div>
            </div>
            <div className="grid gap-4">
              <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Nome da Empresa</label><input type="text" value={config.nome} onChange={(e) => setConfig(c => ({ ...c, nome: e.target.value }))} className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Telefone / WhatsApp</label><input type="text" value={config.telefone} onChange={(e) => setConfig(c => ({ ...c, telefone: e.target.value }))} placeholder="11999999999" className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Endereco</label><input type="text" value={config.endereco} onChange={(e) => setConfig(c => ({ ...c, endereco: e.target.value }))} placeholder="Rua, Numero - Cidade, UF" className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div><h3 className="text-white font-semibold mb-4">Cores do App</h3><div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Cor Primaria</label><div className="flex items-center gap-3"><input type="color" value={config.corPrimaria} onChange={(e) => setConfig(c => ({ ...c, corPrimaria: e.target.value }))} className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent" /><input type="text" value={config.corPrimaria} onChange={(e) => setConfig(c => ({ ...c, corPrimaria: e.target.value }))} className="flex-1 px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl font-mono uppercase" /></div></div>
              <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Cor Secundaria</label><div className="flex items-center gap-3"><input type="color" value={config.corSecundaria} onChange={(e) => setConfig(c => ({ ...c, corSecundaria: e.target.value }))} className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent" /><input type="text" value={config.corSecundaria} onChange={(e) => setConfig(c => ({ ...c, corSecundaria: e.target.value }))} className="flex-1 px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl font-mono uppercase" /></div></div>
            </div></div>
            <div><h3 className="text-white font-semibold mb-4">Imagens</h3><div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Logo</label><div className="border-2 border-dashed border-[var(--cor-borda)] rounded-xl p-6 text-center hover:border-[var(--cor-primaria)] cursor-pointer"><Upload className="w-8 h-8 mx-auto mb-2 text-[var(--cor-texto-muted)]" /><p className="text-[var(--cor-texto-muted)] text-sm">Clique para enviar</p></div></div>
              <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Banner</label><div className="border-2 border-dashed border-[var(--cor-borda)] rounded-xl p-6 text-center hover:border-[var(--cor-primaria)] cursor-pointer"><Image className="w-8 h-8 mx-auto mb-2 text-[var(--cor-texto-muted)]" /><p className="text-[var(--cor-texto-muted)] text-sm">Clique para enviar</p></div></div>
            </div></div>
          </div>
        )}

        {activeTab === 'horarios' && (
          <div className="space-y-4">
            <p className="text-[var(--cor-texto-muted)] text-sm">Configure os horarios de funcionamento do seu lava-car</p>
            {horarios.map((h, i) => (
              <div key={h.dia} className={`flex items-center gap-4 p-4 rounded-xl border ${h.fechado ? 'bg-[var(--cor-fundo)]/50 border-[var(--cor-borda)]' : 'bg-[var(--cor-fundo)] border-[var(--cor-borda)]'}`}>
                <span className={`w-24 font-medium ${h.fechado ? 'text-[var(--cor-texto-muted)]' : 'text-white'}`}>{h.nome}</span>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={h.fechado} onChange={() => { const u = [...horarios]; u[i].fechado = !u[i].fechado; setHorarios(u); }} className="w-4 h-4 rounded" /><span className="text-sm text-[var(--cor-texto-muted)]">Fechado</span></label>
                {!h.fechado && (<><div className="flex items-center gap-2"><input type="time" value={h.abertura} onChange={(e) => { const u = [...horarios]; u[i].abertura = e.target.value; setHorarios(u); }} className="px-3 py-2 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-lg text-sm" /><span className="text-[var(--cor-texto-muted)]">ate</span><input type="time" value={h.fechamento} onChange={(e) => { const u = [...horarios]; u[i].fechamento = e.target.value; setHorarios(u); }} className="px-3 py-2 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-lg text-sm" /></div><div className="flex items-center gap-2 ml-auto"><span className="text-sm text-[var(--cor-texto-muted)]">Capacidade:</span><input type="number" value={h.capacidade} onChange={(e) => { const u = [...horarios]; u[i].capacidade = parseInt(e.target.value); setHorarios(u); }} min="1" max="20" className="w-16 px-3 py-2 bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-lg text-sm text-center font-mono" /><span className="text-sm text-[var(--cor-texto-muted)]">carros/h</span></div></>)}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
