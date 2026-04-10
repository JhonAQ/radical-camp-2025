"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllWallets, addTransaction, getPendingDeposits, approveDeposit, rejectDeposit, Wallet, Transaction } from "@/lib/chanchito";
import { Plus, Search, Loader2, Check, X, CheckCircle2, Clock } from "lucide-react";

export default function AdminChanchito() {
  const [activeTab, setActiveTab] = useState<"campers" | "pendientes">("campers");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [pendings, setPendings] = useState<Transaction[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWallets = async () => {
    setLoading(true);
    const data = await getAllWallets();
    setWallets(data);
    setLoading(false);
  };
  
  const fetchPendings = async () => {
    const list = await getPendingDeposits();
    setPendings(list);
  };

  useEffect(() => {
    fetchWallets();
    fetchPendings();
  }, []);

  const handleAdd = async () => {
    if (!selectedWallet || !amount) return;
    setSubmitting(true);
    try {
      await addTransaction(selectedWallet.userId, parseFloat(amount), note || "Abono");
      await fetchWallets();
      setShowModal(false);
      setAmount("");
      setNote("");
      alert("Abono registrado correctamente");
    } catch(e) {
      console.error(e);
      alert("Error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (txId: string, userId: string, amount: number) => {
    try {
      await approveDeposit(txId, userId, amount);
      alert("Depósito aprobado");
      await fetchPendings();
      await fetchWallets();
    } catch (e) {
      console.error(e);
      alert("Error al aprobar");
    }
  };

  const handleReject = async (txId: string) => {
    try {
      await rejectDeposit(txId);
      alert("Depósito rechazado");
      await fetchPendings();
      await fetchWallets();
    } catch (e) {
      console.error(e);
      alert("Error al rechazar");
    }
  };

  const filtered = wallets.filter(w => w.userName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-5 pb-20 pt-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-title)" }}>Panel de Abonos</h2>
      </div>

      <div className="flex gap-2 bg-dark-bg/60 p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab("campers")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "campers"
              ? "bg-primary text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Campers
        </button>
        <button
          onClick={() => { setActiveTab("pendientes"); fetchPendings(); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all relative ${
            activeTab === "pendientes"
              ? "bg-primary text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Pendientes
          {pendings.length > 0 && (
             <span className="absolute top-2 right-2 flex w-2 h-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full w-2 h-2 bg-red-500"></span>
             </span>
          )}
        </button>
      </div>

      {activeTab === "campers" && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar camper..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
          />
        </div>
      )}

      {loading && activeTab === "campers" && (
        <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      )}
      
      {!loading && activeTab === "campers" && (
        <div className="space-y-3">
          {filtered.map(w => (
            <div key={w.$id} className="app-card p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">{w.userName}</p>
                <p className="text-xs text-gray-400 font-mono text-ellipsis overflow-hidden w-32 whitespace-nowrap">{w.userId}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-bold uppercase">Total</p>
                  <p className="text-lg font-black text-emerald-400">S/ {w.balance}</p>
                </div>
                <button 
                  onClick={() => { setSelectedWallet(w); setShowModal(true); }}
                  className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-500 text-sm mt-10">No hay campers o no coinciden.</p>}
        </div>
      )}

      {activeTab === "pendientes" && (
        <div className="space-y-3">
          {pendings.map(tx => (
            <div key={tx.$id} className="app-card p-4">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{tx.userName}</p>
                    <p className="text-xs text-gray-400">Operación: <span className="font-mono text-white bg-white/10 px-1 rounded">{tx.txCode}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Monto</p>
                  <p className="text-lg font-black text-emerald-400 leading-none">S/ {tx.amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleReject(tx.$id)}
                  className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-bold text-sm outline-none"
                >
                  <X className="w-4 h-4" /> Rechazar
                </button>
                <button 
                  onClick={() => handleApprove(tx.$id, tx.userId, tx.amount)}
                  className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-bold text-sm outline-none"
                >
                  <Check className="w-4 h-4" /> Aprobar
                </button>
              </div>
            </div>
          ))}
          {pendings.length === 0 && (
            <div className="text-center p-10">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay abonos pendientes de validación.</p>
              <p className="text-gray-500 text-xs mt-1">¡Todo al día!</p>
            </div>
          )}
        </div>
      )}

      {showModal && selectedWallet && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-5 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="app-card p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-white">Abonar a {selectedWallet.userName}</h3>
            
            <p className="text-xs text-gray-400 mb-1 font-bold uppercase">Monto (S/)</p>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:border-primary mb-4" placeholder="0.00" />
            
            <p className="text-xs text-gray-400 mb-1 font-bold uppercase">Nota (Opcional)</p>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary mb-6" placeholder="Ej. Pago en efectivo" />

            <div className="flex gap-3">
              <button disabled={submitting} onClick={() => setShowModal(false)} className="flex-1 py-3 items-center justify-center rounded-xl bg-white/5 text-white font-bold">Cancelar</button>
              <button disabled={submitting} onClick={handleAdd} className="flex-1 py-3 items-center justify-center rounded-xl bg-primary text-white font-bold flex gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
