import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { dataHelper, type Family } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/ConceptCards/TechnicalConceptDetail.css";

export default function FamilyDetail() {
  const { id } = useParams<{ id?: string }>();
  const [family, setFamily] = useState<Family | undefined>();

  useEffect(() => {
    if (id) {
      const familyData = dataHelper.getFamilyById(Number(id));
      setFamily(familyData);
    }
  }, [id]);

  if (!family) {
    return (
      <Container className="detail-container">
        <div className="detail-card">
          <div className="detail-content">
            <h2>Familia no encontrada</h2>
            <p>No fue posible encontrar la familia solicitada.</p>

            <div className="detail-actions">
              <Link
                to={routes.TechnicalConceptPage}
                className="btn btn-primary"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* CONTENEDOR PRINCIPAL */}
      <Container className="detail-container">
        {/* TARJETA */}
        <div className="detail-card">
          {/* HEADER */}
          <div className="detail-header">
            <h1>{family.name}</h1>
            <p className="fam-link">ID: {family.idFamilies}</p>
          </div>

          {/* IMAGEN */}
          {family.image && (
            <img
              src={family.image}
              alt={family.name}
              className="detail-image"
            />
          )}

          {/* DESCRIPCIÓN PRINCIPAL */}
          <div className="detail-description">
            <strong>Descripción:</strong>
            <p className="mt-2">
              {family.descriptions || "Sin descripción disponible."}
            </p>

            <br />

            <strong>Componentes:</strong>
            <p className="mt-2">
              {family.componentItemn || "Sin componentes definidos."}
            </p>
          </div>

          {/* SUBCONCEPTOS */}
          {family.subConcepto && family.subConcepto.length > 0 && (
            <div className="mt-4 text-black">
              <h3>Subconceptos</h3>

              <div className="row g-3 mt-1">
                {family.subConcepto.map((sub) => (
                  <div key={sub.conceptId} className="col-md-6">
                    <div className="detail-card" style={{ padding: "1rem" }}>
                      <h5 className="mb-2">{sub.name}</h5>
                      <p className="m-0">
                        {sub.description || "Sin descripción."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* BOTONES AL FINAL DE LA PÁGINA */}
      <div className="detail-actions">
        <Link to={routes.TechnicalConceptPage} className="btn btn-primary">
          Volver
        </Link>
      </div>
    </>
  );
}
