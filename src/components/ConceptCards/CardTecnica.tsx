import { Card } from "react-bootstrap";
import "../../css/ConceptCards/CardTecnica.css";
import { Link } from "react-router-dom";
import { routes } from "../../router";

type Props = {
  title: string;
};

function CardTecnica({ title }: Props) {
  return (
    <>
      <Card
        as={Link}
        to={routes.TechnicalConceptPage}
        className="article-card d-flex flex-column shadow-lg"
      >
        <Card.Body className="pb-4">
          <Card.Title as="h2" className="article-title mb-4">
            {title}
          </Card.Title>
          <div className="mt-auto d-flex justify-content-center">
            <i
              className="bi bi-award-fill text-dark"
              style={{ fontSize: "10rem" }}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
export default CardTecnica;
