import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../hooks/useUser";
import { useEffect, useRef, useState } from "react";
import axiosConfig from "../../../configs/axiosConfig";
import { toast } from "react-toastify";

export default function OrderConfirmation() {
  const { user } = useUser();
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasShownToast = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrdeInfo = async () => {
      if (!orderCode) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosConfig.get(`/api/v1/orders/verify/${orderCode}`);
        if (res.status) setError(false);
      } catch (err: any) {
        setError(true);
        if (!hasShownToast.current) {
          toast.error(err.message || "Không thể xác thực đơn hàng!");
          hasShownToast.current = true;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrdeInfo();
  }, [orderCode]);

  const handleViewOrder = () => {
    if (user) navigate("/customer/order");
    else navigate("/look-up-order");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-18rem)] bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl sm:text-5xl text-blue-500 mb-4 animate-spin"
          />
          <p className="text-sm sm:text-base text-gray-600">
            Đang xác thực đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-18rem)] bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-sm sm:max-w-md p-8 sm:p-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-2xl sm:text-3xl text-red-500"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Mã đơn hàng không hợp lệ hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-18rem)] bg-white flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="bg-white rounded-2xl shadow-md p-7 sm:p-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-2xl sm:text-4xl text-green-500"
            />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-1">
            Cảm ơn bạn đã đặt hàng tại shop của chúng tôi.
          </p>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-5">
            Thông tin đơn hàng sẽ được thông báo qua email mà bạn đã cung cấp!
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="text-base sm:text-lg font-bold text-blue-600 tracking-wide break-all">
              {orderCode}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-xl transition"
            >
              Về trang chủ
            </button>
            <button
              onClick={handleViewOrder}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl transition"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
