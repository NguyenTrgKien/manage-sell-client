import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { OrderType } from "..";
import { getStatusConfig } from "../../../../../configs/getOrderStatusConfig";
import { OrderStatus } from "@my-project/shared";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";
import type { UseQueryResult } from "@tanstack/react-query";

interface UpdateOrderProp {
  openUpdate: { open: boolean; data: OrderType | null };
  setOpenUpdate: Dispatch<
    SetStateAction<{ open: boolean; data: OrderType | null }>
  >;
  refetch: () => Promise<UseQueryResult<any>>;
}

function UpdateOrder({ openUpdate, setOpenUpdate, refetch }: UpdateOrderProp) {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (openUpdate.data) {
      setStatus(openUpdate.data.status);
    }
  }, [openUpdate.data]);

  const updateStatus = async () => {
    if (!openUpdate.data?.id) {
      toast.error("Không có id của sản phẩm"!);
      return;
    }
    setIsLoading(true);
    try {
      const res = (await axiosConfig.patch(
        `/api/v1/orders/update-status/${openUpdate.data?.id}`,
        { status }
      )) as any;
      if (res.status) {
        toast.success(res.message || "Cập nhật thành công!");
        await refetch();
        setOpenUpdate({ open: false, data: null });
      } else {
        toast.error(res.message || "Cập nhật không thành công!");
        setOpenUpdate({ open: false, data: null });
      }
    } catch (error: any) {
      console.log(error);
      setOpenUpdate({ open: false, data: null });
      toast.error(error.message || "Lỗi không thể cập nhật trạng thái!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionWrapper
      open={openUpdate.open}
      className="relative w-[50rem] h-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => setOpenUpdate({ open: false, data: null })}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <h2
        className={`text-[2rem] text-amber-600 text-center font-semibold mb-[2rem]`}
      >
        Cập nhật trạng thái
      </h2>
      <div>
        <label className="text-gray-600">Trạng thái đơn hàng</label>
        <select
          name="status"
          id="status"
          value={status ?? undefined}
          className="w-full h-[4rem] rounded-lg border border-gray-300 mt-[.5rem] outline-none pl-[1.5rem] text-gray-600"
          onChange={(e) => setStatus(e.target.value)}
        >
          {Object.entries(OrderStatus).map(([key, value]) => {
            return (
              <option key={key} value={value}>
                {getStatusConfig(value as OrderStatus).text}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex items-center justify-end mt-[4rem] gap-[1rem]">
        <button
          className="px-[2rem] py-[.5rem] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 hover-linear"
          onClick={() => {
            setOpenUpdate({ open: false, data: null });
          }}
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          className="px-[2rem] py-[.5rem] rounded-lg bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white hover-linear"
          disabled={isLoading}
          onClick={() => updateStatus()}
        >
          {isLoading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </div>
    </MotionWrapper>
  );
}

export default UpdateOrder;
