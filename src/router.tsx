import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/Layout";
import GuestPage from "./pages/GuestPage";
import LandingPage from "./pages/LandingPage";

export const routes = {
  landing: "/",
  guestPage: "/guestPage",
} as const;

const router = createBrowserRouter([
  //1) caída sobre landingPage.tsx
  {path: "/", element: <LandingPage></LandingPage>},

  //2) carga con Layout.tsx
  {
    element: <Layout></Layout>,
    children: [
      {path: routes.guestPage, element: <GuestPage></GuestPage>},
      // {path: "*", element: <NotFound></NotFound>},
    ],
  },
]);

export default router;
