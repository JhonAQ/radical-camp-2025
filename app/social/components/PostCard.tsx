"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import MediaRenderer from "./MediaRenderer";
import { toggleLike, getMediaPreview, type Post } from "@/lib/social";
import { timeAgo, formatCount } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  userId?: string;
  userName?: string;
  onCommentClick: (post: Post) => void;
  onShareClick: (post: Post) => void;
  onMediaClick: (post: Post) => void;
  onLikeChange?: (postId: string, liked: boolean, count: number) => void;
}

export default function PostCard({
  post,
  isLiked: initialIsLiked,
  userId,
  userName,
  onCommentClick,
  onShareClick,
  onMediaClick,
  onLikeChange,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = useCallback(async () => {
    if (!userId || isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    if (!wasLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    try {
      const result = await toggleLike(post.$id, userId);
      setIsLiked(result.liked);
      setLikesCount(result.newCount);
      onLikeChange?.(post.$id, result.liked, result.newCount);
    } catch {
      // Revert on error
      setIsLiked(wasLiked);
      setLikesCount(post.likesCount);
    } finally {
      setIsLiking(false);
    }
  }, [userId, isLiked, isLiking, post, onLikeChange]);

  const handleDoubleTap = useCallback(() => {
    if (!userId) return;
    if (!isLiked) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, [userId, isLiked, handleLike]);

  const categoryColors: Record<string, string> = {
    promo: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    speaker: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    info: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    archive: "bg-gray-500/10 text-gray-300 border-gray-500/20",
    "behind-scenes": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  };

  const catStyle =
    categoryColors[post.category] || "bg-white/5 text-gray-400 border-white/10";

  const contentTruncated =
    post.content && post.content.length > 120 && !expanded;

  return (
    <article className="bg-dark-bg">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-[2px] shrink-0">
          <div className="w-full h-full rounded-full bg-dark-bg overflow-hidden flex items-center justify-center">
            {post.authorAvatar ? (
              <Image
                src={getMediaPreview(post.authorAvatar, 100, 100)}
                alt={post.authorName}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-gray-400">
                {post.authorName?.[0]?.toUpperCase() || "R"}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[13px] font-bold text-white truncate">
              {post.authorName || "Radical Camp"}
            </h3>
            {post.pinned && (
              <Pin className="w-3 h-3 text-secondary shrink-0 fill-secondary" />
            )}
            <span className="text-[11px] text-gray-600">·</span>
            <span className="text-[11px] text-gray-500">
              {timeAgo(post.publishedAt || post.$createdAt)}
            </span>
          </div>
          <span
            className={`inline-block px-1.5 py-0 rounded text-[9px] font-semibold uppercase tracking-wider border ${catStyle}`}
          >
            {post.category}
          </span>
        </div>
        <button className="p-1 rounded-full hover:bg-white/5 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* ── Media ──────────────────────────────────────────── */}
      <div
        className="relative cursor-pointer"
        onDoubleClick={handleDoubleTap}
        onClick={() => onMediaClick(post)}
      >
        <MediaRenderer
          mediaType={post.mediaType}
          mediaFileIds={post.mediaFileIds}
          title={post.title}
          content={post.content}
          showControls={post.mediaType === "video"}
        />

        {/* Double-tap heart */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <Heart
                className="w-24 h-24 text-white drop-shadow-[0_0_30px_rgba(255,0,85,0.6)]"
                fill="#ff0055"
                strokeWidth={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions Bar (Instagram style) ────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={!userId}
              className="group disabled:opacity-30"
            >
              <motion.div
                whileTap={{ scale: 0.7 }}
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-[26px] h-[26px] transition-colors ${
                    isLiked
                      ? "text-accent fill-accent"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                />
              </motion.div>
            </button>

            {/* Comment */}
            <button
              onClick={() => onCommentClick(post)}
              className="group"
            >
              <MessageCircle className="w-[25px] h-[25px] text-gray-300 group-hover:text-white transition-colors" />
            </button>

            {/* Share */}
            <button
              onClick={() => onShareClick(post)}
              className="group"
            >
              <Share2 className="w-[22px] h-[22px] text-gray-300 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Bookmark */}
          <button className="group">
            <Bookmark className="w-[24px] h-[24px] text-gray-300 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* ── Likes Count ─────────────────────────────────────── */}
      {likesCount > 0 && (
        <div className="px-4 pt-1">
          <p className="text-[13px] font-bold text-white">
            {formatCount(likesCount)} {likesCount === 1 ? "like" : "likes"}
          </p>
        </div>
      )}

      {/* ── Caption ─────────────────────────────────────────── */}
      {(post.title || post.content) && post.mediaType !== "text" && (
        <div className="px-4 pt-1 pb-1">
          <p className="text-[13px] text-gray-200 leading-[1.45]">
            <span className="font-bold text-white mr-1">
              {post.authorName || "radicalcamp"}
            </span>
            {post.title && (
              <span className="font-semibold">{post.title} </span>
            )}
            {post.content && (
              <span className="text-gray-300">
                {contentTruncated
                  ? post.content.slice(0, 120) + "..."
                  : post.content}
              </span>
            )}
          </p>
          {contentTruncated && (
            <button
              onClick={() => setExpanded(true)}
              className="text-[13px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              más
            </button>
          )}
        </div>
      )}

      {/* ── Comments Preview ───────────────────────────────── */}
      {post.commentsCount > 0 && (
        <button
          onClick={() => onCommentClick(post)}
          className="px-4 pb-2 text-left block"
        >
          <p className="text-[13px] text-gray-500 hover:text-gray-300 transition-colors">
            Ver los {post.commentsCount} comentarios
          </p>
        </button>
      )}

      {/* Bottom spacing */}
      <div className="h-1" />
    </article>
  );
}
