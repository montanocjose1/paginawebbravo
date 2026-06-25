import { createContext, useContext, useReducer, useState, useEffect } from "react";
import { loadConfig, loadProducts, saveConfigToLocal } from "../services/catalogService";

const ShopContext = createContext();

const CART_STORAGE_KEY = "bravostyle_cart";
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Load cart from localStorage
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading cart from storage:", e);
  }
  return { items: [] };
}

const cartReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        newState = {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      } else {
        newState = { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
      }
      break;
    }
    case "REMOVE_FROM_CART":
      newState = { ...state, items: state.items.filter((i) => i.id !== action.id) };
      break;
    case "UPDATE_QTY":
      newState = {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
        ),
      };
      break;
    case "CLEAR_CART":
      newState = { ...state, items: [] };
      break;
    default:
      return state;
  }
  // Persist to localStorage
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    console.error("Error persisting cart:", e);
  }
  return newState;
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({
    sheetId: "",
    driveFolderId: "",
    googleClientId: "",
    whatsappNumber: "573235834122",
    adminPassword: "Bravo19",
    useGoogle: false
  });

  const [cart, dispatch] = useReducer(cartReducer, null, loadCartFromStorage);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentConfig = await loadConfig();
      setConfig(currentConfig);
      const items = await loadProducts(currentConfig);
      setProducts(items);
    } catch (err) {
      console.error("Error al inicializar tienda:", err);
      setError("No se pudieron cargar los productos. Por favor intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-sync: poll Google Sheets every 5 minutes if Google integration is active
  useEffect(() => {
    if (!config.useGoogle || !config.sheetId) return;

    const interval = setInterval(async () => {
      try {
        const items = await loadProducts(config);
        setProducts(items);
        console.log("[BRAVOSTYLE] Auto-sync: catálogo actualizado desde Google Sheets");
      } catch (err) {
        console.warn("[BRAVOSTYLE] Auto-sync falló:", err);
      }
    }, SYNC_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [config]);

  const refreshProducts = async () => {
    await fetchAllData();
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    saveConfigToLocal(newConfig);
    // Recargar productos usando la nueva configuración
    loadProducts(newConfig)
      .then((items) => setProducts(items))
      .catch((err) => console.error("Error recargando productos con nueva config:", err));
  };

  const addToCart = (product) => dispatch({ type: "ADD_TO_CART", product });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", id });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  
  const cartCount = cart.items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        error,
        config,
        refreshProducts,
        updateConfig,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
