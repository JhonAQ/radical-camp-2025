"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type StoryType = "image" | "video";

interface Story {
  id: number;
  type: StoryType;
  url: string;
  duration?: number; // in seconds (for images)
  alt?: string;
  preview?: string;
}

const stories: Story[] = [
  {
    id: 1,
    type: "video",
    url: "/promo-2.mp4",
    alt: "Promo Oficial",
    preview: "/RADICAL-logotipo.png", // Fallback preview
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 5,
    alt: "Noche de Talentos",
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 5,
    alt: "Concierto",
  },
  {
    id: 4,
    type: "image",
    url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 5,
    alt: "Fogata",
  },
];

export default function Stories() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef<number>(0);

  const currentStory = stories[currentIndex];

  const resetStory = useCallback(() => {
    setProgress(0);
    pausedProgressRef.current = 0;
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    startTimeRef.current = null;
  }, []);

  const nextStory = useCallback(() => {
    resetStory();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false); // Close on finish
      setCurrentIndex(0);
    }
  }, [currentIndex, resetStory]);

  const prevStory = useCallback(() => {
    resetStory();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(0); // Restart first
    }
  }, [currentIndex, resetStory]);

  // Handle Progress
  useEffect(() => {
    if (!isOpen || isPaused) {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
      // Save current progress timestamp if pausing
      if (
        isPaused &&
        !pausedProgressRef.current &&
        startTimeRef.current !== null
      ) {
        // Logic handled by just not updating
      }
      return;
    }

    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;

      // Calculate elapsed time considering pauses could be complex,
      // simplified approach: increment progress based on frame delta
      // Better approach for React:
    };

    // Simplified Interval approach for Images
    if (currentStory.type === "image") {
      const duration = (currentStory.duration || 5) * 1000;
      const interval = 50; // update every 50ms
      const step = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            nextStory();
            return 0;
          }
          return prev + step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isOpen, isPaused, currentStory, nextStory]);

  // Handle Video Play/Pause
  useEffect(() => {
    if (currentStory.type === "video" && videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused, currentStory.type]);

  // Handle Video Progress
  const handleVideoUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleVideoEnded = () => {
    nextStory();
  };

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      resetStory();
    }
  }, [isOpen, resetStory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStory();
      if (e.key === "ArrowLeft") prevStory();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextStory, prevStory]);

  return (
    <>
      {/* Trigger Button (Floating) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-40 md:bottom-10 md:right-10"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer"
        >
          {/* Animated Ring */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>

          {/* Button Content */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 border-white overflow-hidden flex items-center justify-center shadow-2xl">
            <Image
              src="/RADICAL-logotipo.png"
              alt="Stories"
              width={50}
              height={50}
              className="object-contain p-2"
            />
          </div>

          {/* Badge */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-black animate-bounce">
            NUEVO
          </div>
        </button>
      </motion.div>

      {/* Full Screen Viewer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-20 text-white/80 hover:text-white p-2"
            >
              <X size={32} />
            </button>

            {/* Mute Button (Video only) */}
            {currentStory.type === "video" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute top-6 left-6 z-20 text-white/80 hover:text-white p-2"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            )}

            {/* Progress Bars */}
            <div className="absolute top-2 left-0 w-full px-2 flex gap-1 z-20">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                          ? `${progress}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div
              className="relative w-full h-full md:max-w-md md:aspect-[9/16] md:h-auto bg-gray-900 md:rounded-2xl overflow-hidden shadow-2xl"
              onPointerDown={() => setIsPaused(true)}
              onPointerUp={() => setIsPaused(false)}
              onPointerLeave={() => setIsPaused(false)}
            >
              {/* Tap Zones */}
              <div className="absolute inset-0 z-10 flex">
                <div
                  className="w-1/3 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevStory();
                  }}
                />
                <div className="w-1/3 h-full" /> {/* Center for pause */}
                <div
                  className="w-1/3 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextStory();
                  }}
                />
              </div>

              {/* Media */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStory.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center bg-black"
                >
                  {currentStory.type === "video" ? (
                    <video
                      ref={videoRef}
                      src={currentStory.url}
                      className="w-full h-full object-contain"
                      autoPlay
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={handleVideoUpdate}
                      onEnded={handleVideoEnded}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={currentStory.url}
                        alt={currentStory.alt || "Story"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <p className="text-white font-bold text-lg">
                      {currentStory.alt}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pause Indicator */}
              {isPaused && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
                    <Play className="fill-white text-white w-8 h-8" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
