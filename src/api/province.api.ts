import axiosConfig from "../configs/axiosConfig";
import type { ProvinceType } from "../utils/province";

export const getProvince = async (): Promise<ProvinceType[]> => {
  const res = (await axiosConfig.get(
    "/api/v1/province/get-province"
  )) as ProvinceType[];
  return res;
};
