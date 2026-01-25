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
import {
  faAngleRight,
  faCartPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import AddCart from "../AddCart";
import { Link, useNavigate } from "react-router-dom";

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
        <h4 className="text-[1.4rem] md:text-[1.8rem] font-bold text-blue-500">
          Sản phẩm nổi bật
        </h4>
        <Link
          to={`/products?sort=popular`}
          className="flex items-center space-x-1 text-gray-500 text-[1.2rem] md:text-[1.6rem] hover:underline"
        >
          <span>Xem tất cả</span>
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </div>

      <div className="relative">
        <button className="feature-prev-btn absolute top-1/2 left-2 md:left-4 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition hidden sm:flex items-center justify-center w-10 h-10">
          <span className="text-2xl">&larr;</span>
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".popular-next",
            prevEl: ".popular-prev",
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
              slidesPerView: 4,
              slidesPerGroup: 4,
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
            : populars.map((product: ProductT) => (
                <SwiperSlide
                  key={product.id}
                  className="group bg-white rounded-xl p-4 shadow hover:shadow-lg cursor-pointer relative overflow-hidden"
                >
                  <Link
                    to={`/product-detail/${product.slug}`}
                    className="block relative w-full h-[14rem] md:h-[18rem] lg:h-[22rem] overflow-hidden rounded-xl"
                  >
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-3 py-1 text-white text-sm font-semibold">
                      Hot
                    </div>

                    <div className="relative h-[14rem] md:-[18rem] lg:h-[22rem] md:h-full overflow-hidden rounded-lg mb-3">
                      <img
                        src={
                          product.mainImage || "https://via.placeholder.com/300"
                        }
                        alt={product.productName || "Sản phẩm flash sale"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform rounded-xl"
                      />
                    </div>

                    <div className="hidden xl:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="hidden xl:flex absolute w-full h-[4rem] bottom-[.5rem] right-[50%] translate-x-[50%] gap-[1rem] items-center justify-center rounded-xl translate-y-[4.5rem] group-hover:translate-y-0 transition duration-300">
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
                        <span className="text-[1.4rem] text-gray-600">
                          Thêm
                        </span>
                      </button>
                      <button
                        className="w-[4rem] h-[3.4rem] flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-md cursor-pointer transition duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product-detail/${product.slug}`);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-[2rem] text-white"
                        />
                      </button>
                    </div>
                  </Link>

                  <div className="mt-4 px-2 text-left">
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
                  <div className="flex items-center xl:hidden gap-x-4 justify-end mt-2.5">
                    <button
                      className="hidden md:block text-blue-600 hover:text-blue-700 text-[1.2rem] mdtext-[1.4rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product-detail/${product.slug}`);
                      }}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="w-[8rem] md:w-[10rem] h-[3rem] md:h-[3.4rem] text-[1.2rem] mdtext-[1.4rem] bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer transition duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddCart({ open: true, data: product });
                      }}
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                      <span>Thêm</span>
                    </button>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>

        <button className="feature-next-btn absolute top-1/2 right-2 md:right-4 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition hidden sm:flex items-center justify-center w-10 h-10">
          <span className="text-2xl">&rarr;</span>
        </button>
      </div>

      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </section>
  );
}

export default PopularProduct;
