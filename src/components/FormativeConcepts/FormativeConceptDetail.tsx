import { Container, Card, Carousel } from "react-bootstrap"; // Importamos Carousel
import { useParams, useNavigate, Link } from "react-router-dom";
import { routes } from "../../router";
import { dataHelper, type ConceptoFormativoDTO } from "../../utils/Helper";
import { useEffect, useState } from "react";

// Extendemos el DTO localmente por si Helper no está actualizado aún
interface ConceptoFormativoExtendido extends ConceptoFormativoDTO {
  imagenes?: string[]; // Nueva propiedad lista de imágenes
}

export default function FormativeConceptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [concept, setConcept] = useState<ConceptoFormativoExtendido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcept = async () => {
      try {
        setLoading(true);
        const dto = await dataHelper.getRealFormativeId(Number(id));
        
        if (dto) {
          // Lógica de compatibilidad: si viene urlImagen, la convertimos en array
          const imagenes = dto.imagenes || (dto.urlImagen ? [dto.urlImagen] : []);
          setConcept({ ...dto, imagenes });
          setError(null);
        } else {
          setError("No existe el concepto solicitado.");
        }
      } catch (e) {
        setError("Error al cargar el concepto.");
      } finally {
        setLoading(false);
      }
    };
    fetchConcept();
  }, [id]);

  if (loading) return <Container className="py-5 text-center">Cargando...</Container>;
  if (error || !concept) return <Container className="py-5 text-center text-danger"><h3>{error}</h3></Container>;

  // Determinar qué imágenes mostrar
  const imagesToShow = concept.imagenes && concept.imagenes.length > 0 ? concept.imagenes : [];

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 800 }}>
        
        {/* LÓGICA DEL CARRUSEL */}
        {imagesToShow.length > 0 ? (
          <Carousel interval={null} className="bg-light">
            {imagesToShow.map((imgUrl, index) => (
              <Carousel.Item key={index}>
                <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <div className="text-center py-5 bg-light text-muted">
            Sin imágenes disponibles
          </div>
        )}

        <Card.Body>
          <Card.Title as="h2" className="mb-3 text-center">
            {concept.nombreFormativo}
          </Card.Title>
          <Card.Text style={{ whiteSpace: "pre-wrap" }}>
            {concept.descripcionFormativo}
          </Card.Text>
          
          <div className="mt-4 text-center">
            <Link to={routes.FormativeConceptPage} className="btn btn-outline-primary">
              Volver a conceptos
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}