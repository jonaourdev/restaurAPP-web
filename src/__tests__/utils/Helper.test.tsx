// Importa las funciones necesarias de vitest
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Importa el CÓDIGO que vamos a probar
// (Asegúrate que esta ruta sea correcta. Si están en la misma carpeta, usa './')
import { dataHelper } from '../../utils/Helper';

// --- Inicio de las Pruebas ---

// Agrupamos todas las pruebas para dataHelper
describe('dataHelper', () => {
  
  // SOLUCIÓN: Antes de CADA prueba, reseteamos los datos a su estado inicial.
  beforeEach(() => {
    dataHelper.resetToInitial();
    
    // Burlamos (mock) console.error para que no ensucie la terminal
    // (Útil si 'saveToStorage' falla en un test y no quieres ver el log)
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // --- Pruebas para "Formative Concepts" ---
  describe('Formative Concepts', () => {
    
    it('debería devolver los conceptos formativos iniciales', () => {
      const concepts = dataHelper.getFormativeConcepts();
      // Verificamos que tenga 2 conceptos (los de tus datos iniciales)
      expect(concepts.length).toBe(2);
      expect(concepts[0].name).toBe('Patrimonio');
    });

    it('debería agregar un nuevo concepto formativo', () => {
      const newConceptData = {
        name: 'Nuevo Concepto',
        description: 'Una descripción de prueba',
      };
      const newConcept = dataHelper.addFormativeConcept(newConceptData);

      // Verificamos que el concepto devuelto sea correcto
      expect(newConcept.name).toBe('Nuevo Concepto');
      // 1 (Patrimonio), 2 (Conservación), 3 (Nuevo)
      expect(newConcept.conceptId).toBe(3); 

      // Verificamos que se haya guardado (obteniendo la lista de nuevo)
      const concepts = dataHelper.getFormativeConcepts();
      expect(concepts.length).toBe(3);
      expect(concepts[2].name).toBe('Nuevo Concepto');
    });

    it('debería encontrar un concepto formativo por ID', () => {
      const concept = dataHelper.getFormativeById(2); // Buscamos "Conservación"
      expect(concept).toBeDefined(); // Verificamos que lo encontró
      expect(concept?.name).toBe('Conservación');
    });

    it('debería devolver undefined si el ID formativo no existe', () => {
      const concept = dataHelper.getFormativeById(999);
      expect(concept).toBeUndefined(); // Verificamos que NO lo encontró
    });
  });

  // --- Pruebas para "Technical Families" ---
  describe('Technical Families', () => {
    
    it('debería devolver las familias técnicas iniciales', () => {
      const families = dataHelper.getTechnicalFamilies();
      expect(families.length).toBe(2);
      expect(families[0].name).toBe('Columna');
    });

    it('debería agregar una nueva familia técnica', () => {
      const newFamilyData = {
        name: 'Muro',
        descriptions: 'Elemento de cierre',
      };
      const newFamily = dataHelper.addTechnicalFamily(newFamilyData);

      expect(newFamily.name).toBe('Muro');
      // 1 (Columna), 2 (Arco), 3 (Muro)
      expect(newFamily.idFamilies).toBe(3); 
      expect(newFamily.subConcepto).toEqual([]); // Debe inicializarse vacío

      const families = dataHelper.getTechnicalFamilies();
      expect(families.length).toBe(3);
      expect(families[2].name).toBe('Muro');
    });
  });

  // --- Pruebas para "SubConcepts" ---
  describe('SubConcepts', () => {
    
    it('debería agregar un nuevo SubConcept a una familia', () => {
      const newSubConceptData = {
        name: 'Columna Jónica',
        description: 'Con volutas',
      };
      // Agregamos un sub-concepto a la Familia 1 (Columna)
      const newSub = dataHelper.addSubConcept(1, newSubConceptData);

      expect(newSub).toBeDefined();
      expect(newSub?.name).toBe('Columna Jónica');
      // 101 (Dórica) ya existía, el nuevo debe ser 102
      expect(newSub?.conceptId).toBe(102); 

      // Verificamos que se guardó
      const family = dataHelper.getFamilyById(1);
      expect(family?.subConcepto?.length).toBe(2);
      expect(family?.subConcepto?.[1].name).toBe('Columna Jónica');
    });

    it('debería devolver null si la familia no existe al agregar SubConcept', () => {
      const newSub = dataHelper.addSubConcept(999, { name: 'Test' });
      expect(newSub).toBeNull();
    });

    it('debería encontrar un SubConcept por ID', () => {
      // Buscamos el ID 101 (Dórica) en la Familia 1 (Columna)
      const sub = dataHelper.getSubConceptById(1, 101);
      expect(sub).toBeDefined();
      expect(sub?.name).toBe('Columna Dórica');
    });
  });

  // --- Pruebas para las utilidades (reset/clear) ---
  describe('Storage Utils', () => {
    
    it('debería limpiar todo el storage', () => {
      // Agregamos algo
      dataHelper.addFormativeConcept({ name: 'Test', description: '...' });
      // Verificamos que existe (2 iniciales + 1 nuevo = 3)
      expect(dataHelper.getFormativeConcepts().length).toBe(3);
      
      // Limpiamos
      dataHelper.clearAll();

      // Verificamos que vuelve a los datos iniciales (porque getInitialData los devuelve)
      const concepts = dataHelper.getFormativeConcepts();
      expect(concepts.length).toBe(2);
    });
    
    it('debería resetear al estado inicial', () => {
      // 1. Agregamos algo
      dataHelper.addFormativeConcept({ name: 'Test', description: '...' });
      // 2. Verificamos que se agregó (longitud 3)
      const conceptsAdded = dataHelper.getFormativeConcepts();
      expect(conceptsAdded.length).toBe(3);

      // 3. Reseteamos
      dataHelper.resetToInitial();
      
      // 4. Verificamos que volvió a la longitud inicial (longitud 2)
      const conceptsReset = dataHelper.getFormativeConcepts();
      expect(conceptsReset.length).toBe(2);
      expect(conceptsReset[0].name).toBe('Patrimonio');
    });

  });
});