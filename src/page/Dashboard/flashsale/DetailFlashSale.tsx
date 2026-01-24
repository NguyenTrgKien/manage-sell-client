import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getFlashsaleById } from "../../../api/flashsale.api"; // giả sử bạn đã có api này
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { FlashSaleProduct } from "../../../utils/flashsale.type";
import { getStatusBadge } from ".";

function DetailFlashSale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["flashSale", id],
    queryFn: () => getFlashsaleById(Number(id)),
    enabled: !!id,
  });
  const flashSale = data && data.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !flashSale) {
    return (
      <div className="text-center py-26 text-red-600">
        Không thể tải dữ liệu Flash Sale. Vui lòng thử lại sau.
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    dayjs(dateStr).format("HH:mm DD/MM/YYYY");

  const formatPrice = (price: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-white shadow-lg p-6 md:p-8 rounded-xl text-[1.4rem]">
      <div className="flex items-center justify-between border-b border-gray-300 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold">Chi tiết Flash Sale</h1>
        </div>
        <span>{getStatusBadge(flashSale.status)}</span>
      </div>

      <div className="mb-10">
        <img
          src={flashSale.bannerImage}
          alt={flashSale.name}
          className="w-full h-[35rem] object-cover rounded-xl shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-banner.jpg";
            toast.error("Không tải được banner");
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Tên chương trình</h2>
            <p className=" text-gray-700">{flashSale.name}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Mô tả</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {flashSale.description || "Không có mô tả"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Mức giảm giá</h2>
            <p className="font-bold text-red-600">{flashSale.discount}%</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Thời gian áp dụng</h2>
            <div className="text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Bắt đầu:</span>{" "}
                {formatDate(flashSale.startDate)}
              </p>
              <p>
                <span className="font-medium">Kết thúc:</span>{" "}
                {formatDate(flashSale.endDate)}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Ngày tạo / cập nhật</h2>
            <p className="text-gray-600">
              Tạo: {formatDate(flashSale.createdAt)}
            </p>
            <p className="text-gray-600">
              Cập nhật: {formatDate(flashSale.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-bold mb-6">
          Sản phẩm áp dụng ({flashSale.flashSaleProduct.length} sản phẩm)
        </h2>

        {flashSale.flashSaleProduct.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Chưa có sản phẩm nào trong flash sale này
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {flashSale.flashSaleProduct.map((item: FlashSaleProduct) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.product.mainImage}
                  alt={item.product.productName}
                  className="w-full h-[20rem] object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {item.product.productName}
                  </h3>

                  <div className="flex text-[1.4rem] items-center gap-3 mb-3">
                    <span className="font-bold text-red-600">
                      {formatPrice(item.sale_price)}
                    </span>
                    <span className="text-gray-400 line-through">
                      {formatPrice(item.origin_price)}
                    </span>
                    <span className="text-green-600">
                      -{flashSale.discount}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[1.2rem]">
                    <div>
                      <p className="font-medium">Số lượng:</p>
                      <p>{item.quantity} SP</p>
                    </div>
                    <div>
                      <p className="font-medium">Giới hạn/khách:</p>
                      <p>{item.limit} SP</p>
                    </div>
                    <div>
                      <p className="font-medium">Đã bán: {item.sold}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailFlashSale;
