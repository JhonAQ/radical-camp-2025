"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaClock,
  FaBus,
} from "react-icons/fa";

const faqs = [
  {
    question: "¿CUÁNDO Y DÓNDE ES?",
    answer:
      "El campamento se realizará del 30 de Diciembre al 02 de Enero en el Campamento Evangélico Luterano (CAMPEL - Mejía). Un lugar perfecto para desconectarse y conectarse con Dios.",
    className: "",
  },
  {
    question: "SALIDA Y PUNTO DE ENCUENTRO",
    answer: (
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <FaBus className="text-secondary mt-1 shrink-0" />
          <div>
            <p className="font-bold text-white">Martes 30 de Diciembre</p>
            <p className="text-gray-400">Salida rumbo a Campel.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaClock className="text-secondary mt-1 shrink-0" />
          <div>
            <p className="font-bold text-white">
              Inscripciones: 12:00 PM - 2:00 PM
            </p>
            <p className="text-gray-400">
              Salida del bus: 2:00 PM (Hora exacta)
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-secondary mt-1 shrink-0" />
          <div>
            <p className="font-bold text-white">Lugar: SETELA</p>
            <p className="text-gray-400">
              Calle Miramar Nro 202 Fundo la Murillo, Paucarpata, Arequipa.
            </p>
          </div>
        </div>
      </div>
    ),
    className: "md:col-span-2 bg-secondary/5 border-secondary/30",
  },
  {
    question: "¿QUÉ DEBO LLEVAR?",
    answer:
      "Biblia, cuaderno, ropa cómoda y deportiva, ropa de abrigo para la noche, artículos de aseo personal, repelente, bloqueador y sleeping bag o frazada.",
    className: "",
  },
  {
    question: "¿HAY LÍMITE DE EDAD?",
    answer:
      "El campamento está diseñado para jóvenes y adolescentes. ¡Eres bienvenido! No hay límite superior, solo necesitas un corazón joven.",
    className: "",
  },
  {
    question: "¿PUEDO PAGAR POR PARTES?",
    answer:
      "¡Sí! Puedes reservar tu cupo con S/ 50 y terminar de pagar el resto antes del inicio del evento. Aprovecha el precio de preventa reservando ahora (S/ 150 solo hasta el 15 de diciembre).",
    className: "",
  },
  {
    question: "¿INCLUYE TRANSPORTE?",
    answer:
      "El costo cubre hospedaje, alimentación completa y materiales. El transporte hacia el punto de encuentro corre por cuenta de cada participante.",
    className: "",
  },
];

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState<number[]>([1]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-[#0a0a0a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter">
            PREGUNTAS{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary">
              FRECUENTES
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Todo lo que necesitas saber antes de iniciar la misión.
          </p>
        </div>

        {/* FAQ Grid - Compact Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group relative border transition-all duration-300 rounded-xl overflow-hidden flex flex-col ${
                  isOpen
                    ? "border-secondary bg-secondary/5 shadow-[0_0_15px_rgba(0,212,255,0.05)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                } ${faq.className || "md:col-span-1"}`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full text-left p-4 flex items-start justify-between gap-3 relative z-10"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span
                      className={`font-mono text-xs opacity-50 ${
                        isOpen ? "text-secondary" : "text-gray-500"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <h3
                      className={`font-bold text-base leading-tight ${
                        isOpen
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      } transition-colors pr-2`}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`text-secondary text-xs mt-1 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="text-gray-400 leading-relaxed text-sm pl-7">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Call to Action Card - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col justify-center items-center text-center bg-black/20 hover:bg-black/40 transition-colors group md:col-span-1"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FaQuestionCircle className="text-gray-400 text-sm" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">¿Más dudas?</h3>
            <a
              href="https://wa.me/51931697951"
              target="_blank"
              className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-white transition-colors border-b border-secondary pb-0.5"
            >
              Contactar por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
