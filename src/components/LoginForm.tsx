import {Card, Form, Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

function LoginForm() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="shadow-lg w-100" style={{maxWidth: 480}}>
          <Card.Body>
            <div className="text-center">
              <Card.Title as="h1" className="h3 mb-1">
                Inicia sesión
              </Card.Title>
              <Card.Text className="text-muted">
                Ingresa abajo rellenando con tus datos
              </Card.Text>
            </div>

            <div className="mt-4">
              <Form noValidate>
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="text-muted">
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Correo electrónico"
                    required
                  />
                  {/* <Form.Control.Feedback type="invalid">Email inválido</Form.Control.Feedback> */}
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="text-muted">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="dark" size="lg">
                    Ingresar
                  </Button>
                </div>

                <Card.Text className="text-center text-muted mt-4 mb-0">
                  ¿No tienes cuenta?{" "}
                  <Link to="/registerPage" className="text-decoration-none">
                    Regístrate
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

export default LoginForm;
