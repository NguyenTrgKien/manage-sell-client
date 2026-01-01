import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Danh sách khách hàng", to: "/dashboard/customers" },
  { label: "Khách đã mua", to: "/dashboard/customers/purchased" },
  { label: "Khách chưa mua", to: "/dashboard/customers/no-order" },
  { label: "Thống kê", to: "/dashboard/customers/statistic" },
];

function CustomerManage() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate({ search: `?keyword=${encodeURIComponent(keyword.trim())}` });
    } else {
      navigate({ search: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-[2rem] bg-white rounded-2xl w-full min-h-[calc(100vh-10rem)] shadow-md">
      <h4 className="text-[2rem] font-bold mb-8">
        Quản lý khách hàng thành viên
      </h4>
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

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerManage;
