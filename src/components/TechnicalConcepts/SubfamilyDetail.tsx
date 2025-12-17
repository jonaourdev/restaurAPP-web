import {useEffect, useState} from "react";
import {Container, Card, Row, Col} from "react-bootstrap";
import {useParams, Link} from "react-router-dom";
import {dataHelper, type SubConcept} from "../../utils/Helper";
import {routes} from "../../router";
import "../../css/ConceptCards/TechnicalConceptDetail.css";
import CardAgregar from "../ConceptCards/CardAgregar";

export default function SubfamilyDetail() {
  const {id} = useParams<{id?: string}>();
  const subfamilyId = Number(id);

  const [concepts, setConcepts] = useState<SubConcept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTecnicos() {
      if (!subfamilyId || Number.isNaN(subfamilyId)) {
        setLoading(false);
        return;
      }

      // 1. Pedimos los técnicos de esta subfamilia
      const realTecnicos = await dataHelper.getRealTecnicosBySubfamilia(
        subfamilyId
      );

      // 2. Mapeamos al tipo SubConcept
      const mapped: SubConcept[] = realTecnicos.map((t) => ({
        conceptId: t.idTecnico,
        subfamilyId: t.subfamiliaId,
        name: t.nombreTecnico,
        description: t.descripcionTecnico ?? "", // ✅ USAMOS LA DESCRIPCIÓN REAL
        image: "",
      }));

      setConcepts(mapped);
      setLoading(false);
    }

    fetchTecnicos();
  }, [subfamilyId]);

  if (loading) {
    return (
      <Container className="detail-container">
        <p>Cargando conceptos técnicos...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-black">Conceptos técnicos de la subfamilia</h1>

      {concepts.length === 0 ? (
        <CardAgregar />
      ) : (
        <Row className="g-3">
          {concepts.map((c) => (
            <Col key={c.conceptId} xs={12} md={6} lg={4}>
              <Card className="article-card h-100">
                <Card.Body>
                  <Card.Title>
                    <Link
                      to={`/technical/concept/${c.conceptId}`}
                      className="article-title"
                    >
                      {c.name}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-black">
                    {c.description || "Sin descripción disponible."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <CardAgregar />
        </Row>
      )}

      <div className="detail-actions mt-4">
        <Link
          to={routes.TechnicalConceptPage} // 🔧 de paso, mejor volver a familias técnicas
          className="btn btn-primary"
        >
          Volver a familias
        </Link>
      </div>
    </Container>
  );
}
