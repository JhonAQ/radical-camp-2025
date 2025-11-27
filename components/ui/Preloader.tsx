"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds of intro

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <div className="relative">
            {/* Glitch Layers */}
            <GlitchImage />
            
            {/* Loading Bar */}
            <motion.div 
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-secondary shadow-[0_0_10px_#00d4ff]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
            
            <motion.p
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-gray-500 text-xs tracking-[0.3em] uppercase font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 0.8, duration: 1.5, times: [0, 0.2, 0.5, 1] }}
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GlitchImage() {
  return (
    <div className="relative w-[300px] md:w-[500px] h-[120px] md:h-[200px]">
      {/* Base Image */}
      <Image
        src="/RADICAL-white.png"
        alt="Loading..."
        fill
        className="object-contain relative z-10"
        priority
      />
      
      {/* Glitch Effect Layers */}
      <motion.div
        className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge"
        animate={{
          x: [-2, 2, -1, 0, 3, -3, 0],
          y: [1, -1, 0, 2, -2, 0],
          opacity: [0.5, 0.8, 0.5, 0.3, 0.8, 0.5],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 3, // Occasional glitch
        }}
      >
        <Image
          src="/RADICAL-white.png"
          alt=""
          fill
          className="object-contain text-red-500"
          style={{ filter: "drop-shadow(2px 0 0 red)" }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge"
        animate={{
          x: [2, -2, 1, 0, -3, 3, 0],
          y: [-1, 1, 0, -2, 2, 0],
          opacity: [0.5, 0.8, 0.5, 0.3, 0.8, 0.5],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 2.5,
        }}
      >
        <Image
          src="/RADICAL-white.png"
          alt=""
          fill
          className="object-contain text-cyan-500"
          style={{ filter: "drop-shadow(-2px 0 0 cyan)" }}
        />
      </motion.div>
    </div>
  );
}
