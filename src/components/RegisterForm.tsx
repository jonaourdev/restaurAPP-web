import { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/AuthForm.css"; // <-- IMPORTANTE

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { routes } from "../router"; // Asumo que tienes un archivo de rutas

// Interface para el estado del formulario
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface para el payload que espera el backend (UsuarioCreateDTO)
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor completa todos los campos.",
          confirmButtonColor: "#3085d6",
        });
        setIsLoading(false);
        return;
    }

      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Contraseñas no coinciden",
          text: "Asegúrate de escribir la misma contraseña.",
          confirmButtonColor: "#d33",
        });
        setIsLoading(false);
        return;
    }

    if (formData.password.length < 8) {
  Swal.fire({
    icon: "error",
    title: "Contraseña demasiado corta",
    text: "La contraseña debe tener al menos 8 caracteres.",
    confirmButtonColor: "#d33",
  });
  setIsLoading(false);
  return;
}

// --- 2. PREPARAR DATOS PARA EL BACKEND ---
// Dividir el nombre completo en Nombres y Apellidos
const [nombres, ...apellidosArray] = formData.fullName.trim().split(" ");

const apellidos =
  apellidosArray.length > 0 ? apellidosArray.join(" ") : nombres;

const userPayload: UserPayload = {
  nombres: nombres,
  apellidos: apellidos,
  correo: formData.email,
  contrasenna: formData.password,
};

// --- 3. LLAMADA REAL AL BACKEND ---
fetch("http://localhost:8090/api/v1/usuarios", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(userPayload),
})
  .then(async (response) => {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text:
            errorData.message ||
            `Error en el servidor. Código ${response.status}`,
          confirmButtonColor: "#d33",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error desconocido",
          text: "No se pudo procesar la respuesta del servidor.",
          confirmButtonColor: "#d33",
        });
      }
      throw new Error(); // para cortar la ejecución
    }

    return response.json();
  })
  .then(() => {
    Swal.fire({
      icon: "success",
      title: "Cuenta creada correctamente",
      text: "Serás redirigido al inicio de sesión.",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      navigate(routes.loginPage);
    });
  })
  .catch((error) => {
    console.error("Error en registro:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonColor: "#d33",
    });
  })
  .finally(() => {
    setIsLoading(false);
  });

  return (
  <Container className="d-flex align-items-center justify-content-center">
    <Card className="auth-card">
      <Card.Body>
        <div className="text-center">
          <Card.Title as="h1" className="h3 mb-1">
            Crear cuenta
          </Card.Title>
          <Card.Text className="auth-subtitle">
            Regístrate para comenzar
          </Card.Text>
        </div>

        <div className="mt-4">
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="fullName">
              <Form.Label className="text-muted">Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Nombre y apellido"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="email">
              <Form.Label className="text-muted">
                Correo electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="tucorreo@dominio.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="text-muted">Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label className="text-muted">
                Confirmar contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                required
                value={formData.confirmPassword}
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
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>

            <Card.Text className="text-center text-muted mt-4 mb-0">
              ¿Ya tienes cuenta?{" "}
              <Link to={routes.loginPage} className="auth-link">
                Inicia sesión
              </Link>
              .
            </Card.Text>
          </Form>
        </div>
      </Card.Body>
    </Card>
  </Container>
);
};

export default RegisterForm;