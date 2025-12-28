import type React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@nguyentrungkien/shared";
import { useUser } from "../../hooks/useUser";
import Loading from "../Loading";

interface PrivateRouteProp {
  children: React.ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

function PrivateRoute({ children, roles, redirectTo }: PrivateRouteProp) {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles?.includes(user?.role)) {
    return <Navigate to={"/unauthorized"} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
