import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { ProductT } from "../../../utils/types";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import AddCart from "../../../components/AddCart";
import { getSortProducts } from "../../../api/product.api";
import { useUser } from "../../../hooks/useUser";
import noProduct from "../../../assets/images/no-product.png";
import ProductFilterBar from "../../../components/ProductFilterBar";

function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort");
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
      prev.set("price", price);
      return prev;
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
    <div className="mt-[20rem] md:mt-[17rem] px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem] ">
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
                  className="group bg-white rounded-xl p-4 shadow hover:shadow-lg cursor-pointer relative overflow-hidden"
                >
                  <Link
                    to={`/product-detail/${product.slug}`}
                    className="block relative w-full h-[14rem] md:h-[18rem] lg:h-[22rem] overflow-hidden rounded-xl"
                  >
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-3 py-1 text-white text-sm font-semibold">
                      Hot
                    </div>

                    <div className="relative h-[14rem] md:-[18rem] lg:h-[22rem] md:h-full overflow-hidden rounded-lg mb-3">
                      <img
                        src={
                          product.mainImage || "https://via.placeholder.com/300"
                        }
                        alt={product.productName || "Sản phẩm flash sale"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform rounded-xl"
                      />
                    </div>

                    <div className="hidden xl:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="hidden xl:flex absolute w-full h-[4rem] bottom-[.5rem] right-[50%] translate-x-[50%] gap-[1rem] items-center justify-center rounded-xl translate-y-[4.5rem] group-hover:translate-y-0 transition duration-300">
                      <button
                        type="button"
                        className="w-[10rem] h-[3.4rem] bg-white hover:bg-gray-200 rounded-md cursor-pointer transition duration-300 flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowAddCart({ open: true, data: product });
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faCartPlus}
                          className="text-[1.6rem] text-gray-600"
                        />
                        <span className="text-[1.4rem] text-gray-600">
                          Thêm
                        </span>
                      </button>
                      <Link
                        to={`/product-detail/${product.slug}`}
                        className="w-[4rem] h-[3.4rem] flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-md cursor-pointer transition duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-[2rem] text-white"
                        />
                      </Link>
                    </div>
                  </Link>

                  <div className="mt-4 px-2 text-left">
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
                  <div className="flex items-center xl:hidden gap-x-4 justify-end mt-2.5">
                    <button
                      className="hidden md:block text-blue-600 hover:text-blue-700 text-[1.2rem] md:text-[1.4rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate(`/product-detail/${product.slug}`);
                      }}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="w-[8rem] md:w-[10rem] h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer transition duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddCart({ open: true, data: product });
                      }}
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                      <span>Thêm</span>
                    </button>
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
