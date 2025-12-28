import type { VoucherStatus, VoucherType } from "@nguyentrungkien/shared";
import type { UserType } from "./userType";

export interface VoucherT {
  id: number;
  voucherCode: string;
  name: string;
  value: number;
  type: VoucherType;
  maxDiscount: number;
  minOrderValue: number;
  endDate: string;
  startDate: string;
  usageLimit: number;
  isGlobal: string;
  usedCount: number;
  status: VoucherStatus;
  user: UserType[];
  createdAt: string;
  updatedAt: string;
}
