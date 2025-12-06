import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCreditCard,
  faMoneyBillWave,
  faTruck,
  faArrowLeft,
  faCheckCircle,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { PaymentMethod } from "@my-project/shared";
import axiosConfig from "../../../configs/axiosConfig";
import SelectAddress from "../../../components/SelectAddress";
import type { AddressType } from "../../../utils/userType";
import { useUser } from "../../../hooks/useUser";

interface CheckoutItem {
  variantId: number;
  productId: number;
  productName: string;
  mainImage: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  inventory: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerWard: string;
  customerDistrict: string;
  customerProvince: string;
  customerNote: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  orderItems: OrderItemsForm[];
}

interface OrderItemsForm {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
}

export default function Checkout() {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  const [isSelectAddressOpen, setIsSelectAddressOpen] = useState<{
    open: boolean;
    selectedId: number | null;
  }>({
    open: false,
    selectedId: null,
  });
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CheckoutForm>({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerWard: "",
      customerDistrict: "",
      customerProvince: "",
      customerNote: "",
      paymentMethod: PaymentMethod.COD,
      couponCode: "",
      orderItems: [],
    },
  });
  const paymentMethod = watch("paymentMethod");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    if (user && user.address.length > 0) {
      const defaultAddress = user?.address.find((it) => it.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setIsSelectAddressOpen({
          open: false,
          selectedId: defaultAddress.id,
        });
        setValue("customerName", defaultAddress.recipentName);
        setValue("customerEmail", user.email);
        setValue("customerPhone", defaultAddress.phone.toString());
        setValue("customerAddress", defaultAddress.addressDetail);
        setValue("customerWard", defaultAddress.ward);
        setValue("customerDistrict", defaultAddress.district);
        setValue("customerProvince", defaultAddress.province);
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");
    if (!data) {
      toast.error("Không tìm thấy thông tin đơn hàng!");
      navigate("/cart");
      return;
    }
    const parsed = JSON.parse(data);
    const dataOrderItems = parsed.items.map((item: CheckoutItem) => {
      return {
        productId: item.productId,
        variantId: item.variantId,
        price: Number(item.price),
        quantity: item.quantity,
      };
    });
    setValue("orderItems", dataOrderItems);
    setCheckoutData(parsed);
  }, [navigate, setValue]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSelectAddress = (addr: any) => {
    setSelectedAddress(addr);
    setValue("customerName", addr.recipentName);
    setValue("customerPhone", addr.phone.toString());
    setValue("customerAddress", addr.addressDetail);
    setValue("customerWard", addr.ward);
    setValue("customerDistrict", addr.district);
    setValue("customerProvince", addr.province);
    setIsSelectAddressOpen({
      open: false,
      selectedId: addr.id,
    });
  };

  const onSubmit = async (data: CheckoutForm) => {
    try {
      console.log(data);

      const res = (await axiosConfig.post(
        "/api/v1/orders/create",
        data
      )) as any;
      if (res.status) {
        sessionStorage.removeItem("checkoutData");
        if (data.paymentMethod !== PaymentMethod.COD) {
          // window.location.href = res.data.paymentUrl;
        } else {
          navigate(`/order-confirmation/${res.data.orderId}`, {
            replace: true,
          });
        }
        await refreshUser();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4 px-[12rem]">
      <div className="mb-8">
        <button
          onClick={() => navigate("/cart/detail")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Quay lại giỏ hàng</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">Thanh toán</h1>
        {!user && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Bạn đang mua hàng với tư cách <strong>khách vãng lai</strong>.
              <button
                onClick={() =>
                  navigate("/login", { state: { from: "/checkout" } })
                }
                className="ml-2 text-blue-600 underline font-medium cursor-pointer"
              >
                Đăng nhập
              </button>{" "}
              để nhận ưu đãi thành viên!
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg pt-10 px-10 pb-18 ">
              <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-2xl text-red-500"
                />
                <h2 className=" font-bold">Thông tin giao hàng</h2>
              </div>

              <div className="space-y-6">
                <div className="w-full flex items-start gap-[2rem]">
                  <div className="w-full space-y-1">
                    <label
                      htmlFor="customerName"
                      className="block text-gray-600"
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      placeholder="Họ và tên *"
                      className="w-full h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
                      {...register("customerName", {
                        required: "Vui lòng nhập họ tên!",
                      })}
                    />
                    {errors.customerName && (
                      <span className="text-red-500 text-[1.4rem]">
                        {errors.customerName.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full space-y-1">
                    <label
                      htmlFor="customerPhone"
                      className="block text-gray-600"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      placeholder="Số điện thoại *"
                      className="w-full h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
                      disabled={!!user?.phone}
                      {...register("customerPhone", {
                        required: "Vui lòng nhập số điện thoại!",
                      })}
                    />
                    {errors.customerPhone && (
                      <span className="text-red-500 text-[1.4rem]">
                        {errors.customerPhone.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <label
                    htmlFor="customerEmail"
                    className="block text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email (tùy chọn)"
                    className="w-full h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300 md:col-span-2 select-none"
                    disabled={!!user?.email}
                    {...register("customerEmail", {
                      required: "Vui lòng nhập email!",
                    })}
                  />
                  {errors.customerEmail && (
                    <span className="text-red-500 text-[1.4rem]">
                      {errors.customerEmail.message}
                    </span>
                  )}
                </div>
                <div className="w-full space-y-2">
                  <label className="block text-gray-600 font-medium">
                    Địa chỉ giao hàng
                  </label>
                  <div className="space-y-4">
                    {selectedAddress ? (
                      <div
                        key={selectedAddress.id}
                        className="flex items-center justify-between border border-dashed rounded-md p-[2rem] border-gray-300"
                      >
                        <div className="space-y-2" key={selectedAddress.id}>
                          <div className="flex items-center gap-[1rem] text-gray-500">
                            <span className="text-gray-800">
                              {selectedAddress.recipentName}
                            </span>
                            <span className="block h-[1.5rem] border-l border-l-gray-300"></span>
                            <span className="text-[1.4rem]">
                              {selectedAddress.phone}
                            </span>
                          </div>
                          <p className="text-[1.4rem] text-gray-500">
                            {selectedAddress.addressDetail}
                          </p>
                          <p className="text-[1.4rem] text-gray-500">
                            {selectedAddress.ward}, {selectedAddress.district},{" "}
                            {selectedAddress.province}
                          </p>
                          {selectedAddress.isDefault && (
                            <button
                              type="button"
                              className="text-[1.2rem] px-[.8rem] py-[.2rem] text-red-500 border border-red-300 rounded-sm"
                            >
                              Mặc định
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col space-y-4">
                          <button
                            type="button"
                            className="flex-1 px-[1rem] py-[.4rem] text-[1.4rem] border text-amber-500 border-amber-400 hover:border-amber-600 hover:text-amber-600 rounded-sm"
                            onClick={() =>
                              setIsSelectAddressOpen({
                                open: true,
                                selectedId: selectedAddress.id,
                              })
                            }
                          >
                            Thay đổi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-[.5rem] text-center rounded-md px-[2rem] py-[.5rem] border border-dashed border-cyan-300"
                      >
                        <FontAwesomeIcon
                          icon={faAdd}
                          className="text-[2rem] text-red-500"
                        />
                        <p className="text-gra-500 text-[1.6rem] select-none">
                          Thêm địa chỉ
                        </p>
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <label htmlFor="customerNote" className="block text-gray-600">
                    Ghi chú
                  </label>
                  <textarea
                    placeholder="Ghi chú cho shop (tùy chọn)"
                    rows={2}
                    className="w-full pl-[1.5rem] py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 md:col-span-2"
                    {...register("customerNote")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg px-6 py-10 top-6">
              <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faTruck} className="text-red-500" />
                Đơn hàng ({checkoutData.items.length} sản phẩm)
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {checkoutData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-[1rem]">
                      <img
                        src={item.mainImage}
                        alt={item.productName}
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                      <div className="max-w-[15rem]">
                        <p className="text-gray-800 line-clamp-1 text-[1.4rem]">
                          {item.productName}
                        </p>
                        {item.size && item.color && (
                          <p className="text-[1.2rem] text-gray-500">
                            {item.color} / {item.size}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-red-600 whitespace-nowrap text-[1.4rem]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-1 border-gray-200 mt-6 pt-6 space-y-6">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-gray-800">Tạm tính:</span>
                  <span>{formatPrice(checkoutData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[1.4rem] text-gray-800">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">
                    {checkoutData.shippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(checkoutData.shippingFee)}
                  </span>
                </div>
                <div className="border-t border-t-gray-400 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {formatPrice(checkoutData.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-lg text-green-600"
                  />
                  <h3 className="font-bold text-gray-800">Thanh toán</h3>
                </div>

                <div className="space-y-3">
                  {Object.values(PaymentMethod).map((item) => {
                    return (
                      <label
                        key={item}
                        className={`flex items-center gap-3 p-2 border-1 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === item
                            ? "border-pink-400 bg-pink-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={item}
                          checked={paymentMethod === item}
                          onChange={() => setValue("paymentMethod", item)}
                          className="w-4 h-4 text-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faMoneyBillWave}
                              className="text-lg text-green-600"
                            />
                            <div>
                              <p className="text-[1.4rem] uppercase">{item}</p>
                              <p className="text-[1.2rem] text-gray-600">
                                Thanh toán khi nhận hàng
                              </p>
                            </div>
                          </div>
                        </div>
                        {paymentMethod === item && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-lg text-pink-500"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                className="w-full mt-6 py-5 uppercase bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý" : "ĐẶT NGAY"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {isSelectAddressOpen.open && (
        <SelectAddress
          open={isSelectAddressOpen.open}
          onSelect={handleSelectAddress}
          selectedId={isSelectAddressOpen.selectedId}
          onClose={() =>
            setIsSelectAddressOpen({
              open: false,
              selectedId: selectedAddress?.id ?? null,
            })
          }
        />
      )}
    </div>
  );
}
