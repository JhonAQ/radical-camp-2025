"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Tent, PiggyBank, Image as ImageIcon, User } from "lucide-react";

const tabs = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Camp", href: "/camp", icon: Tent },
  { name: "Chanchito", href: "/chanchito", icon: PiggyBank, center: true },
  { name: "Social", href: "/social", icon: ImageIcon },
  { name: "Perfil", href: "/perfil", icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  // Don't show on registro page (fullscreen flow)
  if (pathname === "/registro") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade above nav */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <div
        className="relative backdrop-blur-2xl border-t border-white/8 bg-black/85"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-end justify-around px-2 h-[68px]">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            if (tab.center) {
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="flex flex-col items-center justify-center -mt-4 relative"
                >
                  {/* Glow ring */}
                  {isActive && (
                    <motion.div
                      layoutId="center-glow"
                      className="absolute -inset-2 rounded-full bg-secondary/20 blur-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-secondary to-primary shadow-secondary/30"
                        : "bg-surface-light border border-white/10"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] font-bold mt-1 transition-colors ${
                      isActive ? "text-secondary" : "text-gray-600"
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex flex-col items-center justify-center py-2 px-3 relative min-w-[60px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-secondary shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.85 }}>
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      isActive ? "text-secondary" : "text-gray-500"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
