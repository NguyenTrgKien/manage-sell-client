import { StaffPosition, StaffStatus, UserRole } from "@my-project/shared";

export const getStaffPosition = {
  [StaffPosition.INVENTORY]: "Quản lý kho",
  [StaffPosition.MANAGER]: "Quản lý",
  [StaffPosition.SALE]: "Bán hàng",
};

export const getUserRole = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.STAFF]: "Nhân viên",
  [UserRole.USER]: "Khách hàng",
};

export const getStaffStatus = {
  [StaffStatus.ACTIVE]: "Đang làm việc",
  [StaffStatus.ON_LEAVE]: "Tạm nghĩ",
  [StaffStatus.PROBATION]: "Đang thử việc",
  [StaffStatus.RESIGNED]: "Đã nghĩ",
};
