import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import type { VoucherT } from "../../../utils/voucher.type";
import { VoucherStatus } from "@nguyentrungkien/shared";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import type { UseQueryResult } from "@tanstack/react-query";

interface ToggleVoucher {
  open: boolean;
  onClose: () => void;
  data: VoucherT | null;
  refetch: () => Promise<UseQueryResult<any>>;
}

function ToggleVoucher({ open, onClose, data, refetch }: ToggleVoucher) {
  const [isLoading, setIsLoading] = useState(false);
  if (!data) return;
  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const res = (await axiosConfig.patch(
        `/api/v1/voucher/toggle/${data?.id}`
      )) as any;
      if (res.status) {
        setIsLoading(false);
        await refetch();
        toast.success(res.message);
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
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
        Bạn có chắc chắn muốn{" "}
        {data?.status === VoucherStatus.ACTIVE ? "tắt" : "kích hoạt"} voucher
        này? <br />
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
          className={`px-[2rem] py-[.5rem] rounded-lg bg-red-500 hover:bg-red-600 text-white hover-linear`}
          disabled={isLoading}
          onClick={() => handleToggle()}
        >
          {isLoading
            ? "Đang xóa..."
            : data?.status === VoucherStatus.ACTIVE
              ? "Tắt"
              : "Kích hoạt"}
        </button>
      </div>
    </MotionWrapper>
  );
}

export default ToggleVoucher;
