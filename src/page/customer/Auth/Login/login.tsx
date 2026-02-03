import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@nguyentrungkien/shared";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading";
import { toast } from "react-toastify";
import axiosConfig from "../../../../configs/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import FacebookLogin from "@greatsumini/react-facebook-login";
import GoogleLogo from "../../../../assets/images/google-logo.png";
import FacebookLogo from "../../../../assets/images/facebook-logo.png";

export interface LoginResponse {
  status: boolean;
  message: string;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLogin, setDataLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isMergeCart, setIsMergeCart] = useState(false);
  const queryClient = useQueryClient();

  const handleChangeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDataLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleLoginSuccess = async () => {
    try {
      if (isMergeCart) {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        if (localCart.length > 0) {
          const res = await axiosConfig.post("/api/v1/cart/merge", {
            localItems: localCart,
          });

          if (res.status) {
            toast.success("Đã gộp giỏ hàng của bạn!");
            localStorage.removeItem("localCart");
          }
        }
      }
      if (from === "/checkout") {
        navigate("/cart/detail", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error("Lỗi khi gộp giỏ hàng!");
      navigate(from, { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(UserRole.USER, dataLogin.email, dataLogin.password);
      await handleLoginSuccess();
    } catch (error: any) {
      if (error.message?.includes(UserRole.ADMIN || UserRole.STAFF)) {
        setShowAdminModal(true);
        return;
      }
      setErrorMessage(error?.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (credentialResponse: any) => {
      try {
        const { credential } = credentialResponse;
        const res = await axiosConfig.post("/api/v1/auth/login-google", {
          idToken: credential,
        });
        if (res.status) {
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          await handleLoginSuccess();
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message || "Có lỗi xảy ra. Vui lòng thực hiện lại!");
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
    },
  });

  const onSuccessLoginFacebook = async (response: any) => {
    try {
      const { accessToken } = response;
      const res = await axiosConfig.post("/api/v1/auth/login-facebook", {
        accessToken: accessToken,
      });
      if (res.status) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        await handleLoginSuccess();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thực hiện lại!");
    }
  };

  const onErrorLoginFacebook = async () => {
    console.log("Đăng nhập với facebook thất bại. Vui lòng thực hiện lại!");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center md:p-4">
      <button
        type="button"
        className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div className="w-[90%] md:max-w-3xl bg-white shadow-2xl rounded-2xl p-5 md:p-[2.5rem] transform transition-all">
        <div className="text-center mb-8">
          <div className="w-15 md:w-20 h-15 md:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg
              className="w-6 md:w-10 h-6 md:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-gray-800 mb-2">
            Đăng nhập
          </h2>
          <p className="text-gray-500 text-[1.4rem] md:text-[1.6rem]">
            Chào mừng bạn trở lại! 👋
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-[1.4rem] md:text-[1.6rem]"
        >
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="your@email.com"
              value={dataLogin.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              onChange={handleChangeData}
              onFocus={() => setErrorMessage(null)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-2"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                value={dataLogin.password}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
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
            <p className="text-[1.4rem] text-red-600">{errorMessage}</p>
          )}
          <div className="mt-[2.5rem] flex items-center space-x-4">
            <label htmlFor="mergeCart">Gộp giỏ hàng khi đang nhập</label>
            <input
              type="checkbox"
              id="mergeCart"
              name="mergeCart"
              checked={isMergeCart}
              className=""
              style={{ scale: 1.2 }}
              onChange={(e) => setIsMergeCart(e.target.checked)}
            />
          </div>
          <button
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center ">
          <Link
            to="/"
            className="block text-[1.4rem] text-blue-600 hover:text-blue-700 font-medium"
          >
            Quên mật khẩu?
          </Link>
          <div className="flex items-center gap-2.5 my-5 md:flex-row flex-col">
            <div
              className="flex items-center gap-2.5 border border-gray-300 p-2.5 rounded-md text-[1.4rem] w-full justify-center cursor-pointer"
              onClick={() => loginWithGoogle()}
            >
              <img
                src={GoogleLogo}
                alt="google logo"
                className="w-8 h-8 object-cover"
              />
              Đăng nhập với Google
            </div>
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              scope="public_profile,email"
              fields="id,name,email,picture"
              onSuccess={onSuccessLoginFacebook}
              onFail={onErrorLoginFacebook}
              render={({ onClick }) => (
                <button
                  type="button"
                  className="flex items-center gap-2.5 border border-gray-300 p-2.5 rounded-md text-[1.4rem] w-full justify-center cursor-pointer"
                  onClick={onClick}
                >
                  <img
                    src={FacebookLogo}
                    alt="google logo"
                    className="w-8 h-8 object-cover "
                  />
                  Đăng nhập với Facebook
                </button>
              )}
            />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[1.4rem] text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showAdminModal && (
        <div className="fixed inset-0 bg-[#3f3f3f95] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🔐</span>
              </div>
              <h3 className="text-[1.6rem] font-bold text-gray-800 mb-3">
                Tài khoản Admin/Nhân viên
              </h3>
              <p className="text-gray-600 mb-6">
                Tài khoản này dành cho quản trị viên. Vui lòng đăng nhập qua
                trang quản trị.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/login")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition"
              >
                Đến trang Admin
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Thử tài khoản khác
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && <Loading />}
    </div>
  );
}

export default Login;
