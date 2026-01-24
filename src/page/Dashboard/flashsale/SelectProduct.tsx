import { useEffect, useState } from "react";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../../api/product.api";
import type { CategoriesType, ProductT } from "../../../utils/types";
import {
  faCheck,
  faFilter,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllCategory } from "../../../api/category.api";
import RenderParentOption from "../../../components/RenderParentOption";

interface SelectProductProp {
  open: boolean;
  onClose: () => void;
  setSelectedPro: any;
  selectedPro: ProductT[];
  setValue: any;
}

function SelectProduct({
  open,
  onClose,
  setSelectedPro,
  selectedPro,
  setValue,
}: SelectProductProp) {
  const [filterInput, setFilterInput] = useState({
    page: 1,
    limit: 20,
    productName: "",
    categoryId: undefined,
  });
  const [filterProduct, setFilterProduct] = useState(filterInput);
  const [selectedProduct, setSelectedProduct] = useState<ProductT[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["products", filterProduct],
    queryFn: getProduct,
  });
  const products = data && data.data;
  const { data: dataCategories = [] } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  useEffect(() => {
    if (selectedPro.length > 0) {
      setSelectedProduct(selectedPro);
    }
  }, [selectedPro]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSelectProduct = () => {
    setSelectedPro(selectedProduct);
    const configData = selectedProduct.map((it) => {
      return {
        productId: it.id,
        quantity: 1,
        limit: 1,
        origin_price: it.price,
      };
    });
    setValue("flashSaleProducts", configData);
    onClose();
  };

  const handleFilter = () => {
    setFilterProduct({
      ...filterInput,
    });
  };

  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] h-auto bg-white rounded-[1rem] shadow-xl p-[2rem] text-[1.4rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <div className="border-gray-200">
        <h3 className="text-[1.8rem] text-center border-b border-b-gray-300 pb-4 font-semibold">
          Chọn sản phẩm
        </h3>
      </div>

      <div className="my-5 flex items-center space-x-4 text-[1.4rem]">
        <div className="relative w-[35rem]">
          <button
            type="button"
            className="absolute top-[50%] translate-y-[-50%] left-4"
          >
            <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
          </button>
          <input
            type="text"
            id="productName"
            placeholder="Nhập tên sản phẩm..."
            value={filterProduct.productName}
            className="w-full border border-gray-300 h-[4rem] rounded-lg pr-4 pl-14 outline-none"
            onChange={(e) => {
              setFilterInput((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </div>
        <div className="w-[35rem] flex flex-col gap-[.5rem]">
          <select
            name="categoryId"
            id="categoryId"
            className="w-full h-[4rem] rounded-[.5rem] outline-none border text-gray-600 border-gray-300 pl-[1.5rem]"
            onChange={(e) =>
              setFilterInput((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          >
            <option value="">Tất cả</option>
            {dataCategories
              ?.filter((cat: CategoriesType) => cat.isActive)
              .map((parent: CategoriesType) => (
                <RenderParentOption
                  key={parent.id}
                  category={parent}
                  allCategories={dataCategories}
                  level={0}
                />
              ))}
          </select>
        </div>
        <button
          className="px-6 h-[4rem] flex items-center space-x-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors duration-300"
          onClick={() => handleFilter()}
        >
          <FontAwesomeIcon icon={faFilter} />
          Lọc
        </button>
      </div>

      <div className="pb-6 overflow-y-auto max-h-[60vh]">
        <p className="pb-6">Danh sách sản phẩm</p>
        {isLoading ? (
          <div className="text-center my-24">Đang tải sản phẩm...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: ProductT) => {
              const isChecked =
                selectedProduct.length > 0 &&
                selectedProduct.find((p: any) => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group relative rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                >
                  <img
                    src={product.mainImage}
                    alt={`mainImage ${product.productName}`}
                    className="w-full h-[12rem] object-cover rounded-tl-lg rounded-tr-lg"
                  />
                  <div className="p-1.5">
                    <p className="text-[1.4rem] line-clamp-1">
                      {product.productName}
                    </p>
                    <p className="text-[1.2rem] text-red-500">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div
                    className={`${isChecked ? "" : "opacity-0"} group-hover:opacity-[100] flex absolute inset-0 bg-[#32323256] items-center justify-center rounded-lg transition-opacity duration-300`}
                    onClick={() =>
                      setSelectedProduct((prev) => {
                        if (prev.find((it) => it.id === product.id)) {
                          return prev.filter((p) => p.id !== product.id);
                        } else {
                          return [...prev, product];
                        }
                      })
                    }
                  >
                    <button className="w-9 h-9 bg-white text-green-500 rounded-md">
                      {isChecked ? (
                        <FontAwesomeIcon icon={faCheck} className="font-bold" />
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">Không có sản phẩm nào</div>
        )}
        <div className="mt-[2rem] flex justify-center items-center space-x-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-[1.2rem] hover:bg-gray-50 transition-colors">
            Trước
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-[1.2rem]">
            1
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-[1.2rem] hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-[1.2rem] hover:bg-gray-50 transition-colors">
            Sau
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          type="button"
          className="px-6 h-[4rem] text-[1.4rem] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => {
            onClose();
          }}
        >
          Đóng
        </button>
        <button
          type="button"
          className="px-6 h-[4rem] text-[1.4rem] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => {
            handleSelectProduct();
          }}
        >
          Chọn
        </button>
      </div>
    </MotionWrapper>
  );
}

export default SelectProduct;
