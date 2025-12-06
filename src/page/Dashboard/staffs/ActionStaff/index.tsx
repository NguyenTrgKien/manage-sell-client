import { faAdd, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Gender, StaffPosition, UserRole } from "@my-project/shared";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import MotionWrapper from "../../../../components/ui/MotionWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import { addStaffSchema } from "./addStaffSchema";
import { toast } from "react-toastify";
import axiosConfig from "../../../../configs/axiosConfig";
import { getStaffPosition } from "../../../../configs/staffEnumConfig";
import type { StaffType } from "../../../../utils/userType";
import Loading from "../../../../components/Loading";

interface AddStaffProp {
  actionStaff: {
    open: boolean;
    data: StaffType | null;
    action: "add" | "edit";
  };
  setActionStaff: Dispatch<
    SetStateAction<{
      open: boolean;
      data: StaffType | null;
      action: "add" | "edit";
    }>
  >;
  dataUpdate: StaffType | null;
  refetch: () => Promise<any>;
}

interface AddStaffForm {
  user: {
    username: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
  };
  gender: Gender;
  birthday: string;
  salary: number;
  startDate: string;
  position: StaffPosition;
  avatar?: File;
}

function ActionStaff({
  actionStaff,
  setActionStaff,
  dataUpdate,
  refetch,
}: AddStaffProp) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<AddStaffForm>({
    resolver: yupResolver(addStaffSchema(actionStaff.action === "edit")),
    defaultValues: {
      user: {
        username: "",
        email: "",
        password: "",
        phone: "",
        role: UserRole.STAFF,
      },
      gender: Gender.MALE,
      birthday: "",
      salary: 0,
      startDate: "",
      position: StaffPosition.SALE,
      avatar: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (actionStaff.open) {
      if (actionStaff.action === "add") {
        reset({
          user: {
            username: "",
            email: "",
            password: "",
            phone: "",
            role: UserRole.STAFF,
          },
          gender: Gender.MALE,
          birthday: "",
          salary: 0,
          startDate: "",
          position: StaffPosition.SALE,
          avatar: undefined,
        });
        setAvatarUrl(null);
      } else if (dataUpdate && actionStaff.action === "edit") {
        reset({
          user: {
            username: dataUpdate.user.username,
            email: dataUpdate.user.email,
            phone: dataUpdate.user.phone,
            role: dataUpdate.user.role,
          },
          gender: dataUpdate.gender,
          birthday: dataUpdate.birthday
            ? new Date(dataUpdate.birthday).toISOString().split("T")[0]
            : "",
          salary: dataUpdate.salary || 0,
          startDate: dataUpdate.startDate
            ? new Date(dataUpdate.startDate).toISOString().split("T")[0]
            : "",
          position: dataUpdate.position,
        });
        if (dataUpdate.user.avatar) {
          setAvatarUrl(dataUpdate.user.avatar || null);
        }
      }
    }
  }, [actionStaff.action, actionStaff.open, dataUpdate, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file, { shouldValidate: true });

      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const onSubmit = async (data: AddStaffForm) => {
    const formattedData = {
      ...data,
      salary: Number(data.salary),
      birthday: data.birthday,
      startDate: new Date(data.startDate).toISOString().split("T")[0],
    };
    console.log(formattedData);

    try {
      const endpoint =
        actionStaff.action === "add"
          ? "/api/v1/staff/create"
          : `/api/v1/staff/update/${actionStaff.data?.id}`;
      let res = null;
      if (actionStaff.action === "add") {
        res = (await axiosConfig.post(endpoint, formattedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })) as any;
      } else {
        res = await axiosConfig.patch(endpoint, formattedData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status) {
        toast.success(
          res.message ||
            `${actionStaff?.action === "add" ? "Thêm" : "Cập nhật"} nhân viên thành công!`
        );
        setActionStaff({ open: false, action: "add", data: null });
        reset();
        await refetch();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.message ||
          `Lỗi không thể ${actionStaff?.action === "add" ? "thêm" : "cập nhật"} nhân viên`
      );
    }
  };

  const handleClose = () => {
    reset();
    setAvatarUrl(null);
    setActionStaff({ open: false, data: null, action: "add" });
  };

  return (
    <MotionWrapper
      open={actionStaff.open}
      className="relative w-[100rem] h-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <h3 className={` text-[2rem] text-center font-semibold text-green-600`}>
        {actionStaff.action === "edit"
          ? "Cập nhật nhân viên"
          : "Thêm nhân viên"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full max-h-[50rem] overflow-auto hide-scrollbar flex gap-[2.5rem] mt-[4rem]">
          <div className="w-[25rem] h-auto rounded-xl flex flex-col items-center justify-start">
            <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem]">
              Ảnh nhân viên
            </h3>

            <label
              htmlFor="avatar"
              className={`w-[15rem] h-[15rem] flex items-center justify-center rounded-xl border-[.2rem] border-dashed ${avatarUrl ? "border-cyan-500" : "border-gray-500"} cursor-pointer`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAdd}
                  className="text-gray-500 text-[2.2rem]"
                />
              )}
              <input
                type="file"
                className="hidden"
                id="avatar"
                onChange={handleFileChange}
              />
            </label>
            {errors.avatar && (
              <span className="text-red-500 text-limit-1 text-[1.4rem] mt-[.5rem]">
                {errors.avatar.message}
              </span>
            )}
          </div>
          <div className="flex-1 border-l border-l-gray-300 pl-[2rem]">
            <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem]">
              Thông tin nhân viên
            </h3>
            <div className="flex items-start gap-[2rem]">
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="staffName">
                  Tên nhân viên
                </label>
                <input
                  type="text"
                  id="staffName"
                  placeholder="Nhập tên..."
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none"
                  {...register("user.username")}
                />
                {errors.user?.username && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.user.username.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email..."
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none"
                  {...register("user.email")}
                />
                {errors.user?.email && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.user.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-[2rem] mt-[2rem]">
              {actionStaff.action === "add" && (
                <div className="flex flex-col w-full">
                  <label className="text-gray-600" htmlFor="password">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu..."
                    className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none"
                    {...register("user.password")}
                  />
                  {errors.user?.password && (
                    <span className="text-red-500 text-limit-1 text-[1.4rem]">
                      {errors.user.password.message}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Nhập số điện thoại..."
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none"
                  {...register("user.phone")}
                />
                {errors.user?.phone && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.user.phone.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-[2rem] mt-[2rem]">
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="gender">
                  Giới tính
                </label>
                <select
                  id="gender"
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none text-gray-600"
                  {...register("gender")}
                >
                  <option value={Gender.MALE}>Nam</option>
                  <option value={Gender.FEMALE}>Nữ</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.gender.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="birthday">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="birthday"
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none text-gray-600"
                  {...register("birthday")}
                />
                {errors.birthday && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.birthday.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-[2rem] mt-[2rem]">
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="salary">
                  Lương
                </label>
                <input
                  type="number"
                  id="salary"
                  placeholder="Nhập lương..."
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none"
                  {...register("salary")}
                />
                {errors.salary && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.salary.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="startDate">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none text-gray-600"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.startDate.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-[2rem] mt-[2rem]">
              <div className="flex flex-col w-full">
                <label className="text-gray-600" htmlFor="position">
                  Vị trí
                </label>
                <select
                  id="position"
                  className="w-full h-[4rem] border border-gray-300 rounded-lg px-[1.5rem] mt-[.5rem] outline-none text-gray-600"
                  {...register("position")}
                >
                  {Object.entries(getStaffPosition).map(
                    ([key, value], index) => {
                      return (
                        <option key={index} value={key}>
                          {value}
                        </option>
                      );
                    }
                  )}
                </select>
                {errors.position && (
                  <span className="text-red-500 text-limit-1 text-[1.4rem]">
                    {errors.position.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-[4rem] gap-[1rem]">
          <button
            className="px-[2rem] py-[.5rem] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 hover-linear"
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            className="px-[2rem] py-[.5rem] rounded-lg bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white hover-linear"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : actionStaff.action === "edit"
                ? "Cập nhật"
                : "Thêm"}
          </button>
        </div>
      </form>
      {isSubmitting && <Loading />}
    </MotionWrapper>
  );
}

export default ActionStaff;
