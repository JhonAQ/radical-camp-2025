"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth");
      } else if (!isAdmin) {
        setChecked(true);
      } else {
        setChecked(true);
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !checked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Acceso denegado</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Necesitas ser parte del equipo de administradores para acceder a este
          panel.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
