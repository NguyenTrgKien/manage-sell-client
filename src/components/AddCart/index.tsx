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
import axiosConfig from "../../configs/axiosConfig";
import Notify from "../Notify";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/useUser";

interface AddCartProp {
  showAddCart: { open: boolean; data: ProductT | null };
  setShowAddCart: Dispatch<
    SetStateAction<{ open: boolean; data: ProductT | null }>
  >;
}

function AddCart({ showAddCart, setShowAddCart }: AddCartProp) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showImage, setShowImage] = useState<string | null>(null);
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyContent, setNofityContent] = useState("");
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
      showAddCart.data.variants.reduce((init, curr) => {
        return init + curr.inventory;
      }, 0)) ||
    0;
  const maxQuantity = getMaxInventory();

  const colors = useMemo(() => {
    const map = new Map();
    if (showAddCart.data) {
      showAddCart.data.variants.forEach((v) =>
        map.set(v.variantColor.id, v.variantColor)
      );
    }
    return [...map.values()];
  }, [showAddCart.data]);

  const sizes = useMemo(() => {
    const map = new Map();
    if (showAddCart.data) {
      showAddCart.data.variants.forEach((v) =>
        map.set(v.variantSize.id, v.variantSize)
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
        v.variantSize.id === selectVariantSize.id
    )?.id;

    if (quantity <= 0) {
      setMessage("Số lượng sản phẩm ít nhất là 1!");
    }
    setIsLoading(true);
    const dataRequest = {
      variantId: variantId,
      quantity: quantity,
    };

    try {
      if (!user) {
        let existLocalCart = JSON.parse(
          localStorage.getItem("localCart") || "[]"
        );
        const existing = existLocalCart.find(
          (item: { variantId: number; quantity: number }) =>
            item.variantId === dataRequest.variantId
        );

        if (existing) {
          existing.quantity += quantity;
        } else {
          existLocalCart.push(dataRequest);
        }

        localStorage.setItem("localCart", JSON.stringify(existLocalCart));
        window.dispatchEvent(new Event("localStorageUpdate"));

        setShowAddCart({ open: false, data: null });
        setTimeout(() => {
          setShowNotify(true);
          setNofityContent("Đã thêm vào giỏ hàng!");
        }, 500);
        return;
      }

      const res = (await axiosConfig.post(
        "/api/v1/cart/add-to-cart",
        dataRequest
      )) as any;
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setShowAddCart({ open: false, data: null });
        setTimeout(() => {
          setShowNotify(true);
          setNofityContent("Đã thêm vào giỏ hàng!");
        }, 500);
      }
    } catch (error: any) {
      setShowAddCart({ open: false, data: null });
      setTimeout(() => {
        setShowNotify(true);
        setNofityContent("Đã thêm vào giỏ hàng!");
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MotionWrapper
        open={showAddCart.open}
        className="relative w-[68rem] min-h-[20rem] max-h-[55rem] bg-white rounded-lg shadow-xl p-[2rem]"
      >
        <button
          className="absolute top-[-.5rem] right-[-.5rem] w-[2.4rem] h-[2.4rem] rounded-full flex items-center justify-center bg-gray-800 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setShowAddCart({ open: false, data: null })}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white text-[1.4rem]"
          />
        </button>

        <div className="flex gap-[2rem]">
          <div className="w-[25rem] h-auto">
            {!showImage ? (
              <img
                src={showAddCart.data?.mainImage}
                alt="mainImage"
                className="w-[25rem] h-[25rem] rounded-lg object-cover"
              />
            ) : (
              <img
                src={showImage}
                alt="mainImage"
                className="w-[25rem] h-[25rem] rounded-lg object-cover"
              />
            )}
            <div className="w-full grid grid-cols-4 gap-[1rem] mt-[1rem] overflow-x-auto">
              {showAddCart.data?.listImageProduct.map((img) => {
                return (
                  <div key={img.id} onClick={() => setShowImage(img.imageUrl)}>
                    <img
                      src={img.imageUrl}
                      alt={`image-${showAddCart.data?.productName}`}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-[1.8rem] font-bold text-gray-800 text-limit-1">
              {showAddCart.data?.productName}
            </h2>
            <div className="flex items-center text-gray-600 text-[1.4rem] gap-[1rem]">
              <span>
                Mã sản phẩm: <strong>{showAddCart.data?.id}</strong>
              </span>
              <span className="border-l border-gray-400 h-[1.5rem]"></span>
              <span>
                Tình trạng:{" "}
                <strong>
                  {showAddCart.data && showAddCart.data?.inventory > 0
                    ? "Còn hàng"
                    : "Hết hàng"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-[2rem] ">
              <span className="text-gray-600">Giá:</span>
              <span className="text-red-500 font-bold">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(showAddCart.data?.price))}
              </span>
            </div>
            <div className="mt-[1rem]">
              <span className="block text-[1.4rem] text-gray-600">
                Chọn màu:
              </span>
              <div className="flex items-center gap-[1rem] w-full flex-wrap mt-[.5rem]">
                {colors.map((color: VariantColorType) => {
                  return (
                    <button
                      key={color.id}
                      className={`flex items-center gap-[.5rem] px-[1rem] py-[.6rem] border-[.1rem] rounded-[.5rem] hover:border-blue-300 ${selectVariantColor?.id === color.id ? "border-[.1rem] bg-blue-50 border-blue-600" : "border-gray-300"} cursor-pointer`}
                      onClick={() => setSelectVariantColor(color)}
                      onFocus={() => setMessage(null)}
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
              <span className="block text-[1.4rem] text-gray-600 mt-[2rem]">
                Chọn size:
              </span>
              <div className="flex items-center gap-[1rem] flex-wrap mt-[.5rem]">
                {sizes?.map((size: VariantSizeType) => {
                  const disableSize =
                    selectVariantColor && showAddCart.data
                      ? showAddCart.data.variants.find(
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
                      onFocus={() => setMessage(null)}
                    >
                      <span className="text-[1.4rem]">{size.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-[2rem] mt-[2rem]">
                <span className="block text-[1.4rem] text-gray-600 ">
                  Số lượng:
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
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <span
                    className={`w-[3rem] h-[3rem] flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 cursor-pointer ${isQuantity ? "" : "pointer-events-none select-none opacity-[.5] cursor-not-allowed"}`}
                    onClick={() => {
                      if (selectVariantSize && selectVariantColor) {
                        setQuantity((prev) => {
                          return Math.min(
                            Number(
                              showAddCart.data &&
                                showAddCart.data.variants.find(
                                  (it) =>
                                    it.variantColor.id ===
                                      (selectVariantColor as VariantColorType)
                                        .id &&
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
                <span className="text-[1.2rem] text-gray-600 uppercase select-none">
                  {!isQuantity
                    ? TotalInventory > 0
                      ? "Còn hàng"
                      : "Hết hàng"
                    : `Còn ${maxQuantity} sản phẩm`}
                </span>
              </div>
            </div>
            <p className="text-red-500 text-[1.5rem] mt-[2rem] ml-auto">
              {message}
            </p>
          </div>
        </div>
        <div className={`flex items-center justify-end mt-[1rem] gap-[1rem]`}>
          <button
            className="px-[2rem] py-[.6rem] bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 cursor-pointer"
            onClick={() => setShowAddCart({ open: false, data: null })}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            className="px-[2rem] py-[.6rem] bg-red-500 rounded-lg text-white hover:bg-red-600 transition duration-300 cursor-pointer"
            onClick={() => handleAddCart()}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
          </button>
        </div>
      </MotionWrapper>
      <Notify
        showNotify={showNotify}
        content={notifyContent}
        duration={1000}
        onClose={() => setShowNotify(false)}
      />
    </>
  );
}

export default AddCart;
