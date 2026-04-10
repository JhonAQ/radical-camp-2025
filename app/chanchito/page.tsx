"use client";

import { useAuth } from "@/lib/useAuth";
import AdminChanchito from "./AdminChanchito";
import UserChanchito from "./UserChanchito";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ChanchitoGateway() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-400 font-bold">Cargando chanchito...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="app-card p-8 w-full max-w-sm border-white/5 bg-dark-bg/80">
          <p className="text-5xl mb-4">🐷</p>
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-title)" }}>¡Inicia Sesión!</h2>
          <p className="text-sm text-gray-500 mb-6">Regístrate o inicia sesión para arrancar tu chanchito hacia el campamento.</p>
        </motion.div>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminChanchito />;
  }

  return <UserChanchito user={user} />;
}
