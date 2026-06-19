import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-off-white leading-none select-none pointer-events-none">
          404
        </div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          className="text-gold text-xs uppercase tracking-[0.4em] font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Error 404
        </motion.p>

        <motion.h1
          className="text-7xl md:text-9xl font-black text-off-white tracking-tighter leading-none mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          OOPS
        </motion.h1>

        <motion.p
          className="text-off-white/50 text-sm md:text-base font-light leading-relaxed mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          La página que buscas no existe o fue movida. Pero no te preocupes, nuestra colección sigue esperándote.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-10 py-4 bg-gold text-dark text-sm font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-off-white/30 text-off-white text-sm font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"
          >
            Ver Catálogo
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
