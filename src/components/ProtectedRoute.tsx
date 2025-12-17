import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Props {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const navigate = useNavigate();

  // 1. Leer token y usuario del storage
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // 2. Normalizar el rol (CRÍTICO: El backend suele enviar "rol", el front a veces busca "role")
  // Esto asegura que userRole tenga valor sin importar cómo venga del backend.
  const userRole = user?.role || user?.rol;

  // 3. Verificar autorización
  // Si hay usuario, hay rol y la ruta pide roles específicos, verificamos si lo incluye.
  const isAuthorized = user && userRole && allowedRoles 
    ? allowedRoles.includes(userRole) 
    : true; // Si no se especifican allowedRoles, se asume acceso permitido a cualquier logueado

  // 4. Manejo de Alerta por falta de permisos
  useEffect(() => {
    // Solo mostramos la alerta si el usuario EXISTE (está logueado) pero NO tiene permiso
    if (token && user && allowedRoles && !isAuthorized) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Restringido',
        text: 'No tienes los permisos suficientes para acceder a esta sección.',
        confirmButtonText: 'Ir al Inicio',
        confirmButtonColor: '#f4a90a', 
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        // Redirigir al Home después de cerrar la alerta
        navigate("/", { replace: true });
      });
    }
  }, [token, user, allowedRoles, isAuthorized, navigate]);


  // 5. RENDERIZADO CONDICIONAL

  // CASO A: No logueado o datos corruptos -> Redirigir al Login inmediatamente
  // Aquí usamos 'userRole' verificado en el paso 2
  if (!token || !user || !userRole) {
    console.warn("⛔ REDIRIGIENDO AL LOGIN PORQUE FALTA TOKEN O ROL");
    return <Navigate to="/loginPage" replace />;
  }

  // CASO B: Logueado pero sin permisos -> Retornar NULL
  // Retornamos null para que no se renderice el contenido protegido mientras carga la alerta de SweetAlert
  if (allowedRoles && !isAuthorized) {
    return null; 
  }

  // CASO C: Todo correcto -> Mostrar contenido (Rutas hijas)
  return <Outlet />;
};