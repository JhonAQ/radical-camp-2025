"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Loader2 } from "lucide-react";
import { getComments, addComment, deleteComment, type Comment } from "@/lib/social";
import { createNotification } from "@/lib/notifications";
import { timeAgo } from "@/lib/utils";

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  commentsCount: number;
  userId?: string;
  userName?: string;
}

export default function CommentsSheet({
  isOpen,
  onClose,
  postId,
  postTitle,
  commentsCount,
  userId,
  userName,
}: CommentsSheetProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const data = await getComments(postId);
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen, loadComments]);

  const handleSend = async () => {
    if (!newComment.trim() || !userId || !userName || sending) return;
    setSending(true);

    const commentText = newComment.trim();
    setNewComment("");

    try {
      const comment = await addComment(
        postId,
        userId,
        userName,
        "",
        commentText
      );
      setComments((prev) => [comment, ...prev]);

      // Create notification
      createNotification({
        userId: "", // We'd need the post author user ID
        type: "comment",
        fromUserName: userName,
        fromUserAvatar: "",
        postId,
        postTitle,
        message: `comentó: "${commentText.slice(0, 50)}${commentText.length > 50 ? "..." : ""}"`,
      });

      // Scroll to top to see new comment
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to send comment:", err);
      setNewComment(commentText); // restore on error
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId, postId);
      setComments((prev) => prev.filter((c) => c.$id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[75] bg-[#0e0e14] border-t border-white/10 rounded-t-3xl max-h-[75vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white">
                Comentarios{" "}
                <span className="text-gray-500 font-normal text-sm">
                  {commentsCount}
                </span>
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Comments List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-5 py-3 space-y-4 scrollbar-hide"
            >
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm mb-1">Sin comentarios</p>
                  <p className="text-gray-600 text-xs">
                    Sé el primero en comentar
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.$id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 group"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gray-300">
                        {comment.userName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-bold text-white mr-1.5">
                          {comment.userName}
                        </span>
                        <span className="text-gray-300">
                          {comment.content}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-600">
                          {timeAgo(comment.$createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete own comment */}
                    {comment.userId === userId && (
                      <button
                        onClick={() => handleDelete(comment.$id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 transition-all self-start"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            {userId ? (
              <div className="px-4 py-3 border-t border-white/5 safe-bottom">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-300">
                      {userName?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Escribe un comentario..."
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-secondary/50 transition-colors pr-12"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newComment.trim() || sending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-secondary disabled:text-gray-700 disabled:scale-95 transition-all hover:bg-secondary/10"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 border-t border-white/5 text-center safe-bottom">
                <p className="text-sm text-gray-500">
                  <a href="/auth" className="text-secondary font-bold hover:underline">
                    Inicia sesión
                  </a>{" "}
                  para comentar
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
