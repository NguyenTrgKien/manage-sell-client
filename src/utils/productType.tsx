import type { VariantsType } from "./types";
import type { UserType } from "./userType";

export interface CartType {
  id: number;
  user: UserType;
  items: CartItemType[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  id: number;
  cart: CartType;
  variant: VariantsType;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluateType {
  id: number;
  message: string;
  rating: number;
  images: string[];
  publicIds: string[];
  showAccount: boolean;
  user: UserType;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}
