// src/utils/Helper.tsx

// --- INTERFACES DTO ---
export interface FamiliaDTO {
  idFamilia: number;
  nombreFamilia: string;
  descripcionFamilia: string;
}

export interface ConceptoTecnicoDTO {
  idTecnico: number;
  nombreTecnico: string;
  estado: string;
  idFamilia: number;
}

export interface ConceptoFormativoDTO {
  idConceptoFormativo: number;
  nombreFormativo: string;
  descripcionFormativo: string;
  urlImagen?: string;
}

// Tipos de datos para el frontend
export type Family = {
  idFamilies: number;
  name: string;
  descriptions?: string;
  componentItemn?: string;
  image?: string;
  subConcepto?: SubConcept[];
};

export type SubConcept = {
  conceptId: number;
  familyId: number;
  name: string;
  description?: string;
  image?: string;
};

export type Formative = {
  conceptId: number;
  name: string;
  description: string;
  image?: string;
};

// Interfaz para los Aportes
export type Aporte = {
  idAporte: number;
  idUsuario: number;
  nombreUsuario: string;
  tipoObjeto: "FAMILIA" | "TECNICO" | "FORMATIVO";
  nombrePropuesto: string;
  descripcionPropuesto: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  idAdmin?: number;
  motivoRechazo?: string;
};

const STORAGE_KEYS = {
  FAMILIES: "app:families",
  SUBCONCEPTS: "app:subconcepts",
  FORMATIVES: "app:formatives",
} as const;

const API_BASE_URL = "http://localhost:8090/api/v1";
export { API_BASE_URL };

/* --- HELPERS PRIVADOS DE AUTENTICACIÓN Y RED (NUEVO) --- 
  Esta lógica centraliza el manejo de tokens y errores 401.
*/

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

/**
 * Función wrapper para fetch que maneja automáticamente:
 * 1. Inyección de Headers con Token.
 * 2. Detección de sesión expirada (401/403) -> Redirección al Login.
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  
  const response = await fetch(url, {
    ...options,
    headers: headers as HeadersInit,
  });

  // MANEJO CRÍTICO DE EXPIRACIÓN
  if (response.status === 401 || response.status === 403) {
    console.warn("Sesión expirada o no autorizada. Redirigiendo al login...");
    
    // 1. Limpiar credenciales
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    
    // 2. Redirigir forzosamente
    // Usamos window.location porque este helper no es un componente React
    window.location.href = "/loginPage";
    
    // 3. Detener flujo lanzando error
    throw new Error("Tu sesión ha expirado. Por favor ingresa nuevamente.");
  }

  return response;
}

/* --- Helpers Generales --- */

function getInitialData<T>(key: string, defaultData: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

function getCurrentUserId(): number {
  try {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) return user.id;
    }
  } catch (e) {
    console.error(e);
  }
  throw new Error(
    "No se pudo identificar al usuario. Por favor inicia sesión."
  );
}

/* --- Función POST Genérica (Ahora usa fetchWithAuth) --- */
async function postToApi<T>(endpoint: string, payload: T): Promise<void> {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = `Error ${response.status}`;
    try {
      const data = await response.json();
      errorMsg = data.message || JSON.stringify(data);
    } catch {}
    throw new Error(errorMsg);
  }
}

/* --- Mock Data (Datos Locales de Respaldo) --- */
const initialFamilies: Family[] = [
  {
    idFamilies: 1,
    name: "Columna",
    descriptions: "Elemento arquitectónico vertical...",
    componentItemn: "Base, Fuste, Capitel",
    image: "/assets/columna.png",
    subConcepto: [],
  },
];
const initialFormatives: Formative[] = [
  { conceptId: 1, name: "Patrimonio", description: "Conjunto de bienes..." },
];

/* --- Helper Exportado Principal --- */
export const dataHelper = {
  // LECTURA LOCAL (Legacy / Fallback)
  getTechnicalFamilies(): Family[] {
    return getInitialData(STORAGE_KEYS.FAMILIES, initialFamilies);
  },
  getFamilyById(id: number) {
    return this.getTechnicalFamilies().find((f) => f.idFamilies === id);
  },
  getSubConceptById(fid: number, cid: number) {
    return this.getFamilyById(fid)?.subConcepto?.find(
      (s) => s.conceptId === cid
    );
  },
  getFormativeConcepts(): Formative[] {
    return getInitialData(STORAGE_KEYS.FORMATIVES, initialFormatives);
  },
  getFormativeById(id: number) {
    return this.getFormativeConcepts().find((c) => c.conceptId === id);
  },

  // -----------------------------------------------------------------------
  // LECTURA REAL (Con protección automática de Token y Expiración)
  // -----------------------------------------------------------------------

  async getAllAportes(): Promise<Aporte[]> {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/aportes`);
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error("Error fetching aportes:", error);
      // Si el error fue por expiración (throw en fetchWithAuth), se propaga y redirige.
      // Si es otro error de red, retornamos vacío para no romper la UI.
      return [];
    }
  },

  async getRealFamilias(): Promise<FamiliaDTO[]> {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/familias`);
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error("Error fetching familias:", error);
      return [];
    }
  },

  async getRealTecnicos(): Promise<ConceptoTecnicoDTO[]> {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/conceptos-tecnicos`);
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error("Error fetching tecnicos:", error);
      return [];
    }
  },

  async getRealFormativos(): Promise<ConceptoFormativoDTO[]> {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/conceptos-formativos`);
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error("Error fetching formativos:", error);
      return [];
    }
  },

  async getRealFormativeId(id: number) {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/conceptos-formativos/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error("Error fetching formative detail:", error);
      return null;
    }
  },

  // -----------------------------------------------------------------------
  // ESCRITURA (Usan postToApi que ya integra fetchWithAuth)
  // -----------------------------------------------------------------------

  // 1. Proponer Familia
  async addTechnicalFamily(payload: {
    name: string;
    descriptions?: string;
    componentItemn?: string;
    image?: string;
  }): Promise<void> {
    const userId = getCurrentUserId();
    await postToApi("aportes", {
      idUsuario: userId,
      tipoObjeto: "FAMILIA",
      nombrePropuesto: payload.name,
      descripcionPropuesto: payload.descriptions || "Sin descripción.",
    });
  },

  // 2. Proponer Concepto Formativo
  async addFormativeConcept(payload: {
    name: string;
    description: string;
    image?: string;
  }): Promise<void> {
    const userId = getCurrentUserId();
    await postToApi("aportes", {
      idUsuario: userId,
      tipoObjeto: "FORMATIVO",
      nombrePropuesto: payload.name,
      descripcionPropuesto: payload.description,
    });
  },

  // 3. Proponer Subconcepto Técnico
  async addSubConcept(
    familyId: number,
    payload: { name: string; description?: string; image?: string }
  ): Promise<void> {
    const userId = getCurrentUserId();
    await postToApi("aportes", {
      idUsuario: userId,
      tipoObjeto: "TECNICO",
      nombrePropuesto: payload.name,
      descripcionPropuesto: payload.description || "Sin descripción.",
      idFamilia: familyId,
    });
  },

  // --- REVISIÓN (ADMIN) ---
  async reviewAporte(
    idAporte: number,
    estado: "APROBADO" | "RECHAZADO",
    motivo: string = ""
  ): Promise<void> {
    const adminId = getCurrentUserId(); 

    const payload = {
      idAdmin: adminId,
      estado: estado,
      motivoRechazo: motivo,
    };

    const url = `${API_BASE_URL}/aportes/${idAporte}/revision`;

    // Usamos fetchWithAuth para PUT
    const response = await fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = "Error al procesar la revisión.";
      try {
        const data = await response.json();
        errorMsg = data.message || JSON.stringify(data);
      } catch {}
      throw new Error(errorMsg);
    }
  },

  // Utilidades de limpieza
  resetToInitial() {
    saveToStorage(STORAGE_KEYS.FAMILIES, initialFamilies);
    saveToStorage(STORAGE_KEYS.FORMATIVES, initialFormatives);
  },
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.FAMILIES);
    localStorage.removeItem(STORAGE_KEYS.FORMATIVES);
  },
};

export default dataHelper;