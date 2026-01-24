import { faChevronLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteReason } from "@nguyentrungkien/shared";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";

export const DeleteReasonLabel = {
  [DeleteReason.NOT_USING]: "Tôi không còn sử dụng nữa",
  [DeleteReason.PRIVACY_CONCERNS]: "Lo ngại về quyền riêng tư",
  [DeleteReason.FOUND_BETTER_ALTERNATIVE]: "Tìm được website/app tốt hơn",
  [DeleteReason.ACCOUNT_ISSUE]: "Gặp vấn đề với tài khoản",
  [DeleteReason.OTHER]: "Lý do khác",
};

function Privacy() {
  const { logout } = useAuth();
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dataDelete, setDataDelete] = useState<{
    reason: DeleteReason | null;
    confirm: boolean;
    password: string;
  }>({
    reason: null,
    confirm: false,
    password: "",
  });
  const [errors, setErrors] = useState<{
    reason: string | null;
    confirm: string | null;
    password: string | null;
  }>({
    reason: null,
    confirm: null,
    password: null,
  });

  const handleDeleteAccount = async () => {
    setOpenDeleteAccount(true);
  };

  const handleDelete = async () => {
    setErrors({
      reason: null,
      confirm: null,
      password: null,
    });

    let hasError = false;

    if (dataDelete.password === "") {
      setErrors((prev) => ({
        ...prev,
        password: "Vui lòng nhập mật khẩu để xác thực!",
      }));
      hasError = true;
    }
    if (!dataDelete.reason) {
      setErrors((prev) => ({
        ...prev,
        reason: "Vui lòng chọn lý do xóa tài khoản!",
      }));
      hasError = true;
    }
    if (!dataDelete.confirm) {
      setErrors((prev) => ({
        ...prev,
        confirm: "Vui lòng xác nhận xóa tài khoản!",
      }));
      hasError = true;
    }

    if (hasError) return;
    setIsLoading(true);
    try {
      const res = (await axiosConfig.post(
        "/api/v1/user/delete-account",
        dataDelete,
      )) as any;
      if (res.status) {
        localStorage.removeItem("guest_address");
        toast.success(res.message || "Xóa tài khoản thành công!");
        await logout();
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Xóa tài khoản không thành công!");
      if (error.message.toLowerCase().includes("mật khẩu")) {
        setErrors((prev) => ({
          ...prev,
          password: "Mật khẩu không chính xác!",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[2rem] text-[1.4rem] md:text-[1.6rem]">
      <div className="flex items-center justify-between pb-[2rem] border-b border-b-gray-300">
        <h3 className="text-[1.8rem] text-gray-800">
          Quyền riêng tư & Xóa tài khoản
        </h3>
      </div>
      {openDeleteAccount ? (
        <div className="mt-[2rem]">
          <button
            className="flex items-center gap-[.5rem] px-8 py-2.5 rounded-md hover:bg-gray-50 hover:border-gray-400 transition duration-300 cursor-pointer border border-gray-300 text-[1.4rem]"
            onClick={() => setOpenDeleteAccount(false)}
            disabled={isLoading}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-gray-600 text-[1.4rem]"
            />
            <span className="text-gray-600">Quay lại</span>
          </button>
          <div className="mt-[2rem]">
            <label htmlFor="password" className="text-gray-600">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={dataDelete.password}
              placeholder="Nhập mật khẩu tài khoản của bạn..."
              className="w-full h-[4rem] rounded-md border border-gray-300 focus:border-cyan-400 outline-none px-[1.5rem] mt-[.5rem]"
              onChange={(e) => {
                setDataDelete((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: null }));
                }
              }}
            />
            {errors.password && (
              <p className="text-red-500 mt-[.5rem] text-[1.4rem]">
                {errors.password}
              </p>
            )}
            <div className="mt-[2rem]">
              <p className="text-gray-600">Lý do bạn muốn xóa tài khoản</p>
              <div className="space-y-8 pl-[2rem] mt-[2rem]">
                {Object.entries(DeleteReasonLabel).map(([key, value]) => {
                  return (
                    <div className="flex items-center space-x-6" key={key}>
                      <input
                        type="radio"
                        id={`reason-${key}`}
                        name={"reason"}
                        className="cursor-pointer"
                        style={{ scale: 1.5 }}
                        checked={key === dataDelete.reason}
                        onChange={() => {
                          setDataDelete((prev) => ({
                            ...prev,
                            reason: key as DeleteReason,
                          }));
                          if (errors.reason) {
                            setErrors((prev) => ({ ...prev, reason: null }));
                          }
                        }}
                      />
                      <label
                        htmlFor={`reason-${key}`}
                        className="text-gray-800 select-none cursor-pointer"
                      >
                        {value}
                      </label>
                    </div>
                  );
                })}
                {errors.reason && (
                  <p className="text-red-500 mt-[.5rem] text-[1.4rem] pl-[2rem]">
                    {errors.reason}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-[2rem]">
              <p className="w-full h-auto p-[1rem] mb-[1rem] border border-amber-400 text-amber-800 bg-amber-50">
                ⚠️ Xóa tài khoản tất sẽ xóa toàn bộ dữ liệu về giỏ hàng và các
                cấu hình thông tin cá nhân. Bạn có chắc chứ?
              </p>
              <div className="flex items-center space-x-4 pl-[2rem]">
                <input
                  type="checkbox"
                  id="confirm"
                  className=""
                  checked={dataDelete.confirm}
                  style={{ scale: 1.5 }}
                  onChange={(e) => {
                    setDataDelete((prev) => ({
                      ...prev,
                      confirm: e.target.checked,
                    }));
                    if (errors.confirm) {
                      setErrors((prev) => ({ ...prev, confirm: null }));
                    }
                  }}
                />
                <label htmlFor="confirm" className="text-gray-600">
                  Xác nhận xóa tài khoản
                </label>
              </div>
              {errors.confirm && (
                <p className="text-red-500 mt-[.5rem] pl-[2rem] text-[1.4rem]">
                  {errors.confirm}
                </p>
              )}
            </div>
            <div className="mt-[2rem] flex items-center justify-end gap-[1rem]">
              <button
                type="button"
                className={`px-[2rem] py-[.8rem] text-[1.4rem] text-white bg-red-500 hover:bg-red-600 rounded-sm ${isLoading ? "cursor-not-allowed" : ""}`}
                onClick={() => {
                  handleDelete();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xóa tài khoản"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-[2rem]">
          <h3 className=" text-gray-600">Yêu cầu xóa tài khoản</h3>
          <button
            type="button"
            className="flex items-center gap-[.5rem] px-8 py-4 bg-red-500 rounded-md hover:bg-red-600 transition duration-300 cursor-pointer"
            onClick={() => {
              handleDeleteAccount();
            }}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-white text-[1.4rem]"
            />
            <span className="text-white">Xóa tài khoản</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Privacy;
