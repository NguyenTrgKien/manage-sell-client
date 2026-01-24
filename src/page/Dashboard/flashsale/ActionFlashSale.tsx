import {
  faSave,
  faArrowLeft,
  faPlus,
  faTrash,
  faAdd,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import SelectProduct from "./SelectProduct";
import type { ProductT } from "../../../utils/types";
import axiosConfig from "../../../configs/axiosConfig";
import { toast } from "react-toastify";
import { getFlashsaleById } from "../../../api/flashsale.api";

export interface FlashSaleProductsForm {
  id?: number;
  productId: number;
  quantity: number;
  limit: number;
  origin_price: number;
}

interface FlashSaleForm {
  name: string;
  startDate: string;
  endDate: string;
  discount: string;
  description: string;
  bannerImage: null | File;
  flashSaleProducts: FlashSaleProductsForm[];
}

function ActionFlashSale() {
  const { id } = useParams();
  const mode = id ? "edit" : "create";
  const navigate = useNavigate();
  const [showSelectProduct, setShowSelectProduct] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FlashSaleForm>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      discount: "",
      description: "",
      bannerImage: null,
      flashSaleProducts: [],
    },
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const flashSaleProducts = watch("flashSaleProducts");
  const [selectedPro, setSelectedPro] = useState<ProductT[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  register("flashSaleProducts", {
    validate: (v) => v.length > 0 || "Vui lòng chọn ít nhất 1 sản phẩm!",
  });

  useEffect(() => {
    if (id) {
      const fetchFlashSale = async () => {
        try {
          const res = await getFlashsaleById(Number(id));
          if (res.status && res.data) {
            const data = res.data;

            reset({
              name: data.name,
              discount: data.discount,
              description: data.description,
              startDate: data.startDate.slice(0, 10),
              endDate: data.endDate.slice(0, 10),
              flashSaleProducts: data.flashSaleProduct.map((p: any) => ({
                id: p.id,
                productId: p.product.id,
                quantity: p.quantity,
                limit: p.limit,
                origin_price: p.origin_price,
              })),
            });
            if (res.data.bannerImage) {
              setImageUrl(res.data.bannerImage);
            }
            const dataProducts = data.flashSaleProduct.map((fsp: any) => {
              return fsp.product;
            });
            setSelectedPro(dataProducts);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchFlashSale();
    }
  }, [id, reset]);

  const onSubmit = async (data: FlashSaleForm) => {
    if (flashSaleProducts.length === 0) {
      return;
    }

    const startDate = new Date(data.startDate).toISOString();
    const endDate = new Date(data.endDate).toISOString();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("discount", data.discount);
    if (mode === "edit" && deletedIds.length > 0) {
      formData.append("deletedIds", JSON.stringify(deletedIds));
    }
    const dataFlashSaleProducts = data.flashSaleProducts.map((f) => ({
      productId: f.productId,
      limit: f.limit,
      quantity: f.quantity,
      origin_price: f.origin_price,
    }));
    formData.append("flashSaleProducts", JSON.stringify(dataFlashSaleProducts));
    if (data.bannerImage) {
      formData.append("bannerImage", data.bannerImage);
    }
    try {
      let res = null;
      if (mode === "create") {
        res = await axiosConfig.post("/api/v1/flashsale/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axiosConfig.patch(`/api/v1/flashsale/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (res.status) {
        navigate("/dashboard/flashsale", { replace: true });
        reset({
          name: "",
          startDate: "",
          endDate: "",
          discount: "",
          description: "",
          flashSaleProducts: [],
        });
      }
    } catch (error) {
      console.log(error);
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setValue("bannerImage", file);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveProduct = (productId: number) => {
    const flashSaleProduct = flashSaleProducts.find(
      (p) => p.productId === productId
    );
    const newSelect = flashSaleProducts.filter(
      (p) => p.productId !== productId
    );
    setValue("flashSaleProducts", newSelect);
    setSelectedPro((prev) => prev.filter((p) => p.id !== productId));
    if (mode === "edit" && flashSaleProduct?.id) {
      setDeletedIds((prev) => [...prev, flashSaleProduct.id!]);
    }
  };

  const handleChangeQuantity = (action: string, productId: number) => {
    const newData = flashSaleProducts?.map((p) => {
      if (productId === p.productId) {
        return {
          ...p,
          quantity:
            action === "incre" ? ++p.quantity : Math.max(1, --p.quantity),
        };
      }
      return p;
    });
    setValue("flashSaleProducts", newData);
  };

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="flex justify-between items-center border-b-[.1rem] border-b-gray-300 pb-[2rem]">
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => navigate("/dashboard/flashsale")}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[1.8rem] text-gray-600"
            />
          </button>
          <h3 className="text-[2rem] font-semibold text-gray-600">
            Tạo Flash Sale Mới
          </h3>
        </div>
      </div>

      <div className="mt-[2rem]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-6">
                  Thông tin chương trình
                </h4>
                <label
                  htmlFor="bannerImage"
                  className="w-full h-[25rem] flex items-center justify-center rounded-xl border border-dashed border-gray-400 cursor-pointer text-[1.4rem] group"
                >
                  {imageUrl ? (
                    <div className="w-full h-full rounded-xl relative">
                      <img
                        src={imageUrl}
                        alt="bannerImage"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="opacity-0 group-hover:opacity-[100] flex items-center text-[1.8rem] justify-center absolute inset-0 bg-[#2f2f2f56] text-white transition-discrete duration-300">
                        <FontAwesomeIcon icon={faEdit} />
                        Thay đổi
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="w-14 h-14 rounded-full border border-dashed border-gray-400 flex justify-center items-center">
                        <FontAwesomeIcon
                          icon={faAdd}
                          className="text-gray-500"
                        />
                      </span>
                      <span>Thêm ảnh</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    id="bannerImage"
                    onChange={(e) => handleChangeImage(e)}
                    disabled={isSubmitting}
                  />
                </label>
                <div className="my-6">
                  <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
                    Tên chương trình <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên chương trình flash sale"
                    className="w-full px-4 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500"
                    {...register("name", {
                      required: "Vui lòng nhập tên flashsale!",
                    })}
                  />
                  {errors.name && (
                    <p className="text-[1.4rem] text-red-500">
                      {errors.name?.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
                    Phần trăm giảm giá (%){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập phần trăm giảm giá"
                    min="1"
                    max="100"
                    className="w-full px-4 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500"
                    {...register("discount", {
                      required: "Vui lòng nhập tên giảm giá!",
                    })}
                  />
                  {errors.discount && (
                    <p className="text-[1.4rem] text-red-500">
                      {errors.discount?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    placeholder="Nhập mô tả chi tiết về chương trình"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500 resize-none"
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-[1.6rem] font-semibold text-gray-700 mb-4">
                  Thời gian áp dụng
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500"
                      {...register("startDate", {
                        required: "Vui lòng nhập ngày bắt đầu!",
                      })}
                    />
                    {errors.startDate && (
                      <p className="text-[1.4rem] text-red-500">
                        {errors.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500"
                      {...register("endDate", {
                        required: "Vui lòng nhập ngày kết thúc!",
                      })}
                    />
                    {errors.endDate && (
                      <p className="text-[1.4rem] text-red-500">
                        {errors.endDate?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[1.6rem] font-semibold text-gray-700">
                    Sản phẩm áp dụng
                  </h4>
                  <button
                    className="text-white text-[1.4rem] flex gap-2 items-center px-4 h-[3.5rem] bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => setShowSelectProduct(true)}
                    type="button"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm sản phẩm
                  </button>
                </div>
                {errors.flashSaleProducts && (
                  <p className="text-red-500 text-[1.3rem]">
                    {errors.flashSaleProducts.message}
                  </p>
                )}

                <div className="space-y-3 max-h-[50rem] overflow-y-auto">
                  {selectedPro?.length > 0 ? (
                    selectedPro?.map((product: ProductT) => {
                      return (
                        <div key={product.id}>
                          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.mainImage}
                                alt={`mainImage ${product.productName}`}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div>
                                <p className="text-[1.4rem] font-medium text-gray-800">
                                  {product.productName}
                                </p>
                                <p className="text-[1.3rem] text-gray-600">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveProduct(product.id)}
                              className="p-4 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-[1.8rem]"
                              />
                            </button>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="flex items-center space-x-4 text-[1.4rem]">
                              <span>Số lượng sản phẩm:</span>
                              <div className="flex items-center space-x-4 ">
                                <span
                                  className="w-9 h-9 rounded-md flex items-center justify-center border border-gray-400 cursor-pointer select-none"
                                  onClick={() =>
                                    handleChangeQuantity("decre", product.id)
                                  }
                                >
                                  -
                                </span>
                                <input
                                  type="number"
                                  id="quantity"
                                  className="max-w-22 outline-none h-9 border border-gray-400 rounded-md text-[1.4rem] px-2"
                                  value={
                                    flashSaleProducts?.find(
                                      (p: any) => p.productId === product.id
                                    )?.quantity ?? 1
                                  }
                                  onChange={(e) => {
                                    const newData = flashSaleProducts.map(
                                      (p) =>
                                        p.productId === product.id
                                          ? {
                                              ...p,
                                              quantity: Number(e.target.value),
                                            }
                                          : p
                                    );
                                    setValue("flashSaleProducts", newData);
                                  }}
                                />
                                <span
                                  className="w-9 h-9 rounded-md flex items-center justify-center border border-gray-400 cursor-pointer select-none"
                                  onClick={() =>
                                    handleChangeQuantity("incre", product.id)
                                  }
                                >
                                  +
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-[1.4rem]">
                              <span>
                                Giới hạn số lượng mỗi khách mua sản phẩm:
                              </span>
                              <input
                                type="number"
                                id="limit"
                                className="h-9 min-w-10 max-w-25 border border-gray-400 rounded-md outline-none px-2"
                                value={
                                  flashSaleProducts.find(
                                    (p) => p.productId === product.id
                                  )?.limit ?? 1
                                }
                                max={10}
                                onChange={(e) => {
                                  const newLimit = flashSaleProducts.map(
                                    (prev) => ({
                                      ...prev,
                                      limit:
                                        prev.productId === product.id
                                          ? Number(e.target.value)
                                          : prev.limit,
                                    })
                                  );
                                  setValue("flashSaleProducts", newLimit);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-[1.4rem]">
                        Chưa có sản phẩm nào được chọn
                      </p>
                      <p className="text-[1.3rem] mt-2">
                        Nhấn "Thêm sản phẩm" để bắt đầu
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center border-b-[.1rem] border-b-gray-300 pb-[2rem]">
            <div className="flex items-center gap-[1.5rem]">
              <button
                type="button"
                className="text-gray-600 text-[1.4rem] flex gap-2 items-center px-6 h-[4rem] bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => navigate("/dashboard/flashsale")}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="text-white text-[1.4rem] flex gap-2 items-center px-6 h-[4rem] bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faSave} />
                {isSubmitting ? "Đang xử lý..." : "Lưu Flash Sale"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showSelectProduct && (
        <SelectProduct
          open={showSelectProduct}
          onClose={() => setShowSelectProduct(false)}
          setSelectedPro={setSelectedPro}
          selectedPro={selectedPro}
          setValue={setValue}
        />
      )}
    </div>
  );
}

export default ActionFlashSale;
