import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute"; // <--- Importamos el componente

// Imports de tus páginas
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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminConceptPage from "./pages/admin/AdminConceptPage";

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
  adminDashboardPage: "/admin/dashboard",
  adminLayout: "/admin",
  AdminConcept: "/admin/concepts",
} as const;

const router = createBrowserRouter([
  // ---------------------------------------------------------------
  // 1. RUTAS PÚBLICAS (Cualquiera puede entrar)
  // ---------------------------------------------------------------
  { path: routes.landing, element: <LandingPage /> },
  { path: routes.loginPage, element: <LoginPage /> },
  { path: routes.registerPage, element: <RegisterPage /> },

  // ---------------------------------------------------------------
  // 2. RUTAS PARA USUARIOS LOGUEADOS (USER y ADMIN)
  // ---------------------------------------------------------------
  {
    element: <Layout />,
    children: [
      {
        // AQUI DEFINIMOS QUE TANTO 'USER' COMO 'ADMIN' PUEDEN ENTRAR
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [
          { path: routes.conceptPage, element: <ConceptPage /> },
          { path: routes.FormativeConceptPage, element: <FormativeConceptPage /> },
          { path: routes.TechnicalConceptPage, element: <TechnicalConceptPage /> },
          { path: routes.conceptDetail, element: <FormativeConceptDetail /> },
          { path: routes.familyDetail, element: <FamiliyDetailPage /> },
          { path: routes.technicalConceptDetailPage, element: <TechnicalConceptDetailPage /> },
          
          // Rutas para agregar contenido (disponibles para ambos roles)
          { path: routes.AddChoice, element: <AddChoicePage /> },
          { path: routes.addFormative, element: <AddFormativePage /> },
          { path: routes.addFamily, element: <AddFamilyPage /> },
          { path: routes.addTechnical, element: <AddTechnicalPage /> },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------
  // 3. RUTAS EXCLUSIVAS DE ADMINISTRADOR (Solo ADMIN)
  // ---------------------------------------------------------------
  {
    path: routes.adminLayout,
    // AQUI DEFINIMOS QUE SOLO EL ROL 'ADMIN' PUEDE ENTRAR
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />, 
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: routes.adminDashboardPage, element: <AdminDashboardPage /> },
          { path: routes.AdminConcept, element: <AdminConceptPage /> },
        ],
      },
    ],
  },
]);

export default router;