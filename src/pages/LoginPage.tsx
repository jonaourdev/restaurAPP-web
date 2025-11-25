import "../css/AuthForm.css";
import TopBar from "../components/TopBar";
import LoginForm from "../components/LoginForm";

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
