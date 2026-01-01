import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { orderItemsType } from "../../page/Dashboard/order/ListOrders";
import MotionWrapper from "../ui/MotionWrapper";
import { faAdd, faClose, faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import axiosConfig from "../../configs/axiosConfig";
import { useUser } from "../../hooks/useUser";

interface ReviewProp {
  open: boolean;
  item: orderItemsType | null;
  dataGuest?: { customerEmail: string; customerName: string };
  onClose: () => void;
  refetch: any;
}

interface ReviewData {
  message: string;
  rating: number;
  images: File[];
  showAccount: boolean;
}

function Review({ open, item, dataGuest, onClose, refetch }: ReviewProp) {
  const { user } = useUser();
  const [reviewData, setReviewData] = useState<ReviewData>({
    message: "",
    rating: 5,
    images: [],
    showAccount: true,
  });
  const [message, setMessage] = useState<{ message: string; images: string }>({
    message: "",
    images: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (item) {
      const initialData = {
        message: "",
        rating: 5,
        images: [],
        showAccount: true,
      };
      setReviewData(initialData);
    }
  }, [item]);

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => {
      return {
        ...prev,
        rating,
      };
    });
  };

  const handleChangeImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const currentImages = reviewData.images;
    const remainingImages = 2 - currentImages.length;

    if (remainingImages <= 0) {
      setMessage((prev) => ({
        ...prev,
        images: "Chỉ được upload tối đa 2 ảnh!",
      }));
      return;
    }
    const newFiles = Array.from(files).slice(0, remainingImages);
    setReviewData((prev) => ({
      ...prev,
      rating: prev?.rating || 5,
      message: prev?.message || "",
      images: [...currentImages, ...newFiles],
    }));
    newFiles.forEach((file) => {
      const imgUrl = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, imgUrl]);
    });
  };

  const handleRemoveImage = (index: number) => {
    setReviewData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendReview = async (itemId: number) => {
    if (reviewData.message.length > 200) {
      setMessage((prev) => ({
        ...prev,
        message: "Nội dung không được quá 200 kí tự!",
      }));
      return;
    }
    if (reviewData.images.length > 2) {
      setMessage((prev) => ({
        ...prev,
        images: "Chỉ được upload tối đa 2 ảnh!",
      }));
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();

    if (!user && dataGuest) {
      formData.append("customerEmail", dataGuest?.customerEmail);
      formData.append("customerName", dataGuest?.customerName);
    }
    formData.append("rating", reviewData.rating.toString());
    formData.append("showAccount", reviewData.showAccount.toString());
    formData.append("orderItemId", itemId.toString());
    if (reviewData.message !== "") {
      formData.append("message", reviewData.message);
    }
    if (reviewData.images.length > 0) {
      reviewData.images.forEach((img) => {
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
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetMessage = (title?: string) => {
    setMessage((prev) => {
      if (title) {
        return {
          ...prev,
          ...(title === "message" ? { message: "" } : { images: "" }),
        };
      } else {
        return {
          images: "",
          message: "",
        };
      }
    });
  };

  const product = item && item.variant.product;

  return (
    <MotionWrapper
      open={open}
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
      <h2 className="text-[2rem] text-amber-500 mb-[2.5rem] font-bold text-center">
        Đánh giá sản phẩm
      </h2>

      <div className="space-y-8 max-h-[50rem] overflow-auto hide-scrollbar">
        {item && product ? (
          <>
            <div className="border border-gray-300 rounded-md p-[2rem]">
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleRatingChange(i)}
                    >
                      <FontAwesomeIcon
                        icon={i <= reviewData.rating ? faStar : faStarRegular}
                        className={`text-[1.6rem] ${
                          i <= reviewData.rating
                            ? "text-yellow-400"
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
                    resetMessage("message");
                    setReviewData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }));
                  }}
                ></textarea>
                <p className="text-[1.4rem] text-red-500 mt-[.5rem]">
                  {message.message}
                </p>
              </div>
              <div className="mt-[1rem]">
                <p className="text-gray-600">
                  Hình ảnh minh họa (tối đa 2 ảnh)
                </p>
                <div className="flex items-center space-x-4 mt-[.5rem]">
                  {imageUrls &&
                    imageUrls.length > 0 &&
                    imageUrls.map((img, index) => {
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
                            onClick={() => handleRemoveImage(index)}
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
                    <span className="text-[1rem] text-gray-600">Thêm ảnh</span>
                    <input
                      type="file"
                      id={`image-${item.id}`}
                      name="images"
                      className="hidden"
                      accept="images/*"
                      multiple
                      onChange={(e) => {
                        resetMessage("images");
                        handleChangeImages(e);
                      }}
                    />
                  </label>
                </div>
                <p className="text-[1.4rem] text-red-500 mt-[.5rem]">
                  {message.images}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-[3.5rem] gap-[1rem]">
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
              <button
                type="button"
                disabled={isSubmitting}
                className="px-[2rem] py-[.5rem] rounded-md bg-amber-400 text-white hover:bg-amber-500 transition duration-300"
                onClick={() => {
                  resetMessage();
                  handleSendReview(item.id);
                }}
              >
                {isSubmitting ? "Đang xử lý..." : "Gửi đánh giá"}
              </button>
            </div>
          </>
        ) : (
          <div className="border rounded-md border-gray-300 p-[2rem] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-[5rem] h-[5rem] bg-gray-200 rounded-sm" />
                <div className="max-w-xl">
                  <p className="w-full py-2.5 bg-gray-200"></p>
                  <p className="w-[20rem] py-2.5 bg-gray-200"></p>
                  <p className="w-[10rem] py-2.5 bg-gray-200"></p>
                </div>
              </div>
              <p className="w-[10rem] py-2.5 bg-gray-200"></p>
            </div>
            <div className="flex items-center mt-[1rem]">
              <p className="w-[30rem] py-2.5 bg-gray-200"></p>
            </div>
            <div className="mt-[1rem]">
              <p className="text-gray-600">
                Bình luận <span className="text-red-500">*</span>
              </p>
              <textarea
                rows={4}
                placeholder="Nhận xét của bạn về sản phẩm..."
                className="w-full border border-gray-400 p-[1rem] rounded-md mt-[.5rem] outline-cyan-600"
                disabled
              ></textarea>
            </div>
            <div className="mt-[1rem]">
              <p className="text-gray-600">Hình ảnh minh họa (tối đa 2 ảnh)</p>
              <div className="flex items-center space-x-4 mt-[.5rem]">
                <label className="w-[8rem] h-[8rem] border border-dashed border-gray-600 flex flex-col space-y-1 items-center justify-center rounded-md cursor-pointer">
                  <FontAwesomeIcon
                    icon={faAdd}
                    className="text-gray-500 text-[1.4rem]"
                  />
                  <span className="text-[1rem] text-gray-600">Thêm ảnh</span>
                  <input type="file" className="hidden" disabled />
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-[1rem]">
              <button
                type="button"
                disabled
                className="px-[2rem] py-[.5rem] rounded-md bg-amber-400 text-white hover:bg-amber-500 transition duration-300"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        )}
      </div>
    </MotionWrapper>
  );
}

export default Review;
