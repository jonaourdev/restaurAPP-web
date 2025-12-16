import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Props {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const navigate = useNavigate();

  // Leer token y usuario del storage
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Verificamos de permisos 
  const isAuthorized = user && user.role && allowedRoles 
    ? allowedRoles.includes(user.role) 
    : true; // Si no hay roles requeridos, está autorizado por defecto

  // ALERTA
  useEffect(() => {
    // Si el usuario existe (está logueado) pero NO tiene permiso:
    if (token && user && allowedRoles && !isAuthorized) {
      
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Restringido',
        text: 'No tienes los permisos suficientes para acceder a esta sección.',
        confirmButtonText: 'Ir al Inicio',
        confirmButtonColor: '#f4a90a', // Color naranja de tu marca
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        // Redirigir al Home después de cerrar la alerta
        navigate("/", { replace: true });
      });
    }
  }, [token, user, allowedRoles, isAuthorized, navigate]);


  // RENDERIZADO CONDICIONAL

  // CASO A: No logueado -> Redirigir al Login inmediatamente
  if (!token || !user || !user.role) {
    return <Navigate to="/loginPage" replace />;
  }

  // CASO B: Logueado pero sin permisos -> Retornar NULL mientras sale la alerta
  // (Esto evita que se vea el contenido protegido o una pantalla en blanco extraña)
  if (allowedRoles && !isAuthorized) {
    return null; 
  }

  // CASO C: Todo correcto -> Mostrar contenido
  return <Outlet />;
};