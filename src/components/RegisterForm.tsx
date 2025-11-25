import { useState } from "react";
import { Card, Form, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/AuthForm.css"; // <-- IMPORTANTE

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

      const usersJSON = localStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      const userExists = users.some(
        (user: RegisterProps) => user.email === formData.email
      );

      if (userExists) {
        Swal.fire({
          icon: "warning",
          title: "Correo registrado",
          text: "Este correo ya tiene una cuenta asociada.",
          confirmButtonColor: "#d33",
        });
        setIsLoading(false);
        return;
      }

      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/loginPage");
      });
    }, 1500);
  };

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
                <Link to="/loginPage" className="auth-link">
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
}

export default RegisterForm;
