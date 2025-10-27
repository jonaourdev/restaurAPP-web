import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConceptPage from "./pages/ConceptPage";
import FormativeConceptPage from "./pages/FormativeConceptPage";
import TechnicalConceptPage from "./pages/TechnicalConceptPage";
import FamiliyDetailPage from "./pages/FamiliyDetailPage";
import FormativeConceptDetail from "./components/FormativeConcepts/FormativeConceptDetail";
import TechnicalConceptDetailPage from "./pages/TechnicalConceptDetailPage";

export const routes = {
  landing: "/",
  loginPage: "/loginPage",
  registerPage: "/registerPage",
  conceptPage: "/conceptPage",
  FormativeConceptPage: "/FormativeConceptPage",
  TechnicalConceptPage: "/TechnicalConceptPage",
  conceptDetail: "/concepto/:id",
  familyDetail: "/familia/:id",
  addChoicePage: "/addChoicePage",
    technicalConceptDetailPage: "/technical/concept/:id",
} as const;

const router = createBrowserRouter([
  //1) caída sobre landingPage.tsx
  {path: "/", element: <LandingPage></LandingPage>},

  //2) carga con Layout.tsx
  {
    element: <Layout></Layout>,
    children: [
      {path: routes.loginPage, element: <LoginPage></LoginPage>},
      {path: routes.registerPage, element: <RegisterPage></RegisterPage>},
      {path: routes.conceptPage, element: <ConceptPage></ConceptPage>},
      {path: routes.FormativeConceptPage, element: <FormativeConceptPage></FormativeConceptPage>},
      {path: routes.TechnicalConceptPage, element: <TechnicalConceptPage></TechnicalConceptPage>},
      {path: routes.conceptDetail, element: <FormativeConceptDetail></FormativeConceptDetail>},
      {path: routes.familyDetail, element: <FamiliyDetailPage></FamiliyDetailPage>},
      {path: routes.addChoicePage, element: <ConceptPage></ConceptPage>},
      {path: routes.technicalConceptDetailPage, element: <TechnicalConceptDetailPage></TechnicalConceptDetailPage>},
   

      // {path: "*", element: <NotFound></NotFound>},
    ],
  },
]);

export default router;
