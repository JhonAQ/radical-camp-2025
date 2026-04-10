@
import fs from "fs";
const path = "./app/chanchito/UserChanchito.tsx";
let code = fs.readFileSync(path, "utf-8");

// Remove export default function ChanchitoPage() and everything after it
const splitIdx = code.indexOf("export default function ChanchitoPage(");
code = code.substring(0, splitIdx);

const newComponent = `
import { getUserWallet, getTransactions, Transaction, Wallet } from "@/lib/chanchito";
import { Loader2 } from "lucide-react";

export default function UserChanchito({ user }: { user: any }) {
  const [data, setData] = useState<{ meta: number; abonos: Transaction[] }>({ meta: 190, abonos: [] });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const [wobble, setWobble] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const w = await getUserWallet(user.$id, user.name);
        const tx = await getTransactions(user.$id);
        const total = tx.reduce((sum, a) => sum + a.amount, 0);

        setWallet(w);
        setData({ meta: 190, abonos: tx });
        
        if (total >= 190) {
           setShowConfetti(true);
           setTimeout(() => setShowConfetti(false), 3000);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (user?.$id) load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const total = data.abonos.reduce((sum, a) => sum + a.amount, 0);
  const percent = Math.min((total / data.meta) * 100, 100);
  const remaining = Math.max(data.meta - total, 0);

  const firstAbono = data.abonos.length > 0 ? data.abonos[data.abonos.length - 1] : null;
  const daysSaving = firstAbono
    ? Math.ceil((Date.now() - new Date(firstAbono.$createdAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="px-5 pb-20 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <PiggyBankSVG percent={percent} wobble={wobble} />

        <div className="mt-2">
          <CircularProgress percent={percent} />
        </div>

        <div className="text-center mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-gray-500 font-bold">S/</span>
            <motion.span
              key={total}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-black text-white tabular-nums"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {total.toFixed(0)}
            </motion.span>
            <span className="text-lg text-gray-600 font-bold">/ {data.meta}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            {getQuote(percent)}
          </p>
        </div>
      </motion.section>

      <section className="grid grid-cols-3 gap-3">
        <div className="app-card p-3 text-center">
          <Target className="w-4 h-4 mx-auto text-primary mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            S/ {remaining.toFixed(0)}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Falta</p>
        </div>
        <div className="app-card p-3 text-center">
          <History className="w-4 h-4 mx-auto text-secondary mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            {data.abonos.length}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Abonos</p>
        </div>
        <div className="app-card p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-400 mb-1.5" />
          <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-title)" }}>
            {daysSaving}
          </p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Días</p>
        </div>
      </section>

      <section>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h2
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Historial
          </h2>
          <span className="text-xs text-secondary font-bold">
            {showHistory ? "Ocultar" : "Ver todo"}
          </span>
        </button>

        <div className="space-y-2">
          {(showHistory ? data.abonos : data.abonos.slice(0, 3)).map((abono) => (
            <motion.div
              key={abono.$id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="app-card p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{abono.note}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(abono.$createdAt).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400">
                +S/ {abono.amount}
              </span>
            </motion.div>
          ))}

          {data.abonos.length === 0 && (
            <div className="app-card p-6 text-center">
              <p className="text-gray-500 text-sm">Aún no tienes abonos</p>
              <p className="text-gray-600 text-xs mt-1">
                Los admins podrán sumarte puntos pronto.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#6200ea", "#00d4ff", "#ff0055", "#fbbf24", "#34d399"][i % 5],
                  left: \`\${20 + Math.random() * 60}%\`,
                  top: "30%",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: [0, 200 + Math.random() * 200],
                  x: [-30 + Math.random() * 60],
                  opacity: [1, 0],
                  rotate: [0, 360 + Math.random() * 360],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-black/80 backdrop-blur-xl border border-secondary/30 rounded-3xl p-8 text-center shadow-2xl"
            >
              <p className="text-5xl mb-3">🎉</p>
              <h3
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "var(--font-title)" }}
              >
                ¡META CUMPLIDA!
              </h3>
              <p className="text-secondary text-sm font-bold">
                Nos vemos en el campamento
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync(path, code + newComponent, "utf-8");
console.log("Patched UserChanchito.tsx");
@
