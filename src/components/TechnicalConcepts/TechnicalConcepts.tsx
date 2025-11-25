import { useEffect, useState } from "react";
import { Card, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/CardTecnica.css";
import { dataHelper, type Family } from "../../utils/Helper";

export default function TechnicalConcepts() {
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    setFamilies(dataHelper.getTechnicalFamilies());
  }, []);

  return (
    <Stack gap={3}>
      <h1 className="text-center mb-5 display-5">Technical Concepts</h1>

      <div className="technical-grid">
        {families.map((family) => (
          <Card
            key={family.idFamilies}
            className="article-card d-flex flex-column shadow-lg"
            style={{ width: "18rem" }}
          >
            {/* Imagen */}
            {family.image ? (
              <Card.Img
                variant="top"
                src={family.image}
                alt={family.name}
                className="concept-image"
              />
            ) : (
              <div className="image-placeholder"></div>
            )}

            <Card.Body className="d-flex flex-column">
              {/* Lista de subconceptos */}
              <Card.Title className="mb-2">
                {family.subConcepto && family.subConcepto.length > 0 ? (
                  <ul className="list-unstyled">
                    {family.subConcepto.map((sub) => (
                      <li key={sub.conceptId} className="py-1">
                        <Link to={`/technical/concept/${sub.conceptId}`}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-3">
                    <span className="chev">⌄</span>
                  </div>
                )}
              </Card.Title>

              {/* Subtítulo Familia */}
              <Card.Subtitle className="mb-3">
                Familia: {family.name}
              </Card.Subtitle>

              {/* Este espacio empuja al botón hacia abajo */}
              <div className="flex-grow-1"></div>

              {/* Botón */}
              <Button
                as={Link as any}
                to={`/familia/${family.idFamilies}`}
                variant="primary"
                className="mx-auto"
                style={{ width: "fit-content" }}
              >
                Ver Familia
              </Button>
            </Card.Body>
          </Card>
        ))}

        {/* Add New Card */}
        <div className="add-new-wrapper">
          <AddNewCard />
        </div>
      </div>
    </Stack>
  );
}
