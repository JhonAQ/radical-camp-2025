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
  Camera,
  Sparkles,
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
  Todos: "🔥 Todo",
  promo: "🎫 Promos",
  speaker: "🎤 Speakers",
  info: "ℹ️ Info",
  archive: "📂 Archivo",
  "behind-scenes": "🎬 BTS",
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
  const categoriesRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-card-bg rounded-none border-b border-white/5 overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-white/5" />
        <div className="flex-1">
          <div className="w-28 h-3 rounded bg-white/5 mb-1.5" />
          <div className="w-16 h-2 rounded bg-white/5" />
        </div>
      </div>
      <div className="w-full aspect-[4/5] bg-white/[0.03]" />
      <div className="px-4 py-3 space-y-2">
        <div className="flex gap-4">
          <div className="w-7 h-7 rounded-full bg-white/5" />
          <div className="w-7 h-7 rounded-full bg-white/5" />
          <div className="w-7 h-7 rounded-full bg-white/5" />
        </div>
        <div className="w-20 h-3 rounded bg-white/5" />
        <div className="w-full h-2 rounded bg-white/5" />
        <div className="w-3/4 h-2 rounded bg-white/5" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen -mx-0">
      {/* ── Stories Row ──────────────────────────────────── */}
      <div className="border-b border-white/5">
        <StoriesBar
          onStoryClick={handleStoryClick}
          isLoggedIn={!!user}
        />
      </div>

      {/* ── Category pills (horizontal scroll) ──────────── */}
      <div className="sticky top-14 z-30 bg-dark-bg/95 backdrop-blur-xl border-b border-white/5">
        <div
          ref={categoriesRef}
          className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-white text-black shadow-lg shadow-white/5"
                  : "bg-white/[0.06] text-gray-400 hover:bg-white/10 hover:text-gray-200 active:scale-95"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}

          {/* Refresh pill */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-all flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw
              className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Feed ────────────────────────────────────────── */}
      <div className="divide-y divide-white/[0.04]">
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
            className="text-center py-20 px-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Camera className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Aún no hay publicaciones
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              Las publicaciones del Radical Camp aparecerán aquí. ¡Mantente atento!
            </p>
            {user && (
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sé el primero en interactuar</span>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {posts.map((post, index) => (
              <motion.div
                key={post.$id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <PostCard
                  post={post}
                  isLiked={likedPostIds.has(post.$id)}
                  userId={user?.$id}
                  userName={user?.name}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                  onMediaClick={handleMediaClick}
                  onLikeChange={handleLikeChange}
                />
              </motion.div>
            ))}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="py-6">
                {loadingMore && (
                  <div className="flex justify-center">
                    <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                  </div>
                )}
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-[11px] text-gray-600 font-semibold uppercase tracking-widest">
                  Estás al día
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
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#161616] w-full max-w-md rounded-t-3xl p-6 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center mb-5">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <h3 className="text-lg font-bold text-center mb-6">Compartir</h3>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-90">
                    <Copy size={22} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Copiar</span>
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
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-active:scale-90 transition-transform">
                    <MessageCircle size={22} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">WhatsApp</span>
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
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center group-active:scale-90 transition-transform">
                    <Facebook size={22} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Facebook</span>
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
                  <div className="w-14 h-14 rounded-2xl bg-[#1DA1F2]/15 text-[#1DA1F2] flex items-center justify-center group-active:scale-90 transition-transform">
                    <Twitter size={22} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Twitter</span>
                </button>
              </div>

              <div className="bg-black/40 p-3.5 rounded-xl flex items-center gap-3 border border-white/5">
                <LinkIcon size={14} className="text-gray-600 shrink-0" />
                <p className="text-xs text-gray-400 truncate flex-1 font-mono">
                  {typeof window !== "undefined" ? window.location.href : ""}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-bold text-secondary hover:text-white transition-colors shrink-0"
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
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-white text-black px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 font-semibold text-sm"
          >
            <div className="bg-emerald-500 rounded-full p-0.5">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
