import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProductT } from "../../../utils/types";
import { useQuery } from "@tanstack/react-query";
import AddCart from "../../../components/AddCart";
import { getSortProducts } from "../../../api/product.api";
import { useUser } from "../../../hooks/useUser";
import noProduct from "../../../assets/images/no-product.png";
import ProductFilterBar from "../../../components/ProductFilterBar";
import { useVoucherContext } from "../../../contexts/VoucherContext";

function ProductsPage() {
  const navigate = useNavigate();
  const { hasVoucher } = useVoucherContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const price = searchParams.get("price");
  const { user } = useUser();
  const [queryDefault, setQueryDefault] = useState<{
    limit: number;
    page: number;
    sort: "popular" | "latest" | "best_seller";
    price: "asc" | "desc";
  }>({
    limit: 10,
    page: 1,
    sort: "popular",
    price: "asc",
  });
  const [showAddCart, setShowAddCart] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (price) {
      setQueryDefault((prev) => ({
        ...prev,
        price: (price as "asc" | "desc") ?? "asc",
      }));
    }
  }, [price]);

  useEffect(() => {
    if (sort) {
      setQueryDefault((prev) => ({
        ...prev,
        sort: sort as "popular" | "latest" | "best_seller",
      }));
    }
  }, [sort]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", queryDefault],
    queryFn: () => getSortProducts({ query: queryDefault, userId: user?.id }),
  });

  const ProductsPages = data?.data ?? [];

  const handleChangeSort = (sort: "popular" | "latest" | "best_seller") => {
    setQueryDefault((prev) => ({
      ...prev,
      sort: sort,
    }));
    setSearchParams({ sort });
  };

  const handleChangePrice = (price: "asc" | "desc") => {
    setQueryDefault((prev) => ({
      ...prev,
      price: price,
    }));
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("price", price);
      return newParams;
    });
  };

  const Skeleton = () => {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-product animate-pulse">
        <div className="h-[18rem] md:h-[20rem] bg-gray-200 rounded-xl mb-4" />
        <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
      </div>
    );
  };

  return (
    <div
      className={`${
        hasVoucher ? "mt-[20rem] md:mt-[17rem]" : "mt-[17rem] md:mt-[14rem]"
      } px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem] `}
    >
      <div className="bg-white p-5 rounded-xl">
        <h3 className="text-[2rem] mb-6 font-bold">
          {sort === "popular"
            ? "Sản phẩm nổi bật"
            : sort === "best_seller"
              ? "Sản phẩm bán chạy"
              : "Sản phẩm mới nhất"}
        </h3>
        <ProductFilterBar
          handleChangePrice={handleChangePrice}
          handleChangeSort={handleChangeSort}
          queryDefault={queryDefault}
          setQueryDefault={setQueryDefault}
        />
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : ProductsPages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
            {ProductsPages.map((product: ProductT) => {
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
      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />
    </div>
  );
}

export default ProductsPage;
