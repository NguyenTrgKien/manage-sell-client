import axios from "axios";

const axiosConfig = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://quan-ly-ban-quan-ao-server.onrender.com"
      : "http://localhost:8080",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // "c1a1bd344b33.ngrok-free.app": "true",
  },
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    }
    pendingQueue = [];
  });
};

axiosConfig.interceptors.response.use(
  (response) => response.data as any,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest._isRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._isRetry = true;
            return axiosConfig(originalRequest);
          })
          .catch(Promise.reject.bind(Promise));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await axiosConfig.post("/auth/refresh");

        processQueue(null);

        return axiosConfig(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        redirectOnUnauthorized();
        return Promise.reject({
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!",
          code: "UNAUTHORIZED",
          status: 401,
        });
      } finally {
        isRefreshing = false;
      }
    }

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

function redirectOnUnauthorized() {
  const isRedirecting = sessionStorage.getItem("isRedirecting");
  if (isRedirecting) return;

  sessionStorage.setItem("isRedirecting", "true");
  window.dispatchEvent(new CustomEvent("auth:logout"));

  const isAdminRoute = window.location.pathname.startsWith("/dashboard");
  window.location.href = isAdminRoute ? "/dashboard/login" : "/";

  setTimeout(() => sessionStorage.removeItem("isRedirecting"), 3000);
}
export default axiosConfig;
