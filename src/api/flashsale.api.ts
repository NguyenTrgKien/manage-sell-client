import axiosConfig from "../configs/axiosConfig";

export const getFlashsales = async (query: {
  limit: number;
  page: number;
  name?: string;
  status?: string;
}) => {
  const request = Object.fromEntries(
    Object.entries(query).filter(([_, value]) => {
      return value !== null && value !== "";
    }),
  );
  const res = await axiosConfig.get("/api/v1/flashsale/data", {
    params: request,
  });
  return res;
};

export const getFlashsaleBySlug = async (slug: string) => {
  const res = await axiosConfig.get(`/api/v1/flashsale/${slug}`);
  return res;
};

export const getFlashsaleById = async (flashSaleId: number) => {
  const res = await axiosConfig.get(`/api/v1/flashsale/${flashSaleId}`);
  return res;
};

export const getFlashSaleForProduct = async (slug: string) => {
  const res = await axiosConfig.get(`/api/v1/flashsale/for-product/${slug}`);
  return res;
};
