// ...existing code...
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

const STORAGE_KEYS = {
    FAMILIES: "app:families",
    SUBCONCEPTS: "app:subconcepts",
    FORMATIVES: "app:formatives",
} as const;

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

/* --- initial data --- */
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
                image: "src\assets\dorica.png",
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
        image: "src\assets\columna.png",
    },
    {
        conceptId: 2,
        name: "Conservación",
        description: "Conjunto de acciones preventivas y directas para resguardar el patrimonio para evitar o prevenir las alteraciones futuras de un bien determinado. \n Medidas adoptadas para que un bien determinado experimente el menor número de alteraciones durante el mayor tiempo posible.",
    },
];

/* --- API --- */
export const dataHelper = {
    // Technical families (kept name used by components)
    getTechnicalFamilies(): Family[] {
        return getInitialData<Family>(STORAGE_KEYS.FAMILIES, initialFamilies);
    },

    addTechnicalFamily(payload: Omit<Family, "idFamilies" | "subConcepto">): Family {
        const families = this.getTechnicalFamilies();
        const nextId = Math.max(0, ...families.map((f) => f.idFamilies)) + 1;
        const newFamily: Family = { ...payload, idFamilies: nextId, subConcepto: [] };
        families.push(newFamily);
        saveToStorage(STORAGE_KEYS.FAMILIES, families);
        return newFamily;
    },

    getFamilyById(id: number): Family | undefined {
        return this.getTechnicalFamilies().find((f) => f.idFamilies === id);
    },

    addSubConcept(familyId: number, concept: Omit<SubConcept, "conceptId" | "familyId">): SubConcept | null {
        const families = this.getTechnicalFamilies();
        const family = families.find((f) => f.idFamilies === familyId);
        if (!family) return null;
        const nextId =
            Math.max(0, ...(family.subConcepto?.map((s) => s.conceptId) ?? [0])) + 1;
        const newSub: SubConcept = { ...concept, conceptId: nextId, familyId };
        family.subConcepto = family.subConcepto ?? [];
        family.subConcepto.push(newSub);
        saveToStorage(STORAGE_KEYS.FAMILIES, families);
        return newSub;
    },

    getSubConceptById(familyId: number, conceptId: number): SubConcept | undefined {
        const family = this.getFamilyById(familyId);
        return family?.subConcepto?.find((s) => s.conceptId === conceptId);
    },

    // Formative concepts
    getFormativeConcepts(): Formative[] {
        return getInitialData<Formative>(STORAGE_KEYS.FORMATIVES, initialFormatives);
    },

    addFormativeConcept(payload: Omit<Formative, "conceptId">): Formative {
        const list = this.getFormativeConcepts();
        const nextId = Math.max(0, ...list.map((c) => c.conceptId)) + 1;
        const newItem: Formative = { ...payload, conceptId: nextId };
        list.push(newItem);
        saveToStorage(STORAGE_KEYS.FORMATIVES, list);
        return newItem;
    },

    getFormativeById(id: number): Formative | undefined {
        return this.getFormativeConcepts().find((c) => c.conceptId === id);
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
// ...existing code...