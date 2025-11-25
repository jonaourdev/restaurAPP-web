import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ConceptPage from "./pages/ConceptPage";
import FormativeConceptPage from "./pages/FormativeConceptPage";
import TechnicalConceptPage from "./pages/TechnicalConceptPage";

import FamiliyDetailPage from "./pages/FamiliyDetailPage";
import AddFormativePage from "./pages/AddFormativePage";
import AddFamilyPage from "./pages/AddFamilyPage";
import AddTechnicalPage from "./pages/AddTechnicalPage";

import FormativeConceptDetail from "./components/FormativeConcepts/FormativeConceptDetail";
import TechnicalConceptDetailPage from "./pages/TechnicalConceptDetailPage";

import AddChoicePage from "./pages/AddChoicePage";

export const routes = {
  landing: "/",
  loginPage: "/loginPage",
  registerPage: "/registerPage",
  conceptPage: "/conceptPage",
  FormativeConceptPage: "/FormativeConceptPage",
  TechnicalConceptPage: "/TechnicalConceptPage",
  conceptDetail: "/concepto/:id",
  familyDetail: "/familia/:id",
  technicalConceptDetailPage: "/technical/concept/:id",
  AddChoice: "/AddChoicePage",
  addFormative: "/add/formative",
  addFamily: "/add/family",
  addTechnical: "/add/technical",
} as const;

const router = createBrowserRouter([
  { path: routes.landing, element: <LandingPage /> },
  { path: routes.loginPage, element: <LoginPage /> },
  { path: routes.registerPage, element: <RegisterPage /> },

  {
    element: <Layout />,
    children: [
      { path: routes.conceptPage, element: <ConceptPage /> },
      { path: routes.FormativeConceptPage, element: <FormativeConceptPage /> },
      { path: routes.TechnicalConceptPage, element: <TechnicalConceptPage /> },

      { path: routes.conceptDetail, element: <FormativeConceptDetail /> },
      { path: routes.familyDetail, element: <FamiliyDetailPage /> },
      {
        path: routes.technicalConceptDetailPage,
        element: <TechnicalConceptDetailPage />,
      },

      { path: routes.AddChoice, element: <AddChoicePage /> },
      { path: routes.addFormative, element: <AddFormativePage /> },
      { path: routes.addFamily, element: <AddFamilyPage /> },
      { path: routes.addTechnical, element: <AddTechnicalPage /> },
    ],
  },
]);

export default router;
