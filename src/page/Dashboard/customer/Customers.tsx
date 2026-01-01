import { useSearchParams } from "react-router-dom";
import { getCustomers } from "../../../api/customer.api";
import { useQuery } from "@tanstack/react-query";
import RenderCustomer from "./RenderCustomer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Customers() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [page, setPage] = useState(1);
  const limit = 30;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["customers", keyword, page],
    queryFn: () =>
      getCustomers({
        keyword,
        page,
        limit,
      }),
  }) as any;
  const customers = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return isLoading ? (
    <div className=" py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
      </div>
    </div>
  ) : isError ? (
    <div className="py-20">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-gray-700 font-medium mb-4">Không thể tải dữ liệu</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  ) : (
    <div>
      <RenderCustomer customers={customers} isLoading={isLoading} />

      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => Math.abs(num - page) <= 2)
          .map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-gray-300 ${
                page === num ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export default Customers;
