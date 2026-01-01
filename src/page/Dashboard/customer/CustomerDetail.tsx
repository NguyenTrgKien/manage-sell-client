// src/pages/dashboard/customers/CustomerDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getCustomerById } from "../../../api/customer.api";
import type { OrderType } from "../order/ListOrders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getStatusConfig } from "@nguyentrungkien/shared";

function CustomerDetail() {
  const { customerCode } = useParams<{ customerCode: string }>();
  const navigate = useNavigate();

  const {
    data: customer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customer-detail", customerCode],
    queryFn: () => getCustomerById(customerCode as string),
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">Đang tải chi tiết khách hàng...</div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="text-center py-12 text-red-500">
        Không tìm thấy khách hàng
      </div>
    );
  }

  const user = customer.user;
  const orders = user?.orders || [];
  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const defaultAddress = customer.user?.address?.find((add: any) => {
    return add.isDefault;
  });

  return (
    <div className="p-8 bg-white rounded-2xl min-h-[calc(100vh-10rem)] shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[2rem] font-bold text-blue-600">
          Chi tiết khách hàng
        </h2>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="px-8 py-2 bg-gray-100 space-x-2 rounded-md hover:bg-gray-200 mb-8"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="border border-gray-300 p-8 shadow-md rounded-md">
          <h3 className="font-semibold mb-4 text-blue-500">Thông tin cơ bản</h3>
          <div className="space-y-5 text-[1.4rem]">
            <p>
              <span className="font-medium">Họ tên:</span>{" "}
              {customer.fullName || "Chưa có"}
            </p>
            <p>
              <span className="font-medium">Tên tài khoản:</span>{" "}
              {user?.username || "-"}
            </p>
            <p>
              <span className="font-medium">Số điện thoại:</span>{" "}
              {customer.phone || user?.phone || "-"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {customer.email || user?.email || "-"}
            </p>
            <p>
              <span className="font-medium">Ngày đăng ký:</span>{" "}
              {dayjs(customer.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <span className="font-medium">Tổng đơn hàng:</span>{" "}
              {orders.length} đơn
            </p>
          </div>
        </div>

        <div className="border border-gray-300 p-8 shadow-md rounded-md">
          <h3 className="font-semibold mb-4 text-blue-500">
            Thông tin bổ sung
          </h3>
          <div className="space-y-5 text-[1.4rem]">
            <p>
              <span className="font-medium">Ngày sinh:</span>{" "}
              {customer?.birthday ?? "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium">Tỉnh:</span>{" "}
              {defaultAddress.province ?? "Chưa cập nhật"}{" "}
            </p>
            <p>
              <span className="font-medium">Quận:</span>{" "}
              {defaultAddress.district ?? "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium">Huyện:</span>{" "}
              {defaultAddress.ward ?? "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium">Địa chỉ chi tiết:</span>{" "}
              {defaultAddress.addressDetail ?? "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-blue-500">
          Lịch sử đơn hàng ({orders.length})
        </h3>
        {orders.length > 0 ? (
          <table className="w-full table-auto border-collapse text-[1.4rem]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-5 text-left">Mã đơn</th>
                <th className="px-4 py-5 text-left">Ngày đặt</th>
                <th className="px-4 py-5 text-center">Trạng thái</th>
                <th className="px-4 py-5 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: OrderType) => (
                <tr
                  key={order.id}
                  className="border-b border-b-gray-300 hover:bg-gray-50"
                >
                  <td className="px-4 py-5">{order.orderCode}</td>
                  <td className="px-4 py-5">
                    {dayjs(order.createdAt).format("HH:mm DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full`}>
                      {getStatusConfig(order.status).text || "Đang xử lý"}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">
            Khách hàng chưa có đơn hàng nào
          </p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;
