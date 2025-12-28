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

export const lookup = async (orderCode: string) => {
  const res = await axiosConfig.get(`/api/v1/orders/lookup/${orderCode}`, {
    params: { orderCode },
  });
  return res.data;
};

export const loadGuestOrdersAPI = async () => {
  const guestOrderCodes = JSON.parse(
    localStorage.getItem("guest_orders") || "[]"
  );

  if (guestOrderCodes.length === 0) {
    return [];
  }

  const dataQuery = JSON.stringify(guestOrderCodes);
  const res = await axiosConfig.get(`/api/v1/orders/lookup/guest-orders`, {
    params: {
      dataQuery,
    },
  });

  if (res.data.length === 0) {
    localStorage.removeItem("guest_orders");
  }

  return res.data;
};
