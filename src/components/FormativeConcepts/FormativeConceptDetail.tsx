import {Container, Card} from "react-bootstrap";
import {useParams, useNavigate, Link} from "react-router-dom";
import {routes} from "../../router";
import {dataHelper, type ConceptoFormativoDTO} from "../../utils/Helper";
import {useEffect, useState} from "react";

type RouteParams = {
  id?: string;
};

export default function FormativeConceptDetail() {
  const {id} = useParams<RouteParams>();
  const navigate = useNavigate();

  const [concept, setConcept] = useState<ConceptoFormativoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const conceptId = Number(id);

    if (!id || Number.isNaN(conceptId)) {
      setError("Id de concepto inválido.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchConcept = async () => {
      try {
        setLoading(true);
        const dto = await dataHelper.getRealFormativeId(conceptId);

        if (!isMounted) return;

        if (!dto) {
          setError("No existe el concepto solicitado.");
          setConcept(null);
        } else {
          setConcept(dto);
          setError(null);
        }
      } catch (e) {
        if (!isMounted) return;
        console.error("Error al cargar concepto técnico:", e);
        setError("Error al cargar el concepto técnico.");
        setConcept(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConcept();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // fallback if id is invalid
  if (loading) {
    return (
      <Container className="detail-container">
        <div className="detail-card text-center">
          <p>Cargando concepto formativo...</p>
        </div>
      </Container>
    );
  }

  if (error || !concept) {
    return (
      <Container className="detail-container">
        <div className="detail-card text-center">
          <h2 className="text-danger">Concepto no encontrado</h2>
          <p>{error ?? "No existe el concepto solicitado."}</p>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Volver a los conceptos
          </button>

          <Link
            to="/conceptos/formativos"
            className="btn btn-outline-secondary"
          >
            Volver al listado
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{maxWidth: 800}}>
        <Card.Body>
          <h2>{concept.nombreFormativo}</h2>
          <p>{concept.descripcionFormativo}</p>

          {/* {concept.image && (
            <div className="my-3 text-center">
              <img
                src={concept.image}
                alt={concept.name}
                style={{maxWidth: "100%"}}
              />
            </div>
          )} */}

          <div className="mt-3">
            <Link
              to={routes.FormativeConceptPage}
              className="btn btn-outline-primary"
            >
              Volver a conceptos
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
