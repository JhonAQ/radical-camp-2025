"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTools, FaDesktop, FaExclamationTriangle } from "react-icons/fa";

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      // Consider mobile/tablet anything smaller than lg (1024px)
      // or maybe just md (768px) depending on preference.
      // User said "celular", usually < 768px.
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;
  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9000] bg-dark-bg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-size-[2rem_2rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="w-32 h-32 relative">
            <Image
              src="/RADICAL-white.png"
              alt="Radical Logo"
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1
            className="text-4xl font-black mb-2 tracking-tighter text-white glitch-text"
            data-text="MOBILE"
          >
            MOBILE
          </h1>
          <h2 className="text-2xl font-bold text-secondary mb-6 tracking-widest uppercase">
            EN CONSTRUCCIÓN
          </h2>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm mb-8">
            <FaTools className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Estamos preparando una experiencia móvil increíble para ti. Por
              ahora, por favor ingresa desde una computadora.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 font-mono border border-gray-800 p-2 rounded bg-black/50">
            <FaDesktop />
            <span>DESKTOP ONLY EXPERIENCE</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-primary animate-text-shine bg-size-[200%_auto]"></div>
    </div>
  );
}
