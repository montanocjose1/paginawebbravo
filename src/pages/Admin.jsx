import { useState, useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";
import { formatImageUrl, saveProductsToLocal } from "../services/catalogService";
import {
  loadGsiScript,
  authenticateGoogle,
  saveProductToGoogle,
  uploadImageToDrive,
  getStoredGoogleToken,
  clearStoredGoogleToken
} from "../services/googleService";

export default function Admin() {
  const { products, config, updateConfig, refreshProducts, loading } = useShop();
  
  // Estados de Autenticación Local
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Estados del Dashboard
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estado para la conexión de Google
  const [googleToken, setGoogleToken] = useState(() => getStoredGoogleToken() || "");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);

  // Estados para Crear / Editar Producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState("main"); // "main" o "gallery"
  
  // Datos del Formulario de Producto
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSizes, setFormSizes] = useState("S,M,L,XL");
  const [formColors, setFormColors] = useState("Negro,Blanco");
  const [formImage, setFormImage] = useState("");
  const [formGallery, setFormGallery] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);

  // Datos del Formulario de Configuración
  const [cfgSheetId, setCfgSheetId] = useState("");
  const [cfgDriveFolderId, setCfgDriveFolderId] = useState("");
  const [cfgClientId, setCfgClientId] = useState("");
  const [cfgWhatsapp, setCfgWhatsapp] = useState("");
  const [cfgPassword, setCfgPassword] = useState("");
  const [cfgUseGoogle, setCfgUseGoogle] = useState(false);

  // Archivos de subida
  const fileInputRef = useRef(null);

  // Verificar si ya está autenticado en la sesión actual
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("bravostyle_admin_authenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Cargar Google GSI
  useEffect(() => {
    loadGsiScript().then((success) => {
      setGsiLoaded(success);
    });
  }, []);

  // Sincronizar campos de configuración
  useEffect(() => {
    if (config) {
      setCfgSheetId(config.sheetId || "");
      setCfgDriveFolderId(config.driveFolderId || "");
      setCfgClientId(config.googleClientId || "");
      setCfgWhatsapp(config.whatsappNumber || "573235834122");
      setCfgPassword(config.adminPassword || "admin123");
      setCfgUseGoogle(config.useGoogle || false);
    }
  }, [config]);

  // Manejar Login Local
  const handleLocalLogin = (e) => {
    e.preventDefault();
    if (passwordInput === config.adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("bravostyle_admin_authenticated", "true");
      setPasswordError("");
    } else {
      setPasswordError("Contraseña incorrecta. Intente de nuevo.");
    }
  };

  // Manejar Cierre de Sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("bravostyle_admin_authenticated");
    setGoogleToken("");
    clearStoredGoogleToken();
  };

  // Autenticar o Desconectar Google OAuth
  const handleConnectGoogle = async () => {
    if (googleToken) {
      if (confirm("¿Está seguro de que desea desconectar su cuenta de Google?")) {
        setGoogleToken("");
        clearStoredGoogleToken();
        alert("Cuenta de Google desconectada.");
      }
      return;
    }

    if (!cfgClientId) {
      alert("Por favor configure e ingrese primero su Google Client ID.");
      return;
    }
    setGoogleLoading(true);
    try {
      const token = await authenticateGoogle(cfgClientId, true); // forceConsent = true when manually connecting
      setGoogleToken(token);
      alert("¡Autenticación con Google exitosa! Ahora puede subir imágenes y editar datos.");
    } catch (error) {
      console.error("Error OAuth Google:", error);
      alert("Fallo al conectar con Google. Revise la consola del navegador.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Asegura que tengamos un token válido, de lo contrario pide autenticación bajo un click gesture
  const ensureValidToken = async () => {
    if (!window.google || !window.google.accounts) {
      const success = await loadGsiScript();
      if (!success) {
        throw new Error("No se pudo cargar la librería de autenticación de Google GSI.");
      }
    }

    const token = getStoredGoogleToken();
    if (token) {
      if (googleToken !== token) {
        setGoogleToken(token);
      }
      return token;
    }

    const clientId = config.googleClientId || cfgClientId;
    if (!clientId) {
      throw new Error("Por favor configure su Google Client ID en la pestaña de Conexión Google.");
    }

    // Abre el popup de autenticación bajo el click gesture
    const newToken = await authenticateGoogle(clientId, false);
    setGoogleToken(newToken);
    return newToken;
  };

  // Guardar cambios de Configuración General
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const newConfig = {
      sheetId: cfgSheetId.trim(),
      driveFolderId: cfgDriveFolderId.trim(),
      googleClientId: cfgClientId.trim(),
      whatsappNumber: cfgWhatsapp.trim(),
      adminPassword: cfgPassword.trim(),
      useGoogle: cfgUseGoogle
    };
    updateConfig(newConfig);
    alert("Configuración guardada correctamente. Recargando catálogo...");
    refreshProducts();
  };

  // Abrir modal para Crear Producto
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormCode("");
    setFormName("");
    setFormPrice("");
    setFormStock("5");
    setFormCategory("");
    setFormDescription("");
    setFormSizes("S,M,L,XL");
    setFormColors("Negro,Blanco");
    setFormImage("");
    setFormGallery("");
    setFormFeatured(false);
    setShowProductModal(true);
  };

  // Abrir modal para Editar Producto
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormCode(product.code || "");
    setFormName(product.name || "");
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormCategory(product.category || "");
    setFormDescription(product.description || "");
    setFormSizes(product.sizes || "");
    setFormColors(product.colors || "");
    setFormImage(product.image || "");
    setFormGallery(product.gallery || "");
    setFormFeatured(product.featured || false);
    setShowProductModal(true);
  };

  // Guardar Producto (Crea o Edita)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert("El nombre y el precio son obligatorios.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock) || 0;

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      code: formCode.trim() || `BR-REF-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      price: isNaN(priceNum) ? 0 : priceNum,
      category: formCategory.trim() || "Otros",
      description: formDescription.trim(),
      sizes: formSizes.trim(),
      colors: formColors.trim(),
      stock: stockNum,
      image: formImage.trim(),
      gallery: formGallery.trim(),
      featured: formFeatured,
      status: editingProduct ? editingProduct.status : "active"
    };

    if (config.useGoogle && config.sheetId) {
      setGoogleLoading(true);
      try {
        const activeToken = await ensureValidToken();
        await saveProductToGoogle(config.sheetId, productData, activeToken);
        alert("Producto guardado correctamente en Google Sheets.");
        setShowProductModal(false);
        refreshProducts();
      } catch (err) {
        console.error("Error al guardar en Sheets:", err);
        alert(err.message || "Error al escribir en Google Sheets. Verifique permisos y conexión.");
      } finally {
        setGoogleLoading(false);
      }
    } else {
      // Guardado Local (localStorage)
      let currentProducts = [...products];
      if (editingProduct) {
        currentProducts = currentProducts.map((p) => (p.id === editingProduct.id ? productData : p));
      } else {
        currentProducts.push(productData);
      }
      saveProductsToLocal(currentProducts);
      alert("Producto guardado localmente.");
      setShowProductModal(false);
      refreshProducts();
    }
  };

  // Eliminar Producto (marcar como status: "deleted")
  const handleDeleteProduct = async (product) => {
    if (!confirm(`¿Está seguro de que desea eliminar el producto: "${product.name}"?`)) {
      return;
    }

    const updatedProduct = { ...product, status: "deleted" };

    if (config.useGoogle && config.sheetId) {
      setGoogleLoading(true);
      try {
        const activeToken = await ensureValidToken();
        await saveProductToGoogle(config.sheetId, updatedProduct, activeToken);
        alert("Producto eliminado correctamente en Google Sheets.");
        refreshProducts();
      } catch (err) {
        console.error("Error borrando en Sheets:", err);
        alert(err.message || "Error al eliminar producto en Google Sheets.");
      } finally {
        setGoogleLoading(false);
      }
    } else {
      // Local
      const updatedProducts = products.map((p) => (p.id === product.id ? updatedProduct : p));
      saveProductsToLocal(updatedProducts);
      alert("Producto eliminado de forma local.");
      refreshProducts();
    }
  };

  // Manejar subida de imagen a Google Drive
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!config.driveFolderId) {
      alert("Por favor configure primero el ID de la carpeta de Google Drive en la sección de Ajustes.");
      return;
    }

    setImageUploading(true);
    try {
      const activeToken = await ensureValidToken();
      const driveFileId = await uploadImageToDrive(config.driveFolderId, file, activeToken);
      
      if (uploadTarget === "main") {
        setFormImage(driveFileId);
      } else {
        // Galería (agregar separando por comas)
        const currentGallery = formGallery ? formGallery.split(",").map(i => i.trim()).filter(Boolean) : [];
        currentGallery.push(driveFileId);
        setFormGallery(currentGallery.join(","));
      }
      alert("Imagen subida a Google Drive de forma exitosa y vinculada.");
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      alert(err.message || "Fallo al subir la imagen. Compruebe permisos e intente de nuevo.");
    } finally {
      setImageUploading(false);
    }
  };

  const triggerFileUpload = (target) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  // Exportar catálogo completo local en JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bravostyle_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar catálogo en JSON
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsedList = JSON.parse(event.target.result);
        if (Array.isArray(parsedList)) {
          saveProductsToLocal(parsedList);
          alert("Base de datos local cargada de manera exitosa.");
          refreshProducts();
        } else {
          alert("El archivo JSON debe contener un arreglo de productos válido.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON. Formato inválido.");
      }
    };
    fileReader.readAsText(file);
  };

  // Filtrado de productos en lista del Admin
  const filteredAdminProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.code || "").toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  // Pantalla de Bloqueo por Contraseña
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-40 pb-24 px-6 flex items-center justify-center bg-off-white">
        <div className="w-full max-w-md bg-white border border-dark/10 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tighter text-dark mb-2">BRAVOSTYLE</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-smoke font-bold">Catálogo Admin</p>
          </div>
          
          <form onSubmit={handleLocalLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                Contraseña de Acceso
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark/5 border border-dark/10 px-4 py-3 text-sm outline-none focus:border-dark transition-colors"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-2 font-medium">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-dark text-off-white text-xs font-bold uppercase tracking-widest hover:bg-dark/80 transition-colors"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      
      {/* Barra superior del Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-dark/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-dark tracking-tight">Panel de Control</h1>
            <span className="px-2 py-0.5 bg-dark text-off-white text-[9px] font-bold uppercase tracking-widest">
              Admin
            </span>
          </div>
          <p className="text-xs text-smoke font-medium uppercase tracking-wider mt-1.5">
            Administración del catálogo, inventario e integración con Google.
          </p>
        </div>

        <div className="flex gap-3">
          {config.useGoogle && (
            <button
              onClick={handleConnectGoogle}
              disabled={googleLoading}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                googleToken
                  ? "bg-green-100 text-green-800 border-green-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  : "bg-dark text-off-white border-dark hover:bg-dark/80"
              }`}
              title={googleToken ? "Haga clic para desconectar su cuenta de Google" : "Haga clic para conectar su cuenta de Google"}
            >
              <span className={`w-2 h-2 rounded-full ${googleToken ? "bg-green-600 animate-pulse" : "bg-red-500"}`} />
              {googleToken ? "Conectado a Google" : googleLoading ? "Conectando..." : "Conectar Google"}
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 border border-dark text-dark text-xs font-bold uppercase tracking-wider hover:bg-dark hover:text-off-white transition-all"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex border-b border-dark/10 mb-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === "products" ? "border-dark text-dark" : "border-transparent text-smoke"
          }`}
        >
          Productos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("google")}
          className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === "google" ? "border-dark text-dark" : "border-transparent text-smoke"
          }`}
        >
          Conexión Google
        </button>
        <button
          onClick={() => setActiveTab("offline")}
          className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === "offline" ? "border-dark text-dark" : "border-transparent text-smoke"
          }`}
        >
          Herramientas Offline
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === "guide" ? "border-dark text-dark" : "border-transparent text-smoke"
          }`}
        >
          Guía de Configuración
        </button>
      </div>

      {/* VISTA DE PRODUCTOS */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none w-full sm:max-w-xs focus:border-dark transition-colors"
            />
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3 bg-dark text-off-white text-xs font-bold uppercase tracking-widest hover:bg-dark/80 transition-all text-center"
            >
              + Agregar Producto
            </button>
          </div>

          {loading ? (
            <div className="py-24 text-center text-smoke font-semibold uppercase tracking-wider">
              Cargando catálogo...
            </div>
          ) : filteredAdminProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-dark/10">
              <p className="text-smoke text-sm">No hay productos en esta lista.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-dark/10 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-dark text-off-white uppercase tracking-widest font-bold border-b border-dark/20">
                    <th className="py-4 px-6 w-20">Foto</th>
                    <th className="py-4 px-6">Código</th>
                    <th className="py-4 px-6">Nombre</th>
                    <th className="py-4 px-6">Categoría</th>
                    <th className="py-4 px-6">Precio</th>
                    <th className="py-4 px-6">Stock</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5 text-dark font-medium">
                  {filteredAdminProducts.map((product) => {
                    const isOutOfStock = product.stock <= 0;
                    return (
                      <tr key={product.id} className="hover:bg-dark/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <img
                            src={formatImageUrl(product.image, 100)}
                            alt=""
                            className="w-12 h-16 object-cover bg-dark/5 border border-dark/10"
                          />
                        </td>
                        <td className="py-4 px-6 font-mono text-smoke">{product.code}</td>
                        <td className="py-4 px-6 font-bold">{product.name}</td>
                        <td className="py-4 px-6 text-smoke">{product.category}</td>
                        <td className="py-4 px-6 font-bold">${product.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded">
                              Agotado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded">
                              {product.stock} u.
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="px-3 py-1.5 border border-dark/20 text-dark hover:border-dark font-bold uppercase transition-all"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="px-3 py-1.5 border border-red-200 text-red-600 hover:border-red-600 hover:bg-red-50 font-bold uppercase transition-all"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* AJUSTES DE GOOGLE */}
      {activeTab === "google" && (
        <div className="max-w-2xl bg-white border border-dark/10 p-8 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-widest text-dark mb-6">Configuración de Sincronización</h3>
          
          <form onSubmit={handleSaveConfig} className="space-y-6">
            
            {/* Toggle de Google */}
            <div className="flex items-center gap-3 pb-4 border-b border-dark/5">
              <input
                type="checkbox"
                id="cfgUseGoogle"
                checked={cfgUseGoogle}
                onChange={(e) => setCfgUseGoogle(e.target.checked)}
                className="accent-dark w-5 h-5"
              />
              <label htmlFor="cfgUseGoogle" className="text-xs font-black uppercase tracking-widest text-dark select-none cursor-pointer">
                Habilitar Sincronización de Google Sheets y Drive
              </label>
            </div>

            {cfgUseGoogle && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                    Google Client ID (OAuth)
                  </label>
                  <input
                    type="text"
                    value={cfgClientId}
                    onChange={(e) => setCfgClientId(e.target.value)}
                    placeholder="12345678-abcdef.apps.googleusercontent.com"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-smoke mt-1.5 font-light">
                    Creado en Google Cloud Console para autorizar las subidas y escrituras desde la web.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                      Google Sheet ID
                    </label>
                    <input
                      type="text"
                      value={cfgSheetId}
                      onChange={(e) => setCfgSheetId(e.target.value)}
                      placeholder="1aBcD...eFghIj"
                      className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                      Google Drive Folder ID
                    </label>
                    <input
                      type="text"
                      value={cfgDriveFolderId}
                      onChange={(e) => setCfgDriveFolderId(e.target.value)}
                      placeholder="1xYz...aBcDe"
                      className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark font-mono text-[11px]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark/5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                  Número de WhatsApp (Contacto)
                </label>
                <input
                  type="text"
                  value={cfgWhatsapp}
                  onChange={(e) => setCfgWhatsapp(e.target.value)}
                  placeholder="573235834122"
                  className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark font-mono text-[11px]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark mb-2">
                  Nueva Contraseña Admin
                </label>
                <input
                  type="text"
                  value={cfgPassword}
                  onChange={(e) => setCfgPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-dark text-off-white text-xs font-bold uppercase tracking-widest hover:bg-dark/80 transition-colors"
            >
              Guardar Configuración
            </button>
          </form>
        </div>
      )}

      {/* HERRAMIENTAS OFFLINE / LOCALES */}
      {activeTab === "offline" && (
        <div className="max-w-2xl bg-white border border-dark/10 p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-dark mb-2">Base de Datos Local (Offline)</h3>
            <p className="text-xs text-smoke font-light leading-relaxed">
              Si no usa Google Sheets, todos sus cambios se guardan localmente en su navegador actual.
              Use estas herramientas para realizar respaldos (backups) e importar catálogos enteros.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-dark/5">
            {/* Exportar */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-dark">Respaldar Catálogo</h4>
              <p className="text-[11px] text-smoke leading-relaxed font-light">
                Descargue su base de datos de productos actual como un archivo JSON.
              </p>
              <button
                onClick={handleExportJSON}
                className="px-5 py-2.5 bg-dark text-off-white text-xs font-bold uppercase tracking-widest hover:bg-dark/80 transition-all w-full text-center"
              >
                Exportar JSON
              </button>
            </div>

            {/* Importar */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-dark">Restaurar Catálogo</h4>
              <p className="text-[11px] text-smoke leading-relaxed font-light">
                Cargue un archivo JSON para sobreescribir y poblar el catálogo actual.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 border border-dark text-dark text-xs font-bold uppercase tracking-widest hover:bg-dark/5 transition-all w-full text-center"
                >
                  Importar JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GUÍA DE CONFIGURACIÓN */}
      {activeTab === "guide" && (
        <div className="max-w-3xl bg-white border border-dark/10 p-8 shadow-sm space-y-8 prose prose-sm">
          <h2 className="text-xl font-black uppercase tracking-widest text-dark border-b border-dark/10 pb-4 mb-6">
            Guía de Conexión Google Sheets y Drive
          </h2>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-dark">1. Configurar Hoja de Google Sheets</h3>
            <p className="font-light text-dark/80">
              Cree una hoja de cálculo en su Google Drive y asegúrese de que la primera pestaña contenga precisamente estas columnas en la fila 1 (encabezado):
            </p>
            <pre className="bg-dark/5 text-dark/80 p-3 font-mono text-[10px] rounded overflow-x-auto">
              id, code, name, price, category, description, sizes, colors, stock, image, gallery, featured, status
            </pre>
            <p className="font-light text-dark/80">
              <strong>Publicación:</strong> Comparta el documento configurándolo para que "Cualquier persona con el enlace pueda ver".
              Copie el ID de la hoja de cálculo desde la barra de direcciones de su navegador. El ID es la cadena larga que aparece entre <code>/d/</code> y <code>/edit</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-dark">2. Configurar Carpeta de Google Drive para Fotos</h3>
            <p className="font-light text-dark/80">
              Cree una carpeta en su Google Drive donde guardará todas las fotos de los productos.
              Comparta la carpeta para que "Cualquier persona con el enlace pueda ver" (esto es vital para que sus clientes puedan cargar las fotos).
              Copie el ID de la carpeta desde la URL de la carpeta.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-dark">3. Obtener el Google Client ID</h3>
            <p className="font-light text-dark/80">
              Dado que este sitio opera directamente en el navegador, el panel de administración usa Google OAuth2.
            </p>
            <ol className="list-decimal pl-5 font-light space-y-2 text-dark/80">
              <li>Vaya a <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="underline font-bold">Google Cloud Console</a> e inicie sesión.</li>
              <li>Cree un proyecto nuevo o seleccione uno existente.</li>
              <li>En el buscador superior, busque y habilite las APIs: <strong>Google Sheets API</strong> y <strong>Google Drive API</strong>.</li>
              <li>Vaya a la pestaña "Pantalla de consentimiento de OAuth", configure la aplicación como tipo Externo y agregue la información básica.</li>
              <li>Vaya a la pestaña "Credenciales", haga clic en "+ Crear credenciales" y elija "ID de cliente de OAuth".</li>
              <li>Seleccione "Aplicación web" como tipo de aplicación.</li>
              <li>
                En <strong>Orígenes de JavaScript autorizados</strong> agregue las URLs desde las cuales usará la app, por ejemplo:
                <ul className="list-disc pl-5 font-mono text-[11px] mt-1 space-y-0.5">
                  <li>http://localhost:5173</li>
                  <li>https://su-dominio-produccion.com</li>
                </ul>
              </li>
              <li>Haga clic en crear y copie el <strong>ID de cliente</strong> generado.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-dark">4. Conectar y Guardar</h3>
            <p className="font-light text-dark/80">
              Ingrese el Client ID, Sheet ID y Drive Folder ID en la pestaña <strong>Conexión Google</strong> de este panel. Habilite el checkbox "Habilitar Sincronización" y guarde.
              Luego haga clic en <strong>Conectar Google</strong> en la esquina superior derecha y apruebe los accesos en el popup emergente.
            </p>
          </section>
        </div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN DE PRODUCTO */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="relative bg-off-white w-full max-w-2xl p-8 shadow-2xl z-10 border border-dark/10 overflow-y-auto max-h-[85vh]">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-dark">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-lg font-bold text-dark w-8 h-8 flex items-center justify-center border border-dark/10 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Input oculto de archivos para Google Drive */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              
              {/* Ref y Nombre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Código/Ref</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="BR-TS01"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Nombre del Producto *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Camiseta Oversize Premium"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-bold"
                    required
                  />
                </div>
              </div>

              {/* Categoría, Precio y Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Categoría</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Camisetas Oversize"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Precio (USD) *</label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="39.99"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Stock (Inventario)</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="10"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-bold uppercase tracking-widest text-dark mb-2">Descripción Detallada</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles sobre tela, horma, gramaje..."
                  className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none min-h-[100px] font-medium"
                />
              </div>

              {/* Tallas y Colores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Tallas Disponibles</label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="S,M,L,XL"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none"
                  />
                  <p className="text-[9px] text-smoke mt-1 font-light">Separadas por comas (Ej: S,M,L).</p>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-widest text-dark mb-2">Colores Disponibles</label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Negro,Blanco,Gris"
                    className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none"
                  />
                  <p className="text-[9px] text-smoke mt-1 font-light">Separados por comas (Ej: Negro,Blanco).</p>
                </div>
              </div>

              {/* Imágen Principal */}
              <div className="space-y-2">
                <label className="block font-bold uppercase tracking-widest text-dark">Imagen Principal (URL o ID de Google Drive)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="URL de foto o ID de Google Drive"
                    className="flex-1 bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-mono text-[10px]"
                  />
                  {config.useGoogle && (
                    <button
                      type="button"
                      onClick={() => triggerFileUpload("main")}
                      disabled={imageUploading}
                      className="px-4 bg-dark text-off-white font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50"
                    >
                      {imageUploading && uploadTarget === "main" ? "Subiendo..." : "Subir Imagen"}
                    </button>
                  )}
                </div>
              </div>

              {/* Galería Adicional */}
              <div className="space-y-2">
                <label className="block font-bold uppercase tracking-widest text-dark">Galería de Imágenes (IDs o URLs separados por coma)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formGallery}
                    onChange={(e) => setFormGallery(e.target.value)}
                    placeholder="ID_1,ID_2,ID_3"
                    className="flex-1 bg-dark/5 border border-dark/10 px-4 py-2.5 outline-none font-mono text-[10px]"
                  />
                  {config.useGoogle && (
                    <button
                      type="button"
                      onClick={() => triggerFileUpload("gallery")}
                      disabled={imageUploading}
                      className="px-4 bg-dark text-off-white font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50"
                    >
                      {imageUploading && uploadTarget === "gallery" ? "Subiendo..." : "Subir a Galería"}
                    </button>
                  )}
                </div>
              </div>

              {/* Destacado */}
              <div className="flex items-center gap-2 py-2 border-y border-dark/5">
                <input
                  type="checkbox"
                  id="formFeatured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="accent-dark w-4 h-4"
                />
                <label htmlFor="formFeatured" className="font-bold uppercase tracking-widest text-dark cursor-pointer select-none">
                  Mostrar como Producto Destacado en Inicio
                </label>
              </div>

              {/* Botones de acción del formulario */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-3 border border-dark/20 text-dark font-bold uppercase tracking-widest hover:border-dark"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="px-6 py-3 bg-dark text-off-white font-bold uppercase tracking-widest hover:bg-dark/80 disabled:opacity-50"
                >
                  {googleLoading ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
