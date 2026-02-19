import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getCollectionBySlug } from "../../../api/collection.api";
import type { Collection } from "../../../utils/collection.type";
import type { ProductT } from "../../../utils/types";
import AddCart from "../../../components/AddCart";

function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [showSortBy, setShowSortBy] = useState(false);
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const [showAddCart, setShowAddCart] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });
  const elementRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["collection", slug, sortBy],
    queryFn: () => getCollectionBySlug(slug, sortBy),
    enabled: !!slug,
  });

  const collection: Collection | undefined = data?.data;
  const products =
    collection?.collectionProducts?.map((cp) => cp.product) || [];

  useEffect(() => {
    const handleClickOutSide = (e: Event) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        setShowSortBy(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="relative h-[30rem] bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  const Skeleton = () => {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-[12rem]">
        <div className="h-8 w-32 bg-gray-300 rounded mb-8 animate-pulse" />
        <div className="h-[30rem] bg-gray-200 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : collection ? (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-[12rem]">
          <h3 className="text-[2rem] font-bold mb-6">
            {collection && collection.name}
          </h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-12">
            <div className="relative h-[35rem] overflow-hidden">
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-[3.6rem] font-bold mb-3">
                  {collection.name}
                </h1>
                {collection.description && (
                  <p className="text-[1.6rem] text-gray-100 max-w-3xl">
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className="w-full py-3 md:py-4 text-[1.2rem] md:text-[1.6rem] bg-gray-200 flex items-center gap-2 md:gap-0 md:space-x-6 px-[1rem] md:px-[2rem] rounded-lg mb-12"
            onClick={() => setShowSortBy(!showSortBy)}
          >
            <span className=" block">Sắp xếp theo</span>
            <div
              className="flex relative w-[20rem] h-[3rem] md:h-[3.4rem] rounded-md bg-white px-3 md:px-4 items-center justify-between group"
              ref={elementRef}
            >
              <span className=" text-[1.2rem] md:text-[1.4rem]">
                Giá: {sortBy === "asc" ? "Thấp đến Cao" : "Cao đến Thấp"}
              </span>
              <FontAwesomeIcon
                icon={faAngleDown}
                className="text-[1.2rem] md:text-[1.4rem]"
              />
              <div
                className={`absolute top-[100%] left-0 w-full origin-top bg-white ${showSortBy ? "scale-y-100 opacity-[1]" : "scale-y-0 opacity-0"} transition-transform  duration-300 shadow-lg rounded-md z-10`}
              >
                <div
                  className={`flex items-center justify-between px-3 md:px-4 py-2 mt-2 cursor-pointer hover:bg-gray-200 rounded-t-md ${
                    sortBy === "asc" ? "text-red-500" : ""
                  }`}
                  onClick={() => setSortBy("asc")}
                >
                  <span className="text-[1.2rem] md:text-[1.4rem]">
                    Thấp đến Cao
                  </span>
                  {sortBy === "asc" && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-[1.2rem] md:text-[1.4rem]"
                    />
                  )}
                </div>
                <div
                  className={`flex items-center justify-between px-3 md:px-4 py-2 mb-2 cursor-pointer hover:bg-gray-200 rounded-b-md ${
                    sortBy === "desc" ? "text-red-500" : ""
                  }`}
                  onClick={() => setSortBy("desc")}
                >
                  <span className="text-[1.2rem] md:text-[1.4rem]">
                    Cao đến Thấp
                  </span>
                  {sortBy === "desc" && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-[1.2rem] md:text-[1.4rem]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {products.map((product: ProductT) => (
                <div
                  key={product.id}
                  className="group bg-white cursor-pointer relative overflow-hidden border border-gray-200"
                  onClick={() => navigate(`/product-detail/${product.slug}`)}
                >
                  <div className="relative h-[16rem] md:h-[18rem] lg:h-[20rem] overflow-hidden">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-gray-500 text-[1.4rem]">
                Bộ sưu tập này hiện chưa có sản phẩm
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gray-50 py-16 px-4 text-center">
          <h3 className="font-semibold text-gray-700 mb-2">
            Không tìm thấy bộ sưu tập
          </h3>
          <Link
            to="/collections"
            className="inline-block mt-4 text-pink-600 hover:text-pink-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      )}
      <AddCart showAddCart={showAddCart} setShowAddCart={setShowAddCart} />;
    </>
  );
}

export default Collection;
