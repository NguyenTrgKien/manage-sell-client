import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBox,
  faInfoCircle,
  faSpinner,
  faExclamationTriangle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  getPaymentMethod,
  OrderStatus,
  PaymentMethod,
} from "@nguyentrungkien/shared";
import { getStatusConfig } from "../../../configs/getOrderStatusConfig";
import type {
  orderItemsType,
  OrderType,
} from "../../Dashboard/order/ListOrders";
import ChangeAddressOrder from "../../../components/ChangeAddressOrder";
import { lookup } from "../../../api/order.api";
import CancelOrder from "../../../components/CancelOrder";
import { useAddCart } from "../../../hooks/useAddCart";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Review from "../../../components/Review";
import { steps } from "../CustomerProfile/CustomerOrder/DetailOrder";

function LookUpOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCode = searchParams.get("code") || "";
  const [searchCode, setSearchCode] = useState(urlCode);
  const [activeTab, setActiveTab] = useState<"search" | "history">("search");
  const { addToCart } = useAddCart();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openReview, setOpenReview] = useState<{
    open: boolean;
    data: null | orderItemsType;
  }>({
    open: false,
    data: null,
  });
  const [openChangeAddress, setOpenChangeAddress] = useState<{
    open: boolean;
    dataChange: any;
  }>({
    open: false,
    dataChange: null,
  });
  const [openCancelledOrder, setOpenCancelledOrder] = useState<{
    open: boolean;
    orderCode: null | string;
    data: OrderType | null;
  }>({
    open: false,
    orderCode: null,
    data: null,
  });

  useEffect(() => {
    if (urlCode !== searchCode) {
      setSearchCode(urlCode);
    }
  }, [urlCode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchOrder = async (code: string) => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã đơn hàng!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const data = await lookup(code);
      setOrderData(data);
    } catch (err: any) {
      setError(
        err.message ||
          "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng."
      );
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (code?: string) => {
    const finalCode = code ?? searchCode;

    if (!finalCode.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng!");
      return;
    }

    setSearchCode(finalCode);
    setSearchParams({ code: finalCode.trim() });
    fetchOrder(finalCode.trim());
  };

  const refetchOrder = () => {
    if (searchCode.trim()) {
      fetchOrder(searchCode.trim());
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCode(value);
    if (!value.trim()) {
      setSearchParams({});
      setOrderData(null);
      setError(null);
    }
  };

  const handleOpenChangeAddress = () => {
    if (!orderData) return;

    const dataAddress = {
      orderCode: orderData?.orderCode,
      recipientName: orderData?.customerName,
      addressDetail: orderData?.customerAddress,
      phone: orderData?.customerPhone,
      province: orderData?.customerProvince,
      district: orderData?.customerDistrict,
      ward: orderData?.customerWard,
    };
    setOpenChangeAddress({
      open: true,
      dataChange: dataAddress,
    });
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})\d{4}(\d{3})/, "$1xxxx$2");
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return email;
    return `${local[0]}${"*".repeat(local.length - 2)}@${domain}`;
  };

  const handleBuyBack = async (data: OrderType) => {
    const items = data.orderItems.map((item) => {
      return {
        variantId: item.variant.id,
        quantity: item.quantity,
      };
    });

    const result = await addToCart(items);
    if (result) {
      const variantIds = items.map((it) => it.variantId).join(",");
      navigate(`/cart/detail?buyback=${variantIds}`);
    } else {
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
    }
  };

  const isPaid =
    orderData && orderData.paymentMethod === PaymentMethod.COD
      ? orderData.status === OrderStatus.COMPLETED
      : Boolean(orderData?.payment);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-[12rem]">
      <>
        <div className="mb-8">
          <h1 className="text-[2rem] font-bold text-gray-800 mb-2">
            Tra cứu đơn hàng
          </h1>
          <p className="text-gray-600">
            Nhập mã đơn hàng để kiểm tra trạng thái đơn hàng của bạn
          </p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("search")}
              className={`cursor-pointer pb-4 px-2 font-medium transition-colors relative ${
                activeTab === "search"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Tra cứu đơn hàng
            </button>
          </div>
        </div>

        {activeTab === "search" && (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Nhập mã đơn hàng (VD: ORDER-abc123)"
                  className="w-[40rem] h-[4rem] px-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-[1.4rem]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  className="w-[12rem] h-[4rem] bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                  onClick={() => handleSearch()}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} />
                      Tra cứu
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-start gap-2 text-[1.4rem] text-gray-600">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                <p>
                  Mã đơn hàng được gửi qua email sau khi đặt hàng thành công.
                  Vui lòng kiểm tra email hoặc tin nhắn SMS.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 flex items-center justify-center gap-3">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-2xl text-red-500"
                />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="text-3xl text-blue-500 mr-3"
                />
                <span className="text-lg">Đang tải dữ liệu...</span>
              </div>
            ) : orderData ? (
              <>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className=" font-bold ">
                          Đơn hàng: {orderData.orderCode}
                        </h2>
                        <p className="text-gray-600 text-[1.4rem] mt-1">
                          Đặt ngày {formatDate(orderData.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-12 py-2 rounded-lg font-medium ${getStatusConfig(orderData.status as OrderStatus).bgColor} ${getStatusConfig(orderData.status as OrderStatus).textColor}`}
                      >
                        {getStatusConfig(orderData.status as OrderStatus).text}
                      </span>
                    </div>

                    {orderData?.status === OrderStatus.CANCELLED ? (
                      <div className="w-full py-[2rem] border border-amber-200 bg-amber-50 px-[2rem]">
                        <p className="text-[1.8rem] text-red-500">
                          Đã hủy đơn hàng
                        </p>
                        <p>lúc {formatDate(orderData.updatedAt)}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-5 mt-[3rem]">
                        {steps.map((step, index) => {
                          const isActive =
                            steps.findIndex(
                              (s) => s.key === orderData.status
                            ) >= index;
                          return (
                            <div key={step.key} className="flex items-center">
                              <div
                                key={step.key}
                                className="flex flex-col gap-[2rem] relative items-center"
                              >
                                <div
                                  className={`w-[6rem] h-[6rem] rounded-full flex items-center justify-center z-10
                              ${isActive ? `${step.color}` : "bg-gray-300"}`}
                                >
                                  <FontAwesomeIcon
                                    icon={step.icon}
                                    className="text-white text-[2rem]"
                                  />
                                </div>

                                <div className="flex-1 text-center">
                                  <div className="text-[1.4rem] font-medium text-gray-800">
                                    {step.label}
                                  </div>
                                  <div className="text-[1.2rem] text-gray-500 mt-[.2rem]">
                                    {step.desc}
                                  </div>
                                </div>
                              </div>
                              {index !== steps.length - 1 && (
                                <span className="w-[10rem] border border-green-500"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="w-full border-t-1 border-gray-400 mt-[3rem]"></div>

                    <div className="flex items-start flex-col space-y-4 mt-[3rem] w-4xl p-[2rem] border border-gray-300 rounded-md">
                      <span className="font-bold">Thông tin khách hàng</span>
                      <div className="flex items-center">
                        <span className="text-start w-sm text-gray-600">
                          Họ tên:
                        </span>
                        <span className="block text-end">
                          {orderData.customerName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-start w-sm text-gray-600">
                          Số điện thoại:
                        </span>
                        <span className="block text-end">
                          {maskPhone(orderData.customerPhone)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-start w-sm text-gray-600">
                          Email:
                        </span>
                        <span className="block text-end">
                          {maskEmail(orderData.customerEmail)}
                        </span>
                      </div>
                      <span className="font-bold">Địa chỉ nhận hàng</span>
                      <div className="w-full mt-[1rem] border border-gray-300 rounded-md p-[2rem]">
                        <p className="text-gray-800">
                          {orderData.customerName}
                        </p>
                        <p className="text-[1.3rem] text-gray-500">
                          ({maskPhone(orderData.customerPhone)})
                        </p>
                        <p className="text-[1.3rem] text-gray-500">
                          {orderData.customerAddress}, {orderData.customerWard},{" "}
                          {orderData.customerDistrict},{" "}
                          {orderData.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="w-full border border-gray-200 rounded-md p-[1rem] mt-[2rem]">
                      <h3 className="text-[1.4rem] font-bold text-gray-800 pb-[2rem] flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faBox}
                          className="text-blue-500"
                        />
                        Sản phẩm ({orderData && orderData.orderItems?.length})
                      </h3>

                      {orderData.orderItems &&
                        orderData.orderItems?.length > 0 && (
                          <div className="border border-gray-200 px-[2rem] py-[1rem] rounded-md">
                            <div className="bg-white ">
                              <div className="space-y-2">
                                {orderData.orderItems.map(
                                  (item: orderItemsType) => (
                                    <div key={item.id}>
                                      <Link
                                        to={`/product-detail/${item.variant.product.slug}`}
                                        className="flex items-center gap-4 pb-6 last:border-0 py-[.5rem] border-b border-b-gray-200 cursor-pointer"
                                      >
                                        <img
                                          src={item.variant.product.mainImage}
                                          alt={item.variant.product.productName}
                                          className="w-28 h-28 object-cover rounded-md border border-gray-300 p-0.5"
                                        />
                                        <div className="flex-1">
                                          <h4 className="text-gray-800">
                                            {item.variant.product.productName}
                                          </h4>
                                          <span className="flex items-center space-x-4 text-[1.2rem] text-gray-600">
                                            <span>
                                              {item.variant.variantColor.name} /{" "}
                                              {item.variant.variantSize.name}
                                            </span>
                                            <span className="text-[1.2rem] text-gray-600">
                                              Số lượng: x{item.quantity}
                                            </span>
                                          </span>
                                          <p className="flex items-center space-x-1 text-[1rem] text-gray-600">
                                            <span>Giá:</span>
                                            <span className="text-red-600">
                                              {formatPrice(item.price)}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-red-600">
                                            {formatPrice(
                                              item.price * item.quantity
                                            )}
                                          </p>
                                        </div>
                                      </Link>
                                      <div className="flex flex-col items-end mt-[1rem]">
                                        <div className="flex items-center justify-end space-x-4 mt-[2rem]">
                                          {item.evaluate.length > 0 &&
                                            [
                                              OrderStatus.CANCELLED,
                                              OrderStatus.COMPLETED,
                                            ].includes(orderData.status) && (
                                              <button
                                                type="button"
                                                className="px-[2rem] py-[.6rem] rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer transition duration-300"
                                                onClick={() => {
                                                  handleBuyBack(orderData);
                                                }}
                                              >
                                                Mua lại
                                              </button>
                                            )}
                                          {item.evaluate.length === 0 &&
                                            orderData.status ===
                                              OrderStatus.COMPLETED && (
                                              <button
                                                type="button"
                                                className="px-[2rem] py-[.6rem] flex items-center border border-amber-500 rounded-md text-amber-500 hover:text-amber-600 hover:border-amber-600 cursor-pointer"
                                                onClick={() =>
                                                  setOpenReview({
                                                    open: true,
                                                    data: item,
                                                  })
                                                }
                                              >
                                                <div className="flex items-center space-x-2 ">
                                                  <FontAwesomeIcon
                                                    icon={faStar}
                                                    className="text-[1.4rem]"
                                                  />
                                                  <span className="">
                                                    Đánh giá
                                                  </span>
                                                </div>
                                              </button>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      <div className="w-4xl ml-auto flex justify-between space-y-4 py-4 px-[2rem]">
                        <div className="flex flex-col items-end space-y-8 mt-4">
                          <span className="text-end text-gray-600">
                            Tạm tính:
                          </span>

                          <span className="text-end text-gray-600">
                            Phí vận chuyển:
                          </span>
                          <span className="text-end text-gray-600">
                            Tổng tiền:
                          </span>
                          <span className="text-end text-gray-600">
                            Phương thức thanh toán:
                          </span>
                          <span className="text-end text-gray-600">
                            Trạng thái
                          </span>
                        </div>
                        <div className="flex flex-col items-end space-y-8 mt-4">
                          <span className="block text-end text-gray-800">
                            {formatPrice(orderData.totalAmount)}
                          </span>
                          <span className="block text-end text-gray-800">
                            {formatPrice(orderData.shippingFee)}
                          </span>

                          <span className="block text-end font-bold text-red-500">
                            {formatPrice(
                              orderData.totalAmount +
                                Number(orderData.shippingFee)
                            )}
                          </span>
                          <span className="block text-end text-gray-800">
                            {
                              getPaymentMethod[
                                orderData.paymentMethod as PaymentMethod
                              ].text
                            }
                          </span>
                          <span
                            className={`${isPaid ? "text-green-600" : "text-red-600"} block text-end`}
                          >
                            {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {orderData && !isPaid && (
                      <div className="text-center border border-amber-300 bg-amber-50 py-5 px-[1rem] mt-[1rem] rounded-md">
                        Vui lòng thanh toán (
                        <span className="text-red-500">
                          {formatPrice(
                            orderData.totalAmount +
                              Number(orderData.shippingFee)
                          )}
                        </span>
                        ) khi nhận hàng!
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-4 mt-[2rem]">
                      {orderData.status === OrderStatus.CANCELLED && (
                        <button
                          type="button"
                          className="px-[2rem] py-[.6rem] rounded-md border border-gray-300 text-gray-600 hover:border-gray-400 cursor-pointer transition duration-300"
                          onClick={() =>
                            setOpenCancelledOrder({
                              open: true,
                              orderCode: orderData.orderCode,
                              data: orderData,
                            })
                          }
                        >
                          Chi tiết hủy đơn
                        </button>
                      )}

                      {[OrderStatus.CONFIRMED, OrderStatus.PENDING].includes(
                        orderData.status
                      ) && (
                        <button
                          type="button"
                          className="px-[2rem] py-[.6rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer transition duration-300"
                          onClick={() =>
                            setOpenCancelledOrder({
                              open: true,
                              orderCode: orderData.orderCode,
                              data: null,
                            })
                          }
                        >
                          Hủy đơn
                        </button>
                      )}

                      {[OrderStatus.CONFIRMED, OrderStatus.PENDING].includes(
                        orderData.status
                      ) && (
                        <button
                          type="button"
                          className="px-[2rem] py-[.6rem] rounded-md bg-red-500 text-white cursor-pointer transition duration-300 hover:bg-red-600"
                          onClick={() => handleOpenChangeAddress()}
                        >
                          Thay đổi địa chỉ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <Review
                  open={openReview.open}
                  item={openReview.data}
                  dataGuest={{
                    customerEmail: orderData.customerEmail,
                    customerName: orderData.customerName,
                  }}
                  onClose={() => setOpenReview({ open: false, data: null })}
                  refetch={refetchOrder}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-10 text-center text-gray-600">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-5xl mb-4 text-gray-400"
                />
                <p className="text-xl">
                  {searchCode
                    ? "Nhấn 'Tra cứu' để kiểm tra đơn hàng của bạn."
                    : "Chưa có kết quả. Vui lòng nhập mã đơn hàng để tra cứu."}
                </p>
              </div>
            )}
          </div>
        )}
      </>
      {
        <ChangeAddressOrder
          open={openChangeAddress.open}
          onClose={() =>
            setOpenChangeAddress({ open: false, dataChange: null })
          }
          dataChange={openChangeAddress.dataChange}
          refetchOrder={refetchOrder}
        />
      }

      {
        <CancelOrder
          open={openCancelledOrder.open}
          onClose={() =>
            setOpenCancelledOrder({ open: false, orderCode: null, data: null })
          }
          orderCode={openCancelledOrder.orderCode}
          refetch={refetchOrder}
          status={openCancelledOrder?.data?.status}
          cancelReason={openCancelledOrder?.data?.reason}
          cancelledAt={openCancelledOrder.data?.updatedAt}
          cancelledBy={openCancelledOrder.data?.customerName}
        />
      }
    </div>
  );
}

export default LookUpOrder;
