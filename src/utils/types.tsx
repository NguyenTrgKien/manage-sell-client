export interface ProductT {
  id: number;
  productName: string;
  price: number;
  description: string;
  mainImage: string;
  inventory: number;
  category: CategoriesType;
  publicId: number;
  listImageProduct: ImageProduct[];
  variants: VariantsType[];
  isActive: boolean;
  reviewCount?: number;
  averageRating: number;
  soldCount: number;
  slug: string;
}

interface ImageProduct {
  id: number;
  imageUrl: string;
}

export interface CategoriesType {
  id: number;
  categoryName: string;
  isActive: boolean;
  parent: CategoriesType;
  createdAt: string;
  updatedAt: string;
  image: string;
  slug: string;
  children: CategoriesType[];
}

export interface VariantsType {
  id: number;
  variantColor: VariantColorType;
  variantSize: VariantSizeType;
  price?: number;
  inventory: number;
  product: ProductT;
}

export interface VariantColorType {
  id: number;
  name: string;
  hexCode: string;
  sortOrder: number;
}

export interface VariantSizeType {
  id: number;
  name: string;
  sortOrder: number;
}
