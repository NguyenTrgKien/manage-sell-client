import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "./ui/MotionWrapper";
import {
  faClose,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../configs/axiosConfig";
import { CancelReasonType, OrderStatus } from "@nguyentrungkien/shared";
import { useUser } from "../hooks/useUser";

export const CancelReasonLabel = {
  [CancelReasonType.CHANGE_OF_MIND]: "Tôi đổi ý",
  [CancelReasonType.FOUND_BETTER_PRICE]: "Tôi tìm được giá tốt hơn",
  [CancelReasonType.ORDER_BY_MISTAKE]: "Tôi đặt nhầm",
  [CancelReasonType.WRONG_ADDRESS]: "Thay đổi địa chỉ",
  [CancelReasonType.OTHER]: "Lý do khác",
};

interface CancelOrderProp {
  open: boolean;
  onClose: () => void;
  orderCode: string | null;
  refetch?: any;
  status?: OrderStatus;
  cancelReason?: CancelReasonType;
  cancelledAt?: string;
  cancelledBy?: string;
}

function CancelOrder({
  open,
  onClose,
  orderCode,
  refetch,
  status,
  cancelReason,
  cancelledAt,
  cancelledBy,
}: CancelOrderProp) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const isViewMode = status === OrderStatus.CANCELLED;
  const [dataGuest, setDataGuest] = useState({
    customerEmail: "",
    customerPhone: "undefined",
  });

  const [errors, setErrors] = useState({
    customerEmail: "",
    customerPhone: "",
    reason: "",
  });

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      customerEmail: "",
      customerPhone: "",
      reason: "",
    };

    if (!user) {
      if (!dataGuest.customerEmail.trim()) {
        newErrors.customerEmail = "Vui lòng nhập email đã đặt hàng!";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(dataGuest.customerEmail)) {
        newErrors.customerEmail = "Email không hợp lệ!";
        valid = false;
      }

      if (!dataGuest.customerPhone.trim()) {
        newErrors.customerPhone = "Vui lòng nhập số điện thoại đã đặt hàng!";
        valid = false;
      } else if (!/^0[1-9]\d{8}$/.test(dataGuest.customerPhone)) {
        newErrors.customerPhone = "Số điện thoại không hợp lệ!";
        valid = false;
      }
    }

    if (!reason) {
      newErrors.reason = "Vui lòng chọn lý do hủy đơn!";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCancel = async () => {
    if (!orderCode) {
      toast.error("Không tìm thấy mã đơn hàng");
      return;
    }

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const payload: any = {
        reason,
      };

      if (!user) {
        payload.customerEmail = dataGuest.customerEmail;
        payload.customerPhone = dataGuest.customerPhone;
      }

      const res = (await axiosConfig.patch(
        `/api/v1/orders/cancel/${orderCode}`,
        payload
      )) as any;

      if (res.status) {
        setDataGuest({ customerEmail: "", customerPhone: "" });
        setReason("");
        setErrors({ customerEmail: "", customerPhone: "", reason: "" });

        await refetch?.();
        toast.success(res.message || "Hủy đơn hàng thành công!");
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Có lỗi xãy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] min-h-[20rem] rounded-lg bg-white p-[2rem]"
    >
      <h2 className="text-[2rem] text-amber-600 mb-[2.5rem] font-bold text-center">
        Hủy đơn hàng
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
      {isViewMode ? (
        <div className="space-y-6 mb-[4rem]">
          <div className="flex justify-between ">
            <div>
              <p className="text-gray-500">Thời gian hủy</p>
              <p className="font-medium">
                {cancelledAt
                  ? new Date(cancelledAt).toLocaleString("vi-VN")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Người hủy</p>
              <p className="font-medium">{cancelledBy}</p>
            </div>
          </div>
          <div className="w-full py-[1rem] rounded-md shadow-md flex flex-col justify-center px-[2rem]">
            <p className="text-gray-600">Lý do hủy đơn</p>
            <p className="">
              {CancelReasonLabel[cancelReason as CancelReasonType]}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-amber-600 mt-0.5"
            />
            <p className=" text-amber-800">
              Đơn hàng đã được hủy và không thể khôi phục. Bạn có thể đặt lại
              đơn hàng mới nếu cần.
            </p>
          </div>
        </div>
      ) : (
        <>
          {!user && (
            <div className="flex items-start space-x-6 mb-[2rem]">
              <div className="w-full">
                <label htmlFor="customerEmail" className="text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  id="customerEmail"
                  value={dataGuest.customerEmail}
                  className="w-full h-[4rem] rounded-md border border-gray-400 outline-none focus:border-cyan-400 px-[1.5rem] mt-1"
                  onChange={(e) => {
                    setDataGuest((prev) => ({
                      ...prev,
                      customerEmail: e.target.value,
                    }));
                    if (errors.customerEmail) {
                      setErrors((prev) => ({ ...prev, customerEmail: "" }));
                    }
                  }}
                />
                {errors.customerEmail && (
                  <p className="text-red-500 mt-1">{errors.customerEmail}</p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="customerPhone" className="text-gray-600">
                  Số điện thoại
                </label>
                <input
                  type="number"
                  name="customerPhone"
                  id="customerPhone"
                  value={dataGuest.customerPhone}
                  className="w-full h-[4rem] rounded-md border border-gray-400 outline-none focus:border-cyan-400 px-[1.5rem] mt-1"
                  onChange={(e) => {
                    setDataGuest((prev) => ({
                      ...prev,
                      customerPhone: e.target.value,
                    }));
                    if (errors.customerPhone) {
                      setErrors((prev) => ({ ...prev, customerPhone: "" }));
                    }
                  }}
                />
                {errors.customerPhone && (
                  <p className="text-red-500 mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          )}
          <div>
            <p className="block text-gray-600 pb-[1rem]">Lý do hủy đơn</p>
            {Object.entries(CancelReasonLabel).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className="flex items-center space-x-6 py-4 pl-[2rem] cursor-pointer"
                >
                  <input
                    type="radio"
                    id={`reason-${key}`}
                    name="reason"
                    value={key}
                    style={{ scale: 1.4, backgroundColor: "red" }}
                    className="cursor-pointer"
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                  />
                  <label
                    htmlFor={`reason-${key}`}
                    className="cursor-pointer select-none"
                  >
                    {value}
                  </label>
                </div>
              );
            })}
          </div>
        </>
      )}
      {errors.reason && (
        <p className="text-red-500 mt-2 pl-[2rem]">{errors.reason}</p>
      )}
      <div className="mt-[.5rem] flex items-center gap-[1rem] justify-end">
        <button
          type="button"
          className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300 outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          {!status ? "Hủy" : "Đóng"}
        </button>
        {!status && status !== OrderStatus.CANCELLED && (
          <button
            type="button"
            className="px-[2rem] py-[.5rem] rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300 outline-none"
            onClick={() => handleCancel()}
          >
            {isLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </MotionWrapper>
  );
}

export default CancelOrder;
