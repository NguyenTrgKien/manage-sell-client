import axiosConfig from "../configs/axiosConfig";
import type { BannerPosition, BannerStatus } from "../utils/ui.type";

export const getListBanner = async (
  position?: BannerPosition,
  activeStatus?: BannerStatus,
  isSearch?: string,
) => {
  const res = await axiosConfig.get(`/api/v1/banner/list-banner`, {
    params: {
      search: isSearch,
      ...(activeStatus && { status: activeStatus }),
      ...(position && { position: position }),
    },
  });
  return res;
};
