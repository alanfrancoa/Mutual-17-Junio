import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { Role } from "../helper/config";
import { isTokenExpired } from "../helper/authservice";

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
  redirectPath = "/auth/login",
  children,
  authorizedRoles,
}: ProtectedRouteProps) => {
  const token = sessionStorage.getItem("token");

  // limpieza token vencido +2hs
  if (!user?.username || !user?.role || !token || isTokenExpired(token)) {
    sessionStorage.clear();
    return <Navigate to={redirectPath} replace />;
  }

  if (authorizedRoles && !authorizedRoles.includes(user.role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
