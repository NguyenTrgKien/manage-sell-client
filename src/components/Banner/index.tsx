import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const listSale = [
    {
        id: 1,
        url: "https://salt.tikicdn.com/cache/w750/ts/tikimsp/77/a4/ac/67f960eb5f51b581d8a42f0cca234cdf.png.webp",
        alt: "Ảnh banner"
    },
    {
        id: 2,
        url: "https://salt.tikicdn.com/cache/w750/ts/tikimsp/63/7a/8c/b00d3848cfbb6bc9faf0dcf9f2f9263c.png.webp",
        alt: "Ảnh banner"
    },
    {
        id: 3,
        url: "https://salt.tikicdn.com/cache/w750/ts/tikimsp/77/a4/ac/67f960eb5f51b581d8a42f0cca234cdf.png.webp",
        alt: "Ảnh banner"
    },
    {
        id: 2,
        url: "https://salt.tikicdn.com/cache/w750/ts/tikimsp/63/7a/8c/b00d3848cfbb6bc9faf0dcf9f2f9263c.png.webp",
        alt: "Ảnh banner"
    },
]

function Banner() {
    return ( 
        <div className="rounded-[.5rem] bg-white p-[2rem]">
            <div className="relative w-full">
                <button className="custom-prev-btn absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                    &larr;
                </button>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={2}
                    slidesPerGroup={2}
                    breakpoints={{
                        320: { 
                            slidesPerView: 1,
                            slidesPerGroup: 1
                        },
                        768: { 
                            slidesPerView: 2,
                            slidesPerGroup: 2 
                        },
                    }}
                    navigation={{
                        nextEl: '.custom-next-btn',
                        prevEl: '.custom-prev-btn'
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="w-full cursor-pointer"
                >
                    {listSale.map((img) => (
                        <SwiperSlide 
                            key={img.id}
                        >
                            <a href="/">
                                <img    
                                    src={img.url}
                                    alt={img.alt}
                                    className="w-full h-auto rounded-[.5rem]"
                                />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button className="custom-next-btn absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                    &rarr;
                </button>
            </div>
        </div>
    );
}

export default Banner;