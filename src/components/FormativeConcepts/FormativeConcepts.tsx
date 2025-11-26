import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/CardTecnica.css"; // usa tu CSS editorial
import { dataHelper, type Formative } from "../../utils/Helper";

export default function FormativeConcepts() {
  const [concepts, setConcepts] = useState<Formative[]>([]);

  useEffect(() => {
    setConcepts(dataHelper.getFormativeConcepts());
  }, []);

  return (
    <Container className="py-1">
      <h1 className="text-center mb-3 display-5 text-black">
        Conceptos Formativos
      </h1>

      <div className="border-bottom mb-4" style={{ borderColor: "#d1d1d1" }} />

      <Row className="g-4">
        {concepts.map((concept) => (
          <Col key={concept.conceptId} xs={12} md={6} lg={4}>
            <Card className="article-card h-100">
              {/* Imagen o placeholder */}
              {concept.image ? (
                <Card.Img
                  variant="top"
                  src={concept.image}
                  alt={concept.name}
                  className="concept-image"
                />
              ) : (
                <div className="image-placeholder concept-image"></div>
              )}

              <Card.Body className="d-flex flex-column">
                {/* TÍTULO */}
                <Card.Title className="article-title">
                  {concept.name}
                </Card.Title>

                {/* SUBTÍTULO */}
                <Card.Subtitle className="article-subtitle">
                  Concepto formativo
                </Card.Subtitle>

                {/* DESCRIPCIÓN */}
                <Card.Text className="article-description">
                  {concept.description.substring(0, 120)}...
                </Card.Text>

                {/* BOTÓN */}
                <div className="mt-auto text-center">
                  <Button
                    as={Link as any}
                    to={`/concepto/${concept.conceptId}`}
                    variant="primary"
                  >
                    Ver más
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* CARD AGREGAR */}
        <Col xs={12} md={6} lg={4}>
          <AddNewCard />
        </Col>
      </Row>
    </Container>
  );
}
