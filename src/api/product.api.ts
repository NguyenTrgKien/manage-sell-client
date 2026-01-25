import axiosConfig from "../configs/axiosConfig";

export const getProduct = async ({ queryKey }: { queryKey: any }) => {
  const [, queryProduct] = queryKey;

  const filterParams = Object.fromEntries(
    Object.entries(queryProduct).filter(
      ([_, value]) => value !== null && value !== "",
    ),
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

export const getBestSell = async (queryDefault: {
  limit: number;
  page: number;
}) => {
  const { limit, page } = queryDefault;
  const res = await axiosConfig.get("/api/v1/product/best-sell", {
    params: { limit, page },
  });
  return res;
};

export const getProductDetail = async (productSlug: string | undefined) => {
  const res = await axiosConfig.get(`/api/v1/product/detail/${productSlug}`);
  return res;
};

export const getProductDetailForAdmin = async (id: number) => {
  const res = await axiosConfig.get(`/api/v1/product/admin/detail/${id}`);
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
    },
  );
  return res;
};

export const getProductByCategorySlugs = async (
  slugs: string[],
  queryDefault: { page: number; limit: number; price: "asc" | "desc" },
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

export const getRecentSearch = async (sessionId: string, userId: number) => {
  const params: any = {};
  if (!userId && sessionId) {
    params.session_id = sessionId;
  }
  const res = await axiosConfig.get(`/api/v1/search/recent`, {
    params: params,
  });
  return res;
};

export const getProducts = async ({
  query,
  userId,
}: {
  query: {
    limit: number;
    page: number;
    productName?: string;
    sort: "popular" | "latest" | "best_seller";
    price: "asc" | "desc";
  };
  userId?: number;
}) => {
  const filterParams = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => {
      if (userId && key === "session_id") return false;
      if (value === null || value === "") return false;
      return true;
    }),
  );

  const res = await axiosConfig.get(`/api/v1/product/search`, {
    params: filterParams,
  });
  return res;
};

export const getSortProducts = async ({
  query,
  userId,
}: {
  query: {
    limit: number;
    page: number;
    sort: "popular" | "latest" | "best_seller";
    price: "asc" | "desc";
  };
  userId?: number;
}) => {
  const filterParams = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => {
      if (userId && key === "session_id") return false;
      if (value === null) return false;
      return true;
    }),
  );

  const res = await axiosConfig.get(`/api/v1/product/sort`, {
    params: filterParams,
  });
  return res;
};
