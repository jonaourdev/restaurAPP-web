import {Button, Card} from "react-bootstrap";
import "../../css/ConceptCards/CardTecnica.css";

type Props = {
  title: string;
};

function CardTecnica({title}: Props) {
  return (
    <>
      <Card className="article-card d-flex flex-column shadow-lg">
        <Card.Body className="pb-4">
          <Card.Title as="h2" className="article-title mb-4">
            {title}
          </Card.Title>
          <div className="mt-auto d-flex justify-content-center">
            <i
              className="bi bi-award-fill text-dark"
              style={{fontSize: "10rem"}}
            />
          </div>
        </Card.Body>

        <Card.Footer className="article-footer bg-transparent border-0 mt-auto">
          <div className="mb-4 d-flex justify-content-center ">
            <Button variant="dark">Ver</Button>
          </div>
        </Card.Footer>
      </Card>
    </>
  );
}
export default CardTecnica;
