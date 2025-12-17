import { Navbar, Container } from "react-bootstrap";
import "../css/TopBar.css";

function TopBar() {
  return (
    <>
      <Navbar className="nav-yellow shadow-sm" sticky="top">
        <Container fluid className="justify-content-center">
          <Navbar.Brand
            href="/loginPage"
            className="mx-auto d-flex align-items-center gap-2 brand-center"
          >
            <span role="img" aria-label="columna">
              🏛️
            </span>
            <span className="fw-semibold">RestaurAPP</span>
            <span role="img" aria-label="columna">
              🏛️
            </span>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default TopBar;
