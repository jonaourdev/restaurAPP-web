import {Button} from "react-bootstrap";
import "../css/Header.css";
import {useNavigate} from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="parallax">
        <div className="content">
          <h1 className="animate__animated animate__fadeInDown">
            ¡Bienvenido a RestaurAPP!
          </h1>
          <p className="animate__animated animate__fadeInUp animate__delay-1s">
            Educate con nosotros
          </p>
          <div className="p-3 buttonStart">
            <Button
              onClick={() => navigate("/loginPage")}
              className="btn-lg animate__animated animate__bounceIn animate__delay-2s"
              variant="dark"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => navigate("/conceptPage")}
              className="btn-lg animate__animated animate__bounceIn animate__delay-2s"
              variant="dark"
            >
              Entrar como invitado
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
