import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { dataHelper, type Formative } from "../../utils/Helper";
import AddNewCard from "../ConceptCards/CardAgregar";

export default function FormativeConcepts() {
  const [concepts, setConcepts] = useState<Formative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Pedimos los datos REALES al backend
      const realData = await dataHelper.getRealFormativos();
      
      // 2. Los transformamos al formato que usa este componente (Formative)
      const mappedData: Formative[] = realData.map(dto => ({
        conceptId: dto.idFormativo,
        name: dto.nombreFormativo,
        description: dto.descripcionFormativo,
        // image: dto.urlImagen // Si lo agregas en el futuro
      }));

      setConcepts(mappedData);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los conceptos. Revisa que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Cargando conceptos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">CONCEPTOS FORMATIVOS</h1>

      <div className="row g-4">
        {concepts.map((concept) => (
          <div key={concept.conceptId} className="col-12 col-md-6 col-lg-4">
            <Link 
              to={`/concepto/${concept.conceptId}`}
              className="text-decoration-none"
            >
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body>
                  <Card.Title className="text-center mb-3">{concept.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {concept.description.substring(0, 150)}...
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center bg-transparent">
                  <span className="btn btn-outline-primary">Ver más</span>
                </Card.Footer>
              </Card>
            </Link>
          </div>
        ))}

        {/* Tarjeta para agregar nuevo */}
        <div className="col-12 col-md-6 col-lg-4">
          <AddNewCard />
        </div>
      </div>
    </Container>
  );
}