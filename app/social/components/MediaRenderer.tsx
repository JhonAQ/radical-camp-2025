"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { getMediaUrl, getMediaPreview } from "@/lib/social";

interface MediaRendererProps {
  mediaType: "image" | "video" | "gallery" | "text";
  mediaFileIds: string[];
  title: string;
  content?: string;
  autoPlay?: boolean;
  objectFit?: "cover" | "contain";
  showControls?: boolean;
  onVideoStateChange?: (playing: boolean) => void;
}

export default function MediaRenderer({
  mediaType,
  mediaFileIds,
  title,
  content,
  autoPlay = false,
  objectFit = "cover",
  showControls = true,
  onVideoStateChange,
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      onVideoStateChange?.(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      onVideoStateChange?.(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleGalleryScroll = () => {
    if (!galleryRef.current) return;
    const idx = Math.round(
      galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
    );
    setGalleryIndex(idx);
  };

  /* ── Text Post ──────────────────────────────────────────── */
  if (mediaType === "text") {
    return (
      <div className="w-full min-h-[200px] bg-gradient-to-br from-primary/30 via-card-bg to-secondary/20 flex items-center justify-center p-8">
        <p className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed max-w-lg">
          {content || title}
        </p>
      </div>
    );
  }

  /* ── Single Image ───────────────────────────────────────── */
  if (mediaType === "image" && mediaFileIds.length > 0) {
    return (
      <div className="relative w-full aspect-square bg-card-bg">
        <Image
          src={getMediaPreview(mediaFileIds[0], 1000)}
          alt={title}
          fill
          className={`object-${objectFit}`}
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>
    );
  }

  /* ── Video ──────────────────────────────────────────────── */
  if (mediaType === "video" && mediaFileIds.length > 0) {
    return (
      <div className="relative w-full aspect-video bg-black" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={getMediaUrl(mediaFileIds[0])}
          className={`w-full h-full object-${objectFit}`}
          playsInline
          loop
          muted={isMuted}
          preload="metadata"
        />
        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Play fill="white" className="w-7 h-7 text-white ml-1" />
            </div>
          </div>
        )}
        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Gallery ────────────────────────────────────────────── */
  if (mediaType === "gallery" && mediaFileIds.length > 0) {
    return (
      <div className="relative w-full">
        <div
          ref={galleryRef}
          className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
          onScroll={handleGalleryScroll}
        >
          {mediaFileIds.map((fileId, i) => (
            <div
              key={fileId}
              className="relative w-full aspect-square flex-shrink-0 snap-center bg-card-bg"
            >
              <Image
                src={getMediaPreview(fileId, 1000)}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        {/* Dots */}
        {mediaFileIds.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {mediaFileIds.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === galleryIndex
                    ? "bg-white w-4"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
        {/* Counter */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-bold text-white border border-white/10">
          {galleryIndex + 1}/{mediaFileIds.length}
        </div>
      </div>
    );
  }

  /* ── Fallback ───────────────────────────────────────────── */
  return (
    <div className="w-full aspect-video bg-card-bg flex items-center justify-center">
      <p className="text-gray-500 text-sm">Sin contenido</p>
    </div>
  );
}
