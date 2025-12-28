import React, { useEffect, useState } from "react";
import avatarDefault from "../../../assets/images/avatar-default.png";
import axiosConfig from "../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useUser } from "../../../hooks/useUser";

type UserUpdateData = {
  avatar: File | undefined | string;
  username: string;
  email: string;
  phone: number | undefined;
};

interface UserUpdateResponse {
  status: boolean;
  message: string;
  user: any;
}

function Profile() {
  const { user } = useUser();
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dataUpdate, setDataUpdate] = useState<UserUpdateData>({
    avatar: undefined,
    username: "",
    email: "",
    phone: undefined,
  });

  useEffect(() => {
    if (user) {
      setDataUpdate({
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "avatar") {
      const file = event.target.files;
      if (!file || file.length === 0) {
        return;
      }
      const url = URL.createObjectURL(file[0]);
      setAvatarUrl(url);
      setDataUpdate((prev) => {
        return {
          ...prev,
          [name]: file[0],
        };
      });
    } else {
      setDataUpdate((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSaveUpdate = async () => {
    setIsLoadingUpdate(true);
    try {
      if (!user || !user.id) {
        navigate("/dashboard/login");
      }
      const formData = new FormData();
      Object.entries(dataUpdate).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (key === "avatar") {
          if (value instanceof File) {
            formData.append(key, value as File);
          }
        } else {
          formData.append(key, value.toString());
        }
      });
      for (const a of formData.entries()) {
        console.log(a[0], a[1]);
      }
      const res = (await axiosConfig.patch(
        `/api/v1/user/update/${user?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )) as UserUpdateResponse;
      if (res.status) {
        setIsUpdate(false);
        setIsLoadingUpdate(false);
        setMessage(null);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setMessage(err?.message as string);
      setIsLoadingUpdate(false);
    }
  };

  return (
    <div className="">
      <div className="pb-[2rem] border-b-[.1rem] border-b-gray-300 ">
        <h2 className="text-[2.5rem] font-bold text-gray-600">Hồ sơ của tôi</h2>
        <p className="text-[1.4rem] text-gray-600">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>
      <div className="flex gap-[1rem] mt-[3rem]">
        <div className="w-1/4 flex flex-col items-center">
          <img
            src={
              avatarUrl
                ? avatarUrl
                : typeof dataUpdate.avatar === "string"
                  ? dataUpdate.avatar
                  : avatarDefault
            }
            alt="Avatar"
            className="w-[12rem] h-[12rem] rounded-full object-cover"
          />

          <label
            htmlFor="avatar"
            className="block px-[2rem] py-[.5rem] rounded-sm border border-gray-300 cursor-pointer mt-[1rem] mb-[2rem]"
          >
            <span
              className="text-gray-600 text-[1.4rem]"
              onClick={() => setIsUpdate(true)}
            >
              {dataUpdate.avatar ? "Thay đổi" : "Thêm hình ảnh"}
            </span>
            <input
              type="file"
              id="avatar"
              name="avatar"
              hidden
              onChange={(e) => handleChangeInput(e)}
            />
          </label>
          <span className="text-gray-600 text-[1.4rem]">
            Dung lượng tối đa: 1MB
          </span>
          <span className="text-gray-600 text-[1.4rem]">
            Định dạng: .JPEG, .PNG
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-[3rem] pl-[5rem] border-l-[.1rem] border-l-gray-300">
          <h3 className="text-[1.8rem] text-gray-600 font-bold">
            Thông tin cá nhân
          </h3>
          <div className="flex items-center gap-[2rem]">
            <label
              htmlFor="username"
              className="text-gray-600 w-[14rem] text-end"
            >
              Tên người dùng
            </label>
            <input
              type="text"
              value={dataUpdate.username}
              id="username"
              name="username"
              className={`w-[40rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg outline-none ${isUpdate ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
              onChange={(e) => handleChangeInput(e)}
            />
          </div>
          <div className="flex items-center gap-[2rem]">
            <label htmlFor="email" className="text-gray-600 w-[14rem] text-end">
              Email
            </label>
            <input
              type="email"
              value={dataUpdate.email}
              id="email"
              name="email"
              className={`w-[40rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg outline-none ${isUpdate ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
              onChange={(e) => handleChangeInput(e)}
            />
          </div>
          <div className="flex items-center gap-[2rem]">
            <label htmlFor="phone" className="text-gray-600 w-[14rem] text-end">
              Số điện thoại
            </label>
            <input
              type="text"
              value={
                isUpdate
                  ? dataUpdate.phone
                  : (dataUpdate.phone ?? "Chưa cập nhật")
              }
              id="phone"
              name="phone"
              className={`w-[40rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg outline-none ${isUpdate ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
              onChange={(e) => handleChangeInput(e)}
            />
          </div>
          <div>
            {message && (
              <p className="text-red-500 text-[1.4rem] mb-[.5rem]">{message}</p>
            )}
            {isUpdate ? (
              <div>
                <button
                  className="w-[15rem] h-[4rem] rounded-[.5rem] bg-green-600 hover:bg-green-700 hover-linear text-white cursor-pointer"
                  onClick={() => handleSaveUpdate()}
                  disabled={isLoadingUpdate}
                >
                  {isLoadingUpdate ? "Đang xử lý..." : "Lưu cập nhật"}
                </button>
                <button
                  className="w-[10rem] h-[4rem] bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg ml-[1rem] cursor-pointer hover-linear"
                  onClick={() => setIsUpdate(false)}
                  disabled={isLoadingUpdate}
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                className="w-[20rem] h-[4rem] rounded-[.5rem] bg-[#1e90ff] hover:bg-[#0d87ff] text-white cursor-pointer"
                onClick={() => setIsUpdate(true)}
              >
                Cập nhật thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
