"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const speakers = [
  {
    name: "Ps. Sergio Bustamante",
    role: "Tema 1",
    image: "/pastor-sergio-bustamante.jpg",
  },
  {
    name: "Lilian Nuñez Lipa",
    role: "Tema 2",
    image: "/lilian-nunez-lipa.jpg",
  },
  {
    name: "Diego Valero C.",
    role: "Tema 3",
    image: "/diego-valero.jpg",
  },
  {
    name: "Brian Gonzales Inga",
    role: "Tema 4",
    image: "/brayan-inga.jpg",
  },
  {
    name: "Ps. Daniel Cruz",
    role: "Tema 4",
    image: "/daniel-cruz.jpg",
  },
];

export default function Speakers() {
  return (
    <section id="speakers" className="py-10 md:py-20 px-5 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Nuestros <span className="text-secondary">Ponentes</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conoce a nuestros ponentes y los temas que abordarán durante el
            campamento.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer w-[calc(50%-0.5rem)] sm:w-[calc(50%-1rem)] lg:w-[280px] max-w-[280px]"
            >
              <Image
                src={speaker.image}
                alt={speaker.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                <h3
                  className="text-lg md:text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  {speaker.name}
                </h3>
                <p className="text-secondary text-xs md:text-sm uppercase tracking-widest font-semibold">
                  {speaker.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
