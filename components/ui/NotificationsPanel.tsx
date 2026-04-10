"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  Megaphone,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/lib/notifications";
import { useAuth } from "@/lib/useAuth";
import { timeAgo } from "@/lib/utils";

export default function NotificationsPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Poll unread count
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      const count = await getUnreadCount(user.$id);
      setUnreadCount(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30_000); // every 30s
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNotifications(user.$id);
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) loadNotifications();
  };

  const handleMarkRead = async (notif: Notification) => {
    if (notif.read) return;
    try {
      await markAsRead(notif.$id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.$id === notif.$id ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await markAllAsRead(user.$id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-accent fill-accent" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-secondary" />;
      case "new_post":
        return <Megaphone className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent rounded-full flex items-center justify-center"
          >
            <span className="text-[10px] font-black text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </motion.span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="absolute right-0 top-12 w-80 max-h-[70vh] bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-secondary hover:text-white transition-colors"
                  >
                    <CheckCheck size={12} />
                    Marcar todo
                  </button>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                  </div>
                ) : !user ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      <a
                        href="/auth"
                        className="text-secondary font-bold hover:underline"
                      >
                        Inicia sesión
                      </a>{" "}
                      para ver notificaciones
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      Sin notificaciones por ahora
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.$id}
                      onClick={() => handleMarkRead(notif)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/3 ${
                        !notif.read ? "bg-secondary/5" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-200 leading-relaxed">
                          <span className="font-bold text-white">
                            {notif.fromUserName}
                          </span>{" "}
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5">
                          {timeAgo(notif.$createdAt)}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
