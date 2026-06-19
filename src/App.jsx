import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import WhatsAppFloat from "./components/WhatsAppFloat";
import useTheme from "./hooks/useTheme";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <ShopProvider>
      {!loadingComplete && <Loader onComplete={() => setLoadingComplete(true)} />}
      <div className="min-h-screen flex flex-col bg-off-white text-dark transition-colors duration-500">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    </ShopProvider>
  );
}

