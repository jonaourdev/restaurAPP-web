import {Container, Nav, Navbar} from "react-bootstrap";
import "../css/AppNavbar.css";
import {Link} from "react-router-dom";

function AppNavbar() {
  return (
    <>
      <Navbar expand="lg" className="navCSS" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to={"/"}>
            <img
              alt=""
              src="../src/assets/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            RestaurAPP
            <img
              alt=""
              src="../src/assets/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={"/"}>
                Home
              </Nav.Link>
              <Nav.Link href="#conceptos">Conceptos</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#registrarse">Registrarse</Nav.Link>
              <Nav.Link href="#iniciarsesion">Iniciar sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;
