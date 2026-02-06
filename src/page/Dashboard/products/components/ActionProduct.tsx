import {
  faAdd,
  faArrowLeft,
  faArrowRight,
  faEdit,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import axiosConfig from "../../../../configs/axiosConfig";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getVariantColor, getVariantSize } from "../../../../api/product.api";
import Loading from "../../../../components/Loading";
import TiptapEditor from "./TiptapEditorProp";
import type { VariantColor, VariantSize } from "../variant/ActionVariant";
import ActionVariant from "../variant/ActionVariant";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../../api/category.api";
import type { CategoriesType } from "../../../../utils/types";
import RenderParentOption from "../../../../components/RenderParentOption";

interface ProductFormData {
  id?: number;
  productName: string;
  price: number | null;
  description: string;
  mainImage: FileList | null;
  inventory: number | null;
  listImages: FileList | null;
  categoryId: number | undefined;
  variants: {
    id: number | null;
    sizeId: number | null;
    colorId: number | null;
    price: number | null;
    inventory: number | null;
    tempId: string | null;
    isEdited: boolean;
  }[];
}

function ActionProduct() {
  const { id } = useParams();
  const mode = id ? "edit" : "create";
  const navigate = useNavigate();
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const {
    control,
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
      variants: [],
    },
  });
  const { data: dataCategories = [] } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setIsLoadingProduct(true);
        const res = (await axiosConfig.get(
          `/api/v1/product/admin/detail/${id}`,
        )) as any;

        if (res.status && res.product) {
          const dataUpdate = res.product;
          reset({
            id: dataUpdate.id,
            productName: dataUpdate.productName || "",
            price: dataUpdate.price || null,
            description: dataUpdate.description || "",
            inventory: dataUpdate.inventory || null,
            categoryId: dataUpdate.category.id || undefined,
            variants: dataUpdate.variants.map((it: any, idx: number) => ({
              id: it.id,
              sizeId: it.variantSize.id || null,
              colorId: it.variantColor.id || null,
              price: it.price || null,
              inventory: it.inventory || null,
              tempId: it.id ? `old-${it.id}` : Date.now() + String(idx),
              isEdited: false,
            })),
          });
          if (dataUpdate.mainImage) {
            setMainImageUrl(dataUpdate.mainImage);
          }
          if (dataUpdate.listImageProduct?.length > 0) {
            const images = dataUpdate.listImageProduct.map((img: any) => ({
              id: img.id,
              url: img.imageUrl,
            }));
            setListImages(images);
            setOriginalImageIds(images.map((img: any) => img.id));
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const { data: dataSize, isLoading: isLoadingSize } = useQuery<VariantSize[]>({
    queryKey: ["variantSize"],
    queryFn: getVariantSize,
  });
  const { data: dataColor, isLoading: isLoadingColor } = useQuery<
    VariantColor[]
  >({
    queryKey: ["variantColor"],
    queryFn: getVariantColor,
  });

  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [openActionVariant, setOpenActionVariant] = useState<{
    open: boolean;
    node: "add" | "edit";
    data: any;
  }>({
    open: false,
    node: "add",
    data: null,
  });
  const [isAddDescription, setIsAddDescription] = useState(false);
  const mainImageWatch = watch("mainImage");
  const variants = watch("variants");
  const [listImages, setListImages] = useState<
    Array<{
      id?: number;
      file?: File;
      url: string;
    }>
  >([]);
  const [originalImageIds, setOriginalImageIds] = useState<number[]>([]);

  const [deletedVariantIds, setDeletedVariantIds] = useState<number[]>([]);

  useEffect(() => {
    if (mainImageWatch && mainImageWatch.length > 0) {
      const file = mainImageWatch[0];
      const url = URL.createObjectURL(file);
      setMainImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainImageWatch]);

  useEffect(() => {
    return () => {
      listImages.forEach((img) => {
        if (img.file && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });

      if (mainImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(mainImageUrl);
      }
    };
  }, []);

  const handleRemoveListImage = (index: number) => {
    setListImages((prev) => {
      const img = prev[index];

      if (img.file && img.url.startsWith("blob:")) {
        URL.revokeObjectURL(img.url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      if (data.price) {
        formData.append("price", String(data.price));
      }
      formData.append("description", data.description);
      if (data.categoryId) {
        formData.append("categoryId", String(data.categoryId));
      }
      if (!data.variants || data.variants.length === 0) {
        toast.error("Vui lòng chọn ít nhất một thuộc tính");
        return;
      }

      for (let i = 0; i < data.variants.length; i++) {
        const v = data.variants[i];
        if (!v.sizeId || !v.colorId) {
          toast.error(
            `Vui lòng chọn đầy đủ size và color cho thuộc tính thứ ${i + 1}`,
          );
          return;
        }
      }

      const variantKeys = new Set();
      for (let i = 0; i < data.variants.length; i++) {
        const v = data.variants[i];
        const key = `${v.sizeId}-${v.colorId}`;
        if (variantKeys.has(key)) {
          toast.error(`Thuộc tính size và màu bị trùng lặp ở vị trí ${i + 1}`);
          return;
        }
        variantKeys.add(key);
      }

      if (data.variants && data.variants.length > 0) {
        if (mode === "create") {
          const configVariants = variants.map((v) => {
            const { tempId, ...rest } = v;
            return rest;
          });
          formData.append("variants", JSON.stringify(configVariants));
        } else {
          const newVariants = variants
            .filter((v) => !v.id)
            .map((v) => {
              return {
                sizeId: v.sizeId,
                colorId: v.colorId,
                price: v.price,
                inventory: v.inventory,
              };
            });
          const editVariants = variants
            .filter((v) => v.id && v.isEdited)
            .map((v) => ({
              id: v.id,
              sizeId: v.sizeId,
              colorId: v.colorId,
              price: v.price,
              inventory: v.inventory,
            }));
          formData.append("editedVariants", JSON.stringify(editVariants));
          formData.append("newVariants", JSON.stringify(newVariants));
          formData.append(
            "deletedVariantIds",
            JSON.stringify(deletedVariantIds),
          );
        }
      }

      if (data.mainImage && data.mainImage.length > 0) {
        formData.append("mainImage", data.mainImage[0]);
      }

      if (mode === "edit") {
        const keptIds = listImages
          .filter((img) => img.id && !img.file)
          .map((img) => img.id);

        const deletedIds = originalImageIds.filter(
          (id) => !keptIds.includes(id),
        );

        const newFiles = listImages
          .filter((img) => img.file)
          .map((img) => img.file!);

        formData.append("keptListImageIds", JSON.stringify(keptIds));
        formData.append("deletedListImageIds", JSON.stringify(deletedIds));
        newFiles.forEach((file) => {
          formData.append("newImages", file);
        });
      } else {
        const files = listImages
          .filter((img) => img.file)
          .map((img) => img.file!);

        files.forEach((file) => {
          formData.append("listImages", file);
        });
      }
      const endpoint =
        mode === "create"
          ? "/api/v1/product/create"
          : `/api/v1/product/update/${data.id}`;

      let res = null;
      if (mode === "create") {
        res = (await axiosConfig.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })) as any;
      } else {
        res = (await axiosConfig.patch(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })) as any;
      }

      if (res.status) {
        toast.success(
          res.message ||
            `${mode === "create" ? "Thêm" : "Cập nhật"} sản phẩm thành công!`,
        );
        if (mode === "create") {
          reset();
          setMainImageUrl("");
          navigate(`/dashboard/products`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleRemoveItemVariant = (index: number) => {
    const variant = variants[index];

    if (variant.id) {
      setDeletedVariantIds((prev) => [...prev, Number(variant.id)]);
    }
    setValue(
      "variants",
      variants.filter((_, i) => i !== index),
    );
  };

  const handleChangeItemListImage = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      event.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);

    setListImages((prev) => {
      const newList = [...prev];
      const oldImg = newList[index];

      if (oldImg.file && oldImg.url.startsWith("blob:")) {
        URL.revokeObjectURL(oldImg.url);
      }

      newList[index] = {
        file,
        url,
      };

      return newList;
    });

    event.target.value = "";
  };

  const displayImages = useMemo(() => {
    return listImages.map((img) => ({
      type: img.id ? "old" : "new",
      url: img.url,
      id: img.id,
    }));
  }, [listImages]);

  if (mode === "edit" && isLoadingProduct) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="flex">
        <Link
          to={`/dashboard/products`}
          className="flex items-center space-x-1 text-gray-600 px-6 rounded-md py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
      <h2
        className={`text-[2.5rem] ${mode === "create" ? "text-green-700" : "text-amber-700"} text-center font-bold mb-[2rem]`}
      >
        {mode === "create" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isAddDescription ? (
          <>
            <div className="flex gap-[2rem]">
              <div className="w-[35%] text-center">
                <h4 className={`font-bold`}>Hình ảnh sản phẩm</h4>
                <div className="my-[2rem]">
                  <label className="text-gray-600">Ảnh chính</label>
                  <input
                    type="file"
                    className="hidden"
                    id="mainImage"
                    accept="image/*"
                    {...register("mainImage", {
                      required:
                        mode === "create" ? "Vui lòng chọn ảnh chính" : false,
                    })}
                  />
                  <label
                    htmlFor="mainImage"
                    className="cursor-pointer w-[20rem] h-[20rem] mx-auto border-2 border-dashed border-gray-300 rounded-md flex flex-col gap-y-[1rem] items-center justify-center hover:bg-gray-50"
                  >
                    {mainImageUrl ? (
                      <img
                        src={mainImageUrl}
                        alt="Main"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faAdd}
                          className="text-[1.8rem] text-gray-400"
                        />
                        <span className="text-gray-400">Chọn ảnh chính</span>
                      </>
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
                    Ảnh phụ (tối đa 4 ảnh)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="listImages"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      const maxImages = 4;

                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                      ];
                      const invalidFiles = files.filter(
                        (f) => !validTypes.includes(f.type),
                      );

                      if (invalidFiles.length > 0) {
                        toast.error(
                          "Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)",
                        );
                        e.target.value = "";
                        return;
                      }

                      const maxSize = 5 * 1024 * 1024;
                      const oversizedFiles = files.filter(
                        (f) => f.size > maxSize,
                      );

                      if (oversizedFiles.length > 0) {
                        toast.error("Mỗi ảnh không được vượt quá 5MB");
                        e.target.value = "";
                        return;
                      }

                      const currentTotal = listImages.length;
                      const remaining = maxImages - currentTotal;

                      if (files.length > remaining) {
                        toast.error(
                          `Chỉ có thể thêm tối đa ${remaining} ảnh nữa!`,
                        );
                        e.target.value = "";
                        return;
                      }

                      const newFiles = files.map((file) => ({
                        file: file as File,
                        url: URL.createObjectURL(file),
                      }));

                      setListImages((prev) => [...prev, ...newFiles]);

                      e.target.value = "";
                    }}
                  />

                  <label
                    htmlFor="listImages"
                    className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-md flex gap-2.5 items-center justify-center py-[1rem] hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faAdd} className="text-gray-400" />
                    <span className="text-gray-400">Chọn ảnh phụ</span>
                  </label>

                  <div className="mt-[1rem] grid grid-cols-4 gap-[1rem]">
                    {listImages.map((img, index) => {
                      const key = img.id ? `old-${img.id}` : `new-${index}`;

                      return (
                        <label
                          htmlFor={`image-${index}`}
                          key={key}
                          className="relative group"
                        >
                          <img
                            src={img.url}
                            alt={`image-${index}`}
                            className="w-full h-[8rem] object-cover rounded-md border border-gray-300"
                          />
                          <input
                            type="file"
                            id={`image-${index}`}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={(e) =>
                              handleChangeItemListImage(index, e)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveListImage(index)}
                            className="absolute w-[2.5rem] h-[2.5rem] top-1 right-1 bg-white/80 rounded-full text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="text-[1.4rem]"
                            />
                          </button>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-[65%] pl-[2rem] border-l border-l-gray-300">
                <h4 className={`font-bold `}>Thông tin sản phẩm</h4>

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
                    className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 px-[1.5rem] focus:border-cyan-300 focus:border-1"
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
                  <div className="w-full">
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
                      className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-1"
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
                  <div className="w-full">
                    <label
                      htmlFor="categoryId"
                      className="text-[1.4rem] text-gray-600"
                    >
                      Danh mục sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      className="w-full h-[4rem] rounded-md outline-none text-gray-600 border border-gray-300 pl-[1.5rem] focus:border-cyan-300 focus:border-1"
                      {...register("categoryId", {
                        required: "Vui lòng chọn danh mục sản phẩm",
                      })}
                    >
                      <option value="" disabled>
                        Chọn danh mục sản phẩm
                      </option>
                      {dataCategories
                        .filter(
                          (cat: CategoriesType) =>
                            cat.parentId === null && cat.isActive,
                        )
                        .map((parent: CategoriesType) => (
                          <RenderParentOption
                            key={parent.id}
                            category={parent}
                            allCategories={dataCategories}
                            level={0}
                          />
                        ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-[1.2rem] mt-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </div>
                <input type="number" className="hidden" {...register("id")} />
                <div className="mt-[2rem]">
                  <label
                    htmlFor="description"
                    className="text-[1.4rem] text-gray-600"
                  >
                    Mô tả sản phẩm
                  </label>

                  <button
                    type="button"
                    className={`flex items-center space-x-1 px-[2rem] py-[.6rem] rounded-md  border border-green-400 hover:border-green-600 text-green-500 hover:text-green-600  transition duration-300 cursor-pointer mt-[.5rem]`}
                    onClick={() => setIsAddDescription(true)}
                  >
                    <span>Mô tả</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>

                <div className={`mt-[2rem] border-t border-gray-300 pt-[2rem]`}>
                  <label className={`text-[1.6rem] font-bold block mb-[1rem]`}>
                    Thuộc tính sản phẩm (tuỳ chọn)
                  </label>

                  <button
                    type="button"
                    className="mb-[1rem] text-white bg-green-500 px-[1rem] py-[.5rem] rounded hover:bg-green-600"
                    onClick={() =>
                      setOpenActionVariant({
                        open: true,
                        node: "add",
                        data: null,
                      })
                    }
                  >
                    + Thêm thuộc tính
                  </button>
                </div>
                <div
                  className={`flex flex-col divide-y ${variants.length > 0 ? "divide-gray-300 border border-gray-300" : ""} rounded-xl`}
                >
                  {variants?.map((variant, index: number) => {
                    const size = dataSize?.find(
                      (it) => it.id === variant.sizeId,
                    );
                    const color = dataColor?.find(
                      (it) => it.id === variant.colorId,
                    );

                    return (
                      <div
                        key={variant.id ?? variant.tempId ?? index}
                        className="relative flex items-center px-[2rem] py-[1rem] hover:bg-gray-50"
                      >
                        <div className="w-[20rem] flex flex-col gap-[1rem]">
                          <div className="flex items-center gap-[.5rem] text-[1.4rem] text-gray-600">
                            <span>Size: </span>
                            <span className="block px-[1.5rem] py-[.4rem] bg-blue-200 rounded-md font-bold text-blue-800">
                              {size?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-[.5rem] text-[1.4rem] text-gray-600">
                            <span>Màu: </span>
                            <span
                              className="block w-[2rem] h-[2rem] rounded-full border-[.2rem] border-gray-300"
                              style={{ background: color?.hexCode }}
                            ></span>
                            <span>{color?.name}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[1rem]">
                          <div className="flex items-center gap-[.5rem] text-[1.4rem] text-gray-600">
                            <span>Giá: </span>
                            <span className="text-amber-800 px-[1.5rem] py-[.4rem] bg-amber-100 rounded-md">
                              {variant.price
                                ? Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(Number(variant.price))
                                : "Không"}
                            </span>
                          </div>
                          <div className="flex items-center gap-[.5rem] text-[1.4rem] text-gray-600">
                            <span>Kho: </span>
                            <span className="text-green-800 px-[1.5rem] py-[.4rem] bg-green-100 rounded-md">
                              {variant.inventory}
                            </span>
                          </div>
                        </div>
                        <div
                          className="absolute right-[6.5rem] w-[4rem] h-[4rem] flex items-center justify-center rounded-full ml-auto bg-amber-100 hover:bg-amber-200 hover-linear cursor-pointer"
                          onClick={() =>
                            setOpenActionVariant({
                              open: true,
                              node: "edit",
                              data: variant,
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-[1.4rem] text-amber-600"
                          />
                        </div>
                        <div
                          className="absolute right-[2rem]  w-[4rem] h-[4rem] flex items-center justify-center rounded-full ml-auto bg-red-100 hover:bg-red-200 hover-linear cursor-pointer"
                          onClick={() => handleRemoveItemVariant(index)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-red-600 text-[1.4rem]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-[3rem] flex items-center justify-end gap-[1rem]">
              <Link
                to={`/dashboard/products`}
                className="flex items-center space-x-2 px-[2.5rem] py-[.8rem] text-gray-600 bg-gray-200 hover:bg-gray-300 rounded text-[1.4rem] cursor-pointer"
                type="button"
              >
                <span>Quay lại</span>
              </Link>
              <button
                className="px-[2.5rem] py-[.8rem] flex items-center justify-center text-white bg-red-500 rounded text-[1.4rem] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting
                    ? "Đang xử lý..."
                    : mode === "create"
                      ? "Thêm"
                      : "Cập nhật"}
                </span>
              </button>
            </div>
          </>
        ) : (
          <div>
            <label className="text-green-600 text-[1.8rem]">
              Mô tả sản phẩm
            </label>
            <div>
              <button
                type="button"
                className="flex items-center space-x-1 text-gray-600 px-6 rounded-md my-[1rem] py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setIsAddDescription(false);
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500" />
                <span>Quay lại</span>
              </button>
            </div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="mt-[2rem] flex items-center justify-end gap-[1rem]">
              <button
                className="h-[3.2rem] w-[10rem] flex items-center justify-center text-white bg-green-500 rounded text-[1.4rem] hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => setIsAddDescription(false)}
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </form>
      <ActionVariant
        openActionVariant={openActionVariant}
        setOpenActionVariant={setOpenActionVariant}
        setValue={setValue}
        variants={variants}
        dataUpdate={
          openActionVariant.node === "edit" ? openActionVariant.data : undefined
        }
        dataSize={dataSize ?? []}
        isLoadingSize={isLoadingSize}
        dataColor={dataColor ?? []}
        isLoadingColor={isLoadingColor}
      />
    </div>
  );
}

export default ActionProduct;
