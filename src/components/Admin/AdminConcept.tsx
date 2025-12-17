import {useEffect, useState} from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import {dataHelper, type Aporte} from "../../utils/Helper";

export default function AdminConcepts() {
  const [pendientes, setPendientes] = useState<Aporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para el Modal de Rechazo
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAporte, setSelectedAporte] = useState<Aporte | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Para deshabilitar botones mientras se procesa
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadPendientes();
  }, []);

  const loadPendientes = async () => {
    setLoading(true);
    try {
      const allAportes = await dataHelper.getAllAportes();
      // Filtramos solo los que están en estado PENDIENTE
      const filtered = allAportes.filter((a) => a.estado === "PENDIENTE");
      setPendientes(filtered);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las solicitudes pendientes.");
    } finally {
      setLoading(false);
    }
  };

  // Manejador para APROBAR
  const handleApprove = async (aporte: Aporte) => {
    if (!window.confirm(`¿Confirmas APROBAR: "${aporte.nombrePropuesto}"?`))
      return;

    try {
      setProcessingId(aporte.idAporte);
      await dataHelper.reviewAporte(aporte.idAporte, "APROBADO");
      setSuccessMsg(`Solicitud #${aporte.idAporte} aprobada.`);
      // Recargamos la lista para que desaparezca el item procesado
      loadPendientes();
    } catch (err) {
      setError(
        `Error al aprobar: ${
          err instanceof Error ? err.message : "Desconocido"
        }`
      );
    } finally {
      setProcessingId(null);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // Manejador para abrir modal de RECHAZO
  const openRejectModal = (aporte: Aporte) => {
    setSelectedAporte(aporte);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Confirmación de RECHAZO
  const handleRejectConfirm = async () => {
    if (!selectedAporte) return;
    if (!rejectReason.trim()) {
      alert("El motivo es obligatorio para rechazar.");
      return;
    }

    try {
      setProcessingId(selectedAporte.idAporte);
      await dataHelper.reviewAporte(
        selectedAporte.idAporte,
        "RECHAZADO",
        rejectReason
      );
      setSuccessMsg(`Solicitud #${selectedAporte.idAporte} rechazada.`);
      setShowRejectModal(false);
      loadPendientes();
    } catch (err) {
      setError(
        `Error al rechazar: ${
          err instanceof Error ? err.message : "Desconocido"
        }`
      );
    } finally {
      setProcessingId(null);
      setSelectedAporte(null);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-warning">Gestión de Conceptos</h1>
        <Button
          variant="outline-light"
          onClick={loadPendientes}
          title="Refrescar lista"
        >
          <i className="bi bi-arrow-clockwise"></i> Actualizar
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>
          {successMsg}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5 text-white">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2">Cargando...</p>
        </div>
      ) : pendientes.length === 0 ? (
        <Card className="bg-dark text-white text-center p-5 border-secondary">
          <Card.Body>
            <i className="bi bi-check2-circle display-1 text-success mb-3"></i>
            <h3>¡Todo listo!</h3>
            <p className="text-muted">
              No hay conceptos pendientes de revisión.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="bg-dark text-white border-secondary shadow-lg">
          <Card.Header className="bg-transparent border-secondary">
            <h5 className="mb-0 text-warning">
              <i className="bi bi-list-check me-2"></i>
              Pendientes ({pendientes.length})
            </h5>
          </Card.Header>
          <Table responsive variant="dark" hover className="mb-0 align-middle">
            <thead>
              <tr className="text-uppercase small text-muted">
                <th className="ps-4">ID</th>
                <th>Solicitante</th>
                <th>Tipo</th>
                <th>Detalle</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((aporte) => (
                <tr key={aporte.idAporte}>
                  <td className="ps-4 text-light">#{aporte.idAporte}</td>
                  <td>
                    <div className="fw-bold">
                      {aporte.nombreUsuario || "Usuario"}
                    </div>
                    <small className="text-light">ID: {aporte.idUsuario}</small>
                  </td>
                  <td>
                    <Badge
                      bg={
                        aporte.tipoObjeto === "FAMILIA"
                          ? "primary"
                          : aporte.tipoObjeto === "TECNICO"
                          ? "info"
                          : "warning"
                      }
                      text="dark"
                    >
                      {aporte.tipoObjeto}
                    </Badge>
                  </td>
                  <td style={{maxWidth: "300px"}}>
                    <div className="fw-bold text-white">
                      {aporte.nombrePropuesto}
                    </div>
                    <div
                      className="text-light text-truncate small"
                      title={aporte.descripcionPropuesto}
                    >
                      {aporte.descripcionPropuesto}
                    </div>
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(aporte)}
                        disabled={processingId === aporte.idAporte}
                      >
                        <i className="bi bi-check-lg"></i> Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openRejectModal(aporte)}
                        disabled={processingId === aporte.idAporte}
                      >
                        <i className="bi bi-x-lg"></i> Rechazar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal para escribir el motivo de rechazo */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
        contentClassName="bg-dark text-white border-secondary"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title className="text-danger">Rechazar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Vas a rechazar: <strong>{selectedAporte?.nombrePropuesto}</strong>
          </p>
          <Form.Group>
            <Form.Label>Motivo (Requerido):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Indica la razón..."
              className="bg-secondary text-white border-0"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim()}
          >
            Confirmar Rechazo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
