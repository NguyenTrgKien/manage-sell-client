import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { OrderType } from "../../page/Dashboard/order/ListOrders";
import MotionWrapper from "../ui/MotionWrapper";
import { faAdd, faClose, faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import axiosConfig from "../../configs/axiosConfig";
import type { UseQueryResult } from "@tanstack/react-query";

interface ReviewProp {
  openReview: { open: boolean; data: null | OrderType };
  onClose: () => void;
  refetch: () => Promise<UseQueryResult<any>>;
}

interface ReviewData {
  message: string;
  rating: number;
  images: File[];
  showAccount: boolean;
}

function Review({ openReview, onClose, refetch }: ReviewProp) {
  const [reviewData, setReviewData] = useState<Record<number, ReviewData>>({});
  const [message, setMessage] = useState<
    Record<number, { message: string; images: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (openReview.data) {
      const initialData: Record<number, ReviewData> = {};
      openReview.data.orderItems.forEach((item) => {
        initialData[item.id] = {
          message: "",
          rating: 5,
          images: [],
          showAccount: true,
        };
        setImageUrls((prev) => ({
          ...prev,
          [item.id]: [],
        }));
        setMessage((prev) => ({
          ...prev,
          [item.id]: {
            message: "",
            images: "",
          },
        }));
      });
      setReviewData(initialData);
    }
  }, [openReview.data]);

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRatingChange = (itemId: number, rating: number) => {
    setReviewData((prev) => {
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          message: prev[itemId].message || "",
          showAccount: prev[itemId].showAccount,
          images: prev[itemId].images || [],
          rating,
        },
      };
    });
  };

  const handleChangeImages = (
    itemId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;
    if (!files) return;

    const currentImages = reviewData[itemId]?.images || [];
    const remainingImages = 2 - currentImages.length;

    if (remainingImages <= 0) {
      setMessage((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          images: "Chỉ được upload tối đa 2 ảnh!",
        },
      }));
      return;
    }
    const newFiles = Array.from(files).slice(0, remainingImages);
    setReviewData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating: prev[itemId]?.rating || 5,
        message: prev[itemId]?.message || "",
        images: [...currentImages, ...newFiles],
      },
    }));
    newFiles.forEach((file) => {
      const imgUrl = URL.createObjectURL(file);
      setImageUrls((prev) => ({
        ...prev,
        [itemId]: [...prev[itemId], imgUrl],
      }));
    });
  };

  const handleRemoveImage = (itemId: number, index: number) => {
    setReviewData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: prev[itemId].images.filter((_, i) => i !== index),
      },
    }));
    setImageUrls((prev) => ({
      ...prev,
      [itemId]: prev[itemId].filter((_, i) => i !== index),
    }));
  };

  const handleSendReview = async (itemId: number) => {
    if (reviewData[itemId].message.length > 200) {
      setMessage((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          message: "Nội dung không được quá 200 kí tự!",
        },
      }));
      return;
    }
    if (reviewData[itemId].images.length > 2) {
      setMessage((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          images: "Chỉ được upload tối đa 2 ảnh!",
        },
      }));
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("rating", reviewData[itemId].rating.toString());
    formData.append("showAccount", reviewData[itemId].showAccount.toString());
    formData.append("orderItemId", itemId.toString());
    if (reviewData[itemId].message !== "") {
      formData.append("message", reviewData[itemId].message);
    }
    if (reviewData[itemId].images.length > 0) {
      reviewData[itemId].images.forEach((img) => {
        formData.append("images", img);
      });
    }
    try {
      const res = (await axiosConfig.post("/api/v1/evaluate/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })) as any;
      if (res.status) {
        await refetch();
        toast.success(res.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetMessage = (itemId: number, title?: string) => {
    setMessage((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        ...(title === "message"
          ? { message: "" }
          : title === "images"
            ? { images: "" }
            : {
                message: "",
                images: "",
              }),
      },
    }));
  };

  return (
    <MotionWrapper
      open={openReview.open}
      className="relative w-[65rem] min-h-[20rem] rounded-lg bg-white p-[2.5rem]"
    >
      <button
        type="button"
        className="absolute top-[1rem] right-[1rem]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </button>
      <h2 className="text-[2rem] text-yellow-500 mb-[2.5rem] font-bold text-center">
        Đánh giá sản phẩm
      </h2>

      <div className="space-y-8 max-h-[50rem] overflow-auto hide-scrollbar">
        {openReview.data?.orderItems
          .filter((it) => it.evaluate.length === 0)
          .map((item) => {
            const product = item.variant.product;
            const currentReviewData = reviewData[item.id] || {
              message: "",
              rating: 5,
              images: [],
              showAccount: true,
            };
            const messageError = message[item.id] || {
              message: "",
              images: "",
            };
            const displayImages = imageUrls[item.id];
            return (
              <div
                key={item.id}
                className="border rounded-md border-gray-300 p-[2rem]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.mainImage}
                      alt={product.productName}
                      className="w-[5rem] h-[5rem] rounded-sm object-cover"
                    />
                    <div className="max-w-xl">
                      <p className="line-clamp-1">{product.productName}</p>
                      <p className="text-[1.2rem] text-gray-600">
                        Phân loại: size {item.variant.variantSize.name}, màu{" "}
                        {item.variant.variantColor.name}
                      </p>
                      <p className="text-[1.2rem] text-gray-600">
                        Số lượng: x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-[1.4rem] text-red-500">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center mt-[1rem]">
                  <p className="text-[1.4rem] text-gray-600 mr-[.5rem]">
                    Sao đánh giá:{" "}
                  </p>
                  <div className="space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(item.id, star)}
                      >
                        <FontAwesomeIcon
                          icon={
                            star <= currentReviewData.rating
                              ? faStar
                              : faStarRegular
                          }
                          className={`text-[1.6rem] ${
                            star <= currentReviewData.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-[1rem]">
                  <p className="text-gray-600">
                    Bình luận <span className="text-red-500">*</span>
                  </p>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    placeholder="Nhận xét của bạn về sản phẩm..."
                    className="w-full border border-gray-400 p-[1rem] rounded-md mt-[.5rem] outline-cyan-600"
                    onChange={(e) => {
                      resetMessage(item.id, "message");
                      setReviewData((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...prev[item.id],
                          message: e.target.value,
                        },
                      }));
                    }}
                  ></textarea>
                  <p className="text-[1.4rem] text-red-500 mt-[.5rem]">
                    {messageError.message}
                  </p>
                </div>
                <div className="mt-[1rem]">
                  <p className="text-gray-600">
                    Hình ảnh minh họa (tối đa 2 ảnh)
                  </p>
                  <div className="flex items-center space-x-4 mt-[.5rem]">
                    {displayImages &&
                      displayImages.length > 0 &&
                      displayImages.map((img, index) => {
                        return (
                          <div
                            key={img}
                            className="relative w-[8rem] h-[8rem] border border-gray-400 flex flex-col items-center justify-center rounded-md cursor-pointer"
                          >
                            <img
                              key={img}
                              src={img}
                              alt={`images-${index}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              className="absolute top-[-.5rem] right-[-.5rem] h-[2rem] w-[2rem] flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600"
                              onClick={() => handleRemoveImage(item.id, index)}
                            >
                              <FontAwesomeIcon
                                icon={faClose}
                                className="text-white text-[1.2rem]"
                              />
                            </button>
                          </div>
                        );
                      })}
                    <label
                      htmlFor={`image-${item.id}`}
                      className="w-[8rem] h-[8rem] border border-dashed border-gray-600 flex flex-col space-y-1 items-center justify-center rounded-md cursor-pointer"
                    >
                      <FontAwesomeIcon
                        icon={faAdd}
                        className="text-gray-500 text-[1.4rem]"
                      />
                      <span className="text-[1rem] text-gray-600">
                        Thêm ảnh
                      </span>
                      <input
                        type="file"
                        id={`image-${item.id}`}
                        name="images"
                        className="hidden"
                        accept="images/*"
                        multiple
                        onChange={(e) => {
                          resetMessage(item.id, "images");
                          handleChangeImages(item.id, e);
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[1.4rem] text-red-500 mt-[.5rem]">
                    {messageError.images}
                  </p>
                </div>
                <div className="flex justify-end mt-[1rem]">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-[2rem] py-[.5rem] rounded-md bg-amber-400 text-white hover:bg-amber-500 transition duration-300"
                    onClick={() => {
                      resetMessage(item.id);
                      handleSendReview(item.id);
                    }}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-[2rem] flex items-center gap-[1rem] justify-end">
        <button
          type="button"
          className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          disabled={isSubmitting}
        >
          Hủy
        </button>
      </div>
    </MotionWrapper>
  );
}

export default Review;
