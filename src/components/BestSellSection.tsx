import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCartPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import type { ProductT } from "../utils/types";
import { getBestSell } from "../api/product.api";
import AddCart from "./AddCart";

function BestSellSection() {
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
    queryKey: ["bestsell", queryDefault],
    queryFn: () => getBestSell(queryDefault),
  });
  const bestSells = data?.data ?? [];

  return (
    <section className="mt-[2rem] rounded-[.5rem] bg-white p-[1.5rem] md:p-[2rem]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[1.4rem] md:text-[1.8rem] font-bold text-pink-500">
          Sản phẩm bán chạy
        </h4>
        <Link
          to={`/products?sort=best_seller`}
          className="flex items-center space-x-1 text-gray-500 text-[1.2rem] md:text-[1.6rem] hover:underline"
        >
          <span>Xem tất cả</span>
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </div>

      <div className="relative ">
        <button className="hidden lg:block bestsell-prev absolute top-1/2 -left-4 xl:-left-6 z-10 -translate-y-1/2 bg-gray-50 hover:bg-gray-100 hover:scale-[1.1] p-2 xs:p-3 sm:p-4 rounded-full shadow-xl transition-all group">
          <FontAwesomeIcon icon={faAngleLeft} className="hover:text-[1.8rem]" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".bestsell-next",
            prevEl: ".bestsell-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              pagination: false,
              spaceBetween: 5,
            },
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              pagination: false,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 10,
              navigation: true,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 10,
              navigation: true,
            },
            1280: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 10,
              navigation: true,
            },
          }}
          className="popular-swiper !py-6 !px-4"
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-product animate-pulse">
                    <div className="h-[18rem] md:h-[20rem] bg-gray-200 rounded-xl mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </SwiperSlide>
              ))
            : bestSells.map((product: ProductT) => (
                <SwiperSlide
                  key={product.id}
                  className="group bg-white cursor-pointer relative overflow-hidden border border-gray-200"
                  onClick={() => navigate(`/product-detail/${product.slug}`)}
                >
                  <div className="relative h-[16rem] md:h-[20rem] lg:h-[24rem] overflow-hidden">
                    <img
                      src={
                        product.mainImage || "https://via.placeholder.com/300"
                      }
                      alt={product.productName || "Sản phẩm flash sale"}
                      className="w-full h-full object-cover group-hover:scale-[1.1] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5">
                    <div className="text-left">
                      <h5 className="text-limit-1 text-[1.2rem] md:text-[1.6rem] text-gray-700 font-medium">
                        {product.productName}
                      </h5>
                      <p className="mt-2 text-red-600 text-[1.4rem] md:text-[1.6rem]">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end gap-2.5 mt-4">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1 py-2 px-4 border text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white rounded-md text-[1.2rem] md:text-[1.4rem] transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddCart({ open: true, data: product });
                        }}
                      >
                        Thêm{" "}
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1 py-2 px-4 border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md text-[1.2rem] md:text-[1.4rem] transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product-detail/${product.slug}`);
                        }}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>

        <button className="hidden lg:block bestsell-next absolute top-1/2 -right-4 xl:-right-6 z-10 -translate-y-1/2 bg-gray-50 hover:bg-gray-100 hover:scale-[1.1] p-2 xs:p-3 sm:p-4 rounded-full shadow-xl transition-all group">
          <FontAwesomeIcon
            icon={faAngleRight}
            className="hover:text-[1.8rem]"
          />
        </button>
      </div>

      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </section>
  );
}

export default BestSellSection;
