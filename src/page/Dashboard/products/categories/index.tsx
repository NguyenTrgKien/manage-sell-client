import {
  faChevronDown,
  faChevronRight,
  faCirclePlus,
  faEdit,
  faExclamationTriangle,
  faFilter,
  faFolder,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ActionCategory from "./ActionCategory";
import { useQuery } from "@tanstack/react-query";
import ActiveCategory from "./ToggleActiveCategory";
import { getCategory } from "../../../../api/category.api";
import type { CategoriesType } from "../../../../utils/types";

function Categories() {
  const [openToggleActive, setOpenToggleActive] = useState<{
    title: string;
    id: number;
  } | null>(null);
  const [openAction, setOpenAction] = useState<{
    action: "add" | "edit";
  } | null>(null);
  const [dataUpdate, setDataUpdate] = useState<CategoriesType | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const [filterInput, setFilterInput] = useState<{
    categoryName: string;
    isActive: "all" | "true" | "false";
  }>({
    categoryName: "",
    isActive: "all",
  });
  const [appliedFilter, setAppliedFilter] = useState<{
    categoryName: string;
    isActive: "all" | "true" | "false";
  }>({
    categoryName: "",
    isActive: "all",
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

  const handleChangeFilter = (item: string, value: string) => {
    setFilterInput((prev) => ({
      ...prev,
      [item]: value,
    }));
  };

  const handleFilter = () => {
    setAppliedFilter(filterInput);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderCategory = (item: CategoriesType, level: number = 0) => {
    const children = data.filter((c: any) => c.parentId === item.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const activeChildren = children.filter((c: CategoriesType) => c.isActive);
    const inactiveChildren = children.filter(
      (c: CategoriesType) => !c.isActive
    );
    const activeChildrenCount = activeChildren.length;
    const inactiveChildrenCount = inactiveChildren.length;

    return (
      <div key={item.id}>
        <div
          className={`
            group relative flex items-center justify-between 
            border ${level === 0 ? "border-gray-300" : "border-gray-300"}
            bg-white hover:bg-gray-50 transition-all duration-200
            ${level === 0 ? "my-3 rounded-lg shadow-sm" : "my-3 ml-10 rounded-r-lg"}
          `}
        >
          <div className="flex items-center gap-5 flex-1 px-6 py-5">
            <button
              onClick={() => hasChildren && toggleExpand(item.id)}
              className={`w-[2.6rem] h-[2.6rem] flex items-center justify-center rounded-full transition-all
                ${hasChildren ? "hover:bg-gray-200 cursor-pointer" : "opacity-0 cursor-default"}`}
              disabled={!hasChildren}
            >
              <FontAwesomeIcon
                icon={isExpanded ? faChevronDown : faChevronRight}
                className={`text-gray-500 text-[1.4rem] transition-transform duration-200 ${
                  isExpanded ? "rotate-0" : ""
                }`}
              />
            </button>

            {item.image ? (
              <img
                src={item.image}
                alt={item.categoryName}
                className="w-[5rem] h-[5rem] rounded-lg object-cover"
              />
            ) : (
              <div className="w-[5rem] h-[5rem] rounded-lg bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faFolder}
                  className="text-[2rem] text-gray-600"
                />
              </div>
            )}

            <div className="flex-1">
              <h4 className={`text-gray-800 text-[1.6rem]`}>
                {item.categoryName}
              </h4>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`px-3 py-1 text-[1.2rem] font-bold rounded-full ${
                    item.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isActive ? "Đang hoạt động" : "Dừng hoạt động"}
                </span>
                {hasChildren && (
                  <div className="flex items-center gap-3">
                    {activeChildrenCount > 0 && (
                      <span className="text-[1.2rem] text-green-700 font-medium">
                        {activeChildrenCount} hoạt động
                      </span>
                    )}
                    {inactiveChildrenCount > 0 && (
                      <span className="text-[1.2rem] text-red-600 font-medium">
                        {inactiveChildrenCount} đã dừng
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-6">
            <button
              onClick={() => {
                setOpenAction({ action: "edit" });
                setDataUpdate(item);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[1.4rem] font-medium transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faEdit} />
              Sửa
            </button>

            {item.isActive ? (
              <button
                onClick={() =>
                  setOpenToggleActive({ title: "inactive", id: item.id })
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[1.4rem] font-medium transition"
              >
                Dừng
              </button>
            ) : (
              <button
                onClick={() =>
                  setOpenToggleActive({ title: "active", id: item.id })
                }
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[1.4rem] font-medium transition"
              >
                Kích hoạt
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="relative">
            <div className="absolute left-10 top-0 h-6 w-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg" />
            <div className="ml-10">
              {children.map((child: CategoriesType) =>
                renderCategory(child, level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto bg-white shadow-lg rounded-[1rem] flex flex-col p-[2rem]">
      <div className="sticky top-0 bg-white flex justify-between items-center pb-6 border-b border-gray-300">
        <h3 className="text-3xl font-bold text-gray-700">Danh mục</h3>
        <button
          onClick={() => setOpenAction({ action: "add" })}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white rounded-lg font-medium transition"
        >
          <FontAwesomeIcon icon={faCirclePlus} />
          Thêm mới
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-600 mb-6">Danh sách</h3>

        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 flex items-end gap-6 mb-8">
          <div className="flex-1 max-w-md">
            <label className="block text-gray-700 font-medium mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              value={filterInput.categoryName}
              onChange={(e) =>
                handleChangeFilter("categoryName", e.target.value)
              }
              placeholder="Nhập để tìm kiếm..."
              className="w-full h-[4rem] px-[1.5rem] border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-[22rem]">
            <label className="block text-gray-700 font-medium mb-2">
              Trạng thái
            </label>
            <select
              value={String(filterInput.isActive)}
              onChange={(e) => handleChangeFilter("isActive", e.target.value)}
              className="w-full h-[4rem] px-[1.5rem] border border-gray-300 rounded-lg focus:outline-none text-gray-600"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="h-[4rem] w-[10rem] bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            <FontAwesomeIcon icon={faFilter} />
            Lọc
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-16 bg-gray-50 rounded-lg border">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-5xl text-blue-500 mb-4"
            />
            <p className="text-lg text-gray-600">Đang tải danh mục...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-5xl text-red-500 mb-4"
            />
            <p className="text-xl text-red-600 font-medium mb-4">
              Lỗi tải dữ liệu
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="space-y-2">
          {!isLoading && !isError && data.length > 0
            ? data
                .filter((item: any) => !item.parentId)
                .map((parent: CategoriesType) => renderCategory(parent))
            : !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-2xl text-gray-500">Chưa có danh mục nào</p>
                </div>
              )}
        </div>
      </div>

      {openAction && (
        <ActionCategory
          setOpenAction={setOpenAction}
          openAction={openAction}
          refetch={refetch}
          dataUpdate={openAction.action === "add" ? undefined : dataUpdate}
          parents={data}
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
