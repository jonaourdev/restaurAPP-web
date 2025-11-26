// src/components/LoginForm.tsx

import React, { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "./../router";
import { API_BASE_URL } from "../utils/Helper";
import Swal from "sweetalert2";
import "../css/AuthForm.css";

interface LoginProps {
  email: string;
  password: string;
}

interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

const API_LOGIN_URL = `${API_BASE_URL}/usuarios/login`;

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

    setTimeout(async () => {
      // Validación de campos
      if (!loginData.email || !loginData.password) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor ingresa tu email y contraseña.",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(API_LOGIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: loginData.email,
            password: loginData.password,
          }),
        });

        if (!response.ok) {
          let errorMessage = "Credenciales inválidas.";
          try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
          } catch (_) {}

          Swal.fire({
            icon: "error",
            title: "Error de autenticación",
            text: errorMessage,
          });

          setIsLoading(false);
          return;
        }

        const userData = await response.json();

        const currentUser: CurrentUser = {
          id: userData.idUsuario,
          fullName: `${userData.nombres} ${userData.apellidos}`,
          email: userData.correo,
          role: userData.rol,
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        Swal.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!",
          text: `Bienvenido, ${currentUser.fullName}`,
        }).then(() => {
          if (currentUser.role === "ADMIN") {
            navigate(routes.adminDashboardPage);
          } else {
            navigate(routes.conceptPage);
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor.",
        });
      }

      setIsLoading(false);
    }, 400);
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
                      <Spinner animation="border" size="sm" />
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
