"use client";

import { motion } from "framer-motion";
import { FaCalendarCheck, FaMapMarkedAlt, FaUserFriends, FaTicketAlt } from "react-icons/fa";

const infoItems = [
  {
    icon: FaCalendarCheck,
    label: "FECHAS",
    value: "30 Dic - 03 Ene",
    sub: "4 Días inolvidables",
    active: true,
  },
  {
    icon: FaMapMarkedAlt,
    label: "UBICACIÓN",
    value: "Campel",
    sub: "Arequipa, Perú",
  },
  {
    icon: FaUserFriends,
    label: "EDADES",
    value: "17 Años +",
    sub: "Cupos limitados",
  },
  {
    icon: FaTicketAlt,
    label: "INVERSIÓN",
    value: "S/ 150.00",
    sub: "Separa con S/ 50 antes del 15 Dic",
    isPrice: true,
    promo: true,
    originalPrice: "Regular: S/ 190",
  },
];

export default function Info() {
  return (
    <section id="info" className="relative z-20 -mt-24 px-5 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-[#111827] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-10 text-center group border-b md:border-b-0 md:border-r border-gray-800 last:border-0 transition-colors duration-300 ${
                item.active ? "bg-[#161f32]" : "hover:bg-[#161f32]"
              }`}
            >
              {item.promo && (
                <div className="absolute top-0 right-0 bg-[#ff0055] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Promo Flash
                </div>
              )}

              <div className="mb-6 flex justify-center">
                <item.icon 
                  className={`w-12 h-12 ${item.isPrice ? "text-[#ff0055]" : "text-[#00d4ff]"}`} 
                />
              </div>
              
              <span className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 font-medium">
                {item.label}
              </span>
              
              <h3
                className={`text-2xl md:text-3xl font-bold mb-2 text-white`}
                style={{ fontFamily: "var(--font-title)" }}
              >
                {item.value}
              </h3>
              
              <p className="text-sm text-gray-400 font-light">{item.sub}</p>
              
              {item.originalPrice && (
                <p className="text-xs text-gray-600 line-through mt-1">{item.originalPrice}</p>
              )}

              {/* Active Line Effect */}
              {item.active && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00d4ff]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
