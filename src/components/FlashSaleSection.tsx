import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { getFlashsales } from "../api/flashsale.api";
import { getStatusBadge } from "../page/Dashboard/flashsale";
import type { FlashSale, FlashSaleProduct } from "../utils/flashsale.type";
import { Link } from "react-router-dom";
import { calculatorTimeLeft } from "../utils/calculateTimeLeft";

const FlashSaleSection = () => {
  const [queryInput] = useState({
    limit: 4,
    page: 1,
    name: "",
    status: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["flashsales", queryInput],
    queryFn: () => getFlashsales(queryInput),
  });
  const [timeLefts, setTimeLefts] = useState<
    Record<number, { hours: number; minutes: number; seconds: number }>
  >({});

  const flashsaleEvents: FlashSale[] = useMemo(() => {
    return data?.data;
  }, [data?.data]);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  const calculateProgress = (sold: number, quantity: number) => {
    return Math.round((sold / quantity) * 100);
  };

  useEffect(() => {
    if (!flashsaleEvents || flashsaleEvents.length === 0) return;
    const updateTime = () => {
      const newTimes: Record<number, any> = {};
      flashsaleEvents.forEach((event) => {
        newTimes[event.id] = calculatorTimeLeft(event.endDate);
      });
      setTimeLefts(newTimes);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [flashsaleEvents]);

  if (isLoading) {
    return <div className="text-center py-10">Đang tải flash sale...</div>;
  }

  if (flashsaleEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 mt-8">
      {flashsaleEvents ? (
        flashsaleEvents.map((event) => {
          const timeLeft = timeLefts[event.id] || {
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
          const flashSaleProducts = event.flashSaleProduct?.slice(0, 5) || [];
          const days = Math.floor(timeLeft.hours / 24);
          return (
            <section
              key={event.id}
              className="relative rounded-2xl overflow-hidden shadow-xl py-12 md:py-20 lg:py-25 px-4 md:px-8 lg:px-14 z-0"
              style={{
                background: `url(${event.bannerImage})`,
              }}
            >
              <div className="absolute inset-0 bg-black/10 z-0"></div>
              <div className="relative p-6 md:p-8 z-100 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white">
                      {event.name} - Giảm {event.discount}%
                    </h4>
                    <p className="text-yellow-200 mt-3">
                      {getStatusBadge(event.status)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[1.4rem]">
                    <span className="text-white font-medium ">
                      Kết thúc sau:
                    </span>
                    <div className="flex gap-3">
                      {timeLeft.hours > 24 ? (
                        <div className="bg-white/90 rounded-lg px-4 py-2 text-center min-w-[70px] text-red-600">
                          {days} ngày
                        </div>
                      ) : (
                        ["hours", "minutes", "seconds"].map((unit, idx) => (
                          <div
                            key={idx}
                            className="bg-white/90 rounded-lg px-4 py-2 text-center min-w-[70px]"
                          >
                            <div className=" text-red-600">
                              {String(
                                timeLeft[unit as keyof typeof timeLeft],
                              ).padStart(2, "0")}
                            </div>
                            <div>
                              {unit === "hours"
                                ? "Giờ"
                                : unit === "minutes"
                                  ? "Phút"
                                  : "Giây"}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pt-6">
                  {flashSaleProducts.length > 0 ? (
                    flashSaleProducts.map((fsp: FlashSaleProduct) => {
                      const progress = calculateProgress(
                        fsp.sold,
                        fsp.quantity,
                      );
                      const product = fsp.product;

                      return (
                        <Link
                          key={product.id}
                          to={`/product-detail/${product.slug}`}
                          className="group bg-white rounded-xl p-4 shadow hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col"
                        >
                          <div className="text-[1.4rem] absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full shadow">
                            -{event.discount}%
                          </div>

                          <div className="relative h-[14rem] md:h-[18rem] lg:h-[22rem] overflow-hidden rounded-lg mb-3">
                            <img
                              src={
                                product.mainImage ||
                                "https://via.placeholder.com/300"
                              }
                              alt={product.productName || "Sản phẩm flash sale"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          <div className="flex flex-col flex-1">
                            <h5 className="text-gray-700 line-clamp-2 text-[1.4rem] md:text-[1.5rem] lg:text-[1.6rem]">
                              {product.productName || `Sản phẩm ${product.id}`}
                            </h5>

                            <div className="mt-2 flex items-center space-x-2 pb-5">
                              <p className="text-red-600 text-[1.2rem] md:text-[1.4rem] font-bold">
                                {formatPrice(fsp.sale_price)}
                              </p>
                              <p className="text-gray-400 line-through text-[1rem] md:text-[1.2rem]">
                                {formatPrice(fsp.origin_price)}
                              </p>
                            </div>

                            <div className="mt-auto">
                              <div className="flex justify-between text-[1rem] md:text-[1.2rem] mb-1">
                                <span>
                                  Đã bán {fsp.sold}/{fsp.quantity}
                                </span>
                                <span className="text-red-500">
                                  {progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-full rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-white text-[1.4rem] md:text-[1.6rem] py-25 text-center">
                      Chưa có sản phẩm trong chương trình này
                    </p>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to={`/flash-sale/${event.slug}`}
                    className="inline-block px-10 py-4 bg-white text-red-600 rounded-full text-[1.4rem] md:text-[1.6rem] hover:bg-red-100 transition shadow-lg"
                  >
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default FlashSaleSection;
