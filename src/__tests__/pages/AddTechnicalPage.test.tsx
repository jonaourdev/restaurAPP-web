import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AddTechnical from "../../pages/AddTechnicalPage";
import { dataHelper, type Family } from "../../utils/Helper";

// Mock del hook useNavigate de react-router-dom
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock del dataHelper para controlar los datos durante el test
vi.mock("../../utils/Helper", async () => {
  const actualHelper = await vi.importActual<
    typeof import("../../utils/Helper")
  >("../../utils/Helper");
  return {
    ...actualHelper,
    dataHelper: {
      ...actualHelper.dataHelper,
      getTechnicalFamilies: vi.fn(),
      addSubConcept: vi.fn(),
    },
  };
});

const mockFamilies: Family[] = [
  { idFamilies: 1, name: "Familia Uno", descriptions: "Desc 1" },
  { idFamilies: 2, name: "Familia Dos", descriptions: "Desc 2" },
];

describe("AddTechnical", () => {
  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    vi.mocked(dataHelper.getTechnicalFamilies).mockClear();
    vi.mocked(dataHelper.addSubConcept).mockClear();
    mockedNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debería mostrar un mensaje si no hay familias técnicas", () => {
    // Simulamos que no hay familias
    vi.mocked(dataHelper.getTechnicalFamilies).mockReturnValue([]);

    render(
      <BrowserRouter>
        <AddTechnical />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/No hay familias técnicas. Crea una familia primero./i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("debería renderizar el formulario cuando hay familias", () => {
    // Simulamos que sí hay familias
    vi.mocked(dataHelper.getTechnicalFamilies).mockReturnValue(mockFamilies);

    render(
      <BrowserRouter>
        <AddTechnical />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Añadir subconcepto técnico/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Familia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();

    // Verificamos que las opciones del select se rendericen
    expect(
      screen.getByRole("option", { name: "Familia Uno" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Familia Dos" })
    ).toBeInTheDocument();
  });

  it("debería llamar a addSubConcept y navegar al enviar el formulario", async () => {
    vi.mocked(dataHelper.getTechnicalFamilies).mockReturnValue(mockFamilies);

    render(
      <BrowserRouter>
        <AddTechnical />
      </BrowserRouter>
    );

    const familySelect = screen.getByLabelText(/Familia/i);
    const nameInput = screen.getByLabelText(/Nombre/i);
    const descriptionInput = screen.getByLabelText(/Descripción/i);
    const imageInput = screen.getByLabelText(/URL de imagen/i);
    const saveButton = screen.getByRole("button", { name: /Guardar/i });

    // Simulamos la interacción del usuario
    await fireEvent.change(familySelect, { target: { value: "2" } });
    await fireEvent.change(nameInput, {
      target: { value: "Nuevo Subconcepto" },
    });
    await fireEvent.change(descriptionInput, {
      target: { value: "Una descripción detallada." },
    });
    await fireEvent.change(imageInput, { target: { value: "/img.png" } });

    // Enviamos el formulario
    fireEvent.click(saveButton);

    // Esperamos a que las aserciones se cumplan
    await waitFor(() => {
      // Verificamos que se llamó a la función para añadir el subconcepto con los datos correctos
      expect(dataHelper.addSubConcept).toHaveBeenCalledWith(2, {
        name: "Nuevo Subconcepto",
        description: "Una descripción detallada.",
        image: "/img.png",
      });

      // Verificamos que se navega a la página de la familia correcta
      expect(mockedNavigate).toHaveBeenCalledWith("/familia/2");
    });
  });

  it("no debería hacer nada si el nombre está vacío", async () => {
    vi.mocked(dataHelper.getTechnicalFamilies).mockReturnValue(mockFamilies);

    render(
      <BrowserRouter>
        <AddTechnical />
      </BrowserRouter>
    );

    // Solo seleccionamos una familia pero no ponemos nombre
    await fireEvent.change(screen.getByLabelText(/Familia/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    // Verificamos que no se llamó a addSubConcept ni se navegó
    expect(dataHelper.addSubConcept).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("debería navegar hacia atrás al hacer clic en Cancelar", () => {
    vi.mocked(dataHelper.getTechnicalFamilies).mockReturnValue(mockFamilies);
    render(
      <BrowserRouter>
        <AddTechnical />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
