import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OrderStatus } from "@my-project/shared";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrders } from "../../../../api/order.api";
import Loading from "../../../../components/Loading";
import type { OrderType } from "../../../Dashboard/order/ListOrders";
import { getStatusConfig } from "../../../../configs/getOrderStatusConfig";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import Review from "../../../../components/Review";
import noOrder from "../../../../assets/images/cart_empty.png";

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
    status: OrderStatus;
  }>({
    searchOrders: "",
    status: OrderStatus.PENDING,
  });
  const [searchOrders, setSearchOrders] = useState("");
  const [currentStatus, setCurrentStatus] = useState(OrderStatus.PENDING);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [openReview, setOpenReview] = useState<{
    open: boolean;
    data: null | OrderType;
  }>({
    open: false,
    data: null,
  });
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const statusKeys = useMemo(
    () => Object.keys(orderStatusMap) as OrderStatus[],
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

  return (
    <>
      <div className="sticky top-0 pt-[2rem] bg-white">
        <ul
          className={`relative w-full flex items-center border-b border-b-gray-300`}
        >
          {statusKeys.map((key, index) => {
            const value = orderStatusMap[key as OrderStatus];
            const isActive = key === currentStatus;

            return (
              <li
                key={key}
                ref={setLiRef(index)}
                className="px-[4rem] pb-[1.5rem] cursor-pointer select-none"
                onClick={() => {
                  setQueryOrders((prev) => ({
                    ...prev,
                    status: key,
                  }));
                  setCurrentStatus(key as OrderStatus);
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
      <div className="px-[2rem] pb-[2rem]">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="mt-[2rem] space-y-8">
            {data.length > 0 ? (
              <>
                <div className="flex mt-[2rem] h-[4rem] w-full border border-gray-300 bg-white rounded-md">
                  <button
                    type="button"
                    className="pl-[1.5rem] text-gray-500"
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
                    placeholder="Bạn có thể tìm kiếm theo ID, tên sản phẩm"
                    className="w-full h-full rounded-md outline-none pl-[1.5rem]"
                    onChange={(e) => setSearchOrders(e.target.value)}
                  />
                </div>
                {data?.map((order: OrderType) => {
                  return (
                    <div
                      key={order.id}
                      className="shadow-md p-[1.5rem] border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center justify-end mb-[1.5rem]">
                        <p className="text-[1.4rem] text-gray-600 pr-[1rem] mr-[1rem] border-r border-r-gray-300">
                          Ngày đặt:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
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
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between pb-[2rem] mb-[2rem] border-b border-b-gray-300 cursor-pointer"
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
                                      Size {item.variant.variantSize.name}, Màu{" "}
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
                          {order.status === OrderStatus.COMPLETED && (
                            <button
                              type="button"
                              className="px-[2rem] py-[.6rem] bg-red-500 rounded-md text-white cursor-pointer"
                            >
                              Mua lại
                            </button>
                          )}
                          {order.status === OrderStatus.PENDING && (
                            <button
                              type="button"
                              className="px-[2rem] py-[.6rem] border border-gray-300 hover:bg-gray-50 rounded-md text-gray-500 cursor-pointer"
                            >
                              Hủy đơn hàng
                            </button>
                          )}
                          {order.status === OrderStatus.SHIPPING && (
                            <button
                              type="button"
                              className="px-[2rem] py-[.6rem] bg-red-500 rounded-md text-white cursor-pointer"
                            >
                              Chi tiết đơn vận
                            </button>
                          )}
                          {order.status === OrderStatus.COMPLETED &&
                            order.orderItems.some(
                              (it) => it.evaluate.length === 0
                            ) && (
                              <button
                                type="button"
                                className="px-[2rem] py-[.6rem] flex items-center border border-amber-500 rounded-md text-amber-500 hover:text-amber-600 hover:border-amber-600 cursor-pointer"
                                onClick={() =>
                                  setOpenReview({ open: true, data: order })
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
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mt-[5rem]">
                <img src={noOrder} alt="no order" className="w-[20rem]"/>
                <p className="text-gray-600 mt-[1em]">Không có đơn hàng nào</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Review
        openReview={openReview}
        onClose={() => setOpenReview({ open: false, data: null })}
        refetch={refetch}
      />
    </>
  );
}

export default CustomerOrder;
