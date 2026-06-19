// Servicio para administrar y sincronizar el catálogo de productos

const LOCAL_PRODUCTS_KEY = "bravostyle_local_products";
const CONFIG_KEY = "bravostyle_config";

// Extraer el ID de archivo de Google Drive desde URLs comunes o ID directo
export function getGoogleDriveFileId(urlOrId) {
  if (!urlOrId) return "";
  const str = String(urlOrId).trim();
  if (str.length < 25) return str; // Asume que es el ID directo
  
  // Coincide con /file/d/ID/vista
  const reg1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match1 = str.match(reg1);
  if (match1 && match1[1]) return match1[1];
  
  // Coincide con ?id=ID
  const reg2 = /[?&]id=([a-zA-Z0-9_-]+)/;
  const match2 = str.match(reg2);
  if (match2 && match2[1]) return match2[1];
  
  return str;
}

// Dar formato y optimizar URLs de imágenes
export function formatImageUrl(urlOrId, width = 800) {
  if (!urlOrId) return "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80";
  const str = String(urlOrId).trim();
  
  // Es una ruta local del servidor
  if (str.startsWith("/")) return str;
  
  if (str.startsWith("http")) {
    if (str.includes("drive.google.com")) {
      const fileId = getGoogleDriveFileId(str);
      return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
    }
    return str;
  }
  
  // Es un ID directo de Google Drive
  return `https://lh3.googleusercontent.com/d/${str}=w${width}`;
}

// Analizador (parser) de CSV robusto
export function parseCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // salta la siguiente comilla
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentLine.push(currentField);
        lines.push(currentLine);
        currentLine = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  
  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField);
    lines.push(currentLine);
  }
  
  if (lines.length === 0) return [];
  
  // Limpiar encabezados
  const headers = lines[0].map(h => h.trim().toLowerCase());
  
  return lines.slice(1)
    .filter(line => line.length > 0 && line[0] !== '')
    .map(line => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = line[index] !== undefined ? line[index].trim() : '';
      });
      return obj;
    });
}

// Cargar la configuración estática
export async function loadConfig() {
  try {
    // Primero buscar en localStorage si el administrador hizo cambios recientes en caliente
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    
    // Cargar de public/config.json
    const response = await fetch("/config.json");
    if (!response.ok) throw new Error("No se pudo cargar config.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error cargando configuración:", error);
    // Configuración fallback por defecto
    return {
      sheetId: "",
      driveFolderId: "",
      googleClientId: "",
      whatsappNumber: "573000000000",
      adminPassword: "admin123",
      useGoogle: false
    };
  }
}

// Guardar la configuración (para uso del administrador local)
export function saveConfigToLocal(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Cargar productos del catálogo
export async function loadProducts(config) {
  if (config.useGoogle && config.sheetId) {
    try {
      // Intentar obtener datos de Google Sheets
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&t=${Date.now()}`; // Bypass cache
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error("Error obteniendo datos de Google Sheets");
      
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      
      // Mapear campos de CSV a tipos correctos de productos
      return parsedData.map(row => ({
        id: String(row.id),
        code: row.code || row.referencia || `BR-REF-${row.id}`,
        name: row.name || row.nombre || "Producto sin nombre",
        price: parseFloat(row.price || row.precio) || 0,
        category: row.category || row.categoria || "Otros",
        description: row.description || row.descripcion || "",
        sizes: row.sizes || row.tallas || "S,M,L",
        colors: row.colors || row.colores || "Varios",
        stock: parseInt(row.stock || row.inventario) || 0,
        image: row.image || row.imagen || "",
        gallery: row.gallery || row.galeria || "",
        featured: String(row.featured || row.destacado).toLowerCase() === "true",
        status: row.status || row.estado || "active"
      })).filter(p => p.status !== "deleted" && p.status !== "draft");
    } catch (error) {
      console.warn("Fallo carga desde Google Sheets, usando base local:", error);
      // Fallback si la conexión a Google falla
    }
  }

  // Carga Local (Local Storage o archivo fallback)
  let localProducts = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (localProducts) {
    try {
      return JSON.parse(localProducts).filter(p => p.status !== "deleted");
    } catch (e) {
      console.error("Error parseando productos de localStorage", e);
    }
  }

  // Cargar desde el archivo estático fallback_products.json
  try {
    const response = await fetch("/fallback_products.json");
    if (!response.ok) throw new Error("No se pudo cargar fallback_products.json");
    const data = await response.json();
    // Guardar en localStorage para persistir modificaciones posteriores
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error cargando productos fallback:", error);
    return [];
  }
}

// Guardar productos en modo local (Admin)
export function saveProductsToLocal(products) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

// Generar mensaje personalizado de WhatsApp para compra/consulta
export function generateWhatsAppLink(product, selectedSize, selectedColor, whatsappNumber) {
  const number = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, "") : "573000000000";
  const refText = product.code ? ` (Ref: ${product.code})` : "";
  const sizeText = selectedSize ? `talla ${selectedSize}` : "talla por definir";
  const colorText = selectedColor ? `color ${selectedColor}` : "color por definir";
  
  const text = `Hola! Estoy interesado en el producto: *${product.name}*${refText} en *${sizeText}* y *${colorText}*. ¿Tienen disponibilidad?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
