import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCopy } from "@fortawesome/free-solid-svg-icons";
import MotionWrapper from "./ui/MotionWrapper";
import type { VoucherT } from "../utils/voucher.type";
import dayjs from "dayjs";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../configs/axiosConfig";
import { useState } from "react";
import Notify from "./Notify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSavedVouchers } from "../api/voucher.api";

interface ShowVouchersProp {
  open: boolean;
  onClose: () => void;
  vouchers: VoucherT[] | null;
}

function ShowVouchers({ open, onClose, vouchers }: ShowVouchersProp) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSaveVoucher, setIsSaveVoucher] = useState<{
    open: boolean;
    content: string;
    isSuccess: boolean;
  }>({
    open: false,
    content: "",
    isSuccess: false,
  });
  const {
    data: dataSavedVouchers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getSavedVouchers"],
    queryFn: () => getSavedVouchers(),
    enabled: !!user,
  });
  const savedVouchers = dataSavedVouchers && dataSavedVouchers.data;

  if (!vouchers) return null;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("HH:mm DD/MM/YYYY");
  };

  const handleCopycode = (voucher: VoucherT) => {
    navigator.clipboard
      .writeText(voucher.voucherCode)
      .then(() => {
        setIsSaveVoucher({
          open: true,
          content: "Đã sao chép mã!",
          isSuccess: true,
        });
      })
      .catch(() => {
        setIsSaveVoucher({
          open: true,
          content: "Sao chép mã không thành công!",
          isSuccess: false,
        });
      });
  };

  const handleSaveVouchers = async (voucher: VoucherT) => {
    try {
      const res = await axiosConfig.post(
        `/api/v1/voucher/save-voucher/${voucher.voucherCode}`
      );
      if (res.status) {
        setIsSaveVoucher({
          open: true,
          content: "Lưu mã thành công!",
          isSuccess: true,
        });
        await refetch();
      }
    } catch (error) {
      console.log(error);
      setIsSaveVoucher({
        open: true,
        content: "Lưu mã không thành công!",
        isSuccess: false,
      });
    }
  };

  return (
    <>
      <MotionWrapper
        open={open}
        className="relative flex flex-col w-[90%] md:w-[60rem] max-h-[80vh] hide-scrollbar overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="w-full bg-white z-[100] py-8 sticky top-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            <FontAwesomeIcon icon={faClose} className="text-3xl" />
          </button>

          <h2 className="font-bold text-center text-pink-600">
            Chi Tiết Voucher
          </h2>
        </div>
        {isLoading ? (
          <div className="my-16 text-center">Đang tải dữ liệu...</div>
        ) : (
          <div className="md:px-8 px-6 space-y-4 z-0">
            {vouchers && vouchers?.length > 0 ? (
              vouchers?.map((voucher) => {
                const isSaved =
                  user && savedVouchers.some((v: any) => v.id === voucher.id);
                return (
                  <div
                    key={voucher.id}
                    className="flex items-center bg-gradient-to-r from-pink-500 to-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden "
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute z-0 -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
                      <div className="absolute z-0 -bottom-10 -left-10 w-56 h-56 bg-white rounded-full"></div>
                    </div>
                    <>
                      <div className="relative z-10">
                        <h3 className="text-[1.2rem] md:text-[1.4rem] font-bold mb-2 select-none">
                          {voucher.name}
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-white/20 text-[1.2rem] md:text-[1.4rem] backdrop-blur-sm px-6 py-3 rounded-xl font-mono font-bold tracking-wider">
                            {voucher.voucherCode}
                          </div>
                          <button
                            onClick={() => handleCopycode(voucher)}
                            className="flex items-center text-[1.4rem] gap-2 bg-white text-pink-600 px-4 py-3.5 rounded-xl hover:bg-gray-100 transition shadow-md"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                        </div>

                        <div className="text-[1.4rem] md:text-[2.2rem] font-extrabold mb-2">
                          Giảm{" "}
                          {voucher.type === "PERCENT"
                            ? `${voucher.value}%`
                            : `${voucher.value.toLocaleString()}đ`}
                          {voucher.maxDiscount && (
                            <span className="text-[1.2rem] font-normal ml-2">
                              (Tối đa {voucher.maxDiscount.toLocaleString()}đ)
                            </span>
                          )}
                        </div>

                        <div className="text-[1rem] md:text-[1.2rem] gap-2">
                          Thời hạn: đến {formatDate(voucher.endDate)}
                        </div>
                      </div>
                    </>
                    {user && (
                      <div className="relative z-[100] ml-auto">
                        <button
                          className={`px-8 py-3 rounded-xl ${isSaved ? "border border-white text-white" : "bg-red-500 hover:bg-red-600"}  transition-colors duration-300 text-[1rem] md:text-[1.4rem] cursor-pointer`}
                          onClick={() => {
                            if (user) {
                              handleSaveVouchers(voucher);
                            } else {
                              navigate("/login");
                            }
                          }}
                        >
                          {isSaved ? "Đã lưu" : "Lưu mã"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>
        )}

        <div className="sticky bottom-0  bg-white border-t border-gray-200 md:px-8 px-6 py-6 text-end z-10">
          <button
            onClick={onClose}
            className="px-12 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold text-[1.4rem]"
          >
            Đóng
          </button>
        </div>
      </MotionWrapper>
      <Notify
        showNotify={isSaveVoucher.open}
        duration={1000}
        onClose={() =>
          setIsSaveVoucher({ open: false, content: "", isSuccess: false })
        }
        isSuccess={isSaveVoucher.isSuccess}
        content={isSaveVoucher.content}
      />
    </>
  );
}

export default ShowVouchers;
