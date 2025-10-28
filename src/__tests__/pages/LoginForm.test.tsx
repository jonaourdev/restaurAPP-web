import {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
  vi,
} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import LoginForm from "../../components/LoginForm";

// helper para Router
const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// guardo original por si tu vitest no tiene `unstubAllGlobals`
const originalLocation = window.location;
const originalAlert = window.alert;

// referencia al mock de alert
let alertMock: ReturnType<typeof vi.fn>;

beforeAll(() => {
  // permitir escribir en href
  Object.defineProperty(window, "location", {
    writable: true,
    value: {...originalLocation, href: ""},
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {value: originalLocation});
  window.alert = originalAlert; // por si acaso
});

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();

  // 👇 en vez de spyOn:
  alertMock = vi.fn();
  vi.stubGlobal("alert", alertMock); // window.alert = mock
  (window.location as any).href = "";
});

afterEach(() => {
  vi.restoreAllMocks(); // limpia llamadas y spies
  // si tu versión lo tiene, descomenta:
  // vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("<LoginForm />", () => {
  it("muestra alerta si faltan datos y no navega", async () => {
    const user = userEvent.setup({delay: null});
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText(/correo/i), "foo@bar.com");
    await user.click(screen.getByRole("button", {name: /ingresar/i}));

    vi.advanceTimersByTime(1500);

    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, ingresa tu email y contraseña."
    );
    expect((window.location as any).href).not.toContain("/conceptPage");
    expect(screen.getByRole("button", {name: /ingresar/i})).not.toBeDisabled();
  });

  it("muestra alerta si el usuario no existe y re-habilita el botón", async () => {
    const user = userEvent.setup({delay: null});
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText(/correo/i), "no@existe.com");
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", {name: /ingresar/i}));

    // durante la espera
    expect(screen.getByRole("button", {name: /Ingresando/i})).toBeDisabled();

    vi.advanceTimersByTime(1500);

    // 👇 usa alertMock en vez de alertSpy
    expect(alertMock).toHaveBeenCalledWith(
      "Usuario no encontrado. Por favor, regístrate primero."
    );
    expect((window.location as any).href).not.toContain("/conceptPage");
    expect(screen.getByRole("button", {name: /ingresar/i})).not.toBeDisabled();
  });

  it("inicia sesión con credenciales válidas, guarda currentUser y redirige", async () => {
    const user = userEvent.setup({delay: null});
    // Semilla de usuarios en localStorage
    localStorage.setItem(
      "users",
      JSON.stringify([
        {fullName: "Jane Roe", email: "jane@roe.com", password: "abc12345"},
      ])
    );

    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText(/correo/i), "jane@roe.com");
    await user.type(screen.getByLabelText(/contraseña/i), "abc12345");
    await user.click(screen.getByRole("button", {name: /ingresar/i}));

    vi.advanceTimersByTime(1500);

    // Verifica que guardó currentUser SIN password
    const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
    expect(current).toEqual({fullName: "Jane Roe", email: "jane@roe.com"});

    // Verifica “redirección” por escritura en href
    expect((window.location as any).href).toBe("/conceptPage");
  });
});
