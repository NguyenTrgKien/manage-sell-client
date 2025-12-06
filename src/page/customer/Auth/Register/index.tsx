import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading";

export interface RegisterResponse {
  status: boolean;
  message: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  phone: string;
  gender: "male" | "female" | "";
  username: string;
}

function Register() {
  const { register } = useAuth();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      gender: "",
      username: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        phone: data.phone,
        username: data.phone,
        gender: data.gender,
      });
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Đăng ký tài khoản thất bại!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-[2.5rem] transform transition-all hover:scale-[1.02]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
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
          <h2 className="text-[2.2rem] font-bold text-gray-800 mb-2">
            Đăng ký
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Họ và tên
            </label>
            <input
              type="username"
              id="username"
              placeholder="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition"
              onFocus={() => setErrorMessage(null)}
              {...registerForm("username", {
                required: "Họ tên không được bỏ trống",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-[1.2rem] mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition"
              onFocus={() => setErrorMessage(null)}
              {...registerForm("email", {
                required: "Email không được bỏ trống",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-[1.2rem] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-2"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition"
              onFocus={() => setErrorMessage(null)}
              {...registerForm("password", {
                required: "Mật khẩu không được bỏ trống",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải ít nhất 6 ký tự",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-[1.2rem] mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[1.2rem] text-red-600">{errorMessage}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="phone"
              className="block font-medium text-gray-700 mb-2"
            >
              Số điện thoại
            </label>
            <input
              type="phone"
              id="phone"
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition"
              onFocus={() => setErrorMessage(null)}
              {...registerForm("phone", {
                required: "Số điện thoại không được bỏ trống",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại phải gồm 10 chữ số",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-[1.2rem] mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block font-medium text-gray-700 mb-2"
            >
              Giới tính
            </label>
            <select
              id="gender"
              className="w-full px-4 h-[4rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition text-gray-600"
              onFocus={() => setErrorMessage(null)}
              {...registerForm("gender", {
                required: "Vui lòng chọn giới tính",
              })}
            >
              <option value="" hidden>
                Giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-[1.2rem] mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <button
            className={`w-full py-3 rounded-lg text-white font-medium transition mt-[1.8rem] ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-300 to-orange-600 hover:from-orange-400 hover:to-orange-700 shadow-lg hover:shadow-xl"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
              "Đăng ký"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[1.4rem] text-gray-600">
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đăng nhập
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
                onClick={() => navigate("/admin/Register")}
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
      {isSubmitting && <Loading />}
    </div>
  );
}

export default Register;
