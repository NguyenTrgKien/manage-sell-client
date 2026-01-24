import {
  faArrowLeft,
  faEdit,
  faLocationArrow,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getEvaluate,
  getProductDetailForAdmin,
} from "../../../api/product.api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { faMessage, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import axiosConfig from "../../../configs/axiosConfig";
import { useUser } from "../../../hooks/useUser";
import type { ProductT } from "../../../utils/types";
import Notify from "../../../components/Notify";

function DetailProductAdmin() {
  const { id } = useParams();
  const { user } = useUser();
  const naviate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [showNotify, setShowNotify] = useState({
    open: false,
    content: "",
    isSuccess: true,
  });
  const [showResponse, setShowResponse] = useState({
    open: false,
    reviewId: null,
    message: "",
  });
  const { data: response, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["productdetailForAdmin", id],
    queryFn: () => getProductDetailForAdmin(Number(id)),
    enabled: !!id,
  }) as any;
  const product: ProductT = response && response.product;
  const statistics = response && response.statistics;
  const flashSale = response && response.flashSale;
  console.log(flashSale);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["evaluates", filterRating],
    queryFn: () =>
      getEvaluate({
        productId: Number(id),
        rating: filterRating,
        page: 1,
        sort: sort,
      }),
    enabled: !!id,
  }) as any;
  const reviews = (data && data.data) || [];

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleHelpfulReview = async (itemId: number) => {
    if (!user) {
      naviate("/");
      return;
    }
    try {
      const res = (await axiosConfig.post(
        `/api/v1/evaluate/toggle-helpful/${itemId}`,
      )) as any;
      console.log(res);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleResponseReview = async () => {
    try {
      const res = (await axiosConfig.post(
        `/api/v1/evaluate/response/${showResponse.reviewId}`,
        {
          message: showResponse.message,
        },
      )) as any;
      console.log(res);

      if (res.status) {
        await refetch();
        setShowNotify({
          open: true,
          content: res.message,
          isSuccess: true,
        });
        setTimeout(() => {
          setShowNotify({
            open: false,
            content: "",
            isSuccess: true,
          });
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      {isLoadingProduct ? (
        <div>Đang tải dữ liệu</div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-[1.8rem] font-bold">
                <span>Quản lý sản phẩm</span>
                <span>/</span>
                <span>{product.productName}</span>
              </div>
              <div className="flex py-2">
                <Link
                  to={`/dashboard/products`}
                  className="flex items-center space-x-1 text-gray-600 px-6 rounded-md py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-gray-500"
                  />
                  <span>Quay lại danh sách</span>
                </Link>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/dashboard/products/action/${product.id}`}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} />
                Chỉnh sửa
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[1.4rem] text-gray-600 mb-1">Doanh thu</p>
                  <p className="text-[2.4rem] font-bold text-green-700">
                    {formatPrice(statistics?.revenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[1.4rem] text-gray-600 mb-1">Đã bán</p>
                  <p className="text-[2.4rem] font-bold text-blue-700">
                    {statistics?.soldCount} SP
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[1.4rem] text-gray-600 mb-1">Tồn kho</p>
                  <p className="text-[2.4rem] font-bold text-red-500">
                    {statistics.inventory}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[1.4rem] text-gray-600 mb-1">Đánh giá</p>
                  <p className="text-[2.4rem] font-bold text-yellow-500 flex items-center gap-1">
                    {product.averageRating}
                    <span className="text-[1.2rem] text-yellow-500 mt-1">
                      ({product.reviewCount} đánh giá)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="font-bold mb-4">Hình ảnh chính</h3>
                <img
                  src={product.mainImage}
                  alt={product.productName}
                  className="w-full rounded-lg border border-gray-200"
                />
                <h3 className="font-bold mb-4 mt-6">Ảnh phụ</h3>
                {product.listImageProduct.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {product.listImageProduct?.map((img) => {
                      return (
                        <div
                          className="w-full h-[10rem] border border-gray-300 rounded-md"
                          key={img.id}
                        >
                          <img
                            src={img.imageUrl}
                            alt={`subImage`}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center">Không có ảnh phụ</div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                  <div className="flex gap-1 p-1">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === "info"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Thông tin chung
                    </button>
                    <button
                      onClick={() => setActiveTab("variants")}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === "variants"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Biến thể ({product.variants.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === "description"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Mô tả
                    </button>
                    <button
                      onClick={() => setActiveTab("review")}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === "review"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "info" && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-[2rem]">{product.productName}</h2>
                          {flashSale && (
                            <span className="px-3 py-1 bg-orange-500 text-white text-[1.2rem] rounded-full">
                              Flash Sale
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-[2rem] text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </p>
                          {flashSale ? (
                            <p className="text-[1.8rem] font-bold text-red-500">
                              {formatPrice(
                                flashSale.flashSaleProduct.sale_price,
                              )}
                            </p>
                          ) : (
                            <p className="text-[2rem] font-bold text-red-500">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      {flashSale && (
                        <div className="p-6 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                          <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                            Thông tin Flash Sale
                          </h3>
                          <div className="space-y-4 text-[1.4rem]">
                            <div className="flex items-center">
                              <p className="text-gray-600">Giảm giá:</p>
                              <p className="font-semibold text-orange-600 ml-2">
                                {flashSale.discount}%
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-gray-600">Giá sau giảm:</p>
                              <p className="font-semibold text-red-600 ml-2">
                                {formatPrice(
                                  flashSale.flashSaleProduct.sale_price,
                                )}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-gray-600">
                                Số lượng Flash Sale còn lại:
                              </p>
                              <p className="font-semibold">
                                {flashSale.flashSaleProduct.quantity -
                                  flashSale.flashSaleProduct.sold}{" "}
                                / {flashSale.flashSaleProduct.quantity}
                              </p>
                            </div>
                            <div className=" flex items-center">
                              <p className="text-gray-600">Thời gian:</p>
                              <p className="font-semibold text-green-600 ml-2">
                                <span className="mr-4">
                                  {formatDate(flashSale.startDate)}
                                </span>
                                đến
                                <span className="ml-4">
                                  {formatDate(flashSale.endDate)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-[1.4rem] text-gray-600 mb-1">
                            Giá gốc
                          </p>
                          <p className="font-semibold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-[1.4rem] text-gray-600 mb-1">
                            Giá bán thực tế
                          </p>
                          <p className="font-semibold">
                            {flashSale
                              ? formatPrice(
                                  flashSale.flashSaleProduct.sale_price,
                                )
                              : formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "variants" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Danh sách biến thể</h3>
                        <span className="text-gray-600">
                          Tổng: {product.variants.length} biến thể
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="text-left py-3 px-4 font-semibold text-[1.4rem]">
                                ID
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-[1.4rem]">
                                Màu sắc
                              </th>
                              <th className="text-center py-3 px-4 font-semibold text-[1.4rem]">
                                Kích thước
                              </th>
                              <th className="text-center py-3 px-4 font-semibold text-[1.4rem]">
                                Tồn kho
                              </th>
                              <th className="text-center py-3 px-4 font-semibold text-[1.4rem]">
                                Giá
                              </th>
                              <th className="text-center py-3 px-4 font-semibold text-[1.4rem]">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.variants.map((variant) => (
                              <tr
                                key={variant.id}
                                className="border-b border-gray-100 hover:bg-gray-50 text-[1.4rem]"
                              >
                                <td className="py-5 px-4 text-[1.4rem] text-gray-700">
                                  #{variant.id}
                                </td>
                                <td className="py-5 px-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded border border-gray-300"
                                      style={{
                                        backgroundColor:
                                          variant.variantColor.hexCode,
                                      }}
                                    />
                                    <span className="text-[1.4rem] text-gray-700">
                                      {variant.variantColor.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="text-center py-5 px-4 text-[1.4rem] text-gray-700">
                                  {variant.variantSize.name}
                                </td>
                                <td className="text-center py-5 px-4">
                                  <span
                                    className={`text-[1.4rem] font-medium ${variant.inventory < 20 ? "text-red-600" : "text-gray-900"}`}
                                  >
                                    {variant.inventory}
                                    {variant.inventory < 20 && (
                                      <span className="ml-1 text-xs text-red-500">
                                        (Sắp hết)
                                      </span>
                                    )}
                                  </span>
                                </td>
                                <td className="text-center py-5 px-4 text-[1.4rem] text-gray-700">
                                  {variant.price ? (
                                    formatPrice(variant.price)
                                  ) : (
                                    <span className="text-gray-400">
                                      Giá chung
                                    </span>
                                  )}
                                </td>
                                <td className="py-5 px-4 text-center">
                                  {variant.inventory > 0 ? (
                                    <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full">
                                      Còn hàng
                                    </span>
                                  ) : (
                                    <span className="px-6 py-2 bg-red-100 text-red-700 rounded-full">
                                      Hết hàng
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "description" && (
                    <div className="prose max-w-none text-[1.6rem]">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    </div>
                  )}

                  {activeTab === "review" && (
                    <div>
                      <div className="w-full sm:w-auto">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4">
                          <button
                            type="button"
                            className={`px-3 sm:px-4 md:px-[2rem] py-2 sm:py-[.5rem] border rounded-sm text-[1.2rem] md:text-[1.4rem] whitespace-nowrap ${filterRating === "all" ? "text-red-500 border-red-500 bg-red-50" : "text-gray-800 border-gray-400 hover:border-gray-600"} cursor-pointer transition-colors`}
                            onClick={() => setFilterRating("all")}
                          >
                            Tất cả ({data && data.summary.total})
                          </button>
                          {[5, 4, 3, 2, 1].map((star) => {
                            return (
                              <button
                                key={star}
                                type="button"
                                className={`px-3 sm:px-4 md:px-[2rem] py-2 sm:py-[.5rem] border rounded-sm text-[1.2rem] md:text-[1.4rem] whitespace-nowrap ${filterRating === star ? "text-red-500 border-red-500 bg-red-50" : "text-gray-800 border-gray-400 hover:border-gray-600"} cursor-pointer transition-colors`}
                                onClick={() => {
                                  setFilterRating(star);
                                }}
                              >
                                {star} Sao (
                                {data && data.summary.ratingCount[star]})
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-8">
                          {isLoading ? (
                            <div>Đang tải dữ liệu</div>
                          ) : reviews.length > 0 ? (
                            <div className="space-y-4">
                              {reviews.map((r: any) => {
                                return (
                                  <div
                                    key={r.id}
                                    className="flex items-start w-full h-auto shadow-md rounded-xl bg-white p-5 space-x-4"
                                  >
                                    <div>
                                      {r.showAccount ? (
                                        !r?.user?.avatar ? (
                                          <div className="w-12 h-12 sm:w-[4rem] sm:h-[4rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                                            {(
                                              r.user?.username?.[0] || "K"
                                            ).toUpperCase()}
                                          </div>
                                        ) : (
                                          <img
                                            src={r?.user?.avatar}
                                            alt={"avatar" + r?.user?.username}
                                            className="w-12 h-12 sm:w-[4rem] sm:h-[4rem] rounded-full object-cover"
                                          />
                                        )
                                      ) : (
                                        <div className="w-12 h-12 sm:w-[4rem] sm:h-[4rem] bg-gray-200 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500"
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
                                    <div className="w-full">
                                      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                        <span className="text-[1.4rem] md:text-[1.6rem]">
                                          {r.showAccount
                                            ? r.user?.username ||
                                              r.customerName ||
                                              "Khách hàng"
                                            : "Ẩn danh"}
                                        </span>
                                        <span className="text-[1.2rem] md:text-[1.4rem] text-gray-500">
                                          • {formatDate(r.createdAt)}
                                        </span>
                                      </div>

                                      <div className="mb-3 sm:mb-4">
                                        {renderStars(r.rating)}
                                      </div>

                                      {r.message && (
                                        <p className="mt-2 sm:mt-4 text-gray-700 leading-relaxed text-[1.4rem] md:text-[1.6rem]">
                                          {r.message}
                                        </p>
                                      )}
                                      <div className="flex items-center space-x-5 text-[1rem] md:text-[1.3rem] mt-2 ">
                                        <button
                                          onClick={() =>
                                            handleToggleHelpfulReview(r.id)
                                          }
                                          className="cursor-pointer"
                                        >
                                          <FontAwesomeIcon icon={faThumbsUp} />
                                          <span
                                            className={` ${r.isLiked ? "text-red-500" : "text-gray-600"}`}
                                          >
                                            {r.helpfulCount}
                                          </span>
                                        </button>
                                        {!r.hasAdminResponse && (
                                          <button
                                            type="button"
                                            className="flex items-center space-x-2 hover:text-gray-800 cursor-pointer"
                                            onClick={() =>
                                              setShowResponse({
                                                open: true,
                                                reviewId: r.id,
                                                message: "",
                                              })
                                            }
                                          >
                                            <FontAwesomeIcon icon={faMessage} />
                                            <span>Phản hồi</span>
                                          </button>
                                        )}
                                      </div>
                                      {showResponse.open &&
                                        !r.hasAdminResponse &&
                                        showResponse.reviewId === r.id && (
                                          <div className="mt-4 w-full h-auto">
                                            <textarea
                                              rows={3}
                                              className="w-full h-full border text-[1.4rem] p-4 outline-none focus:border-cyan-300 border-gray-300 rounded-md"
                                              placeholder="Nhập phản hồi..."
                                              value={showResponse.message}
                                              onChange={(e) =>
                                                setShowResponse((prev) => ({
                                                  ...prev,
                                                  message: e.target.value,
                                                }))
                                              }
                                            />
                                            <div className="flex items-center justify-end gap-2.5 mt-1 text-[1.4rem]">
                                              <button className="rounded-md px-5 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-300">
                                                <span>Đóng</span>
                                              </button>
                                              <button
                                                className="rounded-md px-5 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                                                onClick={() =>
                                                  handleResponseReview()
                                                }
                                              >
                                                <FontAwesomeIcon
                                                  icon={faLocationArrow}
                                                  className="text-[1.4rem]"
                                                />
                                                <span>Gửi</span>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      {r.hasAdminResponse && (
                                        <div className="text-[1.4rem] border border-gray-300 p-5 mt-5 rounded-md">
                                          <span>Đã phản hồi</span>
                                          <div className="mt-5 flex items-center space-x-5">
                                            <div className="w-12 h-12 sm:w-[4rem] sm:h-[4rem] bg-gray-200 rounded-full flex items-center justify-center">
                                              <img
                                                src={user?.avatar}
                                                alt={`admin-${user?.username}`}
                                                className="w-full h-full object-cover rounded-full"
                                              />
                                            </div>
                                            <div>
                                              <p className="text-[1.6rem]">
                                                {user?.username} •{" "}
                                                <span className="text-[1.2rem]">
                                                  {formatDate(
                                                    r.adminResponseAt,
                                                  )}
                                                </span>
                                              </p>
                                              <p className="text-[1.6rem] mt-1">
                                                Nội dung: {r.adminResponse}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 sm:py-12 px-4">
                              <p className="text-gray-600 text-[1.4rem] md:text-[1.6rem]">
                                Chưa có đánh giá nào.
                              </p>
                              <p className="text-gray-400 text-xs sm:text-[1.4rem] mt-2">
                                Hãy là người đầu tiên đánh giá sản phẩm!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Notify
        content={showNotify.content}
        duration={1000}
        showNotify={showNotify.open}
        isSuccess={showNotify.isSuccess}
      />
    </div>
  );
}

export default DetailProductAdmin;
