"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Countdown from "@/components/ui/Countdown";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-5 pt-36 pb-48 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          }}
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
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-4 drop-shadow-2xl"
            style={{ fontFamily: "var(--font-title)" }}
          >
            ¡ES TIEMPO
            <br />
            <span className="text-secondary">DE VOLVER!</span>
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
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link href="/registro">
            <button className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl cursor-pointer">
              Reservar Cupo
            </button>
          </Link>
          <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-white hover:text-primary hover:-translate-y-1 transition-all cursor-pointer">
            Ver Promo
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
