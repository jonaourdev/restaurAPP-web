import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { dataHelper, type ConceptoTecnicoDTO } from "../../utils/Helper";
import "../../css/ConceptCards/TechnicalConceptDetail.css";

type RouteParams = {
  id?: string;
};

export default function TechnicalConceptDetail() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [concept, setConcept] = useState<ConceptoTecnicoDTO | null>(null);
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
        const dto = await dataHelper.getRealTechnicalById(conceptId);

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

  // --- estados de carga / error / no encontrado ---

  if (loading) {
    return (
      <Container className="detail-container">
        <div className="detail-card text-center">
          <p>Cargando concepto técnico...</p>
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
            Volver a la subfamilia
          </button>

          <Link to="/conceptos/tecnicos" className="btn btn-outline-secondary">
            Volver al listado
          </Link>
        </div>
      </Container>
    );
  }

  // --- vista con el concepto encontrado ---

  return (
    <Container className="detail-container">
      <div className="detail-card text-black">
        <h2>{concept.nombreTecnico}</h2>

        {concept.descripcionTecnico && (
          <p className="mt-3">{concept.descripcionTecnico}</p>
        )}

        {!concept.descripcionTecnico && (
          <p className="mt-3 text-muted">Sin descripción disponible.</p>
        )}
      </div>

      <div className="detail-actions">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Volver a la subfamilia
        </button>
      </div>
    </Container>
  );
}
