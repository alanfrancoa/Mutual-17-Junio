import { JSX } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Role } from "../helper/config";
import useAppToast from "../hooks/useAppToast";
import toast from "react-hot-toast";

export interface ProtectedUser {
  username: string | null;
  role: Role | null;
}

type ProtectedRouteProps = {
  user: ProtectedUser | null;
  authorizedRoles?: Role[];
  redirectPath?: string;
  children: JSX.Element;
};

const ProtectedRoute = ({
  user,
  children,
  authorizedRoles,
}: ProtectedRouteProps) => {
  const token = sessionStorage.getItem("token");
  const { showErrorToast } = useAppToast();
  const navigate = useNavigate();

  // Validacion username y role para redirigir sin ningun dato en session storage
  if (!user?.username || !user?.role) {
    return (
      <Navigate to="/auth/login" state={{ tokenExpired: false }} replace />
    );
  }

  // Primero validamos el token, para redirigir al login con msj error de token vencido
  if (!token) {
    showErrorToast({
      title: "Error de autenticacion.",
      message: "Sesion expirada, por favor ingrese nuevamente",
    });

    return (
      <Navigate to={`/auth/login`} state={{ tokenExpired: true }} replace />
    );
   
  }

  if (authorizedRoles && !authorizedRoles.includes(user.role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
