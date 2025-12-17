// src/components/LoginForm.tsx

import React, { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "./../router";
import Swal from "sweetalert2";
import axios from "axios"; // <--- 1. IMPORTAR AXIOS
import "../css/AuthForm.css";

// Puedes usar la constante API_BASE_URL del helper si quieres, o dejarlo directo
const API_LOGIN_URL = "http://localhost:8090/api/v1/auth/login";

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
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor ingresa tu email y contraseña.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // --- CAMBIO PRINCIPAL: USAR AXIOS ---
      const response = await axios.post(API_LOGIN_URL, {
        email: loginData.email,
        password: loginData.password,
      });

      // Axios lanza error si falla, así que si llegamos aquí, es ÉXITO (200 OK)
      const responseData = response.data;

      // Guardar Token
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      } else {
        throw new Error("El servidor no devolvió un token.");
      }

      // Guardar Usuario
      const currentUser: CurrentUser = {
        id: responseData.idUsuario,
        fullName: responseData.nombres
          ? `${responseData.nombres} ${responseData.apellidos}`
          : responseData.username || "Usuario",
        email: responseData.correo || loginData.email,
        role: responseData.rol || "USER",
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: `Bienvenido, ${currentUser.fullName}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (currentUser.role === "ADMIN" || currentUser.role === "ROLE_ADMIN") {
          navigate(routes.adminDashboardPage);
        } else {
          navigate(routes.conceptPage);
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);

      // Manejo de errores simplificado con Axios
      let errorMessage = "No se pudo conectar con el servidor.";

      if (error.response) {
        // El servidor respondió con un error (401, 400, 500...)
        errorMessage =
          error.response.data?.message || "Credenciales inválidas.";
      }

      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... (El resto de tu JSX queda EXACTAMENTE IGUAL) ...
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="auth-card">
        {/* ... Contenido del form ... */}
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
              {/* Inputs de Email y Password idénticos a como los tienes */}
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
                . Entrar como{" "}
                <Link to="/conceptPage" className="auth-link">
                  invitado
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
