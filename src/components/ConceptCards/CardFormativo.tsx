import { Card } from "react-bootstrap";
import "../../css/ConceptCards/CardFormativo.css";
import { Link } from "react-router-dom";
import { routes } from "../../router";

type Props = {
  title: string;
};

function CardFormativo({ title }: Props) {
  return (
    <>
      {/* CARD EDITORIAL */}
      <Card
        as={Link}
        to={routes.FormativeConceptPage}
        className="article-card d-flex flex-column"
      >
        <Card.Body className="card-body">
          {/* TÍTULO */}
          <Card.Title as="h2" className="article-title">
            {title}
          </Card.Title>

          {/* ICONO */}
          <div className="mt-auto d-flex justify-content-center">
            <i
              className="bi bi-bank"
              style={{ fontSize: "9rem", opacity: 0.9 }}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default CardFormativo;
