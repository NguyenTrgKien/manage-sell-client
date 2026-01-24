import { createContext, type ReactNode } from "react";
import axiosConfig from "../configs/axiosConfig";
import type { RegisterForm } from "../page/customer/Auth/Register";
import { useUser } from "../hooks/useUser";
import { UserRole } from "@nguyentrungkien/shared";

interface AuthContextType {
  login: (role: UserRole, email: string, password: string) => Promise<void>;
  register: (userData: RegisterForm) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { refreshUser, clearUser } = useUser();

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
        userData,
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
      sessionStorage.removeItem("checkoutData");
      clearUser();
      await refreshUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
