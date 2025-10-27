import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import axiosConfig from "../../../../configs/axiosConfig";
import { toast } from "react-toastify";

interface ActionCategoryProp {
  setOpenAction: Dispatch<SetStateAction<any>>;
  openAction: { action: string } | null;
  refetch: () => Promise<any>;
  dataUpdate?: any;
}

function ActionCategory({
  setOpenAction,
  openAction,
  refetch,
  dataUpdate,
}: ActionCategoryProp) {
  const [data, setData] = useState<{
    categoryName: string;
    image: File | undefined | string;
  }>({
    categoryName: "",
    image: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlImage, setUrlImage] = useState<string | null>(null);

  useEffect(() => {
    if (openAction?.action === "edit") {
      setData({
        categoryName: dataUpdate.categoryName,
        image: dataUpdate.image,
      });
      setUrlImage(dataUpdate.image);
    } else {
      setData({
        categoryName: "",
        image: undefined,
      });
      setUrlImage(null);
    }
  }, [openAction?.action, dataUpdate]);

  const handleChangeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "image") {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setUrlImage(url);
      setData((prev) => {
        return {
          ...prev,
          image: file,
        };
      });
    } else {
      setData((prev) => {
        return {
          ...prev,
          categoryName: value,
        };
      });
    }
  };

  const handleAdd = async () => {
    setError(null);
    if (data.categoryName === "") {
      setError("Vui lòng nhập tên danh mục!");
      return;
    }

    if (!data.image) {
      setError("Vui lòng chọn hình ảnh cho danh mục này!");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      const res = (await axiosConfig.post("/api/v1/category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })) as any;
      if (res.status) {
        setData({
          categoryName: "",
          image: "",
        });
        await refetch();
        toast.success(res.message || "Thêm danh mục thành công!");
        setOpenAction(null);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("categoryName", data.categoryName);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      const res = (await axiosConfig.patch(
        `/api/v1/category/edit/${dataUpdate.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )) as any;
      if (res.status) {
        toast.success(res.message || "Đã lưu thay đổi!");
        await refetch();
        setOpenAction(null);
      } else {
        toast.error(res.message || "Lỗi không thể cập nhật thông tin!");
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi server!");
    }
  };

  return (
    <div className="fixed w-full h-[100vh] top-0 left-0 bg-[#3636362c] flex items-center justify-center z-[900]">
      <div className="relative w-[50rem] h-auto bg-white rounded-[1rem] shadow-xl p-[2rem]">
        <div
          className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200"
          onClick={() => setOpenAction(null)}
        >
          <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
        </div>
        <h2 className="text-[2rem] text-gray-600 text-center font-bold mb-[2rem]">
          {openAction?.action === "add"
            ? "Thêm danh mục"
            : "Chỉnh sửa danh mục"}
        </h2>
        <div>
          <label htmlFor="categoryName" className="text-gray-600">
            Tên
          </label>
          <input
            type="text"
            name="categoryName"
            id="categoryName"
            value={data.categoryName}
            placeholder="Nhập tên..."
            className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem]"
            onChange={(e) => handleChangeData(e)}
          />
        </div>
        <div className="mt-[2rem]">
          <span className="text-gray-600">Ảnh cho danh mục:</span>
          <label className="w-[6.5rem] h-[6.5rem] mt-[.5rem] border border-dashed border-gray-400 rounded-[.5rem] flex items-center justify-center cursor-pointer">
            {urlImage ? (
              <img
                src={urlImage}
                alt="Ảnh danh mục"
                className="w-full h-full  border-collapse border-gray-400 rounded-[.5rem] flex items-center justify-center cursor-pointer object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faPlus} className="text-gray-400" />
            )}
            <input
              id="image"
              type="file"
              name="image"
              hidden
              onChange={(e) => handleChangeData(e)}
            />
          </label>
        </div>
        {error && (
          <p className="text-red-500 text-[1.4rem] mt-[4rem]">{error}</p>
        )}
        <div className="mt-[2rem] flex items-center justify-end gap-[1rem]">
          <button
            className={`h-[3.2rem] w-[6rem] text-gray-600 bg-gray-200 hover:bg-gray-300 rounded text-[1.4rem]  ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => setOpenAction(null)}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            className={`h-[3.2rem] w-[8rem] flex items-center justify-center text-white bg-red-500 rounded text-[1.4rem] ${
              isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-red-600"
            }`}
            onClick={() => {
              if (openAction?.action === "add") {
                handleAdd();
              } else {
                handleEdit();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : openAction?.action === "add" ? (
              "Thêm"
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionCategory;
