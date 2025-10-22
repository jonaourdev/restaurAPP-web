import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "../css/AppNavbar.css";

function AppNavbar() {
  return (
    <>
      <Navbar className="navCSS" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src="../src/assets/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            RestaurAPP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" />
          <Nav>
            <Nav.Link>
              <Button variant="link">Home</Button>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;
