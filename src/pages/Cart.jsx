import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useShop } from "../context/ShopContext";
import { formatImageUrl } from "../services/catalogService";

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart, config } = useShop();

  const handleWhatsAppCheckout = () => {
    const number = (config.whatsappNumber || "573235834122").replace(/[^0-9]/g, "");
    
    let message = "Hola, quiero comprar estos productos:\n\n";
    
    cart.items.forEach((item, index) => {
      const sizeText = item.selectedSize ? `Talla: ${item.selectedSize}` : "";
      const colorText = item.selectedColor ? `Color: ${item.selectedColor}` : "";
      const details = [sizeText, colorText].filter(Boolean).join(" — ");
      message += `${index + 1}. *${item.name}*\n`;
      if (details) message += `   ${details}\n`;
      message += `   Cantidad: ${item.qty} × $${item.price.toFixed(2)} = $${(item.price * item.qty).toFixed(2)}\n\n`;
    });
    
    message += `*Total: $${cartTotal.toFixed(2)}*`;
    
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (cart.items.length === 0) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-6">Tu Carrito</h1>
          <p className="text-smoke mb-10">Tu carrito está vacío.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-4 bg-dark text-off-white text-sm font-bold uppercase tracking-widest hover:bg-gold hover:text-dark transition-colors"
          >
            Seguir Comprando
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-16">Tu Carrito</h1>

      <div className="flex flex-col gap-6">
        {cart.items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex gap-6 pb-6 border-b border-dark/10"
          >
            <div className="w-24 h-32 bg-dark/5 overflow-hidden shrink-0">
              <img
                src={formatImageUrl(item.image, 200)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-dark">{item.name}</h3>
                {/* Size & Color */}
                <div className="flex gap-3 mt-1">
                  {item.selectedSize && (
                    <span className="text-[10px] uppercase tracking-wider text-smoke font-medium bg-dark/5 px-2 py-0.5">
                      Talla: {item.selectedSize}
                    </span>
                  )}
                  {item.selectedColor && (
                    <span className="text-[10px] uppercase tracking-wider text-smoke font-medium bg-dark/5 px-2 py-0.5">
                      Color: {item.selectedColor}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gold mt-1 font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-dark/20">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-3 py-1 text-sm hover:bg-dark/5 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-medium border-x border-dark/20 min-w-[40px] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-3 py-1 text-sm hover:bg-dark/5 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs uppercase tracking-widest text-smoke hover:text-red-500 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold text-dark shrink-0">
              ${(item.price * item.qty).toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 space-y-6">
        {/* Subtotal and Total */}
        <div className="border-t border-dark/10 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-smoke uppercase tracking-widest font-medium">Subtotal ({cart.items.reduce((s, i) => s + i.qty, 0)} artículos)</span>
            <span className="text-sm font-semibold text-dark">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark uppercase tracking-widest font-bold">Total</span>
            <span className="text-2xl font-black text-dark">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleWhatsAppCheckout}
            className="w-full py-4 bg-[#25D366] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#20ba59] transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Finalizar Pedido por WhatsApp
          </button>
          
          <div className="flex gap-3">
            <Link
              to="/shop"
              className="flex-1 py-3 border border-dark text-dark text-xs font-bold uppercase tracking-widest text-center hover:bg-dark hover:text-off-white transition-all"
            >
              Seguir Comprando
            </Link>
            <button
              onClick={clearCart}
              className="px-6 py-3 border border-red-300 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
            >
              Vaciar
            </button>
          </div>
          
          <p className="text-xs text-smoke/60 text-center mt-1">Compra simple — sin necesidad de registro</p>
        </div>
      </div>
    </main>
  );
}
