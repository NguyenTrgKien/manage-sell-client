import { OrderStatus } from "@nguyentrungkien/shared";

export const getStatusConfig = (status: OrderStatus) => {
  const statusConfig = {
    [OrderStatus.PENDING]: {
      text: "Chờ xác nhận",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    [OrderStatus.CONFIRMED]: {
      text: "Đã xác nhận",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    [OrderStatus.SHIPPING]: {
      text: "Đang giao",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
    },
    [OrderStatus.DELIVERED]: {
      text: "Đã giao",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    [OrderStatus.COMPLETED]: {
      text: "Hoàn thành",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    [OrderStatus.CANCELLED]: {
      text: "Đã hủy",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
  };

  return (
    statusConfig[status] || {
      text: status,
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
    }
  );
};
