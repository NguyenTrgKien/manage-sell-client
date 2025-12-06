import type { OrderStatus } from "@my-project/shared";
import axiosConfig from "../configs/axiosConfig";

export const ordersForAdmin = async (filter: {
  searchOrder: string;
  status: string;
}) => {
  const params: Record<string, string> = {};
  if (filter.searchOrder) {
    params.searchOrder = filter.searchOrder;
  }

  if (filter.status) {
    params.status = filter.status;
  }

  const res = await axiosConfig.get("/api/v1/orders/orders-for-admin", {
    params: params,
  });
  return res.data;
};

export const getOrders = async (queryOrders: any) => {
  const res = await axiosConfig.get("/api/v1/orders/get-orders", {
    params: queryOrders,
  });
  return res.data;
};
