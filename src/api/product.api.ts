import axiosConfig from "../configs/axiosConfig";

export const getProduct = async (queryProduct: any) => {
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
