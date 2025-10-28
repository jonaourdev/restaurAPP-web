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
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import LoginForm from "../../components/LoginForm";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const originalLocation = window.location;
const originalAlert = window.alert;

let alertMock: ReturnType<typeof vi.fn>;

beforeAll(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: {...originalLocation, href: ""},
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {value: originalLocation});
  window.alert = originalAlert;
});

beforeEach(() => {
  localStorage.clear();
  alertMock = vi.fn();
  vi.stubGlobal("alert", alertMock);
  (window.location as any).href = "";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("<LoginForm />", () => {
  it("muestra alerta si faltan datos y no navega", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText(/correo/i), "foo@bar.com");
    await user.click(screen.getByRole("button", {name: /ingresar/i}));

    // espera a que caiga el alert del setTimeout(1500)
    await waitFor(
      () =>
        expect(alertMock).toHaveBeenCalledWith(
          "Por favor, ingresa tu email y contraseña."
        ),
      {timeout: 2000}
    );

    expect((window.location as any).href).not.toContain("/conceptPage");
    expect(screen.getByRole("button", {name: /ingresar/i})).not.toBeDisabled();
  });

  it("muestra alerta si el usuario no existe y re-habilita el botón", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText(/correo/i), "no@existe.com");
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", {name: /ingresar/i}));

    // durante la espera, el botón cambia a “Ingresando…” y queda deshabilitado
    const loadingBtn = await screen.findByRole("button", {name: /Ingresando/i});
    expect(loadingBtn).toBeDisabled();

    await waitFor(
      () =>
        expect(alertMock).toHaveBeenCalledWith(
          "Usuario no encontrado. Por favor, regístrate primero."
        ),
      {timeout: 2000}
    );

    expect((window.location as any).href).not.toContain("/conceptPage");
    expect(screen.getByRole("button", {name: /ingresar/i})).not.toBeDisabled();
  });

  it("inicia sesión con credenciales válidas, guarda currentUser y redirige", async () => {
    const user = userEvent.setup();
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

    // espera a que se setee currentUser y se cambie href
    await waitFor(
      () => {
        const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
        expect(current).toEqual({fullName: "Jane Roe", email: "jane@roe.com"});
        expect((window.location as any).href).toBe("/conceptPage");
      },
      {timeout: 2000}
    );
  });
});
