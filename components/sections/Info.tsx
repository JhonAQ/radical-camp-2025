"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Tag } from "lucide-react";

const infoItems = [
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Campel, Arequipa",
    sub: "Perú",
  },
  {
    icon: Calendar,
    label: "Fecha",
    value: "30 Dic - 03 Ene",
    sub: "Año Nuevo 2026",
  },
  {
    icon: Users,
    label: "Cupo",
    value: "Limitado",
    sub: "Solo 500 lugares",
  },
  {
    icon: Tag,
    label: "Costo",
    value: "$1,200",
    sub: "Preventa Especial",
    isPrice: true,
  },
];

export default function Info() {
  return (
    <section id="info" className="relative z-20 -mt-20 px-5 mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-glass-bg backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 text-center group border-b md:border-b-0 md:border-r border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-300"
            >
              <item.icon className="w-10 h-10 mx-auto mb-4 text-secondary group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                {item.label}
              </span>
              <h3
                className={`text-2xl font-bold mb-1 ${
                  item.isPrice ? "text-accent text-4xl" : "text-white"
                }`}
                style={{ fontFamily: "var(--font-title)" }}
              >
                {item.value}
              </h3>
              <p className="text-sm text-gray-500">{item.sub}</p>

              {/* Hover Line Effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
