// src/utils/Helper.tsx

// Tipos de datos para el frontend (basados en la simulación)
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

// Constantes para las claves de localStorage
const STORAGE_KEYS = {
    FAMILIES: "app:families",
    SUBCONCEPTS: "app:subconcepts",
    FORMATIVES: "app:formatives",
} as const;

// Constante para la URL del backend
const API_BASE_URL = "http://localhost:8080/api/v1";

/* --- Funciones de Utilidad de Storage (Lectura/Mocking) --- */

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
        console.error("saveToStorage error", e);
    }
}

/* --- Funciones de Utilidad de API (Escritura/Backend) --- */

// Función utilitaria para realizar peticiones POST
// T es el tipo de dato que se envía (Payload)
// R es el tipo de dato que se espera recibir (Response DTO)
async function postToApi<T>(endpoint: string, payload: T): Promise<void> {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    // NOTA: Agregar autenticación (Token JWT) aquí cuando esté implementado.

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${userToken}`, 
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorMsg = `Error al conectar con el servidor: Código ${response.status}.`;
        try {
            const errorData = await response.json();
            // Intenta extraer el mensaje de error si el backend lo proporciona (ej. correo duplicado)
            errorMsg = errorData.message || errorData.detail || errorMsg; 
        } catch (e) {
            // Si la respuesta no fue JSON, usamos el error por defecto
        }
        throw new Error(errorMsg);
    }
    
    // Si la respuesta es 201 Created (sin contenido específico que necesitemos devolver),
    // simplemente resolvemos la promesa.
}

/* --- Datos Iniciales (Mock) --- */

const initialFamilies: Family[] = [
    {
        idFamilies: 1,
        name: "Columna",
        descriptions: "Elemento estructural vertical",
        componentItemn: "Base, Fuste, Capitel",
        image: "/assets/column.png",
        subConcepto: [
            {
                conceptId: 101,
                familyId: 1,
                name: "Columna Dórica",
                description:
                    "Se caracteriza por tener columnas estriadas sin base, capiteles sencillos y lisos",
                image: "src\\assets\\dorica.png",
            },
        ],
    },
    {
        idFamilies: 2,
        name: "Arco",
        descriptions: "Estructura curva que salva un vano",
        componentItemn: "Clave, Dovelas, Imposta",
        image: "/assets/arch.png",
        subConcepto: [],
    },
];

const initialFormatives: Formative[] = [
    {
        conceptId: 1,
        name: "Patrimonio",
        description:
            "Bienes muebles e inmuebles, materiales e inmateriales de propiedad de particulares o de instituciones u organismos públicos o semipúblicos que tienen un valor excepcional desde el punto de vista de la historia, del arte, de la ciencia y de la cultura y por lo tanto sean dignos de ser considerados y conservados por la nación.",
        image: "src\\assets\\columna.png",
    },
    {
        conceptId: 2,
        name: "Conservación",
        description: "Conjunto de acciones preventivas y directas para resguardar el patrimonio para evitar o prevenir las alteraciones futuras de un bien determinado. \n Medidas adoptadas para que un bien determinado experimente el menor número de alteraciones durante el mayor tiempo posible.",
    },
];

/* --- API dataHelper (Conexión al Backend) --- */
export const dataHelper = {
    // --- LECTURA: Aún usa datos simulados/locales ---
    getTechnicalFamilies(): Family[] {
        return getInitialData<Family>(STORAGE_KEYS.FAMILIES, initialFamilies);
    },

    getFamilyById(id: number): Family | undefined {
        return this.getTechnicalFamilies().find((f) => f.idFamilies === id);
    },

    getSubConceptById(familyId: number, conceptId: number): SubConcept | undefined {
        const family = this.getFamilyById(familyId);
        return family?.subConcepto?.find((s) => s.conceptId === conceptId);
    },

    getFormativeConcepts(): Formative[] {
        return getInitialData<Formative>(STORAGE_KEYS.FORMATIVES, initialFormatives);
    },

    getFormativeById(id: number): Formative | undefined {
        return this.getFormativeConcepts().find((c) => c.conceptId === id);
    },

    // --- ESCRITURA: Usa la API del Backend ---

    // Equivalente a POST /api/v1/familias (Familia)
    async addTechnicalFamily(payload: Omit<Family, "idFamilies" | "subConcepto">): Promise<void> {
        // Mapeo al formato esperado por el backend (Familia.java)
        const familyPayload = {
            familyName: payload.name,
            // Asegura que los campos @NotBlank del backend no sean null/undefined
            familyDescription: payload.descriptions || "Sin descripción proporcionada.", 
            familyComponents: payload.componentItemn || "Sin componentes especificados.",
        };
        await postToApi("familias", familyPayload);
        // NOTA: Para que los tests pasen, deberás agregar aquí la lógica de guardar
        // en localStorage si no estás ejecutando con el backend.
    },

    // Equivalente a POST /api/v1/conceptos-formativos (ConceptoFormativo)
    async addFormativeConcept(payload: Omit<Formative, "conceptId">): Promise<void> {
        // Mapeo al formato esperado por el backend (ConceptoFormativo.java)
        const formativePayload = {
            formativeName: payload.name,
            formative_description: payload.description,
        };
        await postToApi("conceptos-formativos", formativePayload);
        // NOTA: Para que los tests pasen, deberás agregar aquí la lógica de guardar
        // en localStorage si no estás ejecutando con el backend.
    },

    // Equivalente a POST /api/v1/conceptos-tecnicos (ConceptoTecnico)
    async addSubConcept(familyId: number, concept: Omit<SubConcept, "conceptId" | "familyId">): Promise<void> {
        // Mapeo al formato esperado por el backend (ConceptoTecnico.java)
        const technicalPayload = {
            technicalName: concept.name,
            technicalDescription: concept.description || "Sin descripción proporcionada.",
            // El familyId se pierde ya que ConceptoTecnicoDTO no lo maneja. 
            // Si necesitas la asociación, el backend o el DTO deben actualizarse.
        };
        
        await postToApi("conceptos-tecnicos", technicalPayload);

        // --- Lógica de Mock/Local (Mantener Temporalmente para Tests/Lectura) ---
        // Si no se quiere depender del backend para que los componentes de lectura funcionen,
        // la siguiente lógica de mock DEBERÍA mantenerse y solo se usa la llamada API para el registro.
        // const families = this.getTechnicalFamilies();
        // const family = families.find((f) => f.idFamilies === familyId);
        // if (!family) return;
        // const nextId = Math.max(0, ...(family.subConcepto?.map((s) => s.conceptId) ?? [0])) + 1;
        // const newSub: SubConcept = { ...concept, conceptId: nextId, familyId };
        // family.subConcepto = family.subConcepto ?? [];
        // family.subConcepto.push(newSub);
        // saveToStorage(STORAGE_KEYS.FAMILIES, families);
    },

    // util
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