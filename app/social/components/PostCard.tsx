"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  Bookmark,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import MediaRenderer from "./MediaRenderer";
import { toggleLike, getMediaPreview, type Post } from "@/lib/social";
import { createNotification } from "@/lib/notifications";
import { timeAgo, formatCount } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  userId?: string;
  userName?: string;
  onCommentClick: (post: Post) => void;
  onShareClick: (post: Post) => void;
  onMediaClick: (post: Post) => void;
}

export default function PostCard({
  post,
  isLiked: initialIsLiked,
  userId,
  userName,
  onCommentClick,
  onShareClick,
  onMediaClick,
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

      // Send notification on like (not unlike)
      if (result.liked && userName) {
        createNotification({
          userId: post.authorName, // We'd need the actual author userId
          type: "like",
          fromUserName: userName,
          fromUserAvatar: "",
          postId: post.$id,
          postTitle: post.title,
          message: `le dio ❤️ a tu post "${post.title}"`,
        });
      }
    } catch {
      // Revert on error
      setIsLiked(wasLiked);
      setLikesCount(post.likesCount);
    } finally {
      setIsLiking(false);
    }
  }, [userId, isLiked, isLiking, post, userName]);

  const handleDoubleTap = useCallback(() => {
    if (!userId) return;
    if (!isLiked) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, [userId, isLiked, handleLike]);

  const categoryColors: Record<string, string> = {
    promo: "bg-accent/20 text-accent",
    speaker: "bg-primary/20 text-purple-300",
    info: "bg-secondary/20 text-secondary",
    archive: "bg-amber-500/20 text-amber-300",
    "behind-scenes": "bg-emerald-500/20 text-emerald-300",
  };

  const catStyle =
    categoryColors[post.category] || "bg-white/10 text-gray-300";

  const contentTruncated =
    post.content && post.content.length > 120 && !expanded;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary p-[1.5px] shrink-0">
          <div className="w-full h-full rounded-full bg-card-bg overflow-hidden flex items-center justify-center">
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
                {post.authorName?.[0] || "R"}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white truncate">
              {post.authorName || "Radical Camp"}
            </h3>
            {post.pinned && (
              <Pin className="w-3 h-3 text-secondary shrink-0" />
            )}
          </div>
          <p className="text-[10px] text-gray-500">
            {timeAgo(post.publishedAt || post.$createdAt)}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${catStyle}`}
        >
          {post.category}
        </span>
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
                className="w-20 h-20 text-accent drop-shadow-2xl"
                fill="#ff0055"
                strokeWidth={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions Bar ────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={!userId}
              className="group flex items-center gap-1.5 disabled:opacity-40"
            >
              <motion.div
                whileTap={{ scale: 0.7 }}
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked
                      ? "text-accent fill-accent"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
              </motion.div>
              {likesCount > 0 && (
                <span
                  className={`text-xs font-bold ${
                    isLiked ? "text-accent" : "text-gray-400"
                  }`}
                >
                  {formatCount(likesCount)}
                </span>
              )}
            </button>

            {/* Comment */}
            <button
              onClick={() => onCommentClick(post)}
              className="group flex items-center gap-1.5"
            >
              <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              {post.commentsCount > 0 && (
                <span className="text-xs font-bold text-gray-400">
                  {formatCount(post.commentsCount)}
                </span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={() => onShareClick(post)}
              className="group"
            >
              <Share2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Bookmark */}
          <button className="group">
            <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* ── Caption ────────────────────────────────────────── */}
      {(post.title || post.content) && post.mediaType !== "text" && (
        <div className="px-4 pb-3 pt-1">
          <p className="text-sm text-gray-200 leading-relaxed">
            <span className="font-bold text-white mr-1.5">
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
              className="text-xs text-gray-500 mt-0.5 hover:text-gray-300"
            >
              ver más
            </button>
          )}
        </div>
      )}

      {/* ── Comments Preview ───────────────────────────────── */}
      {post.commentsCount > 0 && (
        <button
          onClick={() => onCommentClick(post)}
          className="px-4 pb-3 text-left"
        >
          <p className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Ver los {post.commentsCount} comentarios
          </p>
        </button>
      )}
    </motion.article>
  );
}
