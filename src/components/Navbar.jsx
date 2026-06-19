import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "../context/ShopContext";

export default function Navbar({ isDark, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useShop();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Track scroll position for navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const navBg = isHome && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-off-white/90 backdrop-blur-md border-dark/5";
  const textColor = isHome && !scrolled ? "text-off-white" : "text-dark";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${textColor}`}>
          BRAVO<span className="text-gold">STYLE</span>
        </Link>

        {/* Desktop nav */}
        <div className={`hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-widest ${textColor}`}>
          <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
          <Link to="/shop" className="hover:text-gold transition-colors">Tienda</Link>
          <Link to="/cart" className="relative hover:text-gold transition-colors">
            Carrito
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-5 text-[10px] bg-gold text-dark w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 hover:bg-dark/10 ${textColor}`}
            aria-label={isDark ? "Modo claro" : "Modo oscuro"}
            id="theme-toggle"
          >
            {isDark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-3">
          {/* Theme toggle mobile */}
          <button
            onClick={toggleTheme}
            className={`p-2 ${textColor}`}
            aria-label={isDark ? "Modo claro" : "Modo oscuro"}
          >
            {isDark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>

          {/* Cart indicator mobile */}
          <Link to="/cart" className={`relative ${textColor}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-gold text-dark w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5"
            aria-label="Abrir menú"
          >
            <span className={`block w-6 h-[2px] transition-transform ${isHome && !scrolled ? "bg-off-white" : "bg-dark"} ${open ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`block w-6 h-[2px] transition-opacity ${isHome && !scrolled ? "bg-off-white" : "bg-dark"} ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[2px] transition-transform ${isHome && !scrolled ? "bg-off-white" : "bg-dark"} ${open ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-off-white overflow-hidden border-t border-dark/5"
          >
            <div className="px-6 pb-6 pt-4 flex flex-col gap-4 text-sm font-medium uppercase tracking-widest">
              <Link to="/" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">Inicio</Link>
              <Link to="/shop" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">Tienda</Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">
                Carrito {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
