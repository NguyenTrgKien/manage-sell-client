import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getChildOfCate,
  getProductByCategorySlugs,
} from "../../../api/product.api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { CategoriesType, ProductT } from "../../../utils/types";
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

  const currentSlug = slugs[slugs.length - 1];
  const { data, isLoading } = useQuery({
    queryKey: ["product-by-category", slugs, queryDefault],
    queryFn: () => getProductByCategorySlugs(slugs, queryDefault),
  });
  const products = data?.data || [];
  const { data: dataChildOfCate, isLoading: isLoadingChilOfCate } = useQuery({
    queryKey: ["childOfCates", currentSlug],
    queryFn: () => getChildOfCate(currentSlug),
  });
  const childOfCate = (dataChildOfCate && dataChildOfCate.data) || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChangeSort = (sort: "popular" | "latest" | "best_seller") => {
    setQueryDefault((prev) => ({
      ...prev,
      sort: sort,
    }));
  };

  const handleChangePrice = (price: "asc" | "desc") => {
    setQueryDefault((prev) => ({
      ...prev,
      price: price,
    }));
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

      {isLoadingChilOfCate ? (
        <div className="w-full h-[15rem] flex flex-col gap-y-[1.5rem] items-center justify-center mt-[2rem]">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin [animation-duration:2s]"></div>
          <span className="text-[1.3rem] md:text-[1.5rem] text-gray-600">
            Đang tải danh mục...
          </span>
        </div>
      ) : childOfCate && childOfCate.length > 0 ? (
        <div className="md:my-[2rem] my-2.5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {childOfCate.map((cate: CategoriesType) => {
              return (
                <Link
                  to={`/category/${cate.slug}`}
                  key={cate.id}
                  className="flex flex-col items-center justify-center p-3 md:p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-red-300 hover:scale-[1.05] transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative mb-2 md:mb-3">
                    <div className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"></div>
                    <img
                      src={cate.image}
                      alt={cate.categoryName}
                      className="relative w-[6rem] h-[6rem] md:w-[8rem] md:h-[8rem] rounded-full object-cover border-2 border-gray-100"
                    />
                  </div>

                  <p className="text-[1.2rem] md:text-[1.4rem] font-medium text-gray-800 text-center line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
                    {cate.categoryName}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      {isLoading ? (
        <div className="w-full h-auto flex flex-col gap-y-[2rem] items-center justify-center mt-25">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-blue-500 rounded-full animate-spin [animation-duration:2s]"></div>
          <span className="text-[1.4rem] md:text-[1.6rem]">
            Đang tải dữ liệu...
          </span>
        </div>
      ) : products.length > 0 ? (
        <>
          <h2 className="md:text-[2rem] mt-[2rem]">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 mt-[1rem] md:mt-[2rem]">
            {products?.map((product: ProductT) => {
              return (
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
              );
            })}
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
