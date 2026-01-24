import { AxiosError } from "axios";
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
  try {
    if (!slugs || slugs.length === 0) {
      throw new Error("Slugs phải là một mảng!");
    }

    const validSlugs = slugs.filter(
      (slug) => slug && typeof slug === "string" && slug.trim().length > 0,
    );

    if (validSlugs.length === 0) {
      throw new Error("Slugs không hợp lệ!");
    }

    const slugsPath = validSlugs.join("/");

    const res = await axiosConfig.get(
      `/api/v1/category/get-category-by-slugs`,
      {
        params: { slugs: slugsPath },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Lấy dữ liệu thất bại!",
        );
      } else if (error.request) {
        throw new Error(
          "Không có kết nối mạng. Vui lòng kiểm tra kết nối của bạn!",
        );
      }
    }

    throw error;
  }
};
