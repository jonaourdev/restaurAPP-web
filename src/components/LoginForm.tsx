// src/components/LoginForm.tsx

import React, { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "./../router";
import { API_BASE_URL } from "../utils/Helper";

interface LoginProps {
  email: string;
  password: string;
}

// CORRECCIÓN 1: Agregar el ID a la interfaz del usuario guardado
interface CurrentUser {
  id: number; // <--- NUEVO CAMPO
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

    if (!loginData.email || !loginData.password) {
      alert("Por favor, ingresa tu email y contraseña.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            correo: loginData.email, 
            password: loginData.password 
        }),
      });

      if (!response.ok) {
        let errorMessage = "Credenciales inválidas.";
        try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      
      // CORRECCIÓN 2: Guardar el ID que viene del backend
      const currentUser: CurrentUser = {
        id: userData.idUsuario, // <--- GUARDAR ID REAL
        fullName: `${userData.nombres} ${userData.apellidos}`,
        email: userData.correo,
        role: userData.rol, 
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      alert(`¡Inicio de sesión exitoso! Bienvenido, ${currentUser.fullName}.`);

      if (currentUser.role === "ADMIN") {
        navigate(routes.adminDashboardPage);
      } else {
        window.location.href = routes.conceptPage; 
      }
      
    } catch (error) {
      console.error("Error de login:", error);
      alert(error instanceof Error ? error.message : "Error al iniciar sesión.");
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="shadow-lg w-100 bg-dark text-white" style={{ maxWidth: 480 }}>
        <Card.Body>
          <div className="text-center">
            <Card.Title as="h1" className="h3 mb-1 text-warning">Inicia sesión</Card.Title>
            <Card.Text className="text-muted">Ingresa tus credenciales</Card.Text>
          </div>
          <div className="mt-4">
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="text-muted">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="admin@restaurapp.cl"
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
                <Button type="submit" variant="warning" size="lg" disabled={isLoading}>
                  {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Ingresar"}
                </Button>
              </div>
              <Card.Text className="text-center text-muted mt-4 mb-0">
                ¿No tienes cuenta? <Link to="/registerPage" className="text-warning">Regístrate</Link>
              </Card.Text>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;