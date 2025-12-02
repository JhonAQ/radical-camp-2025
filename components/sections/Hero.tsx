"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, X } from "lucide-react";
import Countdown from "@/components/ui/Countdown";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-5 pt-24 pb-32 md:pt-36 md:pb-48 overflow-hidden"
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
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 px-4"
        >
          <Link href="/registro" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white text-primary px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg uppercase tracking-wide hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl cursor-pointer">
              Reservar Cupo
            </button>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg uppercase tracking-wide hover:bg-white hover:text-primary hover:-translate-y-1 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Ver Promo
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[350px] md:max-w-[400px] aspect-9/16 bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <video
                src="/promo-2.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                loop
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
