import axios from "axios";
import Cookies from "js-cookie";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response.data as any,
  (error) => {
    console.log(error);
    if (
      error.status === 401 &&
      error.response.data.message === "Unauthorized"
    ) {
      Cookies.remove("access_token");
      window.location.href = "/dashboard/login";
    }

    if (error.code === "ERR_NETWORK" || !error.response) {
      return Promise.reject({
        status: false,
        message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau!",
      });
    }
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      status: false,
      message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại!",
    });
  }
);

export default axiosConfig;
