import { createContext, useState, type ReactNode } from "react";
import axiosConfig from "../configs/axiosConfig";
import { UserRole } from "@my-project/shared";
import type { RegisterForm } from "../page/customer/Auth/Register";
import { useUser } from "../hooks/useUser";
import type { UserType } from "../utils/userType";

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  login: (role: UserRole, email: string, password: string) => Promise<void>;
  register: (userData: RegisterForm) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser, clearUser } = useUser();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = (await axiosConfig.get("/api/v1/auth/me")) as any;
      if (res.status) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (role: UserRole, email: string, password: string) => {
    let endpoint = "/api/v1/auth/login";

    if (role === UserRole.ADMIN || role === UserRole.STAFF) {
      endpoint = "/api/v1/auth/admin/login";
    }
    try {
      const res = (await axiosConfig.post(endpoint, {
        email,
        password,
      })) as any;
      if (res.status) {
        await refreshUser();
      } else {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (userData: RegisterForm) => {
    try {
      const res = (await axiosConfig.post(
        "/api/v1/auth/register",
        userData
      )) as any;
      if (res.status) {
        await refreshUser();
      } else {
        throw new Error(res.message || "Đăng ký thất bại!");
      }
    } catch (error: any) {
      console.log(error);
      throw error.response.data;
    }
  };

  const logout = async () => {
    try {
      await axiosConfig.get("/api/v1/auth/logout");
      clearUser();
      await refreshUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, register, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
