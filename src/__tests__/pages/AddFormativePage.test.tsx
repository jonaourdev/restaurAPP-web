import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// 1. Importa el componente que vamos a probar
import AddFormativePage from '../../pages/AddFormativePage'; // Ajusta esta ruta

// 2. Importa y "burla" (mock) las dependencias
import { dataHelper } from '../../utils/Helper'; // Ajusta esta ruta
import { routes } from '../../router'; // Ajusta esta ruta

// Burlamos el módulo dataHelper
vi.mock('../../utils/Helper', () => ({
  dataHelper: {
    addFormativeConcept: vi.fn(), // Creamos un "espía" en la función
  },
}));

// Burlamos las rutas (solo necesitamos la que usa el componente)
vi.mock('../../router', () => ({
  routes: {
    FormativeConceptPage: '/conceptos-formativos', // Damos un valor falso
  },
}));

// --- Inicio de las Prpruebas ---

describe('<AddFormativePage />', () => {
  // Creamos una variable para el espía del "user"
  let user;

  // Antes de cada prueba, reseteamos el usuario y los mocks
  beforeEach(() => {
    user = userEvent.setup();
    // Limpiamos el historial de llamadas del mock
    vi.mocked(dataHelper.addFormativeConcept).mockClear();
  });

  // Prueba 1: Renderizado
  it('debería renderizar todos los campos del formulario y botones', () => {
    // Renderizamos el componente dentro de un Router (necesario por 'navigate')
    render(
      <MemoryRouter>
        <AddFormativePage />
      </MemoryRouter>
    );

    // Buscamos los campos por su "Label" (como lo haría un usuario)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByLabelText(/URL de imagen/i)).toBeInTheDocument();

    // Buscamos los botones por su "Rol" y nombre
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  // Prueba 2: Lógica de envío (exitosa)
  it('debería llamar a dataHelper y navegar al enviar el formulario con datos válidos', async () => {
    render(
      <MemoryRouter initialEntries={['/anadir']}>
        {/* Usamos <Routes> para poder testear la navegación */}
        <Routes>
          <Route path="/anadir" element={<AddFormativePage />} />
          <Route
            path={routes.FormativeConceptPage}
            element={<div>Página de Lista</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // 1. Simular que el usuario escribe en los campos
    const nombreInput = screen.getByLabelText('Nombre');
    const descInput = screen.getByLabelText('Descripción');
    const guardarBtn = screen.getByRole('button', { name: 'Guardar' });

    await user.type(nombreInput, 'Nuevo Patrimonio');
    await user.type(descInput, 'Descripción de prueba');

    // 2. Simular el clic en "Guardar"
    await user.click(guardarBtn);

    // 3. Verificar (Assert)
    // Verificamos que addFormativeConcept fue llamado 1 vez
    expect(dataHelper.addFormativeConcept).toHaveBeenCalledTimes(1);
    
    // Verificamos que fue llamado CON LOS DATOS CORRECTOS
    expect(dataHelper.addFormativeConcept).toHaveBeenCalledWith({
      name: 'Nuevo Patrimonio',
      description: 'Descripción de prueba',
      image: undefined,
    });

    // Verificamos que navegó a la página de lista
    expect(screen.getByText('Página de Lista')).toBeInTheDocument();
  });

  // Prueba 3: Lógica de validación (fallida)
  it('NO debería llamar a dataHelper si el nombre está vacío', async () => {
    render(
      <MemoryRouter>
        <AddFormativePage />
      </MemoryRouter>
    );

    // 1. Simular (No escribimos nada en "Nombre")
    const guardarBtn = screen.getByRole('button', { name: 'Guardar' });

    // 2. Clic
    await user.click(guardarBtn);

    // 3. Verificar
    // Verificamos que NUNCA se llamó a la función
    expect(dataHelper.addFormativeConcept).not.toHaveBeenCalled();
  });
});