import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFlashsaleBySlug } from "../../../api/flashsale.api";
import type { FlashSale } from "../../../utils/flashsale.type";
import { useEffect, useState } from "react";
import { calculatorTimeLeft } from "../../../utils/calculateTimeLeft";

function FlashSaleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const { data, isLoading, error } = useQuery({
    queryKey: ["flashSale", slug],
    queryFn: () => getFlashsaleBySlug(slug as string),
    enabled: !!slug,
  });
  const flashSale: FlashSale = data && data.data;
  const flashSaleProducts = data && flashSale && flashSale.flashSaleProduct;
  const days = Math.floor(timeLeft.hours / 24);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!flashSale) return;
    const updateTime = () => {
      const newTimes = calculatorTimeLeft(flashSale.endDate);
      setTimeLeft(newTimes);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [flashSale]);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  const calculateProgress = (sold: number, quantity: number) => {
    return Math.round((sold / quantity) * 100);
  };

  const Skeleton = () => {
    return (
      <div className="relative w-full h-auto bg-yellow-500">
        <div className="absolute top-0 left-0 w-full h-[50rem] z-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative w-[85%] mx-auto pt-[40rem] z-10">
          <div className="w-full h-auto bg-white shadow-xl rounded-xl p-8 pb-16">
            <div className="text-center mb-6">
              <div className="h-12 w-3/4 mx-auto bg-gray-300 rounded-lg animate-pulse mb-3" />
              <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="flex items-center justify-center gap-4 text-[1.4rem]">
              <div className="flex gap-3">
                {["hours", "minutes", "seconds"].map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-pink-300 to-red-300 rounded-lg px-4 py-4 min-w-[70px] animate-pulse" />
                    {idx !== 2 && (
                      <span className="text-[2.2rem] text-transparent">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-4" />{" "}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pt-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl p-4 shadow animate-pulse flex flex-col"
                  >
                    <div className="absolute top-2 right-2 h-8 w-16 bg-red-300 rounded-full" />

                    <div className="relative h-[18rem] md:h-[18rem] overflow-hidden rounded-lg mb-3 bg-gray-300" />

                    <div className="h-5 w-4/5 bg-gray-300 rounded mb-2" />

                    <div className="mt-2 flex items-center space-x-2 mb-6">
                      <div className="h-7 w-24 bg-red-300 rounded" />
                      <div className="h-5 w-20 bg-gray-200 rounded" />
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between mb-1">
                        <div className="h-4 w-24 bg-gray-300 rounded" />
                        <div className="h-4 w-12 bg-gray-300 rounded" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-300 h-full rounded-full w-3/5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-[20rem] md:mt-[17rem] px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem]">
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="relative w-full h-auto bg-yellow-500">
          <div className="absolute top-0 left-0 w-full h-[50rem] z-0">
            <img
              src={flashSale.bannerImage}
              alt={"Hỉnh ảnh flashSale"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-[85%] h-[50rem] z-100 mx-auto pt-[30rem]">
            <div className="w-full h-auto bg-white shadow-xl rounded-xl p-8 pb-16">
              <div className="text-center mb-6">
                <h3 className="text-[2.5rem] font-bold text-red-600">
                  {flashSale.name} - Giảm {flashSale.discount}%
                </h3>
                <p>{flashSale.description} đoạn mô tả</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-[1.4rem]">
                <div className="flex gap-3">
                  {timeLeft.hours > 24 ? (
                    <div className="bg-gradient-to-tr from-red-500 to-pink-500 rounded-lg px-4 py-2 text-center min-w-[70px] text-white">
                      Còn lại {days} ngày
                    </div>
                  ) : (
                    ["hours", "minutes", "seconds"].map((unit, idx) => (
                      <div className="flex items-center space-x-4" key={idx}>
                        <div
                          key={idx}
                          className="bg-gradient-to-tr from-pink-600 to-red-500 rounded-lg px-4 py-2 text-center min-w-[70px] text-white"
                        >
                          <div className=" text-white">
                            {String(
                              timeLeft[unit as keyof typeof timeLeft]
                            ).padStart(2, "0")}
                          </div>
                        </div>
                        {idx !== 2 && <span className="text-[2.2rem]">:</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="mt-8">
                <h4>Danh sách sản phẩm</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pt-4">
                  {flashSaleProducts && flashSaleProducts.length > 0 ? (
                    flashSaleProducts.map((fsp) => {
                      const product = fsp.product;
                      const progress = calculateProgress(
                        fsp.sold,
                        fsp.quantity
                      );
                      return (
                        <Link
                          key={product.id}
                          to={`/product-detail/${product.slug}`}
                          className="group bg-white rounded-xl p-4 shadow hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col"
                        >
                          <div className="text-[1.4rem] absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full shadow">
                            -{flashSale.discount}%
                          </div>

                          <div className="relative h-[18rem] md:h-[18rem] overflow-hidden rounded-lg mb-3">
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
                            <h5 className="text-gray-700 line-clamp-1">
                              {product.productName || `Sản phẩm ${product.id}`}
                            </h5>

                            <div className="mt-2 flex items-center space-x-2 mb-6">
                              <p className="text-red-600 text-[1.4rem] font-bold">
                                {formatPrice(fsp.sale_price)}
                              </p>
                              <p className="text-gray-400 line-through text-[1.2rem]">
                                {formatPrice(fsp.origin_price)}
                              </p>
                            </div>

                            <div className="mt-auto">
                              <div className="flex justify-between text-[1.2rem] mb-1">
                                <span>
                                  Đã bán {fsp.sold}/{fsp.quantity}
                                </span>
                                <span className="font-bold text-red-500">
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
                    <div className="py-25 text-center">
                      Không có sản phẩm nào
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashSaleDetail;
