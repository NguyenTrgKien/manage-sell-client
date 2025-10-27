import axiosConfig from "../configs/axiosConfig";

export const getCategory = async ({ queryKey }: any) => {
  const [_, filter] = queryKey;
  const res = await axiosConfig.get("/api/v1/category/get-categories", {
    params: filter,
  });
  return res.data;
};

export const getAllCategory = async () => {
  const res = await axiosConfig.get("/api/v1/category/get-all-category");
  return res.data;
};
