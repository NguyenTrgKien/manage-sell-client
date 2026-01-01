import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getDashboardStatistic,
} from "../../../api/dashboard.api";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import ChartStatistic from "./ChartStatistic";

function DashboardHome() {
  const [queryInput, setQueryInput] = useState({
    startDate: "",
    endDate: "",
    groupBy: "day",
  });
  const [queryOverview, setQueryOverview] = useState(queryInput);
  const [statisticFollow, setStatisticFollow] = useState<
    "all" | "guest" | "member"
  >("all");
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["overview", queryOverview],
    queryFn: () => getDashboardOverview(queryOverview),
  });

  const { data: dashboardStatistic, isLoading: isLoadingDbStatistic } =
    useQuery({
      queryKey: ["dashboardStatistic", queryOverview],
      queryFn: () => getDashboardStatistic(queryOverview),
    });

  const handleChangeQueryInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQueryInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    setQueryOverview({ ...queryInput });
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      notation: "compact",
      compactDisplay: "long",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="w-full bg-white shadow-md rounded-xl p-[2rem]">
        <div className="">
          <h3 className="text-[2rem] font-semibold text-gray-600">Tổng quan</h3>
          <p className="pt-2">Shop bán quần áo .NTK</p>

          <div className="flex gap-4 text-[1.4rem] py-6">
            <div>
              <label
                htmlFor="startDate"
                className="block font-medium text-gray-700 mb-2"
              >
                Từ ngày
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={queryInput.startDate}
                onChange={handleChangeQueryInput}
                className="w-[15rem] h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block font-medium text-gray-700 mb-2"
              >
                Đến ngày
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={queryInput.endDate}
                onChange={handleChangeQueryInput}
                className="w-[15rem] h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="groupBy"
                className="block font-medium text-gray-700 mb-2"
              >
                Hiển thị theo
              </label>
              <select
                name="groupBy"
                id="groupBy"
                value={queryInput.groupBy}
                onChange={handleChangeQueryInput}
                className="w-[15rem] h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="day">Ngày</option>
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>

            <div className="flex items-end gap-4">
              <button
                className="px-6 h-[4rem] space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                onClick={() => handleApply()}
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Áp dụng</span>
              </button>
              <button
                className="h-[4rem] px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium flex items-center justify-center cursor-pointer"
                title="Reset bộ lọc"
                onClick={() =>
                  setQueryOverview({
                    endDate: "",
                    startDate: "",
                    groupBy: "day",
                  })
                }
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
            </div>
          </div>
        </div>
        {isLoadingOverview ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-[1rem]">
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className=" shadow-md border border-gray-200 space-y-4 bg-gray-100 p-8 rounded-lg animate-pulse"
                >
                  <span className="block w-[20rem] h-[1.5rem] rounded-full bg-gray-200"></span>
                  <div className="w-[4rem] h-[4rem] bg-gray-200 rounded-xl"></div>
                  <span className="block w-[15rem] h-[1.5rem] bg-gray-200 rounded-full"></span>
                </div>
              );
            })}
          </div>
        ) : (
          overview && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-[1rem]">
              <div className="shadow-md border border-gray-200 bg-[#7686ff] text-white p-8 rounded-lg">
                <span className="">Tổng đơn hàng</span>
                <div className="text-[3.2rem]">{overview.totalOrders}</div>
                <span className="text-[1.2rem]">Kỳ trước</span>
              </div>
              <div className="shadow-md border border-gray-200 bg-[#00d193] text-white p-8 rounded-lg">
                <span className="">Doanh thu</span>
                <div className="text-[3.2rem]">
                  {formatPrice(overview.totalRevenue)}
                </div>
                <span className="text-[1.2rem]">Kỳ trước</span>
              </div>
              <div className="shadow-md border border-gray-200 bg-[#ff9a5b] text-white p-8 rounded-lg">
                <span className="">Tổng chưa thu</span>
                <div className="text-[3.2rem]">
                  {formatPrice(overview.totalUnpaid)}
                </div>
                <span className="text-[1.2rem]">Kỳ trước</span>
              </div>
              <div className="shadow-md border border-gray-200 bg-[#6c62ff] text-white p-8 rounded-lg">
                <span className="">Giá trị TB / đơn</span>
                <div className="text-[3.2rem]">
                  {formatPrice(overview.avgOrderValue)}
                </div>
                <span className="text-[1.2rem]">Kỳ trước</span>
              </div>
            </div>
          )
        )}
      </div>
      <div className="w-full bg-white shadow-md rounded-xl p-[2rem]">
        <h3 className="text-[2rem] font-bold">Thống kê doanh thu</h3>
        <div className="space-y-2 mt-6">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="all"
              name="radio"
              className=""
              checked={statisticFollow === "all"}
              style={{ scale: "1.2" }}
              onChange={() => setStatisticFollow("all")}
            />
            <label htmlFor="all">Tất cả</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="member"
              name="radio"
              className=""
              checked={statisticFollow === "member"}
              style={{ scale: "1.2" }}
              onChange={() => setStatisticFollow("member")}
            />
            <label htmlFor="member">Khách thành viên</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="guest"
              name="radio"
              className=""
              checked={statisticFollow === "guest"}
              style={{ scale: "1.2" }}
              onChange={() => setStatisticFollow("guest")}
            />
            <label htmlFor="guest">Khách vãng lai</label>
          </div>
        </div>
        {isLoadingDbStatistic ? (
          <div>Đang tải dữ liệu</div>
        ) : (
          <ChartStatistic
            dashboardStatistic={dashboardStatistic}
            statisticFollow={statisticFollow}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardHome;
