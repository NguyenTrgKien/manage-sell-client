import axiosConfig from "../configs/axiosConfig";

export const getDashboardOverview = async (queryOverview: {
  startDate: string;
  endDate: string;
  groupBy: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryOverview).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );

  const res = await axiosConfig.get("/api/v1/orders/dashboard-overview", {
    params: query,
  });
  return res.data;
};

export const getDashboardStatistic = async (queryDashboardStatistic: {
  startDate: string;
  endDate: string;
  groupBy: string;
}) => {
  const query = Object.fromEntries(
    Object.entries(queryDashboardStatistic).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );
  const res = await axiosConfig.get("/api/v1/orders/dashboard-statistics", {
    params: query,
  });
  return res.data;
};
