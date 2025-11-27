"use client";

import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import Image from "next/image";

const experiences = [
  {
    id: 1,
    title: "Campamento en la Playa",
    description: "Dinámicas y diversión en Campel.",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1000&auto=format&fit=crop",
    color: "#00d4ff",
  },
  {
    id: 2,
    title: "Noches de Alabanza",
    description: "Adoración y música en vivo.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    color: "#6200ea",
  },
  {
    id: 3,
    title: "Año Nuevo 2026",
    description: "Recibimos el año celebrando.",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1000&auto=format&fit=crop",
    color: "#ff0055",
  },
  {
    id: 4,
    title: "Ponencias",
    description: "Mensajes que transforman.",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop",
    color: "#00d4ff",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 overflow-hidden bg-dark-bg">
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
            style={{ fill: '#050505' }}
          ></path>
        </svg>
      </div>

      <div className="relative z-20 mb-16">
        <div className="relative text-center">
          {/* Background Logo - Behind Title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] opacity-10 pointer-events-none select-none -z-10">
            <Image 
              src="/RADICAL-white.png" 
              alt="Radical Logo" 
              width={500} 
              height={200} 
              className="w-full h-auto"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Vive la <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary">Experiencia</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto px-6">
              Cuatro días intensos diseñados para marcar un antes y un después en tu vida.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-dark-bg to-transparent z-10 pointer-events-none" />
        
        <Marquee
          gradient={false}
          speed={40}
          pauseOnHover={true}
          className="py-10"
        >
          {experiences.map((item, index) => (
            <div
              key={item.id}
              className="mx-4 relative group w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${item.color}, transparent 70%)` }}
              />
            </div>
          ))}
           {/* Duplicate for variety if needed, but Marquee handles looping. 
               Adding more items to make the strip longer visually if the screen is wide. */}
           {experiences.map((item, index) => (
            <div
              key={`dup-${item.id}`}
              className="mx-4 relative group w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.description}
                </p>
              </div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${item.color}, transparent 70%)` }}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
