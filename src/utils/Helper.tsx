// src/utils/Helper.tsx
import axios from "axios";

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

// =========================================================================
// CONFIGURACIÓN DE AXIOS (Instancia Global)
// =========================================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. INTERCEPTOR DE REQUEST: Inyecta el Token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR DE RESPONSE: Maneja errores globales (Expiración)
api.interceptors.response.use(
  (response) => response.data, // Devuelve directamente la 'data' limpia
  (error) => {
    // Si la respuesta es 401 (Unauthorized) o 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Sesión expirada o inválida. Cerrando sesión...");
      
      // Limpiar credenciales
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      
      // Redirigir al login
      window.location.href = "/loginPage";
    }
    
    // Propagamos el error para que los componentes puedan mostrar alertas específicas si es necesario
    return Promise.reject(error);
  }
);


/* --- Helpers Locales --- */
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
  throw new Error("No se pudo identificar al usuario. Por favor inicia sesión.");
}

/* --- Función Auxiliar para manejar errores de Axios --- */
function handleAxiosError(error: any): never {
  let message = "Error desconocido de red";
  if (axios.isAxiosError(error)) {
    // Intentamos leer el mensaje que manda el backend
    message = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  throw new Error(message);
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

/* --- Objeto Principal Exportado --- */
export const dataHelper = {
  // LECTURA LOCAL (Legacy)
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

  // =======================================================================
  // LECTURA REAL (Con AXIOS)
  // =======================================================================

  async getAllAportes(): Promise<Aporte[]> {
    try {
      // api.get ya devuelve la data gracias al interceptor
      return await api.get<any, Aporte[]>("/aportes");
    } catch (error) {
      console.error("Error fetching aportes:", error);
      return [];
    }
  },

  async getRealFamilias(): Promise<FamiliaDTO[]> {
    try {
      return await api.get<any, FamiliaDTO[]>("/familias");
    } catch (error) {
      console.error("Error fetching familias:", error);
      return [];
    }
  },

  async getRealTecnicos(): Promise<ConceptoTecnicoDTO[]> {
    try {
      return await api.get<any, ConceptoTecnicoDTO[]>("/conceptos-tecnicos");
    } catch (error) {
      console.error("Error fetching tecnicos:", error);
      return [];
    }
  },

  async getRealFormativos(): Promise<ConceptoFormativoDTO[]> {
    try {
      return await api.get<any, ConceptoFormativoDTO[]>("/conceptos-formativos");
    } catch (error) {
      console.error("Error fetching formativos:", error);
      return [];
    }
  },

  async getRealFormativeId(id: number) {
    try {
      return await api.get<any, any>(`/conceptos-formativos/${id}`);
    } catch (error) {
      console.error("Error fetching formative detail:", error);
      return null;
    }
  },

  // =======================================================================
  // ESCRITURA (POST / PUT con AXIOS)
  // =======================================================================

  // 1. Proponer Familia
  async addTechnicalFamily(payload: {
    name: string;
    descriptions?: string;
    componentItemn?: string;
    image?: string;
  }): Promise<void> {
    try {
      const userId = getCurrentUserId();
      await api.post("/aportes", {
        idUsuario: userId,
        tipoObjeto: "FAMILIA",
        nombrePropuesto: payload.name,
        descripcionPropuesto: payload.descriptions || "Sin descripción.",
      });
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // 2. Proponer Concepto Formativo
  async addFormativeConcept(payload: {
    name: string;
    description: string;
    image?: string;
  }): Promise<void> {
    try {
      const userId = getCurrentUserId();
      await api.post("/aportes", {
        idUsuario: userId,
        tipoObjeto: "FORMATIVO",
        nombrePropuesto: payload.name,
        descripcionPropuesto: payload.description,
      });
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // 3. Proponer Subconcepto Técnico
  async addSubConcept(
    familyId: number,
    payload: { name: string; description?: string; image?: string }
  ): Promise<void> {
    try {
      const userId = getCurrentUserId();
      await api.post("/aportes", {
        idUsuario: userId,
        tipoObjeto: "TECNICO",
        nombrePropuesto: payload.name,
        descripcionPropuesto: payload.description || "Sin descripción.",
        idFamilia: familyId,
      });
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // --- REVISIÓN (ADMIN) ---
  async reviewAporte(
    idAporte: number,
    estado: "APROBADO" | "RECHAZADO",
    motivo: string = ""
  ): Promise<void> {
    try {
      const adminId = getCurrentUserId();
      await api.put(`/aportes/${idAporte}/revision`, {
        idAdmin: adminId,
        estado: estado,
        motivoRechazo: motivo,
      });
    } catch (error) {
      handleAxiosError(error);
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