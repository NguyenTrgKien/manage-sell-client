import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import {
  faClose,
  faCalendar,
  faBox,
  faEye,
  faStar,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import {
  type Collection,
  type CollectionProduct,
} from "../../../utils/collection.type";
import dayjs from "dayjs";

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

function CollectionDetailModal({
  isOpen,
  onClose,
  collection,
}: CollectionDetailModalProps) {
  if (!collection) return null;

  const isActive = collection.status === "active";

  return (
    <MotionWrapper
      open={isOpen}
      className="relative bg-white rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto hide-scrollbar"
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 px-[2rem] py-[1.5rem] z-10">
        <h3 className="text-[2rem] font-semibold ">Chi tiết Collection</h3>
        <button
          onClick={onClose}
          className="absolute w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center top-[1.5rem] right-[1.5rem] hover:bg-gray-200 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faClose} className="" />
        </button>
      </div>

      <div className="px-[2rem] py-[2rem] space-y-6">
        <div className="w-full h-[25rem] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x250?text=No+Image";
            }}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-[2.4rem] font-bold  mb-2">{collection.name}</h2>
            {collection.slug && (
              <p className="text-gray-500 font-mono">/{collection.slug}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span
              className={`px-4 py-2 rounded-full  font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
            {collection.isFeature && (
              <span className="px-4 py-2 rounded-full  font-medium bg-amber-100 text-amber-700">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Nổi bật
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-[1.6rem] font-semibold  mb-2">Mô tả</h4>
          <p className="  leading-relaxed">
            {collection.description || "Không có mô tả"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-blue-600 text-[1.6rem]"
              />
              <h4 className=" font-semibold ">Ngày bắt đầu</h4>
            </div>
            <p className="text-[1.6rem] font-bold text-blue-700">
              {collection.startDate
                ? dayjs(collection.startDate).format("DD/MM/YYYY")
                : "Chưa xác định"}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-purple-600 text-[1.6rem]"
              />
              <h4 className=" font-semibold ">Ngày kết thúc</h4>
            </div>
            <p className="text-[1.6rem] font-bold text-purple-700">
              {collection.endDate
                ? dayjs(collection.endDate).format("DD/MM/YYYY")
                : "Chưa xác định"}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faBox}
                className="text-green-600 text-[1.6rem]"
              />
              <h4 className=" font-semibold ">Số sản phẩm</h4>
            </div>
            <p className="text-[1.6rem] font-bold text-green-700">
              {collection.collectionProducts?.length || 0} sản phẩm
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faEye}
                className="text-orange-600 text-[1.6rem]"
              />
              <h4 className=" font-semibold ">Lượt xem</h4>
            </div>
            <p className="text-[1.6rem] font-bold text-orange-700">
              {collection.viewCount || 0} lượt
            </p>
          </div>
        </div>

        {collection.collectionProducts &&
          collection.collectionProducts.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-[1.6rem] font-semibold  mb-4">
                Sản phẩm trong collection (
                {collection.collectionProducts.length})
              </h4>
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {collection.collectionProducts.map(
                  (item: CollectionProduct, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 flex items-center gap-3 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      {item.product?.mainImage && (
                        <img
                          src={item.product.mainImage}
                          alt={item.product.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className=" font-medium  truncate">
                          {item.product?.productName || `Sản phẩm ${index + 1}`}
                        </p>
                        {item.product?.price && (
                          <p className="text-[1.2rem] text-gray-500">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.product.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between ">
            <span className="text-gray-500">Ngày tạo:</span>
            <span className="font-medium ">
              {dayjs(collection.createdAt).format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex justify-between ">
            <span className="text-gray-500">Cập nhật lần cuối:</span>
            <span className="font-medium ">
              {dayjs(collection.updatedAt).format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>
          {collection.type && (
            <div className="flex justify-between ">
              <span className="text-gray-500">Loại:</span>
              <span className="font-medium  capitalize">{collection.type}</span>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end bg-white border-t border-gray-200 px-[2rem] py-[1.5rem]">
        <button
          onClick={onClose}
          className="px-[1.5rem] py-[0.75rem] bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
        >
          Đóng
        </button>
      </div>
    </MotionWrapper>
  );
}

export default CollectionDetailModal;
