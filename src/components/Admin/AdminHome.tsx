// src/components/Admin/AdminHome.tsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { dataHelper, type Aporte } from "../../utils/Helper";

export default function AdminDashboard() {
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para los contadores
  const [stats, setStats] = useState({
    PENDIENTE: 0,
    APROBADO: 0,
    RECHAZADO: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dataHelper.getAllAportes();
      setAportes(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Aporte[]) => {
    const counts = {
      PENDIENTE: 0,
      APROBADO: 0,
      RECHAZADO: 0,
    };

    data.forEach((item) => {
      if (item.estado in counts) {
        counts[item.estado as keyof typeof counts]++;
      }
    });

    setStats(counts);
  };

  // Filtramos solo los rechazados para la tabla inferior
  const rechazados = aportes.filter((a) => a.estado === "RECHAZADO");

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-white">Cargando estadísticas...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4 text-warning">Dashboard de Administración</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <p className="text-light mb-4">Resumen del estado actual de los conceptos en la plataforma.</p>

      <Row className="g-4 mb-5">
        {/* PENDIENTES */}
        <Col md={4}>
          <Card bg="warning" text="dark" className="shadow-lg h-100 border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="display-4 fw-bold">{stats.PENDIENTE}</Card.Title>
                  <Card.Text className="fw-semibold text-uppercase ls-1">
                    Pendientes
                  </Card.Text>
                </div>
                <i className="bi bi-hourglass-split" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0 text-end">
              <small>Requieren revisión</small>
            </Card.Footer>
          </Card>
        </Col>

        {/* APROBADOS */}
        <Col md={4}>
          <Card bg="success" text="white" className="shadow-lg h-100 border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="display-4 fw-bold">{stats.APROBADO}</Card.Title>
                  <Card.Text className="fw-semibold text-uppercase ls-1">
                    Aprobados
                  </Card.Text>
                </div>
                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0 text-end">
              <small>Visibles en la app</small>
            </Card.Footer>
          </Card>
        </Col>

        {/* RECHAZADOS */}
        <Col md={4}>
          <Card bg="danger" text="white" className="shadow-lg h-100 border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="display-4 fw-bold">{stats.RECHAZADO}</Card.Title>
                  <Card.Text className="fw-semibold text-uppercase ls-1">
                    Rechazados
                  </Card.Text>
                </div>
                <i className="bi bi-x-circle-fill" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0 text-end">
              <small>Revisar motivos abajo</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* SECCIÓN DE DETALLE DE RECHAZADOS */}
      {rechazados.length > 0 && (
        <Card className="shadow-lg bg-dark text-white border-secondary">
          <Card.Header className="bg-transparent border-secondary">
            <h4 className="text-danger mb-0">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Historial de Rechazos
            </h4>
          </Card.Header>
          <Card.Body>
            <Table responsive variant="dark" hover className="mb-0 align-middle">
              <thead>
                <tr className="text-muted">
                  <th>ID</th>
                  <th>Concepto Propuesto</th>
                  <th>Tipo</th>
                  <th>Usuario</th>
                  <th>Motivo del Rechazo / Descripción</th>
                </tr>
              </thead>
              <tbody>
                {rechazados.map((item) => (
                  <tr key={item.idAporte}>
                    <td>#{item.idAporte}</td>
                    <td className="fw-bold">{item.nombrePropuesto}</td>
                    <td>
                      <Badge bg="info" text="dark">{item.tipoObjeto}</Badge>
                    </td>
                    <td>{item.nombreUsuario || `User ${item.idUsuario}`}</td>
                    <td>
                      {/* NOTA: Actualmente el DTO AporteResponseDTO no tiene un campo específico "motivoRechazo".
                        Mostramos la descripción original para dar contexto. 
                        Si actualizas el backend para incluir el mensaje del admin, cámbialo aquí por item.motivoRechazo 
                      */}
                      <div className="text-break" style={{ maxWidth: "400px" }}>
                        {item.motivoRechazo ? (
                            <span className="text-warning">{item.motivoRechazo}</span>
                        ) : (
                            <span className="text-muted fst-italic">
                                "{item.descripcionPropuesto}" 
                                <br/>
                                <small>(Descripción original del concepto)</small>
                            </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}