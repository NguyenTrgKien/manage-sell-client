import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getGuestCustomers } from "../../../api/customer.api";
import dayjs from "dayjs";
import StatisticGuest from "./StatisticGuest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface GuestCustomers {
  guestId: number;
  email: string;
  fullName: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

const tabs = [
  { label: "Danh sách khách hàng", to: "/dashboard/guest-customers" },
  { label: "Thống kê", to: "/dashboard/guest-customers/statistic" },
];

function GuestCustomers() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLisTab = location.pathname === "/dashboard/guest-customers";
  const [queryDefault, setQueryDefault] = useState<{
    limit: number;
    page: number;
    keyword: string;
  }>({
    limit: 30,
    page: 1,
    keyword: "",
  });

  const handleSearch = () => {
    setQueryDefault((prev) => ({
      ...prev,
      keyword: keyword,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { data: datagGuestCustomers, isLoading } = useQuery({
    queryKey: ["guestCustomers", queryDefault],
    queryFn: () => getGuestCustomers(queryDefault),
  }) as any;
  const guestCustomers = datagGuestCustomers && datagGuestCustomers.data;
  const totalPages = datagGuestCustomers?.pagination?.totalPages || 1;

  return (
    <div className="p-[2rem] bg-white rounded-2xl w-full min-h-[calc(100vh-10rem)] shadow-md">
      <h4 className="text-[2rem] font-bold mb-8">
        {isLisTab
          ? "Quản lý khách hàng vãng lai"
          : "Thống kê khách hàng vãng lai"}
      </h4>
      {isLisTab && (
        <div className="space-x-6 mb-8">
          <input
            type="text"
            id="search"
            placeholder="Nhập tên, sđt khách hàng..."
            value={keyword}
            onKeyDown={handleKeyPress}
            className="w-[35rem] h-[4rem] rounded-md outline-none border border-gray-400 px-[1.5rem]"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="w-[10rem] h-[4rem] rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
            onClick={() => handleSearch()}
          >
            Tìm kiếm
          </button>
        </div>
      )}
      <div className="flex border-b border-b-gray-300 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) => {
              return `pb-3 px-8 font-medium transition duration-300
                ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`;
            }}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      {isLisTab ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-[1.4rem] rounded-lg shadow-lg bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-6 py-4 font-medium">STT</th>
                <th className="text-left px-6 py-4 font-medium">Họ tên</th>
                <th className="text-left px-6 py-4 font-medium">
                  Số điện thoại
                </th>
                <th className="text-left px-6 py-4 font-medium">Email</th>
                <th className="text-center px-6 py-4 font-medium">
                  Tổng đơn mua
                </th>
                <th className="text-center px-6 py-4 font-medium">Ngày tạo</th>
                <th className="text-center px-6 py-4 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : guestCustomers.length > 0 ? (
                guestCustomers.map((guest: GuestCustomers, index: number) => {
                  return (
                    <tr
                      key={guest.email}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-start">{index + 1}</td>
                      <td className="px-6 py-4">{guest.fullName}</td>
                      <td className="px-6 py-4">{guest.phone || "-"}</td>
                      <td className="px-6 py-4">{guest.email || "-"}</td>

                      <td className="px-6 py-4 text-center">
                        {guest.totalOrders}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {dayjs(guest.createdAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/guest-detail/${guest.email}`)
                            }
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() =>
                              alert(
                                `Tặng voucher cho khách hàng: ${guest.fullName}`
                              )
                            }
                            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          >
                            Tặng voucher
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    Không có khách hàng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() =>
                setQueryDefault((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }))
              }
              disabled={queryDefault.page === 1}
              className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((num) => Math.abs(num - queryDefault.page) <= 2)
              .map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setQueryDefault((prev) => ({
                      ...prev,
                      page: num,
                    }))
                  }
                  className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-gray-300 ${
                    queryDefault.page === num
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

            <button
              onClick={() =>
                setQueryDefault((prev) => ({
                  ...prev,
                  page: Math.min(prev.page + 1, totalPages),
                }))
              }
              disabled={queryDefault.page === totalPages}
              className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
            </button>
          </div>
        </div>
      ) : (
        <StatisticGuest />
      )}
    </div>
  );
}

export default GuestCustomers;
