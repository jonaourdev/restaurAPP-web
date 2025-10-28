import { Container, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { routes } from "../../router";
import { dataHelper, type Formative } from "../../utils/Helper";
import "../../css/ConceptCards/ItemConcept.css";


 
export default function FormativeConceptDetail() {
  const { id } = useParams<{ id?: string }>();
  const conceptId = Number(id);

  // fallback if id is invalid
  if (!id || Number.isNaN(conceptId)) {
    return (
      <Container className="py-5">
        <h2>Concepto no válido</h2>
        <p>ID de concepto inválido.</p>
        <Link to={routes.FormativeConceptPage} className="btn btn-outline-primary">
          Volver
        </Link>
      </Container>
    );
  }

  const concept: Formative | undefined = dataHelper.getFormativeById(conceptId);

  if (!concept) {
    return (
      <Container className="py-5">
        <h2>Concepto no encontrado</h2>
        <p>El concepto que buscas no existe.</p>
        <Link to={routes.FormativeConceptPage} className="btn btn-outline-primary">
          Volver
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="article-card-small d-flex flex-column shadow-lg" style={{ maxWidth: 800 }}>
        <Card.Body>
          <h2>{concept.name}</h2>
          <p>{concept.description}</p>

          {concept.image && (
            <div className="my-3 text-center">
              <img src={concept.image} alt={concept.name} style={{ maxWidth: "100%" }} />
            </div>
          )}

          <div className="mt-3">
            <Link to={routes.FormativeConceptPage} 
            className="btn btn-outline-primary">
              Volver a conceptos
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}