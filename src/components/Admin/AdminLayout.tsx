// src/components/Admin/AdminLayout.tsx
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import AppNavbar from "../AppNavbar";
import AppFooter from "../AppFooter";
import { routes } from "../../router"; // Importar rutas

export default function AdminLayout() {
  return (
    <div className="layout-container">
      <AppNavbar /> 

      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 min-vh-100">
          {/* Sidebar */}
          <Col xs={3} md={2} className="bg-dark text-white pt-5 sidebar-admin border-end border-secondary">
            <h5 className="p-3 text-warning mb-4">
              <i className="bi bi-shield-lock-fill me-2"></i>
              Administrador
            </h5>
            <Nav className="flex-column px-2 gap-2">
              <Nav.Link as={Link} to={routes.adminDashboardPage} className="text-white rounded hover-bg-secondary">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
              
              {/* Enlace a la nueva pantalla de Conceptos */}
              <Nav.Link as={Link} to={routes.AdminConcept} className="text-white rounded hover-bg-secondary">
                <i className="bi bi-list-check me-2"></i>Gestionar Conceptos
              </Nav.Link>
              
              <Nav.Link as={Link} to="/admin/users" className="text-white rounded hover-bg-secondary">
                <i className="bi bi-people-fill me-2"></i>Usuarios
              </Nav.Link>
            </Nav>
          </Col>

          {/* Content Area */}
          <Col xs={9} md={10} className="p-0 flex-grow-1" style={{ backgroundColor: '#1a1a1a' }}>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <AppFooter /> 
    </div>
  );
}