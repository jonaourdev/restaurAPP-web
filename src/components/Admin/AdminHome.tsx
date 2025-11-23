// src/pages/AdminDashboardPage.tsx
import { Container, Row, Col, Card } from "react-bootstrap";

// Simulación de datos de estados de conceptos
// (Estos datos vendrían de tu backend real: ConceptoFormativo y ConceptoTecnico)
const mockConceptStatus = {
  PENDIENTE: 12, // Por revisar
  APROBADO: 45, // Listo para producción
  RECHAZADO: 5,  // Necesita ajustes o no es válido
};

export default function AdminDashboard() {
  return (
    <Container fluid className="p-4">
      <h1 className="mb-4 text-warning">Dashboard de Administración</h1>
      <p className="text-muted">Resumen del estado actual de los conceptos en revisión.</p>

      <Row className="g-4 mt-3">
        {/* Tarjeta de Conceptos PENDIENTES */}
        <Col md={4}>
          <Card bg="warning" text="dark" className="shadow-lg h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h2">{mockConceptStatus.PENDIENTE}</Card.Title>
                  <Card.Text className="fw-semibold">
                    CONCEPTOS PENDIENTES
                  </Card.Text>
                </div>
                <i className="bi bi-hourglass-split" style={{ fontSize: '3rem' }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <small>Requieren revisión</small>
            </Card.Footer>
          </Card>
        </Col>

        {/* Tarjeta de Conceptos APROBADOS */}
        <Col md={4}>
          <Card bg="success" text="white" className="shadow-lg h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h2">{mockConceptStatus.APROBADO}</Card.Title>
                  <Card.Text className="fw-semibold">
                    CONCEPTOS APROBADOS
                  </Card.Text>
                </div>
                <i className="bi bi-check-circle" style={{ fontSize: '3rem' }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <small>Publicados en la plataforma</small>
            </Card.Footer>
          </Card>
        </Col>

        {/* Tarjeta de Conceptos RECHAZADOS */}
        <Col md={4}>
          <Card bg="danger" text="white" className="shadow-lg h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h2">{mockConceptStatus.RECHAZADO}</Card.Title>
                  <Card.Text className="fw-semibold">
                    CONCEPTOS RECHAZADOS
                  </Card.Text>
                </div>
                <i className="bi bi-x-circle" style={{ fontSize: '3rem' }}></i>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <small>Requieren edición o eliminación</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}