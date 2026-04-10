"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  MessageCircle,
  Facebook,
  Twitter,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";
import StoriesBar from "./components/StoriesBar";
import PostCard from "./components/PostCard";
import CommentsSheet from "./components/CommentsSheet";
import FullscreenViewer from "./components/FullscreenViewer";
import {
  getPosts,
  getUserLikedPostIds,
  type Post,
} from "@/lib/social";
import { useAuth } from "@/lib/useAuth";

const categories = ["Todos", "promo", "speaker", "info", "archive", "behind-scenes"];
const categoryLabels: Record<string, string> = {
  Todos: "Todos",
  promo: "Promos",
  speaker: "Speakers",
  info: "Info",
  archive: "Archivo",
  "behind-scenes": "Detrás de cámaras",
};

export default function SocialPage() {
  const { user } = useAuth();

  // Feed state
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastCursor, setLastCursor] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<Post[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsPost, setCommentsPost] = useState<Post | null>(null);

  // Share modal
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePost, setSharePost] = useState<Post | null>(null);

  // Toast
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  /* ── Load Posts ──────────────────────────────────────────── */
  const loadPosts = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true);
        setLastCursor(undefined);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const cursor = reset ? undefined : lastCursor;
        const data = await getPosts(
          selectedCategory === "Todos" ? undefined : selectedCategory,
          cursor
        );

        const newPosts = reset ? data.posts : [...posts, ...data.posts];
        setPosts(newPosts);
        setHasMore(data.hasMore);
        setLastCursor(data.lastId);

        // Load like states
        if (user) {
          const postIds = data.posts.map((p) => p.$id);
          const liked = await getUserLikedPostIds(user.$id, postIds);
          setLikedPostIds((prev) => {
            const next = reset ? liked : new Set([...prev, ...liked]);
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [selectedCategory, lastCursor, posts, user]
  );

  // Initial load + category change
  useEffect(() => {
    loadPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, user?.$id]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPosts(false);
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadPosts]);

  /* ── Handlers ───────────────────────────────────────────── */
  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(true);
  };

  const handleCommentClick = (post: Post) => {
    setCommentsPost(post);
    setCommentsOpen(true);
  };

  const handleShareClick = async (post: Post) => {
    const shareData: ShareData = {
      title: post.title || "Radical Camp",
      text: `${post.content || post.title}\n\nMira esto en: ${window.location.href}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("no share api");
      }
    } catch {
      setSharePost(post);
      setShareOpen(true);
    }
  };

  const handleMediaClick = (post: Post) => {
    if (post.mediaType === "text") return;
    const idx = posts.findIndex((p) => p.$id === post.$id);
    const viewable = posts.filter((p) => p.mediaType !== "text");
    const viewIdx = viewable.findIndex((p) => p.$id === post.$id);
    setViewerItems(viewable);
    setViewerInitialIndex(Math.max(0, viewIdx));
    setViewerOpen(true);
  };

  const handleStoryClick = (story: Post, index: number) => {
    setViewerItems([story]);
    setViewerInitialIndex(0);
    setViewerOpen(true);
  };

  const handleLikeChange = (postId: string, liked: boolean, count: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.$id === postId ? { ...p, likesCount: count } : p
      )
    );
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(postId);
      else next.delete(postId);
      return next;
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado");
      setShareOpen(false);
    } catch {
      showToast("Error al copiar");
    }
  };

  /* ── Skeleton ───────────────────────────────────────────── */
  const PostSkeleton = () => (
    <div className="bg-card-bg rounded-2xl border border-white/5 overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-white/5" />
        <div className="flex-1">
          <div className="w-24 h-3 rounded bg-white/5 mb-1.5" />
          <div className="w-16 h-2 rounded bg-white/5" />
        </div>
      </div>
      <div className="w-full aspect-square bg-white/5" />
      <div className="px-4 py-3 space-y-2">
        <div className="w-32 h-3 rounded bg-white/5" />
        <div className="w-full h-2 rounded bg-white/5" />
      </div>
    </div>
  );

  return (
    <div className="pb-4">
      {/* ── Stories ──────────────────────────────────────── */}
      <StoriesBar
        onStoryClick={handleStoryClick}
        isLoggedIn={!!user}
      />

      {/* ── Category Tabs ───────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide px-5 sticky top-14 z-30 pt-2 bg-gradient-to-b from-dark-bg via-dark-bg/95 to-transparent backdrop-blur-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                : "bg-transparent text-gray-400 border-white/10 active:border-white/30 active:text-white hover:border-white/20"
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* ── Refresh Button ──────────────────────────────── */}
      <div className="flex justify-center py-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Actualizar
        </button>
      </div>

      {/* ── Feed ────────────────────────────────────────── */}
      <div className="px-4 space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📷</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Aún no hay publicaciones
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Las publicaciones del Radical Camp aparecerán aquí
            </p>
          </motion.div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.$id}
                post={post}
                isLiked={likedPostIds.has(post.$id)}
                userId={user?.$id}
                userName={user?.name}
                onCommentClick={handleCommentClick}
                onShareClick={handleShareClick}
                onMediaClick={handleMediaClick}
              />
            ))}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="py-4">
                {loadingMore && (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                  </div>
                )}
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 border-t border-white/5">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                  ··· fin del muro ···
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Comments Sheet ──────────────────────────────── */}
      <CommentsSheet
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={commentsPost?.$id || ""}
        postTitle={commentsPost?.title || ""}
        commentsCount={commentsPost?.commentsCount || 0}
        userId={user?.$id}
        userName={user?.name}
      />

      {/* ── Fullscreen Viewer ───────────────────────────── */}
      <FullscreenViewer
        isOpen={viewerOpen}
        items={viewerItems}
        initialIndex={viewerInitialIndex}
        likedPostIds={likedPostIds}
        userId={user?.$id}
        onClose={() => setViewerOpen(false)}
        onCommentClick={(post) => {
          setCommentsPost(post);
          setCommentsOpen(true);
        }}
        onShareClick={handleShareClick}
        onLikeChange={handleLikeChange}
      />

      {/* ── Share Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-[#1a1a1a] w-full max-w-md rounded-3xl p-6 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Compartir</h3>
                <button
                  onClick={() => setShareOpen(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Copy size={24} />
                  </div>
                  <span className="text-xs text-gray-400">Copiar</span>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        (sharePost?.title || "Muro Radical") +
                          " " +
                          window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-xs text-gray-400">WhatsApp</span>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center">
                    <Facebook size={24} />
                  </div>
                  <span className="text-xs text-gray-400">Facebook</span>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        sharePost?.title || "Muro Radical"
                      )}&url=${encodeURIComponent(window.location.href)}`,
                      "_blank"
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] flex items-center justify-center">
                    <Twitter size={24} />
                  </div>
                  <span className="text-xs text-gray-400">Twitter</span>
                </button>
              </div>
              <div className="bg-black/30 p-4 rounded-xl flex items-center gap-3 border border-white/5">
                <LinkIcon size={16} className="text-gray-500 shrink-0" />
                <p className="text-sm text-gray-400 truncate flex-1">
                  {typeof window !== "undefined" ? window.location.href : ""}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-bold text-secondary hover:text-white transition-colors"
                >
                  Copiar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────────── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
