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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
      <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            type="button"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md flex items-center gap-2 text-[1.2rem] md:text-[1.6rem]"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            <span className="uppercase">Trở lại</span>
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end sm:justify-normal">
          <span className="text-[1.2rem] md:text-[1.6rem] font-medium">
            Mã đơn hàng: {order.orderCode}
          </span>
          <div className="hidden sm:block h-6 border-r border-gray-400" />
          <span
            className={`px-5 py-1.5 rounded-full text-[1.2rem] md:text-[1.6rem] font-medium
              ${getStatusConfig(order.status).textColor} 
              ${getStatusConfig(order.status).bgColor}`}
          >
            {getStatusConfig(order.status).text}
          </span>
        </div>
      </div>

      {order.status === OrderStatus.CANCELLED ? (
        <div className="my-6 p-5 border border-amber-200 bg-amber-50 rounded-lg">
          <p className="text-[1.2rem] md:text-[1.6rem] text-red-600 font-medium">
            Đã hủy đơn hàng
          </p>
          <p className="text-gray-600 mt-1">
            lúc {formatDate(order.updatedAt)}
          </p>
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
                  className="flex flex-col gap-[1rem] md:ap-[2rem] relative items-center"
                >
                  <div
                    className={`lg:w-[6rem] lg:h-[6rem] md:w-[4rem] md:h-[4rem] w-[3rem] h-[3rem] rounded-full flex items-center justify-center z-10
                ${isActive ? `${step.color}` : "bg-gray-300"}`}
                  >
                    <FontAwesomeIcon
                      icon={step.icon}
                      className="text-white md:text-[1.8rem] text-[1.2rem] lg:text-[2rem]"
                    />
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-[1.2rem] md:text-[1.4rem] font-medium text-gray-800">
                      {step.label}
                    </div>
                    <div className="hidden md:block text-[.8rem] md:text-[1.2rem] text-gray-500 mt-[.2rem]">
                      {step.desc}
                    </div>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <span className="w-[2rem] md:w-[10rem] border border-green-500"></span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <hr className="my-6 border-gray-300" />

      <div className="mb-8">
        <h2 className="text-[1.4rem] md:text-[1.6rem] font-medium mb-3">
          Địa chỉ nhận hàng
        </h2>
        <div className="border border-gray-300 rounded-lg p-4 md:p-6 bg-white">
          <p className="font-medium">{order.customerName}</p>
          <p className="text-gray-500 text-[1.2rem] md:text-[1.4rem]">
            ({order.customerPhone})
          </p>
          <p className="text-gray-500 mt-1 text-[1.2rem] md:text-[1.4rem]">
            {order.customerAddress}, {order.customerWard},{" "}
            {order.customerDistrict}, {order.customerProvince}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[1.4rem] md:text-[1.6rem] font-medium mb-3">
          Thông tin vận chuyển
        </h2>
        <div className="border border-gray-300 rounded-lg p-4 md:p-6 bg-gray-50">
          {[OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
            order.status,
          ) ? (
            <p className="text-[1.2rem] md:text-[1.6rem] italic">
              Đơn hàng đang được xử lý và đóng gói. Chúng tôi sẽ cập nhật mã vận
              đơn ngay khi hàng được giao cho đơn vị vận chuyển.
            </p>
          ) : (
            <div className="space-y-3 text-[1.4rem] md:text-[1.6rem]">
              <p>
                <span className="font-medium text-gray-700">
                  Nhà vận chuyển:
                </span>{" "}
                {order.shippingProvider
                  ? getShippingProvider[order.shippingProvider]?.text ||
                    order.shippingProvider
                  : "Chưa xác định"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Mã vận đơn:</span>{" "}
                <span className="font-semibold">
                  {order.trackingNumber || "Chưa có"}
                </span>
              </p>
              {order.shippingNote && (
                <p>
                  <span className="font-medium text-gray-700">Ghi chú:</span>{" "}
                  <span className="italic">{order.shippingNote}</span>
                </p>
              )}

              <div className="mt-4">
                {order.status === OrderStatus.SHIPPING &&
                  order.trackingNumber &&
                  order.shippingProvider && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
                    >
                      <FontAwesomeIcon icon={faTruck} />
                      Tra cứu vận đơn
                    </button>
                  )}

                {order.status === OrderStatus.COMPLETED && (
                  <p className="text-green-600 font-medium text-[1.4rem] md:text-[1.6rem]">
                    Đơn hàng đã được giao thành công!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 bg-white">
        <div className="space-y-5 md:space-y-6">
          {order.orderItems.map((item) => {
            const product = item.variant.product;
            return (
              <Link
                to={`/product-detail/${product.slug}`}
                key={item.id}
                className="block border-b border-gray-200 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.mainImage}
                      alt={product.productName}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover border border-gray-400 rounded"
                    />
                    <div>
                      <p className="font-medium line-clamp-2 md:line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="text-[1rem] md:text-[1.2rem] text-gray-600 mt-1">
                        Size {item.variant.variantSize.name} • Màu{" "}
                        {item.variant.variantColor.name}
                      </p>
                      <p className="text-[1rem] md:text-[1.2rem] text-gray-600">
                        Số lượng: x{item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-red-600 font-medium text-[1.4rem] md:text-[1.6rem] whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col gap-4 text-[1.4rem] md:text-[1.6rem]">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span>{formatPrice(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Voucher giảm giá</span>
              <span className="text-red-600">
                - {formatPrice(order.discountAmount)}
              </span>
            </div>
            <div className="flex justify-between font-medium text-[1.4rem] md:text-[1.6rem] pt-3 border-t">
              <span>Thành tiền</span>
              <span className="text-red-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán</span>
              <span>{getPaymentMethod[order.paymentMethod].text}</span>
            </div>

            {order.paymentMethod !== PaymentMethod.COD && (
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái thanh toán</span>
                <span>
                  {order?.payment?.status === PaymentStatus.SUCCESS
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            )}
          </div>

          {order.paymentMethod === PaymentMethod.COD &&
            ![OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(
              order.status,
            ) && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-[1.4rem] md:text-[1.6rem]">
                Vui lòng thanh toán{" "}
                <span className="text-red-600 font-medium">
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
