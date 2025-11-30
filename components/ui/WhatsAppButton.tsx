"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  // Tacna Contact: Wilber Arivilca
  const phoneNumber = "51931697951";
  const message = "Hola, tengo una consulta sobre el Radical Camp 2025.";

  return (
    <div className="fixed bottom-6 right-6 z-[50] flex items-center gap-3">
      {/* Tooltip / Label */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.9,
        }}
        className="bg-black/90 backdrop-blur-md border border-green-500/30 text-white px-3 py-1.5 rounded-md shadow-lg hidden md:block pointer-events-none"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-green-400 whitespace-nowrap">
          ¿Consultas?
        </p>
      </motion.div>

      {/* Button */}
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Effect (Always visible aura) */}
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md group-hover:bg-green-500/40 group-hover:blur-lg transition-all duration-300"></div>

        {/* Main Circle */}
        <div className="relative w-12 h-12 bg-black border border-green-500/50 group-hover:border-green-500 rounded-full flex items-center justify-center shadow-lg transition-all overflow-hidden">
          <motion.div
            animate={isHovered ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <FaWhatsapp className="text-2xl text-green-500 group-hover:text-green-400 transition-colors relative z-10" />
          </motion.div>
        </div>
      </motion.a>
    </div>
  );
}
