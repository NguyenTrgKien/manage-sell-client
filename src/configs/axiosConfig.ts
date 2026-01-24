import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://quan-ly-ban-quan-ao-server.onrender.com",
  // baseURL: "http://localhost:8080",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // "c1a1bd344b33.ngrok-free.app": "true",
  },
});

axiosConfig.interceptors.response.use(
  (response) => response.data as any,
  async (error) => {
    const status = error.response?.status;
    if (!error.response) {
      return Promise.reject({
        message: "Không thể kết nối đến server. Vui lòng kiểm tra mạng!",
        code: "NETWORK_ERROR",
      });
    }

    // if (status === 401) {
    //   return Promise.reject({
    //     message: "Phiên đăng nhập hết hạn!",
    //     code: "UNAUTHORIZED",
    //     status,
    //   });
    // }

    if (status === 403) {
      return Promise.reject({
        message: "Bạn không có quyền thực hiện hành động này",
        code: "FORBIDDEN",
        status,
      });
    }

    if (status >= 500) {
      return Promise.reject({
        message: "Lỗi máy chủ. Vui lòng thử lại sau!",
        code: "SERVER_ERROR",
        status,
      });
    }

    const msg =
      error.response?.data?.message || error.message || "Đã có lỗi xảy ra";
    return Promise.reject({
      message: typeof msg === "string" ? msg : msg[0] || "Lỗi không xác định",
      code: error.response?.data?.error || "BAD_REQUEST",
      status,
      data: error.response?.data,
    });
  },
);

export default axiosConfig;
