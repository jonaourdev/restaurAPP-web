import {Container, Row, Col} from "react-bootstrap";
import CardTecnica from "../components/ConceptCards/CardTecnica";
import CardFormativo from "../components/ConceptCards/CardFormativo";

function ConceptPage() {
  return (
    <>
      <Container className="min-vh-100 d-flex align-items-center justify-content-center gap-5">
        <Row>
          <Col>
            <CardTecnica title="CONCEPTOS TÉCNICOS"></CardTecnica>
          </Col>
          <Col>
            <CardFormativo title="CONCEPTOS FORMATIVOS"></CardFormativo>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ConceptPage;
