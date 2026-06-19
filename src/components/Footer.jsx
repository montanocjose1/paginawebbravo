import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-off-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              BRAVO<span className="text-gold">STYLE</span>
            </Link>
            <p className="mt-4 text-sm text-off-white/40 font-light leading-relaxed">
              Ropa urbana premium diseñada para el guardarropa moderno. Estilo, confianza y presencia.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com/bravo.style___" target="_blank" rel="noopener noreferrer" className="text-off-white/40 hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@bravo.style___" target="_blank" rel="noopener noreferrer" className="text-off-white/40 hover:text-gold transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.56 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.29 0 .56.05.82.13v-3.5a6.36 6.36 0 0 0-.82-.06A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.25 8.25 0 0 0 4.76 1.51v-3.5a4.83 4.83 0 0 1-1-.04z" />
                </svg>
              </a>
              <a href="https://facebook.com/bravostyle" target="_blank" rel="noopener noreferrer" className="text-off-white/40 hover:text-gold transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="text-off-white/40 hover:text-gold transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
              <a href="mailto:contacto@bravostyle.com" className="text-off-white/40 hover:text-gold transition-colors" aria-label="Email">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-gold/70">Tienda</h4>
            <div className="flex flex-col gap-3">
              <Link to="/shop?category=camisetas-oversize" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Camisetas Oversize</Link>
              <Link to="/shop?category=hoodies" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Hoodies</Link>
              <Link to="/shop?category=esenciales" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Esenciales</Link>
              <Link to="/shop?category=nueva-coleccion" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Nueva Colección</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-gold/70">Info</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Envíos</a>
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Devoluciones</a>
              <a href="#contacto" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Contacto</a>
              <Link to="/admin" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Panel Admin</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-gold/70">Soporte</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Guía de Tallas</a>
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">FAQs</a>
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Rastrear Pedido</a>
              <a href="#" className="text-sm text-off-white/40 hover:text-off-white transition-colors">Privacidad</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-off-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-off-white/30 font-light">
            &copy; 2026 BRAVOSTYLE. Todos los derechos reservados.
          </p>
          <p className="text-xs text-off-white/30 font-light tracking-wider uppercase">
            Ropa Urbana Premium.
          </p>
        </div>
      </div>
    </footer>
  );
}
