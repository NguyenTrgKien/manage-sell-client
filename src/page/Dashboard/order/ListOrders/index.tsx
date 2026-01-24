import {
  faAngleLeft,
  faAngleRight,
  faCirclePlus,
  faEdit,
  faEllipsisVertical,
  faEye,
  faFileExport,
  faFilter,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ordersForAdmin } from "../../../../api/order.api";
import AddOrder from "./AddOrder";
import { getStatusConfig } from "../../../../configs/getOrderStatusConfig";
import {
  CancelReasonType,
  OrderStatus,
  ShippingProvider,
  ShippingStatus,
  type PaymentMethod,
} from "@nguyentrungkien/shared";
import type { VariantsType } from "../../../../utils/types";
import UpdateOrder from "./UpdateOrder";
import OrderDetail from "./OrderDetail";
import DeleteOrder from "./DeleteOrder";
import type { EvaluateType } from "../../../../utils/productType";
import type { VoucherT } from "../../../../utils/voucher.type";

export interface OrderType {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerProvince: string;
  customerDistrict: string;
  customerWard: string;
  customerNote: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  orderItems: orderItemsType[];
  createdAt: string;
  updatedAt: string;
  reason: CancelReasonType;
  shippedAt: string;
  shippingFee: number;
  shippingProvider: ShippingProvider;
  deliveredAt: string;
  shippingNote: string;
  shippingStatus: ShippingStatus;
  trackingNumber: string;
  voucherCode: string;
  discountAmount: number;
  voucher: VoucherT;
}

export interface orderItemsType {
  id: number;
  variant: VariantsType;
  quantity: number;
  price: number;
  evaluate: EvaluateType[];
}

function Order() {
  const [selectOption, setSelectOption] = useState<OrderType | null>(null);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderType | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);
  const [openUpdate, setOpenUpdate] = useState<{
    open: boolean;
    data: OrderType | null;
  }>({
    open: false,
    data: null,
  });
  const [inputParam, setInputParam] = useState<{
    searchOrder: string;
    status: string;
  }>({
    searchOrder: "",
    status: "",
  });
  const [filter, setFilter] = useState({
    ...inputParam,
    limit: 10,
    page: 1,
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", filter],
    queryFn: () => ordersForAdmin(filter),
  }) as any;
  const orders = (data && data.data) || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const [openAddOrder, setOpenAddOrder] = useState(false);

  const handleAppliedFilter = () => {
    setFilter((prev) => ({
      ...prev,
      searchOrder: inputParam.searchOrder,
      status: inputParam.status,
    }));
  };

  useEffect(() => {
    if (selectOption === null) return;
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        selectOption !== null &&
        optionRef.current &&
        !optionRef.current.contains(event.target as Node)
      ) {
        setSelectOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [selectOption]);

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] overflow-y-auto bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="sticky top-0 flex justify-between items-center border-b-[.1rem] border-b-gray-300 pb-[2rem]">
        <h3 className="text-[2rem] font-semibold text-gray-600">Đơn hàng</h3>
        <div className="flex items-center gap-[1.5rem]">
          <button className="text-white text-[1.4rem] flex gap-1.5 items-center px-4 py-3 bg-[var(--main-button)] rounded-lg hover:bg-[var(--main-button-hover)] cursor-pointer hover-linear ">
            <FontAwesomeIcon icon={faFileExport} />
            Export
          </button>
          <button
            className="text-white text-[1.4rem] flex gap-1.5 items-center px-4 py-3 bg-[var(--button-green)] rounded-lg hover:bg-[var(--button-green-hover)] cursor-pointer hover-linear "
            onClick={() => setOpenAddOrder(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Tạo đơn
          </button>
        </div>
      </div>
      {!orderDetail ? (
        <>
          <div className="flex items-center gap-[1.5rem] mt-[2rem]">
            <div className="w-[28rem] h-[4rem] relative text-[1.4rem]">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-[2rem] top-[50%] translate-[-50%] text-[1.4rem] text-gray-600"
              />
              <input
                type="text"
                id="searchOrder"
                name="searchOrder"
                placeholder="Nhập tìm kiếm (sđt, email)..."
                value={inputParam.searchOrder}
                className="w-full h-full border border-gray-300 rounded-xl px-[3.8rem] outline-none"
                onChange={(e) =>
                  setInputParam((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <select
              name="status"
              id="status"
              value={inputParam.status}
              className="w-[20rem] h-[4rem] text-[1.4rem] text-gray-600 px-[1.5rem] border border-gray-300 rounded-xl outline-none"
              onChange={(e) =>
                setInputParam((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option value="" hidden>
                Trạng thái đơn
              </option>
              {Object.entries(OrderStatus).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {getStatusConfig(value as OrderStatus).text}
                  </option>
                );
              })}
            </select>
            <button
              className="w-[8rem] h-[4rem] flex items-center justify-center gap-[.5rem] rounded-xl outline-none bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] hover-linear text-white cursor-pointer text-[1.4rem]"
              onClick={() => handleAppliedFilter()}
            >
              <FontAwesomeIcon icon={faFilter} className=" text-white" />
              <span>Lọc</span>
            </button>
          </div>
          <table className="w-full table-auto text-[1.4rem] rounded-lg shadow-lg mt-[2rem]">
            <thead className="bg-gray-100 border-b border-b-gray-300">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  STT
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Mã đơn
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Khách hàng
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Số điện thoại
                </th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Tổng tiền
                </th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Trạng thái
                </th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold tracking-wide">
                  Hành động
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-[4rem] text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              </tbody>
            ) : orders?.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-[4rem] text-gray-500"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {orders?.map((order: OrderType, index: number) => {
                  const isSelectOption = order.id === selectOption?.id;
                  return (
                    <tr key={order.id}>
                      <td className="text-left px-6 py-4 text-gray-600 tracking-wide">
                        {index + 1}
                      </td>
                      <td className="text-left px-6 py-4 text-gray-600 tracking-wide">
                        #{order.orderCode}
                      </td>
                      <td className="text-left px-6 py-4 text-gray-600 tracking-wide">
                        <div>
                          <div className="text-gray-800">
                            {order.customerName}
                          </div>
                          <div className="text-gray-600 text-[1rem]">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-gray-600 tracking-wide">
                        {order.customerPhone}
                      </td>
                      <td className="text-center px-6 py-4 text-gray-600 tracking-wide">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalAmount)}
                      </td>
                      <td className="text-center px-6 py-4">
                        <span
                          className={`inline-flex items-center px-5 py-2 rounded-full text-[1.2rem] font-medium ${
                            getStatusConfig(order.status).bgColor
                          } ${getStatusConfig(order.status).textColor}`}
                        >
                          {getStatusConfig(order.status).text}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4 text-gray-600 tracking-wide">
                        <div className="flex justify-center items-center gap-[1rem]">
                          <button
                            className="w-[7.4rem] h-[3.2rem] text-[1.2rem] rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-[.5rem] hover-linear"
                            onClick={() => setOrderDetail(order)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span>Xem</span>
                          </button>
                          <div className="relative z-[200]" ref={optionRef}>
                            <button
                              className="w-[3.2rem] h-[3.2rem] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 hover-linear"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectOption(isSelectOption ? null : order);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                className="text-[1.8rem]"
                              />
                            </button>

                            {isSelectOption && (
                              <div className="absolute right-[100%] top-0  min-w-[14rem] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-xl py-[.8rem] border border-gray-200">
                                <button
                                  type="button"
                                  className="w-full px-[1.2rem] py-[.8rem] flex items-center gap-[.8rem] text-left hover:bg-gray-100 hover-linear text-[1.4rem] text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenUpdate({
                                      open: true,
                                      data: selectOption,
                                    });
                                    setSelectOption(null);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="text-amber-600"
                                  />
                                  <span className="text-amber-600">
                                    Cập nhật
                                  </span>
                                </button>
                                {order.status === OrderStatus.CANCELLED ||
                                  (order.status === OrderStatus.PENDING && (
                                    <button
                                      className="w-full px-[1.2rem] py-[.8rem] flex whitespace-nowrap items-center gap-[.8rem] text-left hover:bg-gray-100 hover-linear text-[1.4rem] text-gray-700"
                                      onClick={() => {
                                        setOpenDelete(order.id);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className="text-red-500"
                                      />
                                      <span className="text-red-500 flex flex-nowrap">
                                        Xóa đơn
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }))
              }
              disabled={filter.page === 1}
              className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((num) => Math.abs(num - filter.page) <= 2)
              .map((num) => (
                <button
                  key={num}
                  onClick={() => setFilter((prev) => ({ ...prev, page: num }))}
                  className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-gray-300 ${
                    filter.page === num
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  page: Math.min(prev.page + 1, totalPages),
                }))
              }
              disabled={filter.page === totalPages}
              className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
            </button>
          </div>
        </>
      ) : (
        <OrderDetail
          orderDetail={orderDetail}
          setOrderDetail={setOrderDetail}
          refetch={refetch}
        />
      )}
      {
        <AddOrder
          open={openAddOrder}
          onClose={() => setOpenAddOrder(false)}
          refetch={refetch}
        />
      }
      {
        <UpdateOrder
          open={openUpdate.open}
          orderData={openUpdate.data}
          onClose={() => setOpenUpdate({ open: false, data: null })}
          refetch={refetch}
        />
      }

      {
        <DeleteOrder
          open={openDelete !== null}
          orderId={openDelete}
          onClose={() => setOpenDelete(null)}
          refetch={refetch}
        />
      }
    </div>
  );
}

export default Order;
