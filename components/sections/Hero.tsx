"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, QrCode, Smartphone } from "lucide-react";
import Countdown from "@/components/ui/Countdown";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] flex flex-col justify-start md:justify-center items-center text-center px-5 pt-28 pb-24 md:pt-36 md:pb-48 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Campamento Radical Background"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3700b3]/85 to-[#00d4ff]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-4xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-4 relative z-20"
            style={{ fontFamily: "var(--font-title)" }}
          >
            <span className="text-white drop-shadow-lg">¡ES TIEMPO</span>
            <br />
            <span className="relative inline-block glitch-wrapper animate-blink-random">
              {/* Texto Principal con Efecto Celeste + Transparencia */}
              <span
                className="glitch-text relative z-10 text-secondary/90 mix-blend-hard-light drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]"
                data-text="DE VOLVER!"
              >
                DE VOLVER!
              </span>

              {/* Capa de Resplandor Extra */}
              <span className="absolute inset-0 text-secondary blur-xl opacity-40 animate-pulse -z-10">
                DE VOLVER!
              </span>
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl italic text-white/90 mb-8 font-light max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-title)" }}
          >
            "Deje el impío su camino, y el hombre inicuo sus pensamientos, y
            vuélvase a Jehová, el cual tendrá de él misericordia, y al Dios
            nuestro, el cual será amplio en perdonar."
            <br />
            <span className="text-sm mt-2 block not-italic font-bold">
              - Isaías 55:2
            </span>
          </p>
        </motion.div>

        <Countdown />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 px-4"
        >
          <Link href="/registro" className="w-auto">
            <button className="w-auto min-w-[140px] bg-white text-primary px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-lg uppercase tracking-wide hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl cursor-pointer">
              Reservar Cupo
            </button>
          </Link>
          <Link href="/social" className="w-auto">
            <button className="w-auto min-w-[140px] group flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg uppercase tracking-wide hover:bg-white hover:text-primary hover:-translate-y-1 transition-all cursor-pointer">
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Ver Multimedia
            </button>
          </Link>
        </motion.div>

        {/* --- NUEVA SECCIÓN: APP INTERACTIVA --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 bg-black/40 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-3xl flex flex-col items-center gap-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 z-10 w-full text-center md:text-left">
            <div className="bg-white p-4 rounded-2xl flex-shrink-0 animate-pulse shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <QrCode className="w-28 h-28 text-primary" strokeWidth={1.5} />
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-3 flex flex-col md:flex-row items-center md:justify-start gap-2">
                <Smartphone className="w-6 h-6 text-secondary hidden md:block" />
                <span>Desbloquea la App Exclusiva</span>
              </h3>
              <p className="text-white/80 leading-relaxed text-sm md:text-base font-light">
                Escanea el código QR desde tu celular para acceder al <strong className="text-secondary font-bold">Chanchito Digital</strong>, interactuar en la <strong className="text-secondary font-bold">Red Social del evento</strong> y vivir grandes sorpresas durante tu visita.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
