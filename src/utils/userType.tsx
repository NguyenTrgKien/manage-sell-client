import type {
  Gender,
  MemberRank,
  StaffPosition,
  StaffStatus,
  UserRole,
} from "@my-project/shared";
import type { OrderType } from "../page/Dashboard/order/ListOrders";

export interface UserType {
  id: number;
  username: string;
  email: string;
  phone: number;
  avatar: string;
  publicId: string;
  role: UserRole;
  refresh_token: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  orders: OrderType[];
  customer: CustomerType;
  staff: StaffType;
  address: AddressType[];
}

export interface AddressType {
  id: number;
  user: UserType;
  recipentName: string;
  province: string;
  district: string;
  ward: string;
  phone: number;
  addressDetail: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffType {
  id: number;
  staffCode: string;
  gender: Gender;
  birthday: string;
  salary: number;
  startDate: string;
  status: StaffStatus;
  position: StaffPosition;
  address: string;
  user: UserType;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerType {
  id: number;
  fullName: string;
  gender: Gender;
  birthday: string;
  ward: string;
  district: string;
  province: string;
  memberRank: MemberRank;
  createdAt: string;
  updatedAt: string;
}
