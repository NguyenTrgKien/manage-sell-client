import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductDetail } from "../../../api/product.api";
import type {
  CategoriesType,
  ProductT,
  VariantColorType,
  VariantSizeType,
} from "../../../utils/types";
import Loading from "../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCartPlus,
  faMinus,
  faPlus,
  faShirt,
  faShoePrints,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import Notify from "../../../components/Notify";
import { useAddCart } from "../../../hooks/useAddCart";
import EvaluateProduct from "../../../components/EvaluateProduct";
import { getFlashSaleForProduct } from "../../../api/flashsale.api";
import { calculatorTimeLeft } from "../../../utils/calculateTimeLeft";

function ProductDetail() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();

  const { data, isLoading: LoadingData } = useQuery({
    queryKey: ["productdetail", productSlug],
    queryFn: () => getProductDetail(productSlug),
    enabled: !!productSlug,
  }) as any;
  const { data: flashSaleForProduct, isLoading: isLoadingFsForProduct } =
    useQuery({
      queryKey: ["flashSaleForProduct"],
      queryFn: () => getFlashSaleForProduct(productSlug as string),
    });
  const flashSale = flashSaleForProduct && flashSaleForProduct.data;
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const days = Math.floor(timeLeft.hours / 24);
  const product: ProductT = data?.product;
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const { addToCart, isLoading, notify, setNotify } = useAddCart();
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const colors = useMemo(() => {
    const map = new Map();
    product?.variants?.forEach((v) =>
      map.set(v.variantColor.id, v.variantColor),
    );
    return [...map.values()];
  }, [product]);
  const sizes = useMemo(() => {
    const map = new Map();
    product?.variants?.forEach((v) => map.set(v.variantSize.id, v.variantSize));
    return [...map.values()];
  }, [product]);

  useEffect(() => {
    if (product) {
      if (product.mainImage && product.listImageProduct) {
        const listImage =
          product.listImageProduct.map((it) => it.imageUrl) || [];
        const filteredImages = listImage.filter(
          (img) => img !== product.mainImage,
        );
        setImages([product.mainImage, ...filteredImages]);
      }
    }
  }, [product]);

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
    if (timeLeft.hours >= 24) return;
    const timer = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSale, timeLeft.hours]);

  const calculateFlashPrice = (
    originPrice: number,
    discountPercent: number,
  ) => {
    return Math.round(originPrice * (1 - discountPercent / 100));
  };

  const getMaxInventory = () => {
    const found = product?.variants.find((it) => {
      return (
        it.variantColor.id === selectVariantColor?.id &&
        it.variantSize.id === selectVariantSize?.id
      );
    });

    return found?.inventory ?? 0;
  };

  const isQuantity = selectVariantColor && selectVariantSize;
  const TotalInventory = product?.variants.reduce((init, curr) => {
    return init + curr.inventory;
  }, 0);
  const maxQuantity = getMaxInventory();

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getProductIcon = () => {
    const category = product.category.categoryName?.toUpperCase() || "";
    if (category.includes("giày") || category.includes("dép")) {
      return faShoePrints;
    }
    return faShirt;
  };

  const handleAddCartOrBuyNow = async (action: "add" | "buy") => {
    setMessage(null);
    if (!selectVariantColor || !selectVariantSize) {
      setMessage("Vui lòng chọn thuộc tính sản phẩm!");
      return;
    }
    const variantId = product?.variants.find(
      (v: any) =>
        v.variantColor.id === selectVariantColor.id &&
        v.variantSize.id === selectVariantSize.id,
    )?.id;

    if (quantity <= 0) {
      setMessage("Số lượng sản phẩm ít nhất là 1!");
    }
    const dataRequest = {
      variantId: variantId,
      quantity: quantity,
    };

    addToCart([dataRequest]);
    if (action === "buy") {
      navigate(`/cart/detail?buyNowVariant=${variantId}`);
    }
  };

  const RenderCateParent = ({
    parent,
    slugsChain,
  }: {
    parent: CategoriesType;
    slugsChain: string[];
  }) => {
    const hasParent = parent.parent;
    const urlChain = [...parent.slug, ...slugsChain];
    return (
      <div>
        {hasParent && (
          <RenderCateParent parent={parent.parent} slugsChain={urlChain} />
        )}
        <Link to={`/${parent.slug}`} className="block space-x-2 text-blue-800 ">
          <span>{parent.categoryName}</span>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-gray-400 cursor-pointer"
          />
        </Link>
      </div>
    );
  };

  const handleNext = () => {
    setIndex((prev) => {
      if (prev + 1 > images.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  const handlePrev = () => {
    setIndex((prev) => {
      if (prev - 1 < 0) {
        return images.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  if (LoadingData) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-auto px-[1rem] md:px-[3rem] xl:px-[12rem]">
      <div className="w-full flex flex-wrap items-center gap-1 sm:gap-2 text-[1.2rem] md:text-[1.4rem] px-2 sm:px-4 md:px-6 lg:px-[3rem] md:py-2 py-1">
        <Link
          to="/"
          className="flex items-center gap-1 sm:gap-2 text-blue-800 hover:text-blue-600 transition-colors whitespace-nowrap"
        >
          <span>Home</span>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-gray-400 text-[0.8rem] sm:text-[1rem]"
          />
        </Link>

        {(() => {
          if (!product?.category) return null;

          const categories: CategoriesType[] = [];
          let current = product.category;

          while (current) {
            categories.push(current);
            current = current.parent;
          }

          return categories.reverse().map((cat, index) => (
            <div key={cat.id} className="flex items-center whitespace-nowrap">
              <Link
                to={`/category/${cat.slug}`}
                className="flex items-center hover:text-blue-600 transition-colors text-blue-800"
              >
                <span className="line-clamp-1 max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-none">
                  {cat.categoryName}
                </span>
              </Link>
              {index < categories.length - 1 && (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mx-1 sm:mx-2 text-gray-400 text-[0.8rem] sm:text-[1rem]"
                />
              )}
              <FontAwesomeIcon
                icon={faAngleRight}
                className="text-gray-400 text-[0.8rem] sm:text-[1rem]"
              />
            </div>
          ));
        })()}

        <span className="text-gray-600 line-clamp-1 max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px] xl:max-w-none">
          {product?.productName}
        </span>
      </div>
      <div className="w-full h-auto flex md:flex-row flex-col gap-[4rem] rounded-lg mt-[1rem] bg-white p-[1rem] md:p-[1.5rem]">
        <div className="relative w-full md:w-[40rem] xl:w-[50rem] h-auto">
          <img
            src={images[index]}
            alt={product?.productName}
            className="w-full md:h-[40rem] h-[35rem] xl:h-[50rem] object-cover"
          />

          <button
            onClick={handlePrev}
            className="absolute w-18 h-18 flex items-center justify-center top-1/2 left-2 -translate-y-1/2 text-gray-500 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-600 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faAngleLeft} className="text-[1.8rem]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute w-18 h-18 flex items-center justify-center top-1/2 right-2 -translate-y-1/2 text-gray-500 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-600 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faAngleRight} className="text-[1.8rem]" />
          </button>
          <div className="flex items-center space-x-4 mt-[1rem]">
            {images.map((imgItem, idx) => {
              return (
                <div
                  key={imgItem}
                  className={`w-[6rem] h-[6rem] md:w-[8rem] md:h-[8rem] rounded-md border ${index === idx ? "border-2 border-amber-500" : "border-gray-300"} `}
                  onClick={() => setIndex(idx)}
                >
                  <img
                    src={imgItem}
                    alt={`imageItem-${idx}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              );
            })}
          </div>
          {flashSale && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[1.4rem] px-4 py-1 rounded-tl-4xl rounded-br-4xl shadow-lg z-10">
              FLASH SALE -{flashSale.discount}%
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 md:space-y-4">
          <h3 className="text-[1.4rem] md:text-[2rem] xl:text-[2.2rem] text-gray-800">
            {product?.productName}
          </h3>
          <div className="flex items-center space-x-6 text-[1.2rem] md:text-[1.6rem]">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800">{product.averageRating}</span>
              <div className="flex items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      key={star}
                      className={`${
                        star <= product.averageRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="h-[1.5rem] border-r border-r-gray-400"></span>
            <p className="flex items-center space-x-2">
              <span className="text-gray-800">{product.reviewCount}</span>
              <span className=" text-gray-500">Đánh giá</span>
            </p>
            <span className="h-[1.5rem] border-r border-r-gray-400"></span>
            <div className="flex items-center space-x-2">
              <span className=" text-gray-500">Đã bán</span>
              <p className="text-gray-800">{product.soldCount}</p>
            </div>
          </div>
          {flashSale && (
            <div className="flex items-center">
              <div className="flex items-center gap-4 mt-4">
                <p className="text-red-600 text-[1.4rem] md:text-[2rem] xl:text-[2.2rem]">
                  {formatPrice(
                    calculateFlashPrice(product.price, flashSale.discount),
                  )}
                </p>

                <p className="text-gray-500 text-[1.4rem] md:text-[1.6rem] line-through">
                  {formatPrice(product.price)}
                </p>

                <span className="bg-red-600 text-white text-[1.2rem] md:text-[1.4rem] px-3 py-1 rounded-md">
                  -{flashSale.discount}%
                </span>
              </div>
            </div>
          )}
          {flashSale && (
            <div className="flex items-center gap-4 text-[1.4rem]">
              <div className="flex gap-3 text-[1.2rem] md:text-[1.4rem]">
                {timeLeft.hours > 24 ? (
                  <div className="bg-gradient-to-tr from-red-500 to-pink-500 rounded-lg px-4 py-2 text-center min-w-[70px] text-white ">
                    Thời hạn {days} ngày
                  </div>
                ) : (
                  ["hours", "minutes", "seconds"].map((unit, idx) => (
                    <div className="flex items-center space-x-2" key={idx}>
                      <div
                        key={idx}
                        className="bg-gradient-to-tr from-pink-600 to-red-500 rounded-lg px-3 py-1 text-center min-w-[70px] text-white"
                      >
                        <div className=" text-white">
                          {String(
                            timeLeft[unit as keyof typeof timeLeft],
                          ).padStart(2, "0")}
                        </div>
                      </div>
                      {idx !== 2 && <span className="text-[2.2rem]">:</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-4 mt-[2rem] text-[1.4rem] md:text-[1.6rem]">
            <span className="block text-gray-600 w-[12rem] text-start">
              Chọn màu
            </span>
            <div className="flex items-center gap-[1rem] flex-wrap">
              {colors?.map((color) => {
                return (
                  <button
                    key={color.id}
                    className={`flex items-center gap-[.5rem] px-[1rem] py-[.6rem] border-[.1rem] rounded-[.5rem] hover:border-blue-300 ${selectVariantColor?.id === color.id ? "border-[.1rem] bg-blue-50 border-blue-600" : "border-gray-300"} cursor-pointer`}
                    onClick={() => setSelectVariantColor(color)}
                  >
                    <FontAwesomeIcon
                      icon={getProductIcon()}
                      className="bg-gray-100 p-[.2rem]"
                      style={{ color: color.hexCode }}
                    />
                    <span className="text-[1.4rem] text-gray-600">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-start space-x-4 mt-[2rem] text-[1.4rem] md:text-[1.6rem]">
            <span className="block text-gray-600 w-[12rem] text-start">
              Chọn size
            </span>
            <div className="flex items-center gap-[1rem] flex-wrap">
              {sizes?.map((size: VariantSizeType) => {
                const disableSize = selectVariantColor
                  ? product.variants.find(
                      (it) =>
                        it.variantColor.id === selectVariantColor.id &&
                        it.variantSize.id === size?.id,
                    )
                  : false;

                return (
                  <button
                    key={size.id}
                    className={`flex items-center gap-[.5rem] px-[1rem] md:px-[2rem] py-[.4rem] md:py-[.6rem] border rounded-[.5rem] ${!disableSize ? "border-gray-200 text-gray-200" : selectVariantSize?.id === size.id ? "border-[.1rem] bg-blue-50 border-blue-600" : "border-gray-300"} cursor-pointer`}
                    disabled={!disableSize}
                    onClick={() => setSelectVariantSize(size)}
                  >
                    <span className="text-[1.4rem]">{size.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-start gap-[2rem] mt-[2rem] text-[1.4rem] md:text-[1.6rem]">
            <span className="block text-gray-600 w-[12rem] text-start">
              Số lượng
            </span>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-[.5rem]">
                <span
                  className={`w-[3rem] h-[3rem] flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 cursor-pointer ${isQuantity ? "" : "pointer-events-none select-none opacity-[.5] cursor-not-allowed"}`}
                  onClick={() => {
                    if (selectVariantColor && selectVariantSize) {
                      setQuantity((prev) => {
                        return Math.max(1, prev - 1);
                      });
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} className="text-[1rem]" />
                </span>
                <input
                  type="number"
                  value={quantity}
                  className={`flex items-center justify-center text-[1.4rem] w-[6rem] h-[3rem] rounded-lg bg-white border  text-gray-800 select-none outline-none pl-[1rem] border-gray-200`}
                  disabled={!isQuantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <span
                  className={`w-[3rem] h-[3rem] flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 cursor-pointer ${isQuantity ? "" : "pointer-events-none select-none opacity-[.5] cursor-not-allowed"}`}
                  onClick={() => {
                    if (selectVariantSize && selectVariantColor) {
                      setQuantity((prev) => {
                        return Math.min(
                          Number(
                            product.variants.find(
                              (it) =>
                                it.variantColor.id ===
                                  (selectVariantColor as VariantColorType).id &&
                                it.variantSize.id === selectVariantSize?.id,
                            )?.inventory,
                          ),
                          Number(prev) + 1,
                        );
                      });
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="text-[1rem]" />
                </span>
              </div>
              <span className="text-[1rem] md:text-[1.4rem] text-gray-600 uppercase select-none">
                {!isQuantity
                  ? TotalInventory > 0
                    ? "Còn hàng"
                    : "Hết hàng"
                  : `Còn ${maxQuantity} sản phẩm`}
              </span>
            </div>
          </div>
          <p className="text-[1.2rem] md:text-[1.4rem] text-red-500 mt-[4rem]">
            {message}
          </p>
          <div className="flex items-center  gap-[1rem] mt-[.5rem] text-[1.4rem] md:text-[1.6rem]">
            <button
              type="button"
              className="px-[1rem] md:px-[2.5rem] py-[.8rem] md:py-[1.2rem] border border-amber-500 hover:border-amber-600 text-amber-600 hover:text-amber-700 rounded-[.5rem] hover-linear select-none cursor-pointer"
              disabled={isLoading}
              onClick={() => handleAddCartOrBuyNow("add")}
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCartPlus} />
                  <span>Thêm vào giỏ hàng</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="px-[1rem] md:px-[2.5rem] py-[.8rem] md:py-[1.2rem] bg-red-500 text-white hover:bg-red-600 rounded-[.5rem] hover-linear cursor-pointer"
              disabled={isLoading}
              onClick={() => handleAddCartOrBuyNow("buy")}
            >
              {isLoading ? "Đang xử lý..." : "Mua ngay"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-[2rem] rounded-lg h-auto bg-white p-[1rem] md:p-[2.5rem]">
        <div className="w-full py-[1rem] px-[1rem] md:px-[2rem] bg-gray-100 text-[1.4rem] md:text-[2rem] text-pink-600 mb-8 uppercase">
          Mô tả sản phẩm
        </div>
        <div
          className="prose prose-2xl max-w-none text-gray-600 px-[1rem] md:px-[2rem] text-[1.4rem]"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
      </div>
      <EvaluateProduct
        productId={product.id!}
        averageRating={Number(product.averageRating)}
      />
      <Notify
        showNotify={notify.show}
        content={notify.content}
        duration={1000}
        onClose={() => setNotify({ show: false, content: "" })}
      />
    </div>
  );
}

export default ProductDetail;
