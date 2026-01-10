import axiosConfig from "../configs/axiosConfig";

export const getProduct = async ({ queryKey }: { queryKey: any }) => {
  const [, queryProduct] = queryKey;

  const filterParams = Object.fromEntries(
    Object.entries(queryProduct).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );
  const res = await axiosConfig.get("/api/v1/product/get-product", {
    params: filterParams,
  });
  return res;
};

export const getVariants = async () => {
  const res = await axiosConfig.get("/api/v1/variant-size/get-variant");
  return res.data;
};

export const getVariantSize = async () => {
  const res = await axiosConfig.get("/api/v1/variant-size/get-size");
  return res.data;
};

export const getVariantColor = async () => {
  const res = await axiosConfig.get("/api/v1/variant-color/get-color");
  return res.data;
};

export const getPopular = async (queryDefault: {
  limit: number;
  page: number;
}) => {
  const res = await axiosConfig.get("/api/v1/product/get-popular", {
    params: queryDefault,
  });
  return res;
};

export const getProductDetail = async (productSlug: string | undefined) => {
  const res = await axiosConfig.get(`/api/v1/product/detail/${productSlug}`);

  return res;
};

export const getEvaluate = async ({
  productId,
  rating,
  page,
  sort,
}: {
  productId: number;
  rating: number | "all";
  page: number;
  sort: "newest" | "oldest";
}) => {
  const res = await axiosConfig.get(
    `/api/v1/evaluate/get-evaluate/${productId}`,
    {
      params: { rating, page, sort, limit: 20 },
    }
  );
  return res;
};

export const getProductByCategorySlugs = async (
  slugs: string[],
  queryDefault: { page: number; limit: number; price: "asc" | "desc" }
) => {
  const res = await axiosConfig.get(`/api/v1/product/by-slugs`, {
    params: {
      slugs: slugs.join("/"),
      ...queryDefault,
    },
  });
  return res;
};

export const getChildOfCate = async (currentSlug: string) => {
  const res = await axiosConfig.get(`/api/v1/product/child-of-cate`, {
    params: {
      currentSlug: currentSlug,
    },
  });
  return res;
};
