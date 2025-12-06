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

function PopularProduct() {
  const [queryDefault, setQueryDefault] = useState<{
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
  const [detailProduct, setDetailProduct] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({ open: false, data: null });
  const { data, isLoading } = useQuery({
    queryKey: ["populars", queryDefault],
    queryFn: () => getPopular(queryDefault),
  });
  const populars = data?.data ?? [];

  return (
    <section className="mt-[2rem] rounded-[.5rem] bg-white p-[2rem]">
      <div className="flex items-center justify-between">
        <h4 className="text-[1.8rem] font-bold text-blue-500">
          Sản phẩm nổi bật
        </h4>
        <a href="/" className="text-blue-500">
          Xem tất cả &rarr;
        </a>
      </div>
      <div className="relative w-full">
        <button className="feature-prev-btn absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
          &larr;
        </button>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={4}
          slidesPerGroup={2}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 4,
              slidesPerGroup: 2,
            },
          }}
          navigation={{
            nextEl: ".feature-next-btn",
            prevEl: ".feature-prev-btn",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop={true}
          className="w-full cursor-pointer"
        >
          {populars.map((product: ProductT) => {
            return (
              <SwiperSlide
                key={product.id}
                className="rounded-xl border-[.1rem] border-gray-200 bg-white px-[.5rem] hover:shadow-xl my-[2rem] shadow-product"
              >
                <div className="relative w-full h-[20rem] group overflow-hidden">
                  <img
                    src={product.mainImage}
                    alt={`mainimage-${product.productName}`}
                    className="w-full h-full rounded-xl object-contain bg-white group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute w-full h-[4rem] bottom-[.5rem] right-[50%] translate-x-[50%] flex gap-[1rem] items-center justify-center rounded-xl translate-y-[4.5rem] group-hover:translate-y-0 transition duration-300">
                    <button
                      className="w-[10rem] h-[3.4rem] bg-white rounded-md cursor-pointer"
                      onClick={() =>
                        setShowAddCart({ open: true, data: product })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCartPlus}
                        className="text-[1.6rem] text-gray-600"
                      />
                      <span className="text-[1.4rem] text-gray-600">Thêm</span>
                    </button>
                    <button className="w-[4rem] h-[3.4rem] flex items-center justify-center bg-gray-800 rounded-md cursor-pointer">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-[2rem] text-white"
                      />
                    </button>
                  </div>
                </div>
                <div className="p-[.5rem] mt-[.5rem]">
                  <h5 className="text-limit-1 text-[1.6rem] text-gray-600">
                    {product.productName}
                  </h5>
                  <div className="flex flex-col mt-[.5rem]">
                    <span className="text-red-600 text-[1.6rem] font-bold">
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className="feature-next-btn absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
          &rarr;
        </button>
      </div>

      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </section>
  );
}

export default PopularProduct;
