import { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface RegisterProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterProps>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que se recargue la página
    setIsLoading(true);

    // Simulación de una pequeña demora (como una llamada a un servidor)
    setTimeout(() => {
      // Validaciones básicas
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

      // --- localStorage ---

      // Obtener la lista de usuarios existentes o crear una nueva.
      const usersJSON = localStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      // Comprobar si el email ya está registrado.
      const userExists = users.some(
        (user: RegisterProps) => user.email === formData.email
      );

      if (userExists) {
        alert("Este correo electrónico ya está registrado.");
        setIsLoading(false);
        return;
      }

      // Añadir el nuevo usuario a la lista.
      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      users.push(newUser);

      // 4. Guardar la lista actualizada en localStorage.
      localStorage.setItem("users", JSON.stringify(users));
      alert("¡Cuenta creada correctamente! Serás redirigido.");
      navigate("/loginPage"); // Redirigir al login
    }, 1500);
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="shadow-lg w-100" style={{ maxWidth: 480 }}>
          <Card.Body>
            <div className="text-center">
              <Card.Title as="h1" className="h3 mb-1">
                Crear cuenta
              </Card.Title>
              <Card.Text className="text-muted">
                Regístrate para comenzar
              </Card.Text>
            </div>

            <div className="mt-4">
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="fullName">
                  <Form.Label className="text-muted">
                    Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Nombre y apellido"
                    required
                    minLength={3}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa tu nombre completo.
                  </Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">
                    Ingresa un correo válido.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="text-muted">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    La contraseña debe tener al menos 8 caracteres.
                  </Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">
                    Las contraseñas no coinciden.
                  </Form.Control.Feedback>
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
                        <Spinner as="span" animation="border" size="sm" />
                        <span className="ms-2">Creando cuenta...</span>
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>

                <Card.Text className="text-center text-muted mt-4 mb-0">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/loginPage" className="text-decoration-none">
                    Inicia sesión
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

export default RegisterForm;
