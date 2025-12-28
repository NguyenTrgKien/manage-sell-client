import { useState, type Dispatch, type SetStateAction } from "react";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faMinus,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import { PaymentMethod } from "@nguyentrungkien/shared";
import { orderSchema } from "./orderSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProvince } from "../../../../../api/province.api";
import Select from "react-select";
import ModalProduct from "../../components/ModalProduct";
import { getProduct } from "../../../../../api/product.api";
import type { ProductT, VariantsType } from "../../../../../utils/types";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";

interface AddOrderProp {
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<UseQueryResult<any>>;
}

export interface OrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerProvince: string;
  customerDistrict: string;
  customerWard: string;
  customerNote: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  orderItems: orderItemsForm[];
}

export interface orderItemsForm {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
}

function AddOrder({ open, onClose, refetch }: AddOrderProp) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderForm>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerProvince: "",
      customerDistrict: "",
      customerWard: "",
      customerNote: "",
      paymentMethod: PaymentMethod.COD,
      couponCode: "",
      orderItems: [],
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { data: dataProvinces } = useQuery({
    queryKey: ["province"],
    queryFn: getProvince,
  });
  const [filterProduct, setFilterProduct] = useState<{
    page: number;
    limit: number;
    productName: "";
    categoryId: number | undefined;
  }>({
    page: 1,
    limit: 20,
    productName: "",
    categoryId: undefined,
  });
  const { data: products } = useQuery({
    queryKey: ["products", filterProduct],
    queryFn: getProduct,
  });
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const selectedProvince = watch("customerProvince");
  const selectedDistrict = watch("customerDistrict");
  const selectorderItems = watch("orderItems");

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

  const calculateTotal = () => {
    return selectorderItems.reduce((total, item) => {
      const product = products?.find(
        (p: ProductT) => p.id === item.productId
      ) as ProductT;
      const variant = product?.variants.find(
        (v: VariantsType) => v.id === item.variantId
      );
      const price = variant?.price ?? product?.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  };
  const totalAmount = calculateTotal();

  const onSubmit = async (data: OrderForm) => {
    try {
      const res = (await axiosConfig.post(
        "/api/v1/orders/create",
        data
      )) as any;
      if (res.status) {
        toast.success(res.message || "Tạo đơn hàng thành công");
        await refetch();
        onClose();
      } else {
        toast.error(res.message || "Tạo đơn hàng thất bại");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Lỗi không thể đặt hàng! ");
    }
  };

  const handleChangeQuantity = (index: number, type: "incre" | "decre") => {
    const items = [...selectorderItems];
    const current = items[index];
    if (type === "decre") {
      if (current.quantity > 1) {
        current.quantity -= 1;
      }
    } else {
      current.quantity += 1;
    }
    setValue("orderItems", items, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveItem = (index: number) => {
    const neworderItems = selectorderItems.filter((_, i) => i !== index);
    setValue("orderItems", neworderItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <MotionWrapper
      open={open}
      className="relative w-[80%] h-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          onClose();
          reset();
        }}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <h2
        className={`text-[2rem] text-green-600 text-center font-semibold mb-[3rem]`}
      >
        Tạo đơn hàng
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-h-[55rem] overflow-auto">
          <div className="w-[45%] pr-[2rem]">
            <h3 className="text-[1.8rem] text-gray-600 font-semibold mb-[1.5rem]">
              Thông tin sản phẩm
            </h3>
            <label className="text-gray-600">Thêm sản phẩm</label>
            <div
              className="w-full h-[10rem] mt-[.5rem] flex flex-col items-center justify-center border-[.3rem] border-gray-300 border-dashed rounded-xl text-gray-600 cursor-pointer"
              onClick={() => setOpenModalProduct(true)}
            >
              <FontAwesomeIcon
                icon={faAdd}
                className="text-[2rem] text-gray-500"
              />
              <span>Thêm sản phẩm</span>
            </div>
            {errors.orderItems && (
              <span className="text-red-500 text-[1.4rem]">
                {errors.orderItems.message}
              </span>
            )}
            <label className="block text-gray-600 mt-[2rem]">
              Sản phẩm đã chọn ({selectorderItems.length})
            </label>
            {selectorderItems.length === 0 && (
              <div className="p-[1.5rem] text-gray-500 text-center">
                Chưa có sản phẩm nào
              </div>
            )}
            <div className="mt-[1rem] w-full max-h-[30rem] overflow-x-auto">
              <div className="min-w-[48rem] space-y-2">
                {selectorderItems.map((item, index) => {
                  const product = products.find(
                    (it: ProductT) => it.id === item.productId
                  ) as ProductT;
                  const variant = product.variants.find(
                    (v: VariantsType) => v.id === item.variantId
                  );
                  const price = variant?.price ?? product.price;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 p-3 border border-gray-300 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-[1rem] min-w-[18rem]">
                        <img
                          src={product.mainImage}
                          alt={`main image ${product.productName}`}
                          className="w-[4rem] h-[4rem] rounded-md object-cover"
                        />
                        <div className="max-w-[15rem]">
                          <h5 className="text-gray-800 text-[1.4rem] text-limit-1">
                            {product.productName}
                          </h5>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-[1rem] pr-[.5rem] border-r border-gray-500">
                              Size: {variant?.variantSize.name}
                            </span>
                            <span className="text-gray-500 text-[1rem] pr-[.5rem] pl-[.5rem]">
                              Màu: {variant?.variantColor.name}
                            </span>
                          </div>
                          <span className="text-[1.2rem] text-green-800 ">
                            {Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(price)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-[.5rem] min-w-[8rem]">
                        <span
                          className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-lg border border-gray-300 bg-gray-200 cursor-pointer"
                          onClick={() => handleChangeQuantity(index, "decre")}
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="text-[1rem]"
                          />
                        </span>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          name={`quantity-${index}`}
                          value={item.quantity}
                          className="w-[3.5rem] h-[2.5rem] rounded-lg border border-gray-300 outline-none text-[1rem] pl-[.5rem]"
                        />
                        <span
                          className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-lg border border-gray-300 bg-gray-200 cursor-pointer"
                          onClick={() => handleChangeQuantity(index, "incre")}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-[1rem]"
                          />
                        </span>
                      </div>
                      <div className="flex items-center gap-[1rem] min-w-[8rem]">
                        <span className="text-[1.4rem] select-none">
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-lg bg-red-100 cursor-pointer"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-[1.2rem] text-red-400"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 text-[1.4rem] font-medium">
                  Tạm tính:
                </span>
                <span className="text-gray-800 font-semibold">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 text-[1.4rem] font-medium">
                  Phí vận chuyển:
                </span>
                <span className="text-green-600 font-semibold">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(0)}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-600 text-[1.4rem] font-medium block mb-3">
                  Mã giảm giá:
                </span>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="couponCode"
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 h-[4rem] px-4 outline-none border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <button
                    type="button"
                    className="w-28 h-[4rem] text-[1.4rem] font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 mt-2">
                <span className="text-gray-600 text-[1.4rem] font-medium">
                  Giảm giá:
                </span>
                <span className="text-red-500 font-semibold">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(0)}
                </span>
              </div>

              <div className="py-3 border-t border-gray-200 mt-4 pt-4">
                <h4 className="text-[1.4rem] text-gray-800 font-bold mb-2">
                  Phương thức thanh toán
                </h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <p className="text-[1.4rem]">
                    Thanh toán khi nhận hàng (COD)
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-4 pt-4 bg-gray-50 -mx-6 px-6 rounded-b-xl">
                <span className="text-gray-800 font-bold text-[1.8rem]">
                  Tổng thanh toán:
                </span>
                <span className="text-green-600 font-bold text-[1.8rem]">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
                </span>
              </div>
            </div>
          </div>
          <div className="w-[55%] pl-[2rem] border-l border-l-gray-300">
            <h3 className="text-[1.8rem] text-gray-600 font-semibold mb-[1.5rem]">
              Thông tin khách hàng
            </h3>
            <div className="flex items-start gap-[2rem]">
              <div className="w-full">
                <label htmlFor="customerName" className="text-gray-600">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  id="customerName"
                  placeholder="Tên khách hàng..."
                  className="w-full h-[4rem] rounded-lg border border-gray-300 outline-none px-[1.5rem] focus:border-[.2rem] focus:border-cyan-300 mt-[.5rem]"
                  {...register("customerName")}
                />
                {errors.customerName && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.customerName.message}
                  </span>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="customerEmail" className="text-gray-600">
                  Email khách hàng
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  placeholder="Tên khách hàng..."
                  className="w-full h-[4rem] rounded-lg border border-gray-300 outline-none px-[1.5rem]  focus:border-[.2rem] focus:border-cyan-300 mt-[.5rem]"
                  {...register("customerEmail")}
                />
                {errors.customerEmail && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.customerEmail.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-[2rem] mt-[2rem]">
              <div className="w-full">
                <label htmlFor="customerPhone" className="text-gray-600">
                  Số điện thoại
                </label>
                <input
                  type="number"
                  id="customerPhone"
                  placeholder="Sđt khách hàng..."
                  className="w-full h-[4rem] rounded-lg border border-gray-300 outline-none px-[1.5rem] focus:border-[.2rem] focus:border-cyan-300 mt-[.5rem]"
                  {...register("customerPhone")}
                />
                {errors.customerName && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.customerName.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-[2rem] mt-[2rem]">
              <div className="w-full">
                <label className="text-gray-600">Địa chỉ</label>
                <div className="flex items-start gap-[2rem]  mt-[.5rem]">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="customerProvince"
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
                            setValue("customerDistrict", "");
                            setValue("customerWard", "");
                          }}
                          styles={{
                            control: (base, state) => ({
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
                    {errors.customerProvince && (
                      <span className="text-red-500 text-[1.4rem]">
                        {errors.customerProvince.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="customerDistrict"
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
                            setValue("customerWard", "");
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
                    {errors.customerDistrict && (
                      <span className="text-red-500 text-[1.4rem]">
                        {errors.customerDistrict.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="customerWard"
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
                              primary: "cyan", // override màu focus mặc định
                            },
                          })}
                        />
                      )}
                    />
                    {errors.customerWard && (
                      <span className="text-red-500 text-[1.4rem]">
                        {errors.customerWard.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[2rem]">
              <label htmlFor="customerAddress" className="text-gray-600">
                Tên đường / xã / số nhà
              </label>
              <input
                type="text"
                id="customerAddress"
                placeholder="..."
                className="w-full h-[4rem] rounded-lg border border-gray-300 outline-none px-[1.5rem] focus:border-[.2rem] focus:border-cyan-300 mt-[.5rem]"
                {...register("customerAddress")}
              />
              {errors.customerAddress && (
                <span className="text-red-500 text-[1.4rem]">
                  {errors.customerAddress.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-[2rem] mt-[2rem]">
              <div className="w-full">
                <label htmlFor="customerNote" className="text-gray-600">
                  Ghi chú
                </label>
                <textarea
                  id="customerNote"
                  placeholder="Ghi chú..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 outline-none px-[1.5rem] pt-[.5rem] focus:border-[.2rem] focus:border-cyan-300 mt-[.5rem]"
                  {...register("customerNote")}
                />
                {errors.customerNote && (
                  <span className="text-red-500 text-[1.4rem]">
                    {errors.customerNote.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-[2rem] gap-[1rem]">
          <button
            className="px-[2rem] py-[.5rem] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 hover-linear"
            onClick={() => {
              onClose();
              reset();
            }}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            className="px-[2rem] py-[.5rem] rounded-lg bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white hover-linear"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </form>
      <ModalProduct
        openModalProduct={openModalProduct}
        setOpenModalProduct={setOpenModalProduct}
        selectorderItems={selectorderItems}
        products={products}
        setFilterProduct={setFilterProduct}
        setValue={setValue}
      />
    </MotionWrapper>
  );
}

export default AddOrder;
