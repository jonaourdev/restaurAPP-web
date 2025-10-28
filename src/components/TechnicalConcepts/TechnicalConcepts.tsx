import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/ItemConcept.css";
import { dataHelper, type Family } from "../../utils/Helper";

export default function TechnicalConcepts() {
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    setFamilies(dataHelper.getTechnicalFamilies());
  }, []);

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5 display-5">Technical Concepts</h1>

      <div className="technical-grid">
        {families.map((family) => (
          <Card key={family.idFamilies} className="article-card-small d-flex flex-column shadow-lg">
            <Card.Body className="d-flex align-items-center">
              <div className="card-left flex-grow-1">
                <h5 className="mb-3">Familia: {family.name}</h5>

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

                <div className="mt-3">
                  <Link to={`/familia/${family.idFamilies}`} className="btn btn-outline-primary">
                    Ver Familia
                  </Link>
                </div>
              </div>

              <div className="card-right">
                {family.image ? (
                  <img src={family.image} alt={family.name} className="concept-image" />
                ) : (
                  <div className="image-placeholder" />
                )}
              </div>
            </Card.Body>
          </Card>
        ))}

        {/* Add New Card */}
        <div className="add-new-wrapper">
          <AddNewCard />
        </div>
      </div>
    </Container>
  );
}