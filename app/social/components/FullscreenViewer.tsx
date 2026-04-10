"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Play,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import { getMediaUrl, getMediaPreview, toggleLike, type Post } from "@/lib/social";
import { timeAgo, formatCount } from "@/lib/utils";

interface FullscreenViewerProps {
  isOpen: boolean;
  items: Post[];
  initialIndex: number;
  likedPostIds: Set<string>;
  userId?: string;
  onClose: () => void;
  onCommentClick: (post: Post) => void;
  onShareClick: (post: Post) => void;
  onLikeChange: (postId: string, liked: boolean, count: number) => void;
}

export default function FullscreenViewer({
  isOpen,
  items,
  initialIndex,
  likedPostIds,
  userId,
  onClose,
  onCommentClick,
  onShareClick,
  onLikeChange,
}: FullscreenViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [localLikes, setLocalLikes] = useState<Record<string, { liked: boolean; count: number }>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize on open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      setActiveIndex(initialIndex);
      containerRef.current.scrollTo({
        top: window.innerHeight * initialIndex,
        behavior: "instant",
      });
    }
  }, [isOpen, initialIndex]);

  // History management
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ viewerOpen: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isOpen, onClose]);

  // Video playback control
  useEffect(() => {
    if (isOpen) {
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
      videoRefs.current.forEach((video) => video?.pause());
    }
  }, [activeIndex, isOpen]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const index = Math.round(
        containerRef.current.scrollTop / window.innerHeight
      );
      if (index !== activeIndex && index >= 0 && index < items.length) {
        setActiveIndex(index);
        setIsPlaying(true);
      }
    }
  }, [activeIndex, items.length]);

  const togglePlay = useCallback(() => {
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
  }, [activeIndex]);

  const toggleMuteHandler = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const video = videoRefs.current[activeIndex];
      if (video) {
        video.muted = !video.muted;
        setIsMuted(video.muted);
      }
    },
    [activeIndex]
  );

  const handleLike = useCallback(
    async (post: Post) => {
      if (!userId) return;

      const currentState = localLikes[post.$id];
      const wasLiked = currentState ? currentState.liked : likedPostIds.has(post.$id);
      const currentCount = currentState ? currentState.count : post.likesCount;

      // Optimistic
      const newLiked = !wasLiked;
      const newCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
      setLocalLikes((prev) => ({
        ...prev,
        [post.$id]: { liked: newLiked, count: newCount },
      }));

      try {
        const result = await toggleLike(post.$id, userId);
        setLocalLikes((prev) => ({
          ...prev,
          [post.$id]: { liked: result.liked, count: result.newCount },
        }));
        onLikeChange(post.$id, result.liked, result.newCount);
      } catch {
        setLocalLikes((prev) => ({
          ...prev,
          [post.$id]: { liked: wasLiked, count: currentCount },
        }));
      }
    },
    [userId, localLikes, likedPostIds, onLikeChange]
  );

  const handleDownload = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (post.mediaFileIds.length === 0) return;
    const url = getMediaUrl(post.mediaFileIds[0]);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = post.title || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const closeViewer = () => window.history.back();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black"
      >
        {/* Close button */}
        <button
          className="absolute top-6 left-5 z-50 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
          onClick={closeViewer}
        >
          <ChevronDown size={22} />
        </button>

        {/* Mute toggle */}
        <button
          className="absolute top-6 right-5 z-50 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
          onClick={toggleMuteHandler}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Scroll container */}
        <div
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide overscroll-contain"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {items.map((item, index) => {
            const likeState = localLikes[item.$id];
            const isLiked = likeState
              ? likeState.liked
              : likedPostIds.has(item.$id);
            const likesCount = likeState ? likeState.count : item.likesCount;

            return (
              <div
                key={item.$id}
                className="h-[100dvh] w-full snap-center relative flex items-center justify-center bg-black"
                onClick={item.mediaType === "video" ? togglePlay : undefined}
              >
                {/* Media */}
                <div className="w-full h-full relative flex items-center justify-center">
                  {item.mediaType === "video" && item.mediaFileIds.length > 0 ? (
                    <>
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={getMediaUrl(item.mediaFileIds[0])}
                        className="w-full h-full object-contain"
                        playsInline
                        loop
                        muted={isMuted}
                      />
                      {!isPlaying && activeIndex === index && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Play
                              fill="white"
                              className="w-10 h-10 text-white ml-1"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : item.mediaType === "text" ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 via-dark-bg to-secondary/30 flex items-center justify-center p-10">
                      <p className="text-2xl md:text-4xl font-bold text-white text-center leading-relaxed max-w-lg">
                        {item.content || item.title}
                      </p>
                    </div>
                  ) : item.mediaFileIds.length > 0 ? (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 overflow-hidden opacity-30 blur-3xl">
                        <Image
                          src={getMediaPreview(item.mediaFileIds[0], 400)}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Image
                        src={getMediaPreview(item.mediaFileIds[0], 1200)}
                        alt={item.title}
                        fill
                        className="object-contain relative z-10"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Right sidebar - TikTok style */}
                <div className="absolute right-4 bottom-[140px] flex flex-col items-center gap-5 z-20">
                  {/* Like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item);
                    }}
                    disabled={!userId}
                    className="flex flex-col items-center gap-1 disabled:opacity-40"
                  >
                    <motion.div
                      whileTap={{ scale: 0.7 }}
                      animate={isLiked ? { scale: [1, 1.4, 1] } : {}}
                      className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked
                            ? "text-accent fill-accent"
                            : "text-white"
                        }`}
                      />
                    </motion.div>
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                      {formatCount(likesCount)}
                    </span>
                  </button>

                  {/* Comment */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCommentClick(item);
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                      {formatCount(item.commentsCount)}
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareClick(item);
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                  </button>

                  {/* Download */}
                  {item.mediaFileIds.length > 0 && (
                    <button
                      onClick={(e) => handleDownload(e, item)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Bottom overlay with post info */}
                <div className="absolute bottom-0 left-0 right-16 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-8 pointer-events-none z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <span className="text-[10px] font-bold">
                          {item.authorName?.[0] || "R"}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-white drop-shadow-lg">
                      {item.authorName || "Radical Camp"}
                    </span>
                    <span className="text-xs text-gray-300 drop-shadow-md">
                      · {timeAgo(item.publishedAt || item.$createdAt)}
                    </span>
                  </div>
                  {item.title && item.mediaType !== "text" && (
                    <h2 className="text-lg font-bold mb-1 text-white drop-shadow-lg leading-tight">
                      {item.title}
                    </h2>
                  )}
                  {item.content && item.mediaType !== "text" && (
                    <p className="text-sm text-gray-200 drop-shadow-md line-clamp-2 max-w-lg">
                      {item.content}
                    </p>
                  )}
                  <span className="inline-block mt-2 px-2 py-0.5 bg-secondary/30 text-secondary text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
