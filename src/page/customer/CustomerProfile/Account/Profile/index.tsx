import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { Gender } from "@nguyentrungkien/shared";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import axiosConfig from "../../../../../configs/axiosConfig";
import { useUser } from "../../../../../hooks/useUser";

interface UpdateCustomer {
  user: {
    username: string;
    email: string;
    phone?: number;
    avatar: FileList | null;
  };
  customer: {
    birthday: string;
    gender: Gender | "";
  };
}

function ProfileCustomer() {
  const { user } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [changePhone, setChangePhone] = useState(false);
  const [originalPhone, setOriginalPhone] = useState<number | undefined>(
    undefined
  );
  const [showMessage, setShowMessage] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState<string | null>(null);

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<UpdateCustomer>({
    defaultValues: {
      user: {
        username: "",
        email: "",
        phone: undefined,
        avatar: null,
      },
      customer: {
        birthday: "",
        gender: "",
      },
    },
  });
  const phone = watch("user.phone");
  const avatarFile = watch("user.avatar");

  useEffect(() => {
    if (user) {
      reset({
        user: {
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        customer: {
          birthday: user.customer.birthday,
          gender: user.customer.gender,
        },
      });
      setOriginalPhone(user.phone);
      if (user.avatar) {
        setAvatarUrl(user.avatar);
      }
    }
  }, [user, reset]);

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  const onSubmit = async (data: UpdateCustomer) => {
    try {
      const formData = new FormData();
      formData.append("user[username]", data.user.username);
      formData.append("user[email]", data.user.email);
      if (
        data.user.phone !== undefined &&
        data.user.phone !== null &&
        String(data.user.phone) !== ""
      ) {
        formData.append("user[phone]", String(data.user.phone));
      }

      if (data.customer.gender && String(data.customer.gender) !== "") {
        formData.append("customer[gender]", data.customer.gender);
      }
      formData.append(
        "customer[birthday]",
        new Date(data.customer.birthday).toISOString().split("T")[0]
      );

      if (data.user.avatar && data.user.avatar.length > 0) {
        formData.append("avatar", data.user.avatar[0]);
      }
      for (const a of formData.entries()) {
        console.log(a[0], a[1]);
      }
      const res = (await axiosConfig.patch(
        `/api/v1/user/update-customer/${user?.customer.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )) as any;
      if (res.status) {
        setMessageUpdate(res.message || "Cập nhật thành công!");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 800);
      }
    } catch (error: any) {
      console.log(error);
      setMessageUpdate(error.message || "Cập nhật thất bại!");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 800);
    }
  };

  const handlePhoneSubmit = () => {
    if (phone && /^[0-9]{10,11}$/.test(phone.toString())) {
      setChangePhone(false);
    }
  };

  const handleCloseModal = () => {
    setValue("user.phone", originalPhone);
    setChangePhone(false);
  };

  return (
    <div className="w-full h-full p-[1rem] xs:p-[1.5rem] sm:p-[2rem]">
      <div className="pb-[1.5rem] sm:pb-[1.9rem] border-b border-b-gray-200">
        <h4 className="text-[1.8rem] sm:text-[2rem] text-gray-800">
          Hồ Sơ Của Tôi
        </h4>
        <p className="text-gray-600 text-[1.4rem] mt-1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>
      <div className="flex flex-col lg:flex-row mt-[2rem] sm:mt-[3rem] gap-6 lg:gap-0">
        {/* Form Section */}
        <div className="flex-1 order-2 lg:order-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8 md:space-y-10"
          >
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-[1rem] md:gap-[2rem]">
                <label
                  htmlFor="username"
                  className="block w-full md:w-[14rem] text-start md:text-end text-gray-600"
                >
                  Tên
                </label>
                <input
                  type="text"
                  className="md:flex-1 w-full h-[4rem] pl-[1.5rem] rounded-md border border-gray-300 outline-none text-gray-600"
                  {...register("user.username", {
                    required: "Tên không được để trống",
                  })}
                />
              </div>
              {errors.user?.username && (
                <p className="text-red-500 text-[1.2rem] ml-0 md:ml-[16rem] mt-2">
                  {errors.user.username.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-[1rem] md:gap-[2rem]">
                <label
                  htmlFor="email"
                  className="block w-full md:w-[14rem] text-start md:text-end text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="md:flex-1 w-full h-[4rem] rounded-md border border-gray-300 outline-none pl-[1.5rem] text-gray-600"
                  {...register("user.email", {
                    required: "Email không được để trống",
                  })}
                />
              </div>
              {errors.user?.email && (
                <p className="text-red-500 text-[1.2rem] ml-0 md:ml-[16rem] mt-2">
                  {errors.user.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-[1rem] md:gap-[2rem]">
              <label
                htmlFor="phone"
                className="block w-full md:w-[14rem] text-start md:text-end text-gray-600"
              >
                Số điện thoại
              </label>
              {phone ? (
                <div className="flex items-center gap-[.5rem] flex-wrap">
                  <p className="text-gray-600">{phone}</p>
                  <button
                    type="button"
                    className="px-[1rem] py-[.4rem] rounded-md bg-blue-400 text-[1.2rem] text-white hover:bg-blue-500 hover:underline transition duration-150"
                    onClick={() => setChangePhone(true)}
                  >
                    Đổi
                  </button>
                </div>
              ) : (
                <p
                  className="text-blue-500 hover:text-blue-600 underline cursor-pointer"
                  onClick={() => setChangePhone(true)}
                >
                  Thêm số điện thoại
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-[1rem] md:gap-[2rem]">
              <label
                htmlFor="gender"
                className="block w-full md:w-[14rem] text-start md:text-end text-gray-600"
              >
                Giới tính
              </label>
              <div className="flex items-center gap-[1.5rem] sm:gap-[2rem] text-gray-600">
                <div className="flex items-center gap-[.5rem]">
                  <input
                    type="radio"
                    value={"male"}
                    id="male"
                    {...register("customer.gender")}
                  />
                  <label htmlFor="male">Nam</label>
                </div>
                <div className="flex items-center gap-[.5rem]">
                  <input
                    type="radio"
                    value={"female"}
                    id="female"
                    {...register("customer.gender")}
                  />
                  <label htmlFor="female">Nữ</label>
                </div>
              </div>
            </div>

            {/* Birthday */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-[1rem] md:gap-[2rem]">
              <label
                htmlFor="birthday"
                className="block w-full md:w-[14rem] text-start md:text-end text-gray-600"
              >
                Ngày sinh
              </label>
              <input
                type="date"
                id="birthday"
                className="w-full md:w-[20rem] h-[4rem] rounded-md border border-gray-300 outline-none pl-[1.5rem] text-gray-600"
                {...register("customer.birthday")}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-start md:justify-end pt-4">
              <button
                className="w-full sm:w-auto px-[2rem] py-[.8rem] rounded-md bg-red-500 hover:bg-red-600 text-white transition duration-150 cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>

        {/* Avatar Section */}
        <div className="w-full lg:w-[30rem] h-auto pl-0 lg:pl-[4rem] ml-0 lg:ml-[4rem] border-l-0 lg:border-l border-l-gray-300 mb-[2rem] lg:mb-0 order-1 lg:order-2">
          <div className="flex items-center justify-center flex-col">
            {avatarUrl ? (
              <div className="w-[12rem] h-[12rem] sm:w-[14rem] sm:h-[14rem] rounded-full flex items-center justify-center">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-[10rem] h-[10rem] sm:w-[12rem] sm:h-[12rem] rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-[3rem] sm:text-[4rem] text-gray-400"
                />
              </div>
            )}
            <label
              htmlFor="avatar"
              className="flex items-center justify-center w-[12rem] h-[3.8rem] rounded-md border border-gray-300 cursor-pointer mt-[2rem] text-gray-600 hover:bg-gray-50 transition duration-150"
            >
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                {...register("user.avatar")}
              />
              Chọn ảnh
            </label>
          </div>
        </div>
      </div>

      {/* Change Phone Modal */}
      <MotionWrapper
        open={changePhone}
        className="relative w-[90vw] sm:w-[32rem] md:w-2xl max-w-[90vw] min-h-[18rem] bg-white rounded-md p-[1.5rem] sm:p-[2rem]"
      >
        <div
          className="absolute top-[1rem] right-[1rem] cursor-pointer w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
          onClick={() => handleCloseModal()}
        >
          <FontAwesomeIcon
            icon={faClose}
            className="text-gray-600 hover:text-gray-800 text-[1.6rem]"
          />
        </div>
        <h3 className="text-gray-600 text-[1.6rem] sm:text-[1.8rem]">
          Thay đổi số điện thoại
        </h3>
        <div className="mt-[2rem]">
          <input
            type="number"
            className="w-full h-[4rem] rounded-md border border-gray-300 outline-none pl-[1.5rem] text-gray-600"
            placeholder="Nhập số điện thoại"
            {...register("user.phone", {
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            })}
          />
          {errors.user?.phone && (
            <p className="text-red-500 text-[1.2rem] mt-2">
              {errors.user.phone.message}
            </p>
          )}
        </div>
        <button
          className={`block mt-[2rem] w-full sm:w-[10rem] h-[4rem] ${
            phone && /^[0-9]{10,11}$/.test(phone.toString())
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-red-400 text-gray-200 cursor-not-allowed"
          } rounded-lg transition duration-150 ml-auto`}
          disabled={!phone || !/^[0-9]{10,11}$/.test(phone.toString())}
          onClick={handlePhoneSubmit}
        >
          Tiếp theo
        </button>
      </MotionWrapper>

      {/* Success Message Modal */}
      <MotionWrapper
        open={showMessage}
        className="relative w-[90vw] sm:w-[30rem] max-w-[90vw] min-h-[15rem] bg-white rounded-md p-[2rem] sm:p-[3rem] shadow-lg"
      >
        <div className="flex flex-col items-center justify-center gap-[1.5rem]">
          <div className="w-[5rem] h-[5rem] rounded-full bg-green-500 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-white text-[3rem]"
            />
          </div>
          <h3 className="text-[1.6rem] text-gray-800 text-center">
            {messageUpdate}
          </h3>
        </div>
      </MotionWrapper>
    </div>
  );
}

export default ProfileCustomer;
