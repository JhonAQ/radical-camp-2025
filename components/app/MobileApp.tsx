"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { client } from "@/lib/appwrite";
import Link from "next/link";
import PWAInstallModal from "@/components/ui/PWAInstallModal";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  PiggyBank,
  Play,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";

/* ── Countdown Hook ──────────────────────────────────────────── */
function useCountdown(target: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const d = t - Date.now();
      if (d < 0) return;
      setTime({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

/* ── Data ─────────────────────────────────────────────────────── */
const quickActions = [
  {
    label: "Inscribirme",
    icon: Ticket,
    href: "/registro",
    gradient: "from-accent to-pink-600",
    glow: "shadow-accent/20",
  },
  {
    label: "Mi Chanchito",
    icon: PiggyBank,
    href: "/chanchito",
    gradient: "from-secondary to-blue-500",
    glow: "shadow-secondary/20",
  },
  {
    label: "Social",
    icon: Play,
    href: "/social",
    gradient: "from-purple-500 to-primary",
    glow: "shadow-primary/20",
  },
  {
    label: "Info Camp",
    icon: MapPin,
    href: "/camp",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
];

const eventInfo = [
  { icon: Calendar, label: "Fechas", value: "30 Dic — 03 Ene", sub: "5 días de verano" },
  { icon: MapPin, label: "Lugar", value: "Campel", sub: "Arequipa, Perú" },
  { icon: Users, label: "Edades", value: "17+", sub: "Cupos limitados" },
  { icon: Ticket, label: "Precio", value: "S/ 190", sub: "Promo hasta 15 Dic: S/170" },
];

const speakers = [
  { name: "Ps. Sergio Bustamante", role: "Plenarista", image: "/pastor-sergio-bustamante.jpg" },
  { name: "Lilian Nuñez Lipa", role: "Taller", image: "/lilian-nunez-lipa.jpg" },
  { name: "Diego Valero C.", role: "Taller", image: "/diego-valero.jpg" },
  { name: "Brian Gonzales Inga", role: "Ponencia", image: "/brayan-inga.jpg" },
  { name: "Ps. Daniel Cruz", role: "Ponencia", image: "/daniel-cruz.jpg" },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function MobileApp() {
  const time = useCountdown("2025-12-30T00:00:00");

  useEffect(() => {
    try {
      // @ts-ignore
      client.ping();
      console.log("Pinged Appwrite backend server");
    } catch (error) {
      console.error("Error pinging Appwrite:", error);
    }
  }, []);

  return (
    <div className="px-5 pb-6 space-y-7">
      <PWAInstallModal />
      {/* ── Hero Card ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=75"
            alt="Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3700b3]/80 to-[#00d4ff]/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 px-6 pt-8 pb-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
              ¡Es tiempo de volver!
            </span>
          </motion.div>

          {/* Title */}
          <h1
            className="text-3xl font-black leading-[1.05] tracking-tight text-white mb-2"
            style={{ fontFamily: "var(--font-title)" }}
          >
            RADICAL
            <br />
            <span className="text-secondary drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">
              CAMP 2025
            </span>
          </h1>

          <p className="text-white/70 text-sm max-w-[260px] mb-5 leading-relaxed">
            Campamento juvenil cristiano en Campel, Arequipa. ¡Vive la experiencia!
          </p>

          {/* Countdown */}
          <div className="flex gap-2.5">
            {[
              { v: time.days, l: "Días" },
              { v: time.hours, l: "Hrs" },
              { v: time.minutes, l: "Min" },
              { v: time.seconds, l: "Seg" },
            ].map((u) => (
              <div
                key={u.l}
                className="flex-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl py-2 text-center"
              >
                <span
                  className="block text-xl font-black text-white tabular-nums"
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  {String(u.v).padStart(2, "0")}
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-secondary/80 font-bold">
                  {u.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Quick Actions ─────────────────────── */}
      <section>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} p-[1px] shadow-lg ${action.glow} group-active:scale-90 transition-transform`}
                >
                  <div className="w-full h-full bg-dark-bg rounded-[15px] flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Event Info ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-title)" }}>
            Información
          </h2>
          <Link
            href="/camp"
            className="text-xs font-bold text-secondary flex items-center gap-1 hover:text-white transition-colors"
          >
            Ver todo <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {eventInfo.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex-shrink-0 w-[140px] app-card p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                <info.icon className="w-5 h-5 text-secondary" strokeWidth={1.8} />
              </div>
              <p
                className="text-lg font-bold text-white mb-0.5 leading-tight"
                style={{ fontFamily: "var(--font-title)" }}
              >
                {info.value}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {info.label}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">{info.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Price Banner ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/registro" className="block">
          <div className="relative rounded-2xl overflow-hidden border border-accent/30 group active:scale-[0.98] transition-transform">
            {/* Glow BG */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10" />
            <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Promoción
            </div>

            <div className="relative p-5 flex items-center gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-500 text-xs line-through">S/ 190</span>
                  <Clock className="w-3 h-3 text-accent" />
                  <span className="text-accent text-[10px] font-bold">Hasta 15 Dic</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">S/</span>
                  <span
                    className="text-4xl font-black text-white tracking-tight"
                    style={{ fontFamily: "var(--font-title)" }}
                  >
                    170
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Incluye hospedaje, alimentación y traslado
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <ChevronRight className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ── Speakers ──────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-title)" }}>
            Ponentes
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {speakers.map((speaker, i) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex-shrink-0 w-[120px]"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 border border-white/5">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p
                    className="text-xs font-bold text-white leading-tight"
                    style={{ fontFamily: "var(--font-title)" }}
                  >
                    {speaker.name}
                  </p>
                  <p className="text-[9px] text-secondary font-bold uppercase tracking-wider mt-0.5">
                    {speaker.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Verse Card ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass-card p-5">
          <p className="text-sm text-gray-300 italic leading-relaxed">
            &ldquo;Deje el impío su camino, y el hombre inicuo sus pensamientos, y
            vuélvase a Jehová, el cual tendrá de él misericordia, y al Dios
            nuestro, el cual será amplio en perdonar.&rdquo;
          </p>
          <p className="text-xs text-secondary font-bold mt-3">— Isaías 55:7</p>
        </div>
      </motion.section>
    </div>
  );
}