import type { VoucherStatus } from "@my-project/shared";
import axiosConfig from "../configs/axiosConfig";

export const getVouchers = async (queryVoucher?: {
  name: string;
  voucherCode: string;
  status: VoucherStatus | null;
}) => {
  let query = null;
  if (queryVoucher) {
    query = Object.values(queryVoucher).filter((v) => v !== "");
  }
  const res = await axiosConfig.get("/api/v1/voucher/get-vouchers", {
    ...(queryVoucher && query ? { params: query.join("/") } : {}),
  });
  return res;
};

export const getSavedVouchers = async () => {
  const res = await axiosConfig.get(`/api/v1/voucher/get-saved-voucher`);
  return res;
};
