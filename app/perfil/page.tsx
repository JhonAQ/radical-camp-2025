"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  QrCode,
  CreditCard,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ExternalLink,
  PiggyBank,
  CheckCircle2,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

/* ── Mock User Data ─────────────────────────────────────────── */
const mockUser = {
  name: "Camper Radical",
  fullName: "Camper Radical Camp",
  email: "camper@radicalcamp.pe",
  phone: "+51 999 999 999",
  iglesia: "IEL-P Arequipa",
  ciudad: "Arequipa",
  registrationId: "RC-2025-0042",
  status: "pendiente" as "pendiente" | "confirmado" | "pagado",
  paymentType: "reservation" as "full" | "reservation",
  amountPaid: 50,
  totalAmount: 190,
};

/* ── Page ──────────────────────────────────────────────────── */
export default function PerfilPage() {
  const [copied, setCopied] = useState(false);
  const [chanchitoTotal, setChanchitoTotal] = useState(0);

  // Load chanchito data
  useEffect(() => {
    try {
      const raw = localStorage.getItem("radical-camp-chanchito");
      if (raw) {
        const data = JSON.parse(raw);
        const total = data.abonos?.reduce(
          (sum: number, a: { amount: number }) => sum + a.amount,
          0
        ) || 0;
        setChanchitoTotal(total);
      }
    } catch {}
  }, []);

  const copyId = () => {
    navigator.clipboard?.writeText(mockUser.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    pendiente: {
      label: "Pendiente",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      icon: Clock,
    },
    confirmado: {
      label: "Confirmado",
      color: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-secondary/20",
      icon: CheckCircle2,
    },
    pagado: {
      label: "Pagado",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      icon: CheckCircle2,
    },
  };

  const status = statusConfig[mockUser.status];
  const StatusIcon = status.icon;

  return (
    <div className="px-5 pb-6 space-y-6">
      {/* ── Profile Card ───────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative app-card overflow-visible"
      >
        {/* BG Gradient */}
        <div className="h-24 bg-gradient-to-br from-primary/40 to-secondary/30 rounded-t-2xl" />

        {/* Avatar */}
        <div className="px-5 -mt-10 pb-5">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-xl shadow-primary/20">
              <div className="w-full h-full rounded-[14px] bg-card-bg flex items-center justify-center overflow-hidden">
                <Image
                  src="/RADICAL-logotipo.png"
                  alt="Avatar"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
            {/* Status badge */}
            <div
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}
            >
              {status.label}
            </div>
          </div>

          <h2
            className="text-xl font-black text-white mb-0.5"
            style={{ fontFamily: "var(--font-title)" }}
          >
            {mockUser.name}
          </h2>
          <p className="text-sm text-gray-400 mb-1">{mockUser.iglesia}</p>

          {/* Registration ID */}
          <button
            onClick={copyId}
            className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 active:bg-white/10 transition-colors"
          >
            <span className="text-xs font-mono text-gray-400">
              {mockUser.registrationId}
            </span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            )}
          </button>
        </div>
      </motion.section>

      {/* ── QR Card ────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="app-card p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="w-5 h-5 text-secondary" />
          <h3 className="font-bold text-white text-sm">Tu QR de verificación</h3>
        </div>

        <div className="flex flex-col items-center">
          {/* QR placeholder */}
          <div className="w-48 h-48 bg-white rounded-2xl p-3 mb-4">
            <div className="w-full h-full border-2 border-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Fake QR pattern */}
              <div className="grid grid-cols-8 gap-[2px] w-[130px]">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-[1px] ${
                      Math.random() > 0.45 ? "bg-black" : "bg-white"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Image
                    src="/RADICAL-logotipo.png"
                    alt="Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 text-center">
            Presenta este QR al registrarte en el campamento
          </p>
        </div>
      </motion.section>

      {/* ── Payment Status ─────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3
          className="text-lg font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Estado de pago
        </h3>

        <div className="app-card p-4 space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">
                Pagado: <span className="text-white font-bold">S/ {mockUser.amountPaid}</span>
              </span>
              <span className="text-gray-400">
                Total: <span className="text-white font-bold">S/ {mockUser.totalAmount}</span>
              </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(mockUser.amountPaid / mockUser.totalAmount) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Status + Chanchito link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-4 h-4 ${status.color}`} />
              <span className={`text-sm font-bold ${status.color}`}>
                {mockUser.paymentType === "full" ? "Pago completo" : "Reserva"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Resta: S/ {mockUser.totalAmount - mockUser.amountPaid}
            </span>
          </div>

          {/* Chanchito savings */}
          {chanchitoTotal > 0 && (
            <Link href="/chanchito" className="block">
              <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-secondary/10 rounded-xl active:scale-[0.98] transition-transform">
                <PiggyBank className="w-5 h-5 text-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    S/ {chanchitoTotal} en tu chanchito
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Sigue ahorrando para completar tu pago
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </Link>
          )}
        </div>
      </motion.section>

      {/* ── Menu Items ─────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="app-card divide-y divide-white/5">
          {[
            {
              icon: CreditCard,
              label: "Método de pago",
              sub: "Yape",
              href: "/registro",
            },
            {
              icon: Bell,
              label: "Notificaciones",
              sub: "Activadas",
              href: "#",
            },
            {
              icon: Shield,
              label: "Privacidad",
              sub: "",
              href: "#",
            },
            {
              icon: HelpCircle,
              label: "Ayuda y soporte",
              sub: "WhatsApp",
              href: "https://wa.me/51931697951",
              external: true,
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className="flex items-center gap-4 p-4 active:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-200">{item.label}</p>
                {item.sub && (
                  <p className="text-[10px] text-gray-500">{item.sub}</p>
                )}
              </div>
              {item.external ? (
                <ExternalLink className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── Social Links ───────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Síguenos
        </h3>
        <div className="flex gap-3">
          {[
            { Icon: FaWhatsapp, color: "bg-[#25D366]/15 text-[#25D366]", href: "https://wa.me/51931697951" },
            { Icon: FaInstagram, color: "bg-pink-500/15 text-pink-400", href: "#" },
            { Icon: FaTiktok, color: "bg-white/10 text-white", href: "#" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center active:scale-90 transition-transform`}
            >
              <item.Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </motion.section>

      {/* ── Org Info ────────────────── */}
      <section className="text-center pt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image
            src="/RADICAL-white.png"
            alt="Radical Camp"
            width={80}
            height={30}
            className="h-6 w-auto object-contain opacity-50"
          />
          <div className="h-4 w-px bg-white/10" />
          <Image
            src="/IELP-logo.png"
            alt="IELP"
            width={80}
            height={30}
            className="h-6 w-auto object-contain opacity-50"
          />
        </div>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
          IEL-P · Ministerio Nacional de Jóvenes
        </p>
        <p className="text-[10px] text-gray-700">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/JhonAQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors"
          >
            Jhonatan Arias (JhonAQ)
          </a>
        </p>
      </section>
    </div>
  );
}
