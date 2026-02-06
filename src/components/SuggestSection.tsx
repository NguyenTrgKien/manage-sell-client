import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api/product.api";
import { useEffect, useState } from "react";
import type { ProductT } from "../utils/types";
import { useNavigate } from "react-router-dom";
import AddCart from "./AddCart";

function SuggestSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductT[]>([]);
  const [showAddCart, setShowAddCart] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });
  const [queryDefault, setQueryDefault] = useState<{
    price?: "asc" | "desc";
    limit: number;
    page: number;
    sort?: "popular" | "latest" | "best_seller";
  }>({
    price: "desc",
    limit: 10,
    page: 1,
    sort: "latest",
  });
  const { data, isLoading } = useQuery({
    queryKey: ["products", queryDefault],
    queryFn: getProduct,
  }) as any;
  const showBtn = data && queryDefault.page < data.totalPages;

  useEffect(() => {
    if (!data) return;
    const newProducts = data.data || [];
    setProducts((prev) =>
      queryDefault.page === 1 ? newProducts : [...prev, ...newProducts],
    );
  }, [data, queryDefault.page]);

  const handleAddPage = () => {
    setQueryDefault((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  return isLoading ? (
    <div>Đang tải dữ liệu</div>
  ) : (
    <section className="mt-[2rem] rounded-[.5rem] bg-white p-[1.5rem] md:p-[2rem]">
      <h4 className="text-[1.4rem] md:text-[1.8rem] font-bold text-pink-500 mb-6">
        Gọi ý hôm nay
      </h4>
      <div className="text-center">
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product: ProductT) => {
              return (
                <div
                  key={product.id}
                  className="group bg-white cursor-pointer relative overflow-hidden border border-gray-200"
                  onClick={() => navigate(`/product-detail/${product.slug}`)}
                >
                  <div className="relative h-[16rem] md:h-[20rem] lg:h-[24rem] overflow-hidden">
                    <img
                      src={
                        product.mainImage || "https://via.placeholder.com/300"
                      }
                      alt={product.productName || "Sản phẩm flash sale"}
                      className="w-full h-full object-cover group-hover:scale-[1.1] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5">
                    <div className="text-left">
                      <h5 className="text-limit-1 text-[1.2rem] md:text-[1.6rem] text-gray-700 font-medium">
                        {product.productName}
                      </h5>
                      <p className="mt-2 text-red-600 text-[1.4rem] md:text-[1.6rem]">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end gap-2.5 mt-4">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1 py-2 px-4 border text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white rounded-md text-[1.2rem] md:text-[1.4rem] transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddCart({ open: true, data: product });
                        }}
                      >
                        Thêm{" "}
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1 py-2 px-4 border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md text-[1.2rem] md:text-[1.4rem] transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product-detail/${product.slug}`);
                        }}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showBtn && (
          <button
            type="button"
            className="py-3 px-8 border border-gray-300 hover:border-gray-600 hover:text-gray-800 transition-colors duration-300 rounded-md mt-8 cursor-pointer"
            onClick={() => handleAddPage()}
            disabled={isLoading}
          >
            Xem thêm
          </button>
        )}
      </div>
      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </section>
  );
}

export default SuggestSection;
