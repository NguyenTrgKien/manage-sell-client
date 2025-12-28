import {
  faArrowLeft,
  faCirclePlus,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VoucherStatus, VoucherType } from "@nguyentrungkien/shared";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { getVouchers } from "../../../api/voucher.api";
import type { VoucherT } from "../../../utils/voucher.type";
import dayjs from "dayjs";
import ToggleVoucher from "./ToggleVoucher";
import DetailVoucher from "./DetailVoucher";

interface DiscountForm {
  id?: number;
  name: string;
  value: number;
  type: VoucherType;
  maxDiscount?: number;
  minOrderValue?: number;
  endDate: string;
  usageLimit?: number;
}

function Discount() {
  const [actionVoucher, setActionVoucher] = useState<{
    open: boolean;
    data: VoucherT | null;
    action: "edit" | "create";
  }>({
    open: false,
    data: null,
    action: "create",
  });
  const [toggleVoucher, setToggleVoucher] = useState<{
    open: boolean;
    data: VoucherT | null;
  }>({ open: false, data: null });
  const [queryInput, setQueryInput] = useState({
    name: "",
    voucherCode: "",
    status: null as VoucherStatus | null,
  });
  const [detailVoucher, setDetailVoucher] = useState<{
    open: boolean;
    dataDetail: VoucherT | null;
  }>({
    open: false,
    dataDetail: null,
  });
  const {
    data: voucherData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vouchers", queryInput],
    queryFn: () => getVouchers(queryInput),
  });
  const vouchers = voucherData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<DiscountForm>();

  const typeVoucher = watch("type");

  useEffect(() => {
    if (actionVoucher.data && actionVoucher.action === "edit") {
      reset({
        id: actionVoucher.data.id,
        name: actionVoucher.data.name,
        value: actionVoucher.data.value,
        type: actionVoucher.data.type,
        maxDiscount: actionVoucher.data.maxDiscount || undefined,
        minOrderValue: actionVoucher.data.minOrderValue || undefined,
        endDate: dayjs(actionVoucher.data.endDate).format("YYYY-MM-DD"),
        usageLimit: actionVoucher.data.usageLimit || undefined,
      });
    }
  }, [actionVoucher, reset]);

  const onSubmit = async (data: DiscountForm) => {
    try {
      const payload = {
        name: data.name,
        type: data.type,
        value: data.value,
        maxDiscount: data.maxDiscount || 0,
        minOrderValue: data.minOrderValue || 0,
        endDate: new Date(data.endDate).toISOString(),
        usageLimit: data.usageLimit || 0,
      };

      let res: any = null;
      if (actionVoucher.action === "create") {
        res = await axiosConfig.post("/api/v1/voucher/createGlobal", payload);
      } else {
        res = await axiosConfig.patch(
          `/api/v1/voucher/updateGlobal/${data.id}`,
          payload
        );
      }

      if (res.status) {
        toast.success(res.message);
        refetch();
        reset();
        setActionVoucher({
          open: false,
          data: null,
          action: "create",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo voucher"
      );
    }
  };

  const handleFilter = () => {
    refetch();
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQueryInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="flex justify-between items-center border-b-[.1rem] border-b-gray-300 pb-[2rem]">
        <h3 className="text-[2rem] font-semibold text-gray-600">
          Quản lý Voucher toàn cục
        </h3>
        <div className="flex items-center gap-[1.5rem]">
          <button
            onClick={() =>
              setActionVoucher({
                open: true,
                data: null,
                action: "create",
              })
            }
            className="text-white text-[1.4rem] flex gap-2 items-center px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Tạo voucher toàn cục
          </button>
        </div>
      </div>

      <div className="mt-[2rem]">
        {actionVoucher.open ? (
          <>
            <button
              onClick={() => {
                reset({
                  name: "",
                  value: undefined,
                  type: undefined as any,
                  maxDiscount: undefined,
                  minOrderValue: undefined,
                  endDate: "",
                  usageLimit: undefined,
                });
                setActionVoucher({
                  open: false,
                  data: null,
                  action: "create",
                });
              }}
              className="text-[1.4rem] text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Quay lại danh sách
            </button>

            <h4 className="text-[1.8rem] font-semibold mb-6">
              Tạo Voucher Toàn Cục
            </h4>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="border border-gray-300 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block mb-2">Tên voucher *</label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Vui lòng nhập tên voucher",
                      })}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                      placeholder="VD: Giảm 50k cho đơn từ 300k"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">Loại giảm giá *</label>
                    <select
                      {...register("type", { required: "Vui lòng chọn loại" })}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                    >
                      <option value="">-- Chọn loại --</option>
                      <option value={VoucherType.PERCENT}>
                        Giảm theo phần trăm
                      </option>
                      <option value={VoucherType.FIXED}>
                        Giảm giá cố định
                      </option>
                    </select>
                    {errors.type && (
                      <span className="text-red-500 text-sm">
                        {errors.type.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">Giá trị giảm *</label>
                    <input
                      type="number"
                      {...register("value", {
                        required: "Vui lòng nhập giá trị",
                        min: { value: 1, message: "Giá trị phải ≥ 1" },
                        max:
                          typeVoucher === VoucherType.PERCENT
                            ? { value: 100, message: "Tối đa 100%" }
                            : undefined,
                      })}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 focus:border-blue-500 outline-none"
                      placeholder={
                        typeVoucher === VoucherType.PERCENT
                          ? "VD: 20"
                          : "VD: 50000"
                      }
                    />
                    {errors.value && (
                      <span className="text-red-500 text-sm">
                        {errors.value.message}
                      </span>
                    )}
                  </div>

                  {typeVoucher === VoucherType.PERCENT && (
                    <div>
                      <label className="block mb-2">Giảm tối đa (VNĐ)</label>
                      <input
                        type="number"
                        {...register("maxDiscount")}
                        className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                        placeholder="VD: 100000"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-2">Đơn tối thiểu (VNĐ)</label>
                    <input
                      type="number"
                      {...register("minOrderValue")}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                      placeholder="0 = không giới hạn"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Ngày hết hạn *</label>
                    <input
                      type="date"
                      {...register("endDate", {
                        required: "Vui lòng chọn ngày",
                      })}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                    />
                    {errors.endDate && (
                      <span className="text-red-500 text-sm">
                        {errors.endDate.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">
                      Giới hạn sử dụng (tổng)
                    </label>
                    <input
                      type="number"
                      {...register("usageLimit")}
                      className="w-full h-[4rem] rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500"
                      placeholder="0 = không giới hạn"
                    />
                  </div>
                  <input type="number" hidden {...register("id")} />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setActionVoucher({
                      open: false,
                      data: null,
                      action: "create",
                    });
                    reset();
                  }}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Đang xử lý..." : "Tạo voucher toàn cục"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 mb-8">
              <input
                type="text"
                name="name"
                value={queryInput.name}
                placeholder="Tìm theo tên voucher..."
                className="w-80 h-[4rem] rounded-md border border-gray-300 px-4 outline-none"
                onChange={handleChangeInput}
              />
              <input
                type="text"
                name="voucherCode"
                value={queryInput.voucherCode}
                placeholder="Tìm theo mã voucher..."
                className="w-80 h-[4rem] rounded-md border border-gray-300 px-4 outline-none"
                onChange={handleChangeInput}
              />
              <select
                name="status"
                value={queryInput.status ?? ""}
                className="w-64 h-[4rem] rounded-md border border-gray-300 px-4 outline-none"
                onChange={handleChangeInput}
              >
                <option value="">-- Tất cả trạng thái --</option>
                <option value={VoucherStatus.ACTIVE}>Hoạt động</option>
                <option value={VoucherStatus.INACTIVE}>Đã dừng</option>
              </select>
              <button
                onClick={handleFilter}
                className="px-8 h-[4rem] rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                Lọc
              </button>
            </div>

            <table className="w-full table-auto text-[1.4rem] rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-4">Tên voucher</th>
                  <th className="text-left px-6 py-4">Loại giảm</th>
                  <th className="text-left px-6 py-4">Hết hạn</th>
                  <th className="text-center px-6 py-4">Trạng thái</th>
                  <th className="text-center px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Đang tải...
                    </td>
                  </tr>
                ) : vouchers.length > 0 ? (
                  vouchers.map((voucher: VoucherT) => (
                    <tr key={voucher.id} className="border-b border-b-gray-300">
                      <td className="px-6 py-4">{voucher.name}</td>
                      <td className="px-6 py-4">
                        {voucher.type === VoucherType.PERCENT
                          ? "Phần trăm"
                          : "Giá cố định"}
                      </td>
                      <td className="px-6 py-4">
                        {dayjs(voucher.endDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-6 py-1.5 rounded-full ${
                            voucher.status === VoucherStatus.ACTIVE
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {voucher.status === VoucherStatus.ACTIVE
                            ? "Hoạt động"
                            : "Đã dừng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setToggleVoucher({ open: true, data: voucher });
                            }}
                            className={`px-6 py-1.5 rounded-md ${
                              voucher.status === VoucherStatus.ACTIVE
                                ? "bg-gray-200 hover:bg-gray-300"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {voucher.status === VoucherStatus.ACTIVE
                              ? "Tắt"
                              : "Bật"}
                          </button>
                          <button
                            className="px-6 py-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                            onClick={() => {
                              setActionVoucher({
                                open: true,
                                data: voucher,
                                action: "edit",
                              });
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="px-6 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={() => {
                              setDetailVoucher({
                                open: true,
                                dataDetail: voucher,
                              });
                            }}
                          >
                            Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Không có voucher nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <ToggleVoucher
        open={toggleVoucher.open}
        onClose={() => {
          setToggleVoucher({ open: false, data: null });
        }}
        data={toggleVoucher.data}
        refetch={refetch}
      />

      <DetailVoucher
        open={detailVoucher.open}
        dataDetail={detailVoucher.dataDetail}
        onClose={() =>
          setDetailVoucher({
            open: false,
            dataDetail: null,
          })
        }
      />
    </div>
  );
}

export default Discount;
