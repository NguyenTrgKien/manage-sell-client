import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import {
  faFilter,
  faMinus,
  faPlus,
  faShirt,
  faShoePrints,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../../../../api/category.api";
import type {
  CategoriesType,
  ProductT,
  VariantColorType,
  VariantSizeType,
} from "../../../../../utils/types";
import type { OrderForm, orderItemsForm } from "../../ListOrders/AddOrder";
import { toast } from "react-toastify";
import type { UseFormSetValue } from "react-hook-form";

interface ModalProductProp {
  openModalProduct: boolean;
  setOpenModalProduct: Dispatch<SetStateAction<boolean>>;
  selectorderItems: orderItemsForm[];
  products: ProductT[];
  setFilterProduct: Dispatch<
    SetStateAction<{
      page: number;
      limit: number;
      productName: "";
      categoryId: number | undefined;
    }>
  >;
  setValue: UseFormSetValue<OrderForm>;
}

function ModalProduct({
  openModalProduct,
  setOpenModalProduct,
  selectorderItems,
  products,
  setFilterProduct,
  setValue,
}: ModalProductProp) {
  const [selectProduct, setSelectProduct] = useState<ProductT | null>(null);
  const [searchInput, setSearchInput] = useState<{
    productName: "";
    categoryId: number | undefined;
  }>({
    productName: "",
    categoryId: undefined,
  });
  const { data: dataCategories } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  const handleAppliedFilter = () => {
    setFilterProduct((prev) => ({
      ...prev,
      categoryId: searchInput.categoryId,
      productName: searchInput.productName,
    }));
  };

  const onAdd = (item: {
    productId: number;
    variantId: number;
    quantity: number;
    price: number;
  }): void => {
    const exists = selectorderItems.some((i) => i.variantId === item.variantId);

    if (exists) {
      toast.error("Sản phẩm này đã có trong danh sách");
      return;
    }

    setValue("orderItems", [...selectorderItems, item], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setOpenModalProduct(false);
  };

  return (
    <MotionWrapper
      open={openModalProduct}
      className="relative w-[80rem] h-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => setOpenModalProduct(false)}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <h2
        className={`text-[2rem] text-green-600 text-center font-semibold mb-[2rem]`}
      >
        Chọn sản phẩm
      </h2>
      {!selectProduct ? (
        <>
          <div className="flex items-center gap-[1.5rem] shadow-lg p-[2rem] border border-gray-100 rounded-xl">
            <input
              type="text"
              name="productName"
              placeholder="Tên sản phẩm..."
              value={searchInput.productName}
              className="w-[20rem] h-[4rem] rounded-lg border border-gray-300 px-[1.5rem] outline-none"
              onChange={(e) =>
                setSearchInput((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
            <select
              name="categoryId"
              id="categoryId"
              value={searchInput.categoryId}
              className="w-[20rem] h-[4rem] rounded-lg border border-gray-300 text-gray-600 px-[1.5rem] outline-none"
              onChange={(e) =>
                setSearchInput((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option value="">Danh mục</option>
              {dataCategories?.map((category: CategoriesType) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                );
              })}
            </select>
            <button
              className="flex items-center justify-center gap-[.5rem] w-[10rem] bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white h-[4rem] rounded-lg border border-gray-300 px-[1.5rem] outline-none"
              onClick={() => handleAppliedFilter()}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span className="block">Lọc</span>
            </button>
          </div>
          <div className="min-h-[28rem] max-h-[40rem] overflow-auto">
            {products?.length > 0 ? (
              <div className="grid grid-cols-4 max-h-[40rem] gap-[2rem] mt-[2rem]">
                {products?.map((product: ProductT) => {
                  return (
                    <div
                      key={product.id}
                      className="border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl hover:scale-[1.02] hover-linear cursor-pointer group"
                      onClick={() => setSelectProduct(product)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.mainImage}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-limit-1 text-gray-800 mb-1">
                        {product.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {product.variants.length} phiên bản
                      </p>
                      <p className="text-[1.4rem] text-green-600 font-semibold mt-2">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full text-center mt-[2rem]">
                Không có sản phẩm nào
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-[1rem] mt-[2rem]">
            <button
              className="px-[1.5rem] py-[.5rem] bg-gray-200 hover:bg-gray-300 rounded-[.5rem] hover-linear select-none"
              onClick={() => setOpenModalProduct(false)}
            >
              Hủy
            </button>
            <button className="px-[1.5rem] py-[.5rem] bg-[var(--main-button)] text-white hover:bg-[var(--main-button-hover)] rounded-[.5rem] hover-linear">
              Chọn
            </button>
          </div>
        </>
      ) : (
        <VariantSelected
          product={selectProduct}
          onBack={() => setSelectProduct(null)}
          onAdd={onAdd}
        />
      )}
    </MotionWrapper>
  );
}

export default ModalProduct;

function VariantSelected({
  product,
  onBack,
  onAdd,
}: {
  product: ProductT;
  onBack: () => void;
  onAdd: (item: {
    productId: number;
    variantId: number;
    quantity: number;
    price: number;
  }) => void;
}) {
  const [selectVariantSize, setSelectVariantSize] =
    useState<VariantSizeType | null>(null);
  const [selectVariantColor, setSelectVariantColor] =
    useState<VariantColorType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const getMaxInventory = () => {
    const found = product.variants.find((it) => {
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
  const TotalInventory = product.variants.reduce((init, curr) => {
    return init + curr.inventory;
  }, 0);
  const maxQuantity = getMaxInventory();

  const colors = useMemo(() => {
    const map = new Map();
    product.variants.forEach((v) => map.set(v.variantColor.id, v.variantColor));
    return [...map.values()];
  }, [product]);
  const sizes = useMemo(() => {
    const map = new Map();
    product.variants.forEach((v) => map.set(v.variantSize.id, v.variantSize));
    return [...map.values()];
  }, [product]);

  const getProductIcon = () => {
    const category = product.category.categoryName?.toUpperCase() || "";
    if (category.includes("giày") || category.includes("dép")) {
      return faShoePrints;
    }
    return faShirt;
  };

  return (
    <div className="mt-[2rem]">
      <button
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← Quay lại
      </button>
      <div className="flex gap-[2rem] w-full max-h-[55rem] overflow-y-auto hide-scrollbar">
        <div className="w-[30rem] h-[30rem] rounded-xl ">
          <img src={product.mainImage} alt={`imgage-${product.productName}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-[1.8rem] text-gray-800 font-bold">
            {product.productName}
          </h3>
          <div className="flex items-center gap-[.1rem] mt-[1rem]">
            <FontAwesomeIcon
              icon={faStar}
              className="text-[1rem] text-amber-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="text-[1rem] text-amber-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="text-[1rem] text-amber-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="text-[1rem] text-amber-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="text-[1rem] text-amber-400"
            />
          </div>
          <div className="mt-[1rem] flex items-center gap-[.5rem]">
            <span className="text-gray-600">Giá gốc</span>
            <span className="text-green-600 text-[2rem]">
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          </div>
          <div className="mt-[1rem]">
            <span className="block text-gray-600">Chọn màu:</span>
            <div className="flex items-center gap-[1rem] w-full flex-wrap mt-[.5rem]">
              {colors.map((color: VariantColorType) => {
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
            <span className="block text-gray-600 mt-[2rem]">Chọn size:</span>
            <div className="flex items-center gap-[1rem] flex-wrap mt-[.5rem]">
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
            <div className="flex items-center gap-[2rem] mt-[2rem]">
              <span className="block text-gray-600 ">Số lượng:</span>
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
          <div className="flex justify-end items-center mt-[2rem] gap-[1rem]">
            <button
              className="px-[1.5rem] py-[.5rem] bg-gray-200 hover:bg-gray-300 rounded-[.5rem] hover-linear select-none"
              onClick={onBack}
            >
              Hủy
            </button>
            <button
              className="px-[1.5rem] py-[.5rem] bg-[var(--main-button)] text-white hover:bg-[var(--main-button-hover)] rounded-[.5rem] hover-linear"
              onClick={() => {
                if (!selectVariantColor || !selectVariantSize) {
                  toast.error("Vui lòng chọn màu sắc và size!");
                  return;
                }

                const variant = product.variants.find(
                  (v) =>
                    v.variantColor.id === selectVariantColor.id &&
                    v.variantSize.id === selectVariantSize.id
                );

                if (!variant) {
                  toast.error("Sản phẩm không tồn tại trong kho!");
                  return;
                }

                onAdd({
                  productId: product.id,
                  variantId: variant.id,
                  quantity: quantity,
                  price: variant.price ?? product.price,
                });
              }}
            >
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
