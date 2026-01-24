import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import MotionWrapper from "../ui/MotionWrapper";
import {
  faMinus,
  faPlus,
  faShirt,
  faShoePrints,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type {
  ProductT,
  VariantColorType,
  VariantSizeType,
} from "../../utils/types";
import Notify from "../Notify";
import { useAddCart } from "../../hooks/useAddCart";

interface AddCartProp {
  showAddCart: { open: boolean; data: ProductT | null };
  setShowAddCart: Dispatch<
    SetStateAction<{ open: boolean; data: ProductT | null }>
  >;
}

function AddCart({ showAddCart, setShowAddCart }: AddCartProp) {
  const [showImage, setShowImage] = useState<string | null>(null);
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const { addToCart, isLoading, notify, setNotify } = useAddCart();
  const getMaxInventory = () => {
    const found =
      showAddCart.data &&
      showAddCart.data.variants.find((it) => {
        return (
          it.variantColor.id === selectVariantColor?.id &&
          it.variantSize.id === selectVariantSize?.id
        );
      });

    return found?.inventory ?? 0;
  };

  useEffect(() => {
    const max = getMaxInventory();
    if (!selectVariantColor || !selectVariantSize) {
      setQuantity(1);
      return;
    }
    setQuantity((prev) => {
      if (prev > max) {
        return max > 0 ? max : 1;
      }
      return prev;
    });
  }, [selectVariantColor, selectVariantSize]);
  const isQuantity = selectVariantColor && selectVariantSize;
  const TotalInventory =
    (showAddCart.data &&
      showAddCart.data?.variants?.reduce((init, curr) => {
        return init + curr.inventory;
      }, 0)) ||
    0;
  const maxQuantity = getMaxInventory();

  const colors = useMemo(() => {
    const map = new Map();
    if (showAddCart.data) {
      showAddCart.data.variants.forEach((v) =>
        map.set(v.variantColor.id, v.variantColor),
      );
    }
    return [...map.values()];
  }, [showAddCart.data]);

  const sizes = useMemo(() => {
    const map = new Map();
    if (showAddCart.data) {
      showAddCart.data.variants.forEach((v) =>
        map.set(v.variantSize.id, v.variantSize),
      );
    }
    return [...map.values()];
  }, [showAddCart.data]);

  const getProductIcon = () => {
    const category =
      (showAddCart.data &&
        showAddCart.data.category.categoryName?.toUpperCase()) ||
      "";
    if (category.includes("giày") || category.includes("dép")) {
      return faShoePrints;
    }
    return faShirt;
  };

  const handleAddCart = async () => {
    setMessage(null);
    if (!selectVariantColor || !selectVariantSize) {
      setMessage("Vui lòng chọn thuộc tính sản phẩm!");
      return;
    }
    const variantId = showAddCart.data?.variants.find(
      (v) =>
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
  };

  return (
    <>
      <MotionWrapper
        open={showAddCart.open}
        className="relative 
          w-[92vw] max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[55%]
          min-h-[30vh] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh]
          bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-y-auto
          px-4 py-5 sm:px-6 sm:py-6 md:p-8 lg:p-10"
      >
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 
            w-9 h-9 sm:w-10 sm:h-10 rounded-full 
            flex items-center justify-center bg-gray-800 
            cursor-pointer hover:scale-110 transition-transform z-10"
          onClick={() => setShowAddCart({ open: false, data: null })}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white text-xl sm:text-2xl"
          />
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          <div className="w-full md:w-[38%] lg:w-[40%] flex-shrink-0">
            <div className="aspect-square w-full max-w-[380px] mx-auto md:mx-0">
              <img
                src={showImage || showAddCart.data?.mainImage}
                alt="mainImage"
                className="w-full h-full rounded-xl object-cover shadow-sm"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {showAddCart.data?.listImageProduct.map((img) => (
                <div
                  key={img.id}
                  className="cursor-pointer flex-shrink-0 w-20 sm:w-24 aspect-square"
                  onClick={() => setShowImage(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt={`thumb-${showAddCart.data?.productName}`}
                    className={`w-full h-full rounded-lg object-cover border-2 transition-all ${
                      showImage === img.imageUrl
                        ? "border-blue-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 sm:space-y-5">
            <h2 className="text-[1.8rem] font-bold text-gray-800 line-clamp-2">
              {showAddCart.data?.productName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 text-[1.4rem]">
              <span>
                Mã sản phẩm: <strong>{showAddCart.data?.id}</strong>
              </span>
              <span className="hidden sm:inline-block border-l border-gray-400 h-5"></span>
              <span>
                Tình trạng:{" "}
                <strong>
                  {showAddCart.data?.variants.some((v) => v.inventory > 0)
                    ? "Còn hàng"
                    : "Hết hàng"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-gray-600 text-[1.4rem]">Giá:</span>
              <span className="text-red-500 font-bold text-[1.6rem] sm:text-[1.8rem]">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(showAddCart.data?.price))}
              </span>
            </div>

            <div>
              <span className="block text-[1.4rem] text-gray-600 mb-2">
                Chọn màu:
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {colors.map((color: VariantColorType) => (
                  <button
                    key={color.id}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg text-[1.4rem] transition-all ${
                      selectVariantColor?.id === color.id
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => setSelectVariantColor(color)}
                    onFocus={() => setMessage(null)}
                  >
                    <FontAwesomeIcon
                      icon={getProductIcon()}
                      className="p-1 rounded bg-gray-100"
                      style={{ color: color.hexCode }}
                    />
                    <span className="text-gray-700">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[1.4rem] text-gray-600 mb-2 mt-5 sm:mt-6">
                Chọn size:
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {sizes?.map((size: VariantSizeType) => {
                  const available =
                    selectVariantColor &&
                    showAddCart.data?.variants.some(
                      (it) =>
                        it.variantColor.id === selectVariantColor.id &&
                        it.variantSize.id === size.id,
                    );

                  return (
                    <button
                      key={size.id}
                      className={`px-5 sm:px-6 py-2 border rounded-lg text-[1.4rem] transition-all ${
                        !available
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : selectVariantSize?.id === size.id
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-300 hover:border-blue-300"
                      }`}
                      disabled={!available}
                      onClick={() => setSelectVariantSize(size)}
                      onFocus={() => setMessage(null)}
                    >
                      {size.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <span className="text-[1.4rem] text-gray-600">Số lượng:</span>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-700 transition ${
                    isQuantity
                      ? "hover:bg-gray-100 active:bg-gray-200"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isQuantity}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <FontAwesomeIcon icon={faMinus} className="text-base" />
                </button>

                <input
                  type="number"
                  value={quantity}
                  min={1}
                  disabled={!isQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setQuantity(val);
                  }}
                  className={`w-20 sm:w-24 h-10 sm:h-11 text-center text-[1.4rem] border rounded-lg outline-none ${
                    isQuantity
                      ? "border-gray-300 focus:border-blue-400"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                />

                <button
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-700 transition ${
                    isQuantity
                      ? "hover:bg-gray-100 active:bg-gray-200"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isQuantity}
                  onClick={() =>
                    setQuantity((prev) => Math.min(maxQuantity, prev + 1))
                  }
                >
                  <FontAwesomeIcon icon={faPlus} className="text-base" />
                </button>
              </div>

              <span className="text-[1.2rem] text-gray-600 font-medium uppercase">
                {!isQuantity
                  ? TotalInventory > 0
                    ? "Còn hàng"
                    : "Hết hàng"
                  : `Còn ${maxQuantity} sản phẩm`}
              </span>
            </div>

            {message && (
              <p className="text-red-500 text-[1.5rem] mt-4">{message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            className="w-full sm:w-auto px-8 sm:px-[2rem] py-3 sm:py-[.7rem] bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 text-[1.4rem]"
            onClick={() => setShowAddCart({ open: false, data: null })}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-8 sm:px-[2rem] py-3 sm:py-[.7rem] bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 text-[1.4rem] font-medium"
            onClick={handleAddCart}
            disabled={isLoading || !isQuantity}
          >
            {isLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
          </button>
        </div>
      </MotionWrapper>

      <Notify
        showNotify={notify.show}
        content={notify.content}
        duration={1000}
        onClose={() => setNotify({ show: false, content: "" })}
      />
    </>
  );
}

export default AddCart;
