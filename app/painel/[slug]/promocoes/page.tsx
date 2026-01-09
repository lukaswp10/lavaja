'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, Percent, Calendar, Clock, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

interface Promocao { id: string; nome: string; descricao: string; tipo: 'porcentagem' | 'valor_fixo'; valor: number; diasSemana: number[]; horaInicio: string; horaFim: string; ativa: boolean; }
const diasSemanaLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function PromocoesPage() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Promocao | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', tipo: 'porcentagem' as 'porcentagem' | 'valor_fixo', valor: '', diasSemana: [] as number[], horaInicio: '', horaFim: '' });

  useEffect(() => {
    setTimeout(() => {
      setPromocoes([
        { id: '1', nome: 'Segunda e Quarta', descricao: '10% de desconto em qualquer servico', tipo: 'porcentagem', valor: 10, diasSemana: [1, 3], horaInicio: '08:00', horaFim: '12:00', ativa: true },
        { id: '2', nome: 'Happy Hour', descricao: 'R$5 de desconto apos as 16h', tipo: 'valor_fixo', valor: 5, diasSemana: [1, 2, 3, 4, 5], horaInicio: '16:00', horaFim: '18:00', ativa: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const abrirModal = (promo?: Promocao) => {
    if (promo) { setEditando(promo); setForm({ nome: promo.nome, descricao: promo.descricao, tipo: promo.tipo, valor: promo.valor.toString(), diasSemana: promo.diasSemana, horaInicio: promo.horaInicio, horaFim: promo.horaFim }); }
    else { setEditando(null); setForm({ nome: '', descricao: '', tipo: 'porcentagem', valor: '', diasSemana: [], horaInicio: '', horaFim: '' }); }
    setShowModal(true);
  };

  const salvarPromocao = async () => {
    setSalvando(true); await new Promise(r => setTimeout(r, 500));
    if (editando) { setPromocoes(prev => prev.map(p => p.id === editando.id ? { ...p, ...form, valor: parseFloat(form.valor) } : p)); }
    else { setPromocoes(prev => [...prev, { id: Date.now().toString(), ...form, valor: parseFloat(form.valor), ativa: true }]); }
    setSalvando(false); setShowModal(false);
  };

  const toggleDia = (dia: number) => setForm(f => ({ ...f, diasSemana: f.diasSemana.includes(dia) ? f.diasSemana.filter(d => d !== dia) : [...f.diasSemana, dia].sort() }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Promocoes</h1><p className="text-[var(--cor-texto-muted)]">Configure descontos automaticos</p></div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Nova Promocao</button>
      </div>

      <div className="space-y-3">
        {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-24 bg-[var(--cor-card)] rounded-xl animate-pulse" />) : promocoes.length === 0 ? (
          <div className="text-center py-12 bg-[var(--cor-card)] rounded-2xl border border-[var(--cor-borda)]"><Tag className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" /><p className="text-[var(--cor-texto-muted)]">Nenhuma promocao configurada</p><button onClick={() => abrirModal()} className="btn-primary mt-4">Criar primeira promocao</button></div>
        ) : (
          <AnimatePresence>
            {promocoes.map((promo) => (
              <motion.div key={promo.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl bg-[var(--cor-card)] border border-[var(--cor-borda)] ${!promo.ativa ? 'opacity-50' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${promo.tipo === 'porcentagem' ? 'bg-[var(--cor-secundaria)]/10' : 'bg-[var(--cor-primaria)]/10'}`}>
                    {promo.tipo === 'porcentagem' ? <Percent className="w-6 h-6 text-[var(--cor-secundaria)]" /> : <Tag className="w-6 h-6 text-[var(--cor-primaria)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><span className="text-white font-semibold">{promo.nome}</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${promo.tipo === 'porcentagem' ? 'bg-[var(--cor-secundaria)]/10 text-[var(--cor-secundaria)]' : 'bg-[var(--cor-primaria)]/10 text-[var(--cor-primaria)]'}`}>{promo.tipo === 'porcentagem' ? `${promo.valor}%` : `R$ ${promo.valor}`}</span></div>
                    <p className="text-[var(--cor-texto-muted)] text-sm mb-2">{promo.descricao}</p>
                    <div className="flex items-center gap-4 text-sm text-[var(--cor-texto-muted)]"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{promo.diasSemana.map(d => diasSemanaLabels[d]).join(', ')}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{promo.horaInicio} - {promo.horaFim}</span></div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setPromocoes(prev => prev.map(p => p.id === promo.id ? { ...p, ativa: !p.ativa } : p))} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${promo.ativa ? 'bg-green-500/10 text-green-400' : 'bg-[var(--cor-borda)] text-[var(--cor-texto-muted)]'}`}>{promo.ativa ? 'Ativa' : 'Inativa'}</button>
                    <button onClick={() => abrirModal(promo)} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white hover:bg-[var(--cor-fundo)]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setPromocoes(prev => prev.filter(p => p.id !== promo.id))} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">{editando ? 'Editar Promocao' : 'Nova Promocao'}</h2><button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white"><X className="w-5 h-5" /></button></div>
              <form onSubmit={(e) => { e.preventDefault(); salvarPromocao(); }} className="space-y-4">
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Nome</label><input type="text" value={form.nome} onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Segunda Maluca" required className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Descricao</label><input type="text" value={form.descricao} onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Ex: Desconto em todos os servicos" className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Tipo</label><select value={form.tipo} onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value as 'porcentagem' | 'valor_fixo' }))} className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl"><option value="porcentagem">Porcentagem (%)</option><option value="valor_fixo">Valor Fixo (R$)</option></select></div>
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Valor</label><input type="number" value={form.valor} onChange={(e) => setForm(f => ({ ...f, valor: e.target.value }))} placeholder={form.tipo === 'porcentagem' ? '10' : '5.00'} min="0" step="0.01" required className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl font-mono" /></div>
                </div>
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Dias da Semana</label><div className="flex flex-wrap gap-2">{diasSemanaLabels.map((dia, i) => (<button key={i} type="button" onClick={() => toggleDia(i)} className={`px-4 py-2 rounded-lg text-sm font-medium ${form.diasSemana.includes(i) ? 'bg-[var(--cor-primaria)] text-white' : 'bg-[var(--cor-fundo)] text-[var(--cor-texto-muted)]'}`}>{dia}</button>))}</div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Hora Inicio</label><input type="time" value={form.horaInicio} onChange={(e) => setForm(f => ({ ...f, horaInicio: e.target.value }))} className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Hora Fim</label><input type="time" value={form.horaFim} onChange={(e) => setForm(f => ({ ...f, horaFim: e.target.value }))} className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                </div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancelar</button><button type="submit" disabled={salvando} className="flex-1 btn-primary flex items-center justify-center gap-2">{salvando ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar</>}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
