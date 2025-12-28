import { Navigate } from "react-router-dom";
import { UserRole } from "@nguyentrungkien/shared";
import { useUser } from "../../hooks/useUser";

interface Props {
  children: React.ReactNode;
}

export default function CustomerRoute({ children }: Props) {
  const { user } = useUser();

  if (user && (user.role === UserRole.ADMIN || user.role === UserRole.STAFF)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
