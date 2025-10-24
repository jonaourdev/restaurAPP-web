import {Container} from "react-bootstrap";
import CardTecnica from "../components/ConceptCards/CardTecnica";
import CardFormativo from "../components/ConceptCards/CardFormativo";

function ConceptPage() {
  return (
    <>
      <Container className="min-vh-100 d-flex align-items-center justify-content-center gap-5">
        <CardTecnica title="CONCEPTOS TÉCNICOS"></CardTecnica>
        <CardFormativo title="CONCEPTOS FORMATIVOS"></CardFormativo>
      </Container>
    </>
  );
}

export default ConceptPage;
