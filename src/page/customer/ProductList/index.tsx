import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByCategorySlugs } from "../../../api/product.api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { ProductT } from "../../../utils/types";
import noProduct from "../../../assets/images/no-product.png";
import ProductFilterBar from "../../../components/ProductFilterBar";
import AddCart from "../../../components/AddCart";

function ProductList() {
  const navigate = useNavigate();
  const { slug1, slug2, slug3 } = useParams<{
    slug1?: string;
    slug2?: string;
    slug3?: string;
  }>();
  const [showAddCart, setShowAddCart] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });

  const slugs = [slug1, slug2, slug3].filter(Boolean) as string[];
  const [queryDefault, setQueryDefault] = useState<{
    page: number;
    limit: number;
    price: "asc" | "desc";
    sort: "popular" | "latest" | "best_seller";
  }>({
    page: 1,
    limit: 20,
    price: "asc",
    sort: "popular",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["product-by-category", slugs, queryDefault],
    queryFn: () => getProductByCategorySlugs(slugs, queryDefault),
  });
  const products = data?.data || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChangeSort = (sort: "popular" | "latest" | "best_seller") => {
    setQueryDefault((prev) => ({ ...prev, sort }));
  };

  const handleChangePrice = (price: "asc" | "desc") => {
    setQueryDefault((prev) => ({ ...prev, price }));
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full h-auto rounded-lg">
      <ProductFilterBar
        handleChangePrice={handleChangePrice}
        handleChangeSort={handleChangeSort}
        queryDefault={queryDefault}
        setQueryDefault={setQueryDefault}
      />

      {isLoading ? (
        <>
          <h2 className="md:text-[2rem] mt-[2rem]">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 mt-[1rem] md:mt-[2rem]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col w-full h-auto border rounded-md border-gray-200 overflow-hidden animate-pulse"
              >
                {/* Image */}
                <div className="w-full h-[15rem] md:h-[18rem] bg-gray-200" />

                <div className="flex flex-col flex-1 p-2 md:p-4 space-y-2">
                  {/* Product name */}
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  {/* Price */}
                  <div className="h-5 bg-red-100 rounded w-2/3" />
                  {/* Rating + sold */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded w-10" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  {/* Button */}
                  <div className="h-9 bg-pink-100 rounded-md w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : products.length > 0 ? (
        <>
          <h2 className="md:text-[2rem] mt-[2rem]">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 mt-[1rem] md:mt-[2rem]">
            {products.map((product: ProductT) => (
              <div
                key={product.id}
                className="flex flex-col w-full h-auto border rounded-md border-gray-200 shadow-sm hover:shadow-md hover:shadow-red-300 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/product-detail/${product.slug}`)}
              >
                <img
                  src={product.mainImage}
                  alt={`mainImage-${product.productName}`}
                  className="w-full h-[15rem] md:h-[18rem] rounded-tl-md rounded-tr-md object-cover"
                />
                <div className="flex flex-col flex-1 p-2 md:p-4 space-y-1 md:space-y-1.5">
                  <span className="line-clamp-1 text-[1.3rem] md:text-[1.5rem] leading-snug">
                    {product.productName}
                  </span>
                  <span className="text-red-500 text-[1.3rem] md:text-[1.5rem]">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center space-x-3 md:space-x-5 text-[1.1rem] md:text-[1.2rem]">
                    <span className="flex items-center space-x-1">
                      <span className="block mt-0.5">
                        {product.averageRating}
                      </span>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500 text-[1.1rem] md:text-[1.2rem]"
                      />
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>Đã bán</span>
                      <span>{product.soldCount}</span>
                    </span>
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
                        className="w-6 h-6"
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-[30rem] md:h-[40rem] flex flex-col items-center justify-center select-none">
          <img
            src={noProduct}
            alt="no-product"
            className="w-[15rem] md:w-[20rem]"
          />
          <span className="text-[1.4rem] md:text-[1.6rem] mt-4">
            Không có sản phẩm nào!
          </span>
        </div>
      )}

      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </div>
  );
}

export default ProductList;
