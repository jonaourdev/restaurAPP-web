import { Card, Form, Button, Container, Spinner } from "react-bootstrap";

interface ConceptsProps {
  conceptName: string;
  description: string;
  references: string;
}

const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {};

function TechnicalConceptPage() {
  return (
    <>
      <Container>
        <Card className="shadow-lg w-100" style={{ maxWidth: 480 }}>
          <Card.Body>
            <div>
              <Card.Title as="h1" className="h3 mb-1">
                Ingresar concepto
              </Card.Title>
              <Card.Text className="text-muted">
                Registrar un concepto
              </Card.Text>
            </div>

            <div className="mt-4">
              <Form noValidate /*onSubmit={handleSubmit}*/>
                <Form.Group className="mb-4" controlId="conceptName">
                  <Form.Label className="text-muted">
                    Nombre del concepto
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="conceptName"
                    placeholder="Nombre del concepto"
                    required
                    minLength={3}
                    /* INTEGRAR LOGICA
                    value={formData.conceptName}
                    onChange={handleChange}
                    */
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa un nombre valido
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
