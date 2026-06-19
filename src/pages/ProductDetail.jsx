import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatImageUrl, generateWhatsAppLink } from "../services/catalogService";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, config, addToCart } = useShop();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Buscar el producto por ID
  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => String(p.id) === String(id));
      if (found) {
        setProduct(found);
        setActiveImage(found.image);
        
        // Seleccionar automáticamente la primera talla y color disponibles
        const sizes = found.sizes ? found.sizes.split(",").map((s) => s.trim()) : [];
        const colors = found.colors ? found.colors.split(",").map((c) => c.trim()) : [];
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 animate-pulse">
        <div className="flex-1 aspect-[3/4] bg-dark/5" />
        <div className="flex-1 space-y-6">
          <div className="h-4 bg-dark/10 w-1/4" />
          <div className="h-10 bg-dark/10 w-3/4" />
          <div className="h-6 bg-dark/10 w-1/3" />
          <div className="h-32 bg-dark/10 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-24 px-6 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-black text-dark tracking-tight mb-4">Producto no encontrado</h2>
        <p className="text-smoke mb-8">El producto que buscas no existe o fue retirado del catálogo.</p>
        <Link
          to="/shop"
          className="inline-flex px-8 py-3 bg-dark text-off-white text-xs font-bold uppercase tracking-widest"
        >
          Regresar a la Tienda
        </Link>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(",").map((s) => s.trim()) : [];
  const colors = product.colors ? product.colors.split(",").map((c) => c.trim()) : [];
  
  // Analizar la galería de imágenes
  const galleryImages = product.gallery
    ? product.gallery.split(",").map((img) => img.trim()).filter(Boolean)
    : [product.image];

  // Si la galería no incluye la imagen principal, agregarla al inicio
  if (!galleryImages.includes(product.image)) {
    galleryImages.unshift(product.image);
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    // Crear el objeto del producto para el carrito, incluyendo talla y color seleccionados
    const productForCart = {
      ...product,
      // Generar una clave única para el carrito basada en id + talla + color
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      originalId: product.id,
      selectedSize,
      selectedColor,
      price: product.price
    };
    
    addToCart(productForCart);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleWhatsAppContact = () => {
    const link = generateWhatsAppLink(product, selectedSize, selectedColor, config.whatsappNumber);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-wider text-smoke font-medium mb-10 flex gap-2">
        <Link to="/" className="hover:text-dark">Inicio</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-dark">Tienda</Link>
        <span>/</span>
        <span className="text-dark font-semibold">{product.name}</span>
      </nav>

      {/* Grid de detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* GALERÍA DE IMÁGENES (Columna izquierda: 7 de 12 cols en desktop) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          
          {/* Imagen Principal */}
          <div className="flex-1 aspect-[3/4] bg-dark/5 overflow-hidden relative">
            <img
              src={formatImageUrl(activeImage, 1000)}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-dark/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-dark text-off-white text-xs font-bold uppercase tracking-widest px-6 py-3 border border-off-white/20">
                  Agotado
                </span>
              </div>
            )}
          </div>

          {/* Miniaturas ( thumbnails ) */}
          {galleryImages.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:w-24 shrink-0 pb-2 md:pb-0">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] w-20 md:w-full bg-dark/5 overflow-hidden border transition-all ${
                    activeImage === img ? "border-dark scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={formatImageUrl(img, 200)}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFORMACIÓN DEL PRODUCTO (Columna derecha: 5 de 12 cols en desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          
          {/* Categoría y Código */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-smoke font-bold">
              {product.category}
            </span>
            {product.code && (
              <span className="text-[10px] bg-dark/5 px-2.5 py-1 text-dark/70 font-mono">
                REF: {product.code}
              </span>
            )}
          </div>

          {/* Nombre y Precio */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-dark tracking-tight leading-none mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-black text-dark tracking-wide mb-8">
            ${product.price.toFixed(2)} USD
          </p>

          <hr className="border-dark/5 mb-8" />

          {/* Descripción */}
          <div className="prose prose-sm max-w-none text-dark/70 leading-relaxed font-light mb-8">
            <p>{product.description || "Sin descripción disponible."}</p>
          </div>

          {/* Selector de Tallas */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-dark">
                  Talla: <span className="font-light text-smoke ml-1">{selectedSize}</span>
                </h4>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-smoke hover:text-dark border-b border-dashed border-smoke"
                >
                  Guía de Tallas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 border text-xs font-bold transition-all flex items-center justify-center px-3 ${
                      selectedSize === size
                        ? "bg-dark border-dark text-off-white"
                        : "border-dark/10 hover:border-dark/30 text-dark"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Colores */}
          {colors.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-dark mb-3">
                Color: <span className="font-light text-smoke ml-1">{selectedColor}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2.5 border text-xs font-medium uppercase tracking-wider transition-all ${
                      selectedColor === color
                        ? "bg-dark border-dark text-off-white"
                        : "border-dark/10 hover:border-dark/30 text-dark"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Control de Stock / Disponibilidad */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-dark">Disponibilidad:</span>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Agotado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Disponible ({product.stock} u.)
              </span>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="space-y-4">
            {/* Agregar al Carrito */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                isOutOfStock
                  ? "bg-dark/10 text-dark/30 cursor-not-allowed"
                  : addedFeedback
                  ? "bg-green-600 text-off-white"
                  : "bg-dark text-off-white hover:bg-dark/80"
              }`}
            >
              {isOutOfStock ? "Producto Agotado" : addedFeedback ? "¡Agregado al Carrito!" : "Agregar al Carrito"}
            </button>

            {/* Comprar por WhatsApp (Botón de contacto directo) */}
            <button
              onClick={handleWhatsAppContact}
              className="w-full py-4 bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </button>
          </div>

          {/* Botón regresar */}
          <Link
            to="/shop"
            className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-smoke hover:text-dark transition-colors border-b border-dark/10 pb-1 self-center"
          >
            ← Volver al Catálogo
          </Link>
        </div>
      </div>

      {/* MODAL DE GUÍA DE TALLAS */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setShowSizeModal(false)} />
          <div className="relative bg-off-white w-full max-w-lg p-8 shadow-2xl z-10 border border-dark/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-dark">Guía de Tallas</h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-lg font-bold text-dark w-8 h-8 flex items-center justify-center border border-dark/10 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark/20 text-dark uppercase tracking-wider font-bold">
                    <th className="py-3 pr-4">Talla</th>
                    <th className="py-3 px-4">Pecho (cm)</th>
                    <th className="py-3 px-4">Largo (cm)</th>
                    <th className="py-3 pl-4">Manga (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-dark/70 font-light">
                  <tr className="border-b border-dark/5">
                    <td className="py-3 pr-4 font-bold text-dark">S</td>
                    <td className="py-3 px-4">58</td>
                    <td className="py-3 px-4">70</td>
                    <td className="py-3 pl-4">22</td>
                  </tr>
                  <tr className="border-b border-dark/5">
                    <td className="py-3 pr-4 font-bold text-dark">M</td>
                    <td className="py-3 px-4">61</td>
                    <td className="py-3 px-4">72</td>
                    <td className="py-3 pl-4">23</td>
                  </tr>
                  <tr className="border-b border-dark/5">
                    <td className="py-3 pr-4 font-bold text-dark">L</td>
                    <td className="py-3 px-4">64</td>
                    <td className="py-3 px-4">74</td>
                    <td className="py-3 pl-4">24</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-dark">XL</td>
                    <td className="py-3 px-4">67</td>
                    <td className="py-3 px-4">76</td>
                    <td className="py-3 pl-4">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-[10px] text-smoke leading-relaxed mt-6 font-medium">
              *Nota: Nuestras prendas tienen un corte Oversize Boxy Fit intencional. Si prefieres un ajuste más entallado, te recomendamos seleccionar una talla menos.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
