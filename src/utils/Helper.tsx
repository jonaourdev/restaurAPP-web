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
  idFamilia: number; //AGREGADO RECIEN TESTEAR
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
export {API_BASE_URL};

/* --- Helpers --- */
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

/* --- API --- */
async function postToApi<T>(endpoint: string, payload: T): Promise<void> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
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

/* --- Mock Data --- */
const initialFamilies: Family[] = [
  {
    idFamilies: 1,
    name: "Columna",
    descriptions: "...",
    componentItemn: "...",
    image: "/assets/columna.png",
    subConcepto: [],
  },
];
const initialFormatives: Formative[] = [
  {conceptId: 1, name: "Patrimonio", description: "..."},
];

/* --- Helper Exportado --- */
export const dataHelper = {
  // LECTURA LOCAL
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

  // LECTURA REAL (Dashboard)
  async getAllAportes(): Promise<Aporte[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/aportes`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },
  async getRealFamilias(): Promise<FamiliaDTO[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/familias`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },
  async getRealTecnicos(): Promise<ConceptoTecnicoDTO[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/conceptos-tecnicos`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },
  async getRealFormativos(): Promise<ConceptoFormativoDTO[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/conceptos-formativos`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },

  //LECTURA REAL (CONCEPTOS EN DETALLE)

  async getRealFormativeId(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/conceptos-formativos/${id}`);
      if (!res.ok) return null;

      return await res.json();
    } catch {
      return null;
    }
  },

  // --- ESCRITURA (AHORA APUNTA A "APORTES" PARA REVISIÓN) ---

  // 1. Proponer Familia
  async addTechnicalFamily(payload: {
    name: string;
    descriptions?: string;
  }): Promise<void> {
    const userId = getCurrentUserId();
    // Enviamos a /aportes en lugar de /familias
    await postToApi("aportes", {
      idUsuario: userId,
      tipoObjeto: "FAMILIA",
      nombrePropuesto: payload.name,
      descripcionPropuesto: payload.descriptions || "Sin descripción.",
    });
  },

  // 2. Proponer Concepto Formativo (SOLUCIÓN A TU PROBLEMA)
  async addFormativeConcept(payload: {
    name: string;
    description: string;
  }): Promise<void> {
    const userId = getCurrentUserId();
    // Enviamos a /aportes
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
    payload: {name: string; description?: string}
  ): Promise<void> {
    const userId = getCurrentUserId();
    // Enviamos a /aportes
    await postToApi("aportes", {
      idUsuario: userId,
      tipoObjeto: "TECNICO",
      nombrePropuesto: payload.name,
      descripcionPropuesto: payload.description || "Sin descripción.",
      idFamilia: familyId, // Enviamos la referencia a la familia
    });
  },

  // --- REVISIÓN (ADMIN) ---
  async reviewAporte(
    idAporte: number,
    estado: "APROBADO" | "RECHAZADO",
    motivo: string = ""
  ): Promise<void> {
    const adminId = getCurrentUserId(); // ID del admin logueado

    const payload = {
      idAdmin: adminId,
      estado: estado,
      motivoRechazo: motivo,
    };

    // Asumiendo ruta: /api/v1/aportes/{id}/revision (Ajusta si es diferente en tu backend)
    const url = `${API_BASE_URL}/aportes/${idAporte}/revision`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
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
