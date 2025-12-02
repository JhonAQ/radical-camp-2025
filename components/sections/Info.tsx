"use client";

import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaMapMarkedAlt,
  FaUserFriends,
  FaTicketAlt,
  FaFire,
  FaClock,
} from "react-icons/fa";

const infoItems = [
  {
    icon: FaCalendarCheck,
    label: "FECHAS",
    value: "30 Dic - 03 Ene",
    sub: "4 Días de Verano",
    gradient: "from-blue-500 to-cyan-400",
    delay: 0,
  },
  {
    icon: FaMapMarkedAlt,
    label: "UBICACIÓN",
    value: "Campel",
    sub: "Arequipa, Perú",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.1,
  },
  {
    icon: FaUserFriends,
    label: "EDADES",
    value: "17 Años +",
    sub: "Cupos Limitados",
    gradient: "from-blue-500 to-cyan-400",
    delay: 0.2,
  },
];

export default function Info() {
  return (
    <section id="info" className="relative z-20 -mt-24 px-5 mb-32">
      <div className="max-w-7xl mx-auto">
        {/* Background Glow Effects */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Standard Info Cards */}
          {infoItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              whileHover={{ y: -10 }}
              className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 md:p-8 overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              {/* Hover Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex flex-row md:flex-col items-center text-left md:text-center gap-4 md:gap-0">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl bg-gradient-to-br ${
                    item.gradient
                  } p-[1px] md:mb-6 shadow-lg group-hover:shadow-${
                    item.gradient.split("-")[1]
                  }-500/50 transition-shadow duration-500`}
                >
                  <div className="w-full h-full bg-black/90 rounded-2xl flex items-center justify-center">
                    <item.icon className="text-xl md:text-2xl text-white" />
                  </div>
                </div>

                <div>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2"
                    style={{ fontFamily: "var(--font-title)" }}
                  >
                    {item.value}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide uppercase mb-0 md:mb-1">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-xs">{item.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Special Price Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0055] to-[#ff5e00] rounded-[2rem] blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="relative h-full bg-[#111] rounded-[2rem] border border-[#ff0055]/30 p-1 overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-0 right-0 bg-[#ff0055] text-white text-[10px] font-bold px-4 py-2 rounded-bl-2xl z-20">
                PROMOCIÓN
              </div>

              <div className="h-full bg-gradient-to-b from-[#1a1a1a] to-black rounded-[1.8rem] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff0055_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-center gap-2 mb-2 text-gray-500">
                    <span className="text-sm font-medium uppercase tracking-wider">
                      Regular
                    </span>
                    <span className="line-through decoration-[#ff0055] decoration-2">
                      S/ 190
                    </span>
                  </div>

                  <div className="flex items-start justify-center gap-1 mb-4">
                    <span className="text-2xl font-bold text-white mt-2">
                      S/
                    </span>
                    <h3
                      className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]"
                      style={{ fontFamily: "var(--font-title)" }}
                    >
                      150
                    </h3>
                  </div>

                  <div className="bg-[#ff0055]/10 border border-[#ff0055]/20 rounded-xl p-3 mb-2">
                    <div className="flex items-center justify-center gap-2 text-[#ff0055] text-xs font-bold uppercase mb-1">
                      <FaClock className="animate-pulse" />
                      <span>Solo hasta el 15 Dic</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400">
                    *Incluye alimentación, hospedaje y traslado.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
