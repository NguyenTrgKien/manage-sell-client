import {
  faCirclePlus,
  faEdit,
  faSearch,
  faEye,
  faFilter,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFlashsales } from "../../../api/flashsale.api";
import { flashSaleStatus } from "@nguyentrungkien/shared";
import type { FlashSale as FlashSaleType } from "../../../utils/flashsale.type";
import dayjs from "dayjs";
import CancelFlashSale from "./CancelFlashSale";

const flashSaleStatusLabel = {
  [flashSaleStatus.ACTIVE]: "Đang diễn ra",
  [flashSaleStatus.SCHEDULE]: "Sắp diễn ra",
  [flashSaleStatus.ENDED]: "Đã kết thúc",
  [flashSaleStatus.CANCELLED]: "Đã hủy",
};

export const getStatusBadge = (status: any) => {
  const badges = {
    ACTIVE: "bg-green-100 text-green-700",
    SCHEDULE: "bg-blue-100 text-blue-700",
    ENDED: "bg-gray-100 ",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const labels = {
    ACTIVE: "Đang diễn ra",
    SCHEDULE: "Sắp diễn ra",
    ENDED: "Đã kết thúc",
    CANCELLED: "Đã hủy",
  };
  return (
    <span
      className={`px-5 py-2 rounded-full text-[1.4rem] font-medium ${badges[status as flashSaleStatus]}`}
    >
      {labels[status as flashSaleStatus]}
    </span>
  );
};

function FlashSale() {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState({
    limit: 20,
    page: 1,
    name: "",
    status: "",
  });
  const [query, setQuery] = useState(queryInput);
  const [cancel, setCancel] = useState<null | number>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["flashsales", query],
    queryFn: () => getFlashsales(queryInput),
  }) as any;

  const flashsales = (data && data.data) || [];
  const totalPages = (data && data?.pagination.totalPages) || 1;

  const handleFilter = () => {
    setQuery({
      ...queryInput,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-white shadow-lg p-[2rem] rounded-[1rem]">
      <div className="flex justify-between items-center border-b-[.1rem] border-b-gray-300 pb-[2rem]">
        <h3 className="text-[2rem] font-semibold">FlashSale</h3>
        <div className="flex items-center gap-[1.5rem]">
          <button
            className="text-white text-[1.4rem] flex gap-2 items-center px-6 h-[4rem] bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate("create")}
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Tạo Flash Sale
          </button>
        </div>
      </div>
      <div className="mt-[2rem] flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center flex-1">
          <div className="relative flex-1 max-w-[40rem]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
            />
            <input
              type="text"
              placeholder="Tìm kiếm flash sale..."
              value={queryInput.name}
              onChange={(e) =>
                setQueryInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full pl-12 pr-4 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={queryInput.status}
            onChange={(e) =>
              setQueryInput((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="px-6 h-[4rem] border border-gray-300 rounded-lg text-[1.4rem] focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Tất cả</option>
            {Object.entries(flashSaleStatus).map(([_, value]) => {
              return (
                <option key={value} value={value}>
                  {flashSaleStatusLabel[value]}
                </option>
              );
            })}
          </select>
          <button
            className="px-6 h-[4rem] rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            onClick={() => handleFilter()}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Lọc</span>
          </button>
        </div>
      </div>
      <div className="mt-[2rem] overflow-x-auto shadow-md">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                STT
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Tên chương trình
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Thời gian bắt đầu
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Thời gian kết thúc
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Giảm giá
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Sản phẩm
              </th>
              <th className="text-left py-4 px-4 text-[1.4rem] font-semibold ">
                Trạng thái
              </th>
              <th className="text-center py-4 px-4 text-[1.4rem] font-semibold ">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-[1.4rem] text-gray-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : flashsales.length > 0 ? (
              flashsales.map((sale: FlashSaleType, index: number) => {
                return (
                  <tr
                    key={sale.id}
                    className=" hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-[1.4rem]">{++index}</td>
                    <td className="py-4 px-4 text-[1.4rem] font-medium">
                      {sale.name}
                    </td>
                    <td className="py-4 px-4 text-[1.4rem]">
                      {dayjs(sale.startDate).format("HH:mm DD/MM/YYYY")}
                    </td>
                    <td className="py-4 px-4 text-[1.4rem]">
                      {dayjs(sale.endDate).format("HH:mm DD/MM/YYYY")}
                    </td>
                    <td className="py-4 px-4 text-[1.4rem]">
                      <span className="text-red-500 ">{sale.discount}%</span>
                    </td>
                    <td className="py-4 px-4 text-[1.4rem]">
                      {sale?.flashSaleProduct?.length}
                    </td>
                    <td className="py-4 px-4 text-[1.4rem] ">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1 bg-green-500 text-white cursor-pointer rounded-lg transition-colors"
                          onClick={() => navigate(`detail/${sale.id}`)}
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-[1.4rem]"
                          />
                        </button>
                        <button
                          className="px-3 py-1 bg-amber-500 text-white cursor-pointer rounded-lg transition-colors"
                          onClick={() => navigate(`edit/${sale.id}`)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-[1.4rem]"
                          />
                        </button>
                        <button
                          className="text-[1.4rem] px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-lg transition-colors duration-300"
                          onClick={() => setCancel(sale.id)}
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-[1.4rem] text-gray-500"
                >
                  Không tìm thấy flash sale nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() =>
            setQueryInput((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={queryInput.page === 1}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => Math.abs(num - queryInput.page) <= 2)
          .map((num) => (
            <button
              key={num}
              onClick={() => setQueryInput((prev) => ({ ...prev, page: num }))}
              className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-gray-300 ${
                queryInput.page === num
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}

        <button
          onClick={() =>
            setQueryInput((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, totalPages),
            }))
          }
          disabled={queryInput.page === totalPages}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
        </button>
      </div>

      {cancel && (
        <CancelFlashSale open={!!cancel} onClose={() => setCancel(null)} />
      )}
    </div>
  );
}

export default FlashSale;
