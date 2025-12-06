import React from "react";
import type { OrderType } from "../../page/Dashboard/order/ListOrders";

interface InvoicePrintProp {
  order: OrderType;
}

const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProp>(
  ({ order }, ref) => {
    console.log(order);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const totalAmount =
      order.orderItems?.reduce((total, item) => {
        const price =
          item.variant?.price !== null && item.variant?.price !== undefined
            ? item.variant.price
            : item.variant?.product?.price || 0;
        return total + price * item.quantity;
      }, 0) || 0;

    return (
      <div ref={ref} style={{ padding: "2rem" }} className="print-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[2.2rem] font-bold mb-2">NTK.SHOP</h1>
          <p className="text-gray-700 mb-1">
            phường Lê Bình, Quận Cái Răng, TP. Cần Thơ
          </p>
          <p className="text-gray-700 mb-4">ĐT: 0357 124 853</p>
          <h2 className="text-[2.2rem] font-bold">HÓA ĐƠN THANH TOÁN</h2>
        </div>

        {/* Customer Information */}
        <div className="flex justify-between items-start mt-[4rem] mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span>Ngày in:</span>
              <span className="font-semibold">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Khách hàng:</span>
              <span className="font-semibold">
                {order.customerName || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Email:</span>
              <span className="font-semibold">
                {order.customerEmail || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Số điện thoại:</span>
              <span className="font-semibold">
                {order.customerPhone || "N/A"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span>Ngày đặt hàng:</span>
              <span className="font-semibold">
                {order.createdAt ? formatDate(order.createdAt) : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Mã đơn hàng:</span>
              <span className="font-semibold">{order.orderCode || "N/A"}</span>
            </div>
            <div className="flex items-start gap-3">
              <span>Địa chỉ giao hàng:</span>
              <span className="font-semibold max-w-[20rem]">
                {order.customerAddress}, {order.customerWard},{" "}
                {order.customerDistrict}, {order.customerProvince}
              </span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-4">
          <p className="font-semibold text-gray-700">Thông tin sản phẩm:</p>
        </div>

        {/* Products Table */}
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-50 divide-x divide-gray-300">
              <th className="text-start px-[1.5rem] py-[1rem] border border-gray-300 font-semibold">
                Mặt hàng
              </th>
              <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold">
                Đơn giá
              </th>
              <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold">
                Số lượng
              </th>
              <th className="text-end px-[1.5rem] py-[1rem] border border-gray-300 font-semibold">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item) => {
              const product = item.variant?.product;
              const price =
                item.variant?.price !== null &&
                item.variant?.price !== undefined
                  ? item.variant.price
                  : product?.price || 0;
              const itemTotal = price * item.quantity;

              return (
                <tr
                  key={item.id}
                  className="divide-x divide-gray-300 hover:bg-gray-50"
                >
                  <td className="text-start px-[1.5rem] py-[1rem] border border-gray-300">
                    <div className="max-w-[30rem]">
                      <p className="font-medium text-gray-900">
                        {product?.productName || "Sản phẩm không xác định"}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-600 pr-[.5rem] mr-[.5rem] border-r border-gray-400">
                          Size: {item.variant?.variantSize?.name || "N/A"}
                        </span>
                        <span className="text-gray-600">
                          Color: {item.variant?.variantColor?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300">
                    {formatCurrency(price)}
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300">
                    x{item.quantity}
                  </td>
                  <td className="text-end px-[1.5rem] py-[1rem] border border-gray-300 font-medium">
                    {formatCurrency(itemTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-medium">Tạm tính:</span>
              <span className="font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-medium">Phí vận chuyển:</span>
              <span className="font-medium">{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-medium">Giảm giá:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex justify-between items-center pt-8 border-t border-gray-300">
            <div className="text-center flex-1">
              <p className="font-semibold mb-2">Người mua hàng</p>
              <p className="text-gray-600 italic">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-semibold mb-2">Người bán hàng</p>
              <p className="text-gray-600 italic">(Ký và ghi rõ họ tên)</p>
            </div>
          </div>
          <p className="text-gray-700 italic mt-8">
            Cảm ơn quý khách đã mua hàng tại NTK.SHOP!
          </p>
        </div>
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";

export default InvoicePrint;
