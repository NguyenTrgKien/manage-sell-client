import { OrderStatus } from "@my-project/shared";

export const getStatusConfig = (status: OrderStatus) => {
  const statusConfig = {
    [OrderStatus.PENDING]: {
      text: "Chờ xác nhận",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    [OrderStatus.CONFIRMED]: {
      text: "Đã xác nhận",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    [OrderStatus.SHIPPING]: {
      text: "Đang giao",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    [OrderStatus.COMPLETED]: {
      text: "Hoàn thành",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    [OrderStatus.CANCELLED]: {
      text: "Đã hủy",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
  };

  return (
    statusConfig[status] || {
      text: status,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    }
  );
};
