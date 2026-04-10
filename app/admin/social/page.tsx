"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Pin,
  Star,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  FileText,
  Layout,
  BookOpen,
  BarChart3,
  Heart,
  MessageCircle,
  Clock,
  Check,
} from "lucide-react";
import {
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  uploadMedia,
  deleteMedia,
  getMediaPreview,
  type Post,
} from "@/lib/social";
import { useAuth } from "@/lib/useAuth";
import { timeAgo } from "@/lib/utils";

type MediaType = "image" | "video" | "gallery" | "text";
type Category = "promo" | "speaker" | "info" | "archive" | "behind-scenes";

const mediaTypes: { value: MediaType; label: string; icon: typeof ImageIcon }[] = [
  { value: "image", label: "Imagen", icon: ImageIcon },
  { value: "video", label: "Video", icon: Video },
  { value: "gallery", label: "Galería", icon: Layout },
  { value: "text", label: "Texto", icon: FileText },
];

const categories: { value: Category; label: string }[] = [
  { value: "promo", label: "Promo" },
  { value: "speaker", label: "Speaker" },
  { value: "info", label: "Info" },
  { value: "archive", label: "Archivo" },
  { value: "behind-scenes", label: "Detrás de cámaras" },
];

interface FormData {
  title: string;
  content: string;
  mediaType: MediaType;
  category: Category;
  featured: boolean;
  pinned: boolean;
  isStory: boolean;
}

const defaultFormData: FormData = {
  title: "",
  content: "",
  mediaType: "image",
  category: "promo",
  featured: false,
  pinned: false,
  isStory: false,
};

export default function AdminSocialPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Load Posts ──────────────────────────────────────────── */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts();
      setPosts(data.posts);
      setTotalPosts(data.total);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ── File Handling ───────────────────────────────────────── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Generate previews
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!formData.title && formData.mediaType !== "text") {
      showToast("El título es requerido");
      return;
    }
    if (formData.mediaType === "text" && !formData.content) {
      showToast("El contenido es requerido para posts de texto");
      return;
    }
    if (
      formData.mediaType !== "text" &&
      files.length === 0 &&
      !editingPost
    ) {
      showToast("Sube al menos un archivo");
      return;
    }

    setSubmitting(true);
    try {
      // Upload files
      const uploadedFileIds: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const fileId = await uploadMedia(file);
          uploadedFileIds.push(fileId);
        }
      }

      if (editingPost) {
        // Update existing post
        const updateData: Partial<Post> = {
          title: formData.title,
          content: formData.content,
          mediaType: formData.mediaType,
          category: formData.category,
          featured: formData.featured,
          pinned: formData.pinned,
          isStory: formData.isStory,
        };
        if (uploadedFileIds.length > 0) {
          updateData.mediaFileIds = [
            ...editingPost.mediaFileIds,
            ...uploadedFileIds,
          ];
        }
        await updatePost(editingPost.$id, updateData);
        showToast("Post actualizado ✓");
      } else {
        // Create new post
        await createPost({
          title: formData.title,
          content: formData.content,
          mediaType: formData.mediaType,
          mediaFileIds: uploadedFileIds,
          category: formData.category,
          featured: formData.featured,
          pinned: formData.pinned,
          isStory: formData.isStory,
          authorName: user?.name || "Radical Camp",
          authorAvatar: "",
        });
        showToast("Post publicado ✓");
      }

      resetForm();
      loadPosts();
    } catch (err) {
      console.error("Submit failed:", err);
      showToast("Error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ──────────────────────────────────────────────── */
  const handleDelete = async (post: Post) => {
    if (!confirm("¿Eliminar este post? Esta acción no se puede deshacer."))
      return;

    setDeletingId(post.$id);
    try {
      // Delete media files
      for (const fid of post.mediaFileIds) {
        try {
          await deleteMedia(fid);
        } catch {}
      }
      await deletePost(post.$id);
      showToast("Post eliminado");
      loadPosts();
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Toggle Status ───────────────────────────────────────── */
  const toggleStatus = async (post: Post) => {
    const newStatus =
      post.status === "published" ? "archived" : "published";
    try {
      await updatePost(post.$id, { status: newStatus } as Partial<Post>);
      setPosts((prev) =>
        prev.map((p) =>
          p.$id === post.$id ? { ...p, status: newStatus } : p
        )
      );
      showToast(
        newStatus === "published" ? "Publicado ✓" : "Archivado ✓"
      );
    } catch {
      showToast("Error al cambiar estado");
    }
  };

  const togglePin = async (post: Post) => {
    try {
      await updatePost(post.$id, { pinned: !post.pinned });
      setPosts((prev) =>
        prev.map((p) =>
          p.$id === post.$id ? { ...p, pinned: !p.pinned } : p
        )
      );
    } catch {}
  };

  const toggleFeatured = async (post: Post) => {
    try {
      await updatePost(post.$id, { featured: !post.featured });
      setPosts((prev) =>
        prev.map((p) =>
          p.$id === post.$id ? { ...p, featured: !p.featured } : p
        )
      );
    } catch {}
  };

  /* ── Edit ────────────────────────────────────────────────── */
  const startEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      mediaType: post.mediaType as MediaType,
      category: post.category as Category,
      featured: post.featured,
      pinned: post.pinned,
      isStory: post.isStory,
    });
    setFiles([]);
    setFilePreviews([]);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData(defaultFormData);
    setFiles([]);
    setFilePreviews([]);
  };

  /* ── Stats ───────────────────────────────────────────────── */
  const totalLikes = posts.reduce((s, p) => s + p.likesCount, 0);
  const totalComments = posts.reduce((s, p) => s + p.commentsCount, 0);
  const publishedCount = posts.filter((p) => p.status === "published").length;

  return (
    <div className="px-4 pb-6 max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            Panel Social
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administra el contenido del Muro Radical
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <Plus size={18} />
          Nuevo Post
        </button>
      </div>

      {/* ── Stats Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Posts", value: totalPosts, icon: BookOpen, color: "text-secondary" },
          { label: "Publicados", value: publishedCount, icon: Eye, color: "text-emerald-400" },
          { label: "Likes", value: totalLikes, icon: Heart, color: "text-accent" },
          { label: "Comentarios", value: totalComments, icon: MessageCircle, color: "text-purple-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="app-card p-4 flex items-center gap-3"
          >
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create/Edit Form ───────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="app-card p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {editingPost ? "Editar Post" : "Nuevo Post"}
                </h2>
                <button onClick={resetForm} className="p-1.5 rounded-full hover:bg-white/5">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                  Tipo de contenido
                </label>
                <div className="flex gap-2">
                  {mediaTypes.map((mt) => (
                    <button
                      key={mt.value}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, mediaType: mt.value }))
                      }
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                        formData.mediaType === mt.value
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-white/10 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      <mt.icon size={20} />
                      <span className="text-[10px] font-bold">{mt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                  placeholder="Título del post..."
                />
              </div>

              {/* Content/Caption */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                  {formData.mediaType === "text" ? "Contenido" : "Descripción"}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={formData.mediaType === "text" ? 5 : 3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary/50 transition-colors resize-none"
                  placeholder={
                    formData.mediaType === "text"
                      ? "Escribe tu mensaje aquí..."
                      : "Descripción del post..."
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                  Categoría
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, category: cat.value }))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        formData.category === cat.value
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload (not for text posts) */}
              {formData.mediaType !== "text" && (
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                    Archivos
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                  >
                    <Upload className="mx-auto w-8 h-8 text-gray-600 group-hover:text-secondary mb-2 transition-colors" />
                    <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      Haz clic o arrastra archivos aquí
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      JPG, PNG, WEBP, MP4, MOV · Max 100MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple={formData.mediaType === "gallery"}
                      onChange={handleFileSelect}
                    />
                  </div>

                  {/* File Previews */}
                  {filePreviews.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                      {filePreviews.map((preview, i) => (
                        <div key={i} className="relative shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5">
                            {files[i]?.type.startsWith("video") ? (
                              <video
                                src={preview}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={preview}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
                          >
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing media (when editing) */}
                  {editingPost && editingPost.mediaFileIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] text-gray-500 mb-2 font-bold">
                        Archivos existentes:
                      </p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {editingPost.mediaFileIds.map((fid) => (
                          <div
                            key={fid}
                            className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/5"
                          >
                            <Image
                              src={getMediaPreview(fid, 200, 200)}
                              alt=""
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Toggles */}
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "featured" as const, label: "Destacado", icon: Star },
                  { key: "pinned" as const, label: "Fijado", icon: Pin },
                  { key: "isStory" as const, label: "Story (24h)", icon: Clock },
                ].map((toggle) => (
                  <button
                    key={toggle.key}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        [toggle.key]: !prev[toggle.key],
                      }))
                    }
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData[toggle.key]
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-white/10 text-gray-500 hover:border-white/20"
                    }`}
                  >
                    <toggle.icon size={14} />
                    {toggle.label}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : editingPost ? (
                    "Actualizar"
                  ) : (
                    "Publicar"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Posts List ──────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="app-card p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="h-2 w-48 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 mb-1">
            Sin publicaciones
          </h3>
          <p className="text-xs text-gray-600">
            Crea tu primer post para el Muro Radical
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <motion.div
              key={post.$id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="app-card overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-white/5 shrink-0 overflow-hidden relative">
                  {post.mediaType === "text" ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  ) : post.mediaFileIds.length > 0 ? (
                    <Image
                      src={getMediaPreview(post.mediaFileIds[0], 200, 200)}
                      alt={post.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  {/* Type badge */}
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-px rounded text-[7px] font-bold bg-black/70 text-white uppercase">
                    {post.mediaType}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white truncate">
                      {post.title || "(Sin título)"}
                    </h3>
                    {post.pinned && (
                      <Pin className="w-3 h-3 text-secondary shrink-0" />
                    )}
                    {post.featured && (
                      <Star
                        className="w-3 h-3 text-amber-400 shrink-0"
                        fill="currentColor"
                      />
                    )}
                    {post.isStory && (
                      <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span
                      className={
                        post.status === "published"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      ● {post.status === "published" ? "Publicado" : "Archivado"}
                    </span>
                    <span>{post.category}</span>
                    <span className="flex items-center gap-0.5">
                      <Heart size={9} /> {post.likesCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle size={9} /> {post.commentsCount}
                    </span>
                    <span>{timeAgo(post.$createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(post)}
                    className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${
                      post.pinned ? "text-secondary" : "text-gray-600"
                    }`}
                    title="Fijar"
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    onClick={() => toggleStatus(post)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-600 transition-colors"
                    title={
                      post.status === "published" ? "Archivar" : "Publicar"
                    }
                  >
                    {post.status === "published" ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(post)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-600 transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={deletingId === post.$id}
                    className="p-2 rounded-lg hover:bg-accent/10 text-gray-600 hover:text-accent transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deletingId === post.$id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Check size={16} className="text-emerald-500" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
