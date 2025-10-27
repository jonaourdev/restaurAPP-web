import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AddChoicePage() {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Crear nuevo</h1>

      <Row className="g-4 justify-content-center">
        <Col xs={12} md={4}>
          <Card as={Link} to="/add/formative" className="text-center text-decoration-none p-4">
            <Card.Body>
              <Card.Title>Concepto Formativo</Card.Title>
              <Card.Text>Agregar un nuevo concepto formativo</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card as={Link} to="/add/family" className="text-center text-decoration-none p-4">
            <Card.Body>
              <Card.Title>Familia Técnica</Card.Title>
              <Card.Text>Agregar una nueva familia técnica</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card as={Link} to="/add/technical" className="text-center text-decoration-none p-4">
            <Card.Body>
              <Card.Title>Subconcepto Técnico</Card.Title>
              <Card.Text>Agregar un subconcepto (pertenece a una familia)</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}