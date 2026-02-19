import { useState, useEffect } from "react";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import {
  CollectionStatus,
  type Collection,
} from "../../../utils/collection.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import dayjs from "dayjs";

interface ActionCollectionProp {
  editingCollection: Collection | null;
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  setEditingCollection: (c: Collection | null) => void;
}

interface CollectionForm {
  name: string;
  description?: string;
  imageUrl: File | null | string;
  status: CollectionStatus;
  startDate: string;
  endDate: string;
  isFeature: boolean;
}

function ActionCollection({
  editingCollection,
  isModalOpen,
  setIsModalOpen,
  setEditingCollection,
}: ActionCollectionProp) {
  const [data, setData] = useState<CollectionForm>({
    name: "",
    description: "",
    imageUrl: null,
    status: CollectionStatus.ACTIVE,
    startDate: "",
    endDate: "",
    isFeature: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingCollection) {
      console.log(editingCollection);

      setData({
        name: editingCollection.name,
        description: editingCollection.description,
        imageUrl: editingCollection.imageUrl || null,
        status: editingCollection.status,
        startDate:
          dayjs(editingCollection.startDate).format("YYYY-MM-DD") ||
          new Date().toISOString().split("T")[0],
        endDate:
          dayjs(editingCollection.endDate).format("YYYY-MM-DD") ||
          new Date().toISOString().split("T")[0],
        isFeature: editingCollection.isFeature,
      });
      if (editingCollection.imageUrl) {
        setImagePreview(editingCollection.imageUrl);
      }
    } else {
      setData({
        name: "",
        description: "",
        imageUrl: null,
        status: CollectionStatus.ACTIVE,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        isFeature: false,
      });
      setImagePreview("");
    }
  }, [editingCollection]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.warn("Vui lòng chọn file ảnh!");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.warn("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }

      const reader = URL.createObjectURL(file);
      setImagePreview(reader);
      setData((prev) => ({
        ...prev,
        imageUrl: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setData({ ...data, imageUrl: null });
    const fileInput = document.getElementById("imageUrl") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.imageUrl) {
      toast.warn("Vui lòng chọn hình ảnh");
      return;
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        toast.warn("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("status", data.status);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      if (data.imageUrl instanceof File) {
        formData.append("imageUrl", data.imageUrl);
      }
      formData.append("isFeature", data.isFeature ? "true" : "false");
      let res = null;
      if (editingCollection) {
        res = (await axiosConfig.patch(
          `/api/v1/collections/${editingCollection.id}/update`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )) as any;
      } else {
        res = (await axiosConfig.post(
          "/api/v1/collections/create",
          formData,

          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        )) as any;
      }
      console.log(res);

      if (res.status) {
        toast.success(res.message);
        handleCloseModal();
      }
    } catch (error) {

      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    setData({
      name: "",
      description: "",
      imageUrl: null,
      status: CollectionStatus.ACTIVE,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      isFeature: false,
    });
    setImagePreview("");
  };

  return (
    <MotionWrapper
      open={isModalOpen}
      className="bg-white rounded-xl pb-[2rem] w-full max-w-[650px] max-h-[90vh] overflow-y-auto hide-scrollbar"
    >
      <div className="pt-[2rem] px-[2rem] sticky top-0 bg-white">
        <h4
          className={`font-semibold pb-[1.5rem] ${editingCollection ? "text-amber-600" : "text-green-600"}  `}
        >
          {editingCollection ? "Chỉnh sửa Collection" : "Thêm Collection Mới"}
        </h4>
        <button
          className="absolute w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center top-[1.5rem] right-[1.5rem] p-2 hover:bg-gray-200 rounded-full"
          onClick={() => handleCloseModal()}
        >
          <FontAwesomeIcon icon={faClose} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full h-auto px-[2rem]">
        <div className="space-y-[1.25rem]">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Tên Collection <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-[1rem] py-[0.75rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập tên collection"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-full">
              <label className="block font-medium text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={data.startDate}
                onChange={(e) =>
                  setData({ ...data, startDate: e.target.value })
                }
                className="w-full px-[1rem] py-[0.75rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={data.endDate}
                onChange={(e) => setData({ ...data, endDate: e.target.value })}
                className="w-full px-[1rem] py-[0.75rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={data.description ?? ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              className="w-full px-[1rem] py-[0.75rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
              placeholder="Nhập mô tả cho collection"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Hình ảnh <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="imageUrl"
              className="flex items-center justify-center flex-col w-full h-[200px] border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <input
                type="file"
                id="imageUrl"
                name="imageUrl"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full h-full p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x200?text=Invalid+Image";
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-12 h-12 rounded-full hover:bg-red-600 transition-colors"
                    title="Xóa ảnh"
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <FontAwesomeIcon icon={faImage} className="text-[1.8rem]" />
                  <p className=" font-medium mb-1">Chọn ảnh collection</p>
                  <p className="text-[1.2rem] text-gray-500">
                    PNG, JPG, GIF tối đa 5MB
                  </p>
                </div>
              )}
            </label>
          </div>

          <label className="font-medium text-gray-700 cursor-pointer">
            Trạng thái collection
          </label>
          <div className="pl-5 space-y-2 mt-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="status"
                style={{ scale: "1.2" }}
                id={CollectionStatus.ACTIVE}
                value={CollectionStatus.ACTIVE}
                checked={data.status === CollectionStatus.ACTIVE}
                onChange={(e) =>
                  setData({
                    ...data,
                    status: e.target.value as CollectionStatus,
                  })
                }
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor={CollectionStatus.ACTIVE}
                className="cursor-pointer"
              >
                Kích hoạt
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="status"
                style={{ scale: "1.2" }}
                id={CollectionStatus.INACTIVE}
                value={CollectionStatus.INACTIVE}
                checked={data.status === CollectionStatus.INACTIVE}
                onChange={(e) =>
                  setData({
                    ...data,
                    status: e.target.value as CollectionStatus,
                  })
                }
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor={CollectionStatus.INACTIVE}
                className="cursor-pointer"
              >
                Không hoạt động
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              checked={data.isFeature}
              onChange={(e) =>
                setData({ ...data, isFeature: e.target.checked })
              }
            />
            <label>Hiển thị nổi bật (Feature)</label>
          </div>
        </div>

        <div className="flex gap-3 mt-[2rem]">
          <button
            type="button"
            onClick={handleCloseModal}
            className="flex-1 px-[1.5rem] py-[0.75rem] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-[1.5rem] py-[0.75rem] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={isLoading}
          >
            {editingCollection ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </MotionWrapper>
  );
}

export default ActionCollection;
