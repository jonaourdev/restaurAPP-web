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
        {families
          //  Filtra solo las familias con subConceptos reales
          .filter(
            (family) =>
              Array.isArray(family.subConcepto) &&
              family.subConcepto.length > 0 &&
              family.subConcepto.some((s) => s.name) // asegura que no esté vacío
          )
          .map((family) => (
            <Card
              key={family.idFamilies}
              className="article-card square-card d-flex flex-column shadow-lg"
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
                <div className="image-placeholder concept-image"></div>
              )}

              <Card.Body className="d-flex flex-column p-2">
                {/* Nombres de Subconceptos */}
                <Card.Title className="mb-2">
                  <ul className="list-unstyled m-0">
                    {family.subConcepto!.map((sub) => (
                      <li key={sub.conceptId} className="py-1">
                        <Link to={`/technical/concept/${sub.conceptId}`}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card.Title>

                {/* Familia */}
                <Card.Subtitle className="mb-2">
                  Familia: {family.name}
                </Card.Subtitle>

                {/* Descripción (del primer subconcepto por defecto) */}
                <Card.Text>
                  {family.subConcepto && family.subConcepto[0].description
                    ? family.subConcepto[0].description.slice(0, 80) + "..."
                    : "Sin descripción disponible."}
                </Card.Text>
                <div className="flex-grow-1" />
                <Button
                  as={Link as any}
                  to={`/familia/${family.idFamilies}`}
                  variant="primary"
                  className="mx-auto"
                  style={{ width: "fit-content" }}
                >
                  Ver más
                </Button>
              </Card.Body>
            </Card>
          ))}

        <div className="add-new-wrapper">
          <AddNewCard />
        </div>
      </div>
    </Stack>
  );
}
