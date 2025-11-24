import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {BrowserRouter} from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";

// Hacemos un mock del hook useNavigate de react-router-dom
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

describe("RegisterForm", () => {
  let alertMock: vi.SpyInstance;

  beforeEach(() => {
    // Hacemos un mock de window.alert para que no muestre pop-ups durante los tests
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Renderizamos el componente dentro de un BrowserRouter porque usa <Link> y useNavigate
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    // Hacemos un mock de localStorage para controlar los datos de los usuarios
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
  });

  afterEach(() => {
    // Restauramos todos los mocks después de cada test para evitar interferencias
    vi.restoreAllMocks();
  });

  it("debería renderizar el formulario de registro correctamente", () => {
    expect(
      screen.getByRole("heading", {name: /Crear cuenta/i})
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nombre y apellido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/tucorreo@dominio.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Mínimo 8 caracteres")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Repite tu contraseña/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: /Crear cuenta/i})
    ).toBeInTheDocument();
  });

  it("debería mostrar una alerta si los campos están vacíos al enviar", async () => {
    fireEvent.click(screen.getByRole("button", {name: /Crear cuenta/i}));

    await waitFor(
      () => {
        expect(alertMock).toHaveBeenCalledWith(
          "Por favor completa todos los campos."
        );
      },
      {timeout: 2000}
    );
  });

  it("debería mostrar una alerta si las contraseñas no coinciden", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Nombre y apellido/i), {
      target: {value: "Test User"},
    });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@dominio.com/i), {
      target: {value: "test@test.com"},
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: {value: "password123"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu contraseña/i), {
      target: {value: "password456"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Crear cuenta/i}));

    await waitFor(
      () => {
        expect(alertMock).toHaveBeenCalledWith("Las contraseñas no coinciden.");
      },
      {timeout: 2000}
    );
  });

  it("debería mostrar una alerta si la contraseña es muy corta", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Nombre y apellido/i), {
      target: {value: "Test User"},
    });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@dominio.com/i), {
      target: {value: "test@test.com"},
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: {value: "123"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu contraseña/i), {
      target: {value: "123"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Crear cuenta/i}));

    await waitFor(
      () => {
        expect(alertMock).toHaveBeenCalledWith(
          "La contraseña debe tener al menos 8 caracteres."
        );
      },
      {timeout: 2000}
    );
  });

  it("debería mostrar una alerta si el email ya existe", async () => {
    // Simulamos que ya existe un usuario con ese email en localStorage
    const existingUsers = [
      {
        email: "test@test.com",
        password: "password123",
        fullName: "Existing User",
      },
    ];
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(existingUsers)
    );

    fireEvent.change(screen.getByPlaceholderText(/Nombre y apellido/i), {
      target: {value: "Test User"},
    });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@dominio.com/i), {
      target: {value: "test@test.com"},
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: {value: "password123"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu contraseña/i), {
      target: {value: "password123"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Crear cuenta/i}));

    await waitFor(
      () => {
        expect(alertMock).toHaveBeenCalledWith(
          "Este correo electrónico ya está registrado."
        );
      },
      {timeout: 2000}
    );
  });

  it("debería registrar un nuevo usuario y redirigir al login en un envío exitoso", async () => {
    // Simulamos que no hay usuarios existentes
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("[]");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    // Rellenamos el formulario con datos válidos
    const fullNameInput = screen.getByPlaceholderText(/Nombre y apellido/i);
    const emailInput = screen.getByPlaceholderText(/tucorreo@dominio.com/i);
    const passwordInput = screen.getByPlaceholderText("Mínimo 8 caracteres");
    const confirmPasswordInput =
      screen.getByPlaceholderText(/Repite tu contraseña/i);
    const submitButton = screen.getByRole("button", {name: /Crear cuenta/i});

    fireEvent.change(fullNameInput, {target: {value: "Nuevo Usuario"}});
    fireEvent.change(emailInput, {target: {value: "nuevo@usuario.com"}});
    fireEvent.change(passwordInput, {target: {value: "passwordValido123"}});
    fireEvent.change(confirmPasswordInput, {
      target: {value: "passwordValido123"},
    });

    // Enviamos el formulario
    fireEvent.click(submitButton);

    // Esperamos a que se completen las operaciones asíncronas (el setTimeout)
    // Primero, verificamos que se muestre el estado de carga
    await waitFor(() => {
      expect(screen.getByText(/Creando cuenta.../i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Luego, verificamos el resultado final después del timeout
    await waitFor(
      () => {
        // Verificamos que se haya guardado el nuevo usuario en localStorage
        const expectedNewUser = {
          fullName: "Nuevo Usuario",
          email: "nuevo@usuario.com",
          password: "passwordValido123",
        };
        expect(setItemSpy).toHaveBeenCalledWith(
          "users",
          JSON.stringify([expectedNewUser])
        );

        // Verificamos que se muestre el mensaje de éxito
        expect(alertMock).toHaveBeenCalledWith(
          "¡Cuenta creada correctamente! Serás redirigido."
        );

        // Verificamos que se redirija a la página de login
        expect(mockedNavigate).toHaveBeenCalledWith("/loginPage");
      },
      {timeout: 2000}
    );
  });
});
