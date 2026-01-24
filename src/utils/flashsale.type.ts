import type { flashSaleStatus } from "@nguyentrungkien/shared";
import type { ProductT } from "./types";

export interface FlashSale {
  id: number;
  name: string;
  description: string;
  bannerImage: string;
  status: flashSaleStatus;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  flashSaleProduct: FlashSaleProduct[];
}

export interface FlashSaleProduct {
  id: number;
  sale_price: number;
  origin_price: number;
  stock: number;
  sold: number;
  limit: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ProductT;
  flashSale: FlashSale;
}
