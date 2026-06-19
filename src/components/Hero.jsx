import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/PRODUCTOS/_MS19093.jpg"
          alt="BRAVOSTYLE moda urbana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="text-sm uppercase tracking-[0.3em] text-gold mb-4 font-medium"
        >
          Ropa Urbana Premium
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-off-white leading-[0.9] tracking-tighter"
        >
          Viste con Estilo.
          <br />
          <span className="text-gold">Viste BRAVOSTYLE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
          className="mt-6 max-w-md text-off-white/70 text-sm md:text-base leading-relaxed font-light"
        >
          Esenciales oversize premium diseñados para la confianza, comodidad y presencia en la calle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-4 bg-gold text-dark text-sm font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
          >
            Ver Catálogo
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-off-white text-off-white text-sm font-bold uppercase tracking-widest hover:bg-off-white hover:text-dark transition-colors"
          >
            Nueva Colección
          </Link>
        </motion.div>
      </div>

      {/* Social links at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-6 md:left-10 z-20 flex items-center gap-5"
      >
        <span className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-off-white/50 font-medium">
          Follow
        </span>
        <span className="hidden md:block w-px h-6 bg-off-white/30" />
        <a
          href="https://instagram.com/bravo.style___"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-off-white/60 hover:text-gold transition-all duration-300"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <span className="hidden md:inline text-[11px] tracking-[0.2em] font-medium transition-opacity duration-300 group-hover:opacity-100 opacity-70">
            @BRAVO.STYLE___
          </span>
        </a>
        <span className="w-px h-4 bg-off-white/20" />
        <a
          href="https://www.tiktok.com/@bravo.style___"
          target="_blank"
          rel="noopener noreferrer"
          className="text-off-white/60 hover:text-gold transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.56 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.29 0 .56.05.82.13v-3.5a6.36 6.36 0 0 0-.82-.06A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.25 8.25 0 0 0 4.76 1.51v-3.5a4.83 4.83 0 0 1-1-.04z" />
          </svg>
        </a>
        <span className="w-px h-4 bg-off-white/20" />
        <a
          href="https://wa.me/573000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-off-white/60 hover:text-gold transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 right-6 md:right-10 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-off-white/40 font-medium">Scroll</span>
          <svg className="w-4 h-4 text-off-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
