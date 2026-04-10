"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallModal() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait a moment before showing to not interrupt immediate paint
      setTimeout(() => setShowModal(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }

    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-50 p-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl shadow-black/50"
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-xl flex-shrink-0">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">Instalar App</h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                Agrega Radical Camp a tu pantalla de inicio para acceso rápido,
                modo desconectado y notificaciones.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full mt-3 bg-primary text-white font-bold py-2 rounded-xl text-sm transition-transform active:scale-95"
          >
            Instalar Ahora
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
