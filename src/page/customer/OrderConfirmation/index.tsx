import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
        if (res.status) {
          setError(false);
        }
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
    if (user) {
      navigate("/customer/order");
    } else {
      navigate("/look-up-order");
    }
  };

  if (error && !loading) {
    return (
      <div className="h-[calc(100vh-18rem)] py-12 bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-[2rem] text-red-500 mb-4">⚠️</div>
          <h1 className="text-[2rem] font-bold text-gray-800 mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-gray-600 mb-6">
            Mã đơn hàng không hợp lệ hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-18rem)] py-12 bg-white">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-[2.5rem] text-blue-500 mb-4 animate-spin"
          />
          <p className=" text-gray-600">Đang xác thực đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white pt-12 pb-18 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className=" rounded-lg p-8 mb-6 text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-6xl text-green-500 mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng tại shop của chúng tôi.
          </p>
          <p className="text-center text-[1.4rem] text-gray-600">
            Thông tin đơn hàng sẽ được thông báo qua email mà bạn đã cung cấp!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-[1rem]">
            <p className="text-[1.4rem] text-gray-600">Mã đơn hàng:</p>
            <p className="font-bold text-blue-600">{orderCode}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => {
              handleViewOrder();
            }}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
