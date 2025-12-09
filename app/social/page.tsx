"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X, Download, ExternalLink, Pause } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// Mock Data
const items = [
  {
    id: 1,
    type: "video",
    title: "Promo Oficial 2025",
    category: "Video",
    url: "/promos/promo-2.mp4",
    thumbnail: "/promos/flyer-radicalcamp.jpg",
    description:
      "¡Es tiempo de volver! Prepárate para lo que Dios hará en este campamento.",
    date: "Hace 2 días",
    featured: true,
  },
  {
    id: 2,
    type: "video",
    title: "Invitación Pastor Sergio",
    category: "Video",
    url: "/promos/promo-pastor-sergio.mp4",
    thumbnail: "/pastor-sergio-bustamante.jpg",
    description:
      "Nuestro plenarista Sergio Bustamante te invita a ser parte de esta experiencia.",
    date: "Hace 5 días",
    aspect: "aspect-[9/16]",
  },
  {
    id: 3,
    type: "image",
    title: "Flyer Oficial",
    category: "Info",
    url: "/promos/flyer-radicalcamp.jpg",
    description: "Comparte el flyer oficial con tus amigos y grupo de jóvenes.",
    date: "Hace 1 semana",
    aspect: "aspect-[4/5]",
  },
  {
    id: 4,
    type: "video",
    title: "Teaser Oficial",
    category: "Video",
    url: "/promos/promo-1.mp4",
    thumbnail: "/promos/promo-ya-tenemos.web.jpg",
    description: "Un adelanto de lo que viviremos en Campel.",
    date: "Hace 2 semanas",
    aspect: "aspect-video",
  },
  {
    id: 5,
    type: "image",
    title: "¡Ya tenemos lugar!",
    category: "Info",
    url: "/promos/promo-ya-tenemos.web.jpg",
    description: "Campel - Arequipa nos espera para 4 días inolvidables.",
    date: "Hace 2 semanas",
    aspect: "aspect-square",
  },
  {
    id: 6,
    type: "image",
    title: "Pastor Sergio Bustamante",
    category: "Speaker",
    url: "/pastor-sergio-bustamante.jpg",
    description:
      "Plenarista confirmado. Viene con una palabra poderosa para esta generación.",
    date: "Hace 3 semanas",
    aspect: "aspect-square",
  },
  {
    id: 7,
    type: "image",
    title: "Diego Valero",
    category: "Speaker",
    url: "/diego-valero.jpg",
    description: "Listo para compartir con nosotros en los talleres.",
    date: "Hace 3 semanas",
    aspect: "aspect-square",
  },
  {
    id: 8,
    type: "image",
    title: "Lilian Nuñez",
    category: "Speaker",
    url: "/lilian-nunez-lipa.jpg",
    description: "Nuestra invitada especial para tiempos de impartición.",
    date: "Hace 3 semanas",
    aspect: "aspect-square",
  },
  {
    id: 9,
    type: "image",
    title: "Brayan Inga",
    category: "Speaker",
    url: "/brayan-inga.jpg",
    description: "Parte del equipo de expositores que nos acompañará.",
    date: "Hace 3 semanas",
    aspect: "aspect-square",
  },
  {
    id: 10,
    type: "image",
    title: "Daniel Cruz",
    category: "Speaker",
    url: "/daniel-cruz.jpg",
    description: "Preparado para desafiarnos en este campamento.",
    date: "Hace 3 semanas",
    aspect: "aspect-square",
  },
];

const categories = ["Todos", "Video", "Speaker", "Info"];

export default function SocialPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const filteredItems =
    selectedCategory === "Todos"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openViewer = (item: typeof items[0]) => {
    const index = filteredItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setInitialIndex(index);
      setActiveIndex(index);
      setViewerOpen(true);
      setIsPlaying(true);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(
        containerRef.current.scrollTop / window.innerHeight
      );
      if (index !== activeIndex) {
        setActiveIndex(index);
        setIsPlaying(true); // Auto-play next video
      }
    }
  };

  const togglePlay = () => {
    const video = videoRefs.current[activeIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // Effect to manage video playback based on activeIndex
  useEffect(() => {
    if (viewerOpen) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === activeIndex) {
            video.currentTime = 0;
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
          }
        }
      });
    } else {
      // Pause all when viewer is closed
      videoRefs.current.forEach((video) => video?.pause());
    }
  }, [activeIndex, viewerOpen]);

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 selection:bg-secondary selection:text-black">
      <Navbar />

      {/* Header Section */}
      <div className="pt-32 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 uppercase">
            Muro{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              Radical
            </span>
          </h1>
          <p className="text-gray-400 max-w-md text-sm md:text-base">
            Entérate de las últimas novedades, lanzamientos y recursos
            exclusivos del campamento.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, index) => (
            <motion.div
              layoutId={`card-${item.id}`}
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openViewer(item)}
              className="break-inside-avoid group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/50 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
            >
              {/* Image/Thumbnail */}
              <div
                className={`relative w-full ${item.aspect || "aspect-video"}`}
              >
                {item.type === "video" ? (
                  <>
                    <Image
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <Play
                          fill="white"
                          className="w-5 h-5 text-white ml-1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/10 text-white">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap ml-2 mt-1">
                    {item.date}
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Screen Feed Viewer (TikTok Style) */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black"
          >
            <button
              className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
              onClick={() => setViewerOpen(false)}
            >
              <X size={24} />
            </button>

            <div
              className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              ref={containerRef}
              onScroll={handleScroll}
            >
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="h-[100dvh] w-full snap-center relative flex items-center justify-center bg-black"
                  onClick={item.type === "video" ? togglePlay : undefined}
                >
                  {/* Media */}
                  <div className="w-full h-full relative flex items-center justify-center">
                    {item.type === "video" ? (
                      <>
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          src={item.url}
                          className="w-full h-full object-contain"
                          playsInline
                          loop
                          // No controls, custom handling
                        />
                        {/* Play/Pause Overlay Animation */}
                        {!isPlaying && activeIndex === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play fill="white" className="w-10 h-10 text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 overflow-hidden opacity-30 blur-3xl">
                          <Image
                            src={item.url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Image
                          src={item.url}
                          alt={item.title}
                          fill
                          className="object-contain relative z-10"
                        />
                      </div>
                    )}
                  </div>

                  {/* Overlay Info - Reduced size and intrusion */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-10 pointer-events-none">
                    <div className="max-w-2xl mx-auto w-full pointer-events-auto">
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <span className="inline-block px-2 py-0.5 bg-secondary text-black text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                            {item.category}
                          </span>
                          <h2 className="text-xl md:text-2xl font-bold mb-1 text-white drop-shadow-lg leading-tight">
                            {item.title}
                          </h2>
                          <p className="text-gray-200 text-xs md:text-sm max-w-lg drop-shadow-md line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 shrink-0">
                          <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors border border-white/10">
                            <Download size={20} />
                          </button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors border border-white/10">
                            <ExternalLink size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}