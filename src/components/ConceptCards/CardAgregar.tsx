import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../css/ConceptCards/CardFormativo.css";

export default function AddNewCard() {
  return (
    <Card
      as={Link}
      to="/add"
      className="article-card d-flex flex-column shadow-lg text-decoration-none text-reset"
      style={{ cursor: "pointer" }}
    >
      <Card.Body className="pb-4 d-flex flex-column align-items-center justify-content-center">
        <div style={{ fontSize: "4rem", color: "#6c757d" }}>＋</div>
        <Card.Title as="h2" className="article-title mt-3">
          Agregar
        </Card.Title>
        <div className="mt-3">
          <span className="btn btn-outline-primary">Crear nuevo</span>
        </div>
      </Card.Body>
    </Card>
  );
}