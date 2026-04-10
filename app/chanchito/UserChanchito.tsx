"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  TrendingUp,
  History,
  Target,
  Sparkles,
  X,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
interface Abono {
  id: string;
  amount: number;
  date: string;
  note: string;
}

interface ChanchitData {
  meta: number;
  abonos: Abono[];
}

/* ── Storage Helpers ────────────────────────────────────────── */
const STORAGE_KEY = "radical-camp-chanchito";

function loadData(): ChanchitData {
  if (typeof window === "undefined") return { meta: 190, abonos: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { meta: 190, abonos: [] };
}

function saveData(data: ChanchitData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ── Motivational Quotes ────────────────────────────────────── */
const quotes = [
  { text: "Cada moneda te acerca más al campamento", range: [0, 20] },
  { text: "¡Buen comienzo! Ya diste el primer paso", range: [1, 30] },
  { text: "Paso a paso se llega lejos. ¡Sigue así!", range: [20, 40] },
  { text: "¡Ya llevas casi la mitad! No te detengas", range: [40, 60] },
  { text: "¡Más de la mitad! El campamento te espera", range: [60, 80] },
  { text: "¡Ya casi! Solo un poco más y lo logras", range: [80, 99] },
  { text: "🎉 ¡META CUMPLIDA! Nos vemos en el camp", range: [100, 200] },
];

function getQuote(percent: number) {
  return quotes.find(
    (q) => percent >= q.range[0] && percent <= q.range[1]
  )?.text || quotes[0].text;
}

/* ── SVG Piggy Bank ─────────────────────────────────────────── */
function PiggyBankSVG({ percent, wobble }: { percent: number; wobble: boolean }) {
  const fillLevel = Math.min(percent / 100, 1);
  const bodyColor = percent >= 100 ? "#00d4ff" : "#c084fc";
  const fillColor = percent >= 100 ? "#00d4ff" : "#a855f7";

  return (
    <motion.svg
      viewBox="0 0 200 180"
      className={`w-full max-w-[240px] mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.3)] ${
        wobble ? "animate-piggy-wobble" : ""
      }`}
      animate={wobble ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Body */}
      <ellipse cx="100" cy="100" rx="72" ry="55" fill="#1a1a2e" stroke={bodyColor} strokeWidth="2.5" opacity="0.9" />
      
      {/* Fill level (liquid effect) */}
      <defs>
        <clipPath id="bodyClip">
          <ellipse cx="100" cy="100" rx="70" ry="53" />
        </clipPath>
      </defs>
      <rect
        x="28"
        y={155 - fillLevel * 108}
        width="144"
        height={fillLevel * 108}
        fill={fillColor}
        opacity="0.25"
        clipPath="url(#bodyClip)"
      >
        <animate attributeName="y" values={`${155 - fillLevel * 108};${153 - fillLevel * 108};${155 - fillLevel * 108}`} dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Shimmer on fill */}
      <rect
        x="28"
        y={155 - fillLevel * 108}
        width="144"
        height={fillLevel * 108}
        fill="url(#shimmerGrad)"
        opacity="0.1"
        clipPath="url(#bodyClip)"
      />
      <defs>
        <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
          <animate attributeName="x1" values="-100%;200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0%;300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <ellipse cx="52" cy="55" rx="16" ry="22" fill="#1a1a2e" stroke={bodyColor} strokeWidth="2" />
      <ellipse cx="52" cy="55" rx="10" ry="14" fill={fillColor} opacity="0.2" />
      <ellipse cx="148" cy="55" rx="16" ry="22" fill="#1a1a2e" stroke={bodyColor} strokeWidth="2" />
      <ellipse cx="148" cy="55" rx="10" ry="14" fill={fillColor} opacity="0.2" />

      {/* Eyes */}
      <circle cx="76" cy="82" r="6" fill="white" />
      <circle cx="76" cy="82" r="3.5" fill="#1a1a2e" />
      <circle cx="75" cy="80.5" r="1.5" fill="white" />
      <circle cx="124" cy="82" r="6" fill="white" />
      <circle cx="124" cy="82" r="3.5" fill="#1a1a2e" />
      <circle cx="123" cy="80.5" r="1.5" fill="white" />

      {/* Happy expression when full */}
      {percent >= 100 && (
        <>
          <path d="M 85 100 Q 100 115 115 100" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Snout */}
      <ellipse cx="100" cy="100" rx="20" ry="14" fill="#2a2a40" stroke={bodyColor} strokeWidth="1.5" />
      <circle cx="93" cy="98" r="3" fill={bodyColor} opacity="0.5" />
      <circle cx="107" cy="98" r="3" fill={bodyColor} opacity="0.5" />

      {/* Legs */}
      <rect x="52" y="145" width="16" height="18" rx="5" fill="#1a1a2e" stroke={bodyColor} strokeWidth="1.5" />
      <rect x="132" y="145" width="16" height="18" rx="5" fill="#1a1a2e" stroke={bodyColor} strokeWidth="1.5" />

      {/* Coin slot */}
      <rect x="90" y="42" width="20" height="5" rx="2.5" fill={bodyColor} opacity="0.6" />
      
      {/* Tail */}
      <path d="M 170 90 Q 185 75 178 95 Q 188 85 182 100" stroke={bodyColor} strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

/* ── Circular Progress ──────────────────────────────────────── */
function CircularProgress({ percent }: { percent: number }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div className="relative w-[220px] h-[220px] mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"
        />
        {/* Progress circle */}
        <motion.circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6200ea" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
          Ahorrado
        </span>
        <motion.span
          key={percent}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl font-black text-white tabular-nums"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {Math.round(percent)}%
        </motion.span>
      </div>
    </div>
  );
}

/* ── Amounts Presets ────────────────────────────────────────── */
const PRESET_AMOUNTS = [10, 20, 30, 50];

/* ── Page ──────────────────────────────────────────────────── */
import { getUserWallet, getTransactions, submitUserDeposit, Transaction, Wallet } from "@/lib/chanchito";
import { Loader2 } from "lucide-react";
import { Models } from "appwrite";
import Image from "next/image";

export default function UserChanchito({ user }: { user: Models.User<Models.Preferences> }) {
  const [data, setData] = useState<{ meta: number; abonos: Transaction[] }>({ meta: 190, abonos: [] });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const [wobble, setWobble] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [txCode, setTxCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !txCode) {
      alert("Por favor completa los campos");
      return;
    }
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Monto inválido");
      return;
    }
    setSubmitting(true);
    try {
      await submitUserDeposit(user.$id, user.name, amt, txCode);
      alert("Depósito registrado como pendiente");
      setShowDepositModal(false);
      setDepositAmount("");
      setTxCode("");
      
      // Reload txs
      const tx = await getTransactions(user.$id);
      setData(prev => ({ ...prev, abonos: tx }));
    } catch (error) {
      alert("Hubo un error al enviar el depósito");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const w = await getUserWallet(user.$id, user.name);
        const tx = await getTransactions(user.$id);
        const total = tx.reduce((sum, a) => sum + a.amount, 0);

        setWallet(w);
        setData({ meta: 190, abonos: tx });
        
        if (total >= 190) {
           setShowConfetti(true);
           setTimeout(() => setShowConfetti(false), 3000);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (user?.$id) load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const total = data.abonos.reduce((sum, a) => sum + a.amount, 0);
  const percent = Math.min(total / data.meta * 100, 100);
  const remaining = Math.max(data.meta - total, 0);

  const firstAbono = data.abonos.length > 0 ? data.abonos[data.abonos.length - 1] : null;
  const daysSaving = firstAbono
    ? Math.ceil((Date.now() - new Date(firstAbono.$createdAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="px-5 pb-20 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <PiggyBankSVG percent={percent} wobble={wobble} />

        <div className="mt-2">
          <CircularProgress percent={percent} />
        </div>

        <div className="text-center mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-gray-500 font-bold">S/</span>
            <motion.span
              key={total}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-black text-white tabular-nums"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {total.toFixed(0)}
            </motion.span>
            <span className="text-lg text-gray-600 font-bold">/ {data.meta}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            {getQuote(percent)}
          </p>
        </div>
      </motion.section>

      <section className="grid grid-cols-3 gap-3">
        <div className="app-card p-3 text-center">
          <Target className="w-4 h-4 mx-auto text-primary mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            S/ {remaining.toFixed(0)}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Falta</p>
        </div>
        <div className="app-card p-3 text-center">
          <History className="w-4 h-4 mx-auto text-secondary mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            {data.abonos.length}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Abonos</p>
        </div>
        <div className="app-card p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-400 mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            {daysSaving}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Días</p>
        </div>
      </section>

      <section>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h2
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Historial
          </h2>
          <span className="text-xs text-secondary font-bold">
            {showHistory ? "Ocultar" : "Ver todo"}
          </span>
        </button>

        <div className="space-y-2">
          {(showHistory ? data.abonos : data.abonos.slice(0, 3)).map((abono) => (
            <motion.div
              key={abono.$id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="app-card p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{abono.note}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(abono.$createdAt).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-emerald-400">
                  +S/ {abono.amount}
                </span>
                {abono.status === "pending" && (
                  <span className="text-[10px] text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded mt-1">Pendiente</span>
                )}
              </div>
            </motion.div>
          ))}

          {data.abonos.length === 0 && (
            <div className="app-card p-6 text-center">
              <p className="text-gray-500 text-sm">Aún no tienes abonos</p>
              <p className="text-gray-600 text-xs mt-1">
                Los admins podrán sumarte puntos pronto.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Depositar Yape Button */}
      <button
        onClick={() => setShowDepositModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {showDepositModal && (
          <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="app-card w-full max-w-sm rounded-[32px] overflow-hidden"
            >
              <div className="relative p-6 px-8 text-center bg-gradient-to-b from-primary/20 to-transparent border-b border-white/5">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 mx-auto bg-[#7B22B0] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(123,34,176,0.4)]">
                   <span className="text-white font-bold text-xl">Yape</span>
                </div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-title)" }}>Registrar Abono</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  Escanea el QR, realiza el yape y registra aquí el código de operación.
                </p>
                <div className="bg-white p-2 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center overflow-hidden mb-4">
                  <Image src="/yape-qr.PNG" alt="Yape QR" width={192} height={192} className="object-contain w-full h-full" />
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmitDeposit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Monto Depositado</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">S/</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.10"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        className="w-full bg-dark-bg/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-lg font-bold"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Código de Operación</label>
                    <input
                       type="text"
                       value={txCode}
                       onChange={e => setTxCode(e.target.value)}
                       placeholder="Últimos 3 o 4 dígitos"
                       maxLength={6}
                       className="w-full bg-dark-bg/50 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 font-mono text-lg text-center"
                       required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mt-2 transition-colors disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar para Revisión"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#6200ea", "#00d4ff", "#ff0055", "#fbbf24", "#34d399"][i % 5],
                  left: `${20 + Math.random() * 60}%`,
                  top: "30%",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: [0, 200 + Math.random() * 200],
                  x: [-30 + Math.random() * 60],
                  opacity: [1, 0],
                  rotate: [0, 360 + Math.random() * 360],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-black/80 backdrop-blur-xl border border-secondary/30 rounded-3xl p-8 text-center shadow-2xl"
            >
              <p className="text-5xl mb-3">🎉</p>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "var(--font-title)" }}
              >
                ¡META CUMPLIDA!
              </h3>
              <p className="text-secondary text-sm font-bold">
                Nos vemos en el campamento
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
