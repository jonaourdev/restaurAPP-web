import React, { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "./../router";
import Swal from "sweetalert2";
import axios from "axios"; 
import "../css/AuthForm.css";

// URL directa o importada desde Helper (según prefieras)
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
  const [loginData, setLoginData] = useState<LoginProps>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validación simple de campos vacíos
    if (!loginData.email || !loginData.password) {
      Swal.fire({ 
        icon: "warning", 
        title: "Campos incompletos", 
        text: "Por favor ingresa tu email y contraseña." 
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Petición POST con Axios
      const response = await axios.post(API_LOGIN_URL, {
        email: loginData.email,
        password: loginData.password
      });

      const responseData = response.data;

      // 2. Validar y Guardar Token
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      } else {
        throw new Error("El servidor no devolvió un token de acceso.");
      }

      // 3. Normalizar y Guardar Usuario
      // Importante: .replace("ROLE_", "") asegura que "ROLE_ADMIN" se guarde como "ADMIN"
      // para coincidir con las reglas de tu router.tsx
      const rawRole = responseData.rol || "USER";
      const normalizedRole = rawRole.replace("ROLE_", "");

      const currentUser: CurrentUser = {
        id: responseData.idUsuario,
        fullName: responseData.nombres 
          ? `${responseData.nombres} ${responseData.apellidos}` 
          : responseData.username || "Usuario",
        email: responseData.correo || loginData.email,
        role: normalizedRole, 
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // 4. Feedback y Redirección
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: `Bienvenido, ${currentUser.fullName}`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        // Redirigir según el rol
        if (currentUser.role === "ADMIN") {
          navigate(routes.adminDashboardPage);
        } else {
          // Usuario normal va a la página de conceptos (o home)
          navigate(routes.conceptPage); 
        }
      });

    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "No se pudo conectar con el servidor.";
      
      // Si el servidor respondió con error (401, 403, 404...)
      if (error.response) {
        // Intentamos leer el mensaje que manda el backend o usamos uno genérico
        errorMessage = error.response.data?.message || "Credenciales inválidas o error en el servidor.";
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta (Backend caído)
        errorMessage = "El servidor no responde. Verifica tu conexión.";
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
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center">
            <Card.Title as="h1" className="h3 mb-1">Inicia sesión</Card.Title>
            <Card.Text className="auth-subtitle">Ingresa abajo rellenando con tus datos</Card.Text>
          </div>
          <div className="mt-4">
            <Form noValidate onSubmit={handleSubmit}>
              
              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="text-muted">Correo electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  placeholder="nombre@ejemplo.com" 
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
                  placeholder="Ingresa tu contraseña" 
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
                ¿No tienes cuenta? <Link to={routes.registerPage} className="auth-link">Regístrate</Link>.
              </Card.Text>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;