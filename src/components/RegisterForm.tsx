// src/components/RegisterForm.tsx

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

    // --- 1. VALIDACIONES DE FRONTEND ---
    if (
        !formData.fullName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
    ) {
        alert("Por favor completa todos los campos.");
        setIsLoading(false);
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        setIsLoading(false);
        return;
    }

    if (formData.password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        setIsLoading(false);
        return;
    }

    // --- 2. PREPARAR DATOS PARA EL BACKEND ---
    // Dividir el nombre completo en Nombres y Apellidos
    const [nombres, ...apellidosArray] = formData.fullName.trim().split(" ");
    
    // Si solo se ingresó un nombre, usarlo para ambos. Si hay más, el resto son apellidos.
    const apellidos = apellidosArray.length > 0 ? apellidosArray.join(" ") : nombres; 

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
            // Intenta leer el mensaje de error del backend (ej: "Correo ya registrado")
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error desconocido al registrar.");
            } catch (jsonError) {
                // En caso de que la respuesta no sea JSON o no tenga un mensaje legible
                throw new Error(`Error en el servidor: Código ${response.status}`);
            }
        }
        return response.json(); // Devuelve la respuesta si fue exitosa
    })
    .then(() => {
        // Registro exitoso
        alert("¡Cuenta creada correctamente! Serás redirigido al inicio de sesión.");
        navigate(routes.loginPage); // Redirigir al login
    })
    .catch((error) => {
        // Manejo de errores (red, servidor, validación)
        console.error("Error en registro:", error);
        alert(`Fallo en el registro: ${error.message}`);
    })
    .finally(() => {
        setIsLoading(false);
    });
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg p-4 bg-dark text-white">
            <Card.Body>
              <h2 className="text-center mb-4 text-warning">Registro de Usuario</h2>
              <Form onSubmit={handleSubmit}>
                
                <Form.Group className="mb-3" controlId="formBasicFullName">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre y apellido"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirma tu contraseña"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </Form.Group>

                <Button variant="warning" type="submit" className="w-100 mb-3" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
                
                <div className="text-center">
                  <small className="text-muted">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to={routes.loginPage} className="text-warning">
                      Inicia Sesión
                    </Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;