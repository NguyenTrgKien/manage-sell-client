import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../../../api/product.api";
import type {
  ProductT,
  VariantColorType,
  VariantSizeType,
} from "../../../utils/types";
import type { EvaluateType } from "../../../utils/productType";
import Loading from "../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faShirt,
  faShoePrints,
  faStar,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

function ProductDetail() {
  const { productid } = useParams<{ productid: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["productdetail", productid],
    queryFn: ({ queryKey }) => getProductDetail(Number(queryKey[1])),
    enabled: !!productid,
  }) as any;
  const product: ProductT = data?.product;
  const evaluate: EvaluateType = data?.evaluate;
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);

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
    const found = product.variants.find((it) => {
      return (
        it.variantColor.id === selectVariantColor?.id &&
        it.variantSize.id === selectVariantSize?.id
      );
    });

    return found?.inventory ?? 0;
  };

  const isQuantity = selectVariantColor && selectVariantSize;
  const TotalInventory = product.variants.reduce((init, curr) => {
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-auto px-[12rem] mt-[20rem]">
      <div className="absolute top-[-3.5rem] text-gray-600">
        Phần danh mục hiển thị ở đây
      </div>
      <div className="w-full h-auto flex gap-[4rem] rounded-lg bg-white p-[1.5rem]">
        <div className="w-[40rem] h-auto">
          <img
            src={product?.mainImage}
            alt={product?.productName}
            className="w-full h-[40rem] object-cover"
          />
          <div className="flex items-center space-x-4 mt-[1rem]">
            {product.listImageProduct.map((imgItem) => {
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
          <h3 className="text-[1.8rem] text-gray-800">{product.productName}</h3>
          <div className="flex items-center space-x-6 ">
            <div className="flex items-center space-x-1">
              <span className="text-gray-800">4.9</span>
              <p className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className="text-[1rem] text-yellow-500"
                  />
                ))}
              </p>
            </div>
            <span className="h-[1.5rem] border-r border-r-gray-400"></span>
            <p className="flex items-center space-x-2">
              <span className="text-gray-800">5.9k</span>
              <span className="text-[1.4rem] text-gray-500">Đánh giá</span>
            </p>
            <span className="h-[1.5rem] border-r border-r-gray-400"></span>
            <div className="flex items-center space-x-2">
              <span className="text-[1.4rem] text-gray-500">Đã bán</span>
              <p className="text-gray-800">5K</p>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-red-500 text-[2.5rem]">
              {formatPrice(product.price)}
            </p>
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
          <div className="flex items-center mt-[4rem] gap-[1rem]">
            <button className="px-[2.5rem] py-[1.2rem] border border-amber-500 hover:border-amber-600 text-amber-600 hover:text-amber-700 rounded-[.5rem] hover-linear select-none cursor-pointer">
              <FontAwesomeIcon icon={faTrashCan} />
              <span>Thêm vào giỏ hàng</span>
            </button>
            <button className="px-[2.5rem] py-[1.2rem] bg-red-500 text-white hover:bg-red-600 rounded-[.5rem] hover-linear">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
