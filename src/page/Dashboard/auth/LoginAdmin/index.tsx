import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@nguyentrungkien/shared";
import useAuth from "../../../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export interface LoginResponse {
  status: boolean;
  message: string;
}

function LoginAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLogin, setDataLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChangeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDataLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(UserRole.ADMIN, dataLogin.email, dataLogin.password);

      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 401) {
        setErrorMessage("Email hoặc mật khẩu không đúng!");
      } else if (error.code === "ECONNABORTED") {
        setErrorMessage("Timeout! Vui lòng thử lại.");
      } else {
        setErrorMessage("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-[2.5rem] border-t-4 border-blue-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl">🔐</span>
          </div>
          <h2 className="text-[2.2rem] font-bold text-slate-800 mb-2">
            Quản Trị Viên
          </h2>
          <p className="text-slate-600 mb-4">Admin & Staff Portal</p>

          <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[1.2rem] text-amber-700 flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Khu vực hạn chế - Không chia sẻ thông tin đăng nhập
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@company.com"
              value={dataLogin.email}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleChangeData}
              onFocus={() => setErrorMessage(null)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={dataLogin.password}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={handleChangeData}
                onFocus={() => setErrorMessage(null)}
                required
              />
              <button
                type="button"
                className="absolute top-[50%] translate-y-[-50%] right-4 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="text-gray-600"
                  />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <button
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all mt-[1.8rem] ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang xác thực..." : "Đăng nhập quản trị"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-[1.4rem] text-blue-600 hover:text-blue-700 font-medium"
          >
            Liên hệ IT Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
