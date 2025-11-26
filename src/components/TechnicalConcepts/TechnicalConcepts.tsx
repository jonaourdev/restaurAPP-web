import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/CardTecnica.css";
import {dataHelper, type Family} from "../../utils/Helper";

export default function TechnicalConcepts() {
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    async function fetchFamilias() {
      const realFamilias = await dataHelper.getRealFamilias();
      const mapped = realFamilias.map((dto) => ({
        idFamilies: dto.idFamilia,
        name: dto.nombreFamilia,
        description: dto.descripcionFamilia,
      }));
      setFamilies(mapped);
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
        {families
          .filter(
            (family) =>
              Array.isArray(family.subConcepto) &&
              family.subConcepto.length > 0 &&
              family.subConcepto.some((s) => s.name)
          )
          .map((family) => (
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
                  {/* Lista de subconceptos */}
                  <Card.Title className="mb-2">
                    <ul className="list-unstyled m-0">
                      {family.subConcepto!.map((sub) => (
                        <li key={sub.conceptId} className="py-1">
                          <Link
                            to={`/technical/concept/${sub.conceptId}`}
                            className="article-title"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card.Title>

                  <Card.Subtitle className="article-subtitle mb-2">
                    Familia: {family.name}
                  </Card.Subtitle>

                  <Card.Text className="article-description">
                    {family.subConcepto?.[0]?.description
                      ? family.subConcepto[0].description.slice(0, 120) + "..."
                      : "Sin descripción disponible."}
                  </Card.Text>

                  <div className="mt-auto text-center">
                    <Button
                      as={Link as any}
                      to={`/familia/${family.idFamilies}`}
                      variant="primary"
                    >
                      Ver más
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
