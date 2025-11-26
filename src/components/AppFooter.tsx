import { Container } from "react-bootstrap";
import "../css/AppFooter.css";

function AppFooter() {
  return (
    <>
      <footer className=" py-3 mt-auto footerCSS">
        <Container className="text-center small">
          © 2025 - Excelsior - Todos los derechos reservados
        </Container>
      </footer>
    </>
  );
}

export default AppFooter;
