import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllCollections } from "../../../api/collection.api";
import type { Collection } from "../../../utils/collection.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

function CollectionsPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allCollections", query],
    queryFn: () => getAllCollections(query),
  });
  const collections = (data && data.data) || [];

  const Skeleton = () => {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
        <div className="relative h-[18rem] bg-gray-200">
          <div className="absolute top-4 right-4 h-8 w-24 bg-gray-300 rounded-full" />
        </div>

        <div className="p-6">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />

          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <div className="h-4 bg-gray-300 rounded w-24" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-auto bg-white py-6 px-4 sm:px-6 lg:px-[12rem]">
      <div className="">
        <h1 className="text-[2rem] font-bold mb-2">Collections</h1>
        <p className="text-gray-600">
          Khám phá bộ sưu tập thời trang đa dạng của chúng tôi
        </p>
      </div>

      <div className="mt-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx}>
                <Skeleton />
              </div>
            ))
          ) : collections.length > 0 ? (
            collections.map((collection: Collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-[18rem] overflow-hidden bg-gray-200">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {collection.collectionProducts && (
                    <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-[1.4rem] ">
                      {collection.collectionProducts.length} sản phẩm
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="mb-2 group-hover:text-pink-600 transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-gray-600 text-[1.4rem] mb-4">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex text-[1.4rem] items-center text-pink-600 group-hover:gap-2 transition-all">
                    <span>Xem thêm</span>
                    <FontAwesomeIcon icon={faAngleRight} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center">Không có collection nào!</div>
          )}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="  text-gray-700 mb-2">Chưa có danh mục nào</h3>
            <p className="text-gray-500">
              Vui lòng thêm danh mục sản phẩm để hiển thị tại đây
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionsPage;
