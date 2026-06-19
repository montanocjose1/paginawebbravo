import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShop } from "../context/ShopContext";
import { formatImageUrl } from "../services/catalogService";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeaturedProducts() {
  const { products, loading } = useShop();
  const featured = products.filter(p => p.featured).slice(0, 4);

  // Si no hay productos marcados como destacados, mostrar los primeros 4 activos
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);

  if (loading) {
    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="h-10 bg-dark/5 w-1/3 mb-16 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-dark/5 mb-5" />
              <div className="h-4 bg-dark/10 w-2/3 mb-2" />
              <div className="h-4 bg-dark/10 w-1/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">Colección</p>
          <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight">Productos Destacados</h2>
        </div>
        <Link to="/shop" className="hidden md:inline-flex text-sm font-bold uppercase tracking-widest border-b-2 border-gold pb-1 text-dark hover:text-gold transition-colors">
          Ver Todo
        </Link>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {displayProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;
          return (
            <motion.div key={product.id} variants={cardVariants}>
              <Link to={`/product/${product.id}`} className="group cursor-pointer block relative">
                <div className="aspect-[3/4] overflow-hidden bg-dark/5 mb-5 relative">
                  <img
                    src={formatImageUrl(product.image, 600)}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-dark/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-dark text-off-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-off-white/25">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-dark tracking-wide group-hover:text-gold transition-colors">{product.name}</h3>
                <p className="text-sm text-smoke mt-1 font-medium">${product.price.toFixed(2)}</p>
                
                <button
                  type="button"
                  className="mt-4 w-full py-3 bg-dark text-off-white text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-dark transition-colors"
                >
                  {isOutOfStock ? "Agotado" : "Ver Detalle"}
                </button>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 text-center md:hidden">
        <Link to="/shop" className="inline-flex text-sm font-bold uppercase tracking-widest border-b-2 border-gold pb-1 hover:text-gold transition-colors">
          Ver Todo
        </Link>
      </div>
    </section>
  );
}
