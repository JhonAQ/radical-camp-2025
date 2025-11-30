"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaQuestionCircle, FaTerminal } from "react-icons/fa";

const faqs = [
  {
    question: "¿CUÁNDO Y DÓNDE ES?",
    answer:
      "El campamento se realizará del 30 de Diciembre al 02 de Enero en el Campamento Bautista de Tacna (Calana). Un lugar perfecto para desconectarse y conectarse con Dios.",
  },
  {
    question: "¿QUÉ DEBO LLEVAR?",
    answer:
      "Biblia, cuaderno, ropa cómoda y deportiva, ropa de abrigo para la noche, artículos de aseo personal, repelente, bloqueador y sleeping bag o frazada.",
  },
  {
    question: "¿HAY LÍMITE DE EDAD?",
    answer:
      "El campamento está diseñado para jóvenes y adolescentes. Si tienes 13 años o más, ¡eres bienvenido! No hay límite superior, solo necesitas un corazón joven.",
  },
  {
    question: "¿PUEDO PAGAR POR PARTES?",
    answer:
      "¡Sí! Puedes reservar tu cupo con S/ 50 y terminar de pagar el resto antes del inicio del evento. Aprovecha el precio de preventa reservando ahora.",
  },
  {
    question: "¿INCLUYE TRANSPORTE?",
    answer:
      "El costo cubre hospedaje, alimentación completa y materiales. El transporte hacia el local corre por cuenta de cada participante, pero coordinaremos puntos de encuentro.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
      {/* Background Pattern - Cyber Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-secondary to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter glitch-text"
            data-text="PREGUNTAS FRECUENTES"
          >
            PREGUNTAS{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary">
              FRECUENTES
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Todo lo que necesitas saber antes de iniciar la misión.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative border ${
                openIndex === index
                  ? "border-secondary bg-secondary/5"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              } transition-all duration-300 rounded-xl overflow-hidden`}
            >
              {/* Active Indicator Line */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-secondary transition-all duration-300 ${
                  openIndex === index ? "opacity-100" : "opacity-0"
                }`}
              ></div>

              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 relative z-10"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-xs ${
                      openIndex === index ? "text-secondary" : "text-gray-600"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <h3
                    className={`font-bold text-lg ${
                      openIndex === index
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    } transition-colors`}
                  >
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`text-secondary transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pl-14">
                      <p className="text-gray-400 leading-relaxed border-l-2 border-gray-800 pl-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}

          {/* Call to Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="border border-dashed border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center text-center bg-black/20 hover:bg-black/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaQuestionCircle className="text-gray-400 text-xl" />
            </div>
            <h3 className="font-bold text-white mb-2">¿Tienes más dudas?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Nuestro equipo está listo para ayudarte.
            </p>
            <a
              href="https://wa.me/51931697951"
              target="_blank"
              className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-white transition-colors border-b border-secondary pb-1"
            >
              Contactar por Whatsapp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
