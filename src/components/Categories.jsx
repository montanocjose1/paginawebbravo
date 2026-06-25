import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Suéteres", image: "/PRODUCTOS/OVERSI ROJO.jpeg", slug: "sueteres" },
  { name: "Camisetas", image: "/PRODUCTOS/LOS ANGELES.jpeg", slug: "camisetas" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Categories() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-smoke font-medium mb-3">Colecciones</p>
        <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight">Compra por Categoría</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8"
      >
        {categories.map((cat, i) => {
          // Asymmetrical layout classes
          let colSpanClass = "lg:col-span-2";
          let aspectClass = "aspect-[4/3] sm:aspect-square lg:aspect-[3/4]";
          
          if (i === 0) {
            colSpanClass = "sm:col-span-2 lg:col-span-3";
            aspectClass = "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]";
          } else if (i === 1) {
            colSpanClass = "sm:col-span-2 lg:col-span-3";
            aspectClass = "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]";
          }

          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`${colSpanClass} group`}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="relative block w-full h-full overflow-hidden"
              >
                <div className={`${aspectClass} w-full overflow-hidden bg-dark/5`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-[0.16, 1, 0.3, 1]"
                  />
                  <div className="absolute inset-0 bg-dark/25 group-hover:bg-dark/15 transition-colors duration-500" />
                </div>
                
                {/* Gold thin border details on hover */}
                <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-3xl font-black text-off-white tracking-tight flex items-center gap-2 group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                    <span className="text-base font-light opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
