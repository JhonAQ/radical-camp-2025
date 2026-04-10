"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import NotificationsPanel from "@/components/ui/NotificationsPanel";

const pageTitles: Record<string, string> = {
  "/": "Radical Camp",
  "/camp": "El Camp",
  "/chanchito": "Mi Chanchito",
  "/social": "Muro Radical",
  "/perfil": "Mi Perfil",
  "/admin/social": "Admin Panel",
};

export default function AppTopBar() {
  const pathname = usePathname();

  // Don't show on registro page
  if (pathname === "/registro") return null;

  const title = pageTitles[pathname] || "Radical Camp";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-black/70 border-b border-white/5"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/RADICAL-white.png"
            alt="Radical Camp"
            width={90}
            height={30}
            className="h-6 w-auto object-contain opacity-90"
          />
        </Link>

        {/* Center Title */}
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-gray-400 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {title}
        </motion.h1>

        {/* Actions — Notifications */}
        <NotificationsPanel />
      </div>
    </header>
  );
}
