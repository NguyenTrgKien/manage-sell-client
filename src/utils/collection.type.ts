import type { ProductT } from "./types";

export const CollectionType = {
  AUTO: "auto",
  MANUAL: "manual",
};

export type CollectionType =
  (typeof CollectionType)[keyof typeof CollectionType];

export const CollectionStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type CollectionStatus =
  (typeof CollectionStatus)[keyof typeof CollectionStatus];

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  publicId: string;
  type: CollectionType;
  status: CollectionStatus;
  isFeature: boolean;
  viewCount: number;
  startDate?: string;
  endDate?: string;
  collectionProducts: CollectionProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionProduct {
  id: number;
  collectionId: number;
  productId: number;
  sortOrder: number;
  isFeatured: boolean;
  specialPrice?: number;
  collection: Collection;
  product: ProductT;
  createdAt: string;
  updatedAt: string;
}
