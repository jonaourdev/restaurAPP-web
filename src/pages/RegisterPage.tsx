import RegisterForm from "../components/RegisterForm";
import TopBar from "../components/TopBar";
import "../css/AuthForm.css";

function RegisterPage() {
  return (
    <>
      <TopBar />
      <div className="auth-page-background">
        <RegisterForm />
      </div>
    </>
  );
}

export default RegisterPage;
