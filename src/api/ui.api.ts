import axiosConfig from "../configs/axiosConfig";

export const getListBanner = async (
  isSearch?: string,
  active?: "active" | "inactive"
) => {
  const res = await axiosConfig.get(`/api/v1/banner/list-banner`, {
    params: {
      search: isSearch,
      active: active,
    },
  });
  return res.data;
};
