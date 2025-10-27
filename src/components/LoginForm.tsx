import { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

interface LoginProps {
  email: string;
  password: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginProps>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula una pequeña demora para el "proceso de inicio de sesión"
    setTimeout(() => {
      if (!loginData.email || !loginData.password) {
        alert("Por favor, ingresa tu email y contraseña.");
        setIsLoading(false);
        return;
      }

      // Obtener la lista de todos los usuarios registrados.
      const usersJSON = localStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      // Buscar un usuario que coincida con el email y la contraseña.
      const foundUser = users.find(
        (user: any) =>
          user.email === loginData.email && user.password === loginData.password
      );

      if (foundUser) {
        // 3. Si se encuentra, guardar solo al usuario actual en la sesión.
        // ¡IMPORTANTE! No guardamos la contraseña en la sesión activa.
        const currentUser = {
          fullName: foundUser.fullName,
          email: foundUser.email,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("¡Inicio de sesión exitoso!");
        window.location.href = "/conceptPage"; // Forzar recarga para actualizar el Navbar
      } else {
        alert("Usuario no encontrado. Por favor, regístrate primero.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="shadow-lg w-100" style={{ maxWidth: 480 }}>
          <Card.Body>
            <div className="text-center">
              <Card.Title as="h1" className="h3 mb-1">
                Inicia sesión
              </Card.Title>
              <Card.Text className="text-muted">
                Ingresa abajo rellenando con tus datos
              </Card.Text>
            </div>

            <div className="mt-4">
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="text-muted">
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    required
                    value={loginData.email}
                    onChange={handleChange}
                  />
                  {/* <Form.Control.Feedback type="invalid">Email inválido</Form.Control.Feedback> */}
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="text-muted">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                    value={loginData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Ingresando...</span>
                      </>
                    ) : (
                      "Ingresar"
                    )}
                  </Button>
                </div>

                <Card.Text className="text-center text-muted mt-4 mb-0">
                  ¿No tienes cuenta?{" "}
                  <Link to="/registerPage" className="text-decoration-none">
                    Regístrate
                  </Link>
                  .
                </Card.Text>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default LoginForm;
