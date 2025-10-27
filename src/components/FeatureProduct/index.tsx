import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faStar } from "@fortawesome/free-solid-svg-icons";

const listProduct = [
    {
        id: 1,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 2,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://dienmaythudo.vn/wp-content/uploads/2021/05/3-org.jpg',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 3,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 4,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://dienmaythudo.vn/wp-content/uploads/2021/05/3-org.jpg',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 5,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 6,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 1,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://dienmaythudo.vn/wp-content/uploads/2021/05/3-org.jpg',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    },
    {
        id: 2,
        name: "Điện thoại iphone 17 Promax",
        description: "Điện thoại nâng cấp thế hệ mới",
        image: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-17-pro-256-gb.png',
        price: "52.000.000đ",
        oldPrice: "59.000.000",
        sale: "none"
    }
]

function FeatureProduct() {
    return (  
        <section
            className="mt-[2rem] rounded-[.5rem] bg-white p-[2rem]"
        >
            <div className="flex items-center justify-between">
                <h4 className="text-[1.8rem] font-bold text-blue-500">
                    Sản phẩm nổi bật
                </h4>
                <a  
                    href="/" 
                    className="text-blue-500"
                >
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
                    slidesPerView={5}
                    slidesPerGroup={4}
                    breakpoints={{
                        320: { 
                            slidesPerView: 1,
                            slidesPerGroup: 1
                        },
                        768: { 
                            slidesPerView: 5,
                            slidesPerGroup: 4 
                        },
                    }}
                    navigation={{
                        nextEl: '.feature-next-btn',
                        prevEl: '.feature-prev-btn'
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="w-full cursor-pointer"
                >   
                {   
                    listProduct.map((product) => {
                        return (
                            <SwiperSlide
                                key={product.id}
                                className="rounded-[1rem] border-[.1rem] border-gray-300 bg-white p-[.5rem] hover-product my-[2rem]"
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-[15rem] rounded-[1rem] object-contain bg-white" 
                                />
                                <div
                                    className="p-[1rem]"
                                >
                                    <h5 
                                        className="text-limit-1 text-[1.4rem] font-bold text-green-800"
                                    >{product.name}</h5>
                                    <p className="text-[1.2rem] text-limit-1 my-[.5rem]">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-[.1rem]" >
                                        {
                                            [1,2,3,4,5].map((star) => {
                                                return (
                                                    <FontAwesomeIcon key={star} icon={faStar} className="text-[1rem] text-yellow-500"/>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="flex flex-col mt-[1rem]">
                                        <span className="text-red-600">
                                            {product.price}
                                        </span>
                                        <div className="flex items-center gap-[.5rem]">
                                            <span className="text-[1.2rem] px-[.5rem] py-[.2rem] bg-gray-200 rounded-[.8rem]">17%</span>
                                            <span className="text-[1.2rem] line-through">
                                                {product.oldPrice}
                                            </span>
                                        </div>
                                        <button className="w-full h-[3rem] rounded-[.5rem] bg-green-600 text-white mt-[1rem] outline-none cursor-pointer text-[1.4rem] hover:bg-green-700 hover-linear">
                                            Thêm vào giỏ <FontAwesomeIcon icon={faCartPlus} className="text-[1.4rem] pl-[.5rem]"/>
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
                </Swiper>
                <button className="feature-next-btn absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                    &rarr;
                </button>
            </div>
        </section>
    );
}

export default FeatureProduct;