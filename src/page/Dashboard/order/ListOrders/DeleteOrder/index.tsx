import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";
import type { UseQueryResult } from "@tanstack/react-query";

interface DeleteOrderProp {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  refetch: () => Promise<UseQueryResult<any>>;
}

function DeleteOrder({ open, orderId, onClose, refetch }: DeleteOrderProp) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteStatus = async () => {
    if (!orderId) {
      toast.error("Không có id của sản phẩm!");
      return;
    }
    setIsLoading(true);
    try {
      const res = (await axiosConfig.delete(
        `/api/v1/orders/delete-order/${orderId}`
      )) as any;
      if (res.status) {
        toast.success(res.message || "Xóa đơn thành công!");
        await refetch();
        onClose();
      } else {
        toast.error(res.message || "Xóa đơn không thành công!");
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      onClose();
      toast.error(error.message || "Lỗi không thể xóa đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionWrapper
      open={open}
      className="relative w-[50rem] h-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2.5rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => onClose()}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <p className="text-[1.8rem] text-gray-600 text-start">
        Bạn có chắc chắn muốn xóa đơn hàng này? <br />
      </p>
      <div className="flex items-center justify-end mt-[4rem] gap-[1rem]">
        <button
          className="px-[2rem] py-[.5rem] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 hover-linear"
          onClick={() => {
            onClose();
          }}
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          className="px-[2rem] py-[.5rem] rounded-lg bg-red-500 hover:bg-red-600 text-white hover-linear"
          disabled={isLoading}
          onClick={() => deleteStatus()}
        >
          {isLoading ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </MotionWrapper>
  );
}

export default DeleteOrder;
