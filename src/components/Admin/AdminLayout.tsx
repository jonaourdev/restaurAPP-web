// src/components/AdminLayout.tsx
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import AppNavbar from "../AppNavbar";
import AppFooter from "../AppFooter";


export default function AdminLayout() {
  return (
    <div className="layout-container">
      <AppNavbar /> 

      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 min-vh-100">
          {/* Sidebar */}
          <Col xs={3} md={2} className="bg-dark text-white pt-5 sidebar-admin">
            <h5 className="p-3 text-warning">Administrador</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/concepts" className="text-white">
                <i className="bi bi-archive-fill me-2"></i>Conceptos
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" className="text-white">
                <i className="bi bi-people-fill me-2"></i>Usuarios
              </Nav.Link>
            </Nav>
          </Col>

        
          <Col xs={9} md={10} className="p-4 flex-grow-1" style={{ backgroundColor: '#1a1a1a' }}>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <AppFooter /> 
    </div>
  );
}