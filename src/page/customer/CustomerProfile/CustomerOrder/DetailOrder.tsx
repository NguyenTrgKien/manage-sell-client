import {
  faAngleLeft,
  faBox,
  faBoxOpen,
  faCheckCircle,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { OrderType } from "../../../Dashboard/order/ListOrders";
import {
  getPaymentMethod,
  getShippingProvider,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@nguyentrungkien/shared";
import dayjs from "dayjs";
import { getStatusConfig } from "../../../../configs/getOrderStatusConfig";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export const steps = [
  {
    key: OrderStatus.PENDING,
    label: "Chờ xác nhận đơn  hàng",
    desc: "Chờ xác nhận",
    icon: faBox,
    color: "bg-blue-500",
  },
  {
    key: OrderStatus.CONFIRMED,
    label: "Đã xác nhận đơn hàng",
    desc: "Đã xác nhận",
    icon: faBoxOpen,
    color: "bg-orange-500",
  },
  {
    key: OrderStatus.SHIPPING,
    label: "Đang giao hàng",
    desc: "Đang vận chuyển",
    icon: faTruck,
    color: "bg-purple-500",
  },
  {
    key: OrderStatus.COMPLETED,
    label: "Đã giao hàng",
    desc: "Đã giao hàng",
    icon: faCheckCircle,
    color: "bg-green-500",
  },
];

function DetailOrder({
  order,
  onClose,
}: {
  order: OrderType | null;
  onClose: () => void;
}) {
  const subTotal = useMemo(() => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [order?.orderItems]);
  useEffect(() => {
    scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  if (!order) return;
  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("HH:mm DD/MM/YYYY");
  };

  return (
    <div className="px-[2rem] pb-[2rem]">
      <div className="py-[1rem] flex items-center justify-between">
        <button
          type="button"
          className="px-6 py-2.5 outline-none bg-gray-100 hover:bg-gray-200 transition-colors duration-300 cursor-pointer rounded-md "
          onClick={() => onClose()}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-[1.4rem]" />
          <span className="uppercase text-[1.4rem]">trở lại</span>
        </button>
        <div className="flex items-center space-x-6">
          <span>Mã đơn hàng: {order.orderCode}</span>
          <span className="block h-[2rem] border-r border-r-gray-500"></span>
          <button
            className={`px-8 py-2 rounded-full ${getStatusConfig(order.status).textColor} ${getStatusConfig(order.status).bgColor}`}
          >
            {getStatusConfig(order.status).text}
          </button>
        </div>
      </div>
      {order?.status === OrderStatus.CANCELLED ? (
        <div className="w-full py-[2rem] border border-amber-200 bg-amber-50 px-[2rem]">
          <p className="text-[1.8rem] text-red-500">Đã hủy đơn hàng</p>
          <p>lúc {formatDate(order.updatedAt)}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-5 mt-[3rem]">
          {steps.map((step, index) => {
            const isActive =
              steps.findIndex((s) => s.key === order.status) >= index;
            return (
              <div key={step.key} className="flex items-center">
                <div
                  key={step.key}
                  className="flex flex-col gap-[2rem] relative items-center"
                >
                  <div
                    className={`w-[6rem] h-[6rem] rounded-full flex items-center justify-center z-10
                ${isActive ? `${step.color}` : "bg-gray-300"}`}
                  >
                    <FontAwesomeIcon
                      icon={step.icon}
                      className="text-white text-[2rem]"
                    />
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-[1.4rem] font-medium text-gray-800">
                      {step.label}
                    </div>
                    <div className="text-[1.2rem] text-gray-500 mt-[.2rem]">
                      {step.desc}
                    </div>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <span className="w-[10rem] border border-green-500"></span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full border-t-1 border-gray-400 mt-[3rem]"></div>

      <div className="px-[2rem] mt-[3rem]">
        <span className="text-[1.8rem]">Địa chỉ nhận hàng</span>
        <div className="mt-[1rem] border border-gray-300 rounded-md p-[2rem]">
          <p>{order.customerName}</p>
          <p className="text-[1.3rem] text-gray-500">({order.customerPhone})</p>
          <p className="text-[1.3rem] text-gray-500">
            {order.customerAddress}, {order.customerWard},{" "}
            {order.customerDistrict}, {order.customerPhone}
          </p>
        </div>
      </div>

      <div className="p-[2rem]">
        <span className="text-[1.8rem] mb-[1rem] block">
          Thông tin vận chuyển
        </span>
        <div className="border border-gray-300 rounded-md py-[1rem] px-[2rem] bg-gray-50">
          {[OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
            order.status
          ) ? (
            <p className="text-[1.5rem italic">
              Đơn hàng đang được xử lý và đóng gói. Chúng tôi sẽ cập nhật mã vận
              đơn ngay khi hàng được giao cho đơn vị vận chuyển.
            </p>
          ) : (
            <>
              <div className="space-y-3 text-[1.5rem]">
                <p>
                  <span className="font-medium text-gray-700">
                    Nhà vận chuyển:
                  </span>{" "}
                  <span className="text-gray-900">
                    {order.shippingProvider
                      ? getShippingProvider[order.shippingProvider]?.text ||
                        order.shippingProvider
                      : "Chưa xác định"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Mã vận đơn:</span>{" "}
                  <span className="text-gray-900 font-semibold">
                    {order.trackingNumber || "Chưa có"}
                  </span>
                </p>
                {order.shippingNote && (
                  <p>
                    <span className="font-medium text-gray-700">Ghi chú:</span>{" "}
                    <span className="text-gray-900 italic">
                      {order.shippingNote}
                    </span>
                  </p>
                )}
              </div>
              {order.status === OrderStatus.SHIPPING ? (
                order.trackingNumber &&
                order.shippingProvider && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <FontAwesomeIcon icon={faTruck} />
                      Tra cứu vận đơn
                    </button>
                  </div>
                )
              ) : order.status === OrderStatus.COMPLETED ? (
                <p className="text-[1.5rem] text-green-600 font-medium mt-3">
                  Đơn hàng đã được giao thành công!
                </p>
              ) : (
                <p className="text-[1.5rem] text-gray-600 mt-3">
                  Thông tin vận chuyển chưa được cập nhật.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="px-[2rem]">
        <div
          key={order.id}
          className="shadow-md p-[2rem] border border-gray-200 rounded-md mt-[2rem]"
        >
          {order.orderItems.length > 0 &&
            order.orderItems.map((item) => {
              const product = item.variant.product;
              return (
                <Link
                  to={`/product-detail/${product.slug}`}
                  key={item.id}
                  className="block pb-[1rem] mb-[2rem] border-b border-b-gray-300"
                >
                  <div
                    key={item.id}
                    className="flex items-center justify-between my-[1rem] cursor-pointer"
                  >
                    <div className="flex space-x-6 items-center ">
                      <img
                        src={product.mainImage}
                        alt={`mainImage-${product.productName}`}
                        className="w-[6rem] h-[6rem] object-cover border border-gray-400"
                      />
                      <div>
                        <p className="max-w-2xl line-clamp-1 text-gray-900 select-none">
                          {product.productName}
                        </p>
                        <p className="flex items-center space-x-2 text-[1.2rem] text-gray-600">
                          <span>Phân loại:</span>
                          <span className="block">
                            Size {item.variant.variantSize.name}, Màu{" "}
                            {item.variant.variantColor.name}
                          </span>
                        </p>
                        <p className="text-[1.2rem] text-gray-600">
                          Số lượng: x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-red-600 text-[1.6rem]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </Link>
              );
            })}
          <div className="flex items-center justify-between ml-auto w-3xl ">
            <div className="flex flex-col items-end space-y-6">
              <p className="text-gray-600">Tạm tính: </p>
              <p className="text-gray-600">Phí vận chuyển: </p>
              <p className="text-gray-600">Voucher giảm giá: </p>
              <p className="text-gray-600">Thành tiền: </p>
              <p className="text-gray-600">Phương thức thanh toán: </p>
              {order.paymentMethod !== PaymentMethod.COD && (
                <p className="text-gray-600">Trạng thái thanh toán: </p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-6">
              <span className="text-gray-800">{formatPrice(subTotal)}</span>
              <span className="text-gray-800">
                {formatPrice(order.shippingFee)}
              </span>
              <span className="text-red-600">
                - {formatPrice(order.discountAmount)}
              </span>
              <span className="text-red-600">
                {formatPrice(order.totalAmount)}
              </span>
              <span className="text-gray-800">
                {getPaymentMethod[order.paymentMethod].text}
              </span>
              <span className="text-gray-800">
                {order?.payment?.status === PaymentStatus.SUCCESS
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </span>
            </div>
          </div>
          {order.paymentMethod === PaymentMethod.COD &&
            ![OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(
              order.status
            ) && (
              <div className="w-full py-4 bg-amber-50 mt-[1rem] text-center border border-amber-200">
                Vui lòng thanh toán{" "}
                <span className="text-red-500">
                  {formatPrice(order.totalAmount)}
                </span>{" "}
                khi nhận hàng
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default DetailOrder;
