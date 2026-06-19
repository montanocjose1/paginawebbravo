import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatImageUrl } from "../services/catalogService";

export default function Shop() {
  const { products, loading, error } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados de filtros
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [maxPrice, setMaxPrice] = useState(150);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Obtener categoría activa desde URL
  const activeCategory = searchParams.get("category") || "";

  // Extraer valores dinámicos del catálogo actual para los filtros
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  }, [products]);

  const allSizes = useMemo(() => {
    return Array.from(
      new Set(
        products.flatMap((p) => (p.sizes ? p.sizes.split(",").map((s) => s.trim()) : []))
      )
    ).filter(Boolean);
  }, [products]);

  const allColors = useMemo(() => {
    return Array.from(
      new Set(
        products.flatMap((p) => (p.colors ? p.colors.split(",").map((c) => c.trim()) : []))
      )
    ).filter(Boolean);
  }, [products]);

  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 150;
    const prices = products.map((p) => p.price);
    return Math.ceil(Math.max(...prices));
  }, [products]);

  // Sincronizar el slider de precio una vez que se cargan los productos
  useMemo(() => {
    if (products.length > 0) {
      setMaxPrice(absoluteMaxPrice);
    }
  }, [products, absoluteMaxPrice]);

  // Filtrado de productos en memoria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filtro de Categoría (desde URL query param)
      if (activeCategory) {
        const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, "-");
        if (productCategorySlug !== activeCategory) return false;
      }

      // 2. Filtro de Búsqueda por Texto
      if (search) {
        const query = search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCode = (product.code || "").toLowerCase().includes(query);
        const matchesDesc = (product.description || "").toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesDesc && !matchesCategory) return false;
      }

      // 3. Filtro de Talla
      if (selectedSize) {
        const productSizes = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
        if (!productSizes.includes(selectedSize)) return false;
      }

      // 4. Filtro de Color
      if (selectedColor) {
        const productColors = product.colors ? product.colors.split(",").map(c => c.trim()) : [];
        if (!productColors.includes(selectedColor)) return false;
      }

      // 5. Filtro de Precio Máximo
      if (product.price > maxPrice) return false;

      // 6. Filtro de Stock
      if (hideOutOfStock && product.stock <= 0) return false;

      return true;
    });
  }, [products, activeCategory, search, selectedSize, selectedColor, maxPrice, hideOutOfStock]);

  // Limpiar todos los filtros activos
  const handleResetFilters = () => {
    setSearch("");
    setSelectedSize("");
    setSelectedColor("");
    setMaxPrice(absoluteMaxPrice);
    setHideOutOfStock(false);
    setSearchParams({});
  };

  const selectCategory = (categoryName) => {
    if (!categoryName) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryName.toLowerCase().replace(/\s+/g, "-"));
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-smoke font-medium mb-3">Colección</p>
        <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight">
          {activeCategory
            ? activeCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Todos los Productos"}
        </h1>
      </div>

      {/* Grid de búsqueda e interfaz principal */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* FILTROS - Escritorio (Lateral izquierdo) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          {/* Buscar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Buscar</h4>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, código..."
                className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none focus:border-dark transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-smoke hover:text-dark font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Categorías</h4>
            <div className="flex flex-col gap-2 text-sm">
              <button
                onClick={() => selectCategory("")}
                className={`text-left transition-colors hover:text-dark ${
                  !activeCategory ? "text-dark font-semibold" : "text-smoke"
                }`}
              >
                Todas las Colecciones
              </button>
              {categories.map((cat, i) => {
                const slug = cat.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    key={i}
                    onClick={() => selectCategory(cat)}
                    className={`text-left transition-colors hover:text-dark ${
                      activeCategory === slug ? "text-dark font-semibold" : "text-smoke"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tallas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Tallas</h4>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                  className={`w-10 h-10 border text-xs font-bold transition-all flex items-center justify-center ${
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

          {/* Colores */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Colores</h4>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                  className={`px-3 py-1.5 border text-xs font-medium uppercase tracking-wider transition-all ${
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

          {/* Precio */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
              <span className="text-dark">Precio Máximo</span>
              <span className="text-smoke">${maxPrice} USD</span>
            </div>
            <input
              type="range"
              min="0"
              max={absoluteMaxPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-dark h-1 bg-dark/10 cursor-pointer"
            />
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hideOutOfStock"
              checked={hideOutOfStock}
              onChange={(e) => setHideOutOfStock(e.target.checked)}
              className="accent-dark w-4 h-4"
            />
            <label htmlFor="hideOutOfStock" className="text-xs font-semibold uppercase tracking-wider text-dark select-none cursor-pointer">
              Ocultar Agotados
            </label>
          </div>

          {/* Limpiar Filtros */}
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 border border-dark text-dark text-xs font-bold uppercase tracking-widest hover:bg-dark hover:text-off-white transition-all"
          >
            Limpiar Filtros
          </button>
        </aside>

        {/* FILTROS - Móvil (Botón Gatillo y Modal) */}
        <div className="lg:hidden flex gap-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-1 py-3 bg-dark text-off-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Filtros y Búsqueda
          </button>
          {(search || selectedSize || selectedColor || activeCategory || hideOutOfStock) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 border border-dark text-dark text-xs font-bold uppercase"
            >
              ✕
            </button>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL (Productos) */}
        <div className="flex-1">
          {/* Mensajes de Estado */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-dark/5 mb-5" />
                  <div className="h-4 bg-dark/10 w-2/3 mb-2" />
                  <div className="h-4 bg-dark/10 w-1/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-dark text-off-white text-xs font-bold uppercase tracking-widest"
              >
                Volver a intentar
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-smoke mb-6">No se encontraron productos que coincidan con los filtros.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 border border-dark text-dark text-xs font-bold uppercase tracking-widest hover:bg-dark hover:text-off-white transition-all"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-smoke font-semibold uppercase tracking-wider mb-6">
                Mostrando {filteredProducts.length} producto{filteredProducts.length === 1 ? "" : "s"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group block relative"
                    >
                      {/* Imagen con badge */}
                      <div className="aspect-[3/4] overflow-hidden bg-dark/5 mb-5 relative">
                        <img
                          src={formatImageUrl(product.image, 600)}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Indicadores de stock */}
                        {isOutOfStock ? (
                          <div className="absolute inset-0 bg-dark/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-dark text-off-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-off-white/20">
                              Agotado
                            </span>
                          </div>
                        ) : product.featured ? (
                          <span className="absolute top-4 left-4 bg-off-white text-dark text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                            Destacado
                          </span>
                        ) : null}
                      </div>

                      {/* Detalles */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-dark tracking-wide group-hover:text-smoke transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[10px] uppercase tracking-widest text-smoke mt-0.5">
                            {product.category} {product.code ? `• ${product.code}` : ""}
                          </p>
                        </div>
                        <p className="text-sm text-dark font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE FILTROS MÓVIL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Fondo oscuro traslúcido */}
          <div
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Panel Lateral */}
          <div className="relative ml-auto w-full max-w-xs bg-off-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-dark">Filtros</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-lg font-bold text-dark w-8 h-8 flex items-center justify-center border border-dark/10 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Contenido de Filtros */}
            <div className="space-y-8 flex-1">
              {/* Buscar */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Buscar</h4>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre, código..."
                  className="w-full bg-dark/5 border border-dark/10 px-4 py-2.5 text-sm outline-none"
                />
              </div>

              {/* Categorías */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Categorías</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={() => { selectCategory(""); setMobileFiltersOpen(false); }}
                    className={`text-left ${!activeCategory ? "text-dark font-semibold" : "text-smoke"}`}
                  >
                    Todas las Colecciones
                  </button>
                  {categories.map((cat, i) => {
                    const slug = cat.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <button
                        key={i}
                        onClick={() => { selectCategory(cat); setMobileFiltersOpen(false); }}
                        className={`text-left ${activeCategory === slug ? "text-dark font-semibold" : "text-smoke"}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tallas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Tallas</h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                      className={`w-10 h-10 border text-xs font-bold transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? "bg-dark border-dark text-off-white"
                          : "border-dark/10 text-dark"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colores */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-dark">Colores</h4>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                      className={`px-3 py-1.5 border text-xs font-medium uppercase tracking-wider transition-all ${
                        selectedColor === color
                          ? "bg-dark border-dark text-off-white"
                          : "border-dark/10 text-dark"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                  <span className="text-dark">Precio Máximo</span>
                  <span className="text-smoke">${maxPrice} USD</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-dark h-1 bg-dark/10 cursor-pointer"
                />
              </div>

              {/* Disponibilidad */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mobileHideOutOfStock"
                  checked={hideOutOfStock}
                  onChange={(e) => setHideOutOfStock(e.target.checked)}
                  className="accent-dark w-4 h-4"
                />
                <label htmlFor="mobileHideOutOfStock" className="text-xs font-semibold uppercase tracking-wider text-dark">
                  Ocultar Agotados
                </label>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-6 border-t border-dark/10 space-y-3">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-dark text-off-white text-xs font-bold uppercase tracking-widest"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }}
                className="w-full py-3 border border-dark text-dark text-xs font-bold uppercase tracking-widest"
              >
                Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
