"use client";

import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import Image from "next/image";

const experiences = [
  {
    id: 1,
    title: "JUEGOS Y PLAYA",
    subtitle: "Diversión y actividades al aire libre",
    image:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1000&auto=format&fit=crop",
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan-400",
    shadow: "shadow-cyan-500/50",
  },
  {
    id: 2,
    title: "ALABANZAS",
    subtitle: "NOCHE DE ALABANZA, MUSICA EN VIVO",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    color: "from-purple-500 to-pink-600",
    border: "border-purple-400",
    shadow: "shadow-purple-500/50",
  },
  {
    id: 3,
    title: "AÑO NUEVO",
    subtitle: "RECIBE EL AÑO NUEVO CON DIOS",
    image:
      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop",
    color: "from-pink-500 to-rose-600",
    border: "border-pink-400",
    shadow: "shadow-pink-500/50",
  },
  {
    id: 4,
    title: "PONENCIAS",
    subtitle: "Crecimiento Espiritual y Personal",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop",
    color: "from-cyan-400 to-teal-500",
    border: "border-teal-400",
    shadow: "shadow-teal-500/50",
  },
];

const GlitchCard = ({ item }: { item: (typeof experiences)[0] }) => {
  return (
    <div className="relative group w-64 h-64 md:w-80 md:h-80 mx-4 md:mx-6 bg-black transition-transform duration-300 hover:-translate-y-2">
      {/* Cyberpunk Border Frame with Clip Path */}
      <div
        className={`absolute inset-0 border-2 ${item.border} opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 z-20`}
        style={{
          clipPath:
            "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
        }}
      ></div>

      {/* Corner Accents */}
      <div
        className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${item.border} z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${item.border} z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      ></div>

      {/* Image Container with Clip Path */}
      <div
        className="absolute inset-1 z-10 overflow-hidden bg-gray-900"
        style={{
          clipPath:
            "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
        }}
      >
        {/* Image */}
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-all duration-500 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-110"
        />

        {/* Scanline Overlay (CSS only) */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none z-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)",
            backgroundSize: "100% 4px",
          }}
        ></div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-30 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-3xl font-black italic tracking-tighter text-white mb-1 drop-shadow-lg">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full bg-linear-to-r ${item.color} animate-pulse`}
            ></span>
            <p
              className={`text-sm font-mono font-bold text-transparent bg-clip-text bg-linear-to-r ${item.color}`}
            >
              // {item.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-8 bg-dark-bg"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dark-bg pointer-events-none" />

      {/* Curved Divider Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-10">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-dark-bg"
            style={{ fill: "#050505" }}
          ></path>
        </svg>
      </div>

      <div className="relative z-20 mb-8 md:mb-16">
        <div className="relative text-center">
          {/* Background Logo - Behind Title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[1000px] opacity-40 blur-[1px] pointer-events-none select-none -z-10 mix-blend-screen">
            <Image
              src="/RADICAL-white.png"
              alt="Radical Logo"
              width={1000}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Text Readability Enhancer - Dark Glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150px] bg-black/60 blur-3xl -z-5 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-xl">
              Vive la{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">
                Experiencia
              </span>
            </h2>
            <motion.p
              className="text-white text-sm md:text-lg max-w-2xl mx-auto px-6 font-medium tracking-wide"
              animate={{
                textShadow: [
                  "0 0 5px rgba(0, 212, 255, 0.3)",
                  "0 0 15px rgba(0, 212, 255, 0.6)",
                  "0 0 5px rgba(0, 212, 255, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Cinco días llenos de actividades, aprendizaje y momentos que recordarás siempre.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full">
        {/* Rotated Background Strip for "Speed" look */}
        <div className="absolute top-1/2 left-0 w-full h-[300px] bg-linear-to-r from-primary/5 via-secondary/5 to-primary/5 -skew-y-3 -translate-y-1/2 blur-3xl pointer-events-none"></div>

        <Marquee
          gradient={false}
          speed={50}
          pauseOnHover={false}
          className="py-10 overflow-y-visible"
        >
          {experiences.map((item) => (
            <GlitchCard key={item.id} item={item} />
          ))}
          {experiences.map((item) => (
            <GlitchCard key={`clone-${item.id}`} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
