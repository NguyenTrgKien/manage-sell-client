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
  faAngleRight,
  faCartPlus,
  faMinus,
  faPlus,
  faShirt,
  faShoePrints,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import Notify from "../../../components/Notify";
import { useAddCart } from "../../../hooks/useAddCart";
import EvaluateProduct from "../../../components/EvaluateProduct";

function ProductDetail() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();

  const { data, isLoading: LoadingData } = useQuery({
    queryKey: ["productdetail", productSlug],
    queryFn: () => getProductDetail(productSlug),
    enabled: !!productSlug,
  }) as any;
  const product: ProductT = data?.product;
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const { addToCart, isLoading, notify, setNotify } = useAddCart();

  const colors = useMemo(() => {
    const map = new Map();
    product?.variants?.forEach((v) =>
      map.set(v.variantColor.id, v.variantColor)
    );
    return [...map.values()];
  }, [product]);
  const sizes = useMemo(() => {
    const map = new Map();
    product?.variants?.forEach((v) => map.set(v.variantSize.id, v.variantSize));
    return [...map.values()];
  }, [product]);

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
        v.variantSize.id === selectVariantSize.id
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

  if (LoadingData) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-auto px-[12rem]">
      <div className="flex items-center space-x-2 text-[1.4rem] px-[3rem]">
        <Link to="/" className="block space-x-2 text-blue-800 ">
          <span>Home</span>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-gray-400 cursor-pointer"
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
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <span className="text-blue-800">{cat.categoryName}</span>
              {index <= categories.length - 1 && (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mx-2 text-gray-400"
                />
              )}
            </Link>
          ));
        })()}

        <span>{product?.productName}</span>
      </div>
      <div className="w-full h-auto flex gap-[4rem] rounded-lg mt-[1rem] bg-white p-[1.5rem]">
        <div className="w-[50rem] h-auto">
          <img
            src={product?.mainImage}
            alt={product?.productName}
            className="w-full h-[50rem] object-cover"
          />
          <div className="flex items-center space-x-4 mt-[1rem]">
            {product?.listImageProduct.map((imgItem) => {
              return (
                <div key={imgItem.id} className="w-[8rem] h-[8rem] rounded-md ">
                  <img
                    src={imgItem.imageUrl}
                    alt={`imageItem-${imgItem.id}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-[2.2rem] text-gray-800">
            {product?.productName}
          </h3>
          <div className="flex items-center space-x-6 ">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800">{product.averageRating}</span>
              <div className="flex items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      icon={faStar}
                      key={star}
                      className={`text-[1.4rem] ${
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
              <span className="text-[1.4rem] text-gray-500 mt-0.5">
                Đánh giá
              </span>
            </p>
            <span className="h-[1.5rem] border-r border-r-gray-400"></span>
            <div className="flex items-center space-x-2">
              <span className="text-[1.4rem] text-gray-500 mt-0.5">Đã bán</span>
              <p className="text-gray-800">{product.soldCount}</p>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-red-500 text-[2.5rem]">
              {formatPrice(product?.price)}
            </p>
          </div>

          <div className="space-x-4 mt-[2rem]">
            <span className="block text-gray-600 text-start">
              Mã giảm giá bạn có thể sử dụng:
            </span>
            <div className="flex items-center space-x-8 mt-[1rem]">
              <span
                className="relative block px-[2.5rem] py-[.5rem] text-[1.4rem] bg-gray-800 text-white select-none rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText("Hello");
                }}
              >
                DECL01
                <span className="absolute w-[1.8rem] h-[1rem] top-[50%] translate-y-[-50%] left-[-1rem] bg-white rounded-full"></span>
                <span className="absolute top-[50%] translate-y-[-50%] right-[-1rem] w-[1.8rem] h-[1rem] bg-white rounded-full"></span>
              </span>
              <span className="relative block px-[2.5rem] py-[.5rem] text-[1.4rem] bg-gray-800 text-white select-none rounded-xl">
                DECL01
                <span className="absolute w-[1.8rem] h-[1rem] top-[50%] translate-y-[-50%] left-[-1rem] bg-white rounded-full"></span>
                <span className="absolute top-[50%] translate-y-[-50%] right-[-1rem] w-[1.8rem] h-[1rem] bg-white rounded-full"></span>
              </span>
              <span className="relative block px-[2.5rem] py-[.5rem] text-[1.4rem] bg-gray-800 text-white select-none rounded-xl">
                DECL01
                <span className="absolute w-[1.8rem] h-[1rem] top-[50%] translate-y-[-50%] left-[-1rem] bg-white rounded-full"></span>
                <span className="absolute top-[50%] translate-y-[-50%] right-[-1rem] w-[1.8rem] h-[1rem] bg-white rounded-full"></span>
              </span>
              <span className="relative block px-[2.5rem] py-[.5rem] text-[1.4rem] bg-gray-800 text-white select-none rounded-xl">
                DECL01
                <span className="absolute w-[1.8rem] h-[1rem] top-[50%] translate-y-[-50%] left-[-1rem] bg-white rounded-full"></span>
                <span className="absolute top-[50%] translate-y-[-50%] right-[-1rem] w-[1.8rem] h-[1rem] bg-white rounded-full"></span>
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-4 mt-[2rem]">
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
          <div className="flex items-start space-x-4 mt-[2rem]">
            <span className="block text-gray-600 w-[12rem] text-start">
              Chọn size
            </span>
            <div className="flex items-center gap-[1rem] flex-wrap">
              {sizes?.map((size: VariantSizeType) => {
                const disableSize = selectVariantColor
                  ? product.variants.find(
                      (it) =>
                        it.variantColor.id === selectVariantColor.id &&
                        it.variantSize.id === size?.id
                    )
                  : false;

                return (
                  <button
                    key={size.id}
                    className={`flex items-center gap-[.5rem] px-[2rem] py-[.6rem] border rounded-[.5rem] ${!disableSize ? "border-gray-200 text-gray-200" : selectVariantSize?.id === size.id ? "border-[.1rem] bg-blue-50 border-blue-600" : "border-gray-300"} cursor-pointer`}
                    disabled={!disableSize}
                    onClick={() => setSelectVariantSize(size)}
                  >
                    <span className="text-[1.4rem]">{size.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-start gap-[2rem] mt-[2rem]">
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
                                it.variantSize.id === selectVariantSize?.id
                            )?.inventory
                          ),
                          Number(prev) + 1
                        );
                      });
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="text-[1rem]" />
                </span>
              </div>
              <span className="text-[1.4rem] text-gray-600 uppercase select-none">
                {!isQuantity
                  ? TotalInventory > 0
                    ? "Còn hàng"
                    : "Hết hàng"
                  : `Còn ${maxQuantity} sản phẩm`}
              </span>
            </div>
          </div>
          <p className="text-[1.4rem] text-red-500 mt-[4rem]">{message}</p>
          <div className="flex items-center  gap-[1rem] mt-[.5rem]">
            <button
              type="button"
              className="px-[2.5rem] py-[1.2rem] border border-amber-500 hover:border-amber-600 text-amber-600 hover:text-amber-700 rounded-[.5rem] hover-linear select-none cursor-pointer"
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
              className="px-[2.5rem] py-[1.2rem] bg-red-500 text-white hover:bg-red-600 rounded-[.5rem] hover-linear cursor-pointer"
              disabled={isLoading}
              onClick={() => handleAddCartOrBuyNow("buy")}
            >
              {isLoading ? "Đang xử lý..." : "Mua ngay"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-[2rem] rounded-lg h-auto bg-white p-[2.5rem]">
        <div className="w-full py-[1rem] px-[2rem] bg-gray-100 text-[2rem] text-pink-600 mb-8 uppercase">
          Mô tả sản phẩm
        </div>
        <div
          className="prose prose-2xl max-w-none text-gray-600 px-[2rem]"
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
