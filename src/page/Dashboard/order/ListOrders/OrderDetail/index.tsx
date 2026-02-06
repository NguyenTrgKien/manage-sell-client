import {
  faArrowLeft,
  faPrint,
  faBox,
  faTruck,
  faCheckCircle,
  faBoxOpen,
  faEye,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getPaymentMethod,
  getShippingProvider,
  OrderStatus,
  ShippingProvider,
} from "@nguyentrungkien/shared";
import type { OrderType } from "..";
import { getStatusConfig } from "../../../../../configs/getOrderStatusConfig";
import React, { useEffect, useRef, useState } from "react";
import UpdateOrder from "../UpdateOrder";
import type { UseQueryResult } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "../../../../../components/InvoicePrint";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";

interface OrderDetailProps {
  orderDetail: OrderType;
  setOrderDetail: (order: OrderType | null) => void;
  refetch: () => Promise<UseQueryResult<any>>;
}

const steps = [
  {
    key: OrderStatus.PENDING,
    label: "Chờ xác nhận",
    desc: "Đơn hàng đang chờ xác nhận",
    icon: faBox,
    color: "bg-blue-500",
  },
  {
    key: OrderStatus.CONFIRMED,
    label: "Đã xác nhận",
    desc: "Đơn hàng đang được chuẩn bị",
    icon: faBoxOpen,
    color: "bg-orange-500",
  },
  {
    key: OrderStatus.SHIPPING,
    label: "Đang giao hàng",
    desc: "Đơn hàng đang được vận chuyển",
    icon: faTruck,
    color: "bg-purple-500",
  },
  {
    key: OrderStatus.COMPLETED,
    label: "Đã giao hàng",
    desc: "Đơn hàng đã được giao thành công",
    icon: faCheckCircle,
    color: "bg-green-500",
  },
];

function OrderDetail({
  orderDetail,
  setOrderDetail,
  refetch,
}: OrderDetailProps) {
  const [openUpdate, setOpenUpdate] = useState<{
    open: boolean;
    data: OrderType | null;
  }>({ open: false, data: null });
  const printRef = useRef<HTMLDivElement | null>(null);
  const [dataUpdateShipping, setDataUpdateShipping] = useState<{
    shippingProvider: ShippingProvider | "";
    trackingNumber: string;
    shippingNote: string;
  }>({
    shippingProvider: "",
    trackingNumber: "",
    shippingNote: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [editShipping, setEditShipping] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Đơn hàng #${orderDetail.orderCode}`,
    // pageStyle: `
    //   @page {size: A4; margin: 15m;}
    //   @media print{
    //     body{ -webkit-print-color110: preserve; }
    //     .no-print {display: none !important;}
    //   }
    // `,
  });

  useEffect(() => {
    if (orderDetail.shippingProvider && orderDetail.trackingNumber) {
      setDataUpdateShipping({
        shippingProvider: orderDetail.shippingProvider || "",
        shippingNote: orderDetail.shippingNote || "",
        trackingNumber: orderDetail.trackingNumber || "",
      });
      setEditShipping(false);
    }
  }, [orderDetail]);

  const handleChangeShipping = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDataUpdateShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateShipping = async () => {
    try {
      if (dataUpdateShipping.shippingProvider === "") {
        setErrors("Vui lòng chọn nhà vận chuyển!");
        return;
      }
      if (dataUpdateShipping.trackingNumber === "") {
        setErrors("Vui lòng nhập mã đơn vận!");
        return;
      }
      const res = (await axiosConfig.patch(
        `/api/v1/orders/update-shipping/${orderDetail.id}`,
        dataUpdateShipping,
      )) as any;
      if (res.status) {
        toast.success(res.message);
        setEditShipping(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const subTotal = orderDetail.orderItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="mt-[1rem]">
      <div className="flex justify-between items-start border-b-[.1rem] border-b-gray-300 pb-[2rem] mb-[2rem]">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-600 mb-2">
            Chi tiết đơn hàng #{orderDetail.orderCode}
          </h3>
          <button
            onClick={() => setOrderDetail(null)}
            className="text-[1.4rem] text-gray-500 hover:text-gray-800 flex items-center gap-2 hover-linear cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại danh sách</span>
          </button>
        </div>
        <div className="flex items-center gap-[1.5rem]">
          <span
            className={`inline-flex items-center px-6 py-3 rounded-full text-[1.4rem] font-medium ${
              getStatusConfig(orderDetail.status).bgColor
            } ${getStatusConfig(orderDetail.status).textColor}`}
          >
            {getStatusConfig(orderDetail.status).text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[2rem]">
        <div className="col-span-2 space-y-[2rem]">
          <div className="bg-gray-50 rounded-xl p-[2rem] border border-gray-200">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-[1.5rem]">
              Thông tin giao hàng
            </h4>
            <div className="space-y-[1rem] text-[1.4rem]">
              <div className="flex">
                <span className="w-[14rem] text-gray-600 font-medium">
                  Người nhận:
                </span>
                <span className="text-gray-800 font-semibold">
                  {orderDetail.customerName}
                </span>
              </div>
              <div className="flex">
                <span className="w-[14rem] text-gray-600 font-medium">
                  Số điện thoại:
                </span>
                <span className="text-gray-800">
                  {orderDetail.customerPhone}
                </span>
              </div>
              <div className="flex">
                <span className="w-[14rem] text-gray-600 font-medium">
                  Email:
                </span>
                <span className="text-gray-800">
                  {orderDetail.customerEmail}
                </span>
              </div>
              <div className="flex">
                <span className="w-[14rem] text-gray-600 font-medium">
                  Địa chỉ:
                </span>
                <span className="text-gray-800 flex-1">
                  {orderDetail.customerAddress}, {orderDetail.customerWard},{" "}
                  {orderDetail.customerDistrict}, {orderDetail.customerProvince}
                </span>
              </div>
              {orderDetail.customerNote && (
                <div className="flex">
                  <span className="w-[14rem] text-gray-600 font-medium">
                    Ghi chú:
                  </span>
                  <span className="text-gray-800 flex-1 italic">
                    {orderDetail.customerNote}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-[2rem] border border-gray-200">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-[1.5rem]">
              Thông tin vận chuyển
            </h4>
            <div className="space-y-[1rem] text-[1.4rem]">
              <div className="flex items-start gap-[2rem] space-y-2.5">
                <div className="w-full">
                  <label htmlFor="shippingProvider">Nhà vận chuyển</label>
                  <select
                    name="shippingProvider"
                    id="shippingProvider"
                    value={dataUpdateShipping.shippingProvider}
                    className="w-full h-[4rem] px-[1.5rem] rounded-md border border-gray-300 mt-1 outline-none"
                    onChange={(e) => handleChangeShipping(e)}
                    disabled={!editShipping}
                  >
                    <option value="">-Chọn nhà vận chuyển-</option>
                    {Object.entries(getShippingProvider).map(
                      ([key, value], index) => {
                        return (
                          <option key={index} value={key}>
                            {value.text}
                          </option>
                        );
                      },
                    )}
                  </select>
                </div>
                <div className="w-full">
                  <label htmlFor="trackingNumber">Mã vận đơn</label>
                  <input
                    type="text"
                    className="w-full h-[4rem] px-[1.5rem] rounded-md border border-gray-300 mt-1 outline-none"
                    id="trackingNumber"
                    name="trackingNumber"
                    value={dataUpdateShipping.trackingNumber}
                    placeholder="Nhập mã vận đơn..."
                    onChange={(e) => handleChangeShipping(e)}
                    disabled={!editShipping}
                  />
                </div>
              </div>
              <div className="w-full">
                <label htmlFor="shippingNote">Ghi chú vận chuyển</label>
                <input
                  type="text"
                  className="w-full h-[4rem] px-[1.5rem] rounded-md border border-gray-300 mt-1 outline-none"
                  id="shippingNote"
                  name="shippingNote"
                  value={dataUpdateShipping.shippingNote}
                  placeholder="Ghi chú vận chuyển..."
                  onChange={(e) => handleChangeShipping(e)}
                  disabled={!editShipping}
                />
              </div>
              {errors && <p className="text-red-500">{errors}</p>}
              {orderDetail.shippingProvider && orderDetail.trackingNumber ? (
                <div className="flex justify-end items-center gap-[1rem] mt-[2rem]">
                  {orderDetail.status !== OrderStatus.COMPLETED && (
                    <>
                      {editShipping ? (
                        <>
                          <button
                            className="text-white px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600"
                            onClick={handleUpdateShipping}
                          >
                            Lưu thay đổi
                          </button>
                          <button
                            className="text-gray-600 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                            onClick={() => setEditShipping(false)}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-white px-4 py-3 bg-amber-500 rounded-lg hover:bg-amber-600 flex items-center gap-2"
                          onClick={() => setEditShipping(true)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Chỉnh sửa
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex justify-end items-center gap-[1rem] mt-[2rem]">
                  {orderDetail.status !== OrderStatus.COMPLETED && (
                    <button
                      className="text-white text-[1.4rem] flex gap-1.5 items-center px-4 py-3 bg-green-500 rounded-lg hover:bg-green-600 cursor-pointer hover-linear"
                      onClick={() => handleUpdateShipping()}
                    >
                      Cập nhật vận chuyển
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 px-[2rem] py-[1.5rem] border-b border-gray-200">
              Sản phẩm đặt mua
            </h4>
            <div className="p-[2rem]">
              <table className="w-full text-[1.4rem]">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left pb-3 text-gray-600 font-semibold">
                      Sản phẩm
                    </th>
                    <th className="text-center pb-3 text-gray-600 font-semibold">
                      Đơn giá
                    </th>
                    <th className="text-center pb-3 text-gray-600 font-semibold">
                      Số lượng
                    </th>
                    <th className="text-right pb-3 text-gray-600 font-semibold">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.orderItems?.map((item) => {
                    const product = item.variant.product;
                    return (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-[5rem] h-[5rem] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.mainImage || "/placeholder.jpg"}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="max-w-[20rem]">
                              <div className="font-medium text-gray-800 text-limit-1">
                                {product.productName}
                              </div>
                              <div className="flex items-center text-gray-500">
                                <span className="text-[1.2rem]">
                                  Size:
                                  {item.variant.variantSize.name}
                                </span>
                                <span className="text-[1.2rem] pl-[1rem] ml-[1rem] border-l border-l-gray-500">
                                  Màu:
                                  {item.variant.variantColor.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center text-gray-600">
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </td>
                        <td className="text-center text-gray-600">
                          x{item.quantity}
                        </td>
                        <td className="text-right font-semibold text-gray-800">
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(Number(item.price) * Number(item.quantity))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-[2rem]">
          <div className="bg-white rounded-xl border border-gray-200 p-[2rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-[1.5rem]">
              Thông tin thanh toán
            </h4>
            <div className="space-y-[1.2rem] text-[1.4rem]">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-800">{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-800">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(orderDetail.shippingFee)}
                </span>
              </div>
              {orderDetail.couponCode && (
                <div className="flex justify-between text-green-600">
                  <span>Mã giảm giá ({orderDetail.couponCode}):</span>
                  <span>-0đ</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-[1.2rem] flex justify-between">
                <span className="font-semibold text-gray-700 text-[1.5rem]">
                  Tổng cộng:
                </span>
                <span className="font-bold text-[1.8rem] text-[var(--main-button)]">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(orderDetail.totalAmount)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-[1.2rem]">
                <div className="text-gray-600 mb-1">
                  Phương thức thanh toán:
                </div>
                <div className="font-semibold text-gray-800">
                  {getPaymentMethod[orderDetail.paymentMethod].text}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-[2rem]">
            <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-[1.5rem]">
              Lịch sử đơn hàng
            </h4>

            <div className="relative">
              <div className="absolute left-[1.5rem] top-0 bottom-0 w-[2px] bg-gray-200"></div>

              <div className="space-y-[2rem]">
                {steps.map((step, index) => {
                  const isActive =
                    steps.findIndex((s) => s.key === orderDetail.status) >=
                    index;

                  return (
                    <div
                      key={step.key}
                      className="flex gap-[1.5rem] relative items-start"
                    >
                      <div
                        className={`w-[3rem] h-[3rem] rounded-full flex items-center justify-center z-10
                ${isActive ? `${step.color}` : "bg-gray-300"}`}
                      >
                        <FontAwesomeIcon
                          icon={step.icon}
                          className="text-white text-[1.4rem]"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-[1.4rem] font-medium text-gray-800">
                          {step.label}
                        </div>
                        <div className="text-[1.2rem] text-gray-500 mt-[.2rem]">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-[1rem] mt-[2rem]">
            {orderDetail.status !== OrderStatus.COMPLETED && (
              <button
                className="text-white text-[1.4rem] flex gap-1.5 items-center px-4 py-3 bg-green-500 rounded-lg hover:bg-green-600 cursor-pointer hover-linear"
                onClick={() => setOpenUpdate({ open: true, data: orderDetail })}
              >
                <FontAwesomeIcon icon={faEye} />
                Cập nhật
              </button>
            )}
            <button
              className="text-white text-[1.4rem] flex gap-1.5 items-center px-4 py-3 bg-[var(--main-button)] rounded-lg hover:bg-[var(--main-button-hover)] cursor-pointer hover-linear"
              onClick={() => handlePrint()}
            >
              <FontAwesomeIcon icon={faPrint} />
              In đơn
            </button>
          </div>
        </div>
      </div>
      {
        <UpdateOrder
          open={openUpdate.open}
          orderData={openUpdate.data}
          onClose={() => setOpenUpdate({ open: false, data: null })}
          refetch={refetch}
        />
      }
      <div style={{ display: "none" }}>
        <InvoicePrint order={orderDetail} ref={printRef} />
      </div>
    </div>
  );
}

export default OrderDetail;
