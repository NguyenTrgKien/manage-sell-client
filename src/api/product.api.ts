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
  return res.data;
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

export const getProductDetail = async (id: number) => {
  console.log(id);

  const res = await axiosConfig.get(`/api/v1/product/detail/${id}`);
  return res;
};
