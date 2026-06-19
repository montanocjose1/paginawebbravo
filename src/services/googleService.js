// Servicio para comunicarse con Google Sheets y Google Drive APIs desde el navegador

let tokenClient = null;

// Cargar dinámicamente el script de Google Identity Services
export function loadGsiScript() {
  return new Promise((resolve) => {
    if (window.google && window.google.accounts) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("Error al cargar Google GSI script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Iniciar sesión y obtener un token de acceso OAuth2
export function authenticateGoogle(clientId, forceConsent = false) {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      reject(new Error("Se requiere el Google Client ID para autenticar."));
      return;
    }

    try {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
        callback: (response) => {
          if (response.error) {
            reject(response);
          } else {
            const expiryTime = Date.now() + (response.expires_in || 3600) * 1000;
            localStorage.setItem("google_access_token", response.access_token);
            localStorage.setItem("google_token_expiry", expiryTime.toString());
            resolve(response.access_token);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: forceConsent ? "consent" : "" });
    } catch (err) {
      reject(err);
    }
  });
}

// Obtener el token guardado en localStorage si sigue siendo válido (con margen de seguridad de 5 mins)
export function getStoredGoogleToken() {
  const token = localStorage.getItem("google_access_token");
  const expiry = localStorage.getItem("google_token_expiry");
  if (token && expiry) {
    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();
    // Margen de 5 minutos (300,000 ms) antes de que expire realmente
    if (now < expiryTime - 5 * 60 * 1000) {
      return token;
    }
  }
  return null;
}

// Limpiar el token guardado en localStorage
export function clearStoredGoogleToken() {
  localStorage.removeItem("google_access_token");
  localStorage.removeItem("google_token_expiry");
}

// Inicializar hoja de cálculo con columnas de encabezado si está vacía
export async function initializeSheet(sheetId, accessToken) {
  const headers = [
    "id", "code", "name", "price", "category",
    "description", "sizes", "colors", "stock",
    "image", "gallery", "featured", "status"
  ];
  
  try {
    // Consultar si ya existen datos
    const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:M1`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.values && data.values.length > 0) {
        // La hoja ya tiene cabecera, no es necesario hacer nada
        return true;
      }
    }

    // Escribir encabezados si la hoja está vacía
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:M1?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [headers]
      })
    });
    return true;
  } catch (error) {
    console.error("Error inicializando hoja:", error);
    return false;
  }
}

// Obtener todas las filas de la hoja de cálculo
export async function fetchSheetRows(sheetId, accessToken) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:M`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error("Error leyendo hoja de Google Sheets");
  const data = await response.json();
  return data.values || [];
}

// Guardar o actualizar producto en Google Sheets
export async function saveProductToGoogle(sheetId, product, accessToken) {
  await initializeSheet(sheetId, accessToken);
  const rows = await fetchSheetRows(sheetId, accessToken);
  
  const productRow = [
    product.id,
    product.code,
    product.name,
    product.price,
    product.category,
    product.description,
    product.sizes,
    product.colors,
    product.stock,
    product.image,
    product.gallery,
    product.featured ? "true" : "false",
    product.status || "active"
  ];
  
  // Buscar si el producto ya existe en la hoja (comparar columna A: ID)
  let rowIndex = -1;
  if (rows.length > 0) {
    rowIndex = rows.findIndex(r => r[0] === String(product.id));
  }
  
  if (rowIndex !== -1) {
    // Actualizar fila existente (1-based index)
    const rowNum = rowIndex + 1;
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A${rowNum}:M${rowNum}?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [productRow]
      })
    });
    if (!updateRes.ok) throw new Error("Error actualizando producto en Sheets");
    return true;
  } else {
    // Añadir nuevo producto (Append)
    const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:M1:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [productRow]
      })
    });
    if (!appendRes.ok) throw new Error("Error agregando producto en Sheets");
    return true;
  }
}

// Subir imagen a Google Drive y otorgarle permisos públicos de lectura
export async function uploadImageToDrive(driveFolderId, file, accessToken) {
  try {
    // 1. Crear metadatos del archivo y FormData para carga multipart
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: driveFolderId ? [driveFolderId] : []
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form
    });

    if (!uploadRes.ok) throw new Error("Error al subir archivo a Google Drive");
    
    const data = await uploadRes.json();
    const fileId = data.id;

    // 2. Establecer permisos públicos ("Anyone with link can view")
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone"
      })
    });

    return fileId;
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    throw error;
  }
}

// Listar imágenes de la carpeta de Google Drive
export async function listDriveImages(driveFolderId, accessToken) {
  if (!driveFolderId) return [];
  try {
    const q = `'${driveFolderId}' in parents and mimeType starts with 'image/' and trashed = false`;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType)&pageSize=100`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Error listando archivos de Google Drive");
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Error listando imágenes de Drive:", error);
    return [];
  }
}
