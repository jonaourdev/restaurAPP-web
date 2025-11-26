import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { dataHelper, type Formative } from "../../utils/Helper";
import AddNewCard from "../ConceptCards/CardAgregar";

export default function FormativeConcepts() {
  const [concepts, setConcepts] = useState<Formative[]>([]);

  useEffect(() => {
    setConcepts(dataHelper.getFormativeConcepts());
  }, []);

  return (
    <Container className="py-5">
      <h1 className="text-center mb-2 display-5 text-black">
        Conceptos Formativos
      </h1>
      <div className="border-bottom mb-3" style={{ borderColor: "#d1d1d1" }} />
      <div className="row g-4">
        {concepts.map((concept) => (
          <div key={concept.conceptId} className="col-12 col-md-6 col-lg-4">
            <Link
              to={`/concepto/${concept.conceptId}`}
              className="text-decoration-none"
            >
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body>
                  <Card.Title className="text-center mb-3">
                    {concept.name}
                  </Card.Title>
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
