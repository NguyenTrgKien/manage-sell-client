import { useEffect, useState, type ReactNode } from "react";
import axiosConfig from "../../configs/axiosConfig";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface AuthResponse {
  status: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    image: string | null;
  };
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = (await axiosConfig.get("api/v1/auth/me")) as AuthResponse;
        if (res.status) {
          setUser(res.user);
          setIsAuth(true);
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuth(false);
        setUser(null);
      }
    };
    fetch();
  }, [setUser]);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-[1.4rem] font-medium">
            Đang kiểm tra đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  if (isAuth === false) {
    return <Navigate to={"/dashboard/login"} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
