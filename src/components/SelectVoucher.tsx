import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "./ui/MotionWrapper";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import type { VoucherT } from "../utils/voucher.type";
import { useQuery } from "@tanstack/react-query";
import { getSavedVouchers } from "../api/voucher.api";
import dayjs from "dayjs";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../configs/axiosConfig";
import Notify from "./Notify";

interface SelectVoucherProp {
  open: boolean;
  selected: VoucherT | null;
  onClose: () => void;
  setSelectVoucher: Dispatch<
    SetStateAction<{
      open: boolean;
      voucher: VoucherT | null;
      conditionValue: number | null;
    }>
  >;
  conditionValue: number | null;
}

function SelectVoucher({
  open,
  selected,
  onClose,
  setSelectVoucher,
  conditionValue,
}: SelectVoucherProp) {
  const [voucherCode, setVoucherCode] = useState("");

  const { data: dataSavedVouchers } = useQuery({
    queryKey: ["getSavedVouchers"],
    queryFn: () => getSavedVouchers(),
    staleTime: 2 * 60 * 1000,
    enabled: open,
  });
  const [message, setMessage] = useState({
    open: false,
    content: "",
    isSuccess: true,
  });
  const savedVouchers =
    dataSavedVouchers && dataSavedVouchers.data.filter((v: any) => !v.usedAt);
  console.log(savedVouchers);
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("HH:mm DD/MM/YYYY");
  };

  const handleApplyVoucher = (voucher: VoucherT) => {
    const now = new Date();
    if (now > new Date(voucher.endDate)) {
      setMessage({
        open: true,
        content: "Voucher đã hết hạn!",
        isSuccess: false,
      });
      return;
    }
    if (conditionValue && conditionValue < voucher.minOrderValue) {
      setMessage({
        open: true,
        content: "Giá đơn không đủ điều kiện sử dụng vocuher này!",
        isSuccess: false,
      });
      return;
    }
    setSelectVoucher((prev) => ({ ...prev, open: false, voucher: voucher }));
  };

  const handleSavedVoucher = async (voucherCode: string) => {
    try {
      const res = await axiosConfig.post(
        `/api/v1/check-voucher/${voucherCode}`
      );
      if (res.status) {
        setSelectVoucher({
          open: false,
          voucher: res.data,
          conditionValue: res.data.minOrderValue,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <MotionWrapper
      open={open}
      className="relative flex flex-col w-[60rem] max-h-[80vh] hide-scrollbar overflow-y-auto rounded-2xl bg-white shadow-2xl"
    >
      <div className="w-full bg-white z-[100] py-8 sticky top-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <FontAwesomeIcon icon={faClose} className="text-3xl" />
        </button>

        <h2 className="text-3xl  font-bold text-center text-pink-600">
          Voucher giảm giá
        </h2>
      </div>
      <div className="px-8 space-y-4 z-0">
        <div className="w-full p-8 bg-gray-100 rounded-2xl flex items-center justify-center mt-4">
          <div className="w-4xl flex items-center space-x-4">
            <p>Mã voucher</p>
            <input
              type="text"
              id="voucher"
              name="voucher"
              className="flex-1 bg-white h-[4rem] rounded-md border border-gray-300 outline-none focus:border-cyan-400 px-[1.5rem]"
              placeholder="Nhập mã voucher..."
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button
              className={`h-[4rem] px-8 rounded-md ${voucherCode === "" ? "bg-gray-200 text-gray-400" : "bg-red-500 text-white hover:bg-red-600"}  transition-colors duration-300`}
              onClick={() => handleSavedVoucher(voucherCode)}
            >
              Áp dụng
            </button>
          </div>
        </div>
        {savedVouchers?.length > 0 ? (
          <div className="grid grid-cols-2 gap-[1rem]">
            {savedVouchers?.map((voucher: VoucherT) => {
              const isSelected = selected && selected.id === voucher.id;
              const qualified =
                conditionValue && voucher.minOrderValue <= conditionValue;
              return (
                <div
                  key={voucher.id}
                  className={`flex items-center bg-gradient-to-r ${qualified ? "from-pink-500 to-blue-600" : "from-gray-300 to-gray-500"}  rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute z-0 -top-10 -right-10 w-30 h-30 bg-white rounded-full"></div>
                    <div className="absolute z-0 -bottom-10 -left-10 w-46 h-46 bg-white rounded-full"></div>
                  </div>
                  <div className="relative w-full z-10">
                    <h3 className="text-[1.4rem] text-nowrap select-none">
                      {voucher.name}
                    </h3>

                    <div className="text-[2rem] font-bold mb-2">
                      Giảm{" "}
                      {voucher.type === "PERCENT"
                        ? `${voucher.value}%`
                        : `${voucher.value.toLocaleString()}đ`}
                      {voucher.maxDiscount && (
                        <span className="text-[1rem] font-normal ml-2">
                          (Tối đa {voucher.maxDiscount.toLocaleString()}đ)
                        </span>
                      )}
                    </div>

                    <div className="text-[1rem] gap-2">
                      HSD: đến {formatDate(voucher.endDate)}
                    </div>
                    <div className="w-full flex justify-end mt-2">
                      <button
                        className={`text-[1.2rem] px-6 py-2 rounded-xl  ${!qualified ? "bg-gray-400 cursor-not-allowed" : `${isSelected ? "bg-red-500 text-white" : "text-red-600 hover:text-red-700 hover:border-red-500 bg-white"} cursor-pointer`}  border border-transparent  transition-colors duration-300 `}
                        onClick={() => handleApplyVoucher(voucher)}
                        disabled={!qualified}
                      >
                        {isSelected ? "Đang áp dụng" : "Áp dụng"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">Đăng nhập để lưu voucher</div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 text-end z-10">
        <button
          onClick={onClose}
          className="px-12 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold text-[1.4rem]"
        >
          Đóng
        </button>
      </div>
      <Notify
        content={message.content}
        duration={1000}
        showNotify={message.open}
        isSuccess={message.isSuccess}
      />
    </MotionWrapper>
  );
}

export default SelectVoucher;
