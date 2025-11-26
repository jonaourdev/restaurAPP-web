import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
import "../css/AppNavbar.css";
import { Link, useNavigate } from "react-router-dom";

interface User {
  fullName: string;
  email: string;
}

function AppNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/";
  };

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
            />{" "}
            RestaurAPP{" "}
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
              <Nav.Link as={Link} to={"/conceptPage"}>
                Conceptos
              </Nav.Link>
            </Nav>

            {user ? (
              // Vista para usuario logeado
              <Nav>
                <NavDropdown
                  title={
                    <>
                      <Image
                        src="../src/assets/default-profile.png"
                        roundedCircle
                        width="30"
                        height="30"
                        className="me-2"
                      />
                      {user.fullName}
                    </>
                  }
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profilePage">
                    Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              // Vista para usuario no logeado
              <Nav>
                <Nav.Link as={Link} to={"/registerPage"}>
                  Registrarse
                </Nav.Link>
                <Nav.Link as={Link} to={"/loginPage"}>
                  Iniciar sesión
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;
