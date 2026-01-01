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
import { PaymentMethod, VoucherType } from "@nguyentrungkien/shared";
import axiosConfig from "../../../configs/axiosConfig";
import SelectAddress from "../../../components/SelectAddress";
import type { AddressType } from "../../../utils/userType";
import { useUser } from "../../../hooks/useUser";
import ActionAddress from "../../../components/ActionAddress";
import { useQueryClient } from "@tanstack/react-query";
import OpenLogin from "../../../components/OpenLogin";
import type { VoucherT } from "../../../utils/voucher.type";
import SelectVoucher from "../../../components/SelectVoucher";
import { AnimatePresence } from "framer-motion";
import RequireLogin from "../../../components/RequireLogin";

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
  const [openActionAddress, setOpenActionAddress] = useState<{
    open: boolean;
    dataUpdate: AddressType | null;
    action: "edit" | "add";
  }>({
    open: false,
    dataUpdate: null,
    action: "add",
  });
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [discountAmount, setdiscountAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [openLogin, setOpenLogin] = useState(false);
  const [selectVoucher, setSelectVoucher] = useState<{
    open: boolean;
    voucher: VoucherT | null;
    conditionValue: number | null;
  }>({
    open: false,
    voucher: null,
    conditionValue: null,
  });
  const queryClient = useQueryClient();
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
  const watchedProvince = watch("customerProvince");

  const paymentMethod = watch("paymentMethod");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (user) {
      setValue("customerPhone", user.phone?.toString() || "");
      setValue("customerEmail", user.email || "");
      if (user.address.length > 0) {
        const defaultAddress = user?.address.find((it) => it.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setValue(
            "customerName",
            defaultAddress.recipentName || user.username || ""
          );
          setValue("customerAddress", defaultAddress.addressDetail);
          setValue("customerWard", defaultAddress.ward);
          setValue("customerDistrict", defaultAddress.district);
          setValue("customerProvince", defaultAddress.province);
          setIsSelectAddressOpen({
            open: false,
            selectedId: defaultAddress.id,
          });
        }
      }
    }
  }, [user, setValue]);

  // Xử lý khách chưa đăng nhập
  useEffect(() => {
    const loadGuestAddress = () => {
      if (user) return;

      const data = localStorage.getItem("guest_address");
      if (data) {
        const address = JSON.parse(data);
        setSelectedAddress(address);
        setValue("customerAddress", address.addressDetail);
        setValue("customerWard", address.ward);
        setValue("customerDistrict", address.district);
        setValue("customerProvince", address.province);
      } else {
        setSelectedAddress(null);
        setValue("customerAddress", "");
        setValue("customerWard", "");
        setValue("customerDistrict", "");
        setValue("customerProvince", "");
      }
    };

    loadGuestAddress();

    const handleGuestAddressChange = (e: Event) => {
      const event = e as CustomEvent;
      const { action } = event.detail || {};

      if (action === "cleared") {
        setSelectedAddress(null);
        setValue("customerAddress", "");
        setValue("customerWard", "");
        setValue("customerDistrict", "");
        setValue("customerProvince", "");
      } else {
        loadGuestAddress();
      }
    };

    window.addEventListener("guest_address_updated", handleGuestAddressChange);

    return () => {
      window.removeEventListener(
        "guest_address_updated",
        handleGuestAddressChange
      );
    };
  }, [user, setValue]);

  // Load thông tin đơn từ sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");

    if (!data) {
      toast.error("Không tìm thấy thông tin đơn hàng!");
      navigate("/cart/detail");
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

  useEffect(() => {
    if (!checkoutData) return;
    let discountAmount = 0;
    if (user && selectVoucher.voucher) {
      const voucher = selectVoucher.voucher;
      const subTotal = checkoutData?.subtotal;
      if (voucher.type === VoucherType.PERCENT) {
        discountAmount = (Number(subTotal) * voucher.value) / 100;
        if (discountAmount > voucher.maxDiscount) {
          discountAmount = voucher.maxDiscount;
        }
      } else {
        discountAmount = voucher.value;
      }
    }
    setdiscountAmount(discountAmount);
    const newTotal = checkoutData.subtotal + shippingFee - discountAmount;
    setTotalAmount(newTotal);
  }, [selectVoucher.voucher, checkoutData, shippingFee, user]);

  const calculateShipping = async (addressData: { province: string }) => {
    if (!checkoutData) return;
    setIsCalculatingShipping(true);
    try {
      const res = await axiosConfig.post("/api/v1/orders/calculate-shipping", {
        subTotal: checkoutData.subtotal,
        customerProvince: addressData.province,
      });

      if (res.status) {
        setShippingFee(res.data.shippingFee);
        setTotalAmount(checkoutData.subtotal + res.data.shippingFee);
      } else {
        const free = checkoutData.subtotal >= 500000 ? 0 : 35000;
        setShippingFee(free);
        setTotalAmount(checkoutData.subtotal + free);
      }
    } catch (error) {
      const free = checkoutData.subtotal >= 500000 ? 0 : 35000;
      setShippingFee(free);
      setTotalAmount(checkoutData.subtotal + free);
    } finally {
      setIsCalculatingShipping(false);
    }
  };
  useEffect(() => {
    if (checkoutData && watchedProvince) {
      calculateShipping({
        province: watchedProvince,
      });
    }
  }, [watchedProvince, checkoutData]);

  // Xử lý nếu phiên đăng nhập hết hạn
  useEffect(() => {
    if (user === undefined) return;

    const from = sessionStorage.getItem("checkoutFrom");

    if (from === "authenticated" && !user) {
      toast.error("Phiên đăng nhập đã hết hạn! Vui lòng chọn lại sản phẩm.");
      sessionStorage.removeItem("checkoutData");
      sessionStorage.removeItem("checkoutFrom");
      navigate("/cart/detail", { replace: true });
    }
  }, [user, navigate]);

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
      const submitData = {
        shippingFee: shippingFee,
        totalAmount: totalAmount,
        ...data,
        ...(selectVoucher.voucher && discountAmount
          ? {
              voucherCode: selectVoucher.voucher.voucherCode,
              discountAmount: discountAmount,
            }
          : {}),
      };
      const res = (await axiosConfig.post(
        "/api/v1/orders/create",
        submitData
      )) as any;

      if (res.status) {
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("checkoutFrom");
        if (!user) {
          const orderRaw = localStorage.getItem("guest_orders");
          if (orderRaw) {
            const guestorder = JSON.parse(orderRaw);
            guestorder.push(res.data.orderCode);
            localStorage.setItem("guest_orders", JSON.stringify(guestorder));
          } else {
            localStorage.setItem(
              "guest_orders",
              JSON.stringify([res.data.orderCode])
            );
          }
        }
        toast.success(res.data.message || "Đặt hàng thành công!");
        if (data.paymentMethod !== PaymentMethod.COD) {
          window.location.href = res.data.paymentUrl;
        } else {
          navigate(`/order-confirmation/${res.data.orderCode}`, {
            replace: true,
          });
        }

        if (user) {
          await refreshUser();
        }
      } else {
        if (res.existingEmail) {
          setOpenLogin(true);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!"
      );
    }
  };

  const handleActionSuccess = async () => {
    setOpenActionAddress({
      open: false,
      dataUpdate: null,
      action: "add",
    });
    if (user) {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
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
    <div className="w-full min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 xl:px-[12rem]">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/cart/detail")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 sm:mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Quay lại giỏ hàng</span>
        </button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Thanh toán
        </h1>
        {!user && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-[1.4rem]">
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
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl shadow-lg pt-6 lg:pt-10 px-4 sm:px-6 lg:px-10 pb-6 lg:pb-18">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-xl lg:text-2xl text-red-500"
                />
                <h2 className="font-bold">Thông tin giao hàng</h2>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-[2rem]">
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
                      className="w-full h-[4rem] pl-[1rem] lg:pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
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
                      className="w-full h-[4rem] pl-[1rem] lg:pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300"
                      readOnly={!!user?.phone}
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

                {/* Email */}
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
                    className="w-full h-[4rem] pl-[1rem] lg:pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-300 md:col-span-2 select-none"
                    readOnly={!!user?.email}
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

                {/* Shipping Address */}
                <div className="w-full space-y-2">
                  <label className="block text-gray-600 font-medium">
                    Địa chỉ giao hàng
                  </label>
                  <div className="space-y-4">
                    {selectedAddress ? (
                      <div
                        key={selectedAddress.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between border border-dashed rounded-md p-4 lg:p-[2rem] border-gray-300 gap-4"
                      >
                        <div
                          className="space-y-2 flex-1"
                          key={selectedAddress.id}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-[1rem] text-gray-500">
                            <span className="text-gray-800">
                              {selectedAddress.recipentName}
                            </span>
                            <span className="hidden sm:block h-[1.5rem] border-l border-l-gray-300"></span>
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
                              className="text-[1.2rem] px-[.8rem] py-[.2rem] text-red-500 border border-red-300 rounded-sm inline-block mt-2"
                            >
                              Mặc định
                            </button>
                          )}
                        </div>
                        <div className="flex space-y-2 sm:flex-col sm:space-y-4">
                          <button
                            type="button"
                            className="px-[1rem] py-[.4rem] text-[1.4rem] border text-amber-500 border-amber-400 hover:border-amber-600 hover:text-amber-600 rounded-sm w-full sm:w-auto"
                            onClick={() => {
                              if (user) {
                                setIsSelectAddressOpen({
                                  open: true,
                                  selectedId: selectedAddress.id,
                                });
                              } else {
                                setOpenActionAddress({
                                  open: true,
                                  action: "edit",
                                  dataUpdate: selectedAddress,
                                });
                              }
                            }}
                          >
                            Thay đổi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center justify-center gap-[.5rem] text-center rounded-md px-4 lg:px-[2rem] py-3 lg:py-[.6rem] border border-dashed border-blue-500 cursor-pointer hover:border-blue-600 text-blue-500 hover:text-blue-600 w-full"
                        onClick={() => {
                          if (user) {
                            setIsSelectAddressOpen({
                              open: true,
                              selectedId: null,
                            });
                          } else {
                            setOpenActionAddress({
                              open: true,
                              action: "add",
                              dataUpdate: null,
                            });
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faAdd}
                          className="text-[1.5rem] lg:text-[2rem]"
                        />
                        <p className="text-gray-500 text-[1.4rem] lg:text-[1.6rem] select-none">
                          Thêm địa chỉ
                        </p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div className="w-full space-y-1">
                  <label htmlFor="customerNote" className="block text-gray-600">
                    Ghi chú
                  </label>
                  <textarea
                    placeholder="Ghi chú cho shop (tùy chọn)"
                    rows={2}
                    className="w-full pl-[1rem] lg:pl-[1.5rem] py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 md:col-span-2"
                    {...register("customerNote")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg px-4 sm:px-6 py-6 lg:py-10 sticky top-4 lg:top-6">
              <h2 className="font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faTruck} className="text-red-500" />
                <span>Đơn hàng ({checkoutData.items.length} sản phẩm)</span>
              </h2>

              {/* Order Items List */}
              <div className="space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto pr-2 mb-4 lg:mb-6">
                {checkoutData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-3 lg:gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 lg:gap-[1rem] min-w-0">
                      <img
                        src={item.mainImage}
                        alt={item.productName}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover border flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-800 line-clamp-1 text-[1.4rem]">
                          {item.productName}
                        </p>
                        {item.size && item.color && (
                          <p className="text-[1.2rem] text-gray-500 truncate">
                            {item.color} / {item.size}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-red-600 whitespace-nowrap text-[1.4rem] flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher Section */}
              <div className="py-4 border-t border-b border-gray-200">
                {selectVoucher.voucher ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-blue-600">Đã áp dụng voucher:</p>
                    <div className="flex space-x-4 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectVoucher((prev) => ({ ...prev, open: true }))
                        }
                        className="text-blue-600 hover:text-blue-700 cursor-pointer text-[1.4rem]"
                      >
                        Đổi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectVoucher({
                            open: false,
                            voucher: null,
                            conditionValue: checkoutData.subtotal,
                          });
                          setdiscountAmount(0);
                        }}
                        className="text-red-600 hover:text-red-700 cursor-pointer text-[1.4rem]"
                      >
                        Bỏ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 border-t border-b border-gray-200">
                    <p
                      className="text-blue-600 cursor-pointer hover:text-blue-700 select-none text-center sm:text-left"
                      onClick={() => {
                        if (user) {
                          setSelectVoucher({
                            open: true,
                            voucher: null,
                            conditionValue: checkoutData.subtotal,
                          });
                        } else {
                          setShowLogin(true);
                        }
                      }}
                    >
                      Chọn hoặc nhập mã voucher
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 space-y-4 lg:space-y-6">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-gray-800">Tạm tính:</span>
                  <span>{formatPrice(checkoutData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[1.4rem] text-gray-800">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">
                    {isCalculatingShipping ? (
                      <span className="text-gray-500">Đang tính...</span>
                    ) : shippingFee === 0 ? (
                      "Miễn phí"
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[1.4rem] text-gray-800">
                  <span>Voucher áp dụng:</span>
                  <span className="text-red-600">
                    - {formatPrice(discountAmount)}
                  </span>
                </div>
                <div className="border-t border-t-gray-400 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
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
                            <div className="min-w-0">
                              <p className="text-[1.4rem] uppercase truncate">
                                {item}
                              </p>
                              <p className="text-[1.2rem] text-gray-600 truncate">
                                Thanh toán khi nhận hàng
                              </p>
                            </div>
                          </div>
                        </div>
                        {paymentMethod === item && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-lg text-pink-500 flex-shrink-0"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full mt-6 py-3 lg:py-5 uppercase bg-red-500 hover:bg-red-600 text-white text-lg lg:text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý" : "ĐẶT NGAY"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Modals */}
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

      <ActionAddress
        openActionAddress={openActionAddress}
        onClose={() =>
          setOpenActionAddress({
            open: false,
            dataUpdate: null,
            action: "add",
          })
        }
        onSuccess={handleActionSuccess}
      />

      <OpenLogin open={openLogin} onClose={() => setOpenLogin(false)} />
      <AnimatePresence>
        {selectVoucher.open && (
          <SelectVoucher
            open={selectVoucher.open}
            selected={selectVoucher.voucher}
            setSelectVoucher={setSelectVoucher}
            onClose={() =>
              setSelectVoucher((prev) => ({ ...prev, open: false }))
            }
            conditionValue={selectVoucher.conditionValue}
          />
        )}
      </AnimatePresence>

      <RequireLogin open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
