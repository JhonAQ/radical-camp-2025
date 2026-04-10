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
export default function ChanchitoPage() {
  const [data, setData] = useState<ChanchitData>({ meta: 190, abonos: [] });
  const [showModal, setShowModal] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20);
  const [note, setNote] = useState("");
  const [wobble, setWobble] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setData(loadData());
  }, []);

  const total = data.abonos.reduce((sum, a) => sum + a.amount, 0);
  const percent = (total / data.meta) * 100;
  const remaining = Math.max(data.meta - total, 0);

  const addAbono = useCallback(() => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) return;

    const newAbono: Abono = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
      note: note || `Abono de S/ ${amount}`,
    };

    const updated = {
      ...data,
      abonos: [newAbono, ...data.abonos],
    };

    setData(updated);
    saveData(updated);
    setShowModal(false);
    setCustomAmount("");
    setNote("");
    setSelectedAmount(20);

    // Trigger animations
    setWobble(true);
    setTimeout(() => setWobble(false), 600);

    const newTotal = total + amount;
    if (newTotal >= data.meta && total < data.meta) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [data, customAmount, selectedAmount, note, total]);

  // Days saving
  const firstAbono = data.abonos.length > 0 ? data.abonos[data.abonos.length - 1] : null;
  const daysSaving = firstAbono
    ? Math.ceil((Date.now() - new Date(firstAbono.date).getTime()) / 86400000)
    : 0;

  return (
    <div className="px-5 pb-6 space-y-6">
      {/* ── Chanchito + Progress ────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <PiggyBankSVG percent={percent} wobble={wobble} />

        <div className="mt-2">
          <CircularProgress percent={percent} />
        </div>

        {/* Amount display */}
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

      {/* ── Stats ──────────────────── */}
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

      {/* ── Abonar Button ──────────── */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:shadow-none transition-shadow"
      >
        <Plus className="w-5 h-5" strokeWidth={3} />
        Abonar al chanchito
      </motion.button>

      {/* ── History ────────────────── */}
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
              key={abono.id}
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
                    {new Date(abono.date).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400">
                +S/ {abono.amount}
              </span>
            </motion.div>
          ))}

          {data.abonos.length === 0 && (
            <div className="app-card p-6 text-center">
              <p className="text-gray-500 text-sm">Aún no tienes abonos</p>
              <p className="text-gray-600 text-xs mt-1">
                ¡Empieza a ahorrar para tu campamento!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Abono Modal ────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#121212] rounded-t-3xl border-t border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  Nuevo abono
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Preset amounts */}
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">
                Monto rápido
              </p>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${
                      selectedAmount === amt && !customAmount
                        ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 text-gray-400 border border-white/5 active:bg-white/10"
                    }`}
                  >
                    S/ {amt}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Monto personalizado
              </p>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  S/
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white font-bold focus:border-secondary focus:bg-white/8 outline-none transition-all"
                />
              </div>

              {/* Note */}
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nota (opcional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-secondary outline-none transition-all mb-6"
              />

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addAbono}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-base uppercase tracking-wider shadow-lg shadow-primary/20"
              >
                Abonar S/{" "}
                {customAmount || selectedAmount || 0}
              </motion.button>

              {/* Safe area spacer */}
              <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confetti ────────────────── */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
          >
            {/* Simple confetti particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    ["#6200ea", "#00d4ff", "#ff0055", "#fbbf24", "#34d399"][i % 5],
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
            {/* Success message */}
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
