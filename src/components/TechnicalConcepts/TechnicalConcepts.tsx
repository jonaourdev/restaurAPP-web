import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewCard from "../ConceptCards/CardAgregar";
import "../../css/ConceptCards/CardTecnica.css";
import { dataHelper, type Family } from "../../utils/Helper";

export default function TechnicalConcepts() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Pedimos Familias y Conceptos Técnicos en paralelo
      const [familiasDTO, tecnicosDTO] = await Promise.all([
        dataHelper.getRealFamilias(),
        dataHelper.getRealTecnicos()
      ]);

      // 2. Unimos los datos (Mapeo)
      const mappedFamilies: Family[] = familiasDTO.map(f => {
        // Buscamos los técnicos que pertenecen a esta familia
        const susTecnicos = tecnicosDTO.filter(t => t.idFamilia === f.idFamilia);

        return {
          idFamilies: f.idFamilia,
          name: f.nombreFamilia,
          descriptions: f.descripcionFamilia,
          componentItemn: f.descripcionFamilia, // O mapear componentes si los tienes en el DTO
          subConcepto: susTecnicos.map(t => ({
            conceptId: t.idTecnico,
            familyId: f.idFamilia,
            name: t.nombreTecnico,
            description: t.descripcionTecnico
          }))
        };
      });

      setFamilies(mappedFamilies);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos técnicos.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" variant="warning"/></Container>;
  }

  if (error) {
    return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5 display-5">CONCEPTOS TÉCNICOS</h1>

      <div className="technical-grid">
        {families.map((family) => (
          <Card key={family.idFamilies} className="article-card d-flex flex-column shadow-lg">
            <Card.Body className="d-flex align-items-center">
              <div className="card-left flex-grow-1">
                <h5 className="mb-3">Familia: {family.name}</h5>

                {family.subConcepto && family.subConcepto.length > 0 ? (
                  <ul className="list-unstyled">
                    {family.subConcepto.map((sub) => (
                      <li key={sub.conceptId} className="py-1">
                        <Link to={`/technical/concept/${sub.conceptId}`}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-3">
                    <span className="chev">⌄</span>
                    <small className="d-block text-muted">Sin subconceptos aún</small>
                  </div>
                )}

                <div className="mt-3">
                  <Link to={`/familia/${family.idFamilies}`} className="btn btn-outline-primary">
                    Ver Familia
                  </Link>
                </div>
              </div>

              <div className="card-right">
                <div className="image-placeholder" />
              </div>
            </Card.Body>
          </Card>
        ))}

        {/* Tarjeta Agregar Nuevo */}
        <div className="add-new-wrapper">
          <AddNewCard />
        </div>
      </div>
    </Container>
  );
}