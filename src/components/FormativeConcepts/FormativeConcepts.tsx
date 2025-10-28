import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { dataHelper, type Formative } from "../../utils/Helper";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/ItemConcept.css";


export default function FormativeConcepts() {
  const [concepts, setConcepts] = useState<Formative[]>([]);

  useEffect(() => {
    setConcepts(dataHelper.getFormativeConcepts());
  }, []);

  return (
    <Container className="article-card-small d-flex flex-column shadow-lg ">
      <h1 className="text-center mb-5">CONCEPTOS FORMATIVOS</h1>

      <div className="row g-4">
        {concepts.map((concept) => (
          <div key={concept.conceptId} className="col-12 col-md-6 col-lg-4">
            <Link 
              to={`/concepto/${concept.conceptId}`}
              className="text-decoration-none"
            >
              <Card className="article-card-small d-flex flex-column shadow-lg mb-4">
                <Card.Body>
                  <Card.Title className="text-center mb-3">{concept.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {concept.description.substring(0, 150)}...
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center bg-transparent">
                  <span className="btn btn-outline-primary">Ver más</span>
                </Card.Footer>
              </Card>
            </Link>
          </div>
        ))}

        {/* Add New Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <AddNewCard />
        </div>
      </div>
    </Container>
  );
}