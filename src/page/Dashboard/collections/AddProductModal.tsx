import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import type { Collection } from "../../../utils/collection.type";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../../api/product.api";
import type { ProductT } from "../../../utils/types";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";

interface SelectedProduct {
  productId: number;
  sortOrder?: number;
  isFeature: boolean;
  specialPrice?: number;
}

interface AddProductModalProp {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  refetch: any;
}

function AddProductModal({
  isOpen,
  onClose,
  collection,
  refetch,
}: AddProductModalProp) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["getProducts", searchQuery, currentPage],
    queryFn: getProduct,
    enabled: isOpen,
  }) as any;

  const products = (data?.data || []) as ProductT[];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const availableProducts = products.filter(
    (product) =>
      !collection?.collectionProducts.some((cp) => cp.productId === product.id),
  );

  const isSelected = (productId: number) =>
    selectedProducts.some((p) => p.productId === productId);

  const getSelectedProduct = (productId: number) =>
    selectedProducts.find((p) => p.productId === productId);

  const handleToggleProduct = (product: ProductT) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.productId === product.id);
      if (exists) {
        return prev.filter((p) => p.productId !== product.id);
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            sortOrder: prev.length + 1,
            isFeature: false,
            specialPrice: product.price,
          },
        ];
      }
    });
  };

  const handlePriceChange = (productId: number, price: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, specialPrice: price } : p,
      ),
    );
  };

  const handleFeatureChange = (productId: number, isFeature: boolean) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, isFeature } : p)),
    );
  };

  const handleSortOrderChange = (productId: number, sortOrder: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, sortOrder } : p)),
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === availableProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(
        availableProducts.map((product, index) => ({
          productId: product.id,
          sortOrder: index + 1,
          isFeature: false,
          specialPrice: product.price,
        })),
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const res = (await axiosConfig.patch(
        `/api/v1/collections/${collection?.id}/products`,
        {
          collectionProducts: selectedProducts,
        },
      )) as any;
      if (res.status) {
        await refetch();
        toast.success(res.message);
        onClose();
      }
    } catch (error: any) {
      toast.error(`Lỗi server: ${error.message}`);
    }
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <MotionWrapper
      open={isOpen}
      className="bg-white rounded-xl pb-[2rem] w-full max-w-[75rem] max-h-[90vh] overflow-y-auto hide-scrollbar"
    >
      <div className="flex justify-between items-center p-6 border-b border-b-gray-200">
        <h3 className="text-[2rem] font-bold">
          Thêm sản phẩm vào "{collection?.name}"
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-[2rem]"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>

      <div className="p-6 border-b border-b-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-[1rem] h-[4rem] pl-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4">Đang tải...</p>
          </div>
        ) : availableProducts.length > 0 ? (
          <>
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedProducts.length === availableProducts.length}
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-600"
              />
              <label htmlFor="selectAll" className="text-[1.4rem] font-medium">
                Chọn tất cả ({availableProducts.length} sản phẩm)
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableProducts.map((product: ProductT) => {
                const selected = isSelected(product.id);
                const selectedProduct = getSelectedProduct(product.id);

                return (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-4 transition-all hover:cursor-pointer ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={product.mainImage}
                        alt={product.productName}
                        className="w-full h-[15rem] object-cover rounded-lg mb-3"
                      />
                      <input
                        type="checkbox"
                        checked={selected}
                        style={{ scale: "1.5" }}
                        className="absolute top-2 right-2 cursor-pointer"
                        onChange={() => handleToggleProduct(product)}
                      />
                    </div>

                    <h4 className="font-medium text-[1.4rem] truncate mb-1">
                      {product.productName}
                    </h4>
                    <p className="text-gray-500 text-[1.2rem] mb-2">
                      Giá gốc: {formatPrice(product.price)}
                    </p>

                    {selected && selectedProduct && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
                        <div>
                          <label className="block text-[1.2rem] text-gray-700 mb-1 font-medium">
                            Giá trong collection:
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={selectedProduct.specialPrice || ""}
                              onChange={(e) =>
                                handlePriceChange(
                                  product.id,
                                  Number(e.target.value),
                                )
                              }
                              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[1.3rem]"
                              placeholder="Nhập giá..."
                              min="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[1.2rem]">
                              đ
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[1.2rem] text-gray-700 mb-1 font-medium">
                            Thứ tự:
                          </label>
                          <input
                            type="number"
                            value={selectedProduct.sortOrder || ""}
                            onChange={(e) =>
                              handleSortOrderChange(
                                product.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[1.3rem]"
                            placeholder="Thứ tự..."
                            min="0"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`feature-${product.id}`}
                            checked={selectedProduct.isFeature}
                            onChange={(e) =>
                              handleFeatureChange(product.id, e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <label
                            htmlFor={`feature-${product.id}`}
                            className="text-[1.2rem] text-gray-700"
                          >
                            Sản phẩm nổi bật
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-500">
            {searchQuery
              ? "Không tìm thấy sản phẩm nào"
              : "Tất cả sản phẩm đã được thêm vào collection"}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-t-gray-200 flex justify-between items-center">
        <div className="text-[1.4rem]">
          Đã chọn:{" "}
          <span className="font-semibold">{selectedProducts.length}</span> sản
          phẩm
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[1.4rem]"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedProducts.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[1.4rem]"
          >
            Thêm ({selectedProducts.length})
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}

export default AddProductModal;
