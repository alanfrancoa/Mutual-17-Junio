import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { Role } from "../helper/config";

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

  // Validacion username y role para redirigir sin ningun dato en session storage
  if (!user?.username || !user?.role) {
    return (
      <Navigate to="/auth/login" state={{ tokenExpired: false }} replace />
    );
  }

  // Primero validamos el token, para redirigir al login con msj error de token vencido
  if (!token) {
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
