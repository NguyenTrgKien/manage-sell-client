import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { OrderType } from "../page/Dashboard/order/ListOrders";
import MotionWrapper from "./ui/MotionWrapper";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axiosConfig from "../configs/axiosConfig";
import type { UseQueryResult } from "@tanstack/react-query";

interface ConfirmReceivedOrderProp {
  open: boolean;
  data: OrderType | null;
  onClose: () => void;
  refetch: () => Promise<UseQueryResult<any>>;
}

function ConfirmReceivedOrder({
  open,
  data,
  onClose,
  refetch,
}: ConfirmReceivedOrderProp) {
  const handleConfirm = async () => {
    try {
      const res = await axiosConfig.patch(
        `/api/v1/orders/confirm-received/${data?.id}`
      );
      if (res.status) {
        onClose();
        await refetch();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Lỗi không thể xác nhận!");
    }
  };
  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] rounded-lg bg-white p-[2rem]"
    >
      <h2 className="text-[2rem] text-amber-600 mb-[3rem]">
        Vui lòng xác nhận bạn đã nhận được đơn hàng!
      </h2>
      <div
        className="absolute top-[1rem] right-[1rem]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-end gap-[1rem]">
        <button
          type="button"
          className="text-gray-600 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => onClose()}
        >
          Hủy
        </button>
        <button
          type="button"
          className="text-white px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600"
          onClick={() => handleConfirm()}
        >
          Xác nhận
        </button>
      </div>
    </MotionWrapper>
  );
}

export default ConfirmReceivedOrder;
