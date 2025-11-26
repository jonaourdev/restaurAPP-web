import "../css/AuthForm.css";
import TopBar from "../components/TopBar";
import LoginForm from "../components/LoginForm";
import "../css/Header.css";

export default function LoginPage() {
  return (
    <>
      <TopBar />
      <div className="auth-page-background">
        <LoginForm />
      </div>
    </>
  );
}
