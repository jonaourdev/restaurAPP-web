import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dataHelper, type SubConcept, type Family } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/ConceptCards/TechnicalConceptDetail.css";

export default function TechnicalConceptDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const conceptId = Number(id);

  const [subConcept, setSubConcept] = useState<SubConcept | undefined>();
  const [family, setFamily] = useState<Family | undefined>();

  useEffect(() => {
    if (!id || Number.isNaN(conceptId)) return;

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

  if (!subConcept) {
    return (
      <Container className="detail-container">
        <div className="detail-card">
          <h2>Concepto no encontrado</h2>
          <p>No existe el concepto solicitado.</p>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="detail-container">
      <div className="detail-card shadow-sm">
        {/* HEADER */}
        <div className="detail-header">
          <h1>{subConcept.name}</h1>

          {family && (
            <p>
              Familia:{" "}
              <Link
                to={`/familia/${family.idFamilies}`}
                className="fam-link text-decoration-none"
              >
                {family.name}
              </Link>
            </p>
          )}
        </div>

        {/* IMAGEN */}
        {subConcept.image && (
          <img
            src={subConcept.image}
            alt={subConcept.name}
            className="detail-image"
          />
        )}

        {/* DESCRIPCIÓN */}
        <p className="detail-description">
          {subConcept.description ?? "Sin descripción disponible."}
        </p>
      </div>

      {/* BOTONES FUERA DE LA CARD, ABAJO DE LA PÁGINA */}
      <div className="detail-actions">
        <Link to={routes.TechnicalConceptPage} className="btn btn-primary">
          Volver
        </Link>

        {family && (
          <Link
            to={`/familia/${family.idFamilies}`}
            className="btn btn-outline-primary"
          >
            Ver familia
          </Link>
        )}
      </div>
    </Container>
  );
}
