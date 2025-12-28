import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faThumbsUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { faThumbsUp as faThumbsUpRegular } from "@fortawesome/free-regular-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvaluate } from "../api/product.api";
import type { EvaluateType } from "../utils/productType";
import axiosConfig from "../configs/axiosConfig";
import RequireLogin from "./RequireLogin";
import { useUser } from "../hooks/useUser";

interface EvaluateProductProp {
  productId: number;
  averageRating: number;
}

function EvaluateProduct({ productId, averageRating }: EvaluateProductProp) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [requireLogin, setRequireLogin] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["evaluates", productId, sort, filterRating],
    queryFn: () =>
      getEvaluate({
        productId: productId,
        rating: filterRating,
        page: 1,
        sort: sort,
      }),
  }) as any;

  const evaluate = data?.data || [];
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [currentImageIndexMap, setCurrentImageIndexMap] = useState<
    Record<number, number>
  >({});

  const getCurrentIndex = (reviewId: number) =>
    currentImageIndexMap[reviewId] ?? 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            icon={faStar}
            key={star}
            className={`text-[1.4rem] ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date}`;
  };

  const openExpandedImage = (reviewId: number, index: number) => {
    setExpandedReviewId(reviewId);
    setCurrentImageIndexMap((prev) => ({ ...prev, [reviewId]: index }));
  };

  const closeExpandedImage = () => {
    setExpandedReviewId(null);
  };

  const goNext = () => {
    if (expandedReviewId === null) return;

    const review = evaluate.find((r: any) => r.id === expandedReviewId);
    if (!review || !review.images) return;

    const currentIndex = getCurrentIndex(expandedReviewId);
    const nextIndex =
      currentIndex >= review.images.length - 1 ? 0 : currentIndex + 1;

    setCurrentImageIndexMap((prev) => ({
      ...prev,
      [expandedReviewId]: nextIndex,
    }));
  };

  const goPrev = () => {
    if (expandedReviewId === null) return;

    const review = evaluate.find((r: any) => r.id === expandedReviewId);
    if (!review || !review.images) return;

    const currentIndex = getCurrentIndex(expandedReviewId);
    const prevIndex =
      currentIndex <= 0 ? review.images.length - 1 : currentIndex - 1;

    setCurrentImageIndexMap((prev) => ({
      ...prev,
      [expandedReviewId]: prevIndex,
    }));
  };

  const handleToggleHelpfulReview = async (itemId: number) => {
    if (!user) {
      setRequireLogin(true);
      return;
    }
    try {
      const queryKey = ["evaluates", productId, sort, filterRating];

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === itemId
              ? {
                  ...item,
                  isLiked: !item.isLiked,
                  helpfulCount: item.isLiked
                    ? item.helpfulCount - 1
                    : item.helpfulCount + 1,
                }
              : item
          ),
        };
      });
      const res = (await axiosConfig.post(
        `/api/v1/evaluate/toggle-helpful/${itemId}`
      )) as any;

      if (res.data.status) {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((item: EvaluateType) =>
              item.id === itemId
                ? {
                    ...item,
                    isLiked: res.data.isLiked,
                    helpfulCount: res.data.helpfulCount ?? item.helpfulCount,
                  }
                : item
            ),
          };
        });
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className="w-full mt-[2rem] p-[2.5rem] bg-white rounded-lg">
      <h3 className="text-[2.2rem] text-pink-600 uppercase mb-8">Đánh giá sản phẩm</h3>

      <div className="flex items-center space-x-8 border border-[#bdb600] p-[3rem] rounded-sm bg-[#fffff9] mb-[2rem]">
        <div className="flex items-start flex-col justify-center">
          <p className="text-[2.5rem]">{averageRating} / 5</p>
          <div>
            {renderStars(
              evaluate?.reduce(
                (acc: number, item: EvaluateType) => item.rating + acc,
                0
              ) / evaluate.length
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className={`px-[2rem] py-[.5rem] border  rounded-sm text-[1.4rem] ${filterRating === "all" ? "text-red-500 border-red-500" : "text-gray-800 border-gray-400"} cursor-pointer`}
            onClick={() => setFilterRating("all")}
          >
            Tất cả ({data && data.summary.total})
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            return (
              <button
                key={star}
                type="button"
                className={`px-[2rem] py-[.5rem] border rounded-sm text-[1.4rem] ${filterRating === star ? "text-red-500 border-red-500" : "text-gray-800 border-gray-400"} cursor-pointer`}
                onClick={() => {
                  setFilterRating(star);
                }}
              >
                {star} Sao ({data && data.summary.ratingCount[star]})
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12 gap-2">
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      )}

      {evaluate.length === 0 ? (
        <div className="text-center py-12">
          <p className=" text-gray-600">Chưa có đánh giá nào.</p>
          <p className="text-gray-400 mt-2">
            Hãy là người đầu tiên đánh giá sản phẩm!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluate.map((item: any) => {
            const currentIndex = getCurrentIndex(item.id);

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {item.showAccount ? (
                      !item?.user?.avatar ? (
                        <div className="w-[4rem] h-[4rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {(item.user?.username?.[0] || "K").toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={item.user.avatar}
                          alt={"avatar" + item.user.username}
                          className="w-[4rem] h-[4rem] rounded-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <span className="font-semibold text-gray-900">
                        {item.showAccount
                          ? item.user?.username ||
                            item.customerName ||
                            "Khách hàng"
                          : "Ẩn danh"}
                      </span>
                      <span className="text-[1.4rem] text-gray-500">
                        • {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {renderStars(item.rating)}

                    {item.message && (
                      <p className="mt-4 text-gray-700 leading-relaxed">
                        {item.message}
                      </p>
                    )}

                    {item.images && item.images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {item.images.map((img: any, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Đánh giá ${index + 1}`}
                            className={`w-24 h-24 object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 
                              ${
                                expandedReviewId === item.id &&
                                currentIndex === index
                                  ? "border-blue-500"
                                  : "border-gray-200"
                              }`}
                            onClick={() => openExpandedImage(item.id, index)}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mt-[1rem]">
                      <span className="text-[1.4rem] text-gray-600">
                        Bài đánh giá này hữu ích
                      </span>
                      <button
                        className="cursor-pointer flex items-center gap-2 transition-all hover:scale-110"
                        type="button"
                        onClick={() => handleToggleHelpfulReview(item.id)}
                      >
                        <FontAwesomeIcon
                          icon={item.isLiked ? faThumbsUp : faThumbsUpRegular}
                          className={`text-xl transition-colors ${
                            item.isLiked ? "text-red-500" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`text-[1.4rem] font-medium ${item.isLiked ? "text-red-500" : "text-gray-600"}`}
                        >
                          {item.helpfulCount}
                        </span>
                      </button>
                    </div>

                    {expandedReviewId === item.id &&
                      item.images &&
                      item.images.length > 0 && (
                        <div className="mt-8 relative rounded-xl overflow-hidden w-[40rem] shadow-sm mx-auto">
                          <div className="relative border border-gray-200">
                            <img
                              src={item.images[currentIndex]}
                              alt={`Ảnh lớn ${currentIndex + 1}`}
                              className="w-full max-h-[40rem] object-contain"
                            />

                            <button
                              type="button"
                              onClick={closeExpandedImage}
                              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="text-gray-600 text-2xl"
                              />
                            </button>

                            {item.images.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={goPrev}
                                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center hover:scale-[1.2] transition duration-300"
                                >
                                  <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    className="text-gray-400 text-2xl"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={goNext}
                                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center hover:scale-[1.2] transition duration-300"
                                >
                                  <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="text-gray-400 text-2xl"
                                  />
                                </button>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/60 rounded-full text-white text-lg">
                                  {currentIndex + 1} / {item.images.length}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <RequireLogin
        open={requireLogin}
        onClose={() => setRequireLogin(false)}
      />
    </div>
  );
}

export default EvaluateProduct;
