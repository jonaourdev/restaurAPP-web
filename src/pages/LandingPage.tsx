import AppFooter from "../components/AppFooter";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import "../css/LandingPage.css";

function LandingPage() {
  return (
    <>
      <div className="landingPageCSS">
        <TopBar></TopBar>
        <Header></Header>
        <AppFooter></AppFooter>
      </div>
    </>
  );
}

export default LandingPage;
