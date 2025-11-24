import {describe, it, beforeEach, expect, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock de useNavigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {...actual, useNavigate: () => navigateMock};
});

//Declarar el mock en un bloque hoisted
const {addFamilyMock} = vi.hoisted(() => ({
  addFamilyMock: vi.fn(),
}));

// Mock del helper usando la variable hoisted
vi.mock("../../utils/Helper", () => ({
  dataHelper: {
    addTechnicalFamily: (...args: any[]) => addFamilyMock(...args),
  },
}));

import {MemoryRouter} from "react-router-dom";
import {routes} from "../../router";
import AddFamilyPage from "../../pages/AddFamilyPage";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  navigateMock.mockClear();
  addFamilyMock.mockClear();
});

//TESTS
describe("<AddFamilyPage />", () => {
  it("renderiza inputs y botones básicos", () => {
    renderWithRouter(<AddFamilyPage />);

    // Labels (busca por texto de las etiquetas)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/componentes.*base.*fuste.*capitel/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/url de imagen/i)).toBeInTheDocument();

    // Botones
    expect(screen.getByRole("button", {name: /guardar/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /cancelar/i})).toBeInTheDocument();

    // El campo "Nombre" es requerido
    expect(screen.getByLabelText(/nombre/i)).toBeRequired();
  });

  it("NO guarda ni navega si el nombre está vacío (o solo espacios)", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddFamilyPage />);

    // No llenamos "Nombre"
    await user.click(screen.getByRole("button", {name: /guardar/i}));

    expect(addFamilyMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("guarda con nombre y campos opcionales vacíos → 'undefined' para opcionales", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddFamilyPage />);

    await user.type(screen.getByLabelText(/nombre/i), "Dórico");
    // Dejar vacíos los otros tres

    await user.click(screen.getByRole("button", {name: /guardar/i}));

    // addTechnicalFamily llamado una vez con shape correcto
    expect(addFamilyMock).toHaveBeenCalledTimes(1);
    expect(addFamilyMock).toHaveBeenCalledWith({
      name: "Dórico",
      descriptions: undefined,
      componentItemn: undefined,
      image: undefined,
    });

    // Navega a la página de conceptos técnicos
    expect(navigateMock).toHaveBeenCalledWith(routes.TechnicalConceptPage);
  });

  it("trimea los valores y guarda correctamente", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddFamilyPage />);

    await user.type(screen.getByLabelText(/nombre/i), "   Jónico   ");
    await user.type(
      screen.getByLabelText(/descripción/i),
      "  Columna con volutas  "
    );
    await user.type(
      screen.getByLabelText(/componentes/i),
      "  Base, Fuste, Capitel  "
    );
    await user.type(
      screen.getByLabelText(/url de imagen/i),
      "   /assets/column.png   "
    );

    await user.click(screen.getByRole("button", {name: /guardar/i}));

    expect(addFamilyMock).toHaveBeenCalledWith({
      name: "Jónico",
      descriptions: "Columna con volutas",
      componentItemn: "Base, Fuste, Capitel",
      image: "/assets/column.png",
    });
    expect(navigateMock).toHaveBeenCalledWith(routes.TechnicalConceptPage);
  });

  it("al presionar Cancelar navega hacia atrás (navigate(-1))", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddFamilyPage />);

    await user.click(screen.getByRole("button", {name: /cancelar/i}));
    expect(navigateMock).toHaveBeenCalledWith(-1);
    expect(addFamilyMock).not.toHaveBeenCalled();
  });
});
