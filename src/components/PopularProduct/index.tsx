import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { getPopular } from "../../api/product.api";
import type { ProductT } from "../../utils/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import AddCart from "../AddCart";
import { useNavigate } from "react-router-dom";

function PopularProduct() {
  const navigate = useNavigate();
  const [queryDefault] = useState<{
    limit: number;
    page: number;
  }>({
    limit: 10,
    page: 1,
  });
  const [showAddCart, setShowAddCart] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["populars", queryDefault],
    queryFn: () => getPopular(queryDefault),
  });
  const populars = data?.data ?? [];

  return (
    <section className="mt-[2rem] rounded-[.5rem] bg-white p-[1.5rem] md:p-[2rem]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[1.6rem] md:text-[1.8rem] font-bold text-blue-500">
          Sản phẩm nổi bật
        </h4>
        <a href="/" className="text-blue-500 text-[1.4rem] hover:underline">
          Xem tất cả &rarr;
        </a>
      </div>

      <div className="relative">
        {/* Nút Prev */}
        <button className="feature-prev-btn absolute top-1/2 left-2 md:left-4 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition hidden sm:flex items-center justify-center w-10 h-10">
          <span className="text-2xl">&larr;</span>
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".feature-next-btn",
            prevEl: ".feature-prev-btn",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            640: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1280: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
          }}
          className="popular-swiper py-8"
        >
          {isLoading
            ? // Skeleton loading - dùng SwiperSlide để đồng bộ layout
              Array.from({ length: 10 }).map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-product animate-pulse">
                    <div className="h-[18rem] md:h-[20rem] bg-gray-200 rounded-xl mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </SwiperSlide>
              ))
            : populars.map((product: ProductT) => (
                <SwiperSlide
                  key={product.id}
                  className="group rounded-xl border border-gray-200 bg-white px-2 py-4 shadow-product hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative w-full h-[18rem] md:h-[20rem] overflow-hidden rounded-xl">
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-3 py-1 text-white text-sm font-semibold">
                      Hot
                    </div>

                    <img
                      src={product.mainImage}
                      alt={product.productName}
                      className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay + Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute w-full h-[4rem] bottom-[.5rem] right-[50%] translate-x-[50%] flex gap-[1rem] items-center justify-center rounded-xl translate-y-[4.5rem] group-hover:translate-y-0 transition duration-300">
                    <button
                      className="w-[10rem] h-[3.4rem] bg-white hover:bg-gray-200 rounded-md cursor-pointer transition duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddCart({ open: true, data: product });
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCartPlus}
                        className="text-[1.6rem] text-gray-600"
                      />
                      <span className="text-[1.4rem] text-gray-600">Thêm</span>
                    </button>
                    <button
                      className="w-[4rem] h-[3.4rem] flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-md cursor-pointer transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product-detail/${product.id}`);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-[2rem] text-white"
                      />
                    </button>
                  </div>
                  </div>

                  <div className="mt-4 px-2 text-center md:text-left">
                    <h5 className="text-limit-1 text-[1.4rem] md:text-[1.6rem] text-gray-700 font-medium">
                      {product.productName}
                    </h5>
                    <p className="mt-2 text-red-600 text-[1.5rem] md:text-[1.6rem] font-bold">
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>

        {/* Nút Next */}
        <button className="feature-next-btn absolute top-1/2 right-2 md:right-4 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition hidden sm:flex items-center justify-center w-10 h-10">
          <span className="text-2xl">&rarr;</span>
        </button>
      </div>

      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </section>
  );
}

export default PopularProduct;