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
  redirectPath = "/auth/login",
  children,
  authorizedRoles,
}: ProtectedRouteProps) => {
 
    if (!user?.username || !user?.role)  {
    return <Navigate to={redirectPath} replace />;
  }

  if (authorizedRoles && !authorizedRoles.includes(user.role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
