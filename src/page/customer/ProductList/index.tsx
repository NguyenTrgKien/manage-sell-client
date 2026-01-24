import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  getChildOfCate,
  getProductByCategorySlugs,
} from "../../../api/product.api";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowDown,
  faArrowUp,
  faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import type { CategoriesType, ProductT } from "../../../utils/types";
import noProduct from "../../../assets/images/no-product.png";

function ProductList() {
  const { slug1, slug2, slug3 } = useParams<{
    slug1?: string;
    slug2?: string;
    slug3?: string;
  }>();
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
      <div className="w-full py-3 md:py-4 text-[1.2rem] md:text-[1.6rem] bg-gray-200 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-0 md:space-x-6 px-[1rem] md:px-[2rem] rounded-lg">
        <span>Sắp xếp theo</span>

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <button
            type="button"
            className={`px-3 md:px-6 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
              queryDefault.sort === "popular"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleChangeSort("popular")}
          >
            Phổ biến
          </button>
          <button
            type="button"
            className={`px-3 md:px-4 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
              queryDefault.sort === "latest"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleChangeSort("latest")}
          >
            Mới nhất
          </button>
          <button
            type="button"
            className={`px-3 md:px-4 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
              queryDefault.sort === "best_seller"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleChangeSort("best_seller")}
          >
            Bán chạy
          </button>
        </div>

        <div className="md:flex hidden relative w-full md:w-[20rem] h-[3rem] md:h-[3.4rem] rounded-md bg-white px-3 md:px-4 items-center justify-between group">
          <span className="text-[1.2rem] md:text-[1.4rem]">
            Giá:{" "}
            {queryDefault.price === "asc" ? "Thấp đến Cao" : "Cao đến Thấp"}
          </span>
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-[1.2rem] md:text-[1.4rem]"
          />

          <div className="absolute top-[100%] left-0 w-full origin-top scale-y-0 opacity-0 bg-white group-hover:scale-y-100 transition-transform group-hover:opacity-[1] duration-300 shadow-lg rounded-md z-10">
            <div
              className={`flex items-center justify-between px-3 md:px-4 py-2 mt-2 cursor-pointer hover:bg-gray-200 rounded-t-md ${
                queryDefault.price === "asc" ? "text-red-500" : ""
              }`}
              onClick={() => handleChangePrice("asc")}
            >
              <span className="text-[1.2rem] md:text-[1.4rem]">
                Thấp đến Cao
              </span>
              {queryDefault.price === "asc" && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-[1.2rem] md:text-[1.4rem]"
                />
              )}
            </div>
            <div
              className={`flex items-center justify-between px-3 md:px-4 py-2 mb-2 cursor-pointer hover:bg-gray-200 rounded-b-md ${
                queryDefault.price === "desc" ? "text-red-500" : ""
              }`}
              onClick={() => handleChangePrice("desc")}
            >
              <span className="text-[1.2rem] md:text-[1.4rem]">
                Cao đến Thấp
              </span>
              {queryDefault.price === "desc" && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-[1.2rem] md:text-[1.4rem]"
                />
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className=" md:hidden flex items-center space-x-1 px-4 h-[3rem] bg-white rounded-md cursor-pointer"
          onClick={() =>
            setQueryDefault((prev) => ({
              ...prev,
              price: queryDefault.price === "asc" ? "desc" : "asc",
            }))
          }
        >
          <span>Giá</span>
          <FontAwesomeIcon
            icon={queryDefault.price === "asc" ? faArrowUp : faArrowDown}
            className="text-[1rem] font-extralight"
          />
        </button>
      </div>

      {isLoadingChilOfCate ? (
        <div className="w-full h-[15rem] flex flex-col gap-y-[1.5rem] items-center justify-center mt-[2rem]">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin [animation-duration:2s]"></div>
          <span className="text-[1.3rem] md:text-[1.5rem] text-gray-600">
            Đang tải danh mục...
          </span>
        </div>
      ) : childOfCate && childOfCate.length > 0 ? (
        <div className="my-[3rem]">
          {/* <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="md:text-[2rem] mt-[1rem]">Danh mục con</h2>
            <span className="text-[1.2rem] md:text-[1.4rem] text-gray-500">
              {childOfCate.length} danh mục
            </span>
          </div> */}

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
          <h2 className="md:text-[2rem] mt-[1rem]">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 mt-[2rem]">
            {products?.map((product: ProductT) => {
              return (
                <Link
                  to={`/product-detail/${product.slug}`}
                  key={product.id}
                  className="flex flex-col w-full h-[28rem] md:h-[31rem] border rounded-md border-gray-200 shadow-sm hover:shadow-md hover:shadow-red-300 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={product.mainImage}
                    alt={`mainImage-${product.productName}`}
                    className="w-full h-[16rem] md:h-[20rem] rounded-tl-md rounded-tr-md object-cover"
                  />
                  <div className="flex flex-col flex-1 p-2 md:p-4 space-y-1 md:space-y-1.5">
                    <span className="line-clamp-2 text-[1.3rem] md:text-[1.5rem] leading-snug">
                      {product.productName}
                    </span>
                    <span className="text-red-500 font-semibold text-[1.3rem] md:text-[1.5rem]">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center space-x-3 md:space-x-5 text-[1.1rem] md:text-[1.2rem] mt-auto">
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
                  </div>
                </Link>
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
    </div>
  );
}

export default ProductList;
