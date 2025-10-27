import {
  faCirclePlus,
  faExclamationTriangle,
  faFilter,
  faPenToSquare,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ActionCategory from "./ActionCategory";
import axiosConfig from "../../../../configs/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import ActiveCategory from "./ToggleActiveCategory";
import { getCategory } from "../../../../api/category.api";

function Categories() {
  const [openToggleActive, setOpenToggleActive] = useState<{
    title: string;
    id: number;
  } | null>(null);
  const [openAction, setOpenAction] = useState<{
    action: "add" | "edit";
  } | null>(null);
  const [dataUpdate, setDataUpdate] = useState<any | null>(null);
  const [filterInput, setFilterInput] = useState<{
    categoryName: string;
    isActive: boolean;
  }>({
    categoryName: "",
    isActive: true,
  });
  const [appliedFilter, setAppliedFilter] = useState<{
    categoryName: string;
    isActive: boolean;
  }>({
    categoryName: "",
    isActive: true,
  });
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories", appliedFilter],
    queryFn: getCategory,
  });

  const handleChangeFilter = (item: string, value: string | boolean) => {
    setFilterInput((prev) => {
      if (item === "categoryName") {
        return {
          ...prev,
          categoryName: value as string,
        };
      } else {
        return {
          ...prev,
          isActive: value as boolean,
        };
      }
    });
  };

  const handleFilter = () => {
    setAppliedFilter(filterInput);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center pb-[1.5rem] border-b-[.1rem] border-b-gray-300">
        <h3 className="text-[2.5rem] font-semibold text-gray-600">Danh mục</h3>
        <div>
          <button
            className="text-white flex gap-1.5 items-center px-4 py-3 bg-[var(--main-button)] rounded-lg hover:bg-[var(--main-button-hover)] cursor-pointer "
            onClick={() => setOpenAction({ action: "add" })}
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Thêm mới
          </button>
        </div>
      </div>
      <div className="mt-[3rem]">
        <h3 className="text-[1.8rem] text-gray-600">Danh sách</h3>
        <div className="w-full border-[.1rem] border-gray-300 mt-4 p-[2rem] flex items-end gap-[2rem]">
          <div className="w-[55%] flex flex-col gap-[.5rem]">
            <label htmlFor="categoryName" className="text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              value={filterInput.categoryName}
              placeholder="Nhập tìm kiếm..."
              className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem]"
              onChange={(e) =>
                handleChangeFilter("categoryName", e.target.value)
              }
            />
          </div>
          <div className="w-[30%] flex flex-col gap-[.5rem]">
            <label htmlFor="categoryName" className="text-gray-700">
              Trạng thái
            </label>
            <select
              name="isActive"
              id="isActive"
              value={filterInput.isActive.toString()}
              className="w-full h-[4rem] rounded-[.5rem] outline-none border text-gray-600 border-gray-300 pl-[1.5rem]"
              onChange={(e) =>
                handleChangeFilter("isActive", e.target.value === "true")
              }
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          <button
            className="w-[15%] flex items-center justify-center gap-[1rem] px-[1.5rem] h-[4rem] bg-[var(--main-button)] text-white rounded-[.5rem] cursor-pointer hover:bg-[var(--main-button-hover)]"
            onClick={() => handleFilter()}
          >
            <FontAwesomeIcon icon={faFilter} />
            Lọc
          </button>
        </div>

        {isLoading && (
          <div className="mt-[2rem] flex flex-col items-center justify-center py-[4rem] bg-gray-50 rounded-lg border border-gray-200">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-[3rem] text-blue-500 mb-3"
            />
            <p className="text-[1.6rem] text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="mt-[2rem] flex flex-col items-center justify-center py-[4rem] bg-red-50 rounded-lg border border-red-200">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-[3rem] text-red-500 mb-3"
            />
            <p className="text-[1.6rem] text-red-600 font-medium mb-2">
              Có lỗi xảy ra khi tải dữ liệu
            </p>
            <p className="text-[1.4rem] text-gray-600 mb-4">
              {isError || "Vui lòng thử lại sau"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[1.4rem]"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="border border-gray-300/50 rounded-md overflow-hidden mt-[2rem]">
          {!isLoading && !isError && (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-center text-[1.4rem] font-medium text-gray-700 border border-gray-300">
                    STT
                  </th>
                  <th className="text-center px-4 py-2 text-[1.4rem] font-medium text-gray-700 border border-gray-300">
                    Hình ảnh
                  </th>
                  <th className="text-left px-4 py-2 text-[1.4rem] font-medium text-gray-700 border border-gray-300">
                    Tên danh mục
                  </th>
                  <th className="text-center px-4 py-2 text-[1.4rem] font-medium text-gray-700 border border-gray-300">
                    Trạng thái
                  </th>
                  <th className="text-center px-4 py-2 text-[1.4rem] font-medium text-gray-700 border border-gray-300">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.length > 0 &&
                  data.map((item: any, index: number) => {
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2 text-[1.4rem] text-center text-gray-800 border border-gray-300">
                          {index}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <img
                            src={item.image}
                            alt="Ảnh danh mục"
                            className="w-[4rem] h-[4rem] rounded-[.5rem] object-cover border mx-auto"
                          />
                        </td>
                        <td className="text-left px-4 py-2 text-[1.4rem] text-gray-800 border border-gray-300">
                          <span>{item.categoryName}</span>
                        </td>
                        <td className="text-center px-4 py-2 text-[1.4rem] border border-gray-300">
                          <span
                            className={`inline-block px-6 py-1   rounded-full text-[1.4rem] font-medium ${item.isActive ? "text-green-700 bg-green-100" : "text-orange-700 bg-red-100"}`}
                          >
                            {item.isActive
                              ? "Đang hoạt động"
                              : "Dừng hoạt động"}
                          </span>
                        </td>
                        <td className="text-center px-4 py-2 space-x-2 border border-gray-300">
                          <button
                            className="px-6 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded-md text-[1.4rem] outline-none"
                            onClick={() => {
                              setOpenAction({ action: "edit" });
                              setDataUpdate(item);
                            }}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            Chỉnh sửa
                          </button>
                          {item.isActive ? (
                            <button
                              className="px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md text-[1.4rem] outline-none"
                              onClick={() =>
                                setOpenToggleActive({
                                  id: item.id,
                                  title: "inactive",
                                })
                              }
                            >
                              Dừng hoạt dộng
                            </button>
                          ) : (
                            <button
                              className="px-6 py-2 text-white bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] rounded-md text-[1.4rem] outline-none"
                              onClick={() =>
                                setOpenToggleActive({
                                  id: item.id,
                                  title: "active",
                                })
                              }
                            >
                              Kích hoạt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {openAction && (
        <ActionCategory
          setOpenAction={setOpenAction}
          openAction={openAction}
          refetch={refetch}
          dataUpdate={openAction.action === "add" ? undefined : dataUpdate}
        />
      )}

      {openToggleActive && (
        <ActiveCategory
          setOpenToggleActive={setOpenToggleActive}
          openToggleActive={openToggleActive}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default Categories;
