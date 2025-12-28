import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "./ui/MotionWrapper";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import { getProvince } from "../api/province.api";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../configs/axiosConfig";
import { toast } from "react-toastify";
import Select from "react-select";
import { useEffect } from "react";
import type { AddressType } from "../utils/userType";
import { useUser } from "../hooks/useUser";

interface ActionAddressProp {
  openActionAddress: {
    open: boolean;
    dataUpdate: AddressType | any;
    action: "edit" | "add";
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export interface AddressForm {
  province: string;
  district: string;
  ward: string;
  recipentName: string;
  addressDetail: string;
  isDefault: boolean;
  phone: string;
}

function ActionAddress({
  openActionAddress,
  onClose,
  onSuccess,
}: ActionAddressProp) {
  const { user } = useUser();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AddressForm>({
    defaultValues: {
      province: "",
      district: "",
      ward: "",
      recipentName: "",
      addressDetail: "",
      phone: "",
      isDefault: false,
    },
  });
  useEffect(() => {
    if (openActionAddress.action === "edit" && openActionAddress.dataUpdate) {
      const data = openActionAddress.dataUpdate;
      reset({
        province: data.province,
        district: data.district,
        ward: data.ward,
        recipentName: data.recipentName,
        addressDetail: data.addressDetail,
        phone: data.phone,
        isDefault: data.isDefault,
      });
    }
  }, [openActionAddress.action, openActionAddress.dataUpdate, reset]);

  const { data: dataProvinces } = useQuery({
    queryKey: ["province"],
    queryFn: getProvince,
  });
  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");
  const province = dataProvinces?.find((p) => p.name === selectedProvince);
  const districts = province?.districts ?? [];

  const district = districts.find((d) => d.name === selectedDistrict);
  const wards = district?.wards ?? [];

  const provinceOptions = dataProvinces?.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  const districtOptions = districts?.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  const wardOptions = wards?.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  const onSubmit = async (data: AddressForm) => {
    try {
      let res = null;
      if (!user) {
        const address = {
          ...data,
        };

        localStorage.setItem("guest_address", JSON.stringify(address));
        window.dispatchEvent(
          new CustomEvent("guest_address_updated", {
            detail: { action: "added", address },
          })
        );
        onClose();
        onSuccess?.();
      } else {
        const isUpdata =
          openActionAddress.action === "edit" && openActionAddress.dataUpdate;
        if (isUpdata) {
          res = await axiosConfig.patch(
            `/api/v1/address/update/${openActionAddress.dataUpdate.id}`,
            data
          );
        } else {
          res = await axiosConfig.post("/api/v1/address/add", {
            ...data,
          });
        }
        if (res.status) {
          reset({
            province: "",
            district: "",
            ward: "",
            recipentName: "",
            addressDetail: "",
            phone: "",
            isDefault: false,
          });
          onClose();
          onSuccess?.();
          return;
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onCloseAndReset = () => {
    reset({
      province: "",
      district: "",
      ward: "",
      recipentName: "",
      addressDetail: "",
      phone: "",
      isDefault: false,
    });
    onClose();
  };

  return (
    <MotionWrapper
      open={openActionAddress.open}
      className="relative w-[60rem] min-h-[20rem] rounded-lg bg-white p-[2rem]"
    >
      <h2 className="text-[2rem] text-gray-600 mb-[2.5rem] font-bold text-center">
        {openActionAddress.action === "add" && !openActionAddress.dataUpdate
          ? "Thêm địa chỉ"
          : "Cập nhật địa chỉ"}
      </h2>
      <div
        className="absolute top-[1rem] right-[1rem]"
        onClick={(e) => {
          e.stopPropagation();
          onCloseAndReset();
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </div>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <div className=" flex items-start gap-[2rem]">
          <div className="w-full space-y-6">
            <div className="w-full flex items-start gap-[2rem]">
              <div className="w-full space-y-1">
                <label htmlFor="recipentName" className="block text-gray-600">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  className="w-full h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
                  {...register("recipentName", {
                    required: "Vui lòng nhập họ tên!",
                  })}
                />
                {errors.recipentName && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.recipentName.message}
                  </span>
                )}
              </div>
              <div className="w-full space-y-1">
                <label htmlFor="phone" className="block text-gray-600">
                  Số điện thoại
                </label>
                <input
                  type="number"
                  placeholder="sđt *"
                  className="w-full h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại!",
                  })}
                />
                {errors.phone && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
            <label className="text-gray-600">Địa chỉ</label>
            <div className="flex items-start gap-[2rem] mt-[.5rem]">
              <div className="flex-1">
                <>
                  <Controller
                    control={control}
                    name="province"
                    rules={{ required: "Vui lòng chọn tỉnh" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={provinceOptions}
                        placeholder="Tỉnh..."
                        isSearchable
                        value={
                          provinceOptions?.find(
                            (opt) => opt.value === field.value
                          ) || null
                        }
                        onChange={(option) => {
                          field.onChange(option?.value);
                          setValue("district", "");
                          setValue("ward", "");
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: "4rem",
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "cyan", // override màu focus mặc định
                          },
                        })}
                      />
                    )}
                  />
                  {errors.province && (
                    <span className="text-red-500 text-[1.4rem]">
                      {errors.province.message}
                    </span>
                  )}
                </>
              </div>
              <div className="flex-1">
                <>
                  <Controller
                    control={control}
                    name="district"
                    rules={{ required: "Vui lòng chọn huyện" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={districtOptions}
                        placeholder="Huyện..."
                        isSearchable
                        value={
                          districtOptions?.find(
                            (opt) => opt.value === field.value
                          ) || null
                        }
                        onChange={(option) => {
                          field.onChange(option?.value);
                          setValue("ward", "");
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: "4rem",
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "cyan", // override màu focus mặc định
                          },
                        })}
                      />
                    )}
                  />
                  {errors.district && (
                    <span className="text-red-500 text-[1.4rem]">
                      {errors.district.message}
                    </span>
                  )}
                </>
              </div>
              <div className="flex-1">
                <>
                  <Controller
                    control={control}
                    name="ward"
                    rules={{ required: "Vui lòng chọn phường" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={wardOptions}
                        placeholder="Phường..."
                        isSearchable
                        value={
                          wardOptions?.find(
                            (opt) => opt.value === field.value
                          ) || null
                        }
                        onChange={(option) => {
                          field.onChange(option?.value);
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: "4rem",
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "cyan",
                          },
                        })}
                      />
                    )}
                  />
                  {errors.ward && (
                    <span className="text-red-500 text-[1.4rem]">
                      {errors.ward.message}
                    </span>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-[2rem]">
          <label htmlFor="addressDetail" className="text-gray-600">
            Địa chỉ cụ thể
          </label>
          <textarea
            id="addressDetail"
            rows={2}
            placeholder="..."
            disabled={
              watch("province") === "" ||
              watch("district") === "" ||
              watch("ward") === ""
            }
            className="w-full pt-[1rem] rounded-lg border border-gray-300 outline-none px-[1.5rem] focus:border-[.1rem] focus:border-cyan-300 mt-[.5rem]"
            {...register("addressDetail", {
              required: "Vui lòng nhập địa chỉ cụ thể!",
            })}
          />
          {errors.addressDetail && (
            <span className="text-red-500 text-[1.4rem]">
              {errors.addressDetail.message}
            </span>
          )}
        </div>
        {user && (
          <label
            htmlFor="isDefault"
            className="flex items-center w-[11rem] gap-[1rem] mt-[1.5rem]"
          >
            <span className="select-none text-gray-600">Mặc định</span>
            <div className="relative inline-block w-12 h-6">
              <input
                id="isDefault"
                type="checkbox"
                className="peer hidden"
                {...register("isDefault")}
                disabled={watch("addressDetail") === ""}
              />
              <div className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
            </div>
          </label>
        )}
        <div className="mt-[2rem] flex items-center gap-[1rem] justify-end">
          <button
            type="button"
            className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onCloseAndReset();
            }}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-[2rem] py-[.5rem] rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : openActionAddress.action === "edit"
                ? "Lưu"
                : "Thêm"}
          </button>
        </div>
      </form>
    </MotionWrapper>
  );
}

export default ActionAddress;
