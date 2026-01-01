import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getCustomerTop, getStatistic } from "../../../api/customer.api";

function Statistic() {
  const navigate = useNavigate();
  const [filterForm, setFilterForm] = useState({
    startDate: "",
    endDate: "",
    groupBy: "day",
  });
  const [queryCustomerTop, setQueryCustomerTop] = useState({
    startDate: "",
    endDate: "",
  });
  const [queryStatistic, setQueryStatistic] = useState(filterForm);
  const {
    data: statistics,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["statistic", queryStatistic],
    queryFn: () => getStatistic(queryStatistic),
  });
  const statistic = statistics && statistics.data;

  const {
    data: customerTops,
    isLoading: isLoadingCustomerTop,
    refetch: refetchCustomerTop,
  } = useQuery({
    queryKey: ["customerTop"],
    queryFn: () => getCustomerTop(queryCustomerTop),
  });

  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "day" | "month" | "year" | "week";
    if (value) {
      setFilterForm((prev) => ({ ...prev, groupBy: value }));
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCustomerTopDate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQueryCustomerTop((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    setQueryStatistic(filterForm);
  };

  const handleFilter = () => {
    setQueryCustomerTop(queryCustomerTop);
    refetchCustomerTop();
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
    <div className="p-[1rem] rounded-2xl w-full min-h-[calc(100vh-10rem)]">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="mb-4 flex items-center space-x-2">
          <FontAwesomeIcon icon={faFilter} />
          <span>Bộ lọc thống kê</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              value={filterForm.startDate}
              onChange={handleChangeDate}
              className="w-full h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
              value={filterForm.endDate}
              onChange={handleChangeDate}
              className="w-full h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="groupby"
              className="block font-medium text-gray-700 mb-2"
            >
              Hiển thị theo
            </label>
            <select
              name="groupby"
              id="groupby"
              value={filterForm.groupBy}
              onChange={handleGroupByChange}
              className="w-full h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          <div className="flex items-end gap-4">
            <button
              className="w-[15rem] h-[4rem] space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
              onClick={() => handleApply()}
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>Áp dụng</span>
            </button>
            <button
              className="h-[4rem] px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium flex items-center justify-center cursor-pointer"
              title="Reset bộ lọc"
              onClick={() =>
                setQueryStatistic({
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-600">Tổng khách</p>
          <p className="text-2xl font-bold text-blue-600">
            {statistic.reduce(
              (sum: number, item: any) => sum + item.totalCustomers,
              0
            )}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-600">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-green-600">
            {statistic.reduce(
              (sum: number, item: any) => sum + item.totalOrders,
              0
            )}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-600">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatPrice(
              statistic.reduce(
                (sum: number, item: any) => sum + item.totalRevenue,
                0
              )
            )}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center shadow-md">
          <p className="text-gray-600">Giá trị TB/đơn</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatPrice(
              statistic.reduce(
                (sum: number, item: any) => sum + item.totalRevenue,
                0
              ) /
                statistic.reduce(
                  (sum: number, item: any) => sum + item.totalOrders,
                  0
                ) || 0
            )}
          </p>
        </div>
      </div>
      {statistic && statistic.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">
            Thống kê khách vãng lai theo{" "}
            {filterForm.groupBy === "day"
              ? "ngày"
              : filterForm.groupBy === "week"
                ? "tuần"
                : filterForm.groupBy === "month"
                  ? "tháng"
                  : "năm"}
          </h2>

          <div className="overflow-x-auto flex flex-col items-start gap-[2rem]">
            <table className="flex-1 w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-[1.4rem] font-medium">
                    Chu kỳ
                  </th>
                  <th className="px-6 py-4 text-center text-[1.4rem] font-medium">
                    Số khách
                  </th>
                  <th className="px-6 py-4 text-center text-[1.4rem] font-medium">
                    Số đơn hàng
                  </th>
                  <th className="px-6 py-4 text-center text-[1.4rem] font-medium">
                    Doanh thu
                  </th>
                  <th className="px-6 py-4 text-center text-[1.4rem] font-medium">
                    Giá trị TB/đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistic.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-[1.4rem] font-medium text-gray-900">
                      {filterForm.groupBy === "DAY"
                        ? new Date(item.period).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : item.period}
                    </td>
                    <td className="px-6 py-4 text-center text-[1.4rem]">
                      {item.totalCustomers}
                    </td>
                    <td className="px-6 py-4 text-center text-[1.4rem]">
                      {item.totalOrders}
                    </td>
                    <td className="px-6 py-4 text-center text-[1.4rem] font-medium text-green-600">
                      {formatPrice(item.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-center text-[1.4rem] font-medium text-blue-600">
                      {formatPrice(item.avgOrderValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-[60rem] p-[2rem] border border-gray-300 shadow-md rounded-md">
              <h3 className="text-center text-blue-600 mb-6">
                Top khách vãng lai có doanh thu cao
              </h3>
              <div className="flex items-end space-x-4 shadow-md p-4 border border-gray-200">
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
                    value={queryCustomerTop.startDate}
                    onChange={handleChangeCustomerTopDate}
                    className="w-full h-[3.4rem] text-[1.4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
                    value={queryCustomerTop.endDate}
                    onChange={handleChangeCustomerTopDate}
                    className="w-full h-[3.4rem] text-[1.4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <button
                  className="px-6 h-[3.4rem] text-[1.4rem] space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                  onClick={() => handleFilter()}
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <span>Lọc</span>
                </button>
              </div>
              <table className="flex-1 w-full table-auto border-collapse mt-8">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-start text-[1.4rem] font-medium">
                      Họ tên
                    </th>
                    <th className="px-6 py-4 text-start text-[1.4rem] font-medium">
                      Email
                    </th>
                    <th className="px-6 py-4 text-start text-[1.4rem] font-medium">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingCustomerTop ? (
                    <tr>
                      <td colSpan={5}>Đang tải dữ liệu...</td>
                    </tr>
                  ) : (
                    <>
                      {customerTops?.length > 0 ? (
                        customerTops.map((customer: any) => {
                          return (
                            <tr
                              key={customer.customerEmail}
                              className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                              onClick={() =>
                                navigate(
                                  `/dashboard/detail-customer/${customer.customerCode}`
                                )
                              }
                            >
                              <td className="px-6 py-4 text-[1.4rem] font-medium text-gray-900">
                                {customer.fullName}
                              </td>
                              <td className="px-6 py-4 text-start text-[1.4rem] font-medium text-gray-900">
                                {customer.email}
                              </td>
                              <td className="px-6 py-4 text-[1.4rem] font-medium text-blue-600">
                                {formatPrice(customer.totalRevenue)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            Không có dữ liệu
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">
            Không có dữ liệu trong khoảng thời gian đã chọn
          </p>
          <p className="text-gray-400 mt-2">Hãy thử thay đổi bộ lọc</p>
        </div>
      )}
    </div>
  );
}

export default Statistic;
