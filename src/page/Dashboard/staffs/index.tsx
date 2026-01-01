import {
  faAdd,
  faEllipsisVertical,
  faEye,
  faFilter,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { StaffType } from "../../../utils/userType";
import { useQuery } from "@tanstack/react-query";
import { getStaffs } from "../../../api/user.api";
import {
  getStaffPosition,
  getStaffStatus,
} from "../../../configs/staffEnumConfig";
import ActionStaff from "./ActionStaff";
import DeleteStaff from "./DeleteStaff";
import ViewStaffDetail from "./DetailStaff";

function Staffs() {
  const [filter, setFilter] = useState<{
    search: string;
    status: string;
    position: string;
    limit: 10;
    page: 1;
  }>({
    search: "",
    status: "",
    position: "",
    limit: 10,
    page: 1,
  });
  const [queryInput, setQueryInput] = useState<{
    search: string;
    status: string;
    position: string;
    limit: 10;
    page: 1;
  }>({ search: "", status: "", position: "", limit: 10, page: 1 });
  const [actionStaff, setActionStaff] = useState<{
    action: "add" | "edit";
    open: boolean;
    data: null | StaffType;
  }>({
    action: "add",
    open: false,
    data: null,
  });
  const [selectOptions, setSelectOptions] = useState<StaffType | null>(null);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);
  const [viewStaff, setViewStaff] = useState<StaffType | null>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["staffs", filter],
    queryFn: () => getStaffs(filter),
  });

  useEffect(() => {
    if (!selectOptions) {
      return;
    }
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        selectOptions !== null &&
        optionRef.current &&
        !optionRef.current.contains(event.target as Node)
      ) {
        setSelectOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [selectOptions]);

  const handleAppliedFilter = () => {
    setFilter((prev) => ({
      ...prev,
      search: queryInput.search,
      status: queryInput.status,
      limit: queryInput.limit,
      page: queryInput.page,
      position: queryInput.position,
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] bg-white shadow-lg rounded-xl p-[2rem]">
      <div className="sticky top-0 flex justify-between items-center border-b border-b-gray-300 pb-8">
        <h3 className="text-[2rem] font-semibold text-gray-600">
          Danh sách nhân viên
        </h3>
        <div className="flex items-center gap-[1.5rem]">
          <button
            className="text-white text-[1.4rem] flex gap-[.5rem] items-center px-4 py-3 bg-[var(--button-green)] rounded-lg hover:bg-[var(--button-green-hover)] cursor-pointer hover-linear"
            onClick={() =>
              setActionStaff({ open: true, data: null, action: "add" })
            }
          >
            <FontAwesomeIcon icon={faAdd} />
            <p>Thêm nhân viên</p>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-[1.5rem] mt-[2rem]">
        <input
          type="text"
          id="search"
          name="search"
          value={queryInput.search}
          placeholder="Nhập tìm kiếm (tên, sđt)..."
          className="border border-gray-300 w-[36rem] h-[4rem] rounded-lg pl-[1.5rem] outline-none text-gray-600 select-none"
          onChange={(e) =>
            setQueryInput((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
        />
        <select
          name="status"
          id="status"
          value={queryInput.status}
          className="max-w-26rem h-[4rem] border border-gray-300 outline-none px-[1.5rem] text-gray-600 rounded-lg select-none"
          onChange={(e) =>
            setQueryInput((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
        >
          <option value="" hidden>
            Trạng thái
          </option>
          {Object.entries(getStaffStatus).map(([key, value]) => {
            return (
              <option value={key} key={key}>
                {value}
              </option>
            );
          })}
        </select>
        <select
          name="position"
          id="position"
          value={queryInput.position}
          className="max-w-26rem h-[4rem] border border-gray-300 outline-none px-[1.5rem] text-gray-600 rounded-lg select-none"
          onChange={(e) =>
            setQueryInput((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
        >
          <option value="" hidden>
            Vị trí
          </option>
          {Object.entries(getStaffPosition).map(([key, value]) => {
            return (
              <option value={key} key={key}>
                {value}
              </option>
            );
          })}
        </select>

        <button
          className="flex items-center justify-center gap-[.5rem] w-[10rem] h-[4rem] rounded-lg bg-[var(--main-button)] hover:bg-[var(--main-button-hover)] text-white"
          onClick={() => handleAppliedFilter()}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>Lọc</span>
        </button>
      </div>
      <table className="w-full border border-gray-300 mt-[2rem] text-[1.4rem] select-none">
        <thead>
          <tr className="bg-gray-50 divide-x divide-gray-300">
            <th className="text-start px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              STT
            </th>
            <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              Họ tên
            </th>
            <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              Điện thoại
            </th>
            <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              Vị trí
            </th>
            <th className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              Trạng thái
            </th>
            <th className="text-end px-[1.5rem] py-[1rem] border border-gray-300 font-semibold text-gray-600">
              Hành động
            </th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-[4rem] text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data.map((staff: StaffType) => {
              return (
                <tr
                  key={staff.id}
                  className="divide-x divide-gray-300 hover:bg-gray-50"
                >
                  <td className="text-start px-[1.5rem] py-[1rem] border border-gray-300">
                    {staff.staffCode}
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300">
                    {staff.user?.username}
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300">
                    {staff.user?.phone}
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-medium">
                    {getStaffPosition[staff.position]}
                  </td>
                  <td className="text-center px-[1.5rem] py-[1rem] border border-gray-300 font-medium">
                    {getStaffStatus[staff.status]}
                  </td>
                  <td className="text-end px-[1.5rem] py-[1rem] border border-gray-300 font-medium">
                    <div className="flex justify-end items-center gap-[1rem]">
                      <button
                        className="w-[7.4rem] h-[3.2rem] text-[1.2rem] rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-[.5rem] hover-linear"
                        onClick={() => setViewStaff(staff)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        <span>Xem</span>
                      </button>
                      <div className="relative z-[200]" ref={optionRef}>
                        <button
                          className="w-[3.2rem] h-[3.2rem] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 hover-linear"
                          onClick={() => setSelectOptions(staff)}
                        >
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            className="text-[1.8rem]"
                          />
                        </button>
                        {selectOptions?.id === staff.id && (
                          <div className="absolute right-[100%] top-0  min-w-[12rem] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-xl py-[.8rem] border border-gray-200">
                            <button
                              className="w-full px-[1.2rem] py-[.8rem] flex items-center gap-[.8rem] text-left hover:bg-gray-100 hover-linear text-[1.4rem] text-gray-700"
                              onClick={() => {}}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                className="text-green-600"
                              />
                              <span
                                className="text-green-600"
                                onClick={() => {
                                  setActionStaff({
                                    open: true,
                                    data: selectOptions,
                                    action: "edit",
                                  });
                                  setSelectOptions(null);
                                }}
                              >
                                Cập nhật
                              </span>
                            </button>
                            <button
                              className="w-full px-[1.2rem] py-[.8rem] flex whitespace-nowrap items-center gap-[.8rem] text-left hover:bg-gray-100 hover-linear text-[1.4rem] text-gray-700"
                              onClick={() => {
                                setOpenDelete(staff.id);
                                setSelectOptions(null);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className="text-red-500"
                              />
                              <span className="text-red-500 flex flex-nowrap">
                                Xóa
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      <ActionStaff
        actionStaff={actionStaff}
        setActionStaff={setActionStaff}
        dataUpdate={actionStaff.data}
        refetch={refetch}
      />
      {openDelete && (
        <DeleteStaff
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />
      )}

      <ViewStaffDetail staff={viewStaff} onClose={() => setViewStaff(null)} />
    </div>
  );
}

export default Staffs;
