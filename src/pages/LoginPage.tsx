import LoginForm from "../components/LoginForm";
import {Container} from "react-bootstrap";

function LoginPage() {
  return (
    <>
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <LoginForm></LoginForm>
      </Container>
    </>
  );
}

export default LoginPage;
