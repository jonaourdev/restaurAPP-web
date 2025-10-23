import {Card, Form, Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

function RegisterForm() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="shadow-lg w-100" style={{maxWidth: 480}}>
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
              <Form noValidate>
                <Form.Group className="mb-4" controlId="fullName">
                  <Form.Label className="text-muted">
                    Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre y apellido"
                    required
                    minLength={3}
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
                    placeholder="tucorreo@dominio.com"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa un correo válido.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="text-muted">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
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
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Las contraseñas no coinciden.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="dark" size="lg">
                    Crear cuenta
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
