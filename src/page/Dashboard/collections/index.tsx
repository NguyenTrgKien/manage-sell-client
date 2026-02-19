import {
  faAdd,
  faBan,
  faCheckCircle,
  faEdit,
  faEye,
  faFilter,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ActionCollection from "./ActionCollection"; // Import component
import {
  CollectionStatus,
  type Collection,
} from "../../../utils/collection.type";
import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "../../../api/collection.api";
import dayjs from "dayjs";
import AddProductModal from "./AddProductModal";
import DeleteModal from "./ToggleStatusModal";
import CollectionDetailModal from "./DetailCollection";

function Collections() {
  const [queryInput, setQueryInput] = useState<{
    name: string;
    status: CollectionStatus | string;
  }>({
    name: "",
    status: "",
  });
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    ...queryInput,
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allCollections", query],
    queryFn: () => getAllCollections(query),
  });
  const collections = (data && data.data) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<null | Collection>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState<Collection | null>(null);

  const handleOpenAddProductModal = (collection: Collection) => {
    setSelectedCollection(collection);
    setAddProductModalOpen(true);
  };

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
    } else {
      setEditingCollection(null);
    }
    setIsModalOpen(true);
  };

  const handleChangeQuery = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQueryInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    setQuery((prev) => ({
      ...prev,
      ...queryInput,
    }));
  };

  const Skeleton = () => {
    return (
      <tbody className="divide-y divide-gray-200">
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-[1rem] py-[1rem]">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="flex justify-center">
                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="flex justify-center">
                <div className="h-7 w-28 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </td>
            <td className="px-[1rem] py-[1rem]">
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="flex justify-between items-center mb-[2rem]">
        <h3 className="text-[2rem] font-semibold text-gray-700">Collection</h3>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-[1.5rem] py-[0.75rem] rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          Thêm Collection
        </button>
      </div>

      <div className="mb-[1.5rem] flex items-center gap-4">
        <div className="relative w-[30rem]">
          <input
            type="text"
            placeholder="Tìm kiếm collection..."
            value={queryInput.name}
            name="name"
            className="w-full px-[1rem] h-[4rem] pl-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={handleChangeQuery}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute text-[1.4rem] left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <div className="w-[20rem]">
          <select
            name="status"
            id="status"
            value={queryInput.status}
            className="w-full px-[1rem] h-[4rem] pl-[1.5rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={handleChangeQuery}
          >
            <option value="">Trạng thái</option>
            {Object.entries(CollectionStatus).map(([key, value]) => (
              <option key={key} value={value}>
                {value === "active"
                  ? "Hoạt động"
                  : value === "inactive"
                    ? "Không hoạt động"
                    : "Lịch trình"}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-[10rem] px-[1rem] h-[4rem] pl-[1.5rem] bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
          onClick={handleFilter}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>Lọc</span>
        </button>
      </div>

      <table className="w-full table-auto text-[1.4rem] rounded-lg shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-6 py-4">Hình ảnh</th>
            <th className="text-left px-6 py-4">Tên Collection</th>
            <th className="text-left px-6 py-4">Mô tả</th>
            <th className="text-center px-6 py-4">Số sản phẩm</th>
            <th className="text-center px-6 py-4">Ngày tạo</th>
            <th className="text-center px-6 py-4">Trạng thái</th>
            <th className="text-left px-6 py-4">Thao tác</th>
          </tr>
        </thead>
        {isLoading ? (
          <Skeleton />
        ) : collections.length > 0 ? (
          <tbody className="divide-y divide-gray-200">
            {collections.map((collection: Collection) => (
              <tr
                key={collection.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-[1rem] py-[1rem]">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-[1rem] py-[1rem]">{collection.name}</td>
                <td className="px-[1rem] py-[1rem] max-w-[300px] truncate">
                  {collection.description ?? "Không có mô tả"}
                </td>
                <td className="px-[1rem] py-[1rem]">
                  <div className="flex items-center justify-center gap-2">
                    <span>({collection.collectionProducts.length})</span>
                    <button
                      className="text-blue-600 hover:text-blue-800 underline"
                      onClick={() => handleOpenAddProductModal(collection)}
                    >
                      Thêm
                    </button>
                  </div>
                </td>
                <td className="px-[1rem] py-[1rem] text-center">
                  {dayjs(collection.createdAt).format("HH:mm - DD/MM/YYYY")}
                </td>
                <td className={`px-[1rem] py-[1rem] text-center `}>
                  <button
                    className={`px-5 py-1 rounded-full ${collection.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {collection.status === "active"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </button>
                </td>
                <td className="px-[1rem] py-[1rem]">
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Xem"
                      onClick={() => setDetailOpen(collection)}
                    >
                      <FontAwesomeIcon icon={faEye} className="text-[1.6rem]" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(collection)}
                      className="p-2 text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-[1.6rem]"
                      />
                    </button>
                    <button
                      className={`p-2 ${collection.status === "active" ? "text-red-600 border-red-300 bg-red-50 hover:bg-red-100" : "text-green-600 border-green-300 bg-green-50 hover:bg-green-100"}  border  rounded-lg transition-colors`}
                      title={
                        collection.status === "active"
                          ? "Vô hiệu hóa"
                          : "Kích hoạt"
                      }
                      onClick={() => setIsDeleteModalOpen(collection)}
                    >
                      <FontAwesomeIcon
                        icon={
                          collection.status === "active" ? faBan : faCheckCircle
                        }
                        className="text-[1.6rem]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={7} className="text-center py-16">
                Không có sản phẩm nào!
              </td>
            </tr>
          </tbody>
        )}
      </table>

      <ActionCollection
        editingCollection={editingCollection}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setEditingCollection={setEditingCollection}
      />

      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        collection={selectedCollection}
        refetch={refetch}
      />

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={!!isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(null)}
          collection={isDeleteModalOpen}
        />
      )}

      <CollectionDetailModal
        isOpen={!!detailOpen}
        onClose={() => setDetailOpen(null)}
        collection={detailOpen}
      />
    </div>
  );
}

export default Collections;
