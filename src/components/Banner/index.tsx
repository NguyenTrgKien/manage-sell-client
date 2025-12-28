import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getListBanner } from "../../api/ui.api";
import type { BannerType } from "../../utils/ui.type";
import { Link } from "react-router-dom";

function Banner() {
  const { data: listBanner = [], isLoading: isLoadingListBanner } = useQuery({
    queryKey: ["listBanner"],
    queryFn: () => getListBanner(),
  });

  const SkeletonSlide = () => (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 animate-pulse">
      <div className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[540px] bg-gray-200" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <div className="h-8 sm:h-9 md:h-10 bg-gray-300 rounded w-full sm:w-3/4 mb-2 sm:mb-3" />
        <div className="h-6 sm:h-7 bg-gray-300 rounded w-2/3 sm:w-1/2 mb-4 sm:mb-6" />
        <div className="h-10 sm:h-12 bg-gray-300 rounded-full w-32 sm:w-40" />
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-white shadow-lg overflow-hidden px-2 xs:px-4 sm:px-8 md:px-4 lg:px-0">
      <div className="relative w-full">
        <button className="custom-prev-btn hidden lg:block absolute top-1/2 -left-4 xl:-left-6 z-10 -translate-y-1/2 bg-white/90 hover:bg-pink-500 p-2 xs:p-3 sm:p-4 rounded-full shadow-xl transition-all group">
          <svg
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-gray-700 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          navigation={{
            nextEl: ".custom-next-btn",
            prevEl: ".custom-prev-btn",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            renderBullet: function (index, className) {
              return `<span class="${className} !bg-gray-300 hover:!bg-pink-500"></span>`;
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full"
        >
          {isLoadingListBanner ? (
            <>
              <SwiperSlide>
                <SkeletonSlide />
              </SwiperSlide>
              <SwiperSlide>
                <SkeletonSlide />
              </SwiperSlide>
            </>
          ) : (
            listBanner.map((banner: BannerType) => (
              <SwiperSlide key={banner.id}>
                <Link
                  to={banner.link || "/"}
                  className="block relative overflow-hidden group cursor-pointer"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute top-3 xs:top-4 sm:top-6 right-3 xs:right-4 sm:right-6 bg-red-600 text-white px-3 xs:px-4 sm:px-6 py-1 xs:py-2 sm:py-3 rounded-full text-xs xs:text-sm sm:text-base md:text-lg font-bold animate-pulse shadow-lg whitespace-nowrap">
                    NEW
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 xs:mb-3 leading-tight">
                      {banner.title}
                    </h3>
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-4 xs:mb-6 max-w-full sm:max-w-xl md:max-w-2xl line-clamp-2 xs:line-clamp-none">
                      {banner.subTitle}
                    </p>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 xs:py-3 sm:py-4 px-6 xs:px-8 sm:px-10 rounded-full text-sm xs:text-base sm:text-lg inline-flex items-center gap-2 xs:gap-3 transition-all transform hover:scale-105 shadow-lg">
                      Mua ngay
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs xs:text-sm sm:text-base"
                      />
                    </button>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          )}
        </Swiper>

        <button className="custom-next-btn hidden lg:block absolute top-1/2 -right-4 xl:-right-6 z-10 -translate-y-1/2 bg-white/90 hover:bg-pink-500 p-2 xs:p-3 sm:p-4 rounded-full shadow-xl transition-all group">
          <svg
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-gray-700 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="swiper-pagination mt-2 xs:mt-3 sm:mt-4 flex justify-center"></div>
    </div>
  );
}

export default Banner;
