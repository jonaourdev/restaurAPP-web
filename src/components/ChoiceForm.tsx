import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/ChoiceForm.css";

export default function AddChoice() {
  return (
    <Container className="choice-container">
      <h1 className="choice-title">Crear nuevo</h1>

      <div className="choice-grid">
        <Card as={Link} to="/add/formative" className="choice-card">
          <Card.Body>
            <Card.Title className="choice-card-title">
              Concepto Formativo
            </Card.Title>
            <Card.Text className="choice-card-text">
              Agregar un nuevo concepto formativo
            </Card.Text>
          </Card.Body>
        </Card>

        <Card as={Link} to="/add/family" className="choice-card">
          <Card.Body>
            <Card.Title className="choice-card-title">
              Familia Técnica
            </Card.Title>
            <Card.Text className="choice-card-text">
              Agregar una nueva familia técnica
            </Card.Text>
          </Card.Body>
        </Card>

        <Card as={Link} to="/add/technical" className="choice-card">
          <Card.Body>
            <Card.Title className="choice-card-title">
              Subconcepto Técnico
            </Card.Title>
            <Card.Text className="choice-card-text">
              Agregar un subconcepto (pertenece a una subfamilia)
            </Card.Text>
          </Card.Body>
        </Card>

        <Card as={Link} to="/add/subfamily" className="choice-card">
          <Card.Body>
            <Card.Title className="choice-card-title">Subfamilia</Card.Title>
            <Card.Text className="choice-card-text">
              Agregar una subfamilia (pertenece a una familia)
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
