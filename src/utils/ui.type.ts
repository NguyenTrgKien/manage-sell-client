export interface BannerType {
  id: number;
  title?: string;
  subTitle?: string;
  redirectType: BannerRedirectType;
  position: BannerPosition;
  targetSlug?: string;
  targetInfo: {
    name: string;
    slug: string;
    image: string;
  };
  imageUrl: string;
  sortOrder: number;
  status: BannerStatus;
  publicId: string;
  clickCount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const BannerRedirectType = {
  PRODUCT: "product",
  CATEGORY: "category",
  COLLECTION: "collection",
  FLASH_SALE: "flash_sale",
};

export type BannerRedirectType =
  (typeof BannerRedirectType)[keyof typeof BannerRedirectType];

export const BannerPosition = {
  HOME_SLIDER: "home_slider",
  HOME_TOP: "home_top",
  CATEGORY_TOP: "category_top",
};

export type BannerPosition =
  (typeof BannerPosition)[keyof typeof BannerPosition];

export const BannerStatus = {
  ACTIVE: "active",
  PAUSED: "paused",
  EXPIRED: "expired",
};

export type BannerStatus = (typeof BannerStatus)[keyof typeof BannerStatus];
