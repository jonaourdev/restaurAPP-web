// ProtectedRoute.tsx
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Props {
  allowedRoles?: string[]; // Roles requeridos (ej: ["ADMIN"])
  allowGuest?: boolean; // Si true, deja pasar aunque no haya token
}

export const ProtectedRoute = ({ allowedRoles, allowGuest = false }: Props) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const hasSession = Boolean(token && user && user.role);

  const isAuthorized =
    hasSession && allowedRoles ? allowedRoles.includes(user.role) : true; // si no hay roles especificados, cualquier user logueado pasa

  // ALERTA solo si ESTÁ logueado pero no tiene permisos
  useEffect(() => {
    if (hasSession && allowedRoles && !isAuthorized) {
      Swal.fire({
        icon: "warning",
        title: "Acceso Restringido",
        text: "No tienes los permisos suficientes para acceder a esta sección.",
        confirmButtonText: "Ir al Inicio",
        confirmButtonColor: "#f4a90a",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [hasSession, allowedRoles, isAuthorized, navigate]);

  // 🔹 CASO 1: NO hay sesión
  if (!hasSession) {
    // Si se permite invitado → lo dejamos pasar
    if (allowGuest) {
      return <Outlet />;
    }
    // Si NO se permite invitado → al login
    return <Navigate to="/loginPage" replace />;
  }

  // 🔹 CASO 2: Sí hay sesión, pero no tiene rol requerido
  if (allowedRoles && !isAuthorized) {
    // Mientras se muestra el Swal, no renderizamos nada
    return null;
  }

  // 🔹 CASO 3: Todo bien → mostramos contenido
  return <Outlet />;
};
