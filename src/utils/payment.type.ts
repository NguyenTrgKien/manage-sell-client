import type {
  PaymentMethod,
  PaymentStatus,
  User,
} from "@nguyentrungkien/shared";
import type { OrderType } from "../page/Dashboard/order/ListOrders";

export interface PaymentType {
  id: number;
  paymentCode: string;
  order: OrderType;
  user: User;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  provider: string;
  transactionId: string;
  failReason: string;
  providerOrderId: string;
  refundReason: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
