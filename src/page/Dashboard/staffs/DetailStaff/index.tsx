import {
  faXmark,
  faUser,
  faBriefcase,
  faMapMarkerAlt,
  faClock,
  faPhone,
  faEnvelope,
  faBirthdayCake,
  faVenusMars,
  faIdCard,
  faCalendarAlt,
  faDollarSign,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { StaffType } from "../../../../utils/userType";
import {
  getStaffPosition,
  getStaffStatus,
} from "../../../../configs/staffEnumConfig";
import { StaffStatus } from "@my-project/shared";
import MotionWrapper from "../../../../components/ui/MotionWrapper";

interface ViewStaffDetailProps {
  staff: StaffType | null;
  onClose: () => void;
}

function ViewStaffDetail({ staff, onClose }: ViewStaffDetailProps) {
  if (!staff) return null;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getGenderText = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      MALE: "Nam",
      FEMALE: "Nữ",
      OTHER: "Khác",
    };
    return genderMap[gender] || gender;
  };

  return (
    <MotionWrapper
      open={!!staff}
      className="fixed inset-0 flex items-center justify-center z-[300] p-[2rem]"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90rem] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative bg-gradient-to-r px-[3rem] py-[2rem]">
          <div>
            <h2 className="text-[2rem] font-bold text-gray-600 mb-[.5rem]">
              Thông tin chi tiết nhân viên
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-[1rem] right-[1rem] w-[4rem] h-[4rem] bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-600 hover-linear backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[2rem]" />
          </button>
        </div>

        <div className="overflow-y-auto hide-scrollbar flex-1 px-[3rem] pt-[2rem]">
          <div className="grid grid-cols-12 gap-[2.5rem]">
            <div className="col-span-4 space-y-[2rem]">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-[2.5rem] border border-indigo-100 text-center">
                <div className="w-[16rem] h-[16rem] mx-auto mb-[2rem] rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[6rem] font-bold shadow-lg">
                  {staff.user?.avatar ? (
                    <img
                      src={staff.user.avatar}
                      alt={`avatar`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    staff.user?.username?.charAt(0).toUpperCase() || "?"
                  )}
                </div>
                <h3 className="text-[2.2rem] font-bold text-gray-800 mb-[.5rem]">
                  {staff.user?.username || "Chưa cập nhật"}
                </h3>
                <p className="text-[1.4rem] text-gray-500 mb-[1.5rem]">
                  {getStaffPosition[staff.position] || "Chưa cập nhật"}
                </p>
                <span
                  className={`inline-flex items-center gap-[.8rem] px-[1.6rem] py-[.8rem] rounded-full text-[1.4rem] font-semibold ${
                    staff.status === StaffStatus.ACTIVE
                      ? "bg-green-100 text-green-700"
                      : staff.status === StaffStatus.RESIGNED
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {getStaffStatus[staff.status] || "Chưa cập nhật"}
                </span>
              </div>

              <div className="bg-white rounded-2xl p-[2rem] border border-gray-200 shadow-sm">
                <h4 className="text-[1.4rem] font-semibold text-gray-700 mb-[1.5rem] flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="text-indigo-600"
                  />
                  Thống kê nhanh
                </h4>
                <div className="space-y-[1.2rem]">
                  <div className="flex justify-between items-center py-[1rem] border-b border-gray-100">
                    <span className="text-[1.4rem] text-gray-600">
                      Lương cơ bản
                    </span>
                    <span className="text-[1.5rem] font-bold text-green-600">
                      {formatCurrency(staff.salary)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-[1rem] border-b border-gray-100">
                    <span className="text-[1.4rem] text-gray-600">
                      Ngày bắt đầu
                    </span>
                    <span className="text-[1.4rem] font-semibold text-gray-800">
                      {formatDate(staff.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-[1rem]">
                    <span className="text-[1.4rem] text-gray-600">
                      Thời gian làm việc
                    </span>
                    <span className="text-[1.4rem] font-semibold text-gray-800">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(staff.startDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}{" "}
                      tháng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-8 space-y-[2rem]">
              <div className="bg-white rounded-2xl p-[2.5rem] border border-gray-200 shadow-sm">
                <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem] pb-[1rem] border-b-2 border-gray-200 flex items-center gap-[1rem]">
                  <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-2 gap-x-[3rem] gap-y-[2rem]">
                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faIdCard}
                        className="text-[1.8rem] text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Mã nhân viên
                      </label>
                      <p className="text-[1.4rem] text-gray-900 font-semibold">
                        {staff.staffCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-[1.8rem] text-purple-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Họ và tên
                      </label>
                      <p className="text-[1.4rem] text-gray-900 font-semibold">
                        {staff.user?.username || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-[1.8rem] text-green-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Số điện thoại
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {staff.user?.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-[1.8rem] text-red-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Email
                      </label>
                      <p className="text-[1.4rem] text-gray-900 break-all">
                        {staff.user?.email || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faVenusMars}
                        className="text-[1.8rem] text-pink-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Giới tính
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {getGenderText(staff.gender)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faBirthdayCake}
                        className="text-[1.8rem] text-yellow-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Ngày sinh
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {formatDate(staff.birthday)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-[2.5rem] border border-gray-200 shadow-sm">
                <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem] pb-[1rem] border-b-2 border-gray-200 flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="text-purple-600"
                  />
                  Thông tin công việc
                </h3>
                <div className="grid grid-cols-2 gap-x-[3rem] gap-y-[2rem]">
                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="text-[1.8rem] text-indigo-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Vị trí
                      </label>
                      <p className="text-[1.4rem] text-gray-900 font-semibold">
                        {getStaffPosition[staff.position] || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-[1.8rem] text-green-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Trạng thái
                      </label>
                      <span
                        className={`inline-block px-[1.2rem] py-[.6rem] rounded-lg text-[1.4rem] font-semibold ${
                          staff.status === StaffStatus.ACTIVE
                            ? "bg-green-100 text-green-700"
                            : staff.status === StaffStatus.RESIGNED
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {getStaffStatus[staff.status] || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-[1.8rem] text-green-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Lương cơ bản
                      </label>
                      <p className="text-[1.8rem] text-green-600 font-bold">
                        {formatCurrency(staff.salary)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-[1.8rem] text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Ngày bắt đầu làm việc
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {formatDate(staff.startDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {staff.user && (
                <div className="bg-white rounded-2xl p-[2.5rem] border border-gray-200 shadow-sm">
                  <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem] pb-[1rem] border-b-2 border-gray-200 flex items-center gap-[1rem]">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-orange-600"
                    />
                    Địa chỉ
                  </h3>
                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-[1.8rem] text-orange-600"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[1.4rem] text-gray-900 leading-relaxed">
                        {staff.address || "Chưa cập nhật địa chỉ"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-[2.5rem] border border-gray-200 mb-[2rem]">
                <h3 className="text-[1.8rem] font-bold text-gray-600 mb-[2rem] pb-[1rem] border-b-2 border-gray-200 flex items-center gap-[1rem]">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                  Thông tin hệ thống
                </h3>
                <div className="grid grid-cols-2 gap-x-[3rem] gap-y-[2rem]">
                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-[1.8rem] text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Ngày tạo
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {formatDate(staff.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[1.5rem]">
                    <div className="w-[4rem] h-[4rem] rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-[1.8rem] text-purple-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[1.3rem] text-gray-500 font-medium block mb-[.5rem]">
                        Ngày cập nhật
                      </label>
                      <p className="text-[1.4rem] text-gray-900">
                        {formatDate(staff.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[3rem] py-[1rem] bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex justify-end gap-[1.5rem]">
          <button
            onClick={onClose}
            className="px-[2rem] py-[.8rem] text-[1.5rem] font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover-linear shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}

export default ViewStaffDetail;
