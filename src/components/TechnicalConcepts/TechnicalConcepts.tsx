import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/CardTecnica.css";
import dataHelper, { type Family } from "../../utils/Helper";

export default function TechnicalConcepts() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilias() {
      try {
        setLoading(true);
        setError(null);

        // 1. Traemos las familias reales del backend
        const realFamilias = await dataHelper.getRealFamilias();

        // 2. Mapeamos al tipo Family que usa el front
        const mapped: Family[] = realFamilias.map((dto) => ({
          idFamilies: dto.idFamilia,
          name: dto.nombreFamilia,
          descriptions: dto.descripcionFamilia,
          componentItemn: "",
          image: "",
          subConcepto: [], // por ahora no los usamos aquí
        }));

        setFamilies(mapped);
      } catch (err: any) {
        console.error("Error cargando familias:", err);
        setError(err.message ?? "No se pudieron cargar las familias.");
      } finally {
        setLoading(false);
      }
    }

    fetchFamilias();
  }, []);

  return (
    <Container className="py-1">
      <h1 className="text-center mb-3 display-5 text-black">
        Conceptos Técnicos
      </h1>

      <div className="border-bottom mb-4" style={{ borderColor: "#d1d1d1" }} />

      <Row className="g-4">
        {families.map((family) => (
          <Col key={family.idFamilies} xs={12} md={6} lg={4}>
            <Card className="article-card h-100">
              {/* Imagen */}
              {family.image ? (
                <Card.Img
                  variant="top"
                  src={family.image}
                  alt={family.name}
                  className="concept-image"
                />
              ) : (
                <div className="image-placeholder concept-image"></div>
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-2 text-black">
                  {family.name}
                </Card.Title>

                <Card.Text className="article-description">
                  {family.descriptions
                    ? family.descriptions.slice(0, 140) + "..."
                    : "Sin descripción disponible."}
                </Card.Text>

                <div className="mt-auto text-center">
                  <Button
                    as={Link as any}
                    to={`/familia/${family.idFamilies}`}
                    variant="primary"
                  >
                    Ver subfamilias
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Card agregar */}
        <Col xs={12} md={6} lg={4}>
          <AddNewCard />
        </Col>
      </Row>
    </Container>
  );
}
