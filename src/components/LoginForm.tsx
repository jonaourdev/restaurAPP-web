// src/components/LoginForm.tsx

import React, { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "./../router";

interface LoginProps {
  email: string;
  password: string;
}

// Interfaz para el objeto de usuario que se guarda en localStorage
interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

// Endpoint de tu backend para el LOGIN
const API_LOGIN_URL = "http://localhost:8090/api/v1/login";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginData.email || !loginData.password) {
      alert("Por favor, ingresa tu email y contraseña.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. LLAMADA REAL AL ENDPOINT DE LOGIN (Spring Security)
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            correo: loginData.email, 
            contrasenna: loginData.password 
        }),
      });

      if (!response.ok) {
        // Manejar error 401 (Unauthorized) devuelto por Spring Security si falla la autenticación
        throw new Error("Credenciales inválidas. Correo o contraseña incorrectos.");
      }

      // 2. El backend devuelve UsuarioResponseDTO (que incluye nombres, apellidos y rol)
      const userData = await response.json();
      
      const currentUser: CurrentUser = {
        fullName: `${userData.nombres} ${userData.apellidos}`,
        email: userData.correo,
        role: userData.rol, // ROLE_ADMIN, ROLE_USUARIO, etc.
      };

      // 3. Guardar el usuario actual (con el rol) en la sesión.
      // (Aquí se debería guardar también el Token JWT si lo estuvieras usando)
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      alert(`¡Inicio de sesión exitoso! Bienvenido, ${currentUser.fullName}.`);

      // 4. REDIRECCIÓN BASADA EN ROL
      if (currentUser.role === "ROLE_ADMIN") {
        navigate(routes.adminDashboard);
      } else {
        // Redirección para usuarios normales
        // Usamos window.location.href para forzar la recarga y actualizar el Navbar.
        window.location.href = routes.conceptPage; 
      }
      
    } catch (error) {
      console.error("Error de login:", error);
      alert(error instanceof Error ? error.message : "Ocurrió un error al intentar iniciar sesión.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="shadow-lg w-100 bg-dark text-white" style={{ maxWidth: 480 }}>
          <Card.Body>
            <div className="text-center">
              <Card.Title as="h1" className="h3 mb-1 text-warning">
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
                    className="bg-secondary text-white border-0"
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
                    className="bg-secondary text-white border-0"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="warning"
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
                  <Link to="/registerPage" className="text-decoration-none text-warning">
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