"use client";

import { motion } from "framer-motion";
import { Music, Zap, Heart, Coffee } from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Noches de adoración",
    desc: "Música en vivo y momentos de adoración.",
  },
  {
    icon: Zap,
    title: "Plenarias",
    desc: "Ponencias sobre temas dirigidas a jóvenes cristianos.",
  },
  {
    icon: Heart,
    title: "Comunidad",
    desc: "Conoce a más cristianos como tú.",
  },
  {
    icon: Coffee,
    title: "Juegos y +",
    desc: "Dinámicas, juegos y playa!.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-5 relative">
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
            La <span className="text-secondary">Experiencia</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Prepárate para recibir el año nuevo con una experiencia única que
            transformará tu vida.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <feature.icon className="w-12 h-12 mb-6 text-secondary group-hover:text-primary transition-colors duration-300" />

              <h3
                className="text-xl font-bold mb-3 text-white group-hover:text-secondary transition-colors"
                style={{ fontFamily: "var(--font-title)" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
