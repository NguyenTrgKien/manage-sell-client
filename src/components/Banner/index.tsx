import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const listSale = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
    alt: "Flash Sale Thời Trang",
    title: "FLASH SALE 50%",
    subtitle: "Bộ sưu tập mùa đông 2024",
    badge: "HOT",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop",
    alt: "Thời Trang Nữ",
    title: "THỜI TRANG NỮ",
    subtitle: "Thanh lịch - Sang trọng",
    badge: "NEW",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop",
    alt: "Giày Sneaker",
    title: "GIÀY SNEAKER",
    subtitle: "Phong cách năng động",
    badge: "SALE",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    alt: "Áo Thun Nam",
    title: "ÁO THUN NAM",
    subtitle: "Thoải mái mỗi ngày",
    badge: "-40%",
  },
];

function Banner() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="relative w-full">
        <button className="custom-prev-btn absolute top-1/2 -left-4 z-10 transform -translate-y-1/2 bg-white hover:bg-pink-500 p-3 rounded-full shadow-lg cursor-pointer transition-all group hover:scale-110">
          <svg
            className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors"
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
          spaceBetween={20}
          slidesPerView={2}
          slidesPerGroup={2}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
          }}
          navigation={{
            nextEl: ".custom-next-btn",
            prevEl: ".custom-prev-btn",
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "swiper-pagination-bullet-active !bg-pink-600",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full"
        >
          {listSale.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a
                href="/"
                className="block relative rounded-lg overflow-hidden group"
              >
                <img
                  src={banner.url}
                  alt={banner.alt}
                  className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-[1rem] font-bold animate-pulse">
                  {banner.badge}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-[2rem] font-bold mb-1">{banner.title}</h3>
                  <p className="text-[1.2rem] text-white/90 mb-3">
                    {banner.subtitle}
                  </p>
                  <button className="text-[1.2rem] bg-white text-gray-600 px-8 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 hover:text-white transition-all inline-flex items-center gap-2 transform group-hover:scale-105">
                    Mua ngay
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-next-btn absolute top-1/2 -right-4 z-10 transform -translate-y-1/2 bg-white hover:bg-pink-500 p-3 rounded-full shadow-lg cursor-pointer transition-all group hover:scale-110">
          <svg
            className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors"
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
    </div>
  );
}

export default Banner;
