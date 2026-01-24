import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../../../api/product.api";
import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowUp,
  faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import type { ProductT } from "../../../utils/types";

function SearchProducts() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [queryDefault, setQueryDefault] = useState<{
    limit: number;
    page: number;
    productName: string;
    sort: "popular" | "latest" | "best_seller";
    price: "asc" | "desc";
  }>({
    limit: 20,
    page: 1,
    productName: query || "",
    sort: "popular",
    price: "asc",
  });

  useEffect(() => {
    if (query) {
      setQueryDefault((prev) => ({
        ...prev,
        productName: query,
      }));
    }
  }, [query]);

  const { data: dataProducts, isLoading: ProductLoading } = useQuery({
    queryKey: ["products", queryDefault, user?.id],
    queryFn: () =>
      getProducts({
        query: queryDefault,
        userId: user?.id,
      }),
  }) as any;
  const products = dataProducts && dataProducts.data;

  const totalPages = (dataProducts && dataProducts.pagination.totalPage) || 1;
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
    <div className="mt-[20rem] md:mt-[17rem] px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem]">
      <h3 className="pb-5">
        {products?.length > 0 ? (
          <>
            Tìm thấy <span className="text-red-500">{products.length}</span> kết
            quả cho <span className="text-red-500">"{query}"</span>
          </>
        ) : (
          <>
            Kết quả tìm kiếm <span className="text-red-500">"{query}"</span>
          </>
        )}
      </h3>
      <div className="w-full py-3 md:py-4 text-[1.2rem] md:text-[1.6rem] bg-gray-200 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-0 md:space-x-6 px-[1rem] md:px-[2rem] rounded-lg">
        <span>Sắp xếp theo</span>

        <div className="flex items-center md:gap-4 gap-2 lg:gap-6 flex-wrap md:flex-nowrap">
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

      {ProductLoading ? (
        <div className="py-25 text-center">Đang tải dữ liệu...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 mt-[2rem]">
          {products.map((product: ProductT) => {
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
      ) : (
        <div className="py-25 text-center">
          {products.length === 0 && !ProductLoading && (
            <div className="py-20 text-center">
              <p className="text-[1.6rem] text-gray-500 text-nowrap">
                Không tìm thấy sản phẩm nào cho "{query}"
              </p>
              <p className="text-[1.4rem] text-gray-400 mt-2">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() =>
            setQueryDefault((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={queryDefault.page === 1}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => Math.abs(num - queryDefault.page) <= 2)
          .map((num) => (
            <button
              key={num}
              onClick={() =>
                setQueryDefault((prev) => ({ ...prev, page: num }))
              }
              className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-blue-600 ${
                queryDefault.page === num
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}

        <button
          onClick={() =>
            setQueryDefault((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, totalPages),
            }))
          }
          disabled={queryDefault.page === totalPages}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export default SearchProducts;
