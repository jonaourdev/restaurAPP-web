import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// 1. Importa el componente que vas a probar
// ¡IMPORTANTE: Ajusta esta ruta para que apunte a tu componente!
import AppFooter from '../../components/AppFooter'; 

// --- Inicio de las Pruebas ---

describe('<AppFooter />', () => {

  it('debería renderizarse correctamente y coincidir con el snapshot', () => {
    // 1. Renderizamos el componente.
    // Usamos 'container' que nos da el <div> raíz donde se renderizó todo.
    const { container } = render(<AppFooter />);
    
    // 2. Le decimos a Vitest que compare el HTML del 'container'
    // con la "foto" (snapshot) que tiene guardada.
    expect(container).toMatchSnapshot();
  });

});