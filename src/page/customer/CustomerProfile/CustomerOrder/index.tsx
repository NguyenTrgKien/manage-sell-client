import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OrderStatus } from "@nguyentrungkien/shared";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrders } from "../../../../api/order.api";
import Loading from "../../../../components/Loading";
import type {
  orderItemsType,
  OrderType,
} from "../../../Dashboard/order/ListOrders";
import { getStatusConfig } from "../../../../configs/getOrderStatusConfig";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import Review from "../../../../components/Review";
import noOrder from "../../../../assets/images/cart_empty.png";
import { useAddCart } from "../../../../hooks/useAddCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CancelOrder from "../../../../components/CancelOrder";
import DetailOrder from "./DetailOrder";
import ConfirmReceivedOrder from "../../../../components/ConfirmReceivedOrder";

export type OrderStatusConfig = {
  title: string;
  color: string;
  bgColor?: string;
  textColor?: string;
};

export const orderStatusMap = {
  all: {
    title: "Tất cả",
    color: "green",
  },
  [OrderStatus.PENDING]: {
    title: "Chờ xác nhận",
    color: "green",
  },
  [OrderStatus.CONFIRMED]: {
    title: "Đã xác nhận",
    color: "green",
  },
  [OrderStatus.SHIPPING]: {
    title: "Đang giao hàng",
    color: "green",
  },
  [OrderStatus.DELIVERED]: {
    title: "Đã giao hàng",
    color: "red",
  },
  [OrderStatus.COMPLETED]: {
    title: "Đã hoàn thành",
    color: "green",
  },
  [OrderStatus.CANCELLED]: {
    title: "Đã hủy",
    color: "red",
  },
};

function CustomerOrder() {
  const [queryOrders, setQueryOrders] = useState<{
    searchOrders: string;
    status: OrderStatus | "all";
  }>({
    searchOrders: "",
    status: "all",
  });
  const [searchOrders, setSearchOrders] = useState("");
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const [openCancelledOrder, setOpenCancelledOrder] = useState<{
    open: boolean;
    orderCode: null | string;
    data: OrderType | null;
  }>({
    open: false,
    orderCode: null,
    data: null,
  });
  const [openDetailOrder, setOpenDetailOrder] = useState<{
    open: boolean;
    data: OrderType | null;
  }>({
    open: false,
    data: null,
  });
  const [openConfirmReceived, setOpenConfirmReceived] = useState<{
    open: boolean;
    data: null | OrderType;
  }>({
    open: false,
    data: null,
  });
  const { addToCart } = useAddCart();
  const navigate = useNavigate();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [openReview, setOpenReview] = useState<{
    open: boolean;
    data: null | orderItemsType;
  }>({
    open: false,
    data: null,
  });
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const statusKeys = useMemo(
    () => Object.keys(orderStatusMap) as ("all" | OrderStatus)[],
    []
  );

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", queryOrders],
    queryFn: ({ queryKey }) => getOrders(queryKey[1]),
  });

  useEffect(() => {
    scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  useEffect(() => {
    const currentIndex = statusKeys.indexOf(currentStatus);
    const currentLi = liRefs.current[currentIndex];

    if (currentLi) {
      setIndicatorStyle({
        left: currentLi.offsetLeft,
        width: currentLi.offsetWidth,
      });
    }
  }, [currentStatus, statusKeys]);

  const setLiRef = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      liRefs.current[index] = el;
    },
    []
  );

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBuyBack = async (order: OrderType) => {
    const items = order.orderItems.map((item) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {openDetailOrder.open ? (
        <DetailOrder
          order={openDetailOrder.data}
          onClose={() => setOpenDetailOrder({ data: null, open: false })}
        />
      ) : (
        <>
          <div className="sticky top-0 pt-[2rem] bg-white z-0">
            <div className="relative w-full overflow-x-auto">
              <ul
                className={`relative flex items-center border-b border-b-gray-300 z-0 
                  w-max min-w-full
                  snap-x snap-mandatory
                  scrollbar-hide
                  md:snap-none md:w-full`}
              >
                {statusKeys.map((key, index) => {
                  const value = orderStatusMap[key as OrderStatus];
                  const isActive = key === currentStatus;
                  if (key === OrderStatus.DELIVERED) return;
                  return (
                    <li
                      key={key}
                      ref={setLiRef(index)}
                      className="px-[4rem] pb-[1.5rem] cursor-pointer select-none
                        snap-start
                        flex-shrink-0"
                      onClick={() => {
                        const statusToSend =
                          key === "all" ? "all" : (key as OrderStatus);

                        setQueryOrders((prev) => ({
                          ...prev,
                          status: statusToSend,
                        }));

                        setCurrentStatus(key as "all" | OrderStatus);
                      }}
                    >
                      <div className={`${isActive ? "text-red-500" : ""}`}>
                        {value.title}
                      </div>
                    </li>
                  );
                })}
                <span
                  className="absolute bottom-0 border-t-[.2rem] border-t-red-400 transition-all duration-300"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                ></span>
              </ul>
            </div>
          </div>
          <div className="px-[2rem] pb-[2rem]">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="mt-[2rem] space-y-8">
                <div className="flex mt-[2rem] h-[4rem] w-full border border-gray-300 bg-white rounded-md">
                  <button
                    type="button"
                    className="pl-[1.5rem] text-gray-500 cursor-pointer"
                    onClick={() =>
                      setQueryOrders((prev) => ({
                        ...prev,
                        searchOrders: searchOrders,
                      }))
                    }
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                  <input
                    type="text"
                    id="searchOrders"
                    name="searchOrders"
                    value={searchOrders}
                    placeholder="Bạn có thể tìm kiếm theo ID, tên sản phẩm"
                    className="w-full h-full rounded-md outline-none pl-[1.5rem]"
                    onChange={(e) => setSearchOrders(e.target.value)}
                  />
                </div>
                {data.length > 0 ? (
                  <>
                    {data?.map((order: OrderType) => {
                      return (
                        <div
                          key={order.id}
                          className="shadow-md p-[1.5rem] border border-gray-200 rounded-md"
                        >
                          <div className="flex items-center justify-end mb-[1.5rem]">
                            <p className="text-[1.4rem] text-gray-600 pr-[1rem] mr-[1rem] border-r border-r-gray-300">
                              Ngày đặt: {formatDate(order.createdAt)}
                            </p>
                            <p
                              className={`px-[2rem] py-[.2rem] rounded-full ${getStatusConfig(order.status).textColor} ${getStatusConfig(order.status).bgColor}`}
                            >
                              {getStatusConfig(order.status).text}
                            </p>
                          </div>
                          {order.orderItems.length > 0 &&
                            order.orderItems.map((item) => {
                              const product = item.variant.product;
                              const isReview =
                                order.status === OrderStatus.COMPLETED &&
                                order.orderItems.some(
                                  (it) => it.evaluate.length === 0
                                );
                              return (
                                <div
                                  key={item.id}
                                  className="pb-[2rem] mb-[2rem] border-b border-b-gray-300"
                                >
                                  <div
                                    className="flex items-center justify-between my-[1rem] cursor-pointer"
                                    onClick={() =>
                                      setOpenDetailOrder({
                                        open: true,
                                        data: order,
                                      })
                                    }
                                  >
                                    <div className="flex space-x-6 items-center ">
                                      <img
                                        src={product.mainImage}
                                        alt={`mainImage-${product.productName}`}
                                        className="w-[6rem] h-[6rem] object-cover border border-gray-400"
                                      />
                                      <div>
                                        <p className="max-w-2xl line-clamp-1 text-gray-900 select-none">
                                          {product.productName}
                                        </p>
                                        <p className="flex items-center space-x-2 text-[1.2rem] text-gray-600">
                                          <span>Phân loại:</span>
                                          <span className="block">
                                            Size {item.variant.variantSize.name}
                                            , Màu{" "}
                                            {item.variant.variantColor.name}
                                          </span>
                                        </p>
                                        <p className="text-[1.2rem] text-gray-600">
                                          Số lượng: x{item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-red-600 text-[1.6rem]">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-end gap-[1rem]">
                                    {!isReview &&
                                      [
                                        OrderStatus.CANCELLED,
                                        OrderStatus.COMPLETED,
                                      ].includes(order.status) && (
                                        <button
                                          type="button"
                                          className="px-[2rem] py-[.6rem] bg-red-500 rounded-md text-white cursor-pointer"
                                          onClick={() => handleBuyBack(order)}
                                        >
                                          Mua lại
                                        </button>
                                      )}
                                    {isReview && (
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
                                          <span className="">Đánh giá</span>
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          <div className="flex flex-col items-end justify-center">
                            <p className="text-gray-600">
                              Tổng tiền:{" "}
                              <span className="text-red-600 text-[2rem]">
                                {formatPrice(order.totalAmount)}
                              </span>
                            </p>
                            <div className="mt-[2.5rem] flex items-center space-x-4">
                              {order.status === OrderStatus.CANCELLED && (
                                <button
                                  type="button"
                                  className="px-[2rem] py-[.6rem] border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-md text-gray-500 cursor-pointer"
                                  onClick={() =>
                                    setOpenCancelledOrder({
                                      open: true,
                                      orderCode: order.orderCode,
                                      data: order,
                                    })
                                  }
                                >
                                  Chi tiết hủy đơn
                                </button>
                              )}
                              {order.status === OrderStatus.PENDING && (
                                <button
                                  type="button"
                                  className="px-[2rem] py-[.6rem] border border-gray-300 hover:bg-gray-50 rounded-md text-gray-500 cursor-pointer"
                                  onClick={() =>
                                    setOpenCancelledOrder({
                                      open: true,
                                      orderCode: order.orderCode,
                                      data: null,
                                    })
                                  }
                                >
                                  Hủy đơn hàng
                                </button>
                              )}
                              {order.status === OrderStatus.SHIPPING && (
                                <>
                                  <button
                                    type="button"
                                    className="px-[2rem] py-[.6rem] bg-red-500 rounded-md text-white cursor-pointer"
                                    onClick={() =>
                                      setOpenDetailOrder({
                                        open: true,
                                        data: order,
                                      })
                                    }
                                  >
                                    Chi tiết đơn vận
                                  </button>
                                  <button
                                    type="button"
                                    className="px-[2rem] py-[.6rem] border border-amber-500 text-amber-600 rounded-md cursor-pointer"
                                    onClick={() =>
                                      setOpenConfirmReceived({
                                        open: true,
                                        data: order,
                                      })
                                    }
                                  >
                                    Đã nhận được hàng
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-[5rem]">
                    <img src={noOrder} alt="no order" className="w-[20rem]" />
                    <p className="text-gray-600 mt-[1em]">
                      Không có đơn hàng nào
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      <Review
        open={openReview.open}
        item={openReview.data}
        onClose={() => setOpenReview({ open: false, data: null })}
        refetch={refetch}
      />

      {
        <CancelOrder
          open={openCancelledOrder.open}
          onClose={() =>
            setOpenCancelledOrder({ open: false, orderCode: null, data: null })
          }
          orderCode={openCancelledOrder.orderCode}
          refetch={refetch}
          status={openCancelledOrder?.data?.status}
          cancelReason={openCancelledOrder?.data?.reason}
          cancelledAt={openCancelledOrder.data?.updatedAt}
          cancelledBy={openCancelledOrder.data?.customerName}
        />
      }

      <ConfirmReceivedOrder
        open={openConfirmReceived.open}
        onClose={() => setOpenConfirmReceived({ open: false, data: null })}
        data={openConfirmReceived.data}
        refetch={refetch}
      />
    </>
  );
}

export default CustomerOrder;
