import {useEffect, useState} from "react";
import {Container, Card} from "react-bootstrap";
import {useParams, Link} from "react-router-dom";
import {dataHelper, type Family} from "../../utils/Helper";
import {routes} from "../../router";

export default function FamilyDetail() {
  const {id} = useParams<{id?: string}>();
  const familyId = Number(id);

  const [family, setFamily] = useState<Family | undefined>();
  const [concepts, setConcepts] = useState<any[]>([]);
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
        subConcepto: [],
      };

      //Cargar conceptos tecnicos asociado a la familia
      const realTecnicos = await dataHelper.getRealTecnicos();
      const filteredTecnicos = realTecnicos.filter(
        (t) => t.idFamilia === familyId
      );

      //Mapear los tecnico a subConcepto

      mappedFamily.subConcepto = filteredTecnicos.map((t) => ({
        conceptId: t.idTecnico,
        familyId: familyId,
        name: t.nombreTecnico,
      }));

      setFamily(mappedFamily);
      setLoading(false);
    }

    fetchData();
  }, [familyId]);

  if (!family) {
    return (
      <Container className="py-5">
        <h2>Familia no encontrada</h2>
        <Link
          to={routes.TechnicalConceptPage}
          className="btn btn-outline-primary"
        >
          Volver
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="article-card d-flex flex-column shadow-lg">
        <Card.Body>
          <h1 className="text-center mb-4">{family.name}</h1>

          <div className="row">
            <div className="col-md-6">
              <h3>Descripción</h3>
              <p>{family.descriptions}</p>

              <h3>Componentes</h3>
              <p>{family.componentItemn}</p>
            </div>

            <div className="col-md-6">
              {family.image && (
                <img
                  src={family.image}
                  alt={family.name}
                  className="img-fluid rounded shadow"
                />
              )}
            </div>
          </div>

          {family.subConcepto && family.subConcepto.length > 0 && (
            <div className="mt-4">
              <h3>Subconceptos</h3>
              <div className="row g-4">
                {family.subConcepto.map((sub) => (
                  <div key={sub.conceptId} className="col-md-6">
                    <Card className="article-card">
                      <Card.Body>
                        <Card.Title>{sub.name}</Card.Title>
                        <Card.Text>{sub.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link
              to={routes.TechnicalConceptPage}
              className="btn btn-outline-primary"
            >
              Volver a Familias
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
