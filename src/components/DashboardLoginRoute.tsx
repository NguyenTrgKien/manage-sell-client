import type React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@nguyentrungkien/shared";
import { useUser } from "../hooks/useUser";

function DashboardLoginRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && [UserRole.ADMIN, UserRole.STAFF].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;    
  }

  return <>{children}</>;
}

export default DashboardLoginRoute;
