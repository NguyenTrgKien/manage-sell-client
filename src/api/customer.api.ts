import axiosConfig from "../configs/axiosConfig";

export const getCustomers = async (dataQuery: {
  keyword?: string;
  limit: number;
  page: number;
  state?: "NO_ORDER" | "PURCHASED" | "REGISTERED" | "GUEST";
}) => {
  const query = Object.fromEntries(
    Object.entries(dataQuery).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );
  console.log(query);

  const res = await axiosConfig.get("/api/v1/customer/get-customer", {
    params: query,
  });
  return res;
};

export const getCustomerById = async (customerCode: string) => {
  const res = await axiosConfig.get(`/api/v1/customer/by-id/${customerCode}`);
  return res.data;
};

export const getGuestCustomers = async (dataQuery: {
  keyword?: string;
  limit: number;
  page: number;
}) => {
  const query = Object.fromEntries(
    Object.entries(dataQuery).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );

  const res = await axiosConfig.get("/api/v1/orders/guests", {
    params: query,
  });
  return res;
};

export const getGuestByEmail = async (guestEmail: string) => {
  const res = await axiosConfig.get(`/api/v1/orders/guest-by-email`, {
    params: { guestEmail },
  });
  return res.data;
};

export const getStatisticGuest = async (queryStatistic: {
  startDate: string;
  endDate: string;
  groupBy: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryStatistic).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );
  const res = await axiosConfig.get(`/api/v1/orders/statistic-guest`, {
    params: query,
  });
  return res;
};

export const getGuestTop = async (queryGuestTop: {
  startDate: string;
  endDate: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryGuestTop).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );

  const res = await axiosConfig.get(
    `/api/v1/orders/statistic-guest/top-guest`,
    {
      params: query,
    }
  );
  return res.data;
};

export const getStatistic = async (queryStatistic: {
  startDate: string;
  endDate: string;
  groupBy: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryStatistic).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );
  const res = await axiosConfig.get(`/api/v1/customer/statistic`, {
    params: query,
  });
  return res;
};

export const getCustomerTop = async (queryGuestTop: {
  startDate: string;
  endDate: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryGuestTop).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );

  const res = await axiosConfig.get(`/api/v1/customer/statistic/top-customer`, {
    params: query,
  });
  return res.data;
};
