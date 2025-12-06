import axiosConfig from "../configs/axiosConfig";

type dataQuery = {
  search: string;
  status: string;
  position: string;
  limit: 10;
  page: 1;
};

export const getStaffs = async (dataQuery: dataQuery) => {
  const query = Object.fromEntries(
    Object.entries(dataQuery).filter(([_, value]) => {
      return value !== null && value !== "";
    })
  );
  const res = await axiosConfig.get("/api/v1/staff/get-staffs", {
    params: query,
  });
  return res.data;
};

export const getCart = async () => {
  const res = await axiosConfig.get("/api/v1/cart/my-cart");
  return res.data;
};

export const getVariantByIds = async (variantIds: number[]) => {
  const res = await axiosConfig.post("/api/v1/variant/variant-by-ids", {
    variantIds,
  });
  return res;
};
