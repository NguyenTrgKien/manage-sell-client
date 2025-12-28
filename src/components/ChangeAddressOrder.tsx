import { Controller, useForm } from "react-hook-form";
import MotionWrapper from "./ui/MotionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import type { AddressForm } from "./ActionAddress";
import Select from "react-select";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProvince } from "../api/province.api";
import { useEffect } from "react";
import axiosConfig from "../configs/axiosConfig";
import { toast } from "react-toastify";

interface ChangeAddressOrderProp {
  open: boolean;
  onClose: () => void;
  dataChange: AddressForm & { orderCode?: string };
  refetchOrder: () => Promise<UseQueryResult<any>>;
}

function ChangeAddressOrder({
  open,
  onClose,
  dataChange,
  refetchOrder,
}: ChangeAddressOrderProp) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AddressForm & { orderCode?: string }>({
    defaultValues: {
      province: "",
      district: "",
      ward: "",
      recipentName: "",
      addressDetail: "",
      phone: "",
      orderCode: "",
    },
  });

  useEffect(() => {
    if (dataChange) {
      const data = dataChange;
      reset({
        province: data.province,
        district: data.district,
        ward: data.ward,
        recipentName: data.recipentName,
        addressDetail: data.addressDetail,
        phone: data.phone,
        orderCode: data.orderCode,
      });
    }
  }, [dataChange, reset]);

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

  const onSubmit = async (data: AddressForm & { orderCode?: string }) => {
    const dataUpdate = {
      customerName: data.recipentName,
      customerAddress: data.addressDetail,
      customerPhone: data.phone,
      customerProvince: data.province,
      customerDistrict: data.district,
      customerWard: data.ward,
    };
    try {
      const res = (await axiosConfig.patch(
        `/api/v1/orders/change-address/${data.orderCode}`,
        dataUpdate
      )) as any;

      if (res.status) {
        await refetchOrder();
        toast.success(res.message);
        reset({
          province: "",
          district: "",
          ward: "",
          recipentName: "",
          addressDetail: "",
          phone: "",
          orderCode: "",
        });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] min-h-[20rem] rounded-lg bg-white p-[2rem]"
    >
      <h2 className="text-[2rem] text-amber-600 mb-[2.5rem] font-bold text-center">
        Thay đổi địa chỉ
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

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="mt-[2rem] flex items-center gap-[1rem] justify-end">
          <button
            type="button"
            className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
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
            {isSubmitting ? "Đang xử lý..." : "Thay đổi"}
          </button>
        </div>
      </form>
    </MotionWrapper>
  );
}

export default ChangeAddressOrder;
