import {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams, Link} from "react-router-dom";
import {dataHelper, type Family} from "../../utils/Helper";
import {routes} from "../../router";
import "../../css/ConceptCards/TechnicalConceptDetail.css";
import CardAgregar from "../ConceptCards/CardAgregar";

export default function FamilyDetail() {
  const {id} = useParams<{id?: string}>();
  const familyId = Number(id);

  const [family, setFamily] = useState<Family | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!familyId || Number.isNaN(familyId)) {
        setLoading(false);
        return;
      }

      //Cargar familia
      const realFamilies = await dataHelper.getRealFamilias();
      const fam = realFamilies.find((f) => f.idFamilia === familyId);

      if (!fam) {
        setFamily(undefined);
        setLoading(false);
        return;
      }

      //Mapear DTO de familia
      const mappedFamily: Family = {
        idFamilies: fam.idFamilia,
        name: fam.nombreFamilia,
        descriptions: fam.descripcionFamilia,
        componentItemn: "",
        image: "",
        subFamily: [],
      };

      //Cargar conceptos tecnicos asociado a la familia
      const realSubfamilies = await dataHelper.getRealSubfamiliasByFamilia(
        familyId
      );
      const filteredSubfamilies = realSubfamilies.filter(
        (t) => t.familiaId === familyId
      );

      //Mapear los tecnico a subConcepto

      mappedFamily.subFamily = filteredSubfamilies.map((t) => ({
        idSubfamilies: t.idSubfamilia,
        familyId: familyId,
        name: t.nombreSubfamilia,
        descriptions: t.descripcionSubfamilia,
        image: "",
        subConcepto: [],
      }));
      setFamily(mappedFamily);
      setLoading(false);
    }

    fetchData();
  }, [familyId]);

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
          </div>

          {/* SUBFAMILIAS */}
          {family.subFamily && family.subFamily.length > 0 && (
            <div className="mt-4 text-black">
              <h3>Subfamilias</h3>

              <div className="row g-3 mt-1">
                {family.subFamily.map((sub) => (
                  <Link
                    key={sub.idSubfamilies}
                    to={`/subfamilia/${sub.idSubfamilies}`}
                    className="detail-card mt-3 text-decoration-none"
                  >
                    <div key={sub.idSubfamilies} className="col-md-6">
                      <div className="detail-card" style={{padding: "1rem"}}>
                        <h5 className="mb-2">{sub.name}</h5>
                        <p className="m-0">
                          {sub.descriptions || "Sin descripción."}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <CardAgregar />
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
