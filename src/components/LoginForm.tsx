import { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/AuthForm.css"; 

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

    setTimeout(() => {
      if (!loginData.email || !loginData.password) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor ingresa tu email y contraseña.",
          confirmButtonColor: "#3085d6",
        });
        setIsLoading(false);
        return;
      }

      const usersJSON = localStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      const foundUser = users.find(
        (user: any) =>
          user.email === loginData.email && user.password === loginData.password
      );

      if (foundUser) {
        const currentUser = {
          fullName: foundUser.fullName,
          email: foundUser.email,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        Swal.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!",
          text: "Bienvenido/a a RestaurAPP",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          navigate("/conceptPage");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "Revisa tus datos o regístrate primero.",
          confirmButtonColor: "#d33",
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center">
            <Card.Title as="h1" className="h3 mb-1">
              Inicia sesión
            </Card.Title>
            <Card.Text className="auth-subtitle">
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
                  className="auth-submit-btn"
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
                <Link to="/registerPage" className="auth-link">
                  Regístrate
                </Link>
                .
              </Card.Text>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;
