import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
  
  // Conceptos (Públicos)
  conceptPage: "/conceptPage",
  FormativeConceptPage: "/FormativeConceptPage",
  TechnicalConceptPage: "/TechnicalConceptPage",
  conceptDetail: "/concepto/:id",
  familyDetail: "/familia/:id",
  technicalConceptDetailPage: "/technical/concept/:id",
  
  // Agregar contenido (Privado)
  AddChoice: "/AddChoicePage",
  addFormative: "/add/formative",
  addFamily: "/add/family",
  addTechnical: "/add/technical",
  
  // Admin (Privado)
  adminLayout: "/admin",
  adminDashboardPage: "/admin/dashboard",
  AdminConcept: "/admin/concepts",
} as const;

const router = createBrowserRouter([
  // ---------------------------------------------------------------
  // 1. RUTAS DE ACCESO TOTALMENTE PÚBLICO (Sin Layout)
  // ---------------------------------------------------------------
  { path: routes.landing, element: <LandingPage /> },
  { path: routes.loginPage, element: <LoginPage /> },
  { path: routes.registerPage, element: <RegisterPage /> },

  // ---------------------------------------------------------------
  // 2. RUTAS DE LECTURA PÚBLICA (Con Layout, pero sin Login requerido)
  // ---------------------------------------------------------------
  // Aquí ponemos las páginas que puede ver un INVITADO
  {
    element: <Layout />,
    children: [
      { path: routes.conceptPage, element: <ConceptPage /> },
      { path: routes.FormativeConceptPage, element: <FormativeConceptPage /> },
      { path: routes.TechnicalConceptPage, element: <TechnicalConceptPage /> },
      { path: routes.conceptDetail, element: <FormativeConceptDetail /> },
      { path: routes.familyDetail, element: <FamiliyDetailPage /> },
      { path: routes.technicalConceptDetailPage, element: <TechnicalConceptDetailPage /> },
    ],
  },

  // ---------------------------------------------------------------
  // 3. RUTAS PROTEGIDAS (Solo Usuarios Logueados)
  // ---------------------------------------------------------------
  // Aquí ponemos SOLO lo que requiere permisos (Crear/Editar)
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [
          { path: routes.AddChoice, element: <AddChoicePage /> },
          { path: routes.addFormative, element: <AddFormativePage /> },
          { path: routes.addFamily, element: <AddFamilyPage /> },
          { path: routes.addTechnical, element: <AddTechnicalPage /> },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------
  // 4. RUTAS EXCLUSIVAS DE ADMINISTRADOR
  // ---------------------------------------------------------------
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />, 
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: routes.adminLayout, element: <Navigate to={routes.adminDashboardPage} replace /> },
          { path: routes.adminDashboardPage, element: <AdminDashboardPage /> },
          { path: routes.AdminConcept, element: <AdminConceptPage /> },
        ],
      },
    ],
  },
]);

export default router;