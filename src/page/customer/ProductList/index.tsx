import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProductByCategorySlugs } from "../../../api/product.api";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import type { ProductT } from "../../../utils/types";
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

  const { data, isLoading } = useQuery({
    queryKey: ["product-by-category", slugs, queryDefault],
    queryFn: () => getProductByCategorySlugs(slugs, queryDefault),
  });
  const products = data?.data || [];

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
      <div className="w-full py-4 bg-gray-200 flex items-center space-x-6 px-[2rem] rounded-lg">
        <span>Sắp xếp theo</span>
        <button
          type="button"
          className={`px-6 h-[3.4rem]  cursor-pointer ${queryDefault.sort === "popular" ? "bg-red-500 text-white rounded-md hover:bg-red-600" : "bg-white"}`}
          onClick={() => handleChangeSort("popular")}
        >
          Phổ biến
        </button>
        <button
          type="button"
          className={`px-4 h-[3.4rem] ${queryDefault.sort === "latest" ? "bg-red-500 text-white rounded-md hover:bg-red-600" : "bg-white"} cursor-pointer rounded-md`}
          onClick={() => handleChangeSort("latest")}
        >
          Mới nhất
        </button>
        <button
          type="button"
          className={`px-4 h-[3.4rem] ${queryDefault.sort === "best_seller" ? "bg-red-500 text-white rounded-md hover:bg-red-600" : "bg-white"} cursor-pointer rounded-md`}
          onClick={() => handleChangeSort("best_seller")}
        >
          Bán chạy
        </button>
        <div className="relative w-[20rem] h-[3.4rem] rounded-md bg-white px-4 flex items-center space-x-2 group">
          Giá: {queryDefault.price === "asc" ? "Thấp đến Cao" : "Cao đến Thấp"}
          <div className="absolute top-[100%] left-0 w-full origin-top scale-y-0 opacity-0 bg-white group-hover:scale-y-100 transition-transform  group-hover:opacity-[1] duration-300">
            <div
              className={`flex items-center justify-between px-4 py-2 mt-2 cursor-pointer hover:bg-gray-200 ${queryDefault.price === "asc" ? "text-red-500" : ""}`}
              onClick={() => handleChangePrice("asc")}
            >
              Thấp đến Cao
              {queryDefault.price === "asc" && (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </div>
            <div
              className={`flex items-center justify-between px-4 py-2 mb-2 cursor-pointer hover:bg-gray-200 ${queryDefault.price === "desc" ? "text-red-500" : ""}`}
              onClick={() => handleChangePrice("desc")}
            >
              Cao đến Thấp
              {queryDefault.price === "desc" && (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </div>
          </div>
          <span className="ml-auto">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className="w-full h-auto flex flex-col gap-y-[2rem] items-center justify-center mt-[15rem]">
          <div className="w-20 h-20 border-4 border-dashed border-blue-500 rounded-full animate-spin [animation-duration:2s]"></div>
          Đang tải dữ liệu...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-5 mt-[2rem]">
          {products?.map((product: ProductT) => {
            return (
              <Link
                to={`/product-detail/${product.slug}`}
                key={product.id}
                className="flex flex-col w-full h-[31rem] border rounded-md border-gray-200 shadow-md hover:shadow-md hover:shadow-red-300 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={product.mainImage}
                  alt={`mainImage-${product.productName}`}
                  className="w-full h-[20rem] rounded-tl-md rounded-tr-md object-cover"
                />
                <div className="flex flex-col flex-1 p-4 space-y-1.5">
                  <span className="line-clamp-2 text-[1.5rem]">
                    {product.productName}
                  </span>
                  <span className="text-red-500">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center space-x-5 text-[1.2rem] mt-auto">
                    <span className="flex items-center space-x-1">
                      <span className="block mt-0.5">
                        {product.averageRating}
                      </span>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
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
        <div className="w-full h-[40rem] flex flex-col items-center justify-center select-none">
          <img src={noProduct} alt="no-product" className="w-[20rem]" />
          <span>Không có sản phẩm nào!</span>
        </div>
      )}
    </div>
  );
}

export default ProductList;
