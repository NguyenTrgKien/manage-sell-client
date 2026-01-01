import dayjs from "dayjs";
import type { CustomerType } from "../../../utils/userType";
import { useNavigate } from "react-router-dom";

interface RenderCustomerProps {
  customers: CustomerType[];
  isLoading: boolean;
}

function RenderCustomer({ customers, isLoading }: RenderCustomerProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-[1.4rem] rounded-lg shadow-lg bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-6 py-4 font-medium">STT</th>
            <th className="text-left px-6 py-4 font-medium">Họ tên</th>
            <th className="text-left px-6 py-4 font-medium">Số điện thoại</th>
            <th className="text-left px-6 py-4 font-medium">Email</th>
            <th className="text-center px-6 py-4 font-medium">Tổng đơn mua</th>
            <th className="text-center px-6 py-4 font-medium">Ngày tạo</th>
            <th className="text-center px-6 py-4 font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-500">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  Đang tải dữ liệu...
                </div>
              </td>
            </tr>
          ) : customers.length > 0 ? (
            customers.map((customer: CustomerType, index) => {
              return (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-start">{index + 1}</td>
                  <td className="px-6 py-4">{customer.user.username}</td>
                  <td className="px-6 py-4">{customer.user.phone || "-"}</td>
                  <td className="px-6 py-4">{customer.user.email || "-"}</td>

                  <td className="px-6 py-4 text-center">
                    {customer.user.orders.length}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {dayjs(customer.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/detail-customer/${customer.customerCode}`
                          )
                        }
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `Tặng voucher cho khách hàng ID: ${customer.id}`
                          )
                        }
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Tặng voucher
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-12 text-gray-500">
                Không có khách hàng nào phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RenderCustomer;
