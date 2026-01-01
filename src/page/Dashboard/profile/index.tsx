import React, { useEffect, useState } from "react";
import avatarDefault from "../../../assets/images/avatar-default.png";
import axiosConfig from "../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useUser } from "../../../hooks/useUser";

type UserUpdateData = {
  user: {
    avatar: File | undefined | string;
    username: string;
    email: string;
    phone: number | undefined;
  };
  gender: "male" | "female" | "";
  birthday: string;
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
    user: {
      avatar: undefined,
      username: "",
      email: "",
      phone: undefined,
    },
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    if (user) {
      setDataUpdate({
        user: {
          avatar: user.avatar,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        gender: user?.staff.gender || "",
        birthday: user?.staff.birthday || "",
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
          user: {
            ...prev.user,
            [name]: file[0],
          },
        };
      });
    } else {
      if (name === "gender" || name === "birthday") {
        setDataUpdate((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      } else {
        setDataUpdate((prev) => {
          return {
            ...prev,
            user: {
              ...prev.user,
              [name]: value,
            },
          };
        });
      }
    }
  };

  const handleSaveUpdate = async () => {
    setIsLoadingUpdate(true);
    try {
      if (!user || !user.id) {
        navigate("/dashboard/login");
      }
      const formData = new FormData();
      console.log(dataUpdate);

      if (dataUpdate.user.avatar && dataUpdate.user.avatar instanceof File) {
        formData.append("avatar", dataUpdate.user.avatar);
      }

      formData.append("user[username]", dataUpdate.user.username);
      formData.append("user[email]", dataUpdate.user.email);
      if (dataUpdate.user.phone)
        formData.append("user[phone]", dataUpdate.user.phone.toString());

      if (dataUpdate.gender) formData.append("gender", dataUpdate.gender);
      if (dataUpdate.birthday)
        formData.append(
          "birthday",
          new Date(dataUpdate.birthday).toISOString()
        );

      const res = (await axiosConfig.patch(
        `/api/v1/staff/update/${user?.staff.id}`,
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
    <div className="w-full h-[calc(100vh-10rem)] bg-white shadow-lg rounded-[1rem] flex flex-col p-[2rem]">
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
                : typeof dataUpdate.user.avatar === "string"
                  ? dataUpdate.user.avatar
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
              {dataUpdate.user.avatar ? "Thay đổi" : "Thêm hình ảnh"}
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
        <div className="flex-1 flex flex-col gap-[2rem] pl-[5rem] border-l-[.1rem] border-l-gray-300">
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
              value={dataUpdate.user.username}
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
              value={dataUpdate.user.email}
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
                  ? dataUpdate.user.phone
                  : (dataUpdate.user.phone ?? "Chưa cập nhật")
              }
              id="phone"
              name="phone"
              className={`w-[40rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg outline-none ${isUpdate ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
              onChange={(e) => handleChangeInput(e)}
            />
          </div>
          <div className="flex items-center gap-[2rem]">
            <label
              htmlFor="birthday"
              className="text-gray-600 w-[14rem] text-end"
            >
              Ngày sinh
            </label>
            <input
              type="text"
              value={
                isUpdate
                  ? dataUpdate.birthday
                  : (dataUpdate.birthday ?? "Chưa cập nhật")
              }
              id="birthday"
              name="birthday"
              className={`w-[40rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg outline-none ${isUpdate ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
              onChange={(e) => handleChangeInput(e)}
            />
          </div>
          <div className="flex items-center gap-[2rem]">
            <label
              htmlFor="gender"
              className="text-gray-600 w-[14rem] text-end"
            >
              Giới tính
            </label>
            <input
              type="text"
              value={
                isUpdate
                  ? (dataUpdate.gender ?? "Chưa cập nhật")
                  : ((dataUpdate &&
                      (dataUpdate.gender === "female" ? "Nữ" : "Nam")) ??
                    "Chưa cập nhật")
              }
              id="gender"
              name="gender"
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
