import RegisterForm from "../components/RegisterForm";
import {Container} from "react-bootstrap";

function RegisterPage() {
  return (
    <>
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <RegisterForm></RegisterForm>
      </Container>
    </>
  );
}

export default RegisterPage;
