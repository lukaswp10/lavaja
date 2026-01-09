'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical, Clock, DollarSign, X, Save, Loader2 } from 'lucide-react';

interface Servico { id: string; nome: string; descricao: string; preco: number; duracao: number; ativo: boolean; ordem: number; }

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', duracao: '' });

  useEffect(() => {
    setTimeout(() => {
      setServicos([
        { id: '1', nome: 'Lavagem Simples', descricao: 'Lavagem externa completa', preco: 30, duracao: 20, ativo: true, ordem: 1 },
        { id: '2', nome: 'Lavagem Completa', descricao: 'Lavagem externa + interna', preco: 50, duracao: 40, ativo: true, ordem: 2 },
        { id: '3', nome: 'Polimento', descricao: 'Polimento e enceramento profissional', preco: 120, duracao: 90, ativo: true, ordem: 3 },
        { id: '4', nome: 'Higienizacao Interna', descricao: 'Limpeza profunda dos bancos e carpetes', preco: 80, duracao: 60, ativo: true, ordem: 4 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const abrirModal = (servico?: Servico) => {
    if (servico) { setEditando(servico); setForm({ nome: servico.nome, descricao: servico.descricao, preco: servico.preco.toString(), duracao: servico.duracao.toString() }); }
    else { setEditando(null); setForm({ nome: '', descricao: '', preco: '', duracao: '' }); }
    setShowModal(true);
  };

  const salvarServico = async () => {
    setSalvando(true);
    await new Promise(r => setTimeout(r, 500));
    if (editando) { setServicos(prev => prev.map(s => s.id === editando.id ? { ...s, nome: form.nome, descricao: form.descricao, preco: parseFloat(form.preco), duracao: parseInt(form.duracao) } : s)); }
    else { setServicos(prev => [...prev, { id: Date.now().toString(), nome: form.nome, descricao: form.descricao, preco: parseFloat(form.preco), duracao: parseInt(form.duracao), ativo: true, ordem: servicos.length + 1 }]); }
    setSalvando(false); setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Servicos</h1><p className="text-[var(--cor-texto-muted)]">Configure os servicos oferecidos</p></div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Novo Servico</button>
      </div>

      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[var(--cor-card)] rounded-xl animate-pulse" />) : servicos.length === 0 ? (
          <div className="text-center py-12 bg-[var(--cor-card)] rounded-2xl border border-[var(--cor-borda)]"><DollarSign className="w-12 h-12 text-[var(--cor-texto-muted)] mx-auto mb-3" /><p className="text-[var(--cor-texto-muted)]">Nenhum servico cadastrado</p><button onClick={() => abrirModal()} className="btn-primary mt-4">Cadastrar primeiro servico</button></div>
        ) : (
          <AnimatePresence>
            {servicos.map((servico) => (
              <motion.div key={servico.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl bg-[var(--cor-card)] border border-[var(--cor-borda)] ${!servico.ativo ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="cursor-grab text-[var(--cor-texto-muted)]"><GripVertical className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-white font-semibold">{servico.nome}</span>{!servico.ativo && <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">Inativo</span>}</div><p className="text-[var(--cor-texto-muted)] text-sm truncate">{servico.descricao}</p></div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-[var(--cor-secundaria)]"><DollarSign className="w-4 h-4" /><span className="font-semibold font-mono">R$ {servico.preco}</span></div>
                    <div className="flex items-center gap-1 text-[var(--cor-texto-muted)]"><Clock className="w-4 h-4" /><span className="font-mono">{servico.duracao} min</span></div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setServicos(prev => prev.map(s => s.id === servico.id ? { ...s, ativo: !s.ativo } : s))} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${servico.ativo ? 'bg-green-500/10 text-green-400' : 'bg-[var(--cor-borda)] text-[var(--cor-texto-muted)]'}`}>{servico.ativo ? 'Ativo' : 'Inativo'}</button>
                    <button onClick={() => abrirModal(servico)} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white hover:bg-[var(--cor-fundo)]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setServicos(prev => prev.filter(s => s.id !== servico.id))} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[var(--cor-card)] border border-[var(--cor-borda)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">{editando ? 'Editar Servico' : 'Novo Servico'}</h2><button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-[var(--cor-texto-muted)] hover:text-white"><X className="w-5 h-5" /></button></div>
              <form onSubmit={(e) => { e.preventDefault(); salvarServico(); }} className="space-y-4">
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Nome do Servico</label><input type="text" value={form.nome} onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Lavagem Completa" required className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Descricao</label><textarea value={form.descricao} onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o servico..." rows={3} className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Preco (R$)</label><input type="number" value={form.preco} onChange={(e) => setForm(f => ({ ...f, preco: e.target.value }))} placeholder="0.00" min="0" step="0.01" required className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl font-mono" /></div>
                  <div><label className="block text-sm font-medium text-[var(--cor-texto-secundario)] mb-2">Duracao (min)</label><input type="number" value={form.duracao} onChange={(e) => setForm(f => ({ ...f, duracao: e.target.value }))} placeholder="30" min="1" required className="w-full px-4 py-3 bg-[var(--cor-fundo)] border border-[var(--cor-borda)] rounded-xl font-mono" /></div>
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
