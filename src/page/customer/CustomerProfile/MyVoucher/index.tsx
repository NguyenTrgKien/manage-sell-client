import { useQuery } from "@tanstack/react-query";
import { getSavedVouchers } from "../../../../api/voucher.api";
import type { VoucherT } from "../../../../utils/voucher.type";
import axiosConfig from "../../../../configs/axiosConfig";
import { useState } from "react";
import Notify from "../../../../components/Notify";
import { useNavigate } from "react-router-dom";

function MyVoucher() {
  const {
    data: dataSavedVouchers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getSavedVouchers"],
    queryFn: () => getSavedVouchers(),
  });
  const [voucherCode, setVoucherCode] = useState("");
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState<
    "ALL" | "AVAILABLE" | "USED" | "EXPIRED"
  >("AVAILABLE");
  const [isSaveVoucher, setIsSaveVoucher] = useState<{
    open: boolean;
    content: string;
    isSuccess: boolean;
  }>({
    open: false,
    content: "",
    isSuccess: false,
  });
  const vouchers = dataSavedVouchers && dataSavedVouchers.data;
  const filteredVouchers = vouchers?.filter(
    (v: VoucherT & { state: string }) =>
      filterState === "ALL" ? true : v.state === filterState
  );

  const handleSaveVouchers = async (voucherCode: string) => {
    try {
      const res = await axiosConfig.post(
        `/api/v1/voucher/save-voucher/${voucherCode}`
      );
      if (res.status) {
        setIsSaveVoucher({
          open: true,
          content: "Lưu mã thành công!",
          isSuccess: true,
        });
        await refetch();
      }
    } catch (error: any) {
      console.log(error);
      setIsSaveVoucher({
        open: true,
        content: error.message,
        isSuccess: false,
      });
    }
  };

  return (
    <div className="p-[1rem] md:p-[2rem]">
      <h4 className="text-[1.4rem] md:text-[1.8rem] text-gray-800">
        Kho Voucher của tôi
      </h4>
      
      {/* Input voucher section */}
      <div className="w-full py-6 md:py-8 bg-gray-100 flex items-center justify-center mt-4 px-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-4 md:gap-6 md:space-x-4">
          <p className="text-[1.4rem] md:text-[1.6rem] w-full md:w-auto text-center md:text-left">
            Mã voucher
          </p>
          <input
            type="text"
            id="voucher"
            name="voucher"
            value={voucherCode}
            className="w-full md:flex-1 bg-white h-[3.5rem] md:h-[4rem] rounded-md border border-gray-300 outline-none focus:border-cyan-400 px-[1.2rem] md:px-[1.5rem] text-[1.4rem]"
            placeholder="Nhập mã voucher..."
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button
            className={`w-full md:w-auto h-[3.5rem] md:h-[4rem] px-6 md:px-8 rounded-md ${voucherCode === "" ? "bg-gray-200 text-gray-400" : "bg-red-500 text-white hover:bg-red-600"} transition-colors duration-300 text-[1.4rem]`}
            onClick={() => handleSaveVouchers(voucherCode)}
            disabled={voucherCode === ""}
          >
            Lưu voucher
          </button>
        </div>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 my-6 md:my-8">
        {["ALL", "AVAILABLE", "USED", "EXPIRED"].map((state) => (
          <button
            key={state}
            onClick={() => setFilterState(state as any)}
            className={`px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors text-[1.2rem] md:text-[1.4rem] ${
              filterState === state
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {state === "ALL"
              ? "Tất cả"
              : state === "AVAILABLE"
                ? "Khả dụng"
                : state === "USED"
                  ? "Đã dùng"
                  : "Hết hạn"}
          </button>
        ))}
      </div>
      
      {/* Voucher list */}
      <>
        {isLoading ? (
          <div className="text-center py-8 text-[1.4rem]">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[1.5rem] md:gap-[2rem]">
            {filteredVouchers?.map(
              (
                voucher: VoucherT & { state: string; usedAt: string | null }
              ) => {
                const isDisable = ["USED", "EXPIRED"].includes(voucher.state);
                return (
                  <div
                    key={voucher.id}
                    className={`flex flex-col md:flex-row items-center bg-gradient-to-r ${isDisable ? "from-gray-400 to-gray-500" : "from-pink-500 to-violet-600"} rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden`}
                  >
                    <div className="w-full md:w-auto">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute z-0 -top-6 -right-6 w-28 h-28 md:-top-10 md:-right-10 md:w-40 md:h-40 bg-white rounded-full"></div>
                        <div className="absolute z-0 -bottom-6 -left-6 w-36 h-36 md:-bottom-10 md:-left-10 md:w-56 md:h-56 bg-white rounded-full"></div>
                      </div>

                      <div className="relative z-10 mb-4 md:mb-0">
                        <h3 className="text-[1.2rem] md:text-[1.4rem] font-bold mb-2 select-none line-clamp-2">
                          {voucher.name}
                        </h3>

                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <div className="bg-white/20 text-[1.2rem] md:text-[1.4rem] backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-xl font-mono font-bold tracking-wider truncate max-w-[180px] md:max-w-none">
                            {voucher.voucherCode}
                          </div>
                        </div>

                        <div className="text-[1.6rem] md:text-[2.2rem] font-extrabold mb-1 md:mb-2">
                          Giảm{" "}
                          {voucher.type === "PERCENT"
                            ? `${voucher.value}%`
                            : `${voucher.value}đ`}
                          {voucher.maxDiscount && (
                            <span className="text-[1rem] md:text-[1.2rem] font-normal ml-1 md:ml-2 block md:inline">
                              (Tối đa {voucher.maxDiscount.toLocaleString()}đ)
                            </span>
                          )}
                        </div>
                        
                        {voucher.usedAt && (
                          <div className="text-[1.1rem] md:text-[1.2rem] opacity-90 mt-1">
                            Đã sử dụng: {new Date(voucher.usedAt).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative z-[100] mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
                      <button
                        type="button"
                        className={`w-full md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl ${isDisable ? "bg-gray-400" : "border bg-white border-red-500 text-red-600 hover:border-red-600 hover:text-red-700"} transition-colors duration-300 text-[1.3rem] md:text-[1.4rem] cursor-pointer`}
                        disabled={isDisable}
                        onClick={() => {
                          if (!isDisable) {
                            navigate("/");
                          }
                        }}
                      >
                        {voucher.usedAt ? "Đã sử dụng" : "Dùng ngay"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </>
      
      <Notify
        showNotify={isSaveVoucher.open}
        duration={1000}
        onClose={() =>
          setIsSaveVoucher({ open: false, content: "", isSuccess: false })
        }
        isSuccess={isSaveVoucher.isSuccess}
        content={isSaveVoucher.content}
      />
    </div>
  );
}

export default MyVoucher;