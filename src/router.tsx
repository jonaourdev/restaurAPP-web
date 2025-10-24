import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/Layout";
import GuestPage from "./pages/GuestPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConceptPage from "./pages/ConceptPage";

export const routes = {
  landing: "/",
  guestPage: "/guestPage",
  loginPage: "/loginPage",
  registerPage: "/registerPage",
  conceptPage: "/conceptPage",
} as const;

const router = createBrowserRouter([
  //1) caída sobre landingPage.tsx
  {path: "/", element: <LandingPage></LandingPage>},

  //2) carga con Layout.tsx
  {
    element: <Layout></Layout>,
    children: [
      {path: routes.guestPage, element: <GuestPage></GuestPage>},
      {path: routes.loginPage, element: <LoginPage></LoginPage>},
      {path: routes.registerPage, element: <RegisterPage></RegisterPage>},
      {path: routes.conceptPage, element: <ConceptPage></ConceptPage>},
      // {path: "*", element: <NotFound></NotFound>},
    ],
  },
]);

export default router;
