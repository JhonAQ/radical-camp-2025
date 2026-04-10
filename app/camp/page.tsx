"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Clock,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Circle,
  CalendarDays,
  Utensils,
  Music,
  BookOpen,
  Gamepad2,
  Sunrise,
  Sun,
  Moon,
  PartyPopper,
  Bus,
} from "lucide-react";

/* ── Schedule Data ─────────────────────────────────────────── */
const schedule = [
  {
    day: "Día 1 — Mar 30 Dic",
    tag: "Llegada",
    color: "from-blue-500 to-cyan-400",
    events: [
      { time: "12:00", title: "Inscripción en SETELA", icon: BookOpen },
      { time: "14:00", title: "Salida del bus", icon: Bus },
      { time: "17:00", title: "Llegada a Campel", icon: MapPin },
      { time: "18:00", title: "Instalación y cena", icon: Utensils },
      { time: "20:00", title: "Dinámica de apertura", icon: Gamepad2 },
    ],
  },
  {
    day: "Día 2 — Mié 31 Dic",
    tag: "Año Nuevo",
    color: "from-purple-500 to-pink-500",
    events: [
      { time: "07:00", title: "Devocional matutino", icon: Sunrise },
      { time: "09:00", title: "Plenaria principal", icon: BookOpen },
      { time: "12:00", title: "Almuerzo", icon: Utensils },
      { time: "14:00", title: "Actividades recreativas", icon: Gamepad2 },
      { time: "18:00", title: "Cena especial", icon: Utensils },
      { time: "22:00", title: "Noche de Año Nuevo", icon: PartyPopper },
    ],
  },
  {
    day: "Día 3 — Jue 01 Ene",
    tag: "Playa",
    color: "from-cyan-500 to-teal-400",
    events: [
      { time: "08:00", title: "Desayuno", icon: Utensils },
      { time: "09:30", title: "Taller 1", icon: BookOpen },
      { time: "11:00", title: "Actividades en playa", icon: Sun },
      { time: "13:00", title: "Almuerzo", icon: Utensils },
      { time: "15:00", title: "Taller 2", icon: BookOpen },
      { time: "20:00", title: "Noche de alabanza", icon: Music },
    ],
  },
  {
    day: "Día 4 — Vie 02 Ene",
    tag: "Ponencias",
    color: "from-orange-500 to-amber-400",
    events: [
      { time: "07:00", title: "Devocional", icon: Sunrise },
      { time: "09:00", title: "Ponencia especial", icon: BookOpen },
      { time: "12:00", title: "Almuerzo", icon: Utensils },
      { time: "14:00", title: "Dinámicas y juegos", icon: Gamepad2 },
      { time: "19:00", title: "Fogata y testimonios", icon: Moon },
    ],
  },
  {
    day: "Día 5 — Sáb 03 Ene",
    tag: "Clausura",
    color: "from-pink-500 to-rose-500",
    events: [
      { time: "07:00", title: "Devocional final", icon: Sunrise },
      { time: "09:00", title: "Clausura y envío", icon: PartyPopper },
      { time: "11:00", title: "Empaque y salida", icon: Bus },
      { time: "14:00", title: "Llegada a SETELA", icon: MapPin },
    ],
  },
];

const checklist = [
  { text: "Biblia y cuaderno", category: "esencial" },
  { text: "Sleeping bag o frazada", category: "esencial" },
  { text: "Ropa cómoda y deportiva", category: "ropa" },
  { text: "Ropa de abrigo (noches)", category: "ropa" },
  { text: "Artículos de aseo personal", category: "higiene" },
  { text: "Repelente de insectos", category: "higiene" },
  { text: "Bloqueador solar", category: "higiene" },
  { text: "Ropa de baño", category: "ropa" },
  { text: "Toalla", category: "higiene" },
  { text: "Linterna o lámpara", category: "extra" },
  { text: "Snacks personales", category: "extra" },
  { text: "Corazón dispuesto", category: "esencial" },
];

const faqs = [
  {
    q: "¿Cuándo y dónde es?",
    a: "Del 30 de Diciembre al 03 de Enero en CAMPEL (Campamento Evangélico Luterano) en Mejía, Arequipa.",
  },
  {
    q: "¿Punto de salida?",
    a: "SETELA — Calle Miramar Nro 202 Fundo la Murillo, Paucarpata, Arequipa. Inscripciones desde las 12:00, bus sale a las 2:00 PM en punto.",
  },
  {
    q: "¿Hay límite de edad?",
    a: "Diseñado para jóvenes de 17 años en adelante. ¡No hay límite superior, solo necesitas un corazón joven!",
  },
  {
    q: "¿Puedo pagar por partes?",
    a: "¡Sí! Puedes reservar con S/ 50 y pagar el resto antes del evento. Usa el Chanchito Virtual para ir ahorrando.",
  },
  {
    q: "¿Qué incluye el precio?",
    a: "Hospedaje, alimentación completa (3 comidas) y materiales. El transporte al punto de encuentro es por cuenta propia.",
  },
  {
    q: "¿Incluye transporte al campamento?",
    a: "Sí, el bus desde SETELA hasta Campel y de regreso está incluido en el precio.",
  },
];

/* ── Page ──────────────────────────────────────────────────── */
export default function CampPage() {
  const [openDay, setOpenDay] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleCheck = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="px-5 pb-6 space-y-8">
      {/* ── Hero ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden h-[180px]"
      >
        <Image
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&auto=format&fit=crop"
          alt="Campel Arequipa"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1
            className="text-2xl font-black text-white tracking-tight mb-1"
            style={{ fontFamily: "var(--font-title)" }}
          >
            CAMPEL, AREQUIPA
          </h1>
          <p className="text-xs text-gray-300 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-secondary" />
            Mejía, Arequipa — 5 días
          </p>
        </div>
      </motion.div>

      {/* ── Location Card ──────────── */}
      <section className="app-card p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">Punto de encuentro</h3>
            <p className="text-xs text-gray-400 mb-2">
              SETELA — Calle Miramar Nro 202, Paucarpata, Arequipa
            </p>
            <div className="flex items-center gap-2 text-[10px] text-secondary font-bold">
              <Clock className="w-3 h-3" />
              <span>Inscripción: 12:00 PM — Bus sale: 2:00 PM</span>
            </div>
          </div>
        </div>
        <a
          href="https://maps.google.com/?q=SETELA+Paucarpata+Arequipa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white active:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Abrir en Maps
        </a>
      </section>

      {/* ── Cronograma ─────────────── */}
      <section>
        <h2
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Cronograma
        </h2>

        <div className="space-y-3">
          {schedule.map((day, dayIdx) => (
            <motion.div
              key={dayIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIdx * 0.05 }}
            >
              <button
                onClick={() => setOpenDay(openDay === dayIdx ? -1 : dayIdx)}
                className="w-full app-card p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${day.color} flex items-center justify-center`}
                  >
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{day.day}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {day.tag}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openDay === dayIdx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openDay === dayIdx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-8 pr-4 py-3 space-y-0">
                      {day.events.map((event, eIdx) => (
                        <div key={eIdx} className="flex items-start gap-3 relative">
                          {/* Timeline line */}
                          {eIdx < day.events.length - 1 && (
                            <div className="absolute left-[15px] top-8 w-[1px] h-full bg-white/8" />
                          )}
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 z-10">
                            <event.icon className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="pb-4">
                            <span className="text-[10px] text-secondary font-bold font-mono">
                              {event.time}
                            </span>
                            <p className="text-sm text-gray-300">{event.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Checklist ──────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-title)" }}
          >
            ¿Qué llevar?
          </h2>
          <span className="text-xs font-bold text-secondary">
            {checkedCount}/{checklist.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(checkedCount / checklist.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {checklist.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => toggleCheck(i)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                checked[i]
                  ? "bg-secondary/10 border border-secondary/20"
                  : "bg-white/3 border border-white/5"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {checked[i] ? (
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 shrink-0" />
              )}
              <span
                className={`text-sm transition-colors ${
                  checked[i] ? "text-secondary line-through" : "text-gray-300"
                }`}
              >
                {item.text}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────── */}
      <section>
        <h2
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Preguntas frecuentes
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="app-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between gap-3 active:bg-white/5 transition-colors"
              >
                <span className="text-sm font-bold text-gray-200 text-left">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
