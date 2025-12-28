import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosConfig from "../../../configs/axiosConfig";
import { useUser } from "../../../hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function RedirectUrlMomo() {
  const [searchParams] = useSearchParams();
  const resultCode = Number(searchParams.get("resultCode"));
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { user } = useUser();

  const [status, setStatus] = useState<
    "loading" | "success" | "pending" | "failed"
  >("loading");
  const [message, setMessage] = useState("Đang tải...");

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      const res = (await axiosConfig.get(
        `/api/v1/orders/confirm-payment/${orderId}`
      )) as any;
      console.log(res);

      if (res.status === true) {
        setStatus("success");
        setMessage(res.message || "Thanh toán thành công!");
      } else if (res.status === false) {
        setStatus("failed");
        setMessage(res.message || res.reason || "Thanh toán thất bại!");
      } else if (res.status === "pending") {
        setStatus("pending");
        setMessage(
          res.message ||
            "Đang xác nhận thanh toán với MoMo, vui lòng chờ trong giây lát..."
        );
      }
    } catch (error) {
      setStatus("failed");
      setMessage(
        "Có lỗi xảy ra khi kiểm tra thanh toán. Vui lòng liên hệ hỗ trợ."
      );
      console.error("Error checking payment:", error);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin đơn hàng!");
      return;
    }

    checkPaymentStatus();

    if (resultCode !== 0) {
      setStatus("failed");
      setMessage("Thanh toán đã bị hủy hoặc thất bại.");
      return;
    }

    const interval = setInterval(() => {
      if (status === "pending") {
        console.log(status);
        checkPaymentStatus();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [orderId, resultCode, status]);

  if (status === "loading" || status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        {status === "pending" && (
          <div className="w-20 h-20 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        )}
        <p className="mt-6 text-gray-700">{message}</p>

        {status === "pending" && (
          <p className="mt-2 text-gray-500">Đang chờ xác nhận từ MoMo...</p>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full h-[calc(100vh-18rem)] pt-[4rem] px-[20rem] bg-white ">
        <div className="text-center">
          <div className="w-[7rem] h-[7rem] flex justify-center items-center mx-auto mb-[2rem] bg-[#2ddf2d] rounded-[50%] ">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-[#ffffff] text-[2.8rem]"
            />
          </div>
          <div className="text-[2.8rem] mb-[.5rem] font-bold text-green-600">
            Thanh toán thành công
          </div>
          <p className="text-gray-600">Cảm ơn khách hàng đã đặt hàng.</p>
          <p className="text-gray-600 text-center text-[1.4em]">
            Mã đơn hàng đã gửi đến email của khách hàng. Hệ thông sẽ cập nhật
            trạng thái đơn về email của bạn
          </p>
          <div className="flex justify-between items-center mt-[10rem]">
            <div
              className="w-[18rem] h-[4rem] rounded-[.5rem] flex justify-center items-center gap-[.5rem] text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="text-gray-500" />
              Quay về trang chủ
            </div>
            <div
              className="w-[18rem] h-[4rem] rounded-[.5rem] flex justify-center items-center gap-[.5rem] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
              onClick={() => {
                if (user) {
                  navigate("/customer/account/order", { replace: true });
                } else {
                  navigate("/look-up-order", { replace: true });
                }
              }}
            >
              Xem các đơn hàng
              <FontAwesomeIcon icon={faCaretRight} className="" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-18rem)] bg-white pt-[5rem]">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-red-600 text-[2.6rem] mb-4">✘</div>
        <h1 className="text-[1.8rem] font-bold text-gray-800 mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => (window.location.href = "/cart")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default RedirectUrlMomo;
