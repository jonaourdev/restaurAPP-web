import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./router.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
