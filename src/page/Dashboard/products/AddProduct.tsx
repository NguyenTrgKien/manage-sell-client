import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import axiosConfig from "../../../configs/axiosConfig";
import { toast } from "react-toastify";
import type { CategoriesType, ProductT } from "../../../utils/types";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../../api/category.api";

interface ActionProductProp {
  openActionProduct: { action: string } | null;
  setOpenActionProduct: Dispatch<SetStateAction<any>>;
  dataUpdate: ProductT;
}

interface ProductFormData {
  productName: string;
  price: number | null;
  description: string;
  mainImage: FileList | null;
  inventory: number | null;
  listImages: FileList | null;
  categoryId: number | undefined;
}

function ActionProduct({
  openActionProduct,
  setOpenActionProduct,
  dataUpdate,
}: ActionProductProp) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      productName: "",
      price: null,
      description: "",
      mainImage: null,
      listImages: null,
      inventory: null,
      categoryId: undefined,
    },
  });
  const { data = [] } = useQuery({
    queryKey: ["allCategory"],
    queryFn: getAllCategory,
  });

  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [listImageUrl, setListImageUrl] = useState<string[]>([]);

  const mainImageWatch = watch("mainImage");
  const listImagesWatch = watch("listImages");

  useEffect(() => {
    if (mainImageWatch && mainImageWatch.length > 0) {
      const file = mainImageWatch[0];
      const url = URL.createObjectURL(file);
      setMainImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainImageWatch]);

  useEffect(() => {
    if (listImagesWatch && listImagesWatch.length > 0) {
      const urls = Array.from(listImagesWatch).map((file) =>
        URL.createObjectURL(file)
      );
      setListImageUrl(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [listImagesWatch]);

  useEffect(() => {
    if (openActionProduct?.action === "edit" && dataUpdate) {
      reset({
        productName: dataUpdate.productName || "",
        price: dataUpdate.price || null,
        description: dataUpdate.description || "",
        inventory: dataUpdate.inventory || null,
        categoryId: dataUpdate.categoryId || undefined,
      });
      if (dataUpdate.mainImage) {
        setMainImageUrl(dataUpdate.mainImage);
      }
      if (dataUpdate.listImages?.length > 0) {
        setListImageUrl(dataUpdate.listImages.map((it) => it.imageUrl));
      }
    }
  }, [openActionProduct, dataUpdate, reset]);

  const handleRemoveListImage = (index: number) => {
    const currentFiles = listImagesWatch;
    if (currentFiles) {
      const dt = new DataTransfer();
      Array.from(currentFiles).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setValue("listImages", dt.files);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("price", String(data.price) ?? "");
      formData.append("description", data.description);
      formData.append("inventory", String(data.inventory) ?? "");
      formData.append("categoryId", String(data.categoryId) ?? "");

      if (data.mainImage && data.mainImage.length > 0) {
        formData.append("mainImage", data.mainImage[0]);
      }

      if (data.listImages) {
        Array.from(data.listImages).forEach((file) => {
          formData.append("listImages", file);
        });
      }

      for (const a of formData.entries()) {
        console.log(a[0], a[1]);
      }

      const endpoint =
        openActionProduct?.action === "add"
          ? "/api/v1/product/create"
          : `/api/v1/product/update/${dataUpdate.id}`;

      const res = (await axiosConfig.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })) as any;

      if (res.status) {
        toast.success(
          res.message ||
            `${openActionProduct?.action === "add" ? "Thêm" : "Cập nhật"} sản phẩm thành công!`
        );
        setOpenActionProduct(null);
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed w-full h-[100vh] top-0 left-0 bg-[#3636362c] flex items-center justify-center z-[900]">
      <div className="relative w-[100rem] h-auto bg-white rounded-[1rem] shadow-xl p-[2rem]">
        <div
          className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => setOpenActionProduct(null)}
        >
          <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
        </div>
        <h2 className="text-[2.5rem] text-gray-600 text-center font-bold mb-[4rem]">
          {openActionProduct?.action === "add"
            ? "Thêm sản phẩm"
            : "Chỉnh sửa sản phẩm"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-[2rem]">
            <div className="w-[35%] text-center">
              <h4 className="font-bold text-gray-600">Hình ảnh sản phẩm</h4>
              <div className="my-[2rem]">
                <label className="text-gray-600">Ảnh chính</label>
                <input
                  type="file"
                  className="hidden"
                  id="mainImage"
                  accept="image/*"
                  {...register("mainImage", {
                    required:
                      openActionProduct?.action === "add"
                        ? "Vui lòng chọn ảnh chính"
                        : false,
                  })}
                />
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer w-full h-[20rem] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  {mainImageUrl ? (
                    <img
                      src={mainImageUrl}
                      alt="Main"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Chọn ảnh chính</span>
                  )}
                </label>
                {errors.mainImage && (
                  <p className="text-red-500 text-[1.2rem] mt-1">
                    {errors.mainImage.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[1.4rem] text-gray-600 block mb-[.5rem]">
                  Ảnh phụ
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="listImages"
                  {...register("listImages")}
                />

                <label
                  htmlFor="listImages"
                  className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center py-[1rem] hover:bg-gray-50"
                >
                  <span className="text-gray-400">Chọn ảnh phụ</span>
                </label>

                <div className="mt-[1rem] grid grid-cols-4 gap-[1rem]">
                  {listImageUrl.map((url, index) => {
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`list-${index}`}
                          className="w-full h-[8rem] object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveListImage(index)}
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-[.3rem] text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-[65%] pl-[2rem] border-l border-l-gray-300">
              <h4 className="font-bold text-gray-600">Thông tin sản phẩm</h4>
              <div className="mt-[2rem]">
                <label
                  htmlFor="productName"
                  className="text-[1.4rem] text-gray-600"
                >
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Tên sản phẩm..."
                  className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-2"
                  {...register("productName", {
                    required: "Vui lòng nhập tên sản phẩm",
                    minLength: {
                      value: 3,
                      message: "Tên sản phẩm phải có ít nhất 3 ký tự",
                    },
                  })}
                />
                {errors.productName && (
                  <p className="text-red-500 text-[1.2rem] mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>
              <div className="mt-[2rem] flex items-center gap-[2rem]">
                <div className="flex-1">
                  <label
                    htmlFor="price"
                    className="text-[1.4rem] text-gray-600"
                  >
                    Giá sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="VD: 250000"
                    className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-2"
                    {...register("price", {
                      required: "Vui lòng nhập giá sản phẩm",
                      min: {
                        value: 0,
                        message: "Giá sản phẩm phải lớn hơn 0",
                      },
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="inventory"
                    className="text-[1.4rem] text-gray-600"
                  >
                    Số lượng kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="inventory"
                    placeholder="VD: 5"
                    className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-2"
                    {...register("inventory", {
                      required: "Vui lòng nhập số lượng kho",
                      min: {
                        value: 0,
                        message: "Số lượng kho phải lớn hơn hoặc bằng 0",
                      },
                    })}
                  />
                  {errors.inventory && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.inventory.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-[2rem]">
                <label
                  htmlFor="categoryId"
                  className="text-[1.4rem] text-gray-600"
                >
                  Danh mục sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-2"
                  {...register("categoryId", {
                    required: "Vui lòng chọn danh mục sản phẩm",
                  })}
                >
                  <option value="" disabled>
                    Chọn danh mục sản phẩm
                  </option>
                  {data.map((item: CategoriesType) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.categoryName}
                      </option>
                    );
                  })}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-[1.2rem] mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
              <div className="mt-[2rem]">
                <label
                  htmlFor="description"
                  className="text-[1.4rem] text-gray-600"
                >
                  Mô tả
                </label>
                <textarea
                  className="w-full rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] pt-[1rem] focus:border-cyan-300 focus:border-2"
                  rows={3}
                  id="description"
                  {...register("description")}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-[2rem] flex items-center justify-end gap-[1rem]">
            <button
              className="h-[3.2rem] w-[6rem] text-gray-600 bg-gray-200 hover:bg-gray-300 rounded text-[1.4rem] cursor-pointer"
              type="button"
              onClick={() => setOpenActionProduct(null)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              className="h-[3.2rem] w-[8rem] flex items-center justify-center text-white bg-red-500 rounded text-[1.4rem] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>
                  {openActionProduct?.action === "add" ? "Thêm" : "Cập nhật"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActionProduct;
