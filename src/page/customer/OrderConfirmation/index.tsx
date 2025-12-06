import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHome,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import Loading from "../../../components/Loading";
import type { OrderType } from "../../Dashboard/order/ListOrders";

export default function OrderConfirmationSimple() {
  const { orderid } = useParams<{ orderid: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderid) {
        const saved = sessionStorage.getItem("recentOrder");
        if (saved) {
          setOrder(JSON.parse(saved));
        } else {
          navigate("/");
        }
        setLoading(false);
        return;
      }

      try {
        const res = await axiosConfig.get(
          `/api/v1/orders/get-order-by-id/${orderid}`
        );
        console.log(res);

        setOrder(res.data);
      } catch (err) {
        toast.error("Không tải được thông tin đơn hàng");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderid, navigate]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toISOString().split("/")[0];

  if (loading) return <Loading />;
  if (!order) return null;
  console.log(order);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-[50rem] mx-auto text-center">
        <div className="mb-8">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-[5rem]"
          />
        </div>

        <h1 className="text-[2.2rem] font-bold text-gray-800 mb-3">
          Đặt hàng thành công!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cảm ơn quý khách đã tin tưởng mua sắm
        </p>

        <div className="bg-green-50 flex justify-center items-center gap-[.5rem] px-8 py-4 rounded-full mb-10">
          <p className="text-[1.4rem] text-green-700">Mã đơn hàng:</p>
          <p className="text-2xl font-bold text-green-800">{order.orderCode}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="">
              <p className="text-[1.4rem] text-gray-500">Khách hàng</p>
              <p className="font-semibold">{order.customerName}</p>
            </div>
            <div>
              <p className="text-[1.4rem] text-gray-500">Thời gian đặt</p>
              <p className="font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[1.4rem] text-gray-500">Tổng tiền</p>
              <p className="font-bold text-red-600">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mx-auto">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition duration-300"
          >
            <FontAwesomeIcon icon={faHome} />
            Về trang chủ
          </button>

          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition duration-300"
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            Tiếp tục mua sắm
          </button>
        </div>

        <p className="mt-10 text-gray-500 text-[1.2rem]">
          Xác nhận đơn hàng đã được gửi qua email của bạn!
        </p>
      </div>
    </div>
  );
}
