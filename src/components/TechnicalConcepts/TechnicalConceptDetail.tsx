// src/components/TechnicalConcepts/TechnicalConceptDetail.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Carousel } from "react-bootstrap"; // Importamos Carousel
import { dataHelper, type ConceptoTecnicoDTO } from "../../utils/Helper";
import "../../css/ConceptCards/TechnicalConceptDetail.css"; //

type RouteParams = {
  id?: string;
};

// Extendemos localmente por si Helper no se ha actualizado aún
interface ConceptoTecnicoExtendido extends ConceptoTecnicoDTO {
  imagenes?: string[];
  urlImagen?: string;
}

export default function TechnicalConceptDetail() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [concept, setConcept] = useState<ConceptoTecnicoExtendido | null>(null);
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
          // Si el backend aún no envía 'imagenes' como array, pero sí 'urlImagen',
          // hacemos un "polyfill" local aquí mismo.
          const imagenes = dto.imagenes || (dto.urlImagen ? [dto.urlImagen] : []);
          setConcept({ ...dto, imagenes });
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

  // Definimos qué imágenes mostrar
  const imagesToShow = concept.imagenes && concept.imagenes.length > 0 ? concept.imagenes : [];

  // --- vista con el concepto encontrado ---

  return (
    <Container className="detail-container">
      <div className="detail-card p-0 overflow-hidden">
        
        {/* CARRUSEL DE IMÁGENES */}
        {imagesToShow.length > 0 ? (
          <Carousel interval={null} className="bg-light border-bottom">
            {imagesToShow.map((imgUrl, index) => (
              <Carousel.Item key={index}>
                <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
                  <img
                    className="d-block"
                    src={imgUrl}
                    alt={`Imagen ${index + 1}`}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          // Opcional: Mostrar un placeholder si no hay imágenes
          <div className="text-center py-4 bg-light border-bottom text-muted">
             <small>Sin imágenes disponibles</small>
          </div>
        )}

        {/* CONTENIDO DE TEXTO */}
        <div className="p-4">
          <h2>{concept.nombreTecnico}</h2>

          {concept.descripcionTecnico ? (
            <p className="mt-3" style={{ whiteSpace: "pre-wrap" }}>
              {concept.descripcionTecnico}
            </p>
          ) : (
            <p className="mt-3 text-muted">Sin descripción disponible.</p>
          )}
        </div>
      </div>

      <div className="detail-actions mt-4">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Volver a la subfamilia
        </button>
      </div>
    </Container>
  );
}