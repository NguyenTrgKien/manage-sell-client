import React, { useState } from "react";
import axiosConfig from "../../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
      const res = await axiosConfig.post<LoginResponse>(
        "/api/v1/auth/login",
        dataLogin
      );
      if (res.status) {
        setErrorMessage(null);
        navigate("/dashboard");
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || "Có lỗi xảy ra vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-cover bg-center flex items-center justify-center">
      <div className="w-[40rem] h-auto bg-white shadow-xl rounded-[1rem] p-[3rem] hover:scale-[1.008] hover:shadow-2xl hover-linear">
        <h2 className="text-center text-[2.5rem] text-blue-600 font-bold mb-[2.5rem]">
          Đăng nhập Admin
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-gray-600 ">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email..."
              value={dataLogin.email}
              className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem] mt-[.6rem]"
              onChange={(e) => handleChangeData(e)}
              onFocus={() => setErrorMessage(null)}
            />
          </div>
          <div className="mt-[2rem] mb-[3rem]">
            <label htmlFor="password" className="text-gray-600 ">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Nhập mật khẩu..."
              value={dataLogin.password}
              className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem] mt-[.6rem]"
              onChange={(e) => handleChangeData(e)}
              onFocus={() => setErrorMessage(null)}
            />
          </div>
          {errorMessage && (
            <p className="text-[1.4rem] text-red-500">{errorMessage}</p>
          )}
          <button
            className={`w-full h-[4rem] rounded-sm  text-white mt-[1rem] cursor-pointer ${isLoading ? "bg-gray-300" : "bg-[#1e90ff] hover:bg-[#0d87ff]"}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <span className="block text-[1.4rem] text-blue-500 hover:text-blue-700 cursor-pointer text-center mt-[2rem] select-none">
          Quên mật khẩu?
        </span>
      </div>
    </div>
  );
}

export default LoginAdmin;
