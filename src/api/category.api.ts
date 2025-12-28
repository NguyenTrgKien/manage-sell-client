import axiosConfig from "../configs/axiosConfig";

export const getCategory = async ({ queryKey }: any) => {
  const [_, filter] = queryKey;
  const params: any = {};
  if (filter.categoryName) params.categoryName = filter.categoryName;
  if (filter.isActive && filter.isActive !== "all") {
    params.isActive = filter.isActive === "true";
  }
  const res = await axiosConfig.get(`/api/v1/category/get-categories`, {
    params: params,
  });
  return res.data;
};

export const getAllCategory = async () => {
  const res = await axiosConfig.get("/api/v1/category/get-all-category");
  return res.data;
};

export const getCategoryBySlugs = async (slugs: string[]) => {
  const slugsPath = slugs.join("/");
  const res = await axiosConfig.get(`/api/v1/category/get-category-by-slugs`, {
    params: { slugs: slugsPath },
  });
  return res.data;
};
