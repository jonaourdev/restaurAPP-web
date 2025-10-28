import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dataHelper, type SubConcept, type Family } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/ConceptCards/ItemConcept.css";



export default function TechnicalConceptDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const conceptId = Number(id);

  const [subConcept, setSubConcept] = useState<SubConcept | undefined>();
  const [family, setFamily] = useState<Family | undefined>();

  useEffect(() => {
    if (!id || Number.isNaN(conceptId)) {
      setSubConcept(undefined);
      setFamily(undefined);
      return;
    }

    const families = dataHelper.getTechnicalFamilies();
    let foundSub: SubConcept | undefined;
    let foundFamily: Family | undefined;

    for (const f of families) {
      const s = f.subConcepto?.find((sc) => sc.conceptId === conceptId);
      if (s) {
        foundSub = s;
        foundFamily = f;
        break;
      }
    }

    setSubConcept(foundSub);
    setFamily(foundFamily);
  }, [id, conceptId]);

  if (!id || Number.isNaN(conceptId)) {
    return (
      <Container className="detail-container">
        <div className="detail-card">
          <div className="detail-content">
            <h2>Concepto inválido</h2>
            <p>ID de concepto inválido o no proporcionado.</p>
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!subConcept) {
    return (
      <Container className="detail-container">
        <div className="detail-card">
          <div className="detail-content">
            <h2>Concepto no encontrado</h2>
            <p>No se encontró el subconcepto solicitado.</p>
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="detail-container">
      <div className="article-card-small d-flex flex-column shadow-lg">
        <div className="detail-header p-3">
          <h1>{subConcept.name}</h1>
          {family && (
            <p>
              Familia:{" "}
              <Link to={`/familia/${family.idFamilies}`} className="text-decoration-none ">
                {family.name}
              </Link>
            </p>
          )}
        </div>

        <div className="detail-content">
          {subConcept.image && (
            <img src={subConcept.image} alt={subConcept.name} className="detail-image" />
          )}

          <p className="detail-description p-3">
            {subConcept.description ?? "Sin descripción disponible."}
          </p>
        </div>

        <div className="detail-footer p-3 d-flex gap-2">
          <Link
            to={routes.TechnicalConceptPage} 
            className="btn btn-primary">
            Volver a Familias
          </Link>
          {family && (
            <Link 
            to={`/familia/${family.idFamilies}`} 
            className="btn btn-primary">
              Ver familia
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}