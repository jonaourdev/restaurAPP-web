// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // <--- 1. Importar Axios
import "../css/AuthForm.css";
import { routes } from "../router";
import { API_BASE_URL } from "../utils/Helper"; // Puedes reusar la URL base si quieres

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserPayload {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasenna: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Validaciones (Igual que antes) ---
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Por favor completa todos los campos." });
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Contraseñas no coinciden", text: "Debes escribir la misma contraseña." });
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      Swal.fire({ icon: "error", title: "Contraseña demasiado corta", text: "Debe tener mínimo 8 caracteres." });
      setIsLoading(false);
      return;
    }

    // Preparar Payload
    const [nombres, ...apArr] = formData.fullName.trim().split(" ");
    const apellidos = apArr.length > 0 ? apArr.join(" ") : nombres; // Fallback simple

    const userPayload: UserPayload = {
      nombres,
      apellidos,
      correo: formData.email,
      contrasenna: formData.password,
    };

    try {
      // --- CAMBIO A AXIOS ---
      // Usamos la URL completa o la importada del Helper
      await axios.post(`${API_BASE_URL}/usuarios`, userPayload);

      // Si no hay error (catch), es éxito
      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Serás redirigido al inicio de sesión.",
        timer: 2000,
        showConfirmButton: false
      }).then(() => navigate(routes.loginPage));

    } catch (error: any) {
      console.error("Error de registro:", error);
      
      // Manejo de error limpio con Axios
      let msg = "El servidor no respondió correctamente.";
      if (error.response) {
        // El backend respondió con error (ej. 400 Bad Request por email duplicado)
        msg = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        msg = "No se pudo conectar al servidor.";
      }

      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... TU JSX SE MANTIENE EXACTAMENTE IGUAL ...
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center">
            <Card.Title as="h1" className="h3 mb-1">Crear cuenta</Card.Title>
            <Card.Text className="auth-subtitle">Regístrate para comenzar</Card.Text>
          </div>
          <div className="mt-4">
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="fullName">
                <Form.Label className="text-muted">Nombre completo</Form.Label>
                <Form.Control type="text" name="fullName" placeholder="Nombre y apellido" required value={formData.fullName} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="text-muted">Correo electrónico</Form.Label>
                <Form.Control type="email" name="email" placeholder="tucorreo@dominio.com" required value={formData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="text-muted">Contraseña</Form.Label>
                <Form.Control type="password" name="password" placeholder="Mínimo 8 caracteres" required value={formData.password} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label className="text-muted">Confirmar contraseña</Form.Label>
                <Form.Control type="password" name="confirmPassword" placeholder="Repite tu contraseña" required value={formData.confirmPassword} onChange={handleChange} />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="dark" size="lg" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </div>
              <Card.Text className="text-center text-muted mt-4 mb-0">
                ¿Ya tienes cuenta? <Link to={routes.loginPage} className="auth-link">Inicia sesión</Link>.
              </Card.Text>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;